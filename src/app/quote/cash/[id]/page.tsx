import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Phone } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getFuneralRequestById } from "@/lib/pol263";
import { formatPrice } from "@/lib/format";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Your Funeral Cost Estimate", robots: { index: false, follow: false } };

export default async function CashQuoteViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: quotation } = await getFuneralRequestById(id);
  if (!quotation) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Your estimate"
        title={`Reference ${quotation.quotationNumber}`}
        intro="This is the cash-price estimate you requested. It's not a booking — get in touch to confirm and move ahead."
      />
      <section className="bg-void py-12 md:py-16">
        <Container className="max-w-2xl">
          {quotation.items && quotation.items.length > 0 && (
            <div className="divide-y divide-line dfs-card rounded-[4px]">
              {quotation.items.map((it, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className="text-charcoal">{it.description}</span>
                  <span className="font-medium text-ink">{formatPrice(it.lineTotal, quotation.currency) ?? "TBC"}</span>
                </div>
              ))}
            </div>
          )}
          {quotation.total && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-abyss px-4 py-3 text-ivory">
              <span className="text-sm text-ivory/70">Total</span>
              <span className="text-lg font-semibold">{formatPrice(quotation.total, quotation.currency) ?? "TBC"}</span>
            </div>
          )}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href={site.contact.atNeedPhoneHref} size="lg">
              <Phone className="size-4" /> Call {site.contact.atNeedPhoneDisplay}
            </Button>
            <Button href="/quote/cash" variant="secondary" size="lg">
              Start a new estimate
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
