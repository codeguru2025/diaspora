import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatPrice, scheduleLabel } from "@/lib/format";
import { Badge, NeedsInput } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import type { ResolvedPackage } from "@/lib/pol263";

const accentBar: Record<string, string> = {
  sage: "bg-sage",
  champagne: "bg-champagne",
  clay: "bg-clay",
  terracotta: "bg-terracotta",
};

export function PackageCard({
  pkg,
  featured = false,
}: {
  pkg: ResolvedPackage;
  featured?: boolean;
}) {
  const price = pkg.price ? formatPrice(pkg.price.amount, pkg.price.currency) : null;

  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl border bg-surface p-6 shadow-[var(--shadow-soft)]",
        featured ? "border-champagne-deep/40 ring-1 ring-champagne-deep/20" : "border-line",
      )}
    >
      <span className={cn("absolute inset-x-0 top-0 h-1", accentBar[pkg.accent])} aria-hidden />

      <div className="flex items-center justify-between gap-3">
        <h3 className="text-2xl">{pkg.name}</h3>
        {pkg.mostPopular && <Badge tone="accent">Most chosen</Badge>}
      </div>
      <p className="mt-1 text-sm font-medium text-champagne-deep">{pkg.positioning}</p>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-stone">{pkg.summary}</p>

      <div className="mt-5 border-t border-line pt-4">
        {price ? (
          <p className="text-ink">
            <span className="text-xs text-stone">from</span>{" "}
            <span className="text-xl font-semibold">{price}</span>{" "}
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
            <Check className="mt-0.5 size-4 shrink-0 text-sage" aria-hidden />
            <span>{h}</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 rounded-xl bg-cream px-3 py-2 text-xs text-stone">{pkg.concierge}</p>

      <div className="mt-5 grid gap-2">
        <Button href={`/get-a-quote?package=${pkg.slug}`} variant="primary" size="sm">
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
