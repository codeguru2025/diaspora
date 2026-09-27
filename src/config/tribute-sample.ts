/**
 * Sample data for the Tribute Page product demo (`/tribute/[slug]`).
 *
 * Phase 4 — Digital Memorial. Real tribute pages need durable, multi-writer
 * storage (a guestbook every visitor can add to and everyone else can see),
 * which this repo does not have — see `docs/POL263-TRIBUTE-SCHEMA.md` for the
 * proposed backend. Until that exists, only this one illustrative, clearly
 * fictional record resolves, so the product can be demonstrated and reviewed
 * without inventing a real memorial or real messages from real people.
 */

export type TributeMessage = {
  name: string;
  location: string;
  message: string;
};

export type SampleTribute = {
  slug: string;
  name: string;
  dates: string;
  photoCaption: string;
  summary: string;
  service: {
    label: string;
    detail: string;
  }[];
  messages: TributeMessage[];
};

export const sampleTribute: SampleTribute = {
  slug: "sample",
  name: "[Example] Tendai Moyo",
  dates: "1958 – 2026",
  photoCaption: "A lit candle and roses in memory — on a real page, a portrait supplied by the family.",
  summary:
    "This is a sample tribute page, shown so families and DFS can review the format before " +
    "any real memorial goes live. A real page is written and supplied by the family.",
  service: [
    { label: "Service", detail: "Saturday 14 November, 10:00 — Methodist Church, Mabelreign, Harare" },
    { label: "Burial", detail: "Warren Hills Cemetery, Harare, following the service" },
    { label: "Livestream", detail: "Link shared with family and friends the day before" },
  ],
  messages: [
    {
      name: "Rudo M.",
      location: "London, UK",
      message:
        "Baba, you taught us that family is everything. We are carrying your laughter and your " +
        "kindness with us. Rest well.",
    },
    {
      name: "Farai C.",
      location: "Harare, Zimbabwe",
      message:
        "A gentle, generous man who always had time for everyone who came through his gate. " +
        "Our thoughts are with the whole Moyo family.",
    },
    {
      name: "Nyasha & family",
      location: "Johannesburg, South Africa",
      message: "Watching from afar but standing with you in spirit. Lala ngoxolo, sekuru.",
    },
  ],
};

export function getSampleTribute(slug: string): SampleTribute | null {
  return slug === sampleTribute.slug ? sampleTribute : null;
}
