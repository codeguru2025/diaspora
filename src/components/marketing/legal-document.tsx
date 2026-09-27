import { PageHeader } from "@/components/marketing/page-header";
import { Section } from "@/components/ui/section";
import { site } from "@/config/site";

export type LegalSection = { heading: string; paragraphs: string[]; list?: string[] };

/**
 * A legal document page. Wording is a working draft written from how the site
 * and POL263 actually behave; DFS and its legal advisers should review it (and
 * bump `updated`) before relying on it.
 */
export function LegalDocument({
  title,
  intro,
  updated,
  sections,
}: {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHeader eyebrow="Legal" title={title} intro={intro} />
      <Section tone="ivory">
        <article className="dfs-prose mx-auto max-w-2xl">
          <p className="text-sm text-stone">Last updated: {updated}</p>
          {sections.map((s, i) => (
            <section key={s.heading}>
              <h2>
                {i + 1}. {s.heading}
              </h2>
              {s.paragraphs.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
              {s.list && (
                <ul>
                  {s.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <p className="text-sm text-stone">
            Questions about this document? Email{" "}
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> or call{" "}
            <a href={site.contact.phoneHref}>{site.contact.phoneDisplay}</a>.
          </p>
        </article>
      </Section>
    </>
  );
}
