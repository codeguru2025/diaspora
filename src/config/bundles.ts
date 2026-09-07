/**
 * Curated add-on bundles (MEGA PROMPT §11).
 *
 * "Do not simply create a huge product catalogue. Create curated bundles."
 *
 * Bundle pricing is intentionally NOT a fixed number — a bundle's price is the sum
 * of its items priced by the backend (with any configured bundle discount applied
 * there). Religious / ceremonial bundles are clearly optional.
 */

export type Bundle = {
  slug: string;
  name: string;
  blurb: string;
  /** Service slugs (see services.ts). */
  items: string[];
  /** Optional cultural framing — never assume the customer's tradition. */
  ceremonial?: "catholic" | "traditional" | "none";
  recommendedFor: string[]; // package slugs
  accent: "champagne" | "sage" | "clay" | "terracotta";
};

export const bundles: Bundle[] = [
  {
    slug: "the-tribute-collection",
    name: "The Tribute Collection",
    blurb: "Everything that turns a service into a tribute — flowers, a banner, and a full visual record.",
    items: ["floral-arrangement", "memorial-banner", "photography", "videography", "memorial-collateral"],
    recommendedFor: ["classic", "prestige"],
    accent: "champagne",
  },
  {
    slug: "the-graveside-collection",
    name: "The Graveside Collection",
    blurb: "For a graveside that feels considered and complete, right to the last moment.",
    items: ["grave-flowers", "custom-grave-marker", "graveside-snacks", "decor-and-tents"],
    recommendedFor: ["classic", "prestige"],
    accent: "sage",
  },
  {
    slug: "the-travellers-collection",
    name: "The Traveller's Collection",
    blurb: "For family coming home for the funeral — the practical things, handled.",
    items: ["family-travel-pack", "individual-travel-pack", "memorial-programme", "customised-blanket", "travel-assistance"],
    recommendedFor: ["prestige", "bespoke"],
    accent: "clay",
  },
  {
    slug: "the-farewell-collection",
    name: "The Farewell Collection",
    blurb: "An elevated farewell, coordinated as one — from the casket to the final photograph.",
    items: ["premium-casket", "custom-casket", "floral-arrangement", "scented-candles", "decor-and-tents", "photography", "videography"],
    recommendedFor: ["prestige", "bespoke"],
    accent: "terracotta",
  },
  {
    slug: "the-digital-memory-collection",
    name: "The Digital Memory Collection",
    blurb: "So no one is left out, and nothing is forgotten.",
    items: ["photography", "videography", "livestreaming", "memorial-video", "online-tribute"],
    recommendedFor: ["classic", "prestige", "bespoke"],
    accent: "champagne",
  },
  {
    slug: "the-catholic-farewell-collection",
    name: "The Catholic Farewell Collection",
    blurb: "Ceremonial items for a Catholic service, for families whose tradition calls for them. Entirely optional.",
    items: ["scented-candles", "floral-arrangement", "decor-and-tents", "memorial-programme"],
    ceremonial: "catholic",
    recommendedFor: ["classic", "prestige", "bespoke"],
    accent: "sage",
  },
];

export function getBundle(slug: string) {
  return bundles.find((b) => b.slug === slug) ?? null;
}
