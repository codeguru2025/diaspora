/**
 * The Funeral Personalisation Marketplace catalogue (MEGA PROMPT §9–§11).
 *
 * "Start with your package. Then make it yours."
 *
 * This is a STRUCTURED, modular model — new products/services can be added here
 * (or, later, served from POL263 / a central source via `lib/pol263.ts` →
 * `getServiceCatalogue()`) without touching any component.
 *
 * No real prices are invented (§13, §58). `pricing.model` describes HOW an item is
 * priced so the UI can show the right treatment; actual amounts come from the
 * backend. Everything here is placeholder copy for DFS to review.
 */

export type PricingModel =
  | "included" // bundled into certain packages
  | "one-time" // one-off funeral service fee
  | "monthly-premium" // adjusts the monthly policy premium
  | "per-person"
  | "per-unit"
  | "per-service"
  | "per-session"
  | "location-dependent"
  | "custom-quote" // bespoke — requires a quotation
  | "supplier-dependent";

export type PackageSlug = "essential" | "classic" | "prestige" | "bespoke";

export type ServiceCategory = {
  slug: string;
  name: string;
  tagline: string;
  /** MEGA PROMPT §10 letter reference, for traceability. */
  ref: string;
};

export const serviceCategories: ServiceCategory[] = [
  { slug: "funeral-essentials", name: "Funeral Essentials", ref: "A", tagline: "Coffins, caskets, hearse, burial arrangements and grave preparation." },
  { slug: "personalisation-memorial", name: "Personalisation & Memorial", ref: "B", tagline: "Custom caskets, grave markers, personalised items and memorial merchandise." },
  { slug: "ceremony-venue", name: "Ceremony & Venue", ref: "C", tagline: "Décor, tents, chairs, PA systems, candles and ceremonial requirements." },
  { slug: "hospitality", name: "Hospitality", ref: "D", tagline: "Catering, graveside refreshments and family hospitality packages." },
  { slug: "media-memories", name: "Media & Memories", ref: "E", tagline: "Photography, videography, livestreaming, memorial videos and digital tributes." },
  { slug: "family-support", name: "Family Support", ref: "F", tagline: "Grief counselling, will writing, family assistance and post-funeral support." },
  { slug: "travel", name: "Travel", ref: "G", tagline: "Individual and family travelling packs, travel assistance and attendance support." },
];

export type ServiceItem = {
  slug: string;
  name: string;
  category: ServiceCategory["slug"];
  shortDescription: string;
  description: string;
  /** Bullet list of what the service includes (presentation copy). */
  includes: string[];
  /** Why families choose it. */
  whyChoose: string;
  pricing: {
    model: PricingModel;
    /** Human note shown near the price treatment. Never a number unless backend-supplied. */
    note: string;
  };
  /** Which packages include this vs. offer it as an add-on. */
  availability: Record<PackageSlug, "included" | "addon" | "not-available">;
  /** Contextual, non-aggressive upsell prompt shown on the detail page. */
  upsellMessage?: string;
  /** Slugs of related services to recommend (smart upselling, §12). */
  relatedServices: string[];
  /** Bundles this item belongs to (see bundles.ts). */
  bundles: string[];
  /** Lead time note — configurable, not fabricated specs. */
  leadTime: string;
  /** Optional cultural/religious tag so items can be filtered without assuming. */
  ceremonialTag?: "catholic" | "christian" | "traditional" | "non-religious" | "any";
  active: boolean;
  displayOrder: number;
  /** Placeholder image treatment key — no real assets bundled. */
  image: string | null;
};

const anyAvail: ServiceItem["availability"] = {
  essential: "addon",
  classic: "addon",
  prestige: "addon",
  bespoke: "included",
};

export const services: ServiceItem[] = [
  {
    slug: "premium-casket",
    name: "Premium Casket",
    category: "funeral-essentials",
    shortDescription: "An elevated casket selection with refined finishes and fittings.",
    description:
      "A carefully finished casket for families who want the centrepiece of the farewell to reflect the care they feel. Available in a range of woods and finishes.",
    includes: ["Choice of finish and fittings", "Interior lining options", "Delivery and preparation"],
    whyChoose: "It sets the tone for a dignified, well-appointed service.",
    pricing: { model: "one-time", note: "One-time funeral service fee. Final price depends on the selection." },
    availability: { essential: "addon", classic: "addon", prestige: "included", bespoke: "included" },
    upsellMessage: "Families choosing a premium casket often add a floral arrangement and personalised coffin lace.",
    relatedServices: ["custom-coffin-lace", "floral-arrangement", "custom-grave-marker"],
    bundles: ["the-farewell-collection"],
    leadTime: "CONFIGURE — typical lead time",
    ceremonialTag: "any",
    active: true,
    displayOrder: 10,
    image: null,
  },
  {
    slug: "custom-casket",
    name: "Custom-Made Casket",
    category: "personalisation-memorial",
    shortDescription: "A casket built to your specification and design.",
    description:
      "For families who want something made specifically for their loved one — dimensions, materials, detailing and personalisation designed with our team.",
    includes: ["Design consultation", "Choice of materials and detailing", "Personalisation and engraving options"],
    whyChoose: "Nothing off the shelf feels quite right — this is made for them.",
    pricing: { model: "custom-quote", note: "Bespoke item — requires a personalised quotation." },
    availability: { essential: "not-available", classic: "addon", prestige: "addon", bespoke: "included" },
    upsellMessage: "A custom casket pairs naturally with a matching grave marker, custom blanket and floral arrangement.",
    relatedServices: ["custom-grave-marker", "custom-coffin-lace", "customised-blanket", "floral-arrangement", "memorial-banner"],
    bundles: ["the-farewell-collection"],
    leadTime: "CONFIGURE — bespoke build lead time",
    ceremonialTag: "any",
    active: true,
    displayOrder: 20,
    image: null,
  },
  {
    slug: "custom-grave-marker",
    name: "Custom Grave Marker",
    category: "personalisation-memorial",
    shortDescription: "A lasting memorial that reflects the life and personality of your loved one.",
    description:
      "Create a lasting memorial that reflects the life and personality of your loved one. Choose the material, design and personalisation, with optional engraving.",
    includes: ["Choice of materials", "Design options", "Personalisation and optional engraving", "Photo examples on request"],
    whyChoose: "It is the memorial the family returns to for years to come.",
    pricing: { model: "custom-quote", note: "Materials and design determine the price — we prepare a quotation." },
    availability: { essential: "not-available", classic: "addon", prestige: "addon", bespoke: "included" },
    relatedServices: ["custom-casket", "grave-flowers", "memorial-banner"],
    bundles: ["the-graveside-collection"],
    leadTime: "CONFIGURE — fabrication lead time",
    ceremonialTag: "any",
    active: true,
    displayOrder: 30,
    image: null,
  },
  {
    slug: "custom-coffin-lace",
    name: "Personalised Coffin Lace",
    category: "personalisation-memorial",
    shortDescription: "Personalised coffin lace and drapery.",
    description: "Personalised lace and drapery to dress the coffin with a family's chosen detailing.",
    includes: ["Personalised design", "Choice of fabric and finish"],
    whyChoose: "A quiet, personal detail that families notice and remember.",
    pricing: { model: "per-unit", note: "Priced per item." },
    availability: anyAvail,
    relatedServices: ["customised-blanket", "premium-casket"],
    bundles: ["the-farewell-collection"],
    leadTime: "CONFIGURE",
    ceremonialTag: "any",
    active: true,
    displayOrder: 40,
    image: null,
  },
  {
    slug: "customised-blanket",
    name: "Customised Blanket",
    category: "personalisation-memorial",
    shortDescription: "A personalised blanket as a keepsake or for the service.",
    description: "A personalised blanket — used during the service and kept by the family afterwards.",
    includes: ["Personalised print or embroidery", "Choice of material"],
    whyChoose: "It goes home with the family as something to hold onto.",
    pricing: { model: "per-unit", note: "Priced per item." },
    availability: anyAvail,
    relatedServices: ["custom-coffin-lace", "memorial-programme"],
    bundles: ["the-travellers-collection"],
    leadTime: "CONFIGURE",
    ceremonialTag: "any",
    active: true,
    displayOrder: 50,
    image: null,
  },
  {
    slug: "memorial-banner",
    name: "Memorial Banner",
    category: "personalisation-memorial",
    shortDescription: "A large-format banner honouring your loved one.",
    description: "A large-format printed banner with photography and tribute text for the service venue and graveside.",
    includes: ["Design and layout", "Large-format print", "Stand or mounting"],
    whyChoose: "It anchors the space and welcomes mourners.",
    pricing: { model: "per-unit", note: "Priced per banner." },
    availability: anyAvail,
    relatedServices: ["memorial-programme", "photography", "memorial-collateral"],
    bundles: ["the-tribute-collection"],
    leadTime: "CONFIGURE",
    ceremonialTag: "any",
    active: true,
    displayOrder: 60,
    image: null,
  },
  {
    slug: "memorial-programme",
    name: "Funeral Programmes",
    category: "personalisation-memorial",
    shortDescription: "Printed order-of-service programmes for mourners.",
    description: "Printed programmes with the order of service, tribute text and photography, produced to a high standard.",
    includes: ["Design and typesetting", "Quality print", "Quantity to suit the service"],
    whyChoose: "Mourners keep them; they become part of the family record.",
    pricing: { model: "per-unit", note: "Priced per copy, by quantity." },
    availability: { essential: "addon", classic: "addon", prestige: "included", bespoke: "included" },
    relatedServices: ["memorial-collateral", "memorial-banner", "photography"],
    bundles: ["the-tribute-collection", "the-travellers-collection"],
    leadTime: "CONFIGURE",
    ceremonialTag: "any",
    active: true,
    displayOrder: 70,
    image: null,
  },
  {
    slug: "memorial-collateral",
    name: "Memorial Collateral & Merchandise",
    category: "personalisation-memorial",
    shortDescription: "T-shirts, printed keepsakes and memorial merchandise.",
    description: "Coordinated memorial merchandise — T-shirts, printed keepsakes and other items — for the family and mourners.",
    includes: ["Design", "Choice of items", "Production and delivery"],
    whyChoose: "It brings a large family together around one tribute.",
    pricing: { model: "per-unit", note: "Priced per item, by quantity." },
    availability: anyAvail,
    relatedServices: ["memorial-programme", "memorial-banner"],
    bundles: ["the-tribute-collection"],
    leadTime: "CONFIGURE",
    ceremonialTag: "any",
    active: true,
    displayOrder: 80,
    image: null,
  },
  {
    slug: "decor-and-tents",
    name: "Décor, Tents & Seating",
    category: "ceremony-venue",
    shortDescription: "Tents, chairs, draping and coordinated décor for the service.",
    description: "A complete venue setup — tents, seating, draping and coordinated décor — arranged and installed by our team.",
    includes: ["Tents and seating", "Draping and décor", "Setup and removal"],
    whyChoose: "The family arrives to a space that is ready and calm.",
    pricing: { model: "per-service", note: "Priced per funeral. Scale depends on numbers and venue." },
    availability: { essential: "addon", classic: "addon", prestige: "included", bespoke: "included" },
    relatedServices: ["pa-system", "floodlights", "floral-arrangement", "scented-candles"],
    bundles: ["the-graveside-collection"],
    leadTime: "CONFIGURE",
    ceremonialTag: "any",
    active: true,
    displayOrder: 90,
    image: null,
  },
  {
    slug: "pa-system",
    name: "PA System",
    category: "ceremony-venue",
    shortDescription: "Public address system with an operator for the service.",
    description: "A public address system with microphones and an operator, so every tribute is heard.",
    includes: ["Speakers and microphones", "On-site operator"],
    whyChoose: "Large gatherings need to hear the eulogy clearly.",
    pricing: { model: "per-service", note: "Priced per funeral." },
    availability: { essential: "addon", classic: "addon", prestige: "included", bespoke: "included" },
    relatedServices: ["decor-and-tents", "floodlights", "livestreaming"],
    bundles: [],
    leadTime: "CONFIGURE",
    ceremonialTag: "any",
    active: true,
    displayOrder: 100,
    image: null,
  },
  {
    slug: "floodlights",
    name: "Floodlights & Power",
    category: "ceremony-venue",
    shortDescription: "Lighting and power for evening vigils and early services.",
    description: "Floodlighting and a power source for night vigils, early-morning preparation and extended services.",
    includes: ["Floodlights", "Generator / power", "Setup"],
    whyChoose: "Vigils and early services need proper light.",
    pricing: { model: "location-dependent", note: "Priced per funeral; varies with location and duration." },
    availability: anyAvail,
    relatedServices: ["decor-and-tents", "pa-system"],
    bundles: [],
    leadTime: "CONFIGURE",
    ceremonialTag: "any",
    active: true,
    displayOrder: 110,
    image: null,
  },
  {
    slug: "scented-candles",
    name: "Candles & Ceremonial Incense",
    category: "ceremony-venue",
    shortDescription: "Scented candles and ceremonial incense where the tradition calls for them.",
    description: "Scented candles and ceremonial incense for services where the family's tradition includes them. Entirely optional.",
    includes: ["Candles", "Ceremonial incense on request", "Holders and setup"],
    whyChoose: "For families whose tradition includes them, the detail matters.",
    pricing: { model: "per-unit", note: "Priced per set." },
    availability: anyAvail,
    relatedServices: ["decor-and-tents", "floral-arrangement"],
    bundles: ["the-catholic-farewell-collection"],
    ceremonialTag: "catholic",
    leadTime: "CONFIGURE",
    active: true,
    displayOrder: 120,
    image: null,
  },
  {
    slug: "floral-arrangement",
    name: "Floral Arrangements",
    category: "ceremony-venue",
    shortDescription: "Fresh floral arrangements for the service and graveside.",
    description: "Fresh floral arrangements designed for the coffin, the service space and the graveside.",
    includes: ["Coffin arrangement", "Service and graveside flowers", "Design consultation"],
    whyChoose: "Flowers carry what words cannot.",
    pricing: { model: "one-time", note: "One-time fee; scale depends on the arrangement." },
    availability: { essential: "addon", classic: "addon", prestige: "included", bespoke: "included" },
    relatedServices: ["grave-flowers", "decor-and-tents", "premium-casket"],
    bundles: ["the-tribute-collection", "the-farewell-collection", "the-catholic-farewell-collection"],
    leadTime: "CONFIGURE",
    ceremonialTag: "any",
    active: true,
    displayOrder: 130,
    image: null,
  },
  {
    slug: "grave-flowers",
    name: "Graveside Flowers",
    category: "funeral-essentials",
    shortDescription: "Flowers prepared for the committal and graveside.",
    description: "Flowers prepared specifically for the committal and graveside.",
    includes: ["Graveside floral pieces", "Placement"],
    whyChoose: "The graveside is the last moment — it should be beautiful.",
    pricing: { model: "one-time", note: "One-time fee." },
    availability: anyAvail,
    relatedServices: ["floral-arrangement", "custom-grave-marker", "graveside-snacks"],
    bundles: ["the-graveside-collection"],
    leadTime: "CONFIGURE",
    ceremonialTag: "any",
    active: true,
    displayOrder: 140,
    image: null,
  },
  {
    slug: "graveside-snacks",
    name: "Graveside Refreshments",
    category: "hospitality",
    shortDescription: "Water, refreshments and snacks for mourners at the graveside.",
    description: "Water, refreshments and light snacks served to mourners at the graveside.",
    includes: ["Water and refreshments", "Light snacks", "Service staff"],
    whyChoose: "People travel far and stand long. Small comforts matter.",
    pricing: { model: "per-person", note: "Priced per head." },
    availability: { essential: "addon", classic: "addon", prestige: "included", bespoke: "included" },
    relatedServices: ["catering", "family-hospitality"],
    bundles: ["the-graveside-collection"],
    leadTime: "CONFIGURE",
    ceremonialTag: "any",
    active: true,
    displayOrder: 150,
    image: null,
  },
  {
    slug: "catering",
    name: "Catering",
    category: "hospitality",
    shortDescription: "Full catering for the family and mourners after the service.",
    description: "Full catering for the gathering after the service — menu, staff, equipment and service.",
    includes: ["Menu planning", "Staff and equipment", "Service and clear-up"],
    whyChoose: "The family should be able to grieve, not cook.",
    pricing: { model: "per-person", note: "Priced per head; menu-dependent." },
    availability: { essential: "addon", classic: "addon", prestige: "addon", bespoke: "included" },
    relatedServices: ["graveside-snacks", "family-hospitality"],
    bundles: [],
    leadTime: "CONFIGURE",
    ceremonialTag: "any",
    active: true,
    displayOrder: 160,
    image: null,
  },
  {
    slug: "family-hospitality",
    name: "Family Hospitality Package",
    category: "hospitality",
    shortDescription: "Dedicated hospitality for the immediate family across the funeral period.",
    description: "Dedicated hospitality for the immediate family throughout the funeral period — refreshments, meals and support.",
    includes: ["Meals across the funeral period", "Refreshments", "Dedicated support"],
    whyChoose: "The immediate family is carrying everyone else. Someone should carry them.",
    pricing: { model: "custom-quote", note: "Scoped to the family's needs — quotation prepared." },
    availability: { essential: "not-available", classic: "addon", prestige: "addon", bespoke: "included" },
    relatedServices: ["catering", "grief-counselling"],
    bundles: [],
    leadTime: "CONFIGURE",
    ceremonialTag: "any",
    active: true,
    displayOrder: 170,
    image: null,
  },
  {
    slug: "photography",
    name: "Professional Photography",
    category: "media-memories",
    shortDescription: "A professional photographer documenting the service with discretion.",
    description: "A professional photographer covering the service and graveside with discretion, delivering an edited gallery to the family.",
    includes: ["Coverage of the service and committal", "Edited digital gallery", "Print options"],
    whyChoose: "Family who cannot attend still see the day. Family who attend barely remember it.",
    pricing: { model: "one-time", note: "One-time funeral service fee." },
    availability: { essential: "addon", classic: "addon", prestige: "included", bespoke: "included" },
    upsellMessage: "Photography is often chosen alongside videography and a memorial video.",
    relatedServices: ["videography", "livestreaming", "memorial-video"],
    bundles: ["the-tribute-collection", "the-digital-memory-collection"],
    leadTime: "CONFIGURE",
    ceremonialTag: "any",
    active: true,
    displayOrder: 180,
    image: null,
  },
  {
    slug: "videography",
    name: "Professional Videography",
    category: "media-memories",
    shortDescription: "Filmed coverage of the service, edited into a keepsake film.",
    description: "Filmed coverage of the service and tributes, edited into a keepsake film for the family.",
    includes: ["Multi-part coverage", "Edited keepsake film", "Digital delivery"],
    whyChoose: "The eulogies deserve to be heard again.",
    pricing: { model: "one-time", note: "One-time funeral service fee." },
    availability: anyAvail,
    relatedServices: ["photography", "livestreaming", "memorial-video"],
    bundles: ["the-digital-memory-collection"],
    leadTime: "CONFIGURE",
    ceremonialTag: "any",
    active: true,
    displayOrder: 190,
    image: null,
  },
  {
    slug: "livestreaming",
    name: "Funeral Livestreaming",
    category: "media-memories",
    shortDescription: "A private, reliable live broadcast for family who cannot travel.",
    description:
      "A private, reliable live broadcast of the service so family anywhere in the world can be present. Shareable link, recording included.",
    includes: ["On-site crew and connectivity", "Private stream link", "Recording provided afterwards"],
    whyChoose: "Distance should never mean missing the farewell.",
    pricing: { model: "one-time", note: "One-time funeral service fee; connectivity may vary by location." },
    availability: { essential: "addon", classic: "addon", prestige: "included", bespoke: "included" },
    upsellMessage: "Families choosing livestreaming usually add photography, videography and a memorial video.",
    relatedServices: ["photography", "videography", "memorial-video", "online-tribute"],
    bundles: ["the-digital-memory-collection"],
    leadTime: "CONFIGURE",
    ceremonialTag: "any",
    active: true,
    displayOrder: 200,
    image: null,
  },
  {
    slug: "memorial-video",
    name: "Memorial Video",
    category: "media-memories",
    shortDescription: "A produced tribute video from the family's photos and footage.",
    description: "A produced tribute video assembled from the family's own photographs and footage, set to music.",
    includes: ["Photo and footage collection", "Editing and music", "Digital delivery"],
    whyChoose: "It is played at the service and kept forever after.",
    pricing: { model: "one-time", note: "One-time production fee." },
    availability: anyAvail,
    relatedServices: ["photography", "videography", "online-tribute"],
    bundles: ["the-digital-memory-collection"],
    leadTime: "CONFIGURE",
    ceremonialTag: "any",
    active: true,
    displayOrder: 210,
    image: null,
  },
  {
    slug: "online-tribute",
    name: "Online Tribute & Announcement",
    category: "media-memories",
    shortDescription: "A shareable online memorial page and funeral announcement.",
    description: "A shareable online memorial page with the funeral announcement, tribute wall and service details.",
    includes: ["Memorial page", "Funeral announcement", "Tribute wall for messages"],
    whyChoose: "One link tells everyone what they need to know.",
    pricing: { model: "one-time", note: "One-time setup fee." },
    availability: anyAvail,
    relatedServices: ["livestreaming", "memorial-video"],
    bundles: ["the-digital-memory-collection"],
    leadTime: "CONFIGURE",
    ceremonialTag: "any",
    active: true,
    displayOrder: 220,
    image: null,
  },
  {
    slug: "grief-counselling",
    name: "Online Grief Support",
    category: "family-support",
    shortDescription: "Confidential online grief support sessions for the family.",
    description:
      "Confidential online grief support sessions for family members, delivered remotely so the diaspora is included. General grief support — distinct from clinical or medical care.",
    includes: ["Online sessions", "Available to multiple family members", "Referral guidance where needed"],
    whyChoose: "Grief does not end at the graveside.",
    pricing: { model: "per-session", note: "Priced per session; some packages include a set number." },
    availability: { essential: "addon", classic: "included", prestige: "included", bespoke: "included" },
    relatedServices: ["post-funeral-support", "family-hospitality"],
    bundles: [],
    leadTime: "CONFIGURE",
    ceremonialTag: "any",
    active: true,
    displayOrder: 230,
    image: null,
  },
  {
    slug: "will-writing",
    name: "Free Will-Writing Service",
    category: "family-support",
    shortDescription: "Assistance preparing a will. Not a substitute for independent legal advice.",
    description:
      "Guided assistance to help you prepare a will. This service assists with will preparation and does not replace independent legal advice where that is required.",
    includes: ["Guided will preparation", "Document template and support", "Guidance on next steps"],
    whyChoose: "Protecting your family includes what happens to your estate.",
    pricing: { model: "included", note: "Included with every DFS policy." },
    availability: { essential: "included", classic: "included", prestige: "included", bespoke: "included" },
    relatedServices: ["post-funeral-support"],
    bundles: [],
    leadTime: "CONFIGURE",
    ceremonialTag: "any",
    active: true,
    displayOrder: 240,
    image: null,
  },
  {
    slug: "post-funeral-support",
    name: "Post-Funeral Support",
    category: "family-support",
    shortDescription: "Practical and emotional support for the family after the funeral.",
    description: "Continued practical and emotional support for the family in the weeks after the funeral.",
    includes: ["Follow-up check-ins", "Practical guidance", "Referral to further support"],
    whyChoose: "The hardest weeks are often the ones after everyone leaves.",
    pricing: { model: "included", note: "Included with selected packages; available as an add-on otherwise." },
    availability: { essential: "addon", classic: "addon", prestige: "included", bespoke: "included" },
    relatedServices: ["grief-counselling", "will-writing"],
    bundles: [],
    leadTime: "CONFIGURE",
    ceremonialTag: "any",
    active: true,
    displayOrder: 250,
    image: null,
  },
  {
    slug: "individual-travel-pack",
    name: "Individual Travelling Pack",
    category: "travel",
    shortDescription: "A thought-through pack for one family member travelling home for the funeral.",
    description:
      "A pack prepared for one family member travelling home for the funeral. Contents are configurable — essentials, documents guidance, personal care and funeral-related items.",
    includes: ["Essentials", "Personal care items", "Funeral-related items", "Configurable contents"],
    whyChoose: "You are booking flights and grieving at once. Let us handle the rest.",
    pricing: { model: "one-time", note: "One-time fee per pack." },
    availability: { essential: "addon", classic: "addon", prestige: "included", bespoke: "included" },
    relatedServices: ["family-travel-pack", "travel-assistance"],
    bundles: ["the-travellers-collection"],
    leadTime: "CONFIGURE",
    ceremonialTag: "any",
    active: true,
    displayOrder: 260,
    image: null,
  },
  {
    slug: "family-travel-pack",
    name: "Family Travelling Pack",
    category: "travel",
    shortDescription: "A larger pack for a family group travelling home together.",
    description: "A larger pack for a family group travelling home together, with configurable contents.",
    includes: ["Group essentials", "Family items", "Funeral-related items", "Configurable contents"],
    whyChoose: "One arrangement for the whole group.",
    pricing: { model: "one-time", note: "One-time fee per pack." },
    availability: { essential: "addon", classic: "addon", prestige: "addon", bespoke: "included" },
    relatedServices: ["individual-travel-pack", "travel-assistance"],
    bundles: ["the-travellers-collection"],
    leadTime: "CONFIGURE",
    ceremonialTag: "any",
    active: true,
    displayOrder: 270,
    image: null,
  },
  {
    slug: "travel-assistance",
    name: "Travel & Attendance Assistance",
    category: "travel",
    shortDescription: "Coordination support for family travelling to and attending the funeral.",
    description:
      "Coordination support for family members travelling to and attending the funeral — logistics guidance and on-the-ground assistance.",
    includes: ["Logistics guidance", "On-the-ground assistance", "Coordination with the funeral team"],
    whyChoose: "Someone local, on your side, while you are in transit.",
    pricing: { model: "custom-quote", note: "Scoped to the family's plans — quotation prepared." },
    availability: { essential: "not-available", classic: "addon", prestige: "addon", bespoke: "included" },
    relatedServices: ["individual-travel-pack", "family-travel-pack"],
    bundles: ["the-travellers-collection"],
    leadTime: "CONFIGURE",
    ceremonialTag: "any",
    active: true,
    displayOrder: 280,
    image: null,
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug) ?? null;
}

export function servicesByCategory(category: string) {
  return services
    .filter((s) => s.category === category && s.active)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export const pricingModelLabels: Record<string, string> = {
  included: "Included with package",
  "one-time": "One-time funeral fee",
  "monthly-premium": "Adjusts monthly premium",
  "per-person": "Priced per person",
  "per-unit": "Priced per item",
  "per-service": "Priced per funeral",
  "per-session": "Priced per session",
  "location-dependent": "Price varies by location",
  "custom-quote": "Custom quotation",
  "supplier-dependent": "Supplier-dependent pricing",
};
