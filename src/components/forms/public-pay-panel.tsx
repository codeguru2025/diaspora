"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Smartphone, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/field";
import { formatPrice } from "@/lib/format";
import { track } from "@/lib/analytics";

type Method = "ecocash" | "onemoney" | "innbucks" | "omari" | "visa_mastercard";

const METHODS: { key: Method; label: string; kind: "mobile" | "card" }[] = [
  { key: "ecocash", label: "EcoCash", kind: "mobile" },
  { key: "onemoney", label: "OneMoney", kind: "mobile" },
  { key: "innbucks", label: "InnBucks", kind: "mobile" },
  { key: "omari", label: "Omari", kind: "mobile" },
  { key: "visa_mastercard", label: "Visa / Mastercard", kind: "card" },
];

type Details = {
  status: string;
  amount: string;
  currency: string;
  policyNumber?: string | null;
  clientName?: string | null;
};

type Phase =
  | "loading"
  | "unavailable"
  | "gone"
  | "already_paid"
  | "choose"
  | "initiating"
  | "redirecting"
  | "awaiting_user"
  | "awaiting_otp"
  | "paid"
  | "failed";

/**
 * A public, tokenized payment page — no login. The token in the URL is the
 * only credential; there is no authenticated portal session involved, unlike
 * `PayNowPanel` (which this mirrors structurally) which requires one.
 */
export function PublicPayPanel({ token }: { token: string }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [details, setDetails] = useState<Details | null>(null);
  const [method, setMethod] = useState<Method>("ecocash");
  const [message, setMessage] = useState("");
  const [innbucksCode, setInnbucksCode] = useState<string | null>(null);
  const [innbucksExpiry, setInnbucksExpiry] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (pollTimer.current) clearTimeout(pollTimer.current);
    };
  }, []);

  useEffect(() => {
    fetch(`/api/pay/${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "We couldn't load this payment link.");
        return data as Details;
      })
      .then((data) => {
        setDetails(data);
        if (data.status === "paid") {
          setPhase("already_paid");
        } else if (data.status === "expired" || data.status === "cancelled" || data.status === "not_found") {
          setMessage(
            data.status === "not_found"
              ? "This payment link isn't valid."
              : data.status === "expired"
                ? "This payment link has expired — it's only valid for 48 hours. Please contact us for a new one."
                : "This payment link was cancelled.",
          );
          setPhase("gone");
        } else {
          setPhase("choose");
        }
      })
      .catch((e) => {
        setMessage(e instanceof Error ? e.message : "We couldn't load this payment link.");
        setPhase("unavailable");
      });
  }, [token]);

  const poll = useCallback(
    async (attempt = 0) => {
      try {
        const res = await fetch(`/api/pay/${token}/poll`, { method: "POST" });
        const data = await res.json();
        if (data.paid) {
          setPhase("paid");
          track({ name: "payment_completed" });
          return;
        }
        if (data.status === "failed" || data.status === "cancelled" || data.status === "expired") {
          setPhase("failed");
          setMessage(data.error || "The payment did not go through. Please try again.");
          return;
        }
      } catch {
        /* transient — keep polling */
      }
      if (attempt > 40) {
        setPhase("failed");
        setMessage("We didn't get confirmation in time. Check back shortly, or contact us.");
        return;
      }
      pollTimer.current = setTimeout(() => poll(attempt + 1), 4000);
    },
    [token],
  );

  async function initiate() {
    setPhase("initiating");
    setMessage("");
    track({ name: "payment_started" });
    try {
      const res = await fetch(`/api/pay/${token}/initiate`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ method }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "We couldn't start this payment.");

      if (data.redirectUrl) {
        setPhase("redirecting");
        window.location.href = data.redirectUrl;
        return;
      }
      if (data.needsOtp) {
        setPhase("awaiting_otp");
        setMessage("Enter the one-time code you were sent to confirm this payment.");
        return;
      }
      if (data.innbucksCode) {
        setInnbucksCode(data.innbucksCode);
        setInnbucksExpiry(data.innbucksExpiry ?? null);
      }
      setPhase("awaiting_user");
      setMessage(
        method === "innbucks"
          ? "Open your InnBucks app and authorise the payment with the code below."
          : "Check your phone — approve the payment prompt to continue.",
      );
      poll();
    } catch (e) {
      setPhase("failed");
      setMessage(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  }

  async function submitOtp(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch(`/api/pay/${token}/otp`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "That code didn't work.");
      if (data.paid) {
        setPhase("paid");
        track({ name: "payment_completed" });
      } else {
        setPhase("awaiting_user");
        setMessage("Check your phone for a payment prompt.");
        poll();
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "That code didn't work. Please try again.");
    }
  }

  const amount = details ? formatPrice(details.amount, details.currency) : null;

  if (phase === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-stone">
        <Loader2 className="size-4 animate-spin" /> Loading your payment…
      </div>
    );
  }

  if (phase === "unavailable" || phase === "gone") {
    return (
      <div className="rounded-xl border border-line bg-cream p-4 text-sm text-stone">
        {message || "This payment link isn't available right now."}
      </div>
    );
  }

  if (phase === "already_paid") {
    return (
      <div className="rounded-xl border border-sage/30 bg-sage/8 p-4">
        <CheckCircle2 className="size-6 text-sage" />
        <p className="mt-2 font-medium text-ink">This has already been paid.</p>
        {amount && <p className="text-sm text-stone">{amount} received. Thank you.</p>}
      </div>
    );
  }

  if (phase === "paid") {
    return (
      <div className="rounded-xl border border-sage/30 bg-sage/8 p-4">
        <CheckCircle2 className="size-6 text-sage" />
        <p className="mt-2 font-medium text-ink">Payment received</p>
        {amount && <p className="text-sm text-stone">{amount} paid. Thank you.</p>}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <p className="text-sm text-stone">Amount due</p>
      <p className="text-2xl font-semibold text-ink">{amount}</p>
      {details?.policyNumber && <p className="mt-1 text-xs text-mist">Policy {details.policyNumber}</p>}

      {(phase === "choose" || phase === "failed") && (
        <div className="mt-4">
          <p className="text-sm font-medium text-ink">Choose how to pay</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {METHODS.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setMethod(m.key)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                  method === m.key ? "border-champagne bg-champagne/5" : "border-line"
                }`}
              >
                {m.kind === "mobile" ? <Smartphone className="size-4" /> : <CreditCard className="size-4" />}
                {m.label}
              </button>
            ))}
          </div>

          {phase === "failed" && message && <p className="mt-3 text-sm text-terracotta">{message}</p>}

          <Button type="button" className="mt-4 w-full" onClick={initiate}>
            Pay {amount}
          </Button>
        </div>
      )}

      {(phase === "initiating" || phase === "redirecting") && (
        <p className="mt-4 flex items-center gap-2 text-sm text-stone">
          <Loader2 className="size-4 animate-spin" />
          {phase === "redirecting" ? "Taking you to the payment page…" : "Setting up your payment…"}
        </p>
      )}

      {phase === "awaiting_user" && (
        <div className="mt-4">
          <p className="flex items-center gap-2 text-sm text-stone">
            <Loader2 className="size-4 animate-spin" />
            {message}
          </p>
          {innbucksCode && (
            <>
              <p className="mt-2 rounded-lg bg-cream px-3 py-2 text-center text-lg font-semibold tracking-wider text-ink">
                {innbucksCode}
              </p>
              {innbucksExpiry && <p className="mt-1 text-center text-xs text-mist">Expires {innbucksExpiry}</p>}
            </>
          )}
          <p className="mt-2 text-xs text-mist">This page updates automatically once the payment is confirmed.</p>
        </div>
      )}

      {phase === "awaiting_otp" && (
        <form onSubmit={submitOtp} className="mt-4">
          <Field label="One-time code">
            <TextInput
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              inputMode="numeric"
              autoComplete="one-time-code"
              required
            />
          </Field>
          {message && <p className="mt-2 text-sm text-stone">{message}</p>}
          <Button type="submit" className="mt-3 w-full">
            Confirm
          </Button>
        </form>
      )}
    </div>
  );
}
