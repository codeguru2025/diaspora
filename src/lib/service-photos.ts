import { STOCK_SERVICE_PHOTOS } from "@/lib/stock-photos";

type Photo = { src: string; width: number; height: number };

/** Real product photos supplied by DFS, keyed by service slug. */
export const SERVICE_PHOTOS: Record<string, Photo> = {
  "premium-casket": { src: "/images/caskets/premium-casket.jpg", width: 1080, height: 890 },
  "custom-casket": { src: "/images/caskets/custom-casket.jpg", width: 810, height: 1080 },
  "custom-coffin-lace": { src: "/images/caskets/custom-coffin-lace.jpg", width: 1080, height: 1080 },
  "custom-casket-showcase": { src: "/images/caskets/custom-casket-showcase.jpg", width: 810, height: 1080 },
  "essential-casket": { src: "/images/caskets/essential-casket.jpg", width: 867, height: 1156 },
  "essential-casket-open": { src: "/images/caskets/essential-casket-open.jpg", width: 867, height: 1156 },
  // From a real DFS-conducted service. Any name/date text is blurred before use.
  "decor-and-tents": { src: "/images/tribute/img4596.jpg", width: 1280, height: 853 },
  "memorial-banner": { src: "/images/tribute/img4591.jpg", width: 1280, height: 567 },
};

/**
 * DFS product images, cut from DFS's own product brochures (public/brochures) with the poster
 * text left out. Used where DFS has no real photograph yet: real photos (above) come first, these
 * second, stock photography last.
 */
export const DFS_PRODUCT_PHOTOS: Record<string, Photo> = {
  "catering": { src: "/images/dfs/products/catering.jpg", width: 519, height: 705 },
  "customised-blanket": { src: "/images/dfs/products/blankets.jpg", width: 464, height: 560 },
  "memorial-collateral": { src: "/images/dfs/products/memorial-towels.jpg", width: 478, height: 248 },
  "scented-candles": { src: "/images/dfs/products/candles.jpg", width: 549, height: 625 },
  "custom-grave-marker": { src: "/images/dfs/products/grave-marker.jpg", width: 1400, height: 933 },
  "grave-flowers": { src: "/images/dfs/products/wreaths.jpg", width: 640, height: 368 },
  "individual-travel-pack": { src: "/images/dfs/products/travel-pack.jpg", width: 774, height: 545 },
  "family-travel-pack": { src: "/images/dfs/products/travel-pack.jpg", width: 774, height: 545 },
  "travel-assistance": { src: "/images/dfs/fleet/fortuner-front.jpg", width: 1600, height: 900 },
};

/** The DFS fleet — real photographs. */
export const FLEET_PHOTOS = {
  convoy: { src: "/images/dfs/fleet/fleet-convoy.jpg", width: 1800, height: 943 },
  front: { src: "/images/dfs/fleet/fortuner-front.jpg", width: 1600, height: 900 },
  hearseTrailer: { src: "/images/dfs/fleet/fortuner-hearse-trailer.jpg", width: 1600, height: 647 },
} satisfies Record<string, Photo>;

/**
 * DFS's own pictures for gallery categories: real photos from DFS-conducted services (any
 * visible name/date-of-birth/date-of-death text is blurred before use; third-party branding is
 * blurred too), the fleet, and product shots from DFS brochures. Takes priority over
 * `GALLERY_PHOTOS` (stock) in `src/lib/stock-photos.ts`.
 */
export const REAL_GALLERY_PHOTOS: Record<string, Photo> = {
  "Funeral setups": { src: "/images/tribute/dscf2207.jpg", width: 1600, height: 765 },
  "Décor": { src: "/images/tribute/img4672.jpg", width: 1600, height: 996 },
  "Personalisation": { src: "/images/tribute/img4590.jpg", width: 1600, height: 641 },
  "Fleet": FLEET_PHOTOS.convoy,
  "Grave markers": DFS_PRODUCT_PHOTOS["custom-grave-marker"],
  "Flowers": DFS_PRODUCT_PHOTOS["grave-flowers"],
  "Memorials": { src: "/images/dfs/products/urn.jpg", width: 360, height: 680 },
  "Catering": DFS_PRODUCT_PHOTOS["catering"],
  "Travel packs": DFS_PRODUCT_PHOTOS["individual-travel-pack"],
};

/** Every casket photo DFS has supplied so far, for the casket gallery slideshow. */
export const CASKET_GALLERY_PHOTOS: (Photo & { caption: string })[] = [
  { src: "/images/caskets/essential-casket.jpg", width: 867, height: 1156, caption: "Essential Casket" },
  { src: "/images/caskets/premium-casket.jpg", width: 1080, height: 890, caption: "Premium Casket" },
  { src: "/images/caskets/custom-casket.jpg", width: 810, height: 1080, caption: "Custom-Made Casket" },
  { src: "/images/caskets/custom-coffin-lace.jpg", width: 1080, height: 1080, caption: "Personalised Coffin Lace" },
  { src: "/images/caskets/custom-casket-showcase.jpg", width: 810, height: 1080, caption: "Bespoke Craftsmanship" },
  // From the DFS customised-caskets brochure.
  { src: "/images/dfs/products/casket-white.jpg", width: 735, height: 440, caption: "White casket with a customised stripe and message" },
  { src: "/images/dfs/products/casket-mahogany.jpg", width: 745, height: 440, caption: "Mahogany casket with a customised stripe and message" },
];

/** Best available photo for a service: a real DFS photo, then a DFS product image, then stock. */
export function servicePhoto(slug: string) {
  return SERVICE_PHOTOS[slug] ?? DFS_PRODUCT_PHOTOS[slug] ?? STOCK_SERVICE_PHOTOS[slug];
}
