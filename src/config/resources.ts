/**
 * Resource / content centre (MEGA PROMPT §50).
 *
 * Placeholder article stubs to establish the information architecture and SEO
 * surface. Full article bodies must be written / reviewed by DFS. Each stub has a
 * short intro and an outline so the shape is clear.
 */

export type ResourceCategory = {
  slug: string;
  title: string;
  description: string;
};

export const resourceCategories: ResourceCategory[] = [
  { slug: "funeral-planning", title: "Funeral Planning", description: "Practical, step-by-step guidance for planning a funeral in Zimbabwe." },
  { slug: "diaspora-support", title: "Diaspora Family Support", description: "Planning and supporting a funeral from abroad." },
  { slug: "grief-bereavement", title: "Grief & Bereavement", description: "Understanding grief and finding support." },
  { slug: "legal-estate", title: "Legal & Estate Planning", description: "Wills, estates and protecting your family's future." },
  { slug: "traditions", title: "Funeral Traditions", description: "Honouring cultural and religious funeral traditions." },
  { slug: "financial-planning", title: "Financial Planning", description: "Planning ahead so cost is never the deciding factor." },
];

export type Resource = {
  slug: string;
  title: string;
  category: ResourceCategory["slug"];
  excerpt: string;
  /** Outline of the intended article — for DFS to write against. */
  outline: string[];
  readingTime: string;
  updated: string;
};

export const resources: Resource[] = [
  {
    slug: "what-to-do-when-a-loved-one-dies-in-zimbabwe",
    title: "What to do when a loved one dies in Zimbabwe",
    category: "funeral-planning",
    excerpt: "A calm, ordered checklist for the first hours and days after a death — who to contact, what to gather, and what DFS handles for you.",
    outline: [
      "The first phone calls to make",
      "Registering the death and the documents involved",
      "How DFS takes over the arrangements",
      "Keeping family abroad informed",
      "What to expect in the days before the funeral",
    ],
    readingTime: "6 min",
    updated: "CONFIGURE",
  },
  {
    slug: "funeral-planning-checklist",
    title: "The funeral planning checklist",
    category: "funeral-planning",
    excerpt: "Everything worth deciding in advance, in one printable list — from the service and venue to personalisation and hospitality.",
    outline: ["Service and venue decisions", "The coffin or casket", "Personalisation choices", "Media and memories", "Hospitality and travel", "Who does what on the day"],
    readingTime: "5 min",
    updated: "CONFIGURE",
  },
  {
    slug: "diaspora-funeral-planning-guide",
    title: "The diaspora funeral planning guide",
    category: "diaspora-support",
    excerpt: "How to plan and support a funeral in Zimbabwe when you live abroad — protection, coordination, communication and being present remotely.",
    outline: [
      "Why traditional funeral cover often falls short for the diaspora",
      "Setting up protection for family back home",
      "How remote coordination works",
      "Being present at the service from abroad",
      "Travelling home for a funeral",
    ],
    readingTime: "8 min",
    updated: "CONFIGURE",
  },
  {
    slug: "how-to-plan-a-funeral-remotely",
    title: "How to plan a funeral remotely",
    category: "diaspora-support",
    excerpt: "A practical walkthrough of arranging a funeral from another country with DFS coordinating on the ground.",
    outline: ["Making the first contact", "Decisions you make vs. decisions we handle", "Staying informed", "Livestreaming and attending remotely", "After the funeral"],
    readingTime: "6 min",
    updated: "CONFIGURE",
  },
  {
    slug: "understanding-funeral-cover",
    title: "Understanding funeral cover: what to look for",
    category: "financial-planning",
    excerpt: "What funeral cover actually pays for, the questions worth asking, and why fulfilment matters as much as the payout.",
    outline: ["Cover vs. fulfilment", "Questions to ask any funeral cover provider", "What personalisation options mean in practice", "Cover for family abroad and at home"],
    readingTime: "5 min",
    updated: "CONFIGURE",
  },
  {
    slug: "preparing-for-travel-home-after-a-bereavement",
    title: "Preparing to travel home after a bereavement",
    category: "diaspora-support",
    excerpt: "A short guide to getting home for a funeral with as little added stress as possible.",
    outline: ["Booking travel under pressure", "Documents to carry", "What a travelling pack covers", "Arriving and being supported on the ground"],
    readingTime: "4 min",
    updated: "CONFIGURE",
  },
  {
    slug: "why-funeral-personalisation-matters",
    title: "Why funeral personalisation matters",
    category: "traditions",
    excerpt: "A farewell is deeply personal. A short reflection on the details that make it feel like theirs.",
    outline: ["The difference a personal detail makes", "Personalisation across traditions", "Balancing personalisation with dignity and cost"],
    readingTime: "4 min",
    updated: "CONFIGURE",
  },
  {
    slug: "will-writing-basics",
    title: "Will-writing basics",
    category: "legal-estate",
    excerpt: "What a will does, what to think about before writing one, and where independent legal advice is important.",
    outline: ["What a will covers", "Things to decide first", "Common mistakes", "When to get independent legal advice", "How the DFS will-writing service helps"],
    readingTime: "6 min",
    updated: "CONFIGURE",
  },
  {
    slug: "supporting-someone-who-is-grieving",
    title: "Supporting someone who is grieving",
    category: "grief-bereavement",
    excerpt: "Practical, gentle ways to support a grieving family member — including from a distance.",
    outline: ["What helps and what to avoid", "Supporting from abroad", "When to encourage further support", "Looking after yourself too"],
    readingTime: "5 min",
    updated: "CONFIGURE",
  },
];

export function getResource(slug: string) {
  return resources.find((r) => r.slug === slug) ?? null;
}
