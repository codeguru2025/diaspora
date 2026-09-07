import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/marketing/page-header";
import { Section, SectionHeading } from "@/components/ui/section";
import { Badge } from "@/components/ui/primitives";
import { CtaBand } from "@/components/marketing/sections";
import { resources, resourceCategories } from "@/config/resources";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Funeral planning checklists, diaspora family support guides, grief and bereavement resources, and legal and estate planning basics from Diaspora Funeral Services.",
};

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Practical guidance, for a difficult time."
        intro="Planning ahead, supporting a funeral from abroad, or facing a loss now — clear, calm guides written to actually help."
      />

      <Section tone="ivory">
        {resourceCategories.map((cat) => {
          const items = resources.filter((r) => r.category === cat.slug);
          if (items.length === 0) return null;
          return (
            <div key={cat.slug} className="mb-14 last:mb-0">
              <SectionHeading eyebrow={cat.title} title={cat.description} />
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/resources/${r.slug}`}
                    className="group flex flex-col rounded-2xl border border-line bg-surface p-5 hover:border-ink/25"
                  >
                    <Badge tone="outline">{r.readingTime} read</Badge>
                    <h3 className="mt-3 text-lg leading-snug group-hover:text-champagne-deep">
                      {r.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-stone">{r.excerpt}</p>
                    <span className="mt-3 text-sm font-medium text-champagne-deep">Read guide →</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
        <p className="mt-4 text-xs text-mist">
          Full article content is written and reviewed by DFS. Each guide currently shows an outline.
        </p>
      </Section>

      <CtaBand
        title="When you're ready, we're here."
        primary={{ label: "Protect My Family", href: "/protect-my-family" }}
        secondary={{ label: "Arrange a Funeral Now", href: "/arrange-a-funeral" }}
      />
    </>
  );
}
