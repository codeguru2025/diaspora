# POL263 `add_ons` — additive schema extension for the DFS marketplace

This is the concrete change referenced in `DFS-SYSTEM-AUDIT.md` §5 and
`POL263-INTEGRATION.md`. It is **purely additive and nullable** — every existing
`add_ons` row and all existing premium/quote/policy logic is unaffected.

Until this lands, `src/config/services.ts` in this repo is authoritative for the
marketplace *presentation*, and POL263 holds only the priced line item.

## 1. Current `add_ons` (POL263 `shared/schema.ts`)

```ts
export const addOns = pgTable("add_ons", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  name: text("name").notNull(),
  description: text("description"),
  pricingMode: text("pricing_mode").default("flat").notNull(),
  priceAmount: numeric("price_amount"),
  priceMonthly: numeric("price_monthly"),
  priceWeekly: numeric("price_weekly"),
  priceBiweekly: numeric("price_biweekly"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

## 2. Proposed additions

```ts
  // ── Marketplace presentation (all nullable / additive) ──
  category: text("category"),                    // e.g. "media-memories" (see DFS categories)
  slug: text("slug"),                            // stable public slug for the DFS site
  shortDescription: text("short_description"),
  includesJson: jsonb("includes_json"),          // string[] — "what's included"
  whyChoose: text("why_choose"),
  imageUrl: text("image_url"),
  displayOrder: integer("display_order").default(100).notNull(),

  // ── Richer pricing (pricingMode gains these values; math unchanged for existing modes) ──
  //   existing: "flat" | "monthly" | "weekly" | "biweekly"
  //   new:      "one_time" | "per_person" | "per_unit" | "per_service" | "per_session"
  //             | "location_dependent" | "custom_quote" | "supplier_dependent"
  pricingNote: text("pricing_note"),             // human note shown near the price treatment
  leadTimeNote: text("lead_time_note"),

  // ── Fulfilment (internal) ──
  supplierId: uuid("supplier_id"),               // → a suppliers table, when one exists
  locationAvailabilityJson: jsonb("location_availability_json"), // province/country allow-list or null = anywhere

  // ── Merchandising ──
  packageAvailabilityJson: jsonb("package_availability_json"),   // { [productCode]: "included"|"addon"|"not_available" }
  recommendedProductCodesJson: jsonb("recommended_product_codes_json"), // string[]
  relatedAddOnSlugsJson: jsonb("related_add_on_slugs_json"),     // string[] — powers contextual upsell
  bundleSlugsJson: jsonb("bundle_slugs_json"),                   // string[] — curated collections
  upsellMessage: text("upsell_message"),
  ceremonialTag: text("ceremonial_tag"),         // "catholic" | "christian" | "traditional" | "non_religious" | null
```

Optionally a sibling `add_on_bundles` table mirroring `src/config/bundles.ts`
(`slug, name, blurb, itemSlugsJson, ceremonial, recommendedProductCodesJson,
accent`) — or keep bundles as DFS-site config and only join by `bundleSlugsJson`.

## 3. Migration SQL (idempotent)

```sql
ALTER TABLE add_ons
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS short_description text,
  ADD COLUMN IF NOT EXISTS includes_json jsonb,
  ADD COLUMN IF NOT EXISTS why_choose text,
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 100,
  ADD COLUMN IF NOT EXISTS pricing_note text,
  ADD COLUMN IF NOT EXISTS lead_time_note text,
  ADD COLUMN IF NOT EXISTS supplier_id uuid,
  ADD COLUMN IF NOT EXISTS location_availability_json jsonb,
  ADD COLUMN IF NOT EXISTS package_availability_json jsonb,
  ADD COLUMN IF NOT EXISTS recommended_product_codes_json jsonb,
  ADD COLUMN IF NOT EXISTS related_add_on_slugs_json jsonb,
  ADD COLUMN IF NOT EXISTS bundle_slugs_json jsonb,
  ADD COLUMN IF NOT EXISTS upsell_message text,
  ADD COLUMN IF NOT EXISTS ceremonial_tag text;

CREATE UNIQUE INDEX IF NOT EXISTS add_ons_slug_org_idx ON add_ons (organization_id, slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS add_ons_category_idx ON add_ons (organization_id, category);
```

Then `npm run db:push` (dev) or generate a migration (`npm run db:migrate`).

## 4. Public read endpoint (new, org-scoped, ref-optional)

```
GET /api/public/service-catalogue?orgId=<uuid>
```

```ts
// server/routes.ts — near the other /api/public/* handlers
app.get("/api/public/service-catalogue", async (req, res) => {
  const orgId = String(req.query.orgId || "");
  if (!orgId) return res.status(400).json({ message: "orgId required" });
  const rows = (await storage.getAddOnsByOrg(orgId)).filter((a) => a.isActive);
  res.json({
    categories: /* distinct category values, or a static list */ [],
    services: rows
      .filter((a) => a.slug)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((a) => ({
        slug: a.slug,
        name: a.name,
        category: a.category,
        shortDescription: a.shortDescription,
        description: a.description,
        includes: a.includesJson ?? [],
        whyChoose: a.whyChoose,
        image: a.imageUrl,
        pricing: { model: a.pricingMode, note: a.pricingNote },
        availability: a.packageAvailabilityJson ?? {},
        relatedServices: a.relatedAddOnSlugsJson ?? [],
        bundles: a.bundleSlugsJson ?? [],
        upsellMessage: a.upsellMessage,
        leadTime: a.leadTimeNote,
        ceremonialTag: a.ceremonialTag,
        displayOrder: a.displayOrder,
      })),
  });
});
```

Rate-limit + optional Turnstile like the other public GETs.

## 5. Wiring on this site

`src/lib/pol263.ts` → `getServiceCatalogue()` currently returns the local config.
Once the endpoint exists, switch it to fetch `/api/public/service-catalogue?orgId=`
and fall back to `src/config/services.ts` on any failure — the response shape
above is already the `ServiceItem` shape used throughout the components, so no
component changes are needed. The recommendation engine
(`src/lib/recommendations.ts`) reads `relatedServices` / `bundles` /
`recommendedProductCodes` from the same objects.

## 6. Migration of the placeholder catalogue

`src/config/services.ts` doubles as the seed content: one `add_ons` row per
`ServiceItem`, `slug` = the config slug, `pricingMode` = `pricing.model`,
`packageAvailabilityJson` keyed by the real `products.code` (not the DFS package
slug). A short `script/seed-dfs-catalogue.ts` in POL263 can import the JSON and
upsert by `(organization_id, slug)`.
