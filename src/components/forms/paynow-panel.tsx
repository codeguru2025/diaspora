"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Smartphone, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/field";
import { formatPrice } from "@/lib/format";
import { track } from "@/lib/analytics";
import { xsrfToken } from "@/lib/portal-client";

type Method = "ecocash" | "onemoney" | "innbucks" | "visa_mastercard";

const METHODS: { key: Method; label: string; kind: "mobile" | "card" }[] = [
  { key: "ecocash", label: "EcoCash", kind: "mobile" },
  { key: "onemoney", label: "OneMoney", kind: "mobile" },
  { key: "innbucks", label: "InnBucks", kind: "mobile" },
  { key: "visa_mastercard", label: "Visa / Mastercard", kind: "card" },
];

type Phase =
  | "choose"
  | "creating"
  | "awaiting_user"
  | "redirecting"
  | "polling"
  | "paid"
  | "failed"
  | "unavailable";

export function PayNowPanel({
  policyId,
  amount,
  currency = "USD",
  defaultPhone,
  onPaid,
}: {
  policyId: string;
  amount: number;
  currency?: string;
  defaultPhone?: string;
  onPaid?: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("choose");
  const [method, setMethod] = useState<Method>("ecocash");
  const [phone, setPhone] = useState(defaultPhone ?? "");
  const [message, setMessage] = useState<string>("");
  const [innbucksCode, setInnbucksCode] = useState<string | null>(null);
  const intentId = useRef<string | null>(null);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (pollTimer.current) clearTimeout(pollTimer.current);
    };
  }, []);

  const poll = useCallback(
    async (id: string, attempt = 0) => {
      try {
        const res = await fetch(`/api/portal/payment-intents/${id}/status`);
        const data = await res.json();
        if (data.paid || data.status === "paid") {
          setPhase("paid");
          track({ name: "payment_completed" });
          onPaid?.();
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
        setMessage("We didn't get confirmation in time. Check your payments in a few minutes.");
        return;
      }
      pollTimer.current = setTimeout(() => poll(id, attempt + 1), 4000);
    },
    [onPaid],
  );

  async function start() {
    setPhase("creating");
    setMessage("");
    track({ name: "payment_started" });
    try {
      const token = await xsrfToken();
      const headers = { "content-type": "application/json", ...(token ? { "x-xsrf-token": token } : {}) };
      const created = await fetch("/api/portal/payment-intents", {
        method: "POST",
        headers,
        body: JSON.stringify({
          policyId,
          amount,
          purpose: "premium",
          idempotencyKey: crypto.randomUUID(),
        }),
      });
      if (created.status === 503) {
        setPhase("unavailable");
        return;
      }
      const cj = await created.json();
      if (!created.ok) throw new Error(cj.message);
      intentId.current = cj.intent?.id ?? cj.intent?.intentId ?? null;
      if (!intentId.current) throw new Error("Could not start the payment.");

      const init = await fetch(`/api/portal/payment-intents/${intentId.current}/initiate`, {
        method: "POST",
        headers,
        body: JSON.stringify({ method, payerPhone: phone || undefined }),
      });
      const ij = await init.json();
      if (!init.ok) throw new Error(ij.message);

      if (ij.redirectUrl) {
        setPhase("redirecting");
        window.location.href = ij.redirectUrl;
        return;
      }
      if (ij.innbucksCode) setInnbucksCode(ij.innbucksCode);
      setPhase("awaiting_user");
      setMessage(
        method === "innbucks"
          ? "Open your InnBucks app and authorise the payment with the code below."
          : "Check your phone — approve the payment prompt to continue.",
      );
      poll(intentId.current);
    } catch (e) {
      setPhase("failed");
      setMessage(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  }

  if (phase === "unavailable") {
    return (
      <div className="rounded-xl border border-line bg-cream p-4 text-sm text-stone">
        Online payment isn&rsquo;t connected yet. Your Funeral Care Consultant will take your
        payment, or you can pay at any DFS branch.
      </div>
    );
  }

  if (phase === "paid") {
    return (
      <div className="rounded-xl border border-sage/30 bg-sage/8 p-4">
        <CheckCircle2 className="size-6 text-sage" />
        <p className="mt-2 font-medium text-ink">Payment received</p>
        <p className="text-sm text-stone">
          {formatPrice(amount, currency)} paid. Your receipt will appear in your documents shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <p className="text-sm text-stone">Amount due</p>
      <p className="text-2xl font-semibold text-ink">{formatPrice(amount, currency)}</p>

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
                {m.kind === "mobile" ? (
                  <Smartphone className="size-4" />
                ) : (
                  <CreditCard className="size-4" />
                )}
                {m.label}
              </button>
            ))}
          </div>

          {METHODS.find((m) => m.key === method)?.kind === "mobile" && (
            <Field label="Mobile number for the payment prompt" className="mt-3">
              <TextInput
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                inputMode="tel"
                placeholder="+263 77 000 0000"
              />
            </Field>
          )}

          {phase === "failed" && message && (
            <p className="mt-3 text-sm text-terracotta">{message}</p>
          )}

          <Button type="button" className="mt-4 w-full" onClick={start}>
            Pay {formatPrice(amount, currency)}
          </Button>
        </div>
      )}

      {(phase === "creating" || phase === "redirecting" || phase === "polling") && (
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
            <p className="mt-2 rounded-lg bg-cream px-3 py-2 text-center text-lg font-semibold tracking-wider text-ink">
              {innbucksCode}
            </p>
          )}
          <p className="mt-2 text-xs text-mist">
            This page updates automatically once the payment is confirmed.
          </p>
        </div>
      )}
    </div>
  );
}
