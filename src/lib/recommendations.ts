/**
 * Contextual service recommendations (MEGA PROMPT §12).
 *
 * Pure, deterministic logic — given a package and the services already chosen,
 * return a short ranked list of relevant services and bundles, each with a
 * human reason. Recommendations are suggestive, never aggressive, and never use
 * manipulative language around death.
 *
 * When the `add_ons` schema is extended in POL263 (see docs/POL263-ADDON-SCHEMA.md)
 * the `recommendedPackages` / `bundleIds` / `relatedServices` fields there feed
 * this same shape, so components don't change.
 */

import { services, type ServiceItem, type PackageSlug } from "@/config/services";
import { bundles, type Bundle } from "@/config/bundles";
import { packages } from "@/config/packages";

export type ServiceRec = { service: ServiceItem; reason: string; score: number };
export type BundleRec = { bundle: Bundle; reason: string; score: number };

const PACKAGE_REASON: Record<PackageSlug, string> = {
  essential: "A dignified addition to an Essential funeral",
  classic: "Chosen often alongside a Classic package",
  prestige: "Completes the experience for a Prestige funeral",
  bespoke: "Fits a fully personalised farewell",
};

export function recommendServices(input: {
  packageSlug?: string | null;
  chosen: string[];
  limit?: number;
}): ServiceRec[] {
  const { packageSlug, chosen, limit = 4 } = input;
  const chosenSet = new Set(chosen);
  const scores = new Map<string, { score: number; reasons: Set<string> }>();

  const bump = (slug: string, by: number, reason: string) => {
    if (chosenSet.has(slug)) return;
    const cur = scores.get(slug) ?? { score: 0, reasons: new Set<string>() };
    cur.score += by;
    cur.reasons.add(reason);
    scores.set(slug, cur);
  };

  // 1. Services related to what's already chosen (strongest signal).
  for (const slug of chosen) {
    const svc = services.find((s) => s.slug === slug);
    svc?.relatedServices.forEach((r) => bump(r, 3, `Pairs with ${svc.name}`));
    // Explicit upsell copy on the chosen item.
    if (svc?.upsellMessage) {
      svc.relatedServices.forEach((r) => bump(r, 1, svc.upsellMessage!));
    }
  }

  // 2. Services included/available for the selected package that elevate it.
  if (packageSlug) {
    for (const s of services) {
      if (!s.active) continue;
      const avail = s.availability[packageSlug as PackageSlug];
      if (avail === "addon" && (s.category === "media-memories" || s.category === "personalisation-memorial")) {
        bump(s.slug, packageSlug === "prestige" || packageSlug === "bespoke" ? 2 : 1, PACKAGE_REASON[packageSlug as PackageSlug]);
      }
    }
  }

  // 3. Round out common gaps — if they have media but no record for absent family.
  const hasMedia = chosen.some((c) => ["photography", "videography", "livestreaming"].includes(c));
  if (hasMedia) {
    bump("memorial-video", 2, "Turns the coverage into a keepsake film");
    bump("online-tribute", 1, "One link to share the day with everyone");
  }

  return [...scores.entries()]
    .map(([slug, v]) => {
      const service = services.find((s) => s.slug === slug);
      return service && service.active
        ? { service, reason: [...v.reasons][0], score: v.score }
        : null;
    })
    .filter((r): r is ServiceRec => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function recommendBundles(input: {
  packageSlug?: string | null;
  chosen: string[];
  limit?: number;
}): BundleRec[] {
  const { packageSlug, chosen, limit = 2 } = input;
  const chosenSet = new Set(chosen);

  return bundles
    .map((bundle) => {
      let score = 0;
      const reasons: string[] = [];
      // Overlap with what they've chosen.
      const overlap = bundle.items.filter((i) => chosenSet.has(i)).length;
      if (overlap > 0) {
        score += overlap * 2;
        reasons.push(`You've already chosen ${overlap} of these`);
      }
      // Recommended for this package.
      if (packageSlug && bundle.recommendedFor.includes(packageSlug)) {
        score += 2;
        reasons.push(`Suited to a ${packages.find((p) => p.slug === packageSlug)?.name ?? ""} package`.trim());
      }
      return { bundle, reason: reasons[0] ?? bundle.blurb, score };
    })
    .filter((b) => b.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
