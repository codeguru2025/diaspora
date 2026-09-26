"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PortalShell } from "@/components/portal/portal-shell";
import { PayNowPanel } from "@/components/forms/paynow-panel";
import { Select } from "@/components/ui/field";
import { portalGet } from "@/lib/portal-client";
import { formatPrice } from "@/lib/format";

type Policy = { id: string; policyNumber: string; premiumAmount: string; currency: string; arrears?: string | number | null };
type Payment = {
  id: string;
  amount: string;
  currency?: string;
  paymentMethod?: string;
  status?: string;
  postedDate?: string;
  createdAt?: string;
  receiptNumber?: string;
};

function PaymentsBody() {
  const params = useSearchParams();
  const [policies, setPolicies] = useState<Policy[] | null>(null);
  const [selected, setSelected] = useState<string>("");
  // Payments are tagged with the policy they belong to, so switching policy shows
  // the loader until that policy's list arrives.
  const [loaded, setLoaded] = useState<{ policyId: string; items: Payment[] } | null>(null);
  const payments = loaded && loaded.policyId === selected ? loaded.items : null;
  const [error, setError] = useState("");

  useEffect(() => {
    portalGet<Policy[]>("policies")
      .then((ps) => {
        setPolicies(ps);
        const fromUrl = params.get("policy");
        setSelected(fromUrl && ps.some((p) => p.id === fromUrl) ? fromUrl : ps[0]?.id ?? "");
      })
      .catch((e) => setError(e.message || "Could not load your policies."));
  }, [params]);

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    portalGet<Payment[]>(`policies/${encodeURIComponent(selected)}/payments`)
      .catch(() => [] as Payment[])
      .then((items) => {
        if (!cancelled) setLoaded({ policyId: selected, items });
      });
    return () => {
      cancelled = true;
    };
  }, [selected]);

  if (error) return <p className="text-sm text-terracotta">{error}</p>;
  if (!policies) return <Loader2 className="size-5 animate-spin text-stone" />;
  if (policies.length === 0) return <p className="text-stone">No policies on this account.</p>;

  const policy = policies.find((p) => p.id === selected);
  const due = policy ? Number(policy.arrears ?? 0) || Number(policy.premiumAmount) : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div>
        {policies.length > 1 && (
          <label className="mb-4 block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Policy</span>
            <Select value={selected} onChange={(e) => setSelected(e.target.value)}>
              {policies.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.policyNumber}
                </option>
              ))}
            </Select>
          </label>
        )}
        {policy && (
          <PayNowPanel
            policyId={policy.id}
            amount={due}
            currency={policy.currency}
            onPaid={() =>
              portalGet<Payment[]>(`policies/${encodeURIComponent(policy.id)}/payments`)
                .then((items) => setLoaded({ policyId: policy.id, items }))
                .catch(() => {})
            }
          />
        )}
      </div>

      <div>
        <h2 className="text-lg">Payment history</h2>
        {!payments ? (
          <Loader2 className="mt-4 size-5 animate-spin text-stone" />
        ) : payments.length === 0 ? (
          <p className="mt-3 text-sm text-stone">No payments recorded on this policy yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {payments.map((pay) => (
              <li key={pay.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="text-ink">{formatPrice(pay.amount, pay.currency)}</p>
                  <p className="text-xs text-mist">
                    {(pay.postedDate || pay.createdAt || "").slice(0, 10)}
                    {pay.paymentMethod ? ` · ${pay.paymentMethod.replace(/_/g, " ")}` : ""}
                    {pay.receiptNumber ? ` · ${pay.receiptNumber}` : ""}
                  </p>
                </div>
                <span className="text-xs text-stone">{pay.status ?? "recorded"}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <PortalShell>
      <Suspense fallback={<Loader2 className="size-5 animate-spin text-stone" />}>
        <PaymentsBody />
      </Suspense>
    </PortalShell>
  );
}
