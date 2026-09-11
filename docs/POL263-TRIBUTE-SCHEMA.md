# POL263 `tributes` — schema for the Digital Memorial / Tribute Page product

Referenced from `DFS-SYSTEM-AUDIT.md` §7 (Phase 4 — digital-memorial area) and
sold today as the "Online Tribute & Announcement" line item in
`src/config/services.ts` (`online-tribute`). This is the schema needed to make
that a real, live product instead of a marketing description.

The DFS site currently has **no database of its own** — everything either
proxies to POL263 or degrades to local config/URL-encoded state (see
`/q/[token]` for saved quotes). A tribute page's defining feature — a
**guestbook every visitor can add to and everyone else can see** — cannot be
built that way: it needs shared, durable, multi-writer storage. That has to
live in POL263. Until it exists, `/tribute/[slug]` on this site only resolves
one hardcoded, clearly-fictional sample record (`src/config/tribute-sample.ts`),
so the product can be reviewed without inventing a real memorial.

## 1. New tables

```ts
export const tributes = pgTable("tributes", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  policyId: uuid("policy_id").references(() => policies.id),      // link to the funeral this belongs to, if any
  slug: text("slug").notNull(),                                    // public URL segment — /tribute/:slug
  name: text("name").notNull(),                                    // the person being remembered
  bornOn: date("born_on"),
  diedOn: date("died_on"),
  photoUrl: text("photo_url"),
  summary: text("summary"),                                        // family-written announcement text
  serviceDetailsJson: jsonb("service_details_json"),                // [{ label, detail }] — venue, burial, livestream link
  livestreamUrl: text("livestream_url"),
  status: text("status").default("draft").notNull(),                // "draft" | "published" | "archived"
  moderationMode: text("moderation_mode").default("pre").notNull(), // "pre" | "post" | "off"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  publishedAt: timestamp("published_at"),
});

export const tributeMessages = pgTable("tribute_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  tributeId: uuid("tribute_id").notNull().references(() => tributes.id),
  authorName: text("author_name").notNull(),
  authorLocation: text("author_location"),
  message: text("message").notNull(),
  status: text("status").default("pending").notNull(),  // "pending" | "approved" | "rejected"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

## 2. Migration SQL (idempotent)

```sql
CREATE TABLE IF NOT EXISTS tributes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  policy_id uuid REFERENCES policies(id),
  slug text NOT NULL,
  name text NOT NULL,
  born_on date,
  died_on date,
  photo_url text,
  summary text,
  service_details_json jsonb,
  livestream_url text,
  status text NOT NULL DEFAULT 'draft',
  moderation_mode text NOT NULL DEFAULT 'pre',
  created_at timestamp NOT NULL DEFAULT now(),
  published_at timestamp
);

CREATE UNIQUE INDEX IF NOT EXISTS tributes_slug_org_idx ON tributes (organization_id, slug);

CREATE TABLE IF NOT EXISTS tribute_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tribute_id uuid NOT NULL REFERENCES tributes(id),
  author_name text NOT NULL,
  author_location text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tribute_messages_tribute_idx ON tribute_messages (tribute_id, status);
```

## 3. Public endpoints (new, org-scoped)

```
GET  /api/public/tributes/:slug?orgId=<uuid>
     → { name, dates, photoUrl, summary, serviceDetails, livestreamUrl,
         messages: [{ authorName, authorLocation, message, createdAt }] }
     Only status = "published" resolves; only status = "approved" messages
     are included in the response.

POST /api/public/tributes/:slug/messages { orgId, authorName, authorLocation?, message }
     → { ok: true, status: "pending" | "approved" }
     Rate-limited + Turnstile (same posture as the other public POSTs). Honours
     the tribute's moderationMode: "pre" queues as pending, "post" publishes
     immediately but stays reportable, "off" is not recommended but supported.
```

An authenticated, org-scoped pair for DFS staff to create/edit a tribute and
moderate pending messages (approve/reject) lives alongside the existing
portal/admin routes, not under `/api/public/*`.

## 4. Wiring on this site

- `src/config/tribute-sample.ts` → replace `getSampleTribute()` with a fetch to
  `GET /api/public/tributes/:slug?orgId=` once the endpoint exists, falling
  back to `notFound()` (never to invented content) on failure.
- `src/app/tribute/[slug]/page.tsx` → the message form currently renders
  `disabled` with a `NeedsInput` note; wire its `onSubmit` to
  `POST /api/public/tributes/:slug/messages` and remove the disabled state
  once the endpoint exists.
- `src/app/tribute/page.tsx`'s request form already posts to `/api/leads`
  (`source: "tribute_request"`) — that path needs no change; a DFS staff member
  creates the actual `tributes` row from the lead, at least until there is a
  self-serve creation flow.
- Slugs should be short and shareable (e.g. first name + surname + a short
  suffix), generated server-side and checked for collisions within the org.
