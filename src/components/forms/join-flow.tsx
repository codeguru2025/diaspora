"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Field, TextInput, Select } from "@/components/ui/field";
import { Badge, NeedsInput } from "@/components/ui/primitives";
import { Turnstile, type TurnstileHandle } from "@/components/ui/turnstile";
import { track } from "@/lib/analytics";
import { packages } from "@/config/packages";
import { services } from "@/config/services";
import { diasporaCountries, zimbabweProvinces } from "@/config/content";
import { useSelection, clearSelection } from "@/lib/selection-store";
import {
  useApplication,
  readApplication,
  writeApplication,
  clearApplication,
  type Dependent,
} from "@/lib/application-store";

const STEPS = ["Your account", "Your family", "Beneficiary", "Review", "Confirmation"] as const;
const RELATIONSHIPS = ["Spouse", "Child", "Parent", "Sibling", "Grandparent", "Grandchild", "Other"];

type Estimate = {
  premium: string | null;
  currency: string;
  paymentSchedule: string;
  note?: string;
  productVersionId?: string;
};
type SubmitResult = {
  status: "registered" | "captured";
  policyNumber: string | null;
  activationCode: string | null;
  clientId?: string | null;
  paymentLink?: { token: string; expiresAt: string } | null;
  message: string;
};

export function JoinFlow({ initialPackage }: { initialPackage?: string }) {
  const selection = useSelection();
  const app = useApplication();
  const [step, setStep] = useState(0);
  const [consent, setConsent] = useState(false);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);

  const packageSlug = app.packageSlug ?? initialPackage ?? selection.packageSlug ?? null;
  const chosenServices = app.selectedServices.length ? app.selectedServices : selection.serviceSlugs;
  const pkg = packages.find((p) => p.slug === packageSlug) ?? null;

  useEffect(() => {
    if (initialPackage && !app.packageSlug) writeApplication({ packageSlug: initialPackage });
  }, [initialPackage, app.packageSlug]);

  useEffect(() => {
    track({ name: "application_started", packageSlug: packageSlug ?? undefined });
  }, [packageSlug]);

  useEffect(() => {
    if (step !== 3) return;
    fetch("/api/quote", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        packageSlug,
        memberCount: 1 + app.dependents.length,
        dependentDateOfBirths: app.dependents.map((d) => d.dateOfBirth || null),
        currency: app.currency,
        paymentSchedule: app.paymentSchedule,
      }),
    })
      .then((r) => r.json())
      .then((data: Estimate) => {
        setEstimate(data);
        if (data.productVersionId && data.productVersionId !== readApplication().productVersionId) {
          writeApplication({ productVersionId: data.productVersionId });
        }
      })
      .catch(() => setEstimate(null));
  }, [step, packageSlug, app.dependents, app.currency, app.paymentSchedule]);

  const setApplicant = (patch: Partial<typeof app.applicant>) =>
    writeApplication({ applicant: { ...app.applicant, ...patch } });
  const setBeneficiary = (patch: Partial<typeof app.beneficiary>) =>
    writeApplication({ beneficiary: { ...app.beneficiary, ...patch } });
  const setDependents = (dependents: Dependent[]) => writeApplication({ dependents });

  const accountValid =
    app.applicant.firstName.trim() &&
    app.applicant.lastName.trim() &&
    app.applicant.phone.trim() &&
    app.applicant.dateOfBirth.trim() &&
    app.applicant.gender.trim() &&
    /^\d+[A-Z]\d{2}$/.test(app.applicant.nationalId.trim());

  // POL263 requires every one of these or it silently drops the whole beneficiary — only send it
  // when it's genuinely complete, so we never claim to save something that actually wasn't.
  const beneficiaryComplete =
    app.beneficiary.firstName.trim() &&
    app.beneficiary.lastName.trim() &&
    app.beneficiary.relationship.trim() &&
    app.beneficiary.phone.trim() &&
    /^\d+[A-Z]\d{2}$/.test(app.beneficiary.nationalId.trim());

  const chosenServiceNames = useMemo(
    () => chosenServices.map((s) => services.find((x) => x.slug === s)?.name).filter(Boolean),
    [chosenServices],
  );

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/join/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          firstName: app.applicant.firstName,
          lastName: app.applicant.lastName,
          email: app.applicant.email || undefined,
          phone: app.applicant.phone,
          dateOfBirth: app.applicant.dateOfBirth || undefined,
          nationalId: app.applicant.nationalId || undefined,
          gender: app.applicant.gender || undefined,
          productVersionId: app.productVersionId || undefined,
          currency: app.currency,
          paymentSchedule: app.paymentSchedule,
          packageSlug,
          countryOfResidence: app.countryOfResidence,
          serviceProvince: app.serviceProvince || undefined,
          dependents: app.dependents,
          beneficiary: beneficiaryComplete ? app.beneficiary : undefined,
          selectedServices: chosenServices,
          turnstileToken,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setResult(data);
      track({ name: "application_completed" });
      clearSelection();
      clearApplication();
      setStep(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    } finally {
      setSubmitting(false);
    }
  }

  /* ---- Confirmation ---- */
  if (step === 4 && result) {
    return (
      <div className="rounded-2xl border border-sage/30 bg-sage/8 p-8">
        <CheckCircle2 className="size-8 text-sage" />
        <h2 className="mt-3 text-2xl">
          {result.status === "registered" ? "Your application is in." : "We've got your application."}
        </h2>
        <p className="mt-2 text-stone">{result.message}</p>

        {result.policyNumber && (
          <dl className="mt-5 grid gap-2 rounded-xl bg-surface p-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-stone">Policy number</dt>
              <dd className="font-semibold text-ink">{result.policyNumber}</dd>
            </div>
            {result.activationCode && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-stone">Activation code</dt>
                <dd className="font-semibold text-ink">{result.activationCode}</dd>
              </div>
            )}
          </dl>
        )}

        <div className="mt-6">
          <p className="text-sm font-medium text-ink">What happens next</p>
          <ol className="mt-2 space-y-2 text-sm text-stone">
            {result.paymentLink ? (
              <li>1. Pay your first premium — no account needed for this step.</li>
            ) : (
              <li>1. We confirm your details and your premium.</li>
            )}
            <li>
              2. {result.activationCode ? "Activate your online account" : "Set up your online account"}{" "}
              to see your policy, pay premiums and manage your family.
            </li>
            <li>3. Your cover is administered on POL263, and we keep you updated by SMS.</li>
          </ol>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {result.paymentLink && (
            <Button href={`/pay/${result.paymentLink.token}`} variant="accent">
              Pay now
            </Button>
          )}
          {result.activationCode && result.policyNumber ? (
            <Button
              href={`/account/enroll?policy=${encodeURIComponent(result.policyNumber)}&code=${encodeURIComponent(result.activationCode)}`}
              variant={result.paymentLink ? "outline" : "primary"}
            >
              Activate my account
            </Button>
          ) : (
            <Button href="/account" variant={result.paymentLink ? "outline" : "primary"}>
              Go to my account
            </Button>
          )}
          <Button href="/services" variant="outline">
            Keep exploring services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="dfs-card rounded-[4px] p-5 sm:p-8">
      {/* progress */}
      <ol className="mb-8 flex flex-wrap gap-x-2 gap-y-1 text-xs">
        {STEPS.slice(0, 4).map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden className="text-mist">→</span>}
            <span className={cn("font-medium", i === step ? "text-ink" : i < step ? "text-sage" : "text-mist")}>
              {label}
            </span>
          </li>
        ))}
      </ol>

      {!pkg && (
        <div className="mb-6 rounded-xl bg-cream p-4 text-sm text-stone">
          You haven&rsquo;t chosen a package yet.{" "}
          <Link href="/get-a-quote" className="underline">
            Start with a quote
          </Link>{" "}
          or{" "}
          <Link href="/packages" className="underline">
            pick a package
          </Link>
          .
        </div>
      )}

      {/* Step 0 — account */}
      {step === 0 && (
        <div>
          <h2 className="text-2xl">Your details</h2>
          <p className="mt-1 text-stone">The person taking out the cover.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="First name" required>
              <TextInput
                value={app.applicant.firstName}
                onChange={(e) => setApplicant({ firstName: e.target.value })}
                autoComplete="given-name"
              />
            </Field>
            <Field label="Last name" required>
              <TextInput
                value={app.applicant.lastName}
                onChange={(e) => setApplicant({ lastName: e.target.value })}
                autoComplete="family-name"
              />
            </Field>
            <Field label="Phone (with country code)" required>
              <TextInput
                value={app.applicant.phone}
                onChange={(e) => setApplicant({ phone: e.target.value })}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
              />
            </Field>
            <Field label="Email">
              <TextInput
                value={app.applicant.email}
                onChange={(e) => setApplicant({ email: e.target.value })}
                type="email"
                autoComplete="email"
              />
            </Field>
            <Field label="Date of birth" required>
              <TextInput
                value={app.applicant.dateOfBirth}
                onChange={(e) => setApplicant({ dateOfBirth: e.target.value })}
                type="date"
                required
              />
            </Field>
            <Field
              label="National ID"
              required
              hint="Digits + check letter + 2 digits, e.g. 08833089H38"
            >
              <TextInput
                value={app.applicant.nationalId}
                onChange={(e) => setApplicant({ nationalId: e.target.value.toUpperCase() })}
                pattern="^\d+[A-Z]\d{2}$"
                title="Digits, then one letter, then exactly 2 digits — e.g. 08833089H38"
                required
              />
            </Field>
            <Field label="Gender" required>
              <Select
                value={app.applicant.gender}
                onChange={(e) => setApplicant({ gender: e.target.value })}
                required
              >
                <option value="">Select…</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </Select>
            </Field>
            <Field label="Your country of residence">
              <Select
                value={app.countryOfResidence}
                onChange={(e) => writeApplication({ countryOfResidence: e.target.value })}
              >
                {diasporaCountries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Where in Zimbabwe is your family?">
              <Select
                value={app.serviceProvince}
                onChange={(e) => writeApplication({ serviceProvince: e.target.value })}
              >
                <option value="">Select a province</option>
                {zimbabweProvinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <p className="mt-3 text-xs text-mist">
            You&rsquo;ll set a password when you activate your online account after this — enrolment
            and login are handled by POL263.
          </p>
        </div>
      )}

      {/* Step 1 — family */}
      {step === 1 && (
        <div>
          <h2 className="text-2xl">Who are you protecting?</h2>
          <p className="mt-1 text-stone">Add each family member you want covered.</p>
          <div className="mt-5 space-y-3">
            {app.dependents.map((d, i) => (
              <div key={i} className="rounded-xl border border-line p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="First name">
                    <TextInput
                      value={d.firstName}
                      onChange={(e) => {
                        const next = [...app.dependents];
                        next[i] = { ...d, firstName: e.target.value };
                        setDependents(next);
                      }}
                    />
                  </Field>
                  <Field label="Last name">
                    <TextInput
                      value={d.lastName}
                      onChange={(e) => {
                        const next = [...app.dependents];
                        next[i] = { ...d, lastName: e.target.value };
                        setDependents(next);
                      }}
                    />
                  </Field>
                  <Field label="Relationship">
                    <Select
                      value={d.relationship}
                      onChange={(e) => {
                        const next = [...app.dependents];
                        next[i] = { ...d, relationship: e.target.value };
                        setDependents(next);
                      }}
                    >
                      <option value="">Select…</option>
                      {RELATIONSHIPS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Date of birth">
                    <TextInput
                      type="date"
                      value={d.dateOfBirth ?? ""}
                      onChange={(e) => {
                        const next = [...app.dependents];
                        next[i] = { ...d, dateOfBirth: e.target.value };
                        setDependents(next);
                      }}
                    />
                  </Field>
                </div>
                <button
                  type="button"
                  onClick={() => setDependents(app.dependents.filter((_, j) => j !== i))}
                  className="mt-3 inline-flex items-center gap-1 text-sm text-terracotta"
                >
                  <Trash2 className="size-4" /> Remove
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                setDependents([
                  ...app.dependents,
                  { firstName: "", lastName: "", relationship: "", dateOfBirth: "" },
                ])
              }
            >
              <Plus className="size-4" /> Add a family member
            </Button>
          </div>
          <p className="mt-3 text-xs text-mist">
            The maximum number of members and their eligible ages are{" "}
            <NeedsInput>configured in POL263</NeedsInput>.
          </p>
        </div>
      )}

      {/* Step 2 — beneficiary */}
      {step === 2 && (
        <div>
          <h2 className="text-2xl">Who should we work with?</h2>
          <p className="mt-1 text-stone">
            The person we&rsquo;ll coordinate with if a funeral is needed. This can be updated later.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="First name">
              <TextInput
                value={app.beneficiary.firstName}
                onChange={(e) => setBeneficiary({ firstName: e.target.value })}
              />
            </Field>
            <Field label="Last name">
              <TextInput
                value={app.beneficiary.lastName}
                onChange={(e) => setBeneficiary({ lastName: e.target.value })}
              />
            </Field>
            <Field label="Relationship to you">
              <Select
                value={app.beneficiary.relationship}
                onChange={(e) => setBeneficiary({ relationship: e.target.value })}
              >
                <option value="">Select…</option>
                {RELATIONSHIPS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Their national ID" hint="e.g. 08833089H38">
              <TextInput
                value={app.beneficiary.nationalId}
                onChange={(e) => setBeneficiary({ nationalId: e.target.value.toUpperCase() })}
                pattern="^\d+[A-Z]\d{2}$"
                title="Digits, then one letter, then exactly 2 digits — e.g. 08833089H38"
              />
            </Field>
            <Field label="Their phone number">
              <TextInput
                value={app.beneficiary.phone}
                onChange={(e) => setBeneficiary({ phone: e.target.value })}
                type="tel"
                inputMode="tel"
              />
            </Field>
          </div>
          <p className="mt-3 text-xs text-mist">
            This section is optional — but if you start it, every field is needed. An incomplete
            beneficiary is not saved.
          </p>
        </div>
      )}

      {/* Step 3 — review */}
      {step === 3 && (
        <div>
          <h2 className="text-2xl">Review your protection</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <Row label="Package" value={pkg?.name ?? "Not chosen"} />
            <Row
              label="Policyholder"
              value={`${app.applicant.firstName} ${app.applicant.lastName}`.trim() || "—"}
            />
            <Row
              label="Family members"
              value={
                app.dependents.length
                  ? app.dependents
                      .map((d) => `${d.firstName} ${d.lastName}`.trim() || d.relationship)
                      .join(", ")
                  : "Just the policyholder"
              }
            />
            <Row
              label="Beneficiary"
              value={
                app.beneficiary.firstName
                  ? beneficiaryComplete
                    ? `${app.beneficiary.firstName} ${app.beneficiary.lastName} (${app.beneficiary.relationship})`
                    : `${app.beneficiary.firstName} ${app.beneficiary.lastName} — incomplete, will not be saved`
                  : "To be confirmed"
              }
            />
            <Row
              label="Country of residence"
              value={diasporaCountries.find((c) => c.code === app.countryOfResidence)?.name ?? "—"}
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone">
                Selected services ({chosenServices.length})
              </p>
              {chosenServiceNames.length === 0 ? (
                <p className="mt-1 text-mist">None — you can add services any time.</p>
              ) : (
                <ul className="mt-1 flex flex-wrap gap-1.5">
                  {chosenServiceNames.map((n) => (
                    <li key={n as string}>
                      <Badge tone="neutral">{n as string}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </dl>

          <div className="mt-6 rounded-xl bg-abyss p-5 text-ivory">
            <p className="text-xs uppercase tracking-[0.16em] text-ivory/60">Estimated monthly premium</p>
            {estimate?.premium ? (
              <p className="mt-1 text-3xl font-semibold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: estimate.currency,
                }).format(Number(estimate.premium))}
                <span className="ml-1 text-sm font-normal text-ivory/60">/ month</span>
              </p>
            ) : (
              <p className="mt-1 text-lg">
                Confirmed by a consultant —{" "}
                <NeedsInput>DFS pricing engine not yet connected</NeedsInput>
              </p>
            )}
            <p className="mt-2 text-xs text-ivory/60">
              {estimate?.note ?? "Indicative. Add-on services are priced separately."}
            </p>
          </div>

          <label className="mt-5 flex items-start gap-3 text-sm text-charcoal">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 size-4 accent-[var(--color-ink)]"
            />
            <span>
              I agree to be contacted by Diaspora Funeral Services about this application and I
              accept the{" "}
              <Link href="/legal/terms" className="underline">
                Terms &amp; Conditions
              </Link>{" "}
              and{" "}
              <Link href="/legal/privacy" className="underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          {error && <p className="mt-3 text-sm text-terracotta">{error}</p>}

          <Turnstile ref={turnstileRef} onToken={setTurnstileToken} className="mt-5" />
        </div>
      )}

      {/* nav */}
      <div className="mt-8 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          Back
        </Button>
        {step < 3 ? (
          <Button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 0 && !accountValid}
          >
            Next
          </Button>
        ) : (
          <Button type="button" onClick={submit} disabled={!consent || !turnstileToken || submitting}>
            {submitting ? "Submitting…" : "Submit application"}
          </Button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line pb-2">
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-stone">{label}</dt>
      <dd className="text-right text-sm text-ink">{value}</dd>
    </div>
  );
}
