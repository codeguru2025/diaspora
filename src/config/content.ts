/**
 * Shared marketing content: testimonials structure, trust markers, diaspora data,
 * "how it works" steps, and the "Name it. We provide it." showcase list.
 *
 * Testimonials and statistics are NOT fabricated (MEGA PROMPT §27, §28). A
 * testimonial is only ever a real customer's words, published with their consent.
 * `familyStories` are illustrative scenarios, always labelled as such on the page.
 */

export type Testimonial = {
  /** How the customer asked to be named, e.g. "Rudo M." or "A family in Gwanda". */
  name: string;
  location: string;
  /** Package or service they used, e.g. "Classic package". */
  service: string;
  /** Their own words. Light edits for length only, approved by them. */
  quote: string;
  /** ISO date the customer approved the final wording for publication. Required. */
  consentDate: string;
  /** Optional 1–5 rating they gave. */
  rating?: number;
};

/**
 * Real, approved testimonials. Collected through /share-your-story (lands in
 * POL263 as a "testimonial" lead); add one here only once the customer has
 * approved the final wording, and record that date in `consentDate`.
 */
export const testimonials: Testimonial[] = [];

export type FamilyStory = {
  title: string;
  /** Who and where — a composite, not a real family. */
  setting: string;
  challenge: string;
  howWeHelped: string;
  services: string[];
};

/**
 * Illustrative stories showing how DFS works in typical situations. These are
 * composites, not real customers, and are always rendered with an
 * "Illustrative example" label. Never present them as testimonials.
 */
export const familyStories: FamilyStory[] = [
  {
    title: "Arranging a mother's funeral from London",
    setting: "A daughter in London; her mother in Gwanda.",
    challenge:
      "The call came at night, UK time. She couldn't fly out for four days, and her brothers at home were unsure what to book or who to pay.",
    howWeHelped:
      "One call to the care line and a Funeral Care Consultant took over: collection, the casket, the tent and catering at the homestead, and a schedule agreed with the whole family on a group call. She followed every step by SMS and watched the service live with relatives in three countries.",
    services: ["Classic package", "Funeral livestreaming", "Catering", "Décor, tents & seating"],
  },
  {
    title: "A personal farewell for a father in Bulawayo",
    setting: "A family in Bulawayo, with a son in Johannesburg.",
    challenge:
      "They wanted the day to feel like him — his church, his hymns, his favourite colours — without the family spending the week chasing suppliers.",
    howWeHelped:
      "We designed the ceremony with them: a personalised coffin lace and memorial banner in his colours, printed programmes with his photographs, and a photographer to capture the day. The family spent the week together instead of on the phone.",
    services: ["Prestige package", "Personalised coffin lace", "Memorial banner", "Funeral programmes"],
  },
  {
    title: "Coming home for a grandmother's burial",
    setting: "A family of five travelling from Perth to rural Masvingo.",
    challenge:
      "Long flights, a connection in Johannesburg, and a four-hour drive at the end — with children, and in grief.",
    howWeHelped:
      "We built the funeral schedule around their arrival, prepared a family travelling pack, and arranged support on the ground from the airport. They arrived to arrangements already in place.",
    services: ["Essential package", "Family travelling pack", "Travel & attendance assistance"],
  },
];

/**
 * Trust markers. Only include items that are verifiable now. Anything requiring a
 * real statistic (years, families served, accreditations) is omitted until DFS
 * supplies the figure — do not invent numbers.
 */
export const trustMarkers: { label: string; detail: string; needsInput?: boolean }[] = [
  { label: "24 families served", detail: "Families who have trusted us with a farewell so far — and every one mattered." },
  { label: "Built for the diaspora", detail: "Protect family in Zimbabwe from wherever you live, and stay informed from afar." },
  { label: "Nationwide Zimbabwe", detail: "Coverage for families wherever they are in the country." },
  { label: "Secure online joining", detail: "Join, pay and manage your policy online." },
  { label: "Transparent packages", detail: "Four clear packages, with every inclusion and add-on shown." },
  { label: "SMS & digital updates", detail: "Kept informed from confirmation to the day itself." },
  { label: "Administered on POL263", detail: "Policy administration and communications run on an established platform." },
];

export const howItWorks: { title: string; body: string }[] = [
  { title: "Choose your protection", body: "Select Essential, Classic, Prestige or Bespoke — the level of care and choice that fits your family." },
  { title: "Personalise it", body: "Add the services and extras that matter to your family, from photography to travel packs to a custom casket." },
  { title: "Join online", body: "Complete your application and payment in minutes, from anywhere in the world." },
  { title: "We take care of the rest", body: "When your family needs us, our team coordinates the service while you stay informed at every step." },
];

/** The DFS difference bullets (MEGA PROMPT §20). */
export const dfsDifference: string[] = [
  "Nationwide Zimbabwe coverage",
  "Join online in minutes",
  "Built for diaspora families",
  "Personalised funeral options",
  "SMS and digital communication",
  "Human support when you need it",
  "A wide funeral service catalogue",
  "Flexible, clearly-structured packages",
];

/** "Name it. We provide it." showcase (MEGA PROMPT §22). */
export const nameItShowcase: { label: string; serviceSlug?: string }[] = [
  { label: "Custom caskets", serviceSlug: "custom-casket" },
  { label: "Grave markers", serviceSlug: "custom-grave-marker" },
  { label: "Photography", serviceSlug: "photography" },
  { label: "Livestreaming", serviceSlug: "livestreaming" },
  { label: "Catering", serviceSlug: "catering" },
  { label: "Décor & tents", serviceSlug: "decor-and-tents" },
  { label: "Floodlights", serviceSlug: "floodlights" },
  { label: "PA systems", serviceSlug: "pa-system" },
  { label: "Travel packs", serviceSlug: "family-travel-pack" },
  { label: "Memorial T-shirts", serviceSlug: "memorial-collateral" },
  { label: "Flowers", serviceSlug: "floral-arrangement" },
  { label: "Grief counselling", serviceSlug: "grief-counselling" },
  { label: "Will writing", serviceSlug: "will-writing" },
  { label: "Memorial videos", serviceSlug: "memorial-video" },
];

/** Diaspora experience points (MEGA PROMPT §23). */
export const diasporaPoints: { title: string; body: string }[] = [
  { title: "Join online", body: "Set up protection for your family in Zimbabwe from wherever you live." },
  { title: "Cover family back home", body: "Add the people who matter, whether they are in Harare, Bulawayo or a rural home." },
  { title: "Pay digitally", body: "Pay premiums with the methods available in your country." },
  { title: "Receive SMS updates", body: "From policy confirmation to funeral scheduling, you are never left wondering." },
  { title: "Manage your policy online", body: "Update family members, view documents and payments, all from your account." },
  { title: "Notify DFS remotely", body: "Tell us when a funeral is needed — by phone, WhatsApp or your portal." },
  { title: "Get human assistance", body: "A real person to talk to, in a timezone that works." },
  { title: "Know what is happening", body: "Add livestreaming and be present at the service itself." },
];

/**
 * Countries of residence for the diaspora journey. Availability is controlled by
 * DFS — `available: false` still lets someone register interest.
 */
export const diasporaCountries: { code: string; name: string; dialCode: string; available: boolean }[] = [
  { code: "ZW", name: "Zimbabwe", dialCode: "+263", available: true },
  { code: "ZA", name: "South Africa", dialCode: "+27", available: true },
  { code: "BW", name: "Botswana", dialCode: "+267", available: true },
  { code: "GB", name: "United Kingdom", dialCode: "+44", available: true },
  { code: "US", name: "United States", dialCode: "+1", available: true },
  { code: "CA", name: "Canada", dialCode: "+1", available: true },
  { code: "AU", name: "Australia", dialCode: "+61", available: true },
  { code: "NZ", name: "New Zealand", dialCode: "+64", available: false },
  { code: "IE", name: "Ireland", dialCode: "+353", available: false },
  { code: "AE", name: "United Arab Emirates", dialCode: "+971", available: false },
  { code: "OTHER", name: "Another country", dialCode: "+", available: false },
];

/** Zimbabwe provinces for service-location capture (MEGA PROMPT §38). */
export const zimbabweProvinces: string[] = [
  "Bulawayo",
  "Harare",
  "Manicaland",
  "Mashonaland Central",
  "Mashonaland East",
  "Mashonaland West",
  "Masvingo",
  "Matabeleland North",
  "Matabeleland South",
  "Midlands",
];

export const galleryCategories: string[] = [
  "Caskets",
  "Grave markers",
  "Décor",
  "Flowers",
  "Memorials",
  "Funeral setups",
  "Catering",
  "Travel packs",
  "Personalisation",
  "Photography",
  "Livestreaming",
];
