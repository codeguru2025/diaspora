import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Container } from "@/components/ui/container";
import { CashQuoteForm } from "@/components/forms/cash-quote-form";
import { getServiceCatalogue } from "@/lib/pol263";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Funeral Cost Estimate",
  description:
    "Select the funeral services you need and get a live cash-price estimate from Diaspora Funeral Services — no obligation.",
};

export default async function CashQuotePage() {
  const { data: services } = await getServiceCatalogue();

  return (
    <>
      <PageHeader
        eyebrow="Cost estimate"
        title="Price out the services you need."
        intro="Tick what you want and watch the total update live. Send it to us when you're ready — no obligation, no account needed."
      >
        <a
          href={site.contact.atNeedPhoneHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-ink"
        >
          <Phone className="size-4" /> Prefer to talk it through? {site.contact.atNeedPhoneDisplay}
        </a>
      </PageHeader>
      <section className="bg-void py-12 md:py-16">
        <Container className="max-w-3xl">
          <CashQuoteForm services={services} />
        </Container>
      </section>
    </>
  );
}
