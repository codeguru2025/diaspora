/**
 * Global site configuration for the Diaspora Funeral Services (DFS) website.
 *
 * Everything here that is a real-world business fact — phone numbers, email,
 * registration details, physical addresses — is a PLACEHOLDER marked `CONFIGURE`.
 * Do not treat these as accurate. They exist so the UI renders; DFS must supply
 * the real values (ideally later sourced from the POL263 organisation record via
 * `lib/pol263.ts` → `getBranding()`).
 */

export const CONFIGURE = "CONFIGURE THIS VALUE" as const;

export const site = {
  name: "Diaspora Funeral Services",
  shortName: "DFS",
  tagline: "Your family. Your wishes. Our commitment to make it happen.",
  promise: "Name it. We provide it.",
  description:
    "World-class funeral protection and personalised funeral services for families in Zimbabwe — whether you are here or thousands of kilometres away.",

  // Public URL of this site (used for canonical URLs, sitemap, JSON-LD).
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.diasporafuneralservices.com",

  // ---- Contact channels (PLACEHOLDER — CONFIGURE) ----
  contact: {
    phoneDisplay: "+263 (0) 000 000 000", // CONFIGURE
    phoneHref: "tel:+263000000000", // CONFIGURE
    // A dedicated, always-answered line for families who have just lost someone.
    atNeedPhoneDisplay: "+263 (0) 000 000 111", // CONFIGURE
    atNeedPhoneHref: "tel:+263000000111", // CONFIGURE
    email: "hello@diasporafuneralservices.com", // CONFIGURE
    atNeedEmail: "care@diasporafuneralservices.com", // CONFIGURE
    whatsappDisplay: "+263 (0) 000 000 000", // CONFIGURE
    // Configurable click-to-chat link. No WhatsApp Business API is assumed.
    whatsappHref: "https://wa.me/263000000000", // CONFIGURE
    officeAddress: CONFIGURE,
    officeHours: CONFIGURE,
  },

  social: {
    facebook: CONFIGURE,
    instagram: CONFIGURE,
    linkedin: CONFIGURE,
    youtube: CONFIGURE,
  },

  // Coverage statement for the footer / trust sections.
  coverage: "Serving families nationwide across Zimbabwe.",

  // Legal / regulatory footer line — MUST be reviewed and supplied by DFS.
  legalEntity: CONFIGURE,
  regulatoryLine: CONFIGURE,
} as const;

/** Primary calls-to-action, reused across the site so wording stays consistent. */
export const cta = {
  protect: { label: "Protect My Family", href: "/protect-my-family" },
  protectDiaspora: { label: "Protect My Family Back Home", href: "/for-the-diaspora" },
  packages: { label: "View Packages", href: "/packages" },
  quote: { label: "Get a Quote", href: "/get-a-quote" },
  join: { label: "Start My Application", href: "/join" },
  arrange: { label: "Arrange a Funeral Now", href: "/arrange-a-funeral" },
  services: { label: "Explore Our Services", href: "/services" },
  consultant: { label: "Speak to a Funeral Care Consultant", href: "/contact" },
  account: { label: "My Account", href: "/account" },
} as const;

export type NavItem = {
  label: string;
  href: string;
  description?: string;
  children?: NavItem[];
};

export const mainNav: NavItem[] = [
  {
    label: "Our Packages",
    href: "/packages",
    description: "Essential, Classic, Prestige and Bespoke — compare and choose.",
  },
  {
    label: "Funeral Services",
    href: "/services",
    description: "The personalisation marketplace. Start with your package, then make it yours.",
  },
  {
    label: "How It Works",
    href: "/how-it-works",
    description: "Four simple steps from choosing cover to the day we take care of everything.",
  },
  {
    label: "For the Diaspora",
    href: "/for-the-diaspora",
    description: "Protect and provide for family back home, from wherever you are.",
  },
  {
    label: "About Us",
    href: "/about",
    description: "Why distance should never determine the quality of care your family receives.",
  },
  {
    label: "Resources",
    href: "/resources",
    description: "Funeral planning guides, diaspora support and bereavement help.",
  },
  { label: "Contact", href: "/contact" },
];

/** Secondary links grouped for the footer. */
export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: "Protection",
    links: [
      { label: "Our Packages", href: "/packages" },
      { label: "Compare Packages", href: "/packages#compare" },
      { label: "Get a Quote", href: "/get-a-quote" },
      { label: "Protect My Family", href: "/protect-my-family" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Funeral Services", href: "/services" },
      { label: "Curated Collections", href: "/services#collections" },
      { label: "Digital & Memorial", href: "/digital-services" },
      { label: "Travel Packs", href: "/travel-pack" },
      { label: "Grief Support", href: "/grief-support" },
      { label: "Will Writing", href: "/will-writing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "For the Diaspora", href: "/for-the-diaspora" },
      { label: "Resources", href: "/resources" },
      { label: "FAQ", href: "/faq" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Arrange a Funeral Now", href: "/arrange-a-funeral" },
      { label: "Customer Login", href: "/account" },
      { label: "Request a Callback", href: "/contact#callback" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Cookie Policy", href: "/legal/cookies" },
      { label: "Policy Information", href: "/legal/policy-information" },
    ],
  },
];
