# Content & Configuration Checklist for DFS

Everything the website needs from Diaspora Funeral Services before launch. Nothing
in this list has been invented — the code shows placeholders (`CONFIGURE` /
`CONTENT REQUIRED FROM DFS`, rendered with a dashed underline).

## 1. Brand & contact (`src/config/site.ts`)

- [x] Final logo asset — DFS-supplied wordmark integrated (`public/brand/`, `src/components/layout/logo.tsx`) with light/dark variants + generated favicon/app icons
- [ ] General phone number + care-line (at-need) number
- [ ] WhatsApp number / click-to-chat link
- [ ] General email + at-need email
- [x] Office address — 312 Mership House, Bulawayo
- [x] Facebook, Instagram, YouTube — `@diasporafuneralservice`
- [x] LinkedIn — none for now (removed from the footer)
- [x] Legal entity — Thobela Diaspora Logistics
- [ ] Regulatory / licensing line for the footer (omitted while `null`)

## 2. Packages (`src/config/packages.ts` + POL263)

- [ ] Confirm the 4 package names & positioning statements
- [ ] Map each package to a POL263 `products.code` (`pol263ProductCode`)
- [ ] Configure products, versions, pricing, waiting periods, eligibility,
      grace periods, cover amounts, add-ons in POL263 (Staff → Products)
- [ ] Review / correct the **comparison matrix** (`comparison` in packages.ts) —
      which rows are Included ✓ / Add-on + / Not available — per tier
- [ ] Confirm concierge levels per tier
- [ ] Provide real "most chosen / most popular" data (or leave all `false`)
- [ ] Per-tier package highlight bullets (4–5 each)

## 3. Services marketplace (`src/config/services.ts`)

- [ ] Review every service: name, description, "what's included", "why choose it"
- [ ] Confirm pricing model per service (one-time / per-person / per-unit /
      per-service / monthly-premium / custom-quote / …)
- [ ] Confirm package availability per service (included / add-on / not available)
- [x] Interim: general timing guidance per service (no invented day counts) — replace with real lead times
- [ ] Supplier / fulfilment partner per service (internal)
- [ ] Location availability where relevant (e.g. livestreaming connectivity)
- [x] Interim: Unsplash stock photo for every service without a real one (`STOCK_SERVICE_PHOTOS` in `src/lib/stock-photos.ts`)
- [ ] Replace with real DFS imagery per service
- [ ] Add / remove services as the real catalogue dictates
- [ ] Confirm curated bundles (`src/config/bundles.ts`) and any bundle discount

## 4. Travel packs (`services.ts` → `individual-travel-pack`, `family-travel-pack`)

- [ ] Final contents of the individual and family travelling packs

## 5. FAQ (`src/config/faqs.ts`)

- [x] Policy answers written from the live POL263 product rules (ages 18–70, children to 20,
      90-day waiting period, accidental from day one, 30-day grace, 2 adults + 4 children)
- [ ] DFS review of FAQ wording; update if POL263 rules change

## 6. Resources (`src/config/resources.ts`)

- [x] Full article bodies for all 9 guides (`src/config/resource-articles.ts`)
- [ ] DFS review of article content

## 7. Testimonials (`src/config/content.ts`)

- [x] Collection: /share-your-story form (lands in POL263 as a `testimonial` lead, with
      consent-to-publish and name preference)
- [ ] Add each approved quote to `testimonials` with its `consentDate` — the homepage section
      appears automatically once there is one. Only real customers' words, approved by them.
- [x] Illustrative "how it works" stories (`familyStories`), always labelled as examples

## 8. Trust markers (`src/config/content.ts` → `trustMarkers`)

- [x] "Families served" — 24 (update as it grows, `src/config/content.ts`)
- [x] "Years of service" — intentionally not displayed while DFS is new
- [ ] Any accreditations / partnerships / licences (only if real)

## 9. Legal (`src/app/legal/*`)

- [x] Terms, Privacy, Cookie and Policy Information — full working drafts written
- [ ] Legal review of all four documents before relying on them
- [ ] Will-writing disclaimer wording
- [ ] Grief-support disclaimer wording

## 10. Diaspora (`src/config/content.ts` → `diasporaCountries`)

- [ ] Which countries are "available" now vs. "register interest"

## 11. Gallery (`src/app/gallery`)

- [x] Interim: free-license (Pexels) African/Zimbabwe-relevant stock photos per
      category (`src/lib/stock-photos.ts`) — Caskets already uses real DFS photos
- [ ] Swap each category to a real DFS photo when available

## 12. Imagery direction (site-wide)

- [x] Interim: homepage hero and resources hero use free-license stock photos
      (`src/lib/stock-photos.ts`) matching the warm/dignified/African direction
- [ ] Replace with real DFS photography — human, warm, elegant, Zimbabwean where
      possible, dignified; **no coffin-heavy imagery, no graphic grief, no
      fear-based imagery**

## 13. Integration & infra (`.env`, `docs/POL263-INTEGRATION.md`)

- [ ] Provision the DFS tenant in POL263; set `POL263_ORG_ID`
- [ ] Set `POL263_API_BASE_URL` to the DFS tenant host
- [ ] Create `POL263_PUBLIC_REF` (agent/campaign code) for D2C attribution
- [ ] Build the additive public endpoints listed in `POL263-INTEGRATION.md`
- [ ] Decide portal hosting (reverse-proxy `/client` vs. `my.` subdomain); set
      `NEXT_PUBLIC_POL263_PORTAL_URL`
- [ ] Choose an analytics provider; wire `src/lib/analytics.ts`; add a consent banner
- [ ] Final production domain → `NEXT_PUBLIC_SITE_URL`
