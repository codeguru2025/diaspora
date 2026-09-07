"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { PortalShell } from "@/components/portal/portal-shell";
import { Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Field, TextInput, TextArea, Select } from "@/components/ui/field";
import { portalGet, portalPost } from "@/lib/portal-client";
import { site } from "@/config/site";

type Policy = { id: string; policyNumber: string; status: string };
type Claim = {
  id: string;
  claimNumber?: string;
  status?: string;
  deceasedName?: string;
  dateOfDeath?: string;
  createdAt?: string;
};

const RELATIONSHIPS = ["Spouse", "Child", "Parent", "Sibling", "Grandparent", "Grandchild", "Other"];

function ClaimsBody() {
  const [policies, setPolicies] = useState<Policy[] | null>(null);
  const [claims, setClaims] = useState<Claim[] | null>(null);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    portalGet<Policy[]>("policies").then(setPolicies).catch((e) => setError(e.message));
    portalGet<Claim[]>("claims").then(setClaims).catch(() => setClaims([]));
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      await portalPost("claims", {
        policyId: fd.get("policyId"),
        claimType: "death",
        deceasedName: fd.get("deceasedName"),
        deceasedRelationship: fd.get("deceasedRelationship"),
        dateOfDeath: fd.get("dateOfDeath"),
        causeOfDeath: fd.get("causeOfDeath") || undefined,
      });
      setDone(true);
      portalGet<Claim[]>("claims").then(setClaims).catch(() => {});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please call us.");
    } finally {
      setSubmitting(false);
    }
  }

  if (error && !policies) return <p className="text-sm text-terracotta">{error}</p>;
  if (!policies) return <Loader2 className="size-5 animate-spin text-stone" />;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-terracotta/25 bg-cream p-5">
        <h2 className="text-lg">Has a loved one passed away?</h2>
        <p className="mt-1 text-sm text-stone">
          Tell us here, or call our care line on{" "}
          <a href={site.contact.atNeedPhoneHref} className="font-medium text-ink">
            {site.contact.atNeedPhoneDisplay}
          </a>
          . Our team will take over the arrangements and keep you informed.
        </p>
        {!formOpen && !done && (
          <Button type="button" variant="urgent" className="mt-3" onClick={() => setFormOpen(true)}>
            Tell us about a funeral
          </Button>
        )}
      </div>

      {done && (
        <div className="rounded-2xl border border-sage/30 bg-sage/8 p-6">
          <CheckCircle2 className="size-6 text-sage" />
          <p className="mt-2 font-medium text-ink">We&rsquo;ve received this.</p>
          <p className="text-sm text-stone">
            A member of our team will call you very shortly to begin the arrangements.
          </p>
        </div>
      )}

      {formOpen && !done && (
        <form onSubmit={submit} className="rounded-2xl border border-line bg-surface p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Which policy?" required className="sm:col-span-2">
              <Select name="policyId" required defaultValue="">
                <option value="" disabled>
                  Select…
                </option>
                {policies.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.policyNumber}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Name of the person who has passed" required>
              <TextInput name="deceasedName" required />
            </Field>
            <Field label="Their relationship to you" required>
              <Select name="deceasedRelationship" required defaultValue="">
                <option value="" disabled>
                  Select…
                </option>
                {RELATIONSHIPS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Date of death" required>
              <TextInput name="dateOfDeath" type="date" required />
            </Field>
            <Field label="Cause of death (if known)">
              <TextInput name="causeOfDeath" />
            </Field>
            <Field label="Anything else we should know?" className="sm:col-span-2">
              <TextArea name="notes" placeholder="Optional" />
            </Field>
          </div>
          {error && <p className="mt-3 text-sm text-terracotta">{error}</p>}
          <div className="mt-4 flex gap-3">
            <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="urgent" disabled={submitting}>
              {submitting ? "Sending…" : "Send to our care team"}
            </Button>
          </div>
        </form>
      )}

      <div>
        <h2 className="text-lg">Your claims</h2>
        {!claims ? (
          <Loader2 className="mt-3 size-5 animate-spin text-stone" />
        ) : claims.length === 0 ? (
          <p className="mt-3 text-sm text-stone">No claims on this account.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {claims.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="text-ink">{c.claimNumber || "Claim"}</p>
                  <p className="text-xs text-mist">
                    {c.deceasedName}
                    {c.dateOfDeath ? ` · ${String(c.dateOfDeath).slice(0, 10)}` : ""}
                  </p>
                </div>
                <Badge tone="neutral">{c.status ?? "submitted"}</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function ClaimsPage() {
  return (
    <PortalShell>
      <ClaimsBody />
    </PortalShell>
  );
}
