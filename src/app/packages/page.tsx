import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/page-header";
import { Section, SectionHeading } from "@/components/ui/section";
import { PackageGrid } from "@/components/marketing/package-grid";
import { PackageComparison } from "@/components/marketing/package-comparison";
import { CtaBand, ConciergeSection } from "@/components/marketing/sections";
import { Button } from "@/components/ui/button";
import { cta } from "@/config/site";

export const metadata: Metadata = {
  title: "Our Packages",
  description:
    "Compare Essential, Classic, Prestige and Bespoke funeral protection from Diaspora Funeral Services. Choose the level of care and choice that fits your family.",
};

export default function PackagesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our packages"
        title="Choose the level of care and choice that fits your family."
        intro="Every package carries the same promise — a dignified funeral, coordinated with professional support. What changes is how much you personalise, and how much support you receive."
      >
        <div className="flex flex-wrap gap-3">
          <Button href={cta.quote.href}>{cta.quote.label}</Button>
          <Button href="#compare" variant="outline">
            Compare packages
          </Button>
        </div>
      </PageHeader>

      <Section tone="ivory">
        <PackageGrid />
      </Section>

      <Section tone="cream" id="compare">
        <SectionHeading
          eyebrow="Compare"
          title="What's included, what you can add."
          intro="Included ✓ · Available as an add-on + · Not available —"
        />
        <div className="mt-10">
          <PackageComparison />
        </div>
      </Section>

      <ConciergeSection />

      <CtaBand
        title="Not sure which package is right?"
        body="Answer a few questions and we'll recommend a starting point — or talk it through with a Funeral Care Consultant."
        primary={cta.quote}
        secondary={cta.consultant}
      />
    </>
  );
}
