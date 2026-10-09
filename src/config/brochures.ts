/**
 * DFS brochures and product flyers (public/brochures). Each is the full poster as DFS designed it,
 * shown on /brochures to view and download, and linked from the pages it relates to.
 */
export interface Brochure {
  slug: string;
  title: string;
  src: string;
  width: number;
  height: number;
  /** Where the visitor can act on it. */
  href?: string;
}

const service = (slug: string, title: string, href?: string): Brochure => ({
  slug, title, src: `/brochures/${slug}.jpg`, width: 1240, height: 1753, href,
});
const product = (slug: string, title: string, href?: string): Brochure => ({
  slug, title, src: `/brochures/${slug}.jpg`, width: 1024, height: 1536, href,
});

/** "Our services" — the overview and one sheet per service category. */
export const serviceBrochures: Brochure[] = [
  service("services-00-overview", "Our services at a glance", "/services"),
  service("services-01-funeral-essentials", "Funeral essentials", "/services"),
  service("services-02-personalisation-memorial", "Personalisation & memorial", "/services"),
  service("services-03-ceremony-venue", "Ceremony & venue", "/services"),
  service("services-04-hospitality", "Hospitality", "/services"),
  service("services-05-media-memories", "Media & memories", "/digital-services"),
  service("services-06-family-support", "Family support", "/grief-support"),
  service("services-07-travel", "Travel", "/travel-pack"),
];

/** Product flyers. */
export const productBrochures: Brochure[] = [
  product("dfs-our-services-flyer", "Diaspora Funeral Services", "/services"),
  product("customised-caskets", "Customised caskets", "/custom-caskets"),
  product("funeral-transportation", "Funeral transportation", "/services"),
  product("tents-and-marquees", "Tents & marquee hire", "/services"),
  product("catering", "Catering services", "/services/catering"),
  product("customised-wreaths", "Customised wreaths", "/services/grave-flowers"),
  product("scented-candles", "Scented candles", "/services/scented-candles"),
  product("memorial-blankets", "Custom memorial blankets", "/services/customised-blanket"),
  product("memorial-products", "Customised memorial products", "/services/memorial-collateral"),
  product("grave-markers", "Custom grave markers", "/services/custom-grave-marker"),
  product("grave-pack", "Grave pack", "/services"),
  product("custom-urns", "Custom urns", "/services"),
  product("funeral-travel-pack", "Funeral travel pack", "/travel-pack"),
];
