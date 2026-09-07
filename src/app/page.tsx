import Link from "next/link";
import { HomeHero } from "@/components/marketing/hero";
import { PackageGrid } from "@/components/marketing/package-grid";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import {
  CtaBand,
  FuneralNowBand,
  Steps,
  DifferenceSection,
  NameItShowcase,
  DiasporaSection,
  TrustStrip,
  ConciergeSection,
} from "@/components/marketing/sections";
import { ServiceCard } from "@/components/marketing/service-card";
import { getService } from "@/config/services";
import { cta } from "@/config/site";

const memoriesSlugs = ["photography", "videography", "livestreaming", "memorial-video"];
const careSlugs = ["grief-counselling", "will-writing", "post-funeral-support", "travel-assistance"];

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <DifferenceSection />

      {/* Packages */}
      <Section tone="ivory" id="packages">
        <SectionHeading
          eyebrow="Our packages"
          title="Four packages. One promise to every family."
          intro="Choose the level of care and choice that fits your family — from simple and dignified to entirely bespoke."
        />
        <div className="mt-10">
          <PackageGrid />
        </div>
        <div className="mt-8">
          <Button href={cta.packages.href} variant="secondary">
            Compare all packages
          </Button>
        </div>
      </Section>

      <NameItShowcase />

      <DiasporaSection />

      <FuneralNowBand />

      {/* Memories */}
      <Section tone="surface">
        <SectionHeading
          eyebrow="Media & memories"
          title="Preserve the memories."
          intro="For the family who cannot travel, and the family who barely remember the day — a full visual record of the farewell."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {memoriesSlugs.map((s) => {
            const svc = getService(s);
            return svc ? <ServiceCard key={s} service={svc} /> : null;
          })}
        </div>
      </Section>

      {/* Family care */}
      <Section tone="cream">
        <SectionHeading
          eyebrow="Family support"
          title="Caring doesn't end at the graveside."
          intro="Grief support, will writing, travel assistance and post-funeral support — for the weeks that are often the hardest."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {careSlugs.map((s) => {
            const svc = getService(s);
            return svc ? <ServiceCard key={s} service={svc} /> : null;
          })}
        </div>
      </Section>

      <Steps tone="ivory" />

      <ConciergeSection />

      <TrustStrip />

      <CtaBand />

      <Section tone="cream">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="max-w-md text-stone">
            Prefer to talk it through? A Funeral Care Consultant can walk you through packages,
            services and pricing.
          </p>
          <Button href={cta.consultant.href} variant="outline">
            {cta.consultant.label}
          </Button>
        </div>
        <p className="mt-6 text-xs text-mist">
          <Link href="/resources" className="underline">
            Read our funeral planning and diaspora guides
          </Link>
        </p>
      </Section>
    </>
  );
}
