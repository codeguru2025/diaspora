import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/page-header";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/marketing/sections";
import { Button } from "@/components/ui/button";
import { howItWorks } from "@/config/content";
import { cta } from "@/config/site";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "From choosing your funeral protection to the day itself — how Diaspora Funeral Services works, in four simple steps.",
};

const detail = [
  {
    heading: "Choose your protection",
    body: "Pick Essential, Classic, Prestige or Bespoke. Each package carries the same promise of a dignified funeral — what changes is the level of service, choice and personalisation. You can compare every inclusion side by side, and change your mind later.",
  },
  {
    heading: "Personalise it",
    body: "Add the services that matter to your family — photography, livestreaming, a custom casket, catering, décor, travel packs, grief support. Every service shows how it's priced. Start with your package, then make it yours.",
  },
  {
    heading: "Join online",
    body: "Complete your application and payment in minutes, from anywhere in the world. You create an account, add the family members you're protecting, and pay with the methods available in your country.",
  },
  {
    heading: "We take care of the rest",
    body: "When your family needs us, tell us — by phone, WhatsApp or your portal. Our team coordinates the service on the ground while you stay informed through SMS and digital updates. Add livestreaming to be present at the service itself.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="How it works"
        title="Four steps. Then we carry it."
        intro="Joining should be simple, and being far away should never mean being left out. Here's exactly how it works."
      />

      <Section tone="ivory">
        <ol className="space-y-10">
          {detail.map((d, i) => (
            <li key={d.heading} className="grid gap-4 border-b border-line pb-10 last:border-0 md:grid-cols-[auto_1fr] md:gap-8">
              <span className="font-[family-name:var(--font-display)] text-4xl text-champagne-deep">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="text-2xl">{d.heading}</h2>
                <p className="mt-2 max-w-2xl text-stone">{d.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="cream">
        <SectionHeading eyebrow="At a glance" title="Package → Family → Personalise → Review → Payment" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((s, i) => (
            <div key={s.title} className="dfs-card rounded-[4px] p-5">
              <span className="text-xs font-semibold text-champagne-deep">Step {i + 1}</span>
              <h3 className="mt-1 text-lg">{s.title}</h3>
              <p className="mt-1 text-sm text-stone">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={cta.quote.href}>{cta.quote.label}</Button>
          <Button href={cta.packages.href} variant="outline">
            {cta.packages.label}
          </Button>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
