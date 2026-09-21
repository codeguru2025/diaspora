/**
 * The four DFS policy packages.
 *
 * IMPORTANT (see MEGA PROMPT §7, §58): no real monetary prices, benefit limits,
 * waiting periods, eligibility rules or policy terms are invented here. Every such
 * value is `null` / `CONFIGURE` and is intended to be resolved at runtime from the
 * POL263 product / product_version records for the DFS organisation
 * (`lib/pol263.ts` → `getPackages()`), which map one DFS package → one POL263 product.
 *
 * `pol263ProductCode` is the join key: set it to the `products.code` in POL263 once
 * the DFS org's products are configured.
 */

import { CONFIGURE } from "./site";

export type ComparisonValue = "included" | "addon" | "not-available";

export type PackageTier = {
  slug: "essential" | "classic" | "prestige" | "bespoke";
  name: string;
  positioning: string;
  summary: string;
  /** Who this tier is designed for. */
  audience: string;
  /** Short human list of headline inclusions — presentation copy, not policy terms. */
  highlights: string[];
  /** Concierge / human-support level (MEGA PROMPT §18). */
  concierge: string;
  /** Commercially flag the most-chosen tier ONLY when POL263 supplies real data. */
  mostPopular: boolean;
  /** Join key to a POL263 `products.code`. */
  pol263ProductCode: string | null;
  /** Starting price — never hard-coded. Populated from POL263 when available. */
  startingPrice: null;
  accent: "sage" | "champagne" | "clay" | "terracotta";
  /** Slug into `SERVICE_PHOTOS` for a representative real photo, when the tier has one. */
  heroImageSlug: string | null;
};

export const packages: PackageTier[] = [
  {
    slug: "essential",
    name: "Essential",
    positioning: "Simple. Dignified. Dependable.",
    summary:
      "Affordable, fundamental funeral protection for families who want the essentials handled properly.",
    audience: "Families who want dependable cover without complexity.",
    highlights: [
      "Core funeral cover for your family",
      "Dignified coffin and hearse",
      "Burial arrangement coordination",
      "Digital communication and SMS updates",
      CONFIGURE,
    ],
    concierge: "Digital service with standard customer support.",
    mostPopular: false,
    pol263ProductCode: "ESSENTIAL",
    startingPrice: null,
    accent: "sage",
    heroImageSlug: "essential-casket",
  },
  {
    slug: "classic",
    name: "Classic",
    positioning: "More care. More choice. More comfort.",
    summary:
      "A more comprehensive funeral experience with room to personalise the details that matter.",
    audience: "Families who want more comfort and more say in the arrangements.",
    highlights: [
      "Everything in Essential",
      "Enhanced casket and ceremony options",
      "Ceremony and venue support",
      "Selected personalisation add-ons available",
      CONFIGURE,
    ],
    concierge: "Priority customer support.",
    mostPopular: false,
    pol263ProductCode: "CLASSIC",
    startingPrice: null,
    accent: "champagne",
    heroImageSlug: "custom-casket",
  },
  {
    slug: "prestige",
    name: "Prestige",
    positioning: "Elevated care for an exceptional farewell.",
    summary:
      "Premium services and an enhanced funeral experience, coordinated with close attention to detail.",
    audience: "Families who want an elevated, well-appointed farewell.",
    highlights: [
      "Everything in Classic",
      "Premium casket and floral arrangements",
      "Photography, videography and livestreaming available",
      "Memorial collateral and personalised items",
      CONFIGURE,
    ],
    concierge: "Dedicated Funeral Care support.",
    mostPopular: false,
    pol263ProductCode: "PRESTIGE",
    startingPrice: null,
    accent: "clay",
    heroImageSlug: "premium-casket",
  },
  {
    slug: "bespoke",
    name: "Bespoke",
    positioning: "Your funeral. Your vision. Our fulfilment.",
    summary:
      "For families with highly personalised requirements — designed around your wishes, coordinated end to end.",
    audience: "Families who want a farewell designed entirely around their wishes.",
    highlights: [
      "Everything in Prestige",
      "Fully personalised funeral design",
      "Custom caskets, décor and memorial pieces",
      "Highly personalised funeral coordination",
      CONFIGURE,
    ],
    concierge: "Highly personalised, end-to-end funeral coordination.",
    mostPopular: false,
    pol263ProductCode: "BESPOKE",
    startingPrice: null,
    accent: "terracotta",
    heroImageSlug: "custom-casket-showcase",
  },
];

/**
 * The package comparison matrix (MEGA PROMPT §8).
 * Each row is a capability; values are `included` ✓, `addon` +, or `not-available` —.
 * These reflect the INTENDED product architecture and must be confirmed against the
 * real POL263 product configuration before launch.
 */
export type ComparisonRow = {
  label: string;
  hint?: string;
  values: Record<PackageTier["slug"], ComparisonValue>;
};

export type ComparisonGroup = {
  group: string;
  rows: ComparisonRow[];
};

const V = (
  essential: ComparisonValue,
  classic: ComparisonValue,
  prestige: ComparisonValue,
  bespoke: ComparisonValue,
): ComparisonRow["values"] => ({ essential, classic, prestige, bespoke });

export const comparison: ComparisonGroup[] = [
  {
    group: "Core funeral cover",
    rows: [
      { label: "Funeral cover for your covered family", values: V("included", "included", "included", "included") },
      { label: "Coffin or casket", hint: "Tier and range vary by package", values: V("included", "included", "included", "included") },
      { label: "Hearse and family transport", values: V("included", "included", "included", "included") },
      { label: "Burial arrangement coordination", values: V("included", "included", "included", "included") },
      { label: "Grave preparation", values: V("addon", "included", "included", "included") },
    ],
  },
  {
    group: "Ceremony & venue",
    rows: [
      { label: "Basic ceremony support", values: V("included", "included", "included", "included") },
      { label: "Tents, chairs and PA system", values: V("addon", "addon", "included", "included") },
      { label: "Décor, floral arrangements and candles", values: V("addon", "addon", "included", "included") },
      { label: "Floodlights and extended setup", values: V("addon", "addon", "addon", "included") },
    ],
  },
  {
    group: "Personalisation & memorial",
    rows: [
      { label: "Funeral programmes and memorial collateral", values: V("addon", "addon", "included", "included") },
      { label: "Personalised items (coffin lace, blankets, banners)", values: V("addon", "addon", "addon", "included") },
      { label: "Custom-made caskets and grave markers", values: V("not-available", "addon", "addon", "included") },
      { label: "Fully bespoke funeral design", values: V("not-available", "not-available", "not-available", "included") },
    ],
  },
  {
    group: "Media & memories",
    rows: [
      { label: "Professional photography", values: V("addon", "addon", "included", "included") },
      { label: "Professional videography", values: V("addon", "addon", "addon", "included") },
      { label: "Funeral livestreaming", values: V("addon", "addon", "included", "included") },
      { label: "Memorial video and digital tribute", values: V("addon", "addon", "addon", "included") },
    ],
  },
  {
    group: "Hospitality",
    rows: [
      { label: "Graveside refreshments", values: V("addon", "addon", "included", "included") },
      { label: "Family catering package", values: V("addon", "addon", "addon", "included") },
    ],
  },
  {
    group: "Family support",
    rows: [
      { label: "Online grief support", values: V("addon", "included", "included", "included") },
      { label: "Free will-writing service", hint: "Assistance with will preparation; not a substitute for legal advice", values: V("included", "included", "included", "included") },
      { label: "Post-funeral support", values: V("addon", "addon", "included", "included") },
    ],
  },
  {
    group: "Travel & diaspora",
    rows: [
      { label: "SMS and digital communication throughout", values: V("included", "included", "included", "included") },
      { label: "Manage your policy online", values: V("included", "included", "included", "included") },
      { label: "Individual travelling pack", values: V("addon", "addon", "included", "included") },
      { label: "Family travelling pack", values: V("addon", "addon", "addon", "included") },
      { label: "Funeral attendance and travel assistance", values: V("addon", "addon", "addon", "included") },
    ],
  },
  {
    group: "Support & coordination",
    rows: [
      { label: "Customer support level", values: V("included", "included", "included", "included") },
      { label: "Dedicated Funeral Care consultant", values: V("not-available", "addon", "included", "included") },
      { label: "Personalised funeral coordination", values: V("not-available", "not-available", "addon", "included") },
    ],
  },
];

export function getPackage(slug: string) {
  return packages.find((p) => p.slug === slug) ?? null;
}
