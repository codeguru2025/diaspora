/**
 * FAQ content (MEGA PROMPT §51).
 *
 * CRITICAL: Do NOT invent policy rules. Every answer that depends on DFS policy
 * documentation is written as a clearly-marked placeholder. These must be replaced
 * with DFS-supplied wording (ideally sourced from POL263 `terms_and_conditions`).
 */

export type Faq = { q: string; a: string; needsInput?: boolean };
export type FaqCategory = { slug: string; title: string; items: Faq[] };

const TBC =
  "CONTENT REQUIRED FROM DFS — this answer depends on the funeral policy documentation and must be confirmed before publishing.";

export const faqCategories: FaqCategory[] = [
  {
    slug: "joining",
    title: "Joining",
    items: [
      {
        q: "How do I join Diaspora Funeral Services?",
        a: "You can join online in a few minutes. Choose a package, tell us who you want to protect, add any services you want, review your cover and complete payment. You can also speak to a Funeral Care Consultant who will guide you through it.",
      },
      { q: "Can I join from outside Zimbabwe?", a: "Yes. DFS is built for families in the diaspora. You can join online, pay digitally, and manage everything remotely while your family is covered in Zimbabwe." },
      { q: "What information do I need to join?", a: "Basic details for yourself and the family members you want to cover. The online application tells you exactly what is needed at each step." },
      { q: "Is there a waiting period before cover starts?", a: TBC, needsInput: true },
    ],
  },
  {
    slug: "eligibility",
    title: "Eligibility",
    items: [
      { q: "Who can be covered on a DFS policy?", a: TBC, needsInput: true },
      { q: "Is there an age limit to join or to add a family member?", a: TBC, needsInput: true },
      { q: "Can I cover extended family members?", a: TBC, needsInput: true },
    ],
  },
  {
    slug: "payments",
    title: "Payments",
    items: [
      { q: "How do I pay my premiums?", a: "Premiums are paid digitally. Supported payment methods are configured for your country and shown at checkout and in your customer portal." },
      { q: "Can someone in the diaspora pay for a policy that covers family in Zimbabwe?", a: "Yes. This is one of the core reasons DFS exists." },
      { q: "What happens if I miss a payment?", a: TBC, needsInput: true },
      { q: "Will I get a receipt?", a: "Yes. Receipts and statements are available in your customer portal and sent to you." },
    ],
  },
  {
    slug: "beneficiaries",
    title: "Family & beneficiaries",
    items: [
      { q: "Can I change the family members on my policy?", a: "Yes. You can request changes through your customer portal or your Funeral Care Consultant. Changes are reviewed before they take effect." },
      { q: "How many family members can I add?", a: TBC, needsInput: true },
    ],
  },
  {
    slug: "claims",
    title: "When a death occurs",
    items: [
      { q: "What do I do when a family member passes away?", a: "Contact us straight away — by phone, WhatsApp, or through your customer portal — and our team takes over the arrangements. If you are in the diaspora, we keep you informed at every step." },
      { q: "What documents are needed?", a: TBC, needsInput: true },
      { q: "How quickly can a funeral be arranged?", a: TBC, needsInput: true },
    ],
  },
  {
    slug: "diaspora",
    title: "For the diaspora",
    items: [
      { q: "How will I know what is happening if I cannot travel?", a: "You receive SMS and digital updates throughout — from policy confirmation to funeral scheduling and service confirmations. You can also add livestreaming so you can be present at the service." },
      { q: "Can DFS coordinate a funeral while I am abroad?", a: "Yes. Our team coordinates the service on the ground while you remain informed and involved from wherever you are." },
      { q: "Which countries can I join from?", a: "DFS is opening to the diaspora in stages. Tell us where you live during the application and we will confirm availability." },
    ],
  },
  {
    slug: "services",
    title: "Add-ons & personalised services",
    items: [
      { q: "What are add-on services?", a: "Optional services you can add to any package — from photography and livestreaming to custom caskets, catering, travel packs and more. Start with your package, then make it yours." },
      { q: "How are add-ons priced?", a: "It depends on the service. Some adjust your monthly premium, some are one-time funeral fees, some are priced per person or per item, and bespoke items are quoted individually. The price treatment is shown on every service." },
      { q: "Can I add services later, or only when I join?", a: "You can add many services when you join and others at the time of the funeral. Your Funeral Care Consultant can help either way." },
    ],
  },
  {
    slug: "custom",
    title: "Bespoke & custom requests",
    items: [
      { q: "What if I want something that is not listed?", a: "Name it. Our Bespoke service exists for exactly this — tell us what you have in mind and we will prepare a plan and a quotation." },
      { q: "How do custom quotations work?", a: "For bespoke items we scope the request with you, then prepare a written quotation before anything is confirmed." },
    ],
  },
  {
    slug: "travel",
    title: "Travel",
    items: [
      { q: "What is in a travelling pack?", a: "The contents are configurable and we finalise them with you. They are designed around travelling home for a funeral — essentials, personal care, and funeral-related items.", needsInput: true },
      { q: "Can DFS help with travel logistics?", a: "Travel and attendance assistance is available as a service — logistics guidance and on-the-ground support." },
    ],
  },
  {
    slug: "digital",
    title: "Livestreaming & digital",
    items: [
      { q: "How does funeral livestreaming work?", a: "Our team sets up an on-site crew and connectivity and provides a private link for family to watch live. A recording is provided afterwards. Connectivity can vary by location and we will tell you if there is any risk." },
      { q: "Is the livestream private?", a: "Yes. The link is private and shared only with the people the family chooses." },
    ],
  },
  {
    slug: "support",
    title: "Grief & family support",
    items: [
      { q: "Do you offer grief support?", a: "Yes — confidential online grief support sessions, available to multiple family members including those abroad. This is general grief support and is distinct from clinical or medical care; we will refer you on where that is needed." },
      { q: "Does support continue after the funeral?", a: "Yes. Post-funeral support includes follow-up check-ins and practical guidance in the weeks afterwards." },
    ],
  },
  {
    slug: "will-writing",
    title: "Will writing",
    items: [
      {
        q: "Is the will-writing service really free?",
        a: "Yes, guided will-preparation assistance is included with every DFS policy. It assists with will preparation and does not replace independent legal advice where that is required.",
      },
      { q: "Is a will prepared this way legally valid?", a: TBC, needsInput: true },
    ],
  },
  {
    slug: "cancellation",
    title: "Changes & cancellation",
    items: [
      { q: "Can I cancel my policy?", a: TBC, needsInput: true },
      { q: "Can I upgrade or downgrade my package?", a: TBC, needsInput: true },
    ],
  },
  {
    slug: "customer-support",
    title: "Customer support",
    items: [
      { q: "How do I speak to a person?", a: "Call us, message us on WhatsApp, or request a callback. Prestige and Bespoke customers have a dedicated Funeral Care Consultant." },
      { q: "What are your support hours?", a: "CONTENT REQUIRED FROM DFS — support hours.", needsInput: true },
    ],
  },
];
