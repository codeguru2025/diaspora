"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Phone } from "lucide-react";
import { cn } from "@/lib/cn";
import { Field, TextInput, TextArea, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Turnstile, type TurnstileHandle } from "@/components/ui/turnstile";
import { track } from "@/lib/analytics";
import { formatPrice } from "@/lib/format";
import { site } from "@/config/site";
import { serviceCategories } from "@/config/services";
import type { ResolvedService } from "@/lib/pol263";

type EstimateItem = { addOnId: string; name: string; unitPrice: string };
type Estimate = { items: EstimateItem[]; total: string; currency: string };
type Quotation = { id: string; quotationNumber: string; currency: string; total?: string } | null;

export function CashQuoteForm({ services }: { services: ResolvedService[] }) {
  const purchasable = useMemo(() => services.filter((s) => s.pol263AddOnId && s.active), [services]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [estimating, setEstimating] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [reference, setReference] = useState<string | null>(null);
  const [quotation, setQuotation] = useState<Quotation>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const ids = [...selected];
    if (ids.length === 0) return;
    debounceRef.current = setTimeout(() => {
      setEstimating(true);
      fetch("/api/funeral-request-estimate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ addOnIds: ids }),
      })
        .then((r) => r.json())
        .then(setEstimate)
        .catch(() => setEstimate(null))
        .finally(() => setEstimating(false));
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [selected]);

  // Selection cleared → the live total resets to $0 without waiting on a network round trip;
  // a stale `estimate` from before the last item was unticked would otherwise linger on screen.
  const displayEstimate = selected.size === 0 ? null : estimate;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    track({ name: "funeral_request_started" });
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/arrange-funeral", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...payload,
          deceasedAge: payload.deceasedAge ? Number(payload.deceasedAge) : undefined,
          requestedAddOnIds: [...selected],
          turnstileToken,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      track({ name: "funeral_request_completed" });
      setReference(data.reference);
      setQuotation(data.quotation ?? null);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    }
  }

  if (status === "done") {
    const items = estimate?.items ?? [];
    const total = quotation?.total ?? estimate?.total;
    const currency = quotation?.currency ?? estimate?.currency ?? "USD";
    return (
      <div className="rounded-2xl border border-sage/30 bg-sage/8 p-8">
        <CheckCircle2 className="size-8 text-sage" />
        <h2 className="mt-3 text-2xl">Your estimate is on its way.</h2>
        <p className="mt-2 text-stone">
          Reference <span className="font-mono font-medium text-ink">{quotation?.quotationNumber ?? reference}</span>.
          A member of our care team will follow up to confirm details.
        </p>
        {items.length > 0 && (
          <div className="mt-5 divide-y divide-line dfs-card rounded-[4px]">
            {items.map((it) => (
              <div key={it.addOnId} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span className="text-charcoal">{it.name}</span>
                <span className="font-medium text-ink">{formatPrice(it.unitPrice, currency) ?? "TBC"}</span>
              </div>
            ))}
            {total && (
              <div className="flex items-center justify-between px-4 py-3 text-sm font-semibold">
                <span>Total</span>
                <span>{formatPrice(total, currency) ?? "TBC"}</span>
              </div>
            )}
          </div>
        )}
        <a
          href={site.contact.atNeedPhoneHref}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-abyss px-5 py-3 text-sm font-medium text-ivory"
        >
          <Phone className="size-4" />
          {site.contact.atNeedPhoneDisplay}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="dfs-card rounded-[4px] p-6 sm:p-8">
      <p className="rounded-xl bg-cream px-4 py-3 text-sm text-charcoal">
        Tick the services you want priced. The total updates as you go — nothing is booked until you
        send it to us.
      </p>

      <div className="mt-6 max-h-[26rem] space-y-5 overflow-y-auto pr-1">
        {serviceCategories.map((cat) => {
          const items = purchasable.filter((s) => s.category === cat.slug);
          if (items.length === 0) return null;
          return (
            <div key={cat.slug}>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-champagne-deep">{cat.name}</p>
              <div className="mt-2 space-y-2">
                {items.map((s) => {
                  const on = selected.has(s.pol263AddOnId!);
                  return (
                    <label
                      key={s.slug}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm",
                        on ? "border-champagne bg-champagne/5" : "border-line",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(s.pol263AddOnId!)}
                        className="mt-0.5 size-4 accent-[var(--color-champagne)]"
                      />
                      <span className="flex-1">
                        <span className="font-medium text-ink">{s.name}</span>
                        <span className="mt-0.5 block text-xs text-stone">{s.shortDescription}</span>
                      </span>
                      <span className="shrink-0 text-xs font-medium text-mist">
                        {s.cashValue ? formatPrice(s.cashValue, "USD") : "Price TBC"}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-0 mt-4 flex items-center justify-between rounded-xl bg-abyss px-4 py-3 text-ivory">
        <span className="text-sm text-ivory/70">
          {selected.size === 0 ? "No services selected yet" : `${selected.size} selected`}
        </span>
        <span className="text-lg font-semibold">
          {estimating
            ? "Calculating…"
            : displayEstimate
              ? (formatPrice(displayEstimate.total, displayEstimate.currency) ?? "TBC")
              : formatPrice("0", "USD")}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Your name" required>
          <TextInput name="contactName" required autoComplete="name" />
        </Field>
        <Field label="Phone number" required hint="Include your country code if you're abroad">
          <TextInput name="contactPhone" type="tel" required inputMode="tel" autoComplete="tel" />
        </Field>
        <Field label="Email">
          <TextInput name="contactEmail" type="email" autoComplete="email" />
        </Field>
        <Field label="Your relationship to the person">
          <TextInput name="relationshipToDeceased" placeholder="e.g. son, daughter, spouse" />
        </Field>
        <Field label="Name of the person who has passed (if applicable)">
          <TextInput name="deceasedName" />
        </Field>
        <Field label="Are they an existing DFS policyholder?">
          <Select name="isExistingPolicyholder" defaultValue="unsure">
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="unsure">I&rsquo;m not sure</option>
          </Select>
        </Field>
        <Field label="Anything we should know?" className="sm:col-span-2">
          <TextArea name="notes" placeholder="Optional" />
        </Field>
      </div>

      <Turnstile ref={turnstileRef} onToken={setTurnstileToken} className="mt-5" />

      {status === "error" && <p className="mt-4 text-sm text-terracotta">{error}</p>}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={!turnstileToken || status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send Quote"}
        </Button>
        <a
          href={site.contact.atNeedPhoneHref}
          className="inline-flex items-center justify-center gap-2 text-sm font-medium text-ink"
        >
          <Phone className="size-4" /> Or call now · {site.contact.atNeedPhoneDisplay}
        </a>
      </div>
    </form>
  );
}
