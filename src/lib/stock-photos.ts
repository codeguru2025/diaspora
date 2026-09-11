/**
 * Free-license stock photography (Pexels License — free for commercial use, no
 * attribution required) used to fill placeholder imagery until DFS supplies real
 * photos. Chosen for African/Zimbabwean relevance where a genuinely local photo
 * exists; a few generic categories (e.g. livestreaming equipment) are not
 * culturally specific by nature. Swap any entry out the moment a real photo
 * exists — see docs/CONTENT-CHECKLIST.md §12.
 */

export const HOME_HERO_PHOTO = { src: "/images/stock/home-hero.jpg", width: 1200, height: 1800 };

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
