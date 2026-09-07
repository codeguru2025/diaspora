import { getPackages } from "@/lib/pol263";
import { PackageCard } from "./package-card";

/** Server component — resolves packages (POL263 or fallback) and renders the grid. */
export async function PackageGrid({ limit }: { limit?: number }) {
  const res = await getPackages();
  const pkgs = limit ? res.data.slice(0, limit) : res.data;
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {pkgs.map((p) => (
        <PackageCard key={p.slug} pkg={p} featured={p.mostPopular} />
      ))}
    </div>
  );
}
