# Content & Configuration Checklist for DFS

Everything the website needs from Diaspora Funeral Services before launch. Nothing
in this list has been invented — the code shows placeholders (`CONFIGURE` /
`CONTENT REQUIRED FROM DFS`, rendered with a dashed underline).

## 1. Brand & contact (`src/config/site.ts`)

- [ ] Final logo asset (SVG) — currently a text wordmark
- [ ] General phone number + care-line (at-need) number
- [ ] WhatsApp number / click-to-chat link
- [ ] General email + at-need email
- [ ] Office address and hours
- [ ] Social media URLs (Facebook, Instagram, LinkedIn, YouTube)
- [ ] Legal entity name + regulatory / licensing line for the footer

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
- [ ] Real lead times per service
- [ ] Supplier / fulfilment partner per service (internal)
- [ ] Location availability where relevant (e.g. livestreaming connectivity)
- [ ] Real imagery for each service and category
- [ ] Add / remove services as the real catalogue dictates
- [ ] Confirm curated bundles (`src/config/bundles.ts`) and any bundle discount

## 4. Travel packs (`services.ts` → `individual-travel-pack`, `family-travel-pack`)

- [ ] Final contents of the individual and family travelling packs

## 5. FAQ (`src/config/faqs.ts`)

- [ ] Every answer marked `needsInput` — all policy-rule questions:
      waiting periods, eligibility & age limits, missed payments, documents for a
      claim, funeral turnaround time, will validity, cancellation, upgrade/downgrade,
      support hours, max family members

## 6. Resources (`src/config/resources.ts`)

- [ ] Full article bodies for all 9 guides (outlines are provided)
- [ ] `updated` dates

## 7. Testimonials (`src/config/content.ts`)

- [ ] Real, signed-off customer quotes (name, location, service, quote, optional
      photo). The array is **empty** — none are fabricated. `PLACEHOLDER_TESTIMONIALS`
      is dev-only and must never ship.

## 8. Trust markers (`src/config/content.ts` → `trustMarkers`)

- [ ] "Families served" figure (or drop the marker)
- [ ] "Years of service" figure (or drop the marker)
- [ ] Any accreditations / partnerships / licences (only if real)

## 9. Legal (`src/app/legal/*`)

- [ ] Terms & Conditions — full wording (legal review)
- [ ] Privacy Policy — full wording (legal review)
- [ ] Cookie Policy — once an analytics provider is chosen
- [ ] Policy Information — plain-language + link to signed policy docs
- [ ] Will-writing disclaimer wording
- [ ] Grief-support disclaimer wording

## 10. Diaspora (`src/config/content.ts` → `diasporaCountries`)

- [ ] Which countries are "available" now vs. "register interest"

## 11. Gallery (`src/app/gallery`)

- [ ] Real images per category (photography direction is documented on the page)

## 12. Imagery direction (site-wide)

- [ ] Hero and section photography — human, warm, elegant, Zimbabwean where
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
