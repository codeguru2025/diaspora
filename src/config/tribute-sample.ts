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
  photoCaption: "Photography direction: a warm, dignified portrait supplied by the family.",
  summary:
    "This is a sample tribute page, shown so families and DFS can review the format before " +
    "any real memorial goes live. A real page is written and supplied by the family.",
  service: [
    { label: "Service", detail: "CONFIGURE — venue, date and time" },
    { label: "Burial", detail: "CONFIGURE — location" },
    { label: "Livestream", detail: "CONFIGURE — link shared with the family closer to the day" },
  ],
  messages: [
    {
      name: "Example guest",
      location: "London, UK",
      message: "A placeholder condolence message, shown to illustrate the tribute wall layout.",
    },
    {
      name: "Example guest",
      location: "Harare, Zimbabwe",
      message: "On a real tribute page, messages like this are written by family and friends.",
    },
  ],
};

export function getSampleTribute(slug: string): SampleTribute | null {
  return slug === sampleTribute.slug ? sampleTribute : null;
}
