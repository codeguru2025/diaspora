import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Section, SectionHeading } from "@/components/ui/section";
import { LeadForm } from "@/components/forms/lead-form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Tribute Pages",
  description:
    "A shareable online memorial page from Diaspora Funeral Services — service details and a tribute wall for messages from family and friends, wherever they are.",
};

const included = [
  "A private, shareable link — no account needed to view it",
  "Funeral announcement and service details in one place",
  "A tribute wall where family and friends can leave a message",
  "Livestream link shared here when one is arranged",
];

export default function TributeLandingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Digital & memorial"
        title="One link. Everyone who cared, included."
        intro="A Tribute Page brings the announcement, the service details and a place for messages of support together — so family abroad are never the last to know, and never left out of remembering."
      />

      <Section tone="ivory">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <SectionHeading eyebrow="What's included" title="What a Tribute Page gives your family" />
            <ul className="mt-6 space-y-3">
              {included.map((i) => (
                <li key={i} className="flex gap-2.5 text-charcoal">
                  <Check className="mt-1 size-4 shrink-0 text-sage" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 dfs-card rounded-[4px] p-6">
              <p className="text-sm text-stone">
                See the format before requesting one — this is a fictional example, not a real
                memorial.
              </p>
              <Button href="/tribute/sample" variant="outline" className="mt-4">
                View a sample tribute page →
              </Button>
            </div>
            <p className="mt-6 text-sm text-stone">
              Tribute Pages are part of{" "}
              <Link href="/services/online-tribute" className="text-champagne-deep hover:text-ink">
                Online Tribute &amp; Announcement
              </Link>{" "}
              in our services marketplace, and included in{" "}
              <Link href="/digital-services" className="text-champagne-deep hover:text-ink">
                the Digital Memory Collection
              </Link>
              .
            </p>
          </div>

          <LeadForm
            source="tribute_request"
            title="Request a tribute page"
            description="Tell us a little about the service and we'll set one up with your family."
            submitLabel="Request a tribute page"
            extraFields={[
              { name: "serviceDate", label: "Approximate service date", type: "text", placeholder: "If known" },
            ]}
          />
        </div>
      </Section>
    </>
  );
}
