import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/page-header";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/marketing/sections";
import { LeadForm } from "@/components/forms/lead-form";
import { diasporaPoints, diasporaCountries } from "@/config/content";
import { cta } from "@/config/site";

export const metadata: Metadata = {
  title: "For the Diaspora",
  description:
    "Funeral cover and personalised funeral services for Zimbabweans living abroad. Protect family back home, pay digitally, receive SMS updates, and stay involved from wherever you are.",
};

export default function DiasporaPage() {
  const available = diasporaCountries.filter((c) => c.available && c.code !== "ZW");
  return (
    <>
      <PageHeader
        eyebrow="For the diaspora"
        title="Thousands of kilometres away. Still completely involved."
        intro="Distance should never determine the quality of care your family receives. Set up protection for your family in Zimbabwe, pay from where you live, and know exactly what is happening — every step of the way."
        tone="ink"
      >
        <div className="flex flex-wrap gap-3">
          <Button href={cta.protectDiaspora.href} variant="accent">
            {cta.protectDiaspora.label}
          </Button>
          <Button href={cta.quote.href} variant="outline" className="border-ivory/30 text-ivory hover:bg-ivory/10">
            {cta.quote.label}
          </Button>
        </div>
      </PageHeader>

      <Section tone="ivory">
        <SectionHeading
          eyebrow="The diaspora problem"
          title="Traditional funeral cover often isn't built for you."
          intro="If your family is in Zimbabwe and you are not, the questions are different. Who arranges everything? How do you pay? How do you know it's being done properly? How are you part of it when you can't be there?"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {diasporaPoints.map((p) => (
            <div key={p.title} className="rounded-2xl border border-line bg-surface p-5">
              <p className="font-semibold text-ink">{p.title}</p>
              <p className="mt-1 text-sm text-stone">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeading
              eyebrow="How communication works"
              title="Never wonder what's happening."
              intro="From policy confirmations to funeral scheduling and service confirmations, we keep you informed through SMS and digital communication. Add livestreaming and you can be present at the service itself."
            />
            <ul className="mt-6 space-y-2 text-sm text-charcoal">
              {[
                "Registration and policy activation confirmations",
                "Payment confirmations and reminders",
                "Funeral notification and arrangements",
                "Service and livestream details",
                "The funeral schedule",
                "Post-funeral communication",
              ].map((i) => (
                <li key={i} className="rounded-lg bg-surface px-3 py-2">
                  {i}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-mist">
              Communication is delivered through the POL263 platform. Message content and timing are
              configured with DFS.
            </p>
          </div>

          <div id="register-interest">
            <LeadForm
              source="diaspora"
              title="Not in a supported country yet?"
              description="We're opening to the diaspora in stages. Leave your details and we'll tell you the moment we can serve your country."
              submitLabel="Register my interest"
              contactKind="message"
              extraFields={[
                {
                  name: "countryOfResidence",
                  label: "Country you live in",
                  type: "text",
                  required: true,
                  placeholder: "e.g. Germany",
                },
              ]}
            />
          </div>
        </div>
      </Section>

      <Section tone="ivory">
        <SectionHeading eyebrow="Where we serve" title="Joining from outside Zimbabwe" />
        <div className="mt-6 flex flex-wrap gap-2">
          {available.map((c) => (
            <span key={c.code} className="rounded-full bg-cream px-4 py-2 text-sm text-charcoal">
              {c.name}
            </span>
          ))}
          <span className="rounded-full border border-dashed border-line-strong px-4 py-2 text-sm text-stone">
            More countries coming — register your interest
          </span>
        </div>
        <p className="mt-4 text-xs text-mist">
          Country availability is controlled by DFS and confirmed during your application.
        </p>
      </Section>

      <CtaBand
        title="Your family back home. Taken care of."
        primary={cta.protectDiaspora}
        secondary={cta.consultant}
      />
    </>
  );
}
