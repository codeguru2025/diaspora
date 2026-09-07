import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/page-header";
import { Section, SectionHeading } from "@/components/ui/section";
import { ServicesBrowser } from "@/components/marketing/services-browser";
import { BundleCard } from "@/components/marketing/bundle-card";
import { CtaBand } from "@/components/marketing/sections";
import { Button } from "@/components/ui/button";
import { bundles } from "@/config/bundles";
import { cta } from "@/config/site";

export const metadata: Metadata = {
  title: "Funeral Services",
  description:
    "The Diaspora Funeral Services personalisation marketplace. Custom caskets, grave markers, photography, livestreaming, catering, décor, travel packs, grief support and more. Start with your package, then make it yours.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Funeral services"
        title="Start with your package. Then make it yours."
        intro="A funeral is deeply personal. That's why we've gone beyond the traditional funeral package — with a wide catalogue of services you can add to any cover."
      >
        <div className="flex flex-wrap gap-3">
          <Button href={cta.quote.href}>Build your funeral in a quote</Button>
          <Button href="#collections" variant="outline">
            See curated collections
          </Button>
        </div>
      </PageHeader>

      <Section tone="ivory">
        <ServicesBrowser />
      </Section>

      <Section tone="cream" id="collections">
        <SectionHeading
          eyebrow="Curated collections"
          title="Considered combinations, not an endless catalogue."
          intro="Each collection brings together the services families most often choose together. Add a whole collection, or pick from it."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bundles.map((b) => (
            <div key={b.slug} id={b.slug}>
              <BundleCard bundle={b} />
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-mist">
          Religious and ceremonial options are always optional. We never assume a family&rsquo;s
          tradition.
        </p>
      </Section>

      <CtaBand
        title="Name it. We provide it."
        body="If there's something you want that isn't listed here, that's what our Bespoke service is for. Tell us what you have in mind and we'll prepare a plan and a quotation."
        primary={{ label: "Request a bespoke service", href: "/contact?topic=bespoke" }}
        secondary={cta.quote}
      />
    </>
  );
}
