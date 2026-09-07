"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { ServiceCard } from "./service-card";
import { serviceCategories, services, pricingModelLabels } from "@/config/services";

const packageFilters = [
  { key: "all", label: "All packages" },
  { key: "essential", label: "Essential" },
  { key: "classic", label: "Classic" },
  { key: "prestige", label: "Prestige" },
  { key: "bespoke", label: "Bespoke" },
] as const;

const priceFilters = [
  { key: "all", label: "Any pricing" },
  { key: "one-time", label: "One-time fee" },
  { key: "monthly-premium", label: "Adjusts premium" },
  { key: "custom-quote", label: "Custom quote" },
] as const;

export function ServicesBrowser() {
  const [category, setCategory] = useState<string>("all");
  const [pkg, setPkg] = useState<string>("all");
  const [price, setPrice] = useState<string>("all");

  const filtered = useMemo(() => {
    return services
      .filter((s) => s.active)
      .filter((s) => category === "all" || s.category === category)
      .filter(
        (s) =>
          pkg === "all" ||
          s.availability[pkg as "essential"] === "included" ||
          s.availability[pkg as "essential"] === "addon",
      )
      .filter((s) => price === "all" || s.pricing.model === price)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [category, pkg, price]);

  return (
    <div>
      <div className="space-y-4">
        <FilterRow label="Category">
          <Chip active={category === "all"} onClick={() => setCategory("all")}>
            All
          </Chip>
          {serviceCategories.map((c) => (
            <Chip
              key={c.slug}
              active={category === c.slug}
              onClick={() => {
                setCategory(c.slug);
                track({ name: "service_viewed", slug: `category:${c.slug}` });
              }}
            >
              {c.name}
            </Chip>
          ))}
        </FilterRow>

        <div className="flex flex-wrap gap-6">
          <FilterRow label="Available with">
            {packageFilters.map((f) => (
              <Chip key={f.key} active={pkg === f.key} onClick={() => setPkg(f.key)}>
                {f.label}
              </Chip>
            ))}
          </FilterRow>
          <FilterRow label="Pricing">
            {priceFilters.map((f) => (
              <Chip key={f.key} active={price === f.key} onClick={() => setPrice(f.key)}>
                {f.label}
              </Chip>
            ))}
          </FilterRow>
        </div>
      </div>

      <p className="mt-6 text-sm text-stone">
        {filtered.length} {filtered.length === 1 ? "service" : "services"}
        {category !== "all" && ` in ${serviceCategories.find((c) => c.slug === category)?.name}`}
      </p>

      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <ServiceCard key={s.slug} service={s} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-line-strong p-10 text-center">
          <p className="text-stone">No services match these filters yet.</p>
          <p className="mt-1 text-sm text-mist">
            Looking for something specific? Our Bespoke service exists for exactly that — name it and
            we&rsquo;ll provide it.
          </p>
        </div>
      )}

      <p className="mt-8 text-xs text-mist">
        Pricing treatments: {Object.values(pricingModelLabels).join(" · ")}. Actual amounts are
        confirmed in your quote.
      </p>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
        active
          ? "border-ink bg-ink text-ivory"
          : "border-line-strong bg-surface text-stone hover:border-ink/40 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
