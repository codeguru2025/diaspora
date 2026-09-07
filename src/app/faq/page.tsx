import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/page-header";
import { Section } from "@/components/ui/section";
import { Accordion } from "@/components/ui/accordion";
import { CtaBand } from "@/components/marketing/sections";
import { NeedsInput } from "@/components/ui/primitives";
import { faqCategories } from "@/config/faqs";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about joining Diaspora Funeral Services, eligibility, payments, claims, the diaspora journey, add-on services and more.",
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Questions, answered."
        intro="If you can't find what you're looking for, a Funeral Care Consultant is one call away."
      />

      <Section tone="ivory">
        <div className="mx-auto max-w-3xl space-y-12">
          {faqCategories.map((cat) => (
            <div key={cat.slug} id={cat.slug}>
              <h2 className="text-2xl">{cat.title}</h2>
              <Accordion
                className="mt-4"
                items={cat.items.map((item, i) => ({
                  id: `${cat.slug}-${i}`,
                  title: item.q,
                  content: item.needsInput ? <NeedsInput>{item.a}</NeedsInput> : item.a,
                }))}
              />
            </div>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-3xl text-xs text-mist">
          Answers marked with a dashed underline depend on the DFS funeral policy documentation and
          are placeholders until confirmed. We never publish policy rules, waiting periods or benefit
          limits we cannot stand behind.
        </p>
      </Section>

      <CtaBand
        title="Still have a question?"
        body="Talk it through with someone who does this every day."
        primary={{ label: "Speak to a consultant", href: "/contact" }}
        secondary={{ label: "Get a quote", href: "/get-a-quote" }}
      />
    </>
  );
}
