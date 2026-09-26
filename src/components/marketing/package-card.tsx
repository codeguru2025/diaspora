import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatPrice, scheduleLabel } from "@/lib/format";
import { Badge, NeedsInput } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import type { ResolvedPackage } from "@/lib/pol263";
import { SERVICE_PHOTOS } from "@/lib/service-photos";

export function PackageCard({
  pkg,
  featured = false,
}: {
  pkg: ResolvedPackage;
  featured?: boolean;
}) {
  const price = pkg.price ? formatPrice(pkg.price.amount, pkg.price.currency) : null;
  const photo = pkg.heroImageSlug ? SERVICE_PHOTOS[pkg.heroImageSlug] : undefined;

  return (
    <article
      className={cn(
        "group dfs-card dfs-card-hover relative flex flex-col overflow-hidden rounded-[4px] p-7",
        featured && "border-champagne/45 shadow-[0_30px_60px_-30px_rgba(207,174,109,0.35)]",
      )}
    >
      {featured && (
        <span aria-hidden className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-champagne to-transparent" />
      )}

      {photo && (
        <Image
          src={photo.src}
          alt={`${pkg.name} package casket`}
          width={photo.width}
          height={photo.height}
          className="-mx-7 -mt-7 mb-6 aspect-[16/10] w-[calc(100%+3.5rem)] max-w-none object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-100"
        />
      )}

      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[1.75rem]">{pkg.name}</h3>
        {pkg.mostPopular && <Badge tone="accent">Most chosen</Badge>}
      </div>
      <p className="mt-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-champagne">{pkg.positioning}</p>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-stone">{pkg.summary}</p>

      <div className="mt-5 border-t border-line pt-4">
        {price ? (
          <p className="text-ink">
            <span className="text-xs text-stone">from</span>{" "}
            <span className="font-[family-name:var(--font-display)] text-3xl">{price}</span>{" "}
            <span className="text-sm text-stone">{scheduleLabel(pkg.price!.schedule)}</span>
          </p>
        ) : (
          <p className="text-sm text-stone">
            Pricing <NeedsInput>configured in POL263</NeedsInput>
          </p>
        )}
      </div>

      <ul className="mt-4 flex-1 space-y-2 text-sm text-charcoal">
        {pkg.highlights.slice(0, 4).map((h, i) => (
          <li key={i} className="flex gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-champagne" aria-hidden />
            <span>{h}</span>
          </li>
        ))}
      </ul>

      <p className="mt-5 border-l border-champagne/40 pl-3 text-xs italic text-stone">{pkg.concierge}</p>

      <div className="mt-5 grid gap-2">
        <Button href={`/get-a-quote?package=${pkg.slug}`} variant={featured ? "primary" : "secondary"} size="sm">
          Get a Quote
        </Button>
        <Link
          href={`/packages/${pkg.slug}`}
          className="text-center text-sm font-medium text-stone hover:text-ink"
        >
          View {pkg.name} details
        </Link>
      </div>
    </article>
  );
}
