# DFS System Audit

_Assessment performed before building. Confirmed against the `../POL263` repo._

## 0. Starting position

- `diaspora/` was **empty** — greenfield, no existing DFS code.
- `../POL263` is a **mature, production multi-tenant funeral/policy platform**. The
  MEGA PROMPT's premise ("POL263 is the administrative and communications
  backbone") is accurate.
- **Decisions taken** (from the product owner):
  1. Build DFS as a **standalone app in `diaspora/`** consuming POL263 APIs.
  2. **DFS operates as its own POL263 tenant organisation.**
  3. Build **Phase 1 now** with placeholder content.

## 1. POL263 stack (KNOWN)

| Layer | Tech |
|---|---|
| Frontend | React 19 + Vite 5 (pinned), Tailwind 3.4 (pinned), shadcn/ui, Wouter, TanStack Query |
| Backend | Express 5 + TS. `server/routes.ts` (~14.5k lines), `server/storage.ts` (~8k lines) |
| DB | PostgreSQL + Drizzle. Control-plane DB + optional per-tenant DBs. `shared/schema.ts` (~4.4k lines) |
| Auth | Staff: Google OAuth. Clients: policy-number + password (argon2) or Google. PG sessions |
| Payments | PayNow (EcoCash/OneMoney/InnBucks/Omari/card). Idempotent, **polled** (no webhooks) |
| Comms | Per-tenant SMS (SMSala/Africala), email, WhatsApp (platform MFA only), Expo push. Template engine + `notification_logs` |
| Multi-tenancy | `organization_id` on every table; `requireTenantScope()`. Tenant resolved by subdomain / custom domain (`control_plane.tenant_domains`) |
| Deploy | DigitalOcean App Platform, `deploy` branch, port 5000 |

## 2. Already built in POL263 — reused, NOT rebuilt

| Capability | Where |
|---|---|
| Premium quote engine (same fn as real issuance) | `server/quote-engine.ts`, `POST /api/public/quote` |
| Shareable saved quotes | `quotes` table, `GET /api/public/quote/:id`, `quote-view.tsx` |
| Lead capture + pipeline | `leads` table, `createLead`, `?ref=` attribution |
| Public policy registration | `GET /api/public/registration-options`, `POST /api/public/register-policy`, `walkin-register` |
| Public payment links | `/pay/:token`, `billing-public-routes.ts` |
| Per-tenant branding | `GET /api/public/branding` |
| Products / versioned pricing / add-ons / bundles | `products`, `product_versions`, `add_ons`, `benefit_bundles`, `age_band_configs` |
| Funeral service items + costing | `price_book_items`, `cost_sheets`, `cost_line_items` |
| At-need workflow | `claims` → `funeral_cases` → `funeral_tasks`, fleet dispatch, SLA |
| Client portal | `client/src/pages/client/*` (dashboard, payments, documents, claims, members) |
| Documents / PDFs | policy docs, receipts, member cards, brochures (PDFKit) |
| Event-driven SMS/notifications | `notification_templates` |
| Consent capture, immutable audit, DB-driven RBAC | `clients.consentedAt`, `audit_logs`, `roles`/`permissions` |

## 3. What this site adds (the real gap)

The gap is **premium brand experience + the personalisation marketplace**, not plumbing:

1. DFS brand + design system (warm/elegant; POL263's is a functional SaaS look).
2. All marketing surface: homepage, About, How It Works, Diaspora, campaign
   landing pages, Resources/SEO, FAQ, gallery, legal placeholders.
3. Four **named** packages as a presentation + mapping layer over POL263 products.
4. Mobile-first package **comparison** (✓ / + / —).
5. The **personalisation marketplace** — a richer service model than POL263's
   current `add_ons` (see §5 below), curated bundles, contextual upsell.
6. Guided **Policy Builder / quote wizard** with progress + dynamic pricing.
7. Compassionate **at-need intake** (no insurance-style registration).
8. Diaspora specifics (country of residence, intl phone, currency display).
9. **Analytics event layer** + abandoned-quote capture (consent-gated).
10. Org-scoped, **ref-optional public endpoints** in POL263 (see
    `POL263-INTEGRATION.md`).

## 4. What must NOT be rebuilt

Premium calc · policy/client/beneficiary/member creation · PayNow · SMS/email/
notification engine · claims & funeral-ops · client portal auth & dashboard ·
documents/PDFs · audit · RBAC · tenant branding · quote engine · lead pipeline.
**Source of truth stays POL263** for every customer/policy/payment/comms record.

## 5. `add_ons` schema — additive extension required

POL263's `add_ons` today: `name, description, pricingMode (flat|…), price*, isActive`.
The marketplace needs (all **nullable / additive** — no behaviour change to existing rows):
`category, imageUrl, leadTimeNote, supplierId, locationAvailability, upsellMessage,
recommendedPackages[], bundleIds[], displayOrder`, plus pricing modes
`per_person | per_unit | per_service | per_session | location_dependent |
custom_quote | supplier_dependent`. Until this lands, `src/config/services.ts` is
authoritative for presentation and POL263 holds only the priced line items.

## 6. Risks

- **Scope** — ~25 route groups + wizard + marketplace + CMS. Phased (see below).
- **No business content** — almost all package/FAQ/legal/stat copy is placeholder
  by design (§58). Nothing fabricated.
- **New public attack surface** — unauthenticated endpoints need rate limiting,
  Turnstile (already in POL263), validation, no PII in URLs.
- **Auth model** — POL263 client login is by **policy number**, not email. A D2C
  consumer site may want email/Google (POL263 already supports client Google OAuth).
- **Cross-origin** — sessions/CSRF are same-origin in POL263. Keep the portal on
  the DFS domain via reverse-proxy, or a `my.` subdomain; this marketing site
  stays cookieless (public reads + lead writes only).

## 7. Recommended phasing

- **P1 (this build)** — brand system, all discovery/marketing pages, quote wizard
  (lead-generating), at-need intake, campaign landing pages, SEO. Low risk, no
  POL263 write path beyond leads.
- **P2** — connect quote engine (`POL263_PUBLIC_REF`), D2C registration without
  agent ref, account creation, PayNow handoff, restyle the client portal.
- **P3** — `add_ons` schema extension, full marketplace, saved quotes,
  abandoned-quote recovery, analytics provider, smart recommendations.
- **P4** — concierge tiers, digital-memorial area, supplier management,
  multi-country config.
