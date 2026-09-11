import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/marketing/page-header";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge, NeedsInput } from "@/components/ui/primitives";
import { RestoreQuote } from "@/components/marketing/restore-quote";
import { decodeQuote } from "@/lib/quote-token";
import { packages } from "@/config/packages";
import { services } from "@/config/services";
import { diasporaCountries } from "@/config/content";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Your saved quote",
  robots: { index: false, follow: false },
};

export default async function SavedQuotePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const data = decodeQuote(token);
  if (!data) notFound();

  const pkg = packages.find((p) => p.slug === data.p) ?? null;
  const chosen = data.s
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is (typeof services)[number] => Boolean(s));
  const country = diasporaCountries.find((c) => c.code === data.r)?.name ?? "Zimbabwe";
  const price = data.premium ? formatPrice(data.premium, data.currency ?? "USD") : null;

  return (
    <>
      <PageHeader
        eyebrow="Your saved quote"
        title="Your family protection plan"
        intro="This is a saved summary. Continue when you're ready — nothing here is a commitment."
      />
      <Section tone="ivory">
        <div className="mx-auto max-w-2xl rounded-2xl border border-line bg-surface p-6 sm:p-8">
          <dl className="space-y-3 text-sm">
            <Row label="Package" value={pkg ? pkg.name : "Not selected"} />
            {pkg && <p className="text-sm text-champagne-deep">{pkg.positioning}</p>}
            <Row
              label="Family"
              value={`${data.a} adult${data.a > 1 ? "s" : ""}${data.c ? `, ${data.c} child${data.c > 1 ? "ren" : ""}` : ""}`}
            />
            <Row label="Country of residence" value={country} />
            {data.province && <Row label="Service location" value={data.province} />}
          </dl>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone">
              Selected services ({chosen.length})
            </p>
            {chosen.length === 0 ? (
              <p className="mt-1 text-sm text-mist">None selected.</p>
            ) : (
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {chosen.map((s) => (
                  <li key={s.slug}>
                    <Badge tone="neutral">{s.name}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6 rounded-xl bg-abyss p-5 text-ivory">
            <p className="text-xs uppercase tracking-[0.16em] text-ivory/60">
              Estimated monthly premium
            </p>
            {price ? (
              <p className="mt-1 text-3xl font-semibold">
                {price} <span className="text-sm font-normal text-ivory/60">/ month</span>
              </p>
            ) : (
              <p className="mt-1 text-lg">
                Confirmed by a consultant —{" "}
                <NeedsInput>pricing engine not yet connected</NeedsInput>
              </p>
            )}
            <p className="mt-2 text-xs text-ivory/60">
              Indicative. Add-on services are priced separately per their pricing treatment.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <RestoreQuote token={token} />
            <Button href="/get-a-quote" variant="outline">
              Adjust this quote
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-line pb-2">
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-stone">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}
