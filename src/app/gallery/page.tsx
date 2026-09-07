import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/page-header";
import { Section } from "@/components/ui/section";
import { CtaBand } from "@/components/marketing/sections";
import { galleryCategories } from "@/config/content";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A look at the caskets, grave markers, décor, flowers, funeral setups, personalisation and memorial work Diaspora Funeral Services delivers.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="The work, and the care behind it."
        intro="Elegant funeral setups, personalisation, memorial details and the moments that matter. Imagery to be supplied by DFS — the categories and layout are ready."
      />

      <Section tone="ivory">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleryCategories.map((cat, i) => (
            <figure
              key={cat}
              className="overflow-hidden rounded-2xl border border-line bg-surface"
            >
              <div
                aria-hidden
                className={`grid ${i % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/3]"} place-items-center bg-gradient-to-br from-cream to-sand text-xs font-medium uppercase tracking-widest text-mist`}
              >
                {cat}
              </div>
              <figcaption className="px-4 py-3 text-sm text-charcoal">{cat}</figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-8 text-xs text-mist">
          Photography direction: human, authentic, elegant, Zimbabwean where possible, dignified and
          warm. No graphic grief, no fear-based imagery, minimal coffin imagery. Assets required from
          DFS.
        </p>
      </Section>

      <CtaBand
        title="See something you'd want for your family?"
        primary={{ label: "Explore our services", href: "/services" }}
        secondary={{ label: "Get a quote", href: "/get-a-quote" }}
      />
    </>
  );
}
