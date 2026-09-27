/**
 * Free-license stock photography (Pexels License — free for commercial use, no
 * attribution required) used to fill placeholder imagery until DFS supplies real
 * photos. Chosen for African/Zimbabwean relevance where a genuinely local photo
 * exists; a few generic categories (e.g. livestreaming equipment) are not
 * culturally specific by nature. Swap any entry out the moment a real photo
 * exists — see docs/CONTENT-CHECKLIST.md §12.
 */

// The homepage hero now uses a real DFS service photo (HOME_HERO_PHOTO in service-photos.ts).

export const RESOURCES_HERO_PHOTO = { src: "/images/stock/resources-hero.jpg", width: 1200, height: 1800 };

export const GALLERY_PHOTOS: Record<string, { src: string; width: number; height: number }> = {
  "Grave markers": { src: "/images/stock/gallery-grave-markers.jpg", width: 1200, height: 800 },
  "Décor": { src: "/images/stock/gallery-decor.jpg", width: 1200, height: 800 },
  "Flowers": { src: "/images/stock/gallery-flowers.jpg", width: 1200, height: 1798 },
  "Memorials": { src: "/images/stock/gallery-memorials.jpg", width: 1200, height: 800 },
  "Funeral setups": { src: "/images/stock/gallery-funeral-setups.jpg", width: 1200, height: 1800 },
  "Catering": { src: "/images/stock/gallery-catering.jpg", width: 1200, height: 800 },
  "Travel packs": { src: "/images/stock/gallery-travel-packs.jpg", width: 1200, height: 1600 },
  "Personalisation": { src: "/images/stock/gallery-personalisation.jpg", width: 1200, height: 800 },
  "Photography": { src: "/images/stock/gallery-photography.jpg", width: 1200, height: 1800 },
  "Livestreaming": { src: "/images/stock/gallery-livestreaming.jpg", width: 1200, height: 800 },
};

/**
 * Free-license stock photos (Unsplash License — free for commercial use, no
 * attribution required) for services DFS hasn't photographed yet, keyed by
 * service slug. `SERVICE_PHOTOS` (real DFS photos) always takes priority.
 * Unsplash photo IDs are noted for provenance.
 */
export const STOCK_SERVICE_PHOTOS: Record<string, { src: string; width: number; height: number }> = {
  "custom-grave-marker": GALLERY_PHOTOS["Grave markers"],
  "customised-blanket": { src: "/images/stock/service-customised-blanket.jpg", width: 675, height: 1200 }, // WB7wXI8S0SE
  "memorial-programme": { src: "/images/stock/service-memorial-programme.jpg", width: 1200, height: 800 }, // YxItasrqtKE
  "memorial-collateral": { src: "/images/stock/service-memorial-collateral.jpg", width: 1200, height: 800 }, // k8iIfs-HErc
  "pa-system": { src: "/images/stock/service-pa-system.jpg", width: 1200, height: 800 }, // ekHSHvgr27k
  "floodlights": { src: "/images/stock/service-floodlights.jpg", width: 800, height: 1200 }, // sIUbsedOQaA
  "scented-candles": { src: "/images/stock/service-scented-candles.jpg", width: 800, height: 1200 }, // e7cDMN6f0gs
  "floral-arrangement": { src: "/images/stock/service-floral-arrangement.jpg", width: 1200, height: 800 }, // mIiKyi4kJ7E
  "grave-flowers": { src: "/images/stock/service-grave-flowers.jpg", width: 1200, height: 800 }, // cQ-66Evaf5g
  "graveside-snacks": { src: "/images/stock/service-graveside-snacks.jpg", width: 1200, height: 801 }, // nZDQg_LpFGo
  "catering": { src: "/images/stock/service-catering.jpg", width: 1200, height: 800 }, // qoxK2LBKmIs
  "family-hospitality": { src: "/images/stock/service-family-hospitality.jpg", width: 1200, height: 800 }, // gVyFFZo18ts
  "photography": GALLERY_PHOTOS["Photography"],
  "videography": { src: "/images/stock/service-videography.jpg", width: 800, height: 1200 }, // IcwAKUhNGXs
  "livestreaming": GALLERY_PHOTOS["Livestreaming"],
  "memorial-video": { src: "/images/stock/service-memorial-video.jpg", width: 800, height: 1200 }, // A1fl8JjL0i4
  "online-tribute": { src: "/images/stock/service-online-tribute.jpg", width: 900, height: 1200 }, // P1ntFrxgoPk
  "grief-counselling": { src: "/images/stock/service-grief-counselling.jpg", width: 800, height: 1200 }, // aPa843frIzI
  "will-writing": { src: "/images/stock/service-will-writing.jpg", width: 1200, height: 674 }, // wkfZyteTMOA
  "post-funeral-support": { src: "/images/stock/service-post-funeral-support.jpg", width: 1200, height: 900 }, // zQQ6Y5_RtHE
  "individual-travel-pack": { src: "/images/stock/service-individual-travel-pack.jpg", width: 800, height: 1200 }, // oXk-03LEFsk
  "family-travel-pack": GALLERY_PHOTOS["Travel packs"],
  "travel-assistance": { src: "/images/stock/service-travel-assistance.jpg", width: 1200, height: 800 }, // rUXh5USKfUQ
};

/** Sample tribute page portrait stand-in (Unsplash OknxyyiIM4g). */
export const TRIBUTE_SAMPLE_PHOTO = { src: "/images/stock/tribute-sample.jpg", width: 1200, height: 800 };
