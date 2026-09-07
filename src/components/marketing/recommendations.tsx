"use client";

import Link from "next/link";
import { Plus, Check } from "lucide-react";
import { useSelection, toggleService } from "@/lib/selection-store";
import { recommendServices, recommendBundles } from "@/lib/recommendations";
import { track } from "@/lib/analytics";

/**
 * "Complete the experience" — contextual, non-aggressive recommendations
 * (MEGA PROMPT §12). Reads the in-progress selection so it reacts as the
 * customer builds their funeral.
 */
export function Recommendations({
  packageSlug,
  seedServices = [],
  heading = "Complete the experience",
  intro,
}: {
  packageSlug?: string | null;
  seedServices?: string[];
  heading?: string;
  intro?: string;
}) {
  const selection = useSelection();
  const chosen = Array.from(new Set([...selection.serviceSlugs, ...seedServices]));
  const pkg = packageSlug ?? selection.packageSlug;

  const serviceRecs = recommendServices({ packageSlug: pkg, chosen, limit: 4 });
  const bundleRecs = recommendBundles({ packageSlug: pkg, chosen, limit: 2 });

  if (serviceRecs.length === 0 && bundleRecs.length === 0) return null;

  return (
    <div className="rounded-2xl border border-champagne-deep/25 bg-champagne/10 p-6">
      <p className="text-sm font-semibold text-ink">{heading}</p>
      {intro && <p className="mt-1 text-sm text-charcoal">{intro}</p>}

      {serviceRecs.length > 0 && (
        <ul className="mt-4 space-y-2">
          {serviceRecs.map(({ service, reason }) => {
            const on = selection.serviceSlugs.includes(service.slug);
            return (
              <li
                key={service.slug}
                className="flex items-start justify-between gap-3 rounded-xl bg-surface p-3"
              >
                <div>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm font-medium text-ink hover:text-champagne-deep"
                  >
                    {service.name}
                  </Link>
                  <p className="text-xs text-stone">{reason}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nowOn = toggleService(service.slug);
                    track({ name: nowOn ? "service_added" : "service_removed", slug: service.slug });
                  }}
                  className="inline-flex shrink-0 items-center gap-1 rounded-full border border-champagne-deep/40 px-2.5 py-1 text-xs text-ink hover:bg-champagne/20"
                >
                  {on ? (
                    <>
                      <Check className="size-3.5" /> Added
                    </>
                  ) : (
                    <>
                      <Plus className="size-3.5" /> Add
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {bundleRecs.length > 0 && (
        <div className="mt-4 border-t border-champagne-deep/20 pt-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-champagne-deep">
            Or add a collection
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {bundleRecs.map(({ bundle }) => (
              <li key={bundle.slug}>
                <Link
                  href={`/services#${bundle.slug}`}
                  className="inline-flex rounded-full bg-surface px-3 py-1 text-xs text-ink hover:bg-champagne/20"
                >
                  {bundle.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
