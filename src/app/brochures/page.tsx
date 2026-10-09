import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Download, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/marketing/sections";
import { productBrochures, serviceBrochures, type Brochure } from "@/config/brochures";

export const metadata: Metadata = {
  title: "Brochures",
  description:
    "Diaspora Funeral Services brochures — our services, caskets, transport, tents, catering, wreaths, memorial products, grave markers and travel packs. View or download.",
};

function BrochureCard({ b }: { b: Brochure }) {
  return (
    <figure className="dfs-card flex flex-col overflow-hidden rounded-[4px]">
      <a href={b.src} target="_blank" rel="noopener" aria-label={`Open the ${b.title} brochure full size`}>
        <Image
          src={b.src}
          alt={`${b.title} — Diaspora Funeral Services brochure`}
          width={b.width}
          height={b.height}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="aspect-[2/3] w-full object-cover object-top transition-opacity hover:opacity-90"
        />
      </a>
      <figcaption className="flex flex-1 flex-col gap-2 px-4 py-3">
        <span className="text-sm font-medium text-ink">{b.title}</span>
        <span className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <a href={b.src} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-medium text-champagne-deep hover:underline">
            <ExternalLink className="h-3.5 w-3.5" aria-hidden /> View
          </a>
          <a href={b.src} download={`DFS-${b.slug}.jpg`} className="inline-flex items-center gap-1 font-medium text-champagne-deep hover:underline">
            <Download className="h-3.5 w-3.5" aria-hidden /> Download
          </a>
          {b.href && (
            <Link href={b.href} className="text-stone hover:underline">
              Learn more
            </Link>
          )}
        </span>
      </figcaption>
    </figure>
  );
}

export default function BrochuresPage() {
  return (
    <>
      <PageHeader
        eyebrow="Brochures"
        title="Everything we offer, to keep or to share."
        intro="View or download our brochures — for yourself, or to send to family at home and abroad on WhatsApp."
      />

      <Section tone="ivory">
        <SectionHeading eyebrow="Our services" title="One sheet for each part of the farewell." />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {serviceBrochures.map((b) => <BrochureCard key={b.slug} b={b} />)}
        </div>
      </Section>

      <Section tone="cream">
        <SectionHeading eyebrow="Products" title="Caskets, transport, flowers and keepsakes." />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {productBrochures.map((b) => <BrochureCard key={b.slug} b={b} />)}
        </div>
      </Section>

      <CtaBand
        title="Seen what your family needs?"
        primary={{ label: "Get a quote", href: "/get-a-quote" }}
        secondary={{ label: "Speak to a consultant", href: "/contact" }}
      />
    </>
  );
}
