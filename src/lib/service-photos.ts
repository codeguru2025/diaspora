/** Real product photos supplied by DFS, keyed by service slug. */
export const SERVICE_PHOTOS: Record<string, { src: string; width: number; height: number }> = {
  "premium-casket": { src: "/images/caskets/premium-casket.jpg", width: 1080, height: 890 },
  "custom-casket": { src: "/images/caskets/custom-casket.jpg", width: 810, height: 1080 },
  "custom-coffin-lace": { src: "/images/caskets/custom-coffin-lace.jpg", width: 1080, height: 1080 },
  "custom-casket-showcase": { src: "/images/caskets/custom-casket-showcase.jpg", width: 810, height: 1080 },
  // From a real DFS-conducted service. Any name/date text is blurred before use.
  "decor-and-tents": { src: "/images/tribute/img4596.jpg", width: 1280, height: 853 },
  "memorial-banner": { src: "/images/tribute/img4591.jpg", width: 1280, height: 567 },
};

/**
 * Real photos from DFS-conducted services, for gallery categories where they fit
 * better than a stock substitute. Any visible name/date-of-birth/date-of-death
 * text is blurred before use; third-party branding is blurred too. Takes
 * priority over `GALLERY_PHOTOS` (stock) in `src/lib/stock-photos.ts`.
 */
export const REAL_GALLERY_PHOTOS: Record<string, { src: string; width: number; height: number }> = {
  "Funeral setups": { src: "/images/tribute/dscf2207.jpg", width: 1600, height: 765 },
  "Décor": { src: "/images/tribute/img4672.jpg", width: 1600, height: 996 },
  "Personalisation": { src: "/images/tribute/img4590.jpg", width: 1600, height: 641 },
};

/** Every real casket photo DFS has supplied so far, for the casket gallery slideshow. */
export const CASKET_GALLERY_PHOTOS: { src: string; width: number; height: number; caption: string }[] = [
  { src: "/images/caskets/premium-casket.jpg", width: 1080, height: 890, caption: "Premium Casket" },
  { src: "/images/caskets/custom-casket.jpg", width: 810, height: 1080, caption: "Custom-Made Casket" },
  { src: "/images/caskets/custom-coffin-lace.jpg", width: 1080, height: 1080, caption: "Personalised Coffin Lace" },
  { src: "/images/caskets/custom-casket-showcase.jpg", width: 810, height: 1080, caption: "Bespoke Craftsmanship" },
];
