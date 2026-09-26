import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/marketing/page-header";
import { Section } from "@/components/ui/section";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { CasketSlideshow } from "@/components/marketing/casket-slideshow";
import { CtaBand } from "@/components/marketing/sections";
import { galleryCategories } from "@/config/content";
import { GALLERY_PHOTOS } from "@/lib/stock-photos";
import { REAL_GALLERY_PHOTOS } from "@/lib/service-photos";

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
        intro="Elegant funeral setups, personalisation, memorial details and the moments that matter."
      />

      <Section tone="ivory">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleryCategories.map((cat, i) =>
            cat === "Caskets" ? (
              <figure
                key={cat}
                className="overflow-hidden dfs-card rounded-[4px] sm:col-span-2"
              >
                <CasketSlideshow />
                <figcaption className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-charcoal">
                  <span>{cat}</span>
                  <Link href="/custom-caskets" className="font-medium text-champagne-deep hover:underline">
                    See custom caskets
                  </Link>
                </figcaption>
              </figure>
            ) : (
              <figure
                key={cat}
                className="overflow-hidden dfs-card rounded-[4px]"
              >
                {REAL_GALLERY_PHOTOS[cat] || GALLERY_PHOTOS[cat] ? (
                  <Image
                    src={(REAL_GALLERY_PHOTOS[cat] ?? GALLERY_PHOTOS[cat]).src}
                    alt={cat}
                    width={(REAL_GALLERY_PHOTOS[cat] ?? GALLERY_PHOTOS[cat]).width}
                    height={(REAL_GALLERY_PHOTOS[cat] ?? GALLERY_PHOTOS[cat]).height}
                    className={`w-full object-cover ${i % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/3]"}`}
                  />
                ) : (
                  <ImagePlaceholder
                    direction="Human, authentic, elegant, Zimbabwean where possible, dignified and warm. No graphic grief, no fear-based imagery, minimal coffin imagery."
                    aspect={i % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/3]"}
                    className="rounded-none"
                  />
                )}
                <figcaption className="px-4 py-3 text-sm text-charcoal">{cat}</figcaption>
              </figure>
            ),
          )}
        </div>
      </Section>

      <CtaBand
        title="See something you'd want for your family?"
        primary={{ label: "Explore our services", href: "/services" }}
        secondary={{ label: "Get a quote", href: "/get-a-quote" }}
      />
    </>
  );
}
