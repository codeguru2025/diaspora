import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/marketing/page-header";
import { Section } from "@/components/ui/section";
import { CtaBand } from "@/components/marketing/sections";
import { resources, getResource, resourceCategories } from "@/config/resources";
import { resourceArticles } from "@/config/resource-articles";

export function generateStaticParams() {
  return resources.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = getResource(slug);
  if (!r) return {};
  return { title: r.title, description: r.excerpt };
}

export default async function ResourceArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = getResource(slug);
  if (!r) notFound();
  const cat = resourceCategories.find((c) => c.slug === r.category);
  const body = resourceArticles[r.slug] ?? [];
  const related = resources.filter((x) => x.category === r.category && x.slug !== r.slug).slice(0, 3);

  return (
    <>
      <PageHeader eyebrow={cat?.title} title={r.title} intro={r.excerpt} />

      <Section tone="ivory">
        <article className="dfs-prose mx-auto max-w-2xl">
          <p className="text-sm text-stone">
            {r.readingTime} read · Updated {r.updated}
          </p>
          <h2>In this guide</h2>
          <ul>
            {r.outline.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
          {body.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </section>
          ))}
        </article>

        {related.length > 0 && (
          <div className="mx-auto mt-14 max-w-2xl border-t border-line pt-8">
            <h2 className="text-lg">Related guides</h2>
            <ul className="mt-3 space-y-2">
              {related.map((x) => (
                <li key={x.slug}>
                  <Link href={`/resources/${x.slug}`} className="text-champagne-deep hover:text-ink">
                    {x.title} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      <CtaBand
        primary={{ label: "Protect My Family", href: "/protect-my-family" }}
        secondary={{ label: "Speak to someone", href: "/contact" }}
      />
    </>
  );
}
