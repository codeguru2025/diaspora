import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/marketing/page-header";
import { Section, SectionHeading } from "@/components/ui/section";
import { ServiceCard } from "@/components/marketing/service-card";
import { BundleCard } from "@/components/marketing/bundle-card";
import { CtaBand } from "@/components/marketing/sections";
import { Button } from "@/components/ui/button";
import { getService } from "@/config/services";
import { getBundle } from "@/config/bundles";

export const metadata: Metadata = {
  title: "Digital & Memorial Services",
  description:
    "Funeral livestreaming, videography, photography, memorial videos and online tributes from Diaspora Funeral Services — so no one is left out and nothing is forgotten.",
};

const slugs = ["livestreaming", "videography", "photography", "memorial-video", "online-tribute"];

export default function DigitalServicesPage() {
  const svcs = slugs.map(getService).filter(Boolean);
  const bundle = getBundle("the-digital-memory-collection");
  return (
    <>
      <PageHeader
        eyebrow="Digital & memorial"
        title="Preserve the memories. Include everyone."
        intro="A modern, international standard of funeral media — for the family who cannot travel, and the family who will want to remember the day for years to come."
      />

      <Section tone="ivory">
        <SectionHeading eyebrow="Services" title="Digital memorial services" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {svcs.map((s) => (
            <ServiceCard key={s!.slug} service={s!} />
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4 dfs-card rounded-[4px] p-5">
          <p className="flex-1 text-sm text-stone">
            A Tribute Page is a shareable link with the announcement, service details and a
            tribute wall for messages from family and friends.
          </p>
          <Button href="/tribute" variant="outline" size="sm">
            Learn about Tribute Pages
          </Button>
        </div>
      </Section>

      {bundle && (
        <Section tone="cream">
          <SectionHeading eyebrow="Collection" title="The Digital Memory Collection" />
          <div className="mt-8 max-w-md">
            <BundleCard bundle={bundle} />
          </div>
        </Section>
      )}

      <CtaBand
        title="So no one is left out, and nothing is forgotten."
        primary={{ label: "Get a quote", href: "/get-a-quote" }}
        secondary={{ label: "For the diaspora", href: "/for-the-diaspora" }}
      />
    </>
  );
}
