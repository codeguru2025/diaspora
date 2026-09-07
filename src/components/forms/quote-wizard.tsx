"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Field, TextInput, Select } from "@/components/ui/field";
import { Badge, NeedsInput } from "@/components/ui/primitives";
import { track } from "@/lib/analytics";
import { packages } from "@/config/packages";
import { services } from "@/config/services";
import { diasporaCountries, zimbabweProvinces } from "@/config/content";
import { pricingModelLabels } from "@/config/services";
import { setPackage, toggleService, useSelection } from "@/lib/selection-store";
import { writeApplication } from "@/lib/application-store";
import { encodeQuote } from "@/lib/quote-token";

const STEPS = ["Package", "Family", "Location", "Personalise", "Review", "Your details"] as const;

type QuoteEstimate = { premium: string | null; currency: string; paymentSchedule: string; note?: string };

export function QuoteWizard({ initialPackage }: { initialPackage?: string }) {
  const selection = useSelection();
  const [step, setStep] = useState(0);
  const [pkgOverride, setPkgOverride] = useState<string | null>(initialPackage ?? null);
  // Package comes from the URL / this session's picks, falling back to any
  // in-progress selection already stored on the device.
  const pkg = pkgOverride ?? selection.packageSlug;
  const chosen = selection.serviceSlugs;
  const [residence, setResidence] = useState("ZW");
  const [province, setProvince] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [estimate, setEstimate] = useState<QuoteEstimate | null>(null);
  const [estimating, setEstimating] = useState(false);
  const [submit, setSubmit] = useState<"idle" | "submitting" | "done" | "error">("idle");

  useEffect(() => {
    track({ name: "quote_started", entry: initialPackage ? `package:${initialPackage}` : "direct" });
  }, [initialPackage]);

  useEffect(() => {
    track({ name: "quote_step", step: step + 1, stepName: STEPS[step] });
  }, [step]);

  const eligibleServices = useMemo(
    () =>
      services
        .filter((s) => s.active)
        .filter((s) => !pkg || s.availability[pkg as "essential"] !== "not-available")
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [pkg],
  );

  const contextualUpsells = useMemo(() => {
    const set = new Set<string>();
    for (const slug of chosen) {
      const svc = services.find((s) => s.slug === slug);
      svc?.relatedServices.forEach((r) => {
        if (!chosen.includes(r)) set.add(r);
      });
    }
    return [...set].map((s) => services.find((x) => x.slug === s)).filter(Boolean).slice(0, 4);
  }, [chosen]);

  async function fetchEstimate() {
    setEstimating(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          packageSlug: pkg,
          memberCount: adults + children,
          dependentDateOfBirths: Array(Math.max(0, adults + children - 1)).fill(null),
          currency: residence === "ZW" ? "USD" : "USD",
        }),
      });
      setEstimate(await res.json());
    } catch {
      setEstimate({ premium: null, currency: "USD", paymentSchedule: "monthly", note: "We'll confirm your premium directly." });
    } finally {
      setEstimating(false);
    }
  }

  function next() {
    if (step === 3) fetchEstimate();
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmit("submitting");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          firstName: fd.get("firstName"),
          lastName: fd.get("lastName"),
          phone: fd.get("phone"),
          email: fd.get("email") || undefined,
          source: "get_a_quote",
          productInterest: pkg ?? undefined,
          countryOfResidence: residence,
          context: {
            package: pkg,
            adults,
            children,
            province,
            services: chosen,
            estimate: estimate?.premium ?? null,
          },
        }),
      });
      if (!res.ok) throw new Error();
      track({ name: "quote_completed", packageSlug: pkg ?? undefined, serviceCount: chosen.length });
      // Seed the join flow so "Continue to join" is pre-filled.
      writeApplication({
        packageSlug: pkg,
        countryOfResidence: residence,
        serviceProvince: province,
        selectedServices: chosen,
        applicant: {
          firstName: String(fd.get("firstName") || ""),
          lastName: String(fd.get("lastName") || ""),
          email: String(fd.get("email") || ""),
          phone: String(fd.get("phone") || ""),
          dateOfBirth: "",
          nationalId: "",
        },
      });
      setSubmit("done");
    } catch {
      setSubmit("error");
    }
  }

  function toggle(slug: string) {
    toggleService(slug);
  }

  if (submit === "done") {
    return (
      <div className="rounded-2xl border border-sage/30 bg-sage/8 p-8 text-center">
        <CheckCircle2 className="mx-auto size-8 text-sage" />
        <h2 className="mt-3 text-2xl">Your quote is on its way.</h2>
        <p className="mx-auto mt-2 max-w-md text-stone">
          We&rsquo;ve saved your selections and a Funeral Care Consultant will be in touch with your
          confirmed premium and next steps. If you&rsquo;d like to continue straight to joining, we can
          pick up exactly where you left off.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href={pkg ? `/join?package=${pkg}` : "/join"}>Continue to join</Button>
          <Button href="/services" variant="outline">
            Keep exploring services
          </Button>
        </div>

        <SaveQuoteBlock
          data={{
            p: pkg,
            s: chosen,
            a: adults,
            c: children,
            r: residence,
            province,
            premium: estimate?.premium ?? null,
            currency: estimate?.currency ?? "USD",
          }}
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 sm:p-8">
      {/* Progress */}
      <ol className="mb-8 flex flex-wrap gap-x-2 gap-y-1 text-xs">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden className="text-mist">→</span>}
            <span
              className={cn(
                "font-medium",
                i === step ? "text-ink" : i < step ? "text-sage" : "text-mist",
              )}
            >
              {label}
            </span>
          </li>
        ))}
      </ol>

      {/* Step 0 — Package */}
      {step === 0 && (
        <div>
          <h2 className="text-2xl">Choose your protection</h2>
          <p className="mt-1 text-stone">You can change this later.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {packages.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => {
                  setPkgOverride(p.slug);
                  setPackage(p.slug);
                  track({ name: "package_selected", slug: p.slug });
                }}
                className={cn(
                  "rounded-xl border p-4 text-left transition-colors",
                  pkg === p.slug ? "border-ink ring-1 ring-ink/20" : "border-line hover:border-ink/40",
                )}
              >
                <span className="block font-[family-name:var(--font-display)] text-lg text-ink">
                  {p.name}
                </span>
                <span className="mt-0.5 block text-sm text-champagne-deep">{p.positioning}</span>
                <span className="mt-2 block text-xs text-stone">{p.summary}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1 — Family */}
      {step === 1 && (
        <div>
          <h2 className="text-2xl">Who are you protecting?</h2>
          <p className="mt-1 text-stone">
            A rough count is fine — we confirm exact family details when you join.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Adults to cover (including yourself)">
              <Select value={adults} onChange={(e) => setAdults(Number(e.target.value))}>
                {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Children to cover">
              <Select value={children} onChange={(e) => setChildren(Number(e.target.value))}>
                {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <p className="mt-3 text-xs text-mist">
            Eligibility rules and the maximum number of members are{" "}
            <NeedsInput>configured in POL263</NeedsInput>.
          </p>
        </div>
      )}

      {/* Step 2 — Location */}
      {step === 2 && (
        <div>
          <h2 className="text-2xl">Where is your family, and where are you?</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Your country of residence">
              <Select value={residence} onChange={(e) => setResidence(e.target.value)}>
                {diasporaCountries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                    {!c.available ? " (register interest)" : ""}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Where in Zimbabwe is your family / the service?">
              <Select value={province} onChange={(e) => setProvince(e.target.value)}>
                <option value="">Select a province</option>
                {zimbabweProvinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          {residence !== "ZW" && (
            <p className="mt-4 rounded-xl bg-cream p-3 text-sm text-stone">
              You&rsquo;re joining from the diaspora — you can pay digitally, receive SMS and digital
              updates, and manage everything online while we coordinate on the ground.
            </p>
          )}
        </div>
      )}

      {/* Step 3 — Personalise */}
      {step === 3 && (
        <div>
          <h2 className="text-2xl">Personalise your cover</h2>
          <p className="mt-1 text-stone">Optional. Add anything you already know you want.</p>
          <div className="mt-5 max-h-[24rem] space-y-2 overflow-y-auto pr-1">
            {eligibleServices.map((s) => {
              const on = chosen.includes(s.slug);
              return (
                <label
                  key={s.slug}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm",
                    on ? "border-ink bg-ink/5" : "border-line",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggle(s.slug)}
                    className="mt-0.5 size-4 accent-[var(--color-ink)]"
                  />
                  <span>
                    <span className="font-medium text-ink">{s.name}</span>
                    <span className="ml-2 text-xs text-mist">
                      {pricingModelLabels[s.pricing.model]}
                    </span>
                    <span className="mt-0.5 block text-xs text-stone">{s.shortDescription}</span>
                  </span>
                </label>
              );
            })}
          </div>
          {contextualUpsells.length > 0 && (
            <div className="mt-4 rounded-xl border border-champagne-deep/25 bg-champagne/10 p-4">
              <p className="text-sm font-medium text-ink">Often chosen together</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {contextualUpsells.map((s) => (
                  <button
                    key={s!.slug}
                    type="button"
                    onClick={() => toggle(s!.slug)}
                    className="rounded-full border border-champagne-deep/40 bg-surface px-3 py-1 text-xs text-ink hover:bg-champagne/20"
                  >
                    + {s!.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 4 — Review */}
      {step === 4 && (
        <div>
          <h2 className="text-2xl">Review your protection</h2>
          <div className="mt-5 space-y-4">
            <Row label="Package" value={pkg ? packages.find((p) => p.slug === pkg)?.name ?? "—" : "Not chosen"} />
            <Row label="Family" value={`${adults} adult${adults > 1 ? "s" : ""}${children ? `, ${children} child${children > 1 ? "ren" : ""}` : ""}`} />
            <Row label="Country of residence" value={diasporaCountries.find((c) => c.code === residence)?.name ?? residence} />
            <Row label="Service location" value={province || "To be confirmed"} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone">
                Selected services ({chosen.length})
              </p>
              {chosen.length === 0 ? (
                <p className="mt-1 text-sm text-mist">None yet — you can add services any time.</p>
              ) : (
                <ul className="mt-1 flex flex-wrap gap-1.5">
                  {chosen.map((c) => (
                    <li key={c}>
                      <Badge tone="neutral">{services.find((s) => s.slug === c)?.name ?? c}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-ink p-5 text-ivory">
            <p className="text-xs uppercase tracking-[0.16em] text-ivory/60">
              Estimated monthly premium
            </p>
            {estimating ? (
              <p className="mt-1 text-2xl">Calculating…</p>
            ) : estimate?.premium ? (
              <p className="mt-1 text-3xl font-semibold">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: estimate.currency }).format(
                  Number(estimate.premium),
                )}
                <span className="ml-1 text-sm font-normal text-ivory/60">/ month</span>
              </p>
            ) : (
              <p className="mt-1 text-lg">
                Confirmed by a consultant —{" "}
                <NeedsInput>DFS pricing engine not yet connected</NeedsInput>
              </p>
            )}
            <p className="mt-2 text-xs text-ivory/60">
              {estimate?.note ??
                "Indicative only. Add-on services priced separately per their pricing treatment."}
            </p>
          </div>
        </div>
      )}

      {/* Step 5 — Your details */}
      {step === 5 && (
        <form onSubmit={onSubmit}>
          <h2 className="text-2xl">Where should we send your quote?</h2>
          <p className="mt-1 text-stone">
            We&rsquo;ll confirm your premium and hold your selections so you can continue any time.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="First name" required>
              <TextInput name="firstName" required autoComplete="given-name" />
            </Field>
            <Field label="Last name" required>
              <TextInput name="lastName" required autoComplete="family-name" />
            </Field>
            <Field label="Phone (with country code)" required>
              <TextInput name="phone" type="tel" required inputMode="tel" autoComplete="tel" />
            </Field>
            <Field label="Email">
              <TextInput name="email" type="email" autoComplete="email" />
            </Field>
          </div>
          <p className="mt-4 text-xs text-mist">
            By requesting a quote you agree to be contacted by Diaspora Funeral Services. See our{" "}
            <a href="/legal/privacy" className="underline">
              Privacy Policy
            </a>
            .
          </p>
          {submit === "error" && (
            <p className="mt-3 text-sm text-terracotta">
              Something went wrong. Please try again or call us.
            </p>
          )}
          <div className="mt-6 flex gap-3">
            <Button type="button" variant="ghost" onClick={back}>
              Back
            </Button>
            <Button type="submit" disabled={submit === "submitting"}>
              {submit === "submitting" ? "Sending…" : "Get my quote"}
            </Button>
          </div>
        </form>
      )}

      {/* Nav (steps 0–4) */}
      {step < 5 && (
        <div className="mt-8 flex items-center justify-between">
          <Button type="button" variant="ghost" onClick={back} disabled={step === 0}>
            Back
          </Button>
          <Button type="button" onClick={next} disabled={step === 0 && !pkg}>
            {step === 4 ? "Continue" : "Next"}
          </Button>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-line pb-2">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-stone">{label}</span>
      <span className="text-sm text-ink">{value}</span>
    </div>
  );
}

function SaveQuoteBlock({ data }: { data: import("@/lib/quote-token").QuoteTokenData }) {
  const [url, setUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function save() {
    const token = encodeQuote(data);
    const link = `${window.location.origin}/q/${token}`;
    setUrl(link);
    navigator.clipboard?.writeText(link).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      },
      () => {},
    );
  }

  return (
    <div className="mt-6 border-t border-sage/25 pt-5">
      {!url ? (
        <button
          type="button"
          onClick={save}
          className="text-sm font-medium text-champagne-deep hover:text-ink"
        >
          Save my quote &amp; get a shareable link
        </button>
      ) : (
        <div>
          <p className="text-xs text-stone">
            {copied ? "Link copied — " : ""}Share this to pick up where you left off, on any device:
          </p>
          <input
            readOnly
            value={url}
            onFocus={(e) => e.currentTarget.select()}
            className="mt-2 w-full rounded-lg border border-line bg-surface px-3 py-2 text-xs text-charcoal"
          />
        </div>
      )}
    </div>
  );
}
