import { PageHeader } from "@/components/marketing/page-header";
import { Section } from "@/components/ui/section";
import { NeedsInput } from "@/components/ui/primitives";

/**
 * Legal documents must be drafted / reviewed by DFS and their legal advisers
 * (MEGA PROMPT §59). We render the structure and the sections that will be needed,
 * clearly marked as not-yet-final, rather than inventing binding wording.
 */
export function LegalPlaceholder({
  title,
  intro,
  sections,
  disclaimers,
}: {
  title: string;
  intro: string;
  sections: string[];
  disclaimers?: string[];
}) {
  return (
    <>
      <PageHeader eyebrow="Legal" title={title} intro={intro} />
      <Section tone="ivory">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl border border-champagne-deep/30 bg-champagne/10 p-4 text-sm text-charcoal">
            <NeedsInput>
              This document is a placeholder. Final wording must be drafted and approved by DFS and
              its legal advisers before publication. Nothing here is legally binding.
            </NeedsInput>
          </div>

          <h2 className="mt-8 text-xl">Sections this document will cover</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-charcoal">
            {sections.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>

          {disclaimers && disclaimers.length > 0 && (
            <>
              <h2 className="mt-10 text-xl">Disclaimers to include</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-charcoal">
                {disclaimers.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </>
          )}

          <p className="mt-10 text-sm text-stone">
            Questions about your policy in the meantime? Contact us and a consultant will help.
          </p>
        </div>
      </Section>
    </>
  );
}
