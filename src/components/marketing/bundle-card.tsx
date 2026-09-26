import Link from "next/link";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/primitives";
import { getService } from "@/config/services";
import type { Bundle } from "@/config/bundles";

const accent: Record<string, string> = {
  champagne: "from-champagne/20",
  sage: "from-sage/15",
  clay: "from-clay/15",
  terracotta: "from-terracotta/12",
};

export function BundleCard({ bundle }: { bundle: Bundle }) {
  const items = bundle.items.map(getService).filter(Boolean).slice(0, 6);
  return (
    <Link
      href={`/services#${bundle.slug}`}
      className="group flex flex-col overflow-hidden dfs-card rounded-[4px] shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-raised)]"
    >
      <div className={cn("bg-gradient-to-br to-surface p-6", accent[bundle.accent])}>
        <div className="flex items-center gap-2">
          <h3 className="text-xl">{bundle.name}</h3>
          {bundle.ceremonial === "catholic" && <Badge tone="sage">Ceremonial · optional</Badge>}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-charcoal">{bundle.blurb}</p>
      </div>
      <ul className="flex flex-1 flex-wrap content-start gap-1.5 p-5">
        {items.map((s) => (
          <li key={s!.slug}>
            <span className="inline-flex rounded-full bg-cream px-2.5 py-1 text-xs text-stone">
              {s!.name}
            </span>
          </li>
        ))}
        {bundle.items.length > items.length && (
          <li>
            <span className="inline-flex rounded-full bg-cream px-2.5 py-1 text-xs text-stone">
              +{bundle.items.length - items.length} more
            </span>
          </li>
        )}
      </ul>
      <p className="border-t border-line px-5 py-3 text-xs text-mist">
        Priced as the sum of the selected services. Any bundle saving is applied in your quote.
      </p>
    </Link>
  );
}
