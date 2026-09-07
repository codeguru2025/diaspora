"use client";

import { useEffect, useState } from "react";
import { Loader2, FileText, Download } from "lucide-react";
import { PortalShell } from "@/components/portal/portal-shell";
import { portalGet } from "@/lib/portal-client";

type Policy = { id: string; policyNumber: string; status: string };
type Receipt = { id: string; receiptNumber?: string; amount?: string; currency?: string; issuedAt?: string; createdAt?: string };

function DocumentsBody() {
  const [policies, setPolicies] = useState<Policy[] | null>(null);
  const [receipts, setReceipts] = useState<Receipt[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    portalGet<Policy[]>("policies").then(setPolicies).catch((e) => setError(e.message));
    portalGet<Receipt[]>("receipts").then(setReceipts).catch(() => setReceipts([]));
  }, []);

  if (error) return <p className="text-sm text-terracotta">{error}</p>;
  if (!policies) return <Loader2 className="size-5 animate-spin text-stone" />;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg">Policy documents</h2>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {policies.map((p) => (
            <li key={p.id} className="flex items-center justify-between py-3 text-sm">
              <span className="flex items-center gap-2 text-charcoal">
                <FileText className="size-4 text-stone" />
                Policy schedule — {p.policyNumber}
              </span>
              <a
                href={`/api/portal/policies/${p.id}/document?download=1`}
                className="inline-flex items-center gap-1.5 text-champagne-deep hover:text-ink"
              >
                <Download className="size-4" /> Download
              </a>
            </li>
          ))}
          {policies.length === 0 && <li className="py-3 text-mist">No policy documents yet.</li>}
        </ul>
      </div>

      <div>
        <h2 className="text-lg">Receipts &amp; statements</h2>
        {!receipts ? (
          <Loader2 className="mt-3 size-5 animate-spin text-stone" />
        ) : receipts.length === 0 ? (
          <p className="mt-3 text-sm text-stone">
            Receipts appear here after each payment.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {receipts.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-3 text-sm">
                <span className="flex items-center gap-2 text-charcoal">
                  <FileText className="size-4 text-stone" />
                  {r.receiptNumber || "Receipt"}
                  <span className="text-mist">{(r.issuedAt || r.createdAt || "").slice(0, 10)}</span>
                </span>
                <a
                  href={`/api/portal/receipts/${r.id}/download`}
                  className="inline-flex items-center gap-1.5 text-champagne-deep hover:text-ink"
                >
                  <Download className="size-4" /> PDF
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <PortalShell>
      <DocumentsBody />
    </PortalShell>
  );
}
