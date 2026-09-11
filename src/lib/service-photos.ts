/** Real product photos supplied by DFS, keyed by service slug. */
export const SERVICE_PHOTOS: Record<string, { src: string; width: number; height: number }> = {
  "premium-casket": { src: "/images/caskets/premium-casket.jpg", width: 1080, height: 890 },
  "custom-casket": { src: "/images/caskets/custom-casket.jpg", width: 810, height: 1080 },
  "custom-coffin-lace": { src: "/images/caskets/custom-coffin-lace.jpg", width: 1080, height: 1080 },
};

/** Every real casket photo DFS has supplied so far, for the casket gallery slideshow. */
export const CASKET_GALLERY_PHOTOS: { src: string; width: number; height: number; caption: string }[] = [
  { src: "/images/caskets/premium-casket.jpg", width: 1080, height: 890, caption: "Premium Casket" },
  { src: "/images/caskets/custom-casket.jpg", width: 810, height: 1080, caption: "Custom-Made Casket" },
  { src: "/images/caskets/custom-coffin-lace.jpg", width: 1080, height: 1080, caption: "Personalised Coffin Lace" },
  { src: "/images/caskets/custom-casket-showcase.jpg", width: 810, height: 1080, caption: "Bespoke Craftsmanship" },
];
