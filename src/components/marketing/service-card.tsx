import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import { pricingModelLabels, type ServiceItem } from "@/config/services";

export function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-raised)]"
    >
      <div
        aria-hidden
        className="mb-4 grid aspect-[4/3] place-items-center rounded-xl bg-gradient-to-br from-cream to-sand text-xs font-medium uppercase tracking-widest text-mist"
      >
        Image · {service.name}
      </div>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg leading-snug">{service.name}</h3>
        <ArrowUpRight className="mt-1 size-4 shrink-0 text-mist transition-colors group-hover:text-ink" />
      </div>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-stone">{service.shortDescription}</p>
      <div className="mt-4 flex items-center gap-2">
        <Badge tone="outline">{pricingModelLabels[service.pricing.model] ?? "Priced on request"}</Badge>
      </div>
    </Link>
  );
}
