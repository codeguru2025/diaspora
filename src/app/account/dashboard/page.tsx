"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Users } from "lucide-react";
import { PortalShell } from "@/components/portal/portal-shell";
import { Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { portalGet } from "@/lib/portal-client";
import { formatPrice, scheduleLabel } from "@/lib/format";

type Policy = {
  id: string;
  policyNumber: string;
  status: string;
  premiumAmount: string;
  currency: string;
  paymentSchedule: string;
  graceEndDate?: string | null;
  waitingPeriodEndDate?: string | null;
  balance?: string | number | null;
  arrears?: string | number | null;
};

type Member = { id: string; memberNumber?: string; role?: string; firstName?: string; lastName?: string };

const statusTone: Record<string, Parameters<typeof Badge>[0]["tone"]> = {
  active: "sage",
  grace: "accent",
  pending: "neutral",
  inactive: "neutral",
  lapsed: "terracotta",
  cancelled: "outline",
};

function DashboardBody() {
  const [policies, setPolicies] = useState<Policy[] | null>(null);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [members, setMembers] = useState<Record<string, Member[]>>({});

  useEffect(() => {
    portalGet<Policy[]>("policies")
      .then(setPolicies)
      .catch((e) => setError(e.message || "Could not load your policies."));
  }, []);

  async function toggle(id: string) {
    setExpanded((cur) => (cur === id ? null : id));
    if (!members[id]) {
      try {
        const m = await portalGet<Member[]>(`policies/${id}/members`);
        setMembers((prev) => ({ ...prev, [id]: m }));
      } catch {
        setMembers((prev) => ({ ...prev, [id]: [] }));
      }
    }
  }

  if (error) return <p className="text-sm text-terracotta">{error}</p>;
  if (!policies) return <Loader2 className="size-5 animate-spin text-stone" />;

  if (policies.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line-strong p-10 text-center">
        <p className="text-stone">No policies are linked to this account yet.</p>
        <Button href="/protect-my-family" className="mt-4">
          Protect your family
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {policies.map((p) => {
        const arrears = Number(p.arrears ?? 0);
        return (
          <div key={p.id} className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-stone">Policy</p>
                <p className="text-lg font-semibold text-ink">{p.policyNumber}</p>
              </div>
              <Badge tone={statusTone[p.status] ?? "neutral"}>{p.status}</Badge>
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-stone">Premium</dt>
                <dd className="text-ink">
                  {formatPrice(p.premiumAmount, p.currency)}{" "}
                  <span className="text-stone">{scheduleLabel(p.paymentSchedule)}</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-stone">Outstanding</dt>
                <dd className={arrears > 0 ? "font-medium text-terracotta" : "text-ink"}>
                  {arrears > 0 ? formatPrice(arrears, p.currency) : "Up to date"}
                </dd>
              </div>
              {p.graceEndDate && (
                <div>
                  <dt className="text-xs text-stone">Grace period ends</dt>
                  <dd className="text-ink">{new Date(p.graceEndDate).toLocaleDateString()}</dd>
                </div>
              )}
            </dl>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button href={`/account/payments?policy=${p.id}`} size="sm">
                {arrears > 0 ? "Pay now" : "Make a payment"}
              </Button>
              <button
                type="button"
                onClick={() => toggle(p.id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 text-sm text-stone hover:text-ink"
              >
                <Users className="size-4" />
                {expanded === p.id ? "Hide" : "View"} covered family
              </button>
            </div>

            {expanded === p.id && (
              <ul className="mt-4 divide-y divide-line border-t border-line pt-2 text-sm">
                {(members[p.id] ?? []).length === 0 ? (
                  <li className="py-2 text-mist">No members listed.</li>
                ) : (
                  (members[p.id] ?? []).map((m) => (
                    <li key={m.id} className="flex justify-between py-2">
                      <span className="text-charcoal">
                        {[m.firstName, m.lastName].filter(Boolean).join(" ") || "Member"}
                      </span>
                      <span className="text-mist">
                        {m.role === "policy_holder" ? "Policyholder" : m.memberNumber || m.role}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        );
      })}

      <div className="rounded-2xl border border-terracotta/25 bg-cream p-5">
        <p className="font-medium text-ink">Need us now?</p>
        <p className="mt-1 text-sm text-stone">
          If a family member has passed away, tell us and our team takes over the arrangements.
        </p>
        <Link
          href="/account/claims"
          className="mt-3 inline-block text-sm font-medium text-terracotta hover:underline"
        >
          Tell us about a funeral →
        </Link>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <PortalShell>
      <DashboardBody />
    </PortalShell>
  );
}
