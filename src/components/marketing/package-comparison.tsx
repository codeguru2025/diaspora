"use client";

import { Fragment, useState } from "react";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { AvailabilityMark } from "@/components/ui/primitives";
import { comparison, packages } from "@/config/packages";
import type { PackageTier } from "@/config/packages";

export function PackageComparison() {
  const slugs = packages.map((p) => p.slug);
  const [mobilePkg, setMobilePkg] = useState<PackageTier["slug"]>("classic");

  return (
    <div>
      {/* Mobile: pick one package, show its column */}
      <div className="lg:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Choose a package to compare">
          {packages.map((p) => (
            <button
              key={p.slug}
              role="tab"
              aria-selected={mobilePkg === p.slug}
              onClick={() => {
                setMobilePkg(p.slug);
                track({ name: "package_compared" });
              }}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium",
                mobilePkg === p.slug ? "bg-champagne text-void" : "bg-cream text-stone",
              )}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="mt-4 divide-y divide-line border-y border-line">
          {comparison.map((group) => (
            <div key={group.group} className="py-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-deep">
                {group.group}
              </p>
              <dl className="space-y-2.5">
                {group.rows.map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-4">
                    <dt className="text-sm text-charcoal">{row.label}</dt>
                    <dd>
                      <AvailabilityMark value={row.values[mobilePkg]} showLabel />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: full matrix */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-[38%] py-4 text-left align-bottom" />
              {packages.map((p) => (
                <th key={p.slug} className="px-3 py-4 text-left align-bottom">
                  <span className="block text-lg font-[family-name:var(--font-display)] text-ink">
                    {p.name}
                  </span>
                  <span className="block text-xs font-normal text-stone">{p.positioning}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.map((group) => (
              <Fragment key={group.group}>
                <tr>
                  <td
                    colSpan={slugs.length + 1}
                    className="pt-6 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-deep"
                  >
                    {group.group}
                  </td>
                </tr>
                {group.rows.map((row) => (
                  <tr key={row.label} className="border-t border-line">
                    <td className="py-3 pr-4 text-charcoal">
                      {row.label}
                      {row.hint && (
                        <span className="mt-0.5 block text-xs text-mist">{row.hint}</span>
                      )}
                    </td>
                    {slugs.map((s) => (
                      <td key={s} className="px-3 py-3">
                        <AvailabilityMark value={row.values[s]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-stone">
        <span className="flex items-center gap-1.5">
          <AvailabilityMark value="included" /> Included
        </span>
        <span className="flex items-center gap-1.5">
          <AvailabilityMark value="addon" /> Available as an add-on
        </span>
        <span className="flex items-center gap-1.5">
          <AvailabilityMark value="not-available" /> Not available
        </span>
      </p>
      <p className="mt-3 text-xs text-mist">
        This matrix reflects the intended package structure. Final inclusions, limits and terms are
        configured in POL263 and confirmed by DFS.
      </p>
    </div>
  );
}
