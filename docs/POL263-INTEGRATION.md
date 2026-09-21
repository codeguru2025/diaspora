# POL263 Integration

All integration goes through **`src/lib/pol263.ts`** (server-only). No POL263
credentials or base URLs reach the browser; the Next.js `app/api/*` route handlers
proxy the calls.

## Environment

| Var | Purpose |
|---|---|
| `POL263_API_BASE_URL` | DFS tenant host, e.g. `https://dfs.pol263.app` or the DFS custom domain |
| `POL263_ORG_ID` | The DFS `organizations.id` in POL263 |
| `POL263_PUBLIC_REF` | Agent/campaign referral code for the DFS org. **Required today** for the live quote engine + lead capture (existing public endpoints are ref-scoped). |
| `POL263_API_TOKEN` | Optional server-to-server bearer token |
| `NEXT_PUBLIC_POL263_PORTAL_URL` | The POL263 `/client` portal URL on the DFS domain |

With none set, the site runs entirely on local fallback.

## Source-of-truth table

| Data object | Owner | This site |
|---|---|---|
| Customer, Policy, Beneficiary, Member | **POL263** | never stores; calls the API |
| Premium / pricing rules | **POL263** (`product_versions`) | displays only |
| Payment + payment status | **POL263** / PayNow | links out / hands off |
| SMS & notifications | **POL263** | describes the benefit; never sends |
| Communication history, documents | **POL263** | portal deep-link |
| Lead / quote | **POL263** (`leads`, `quotes`) | captures, forwards |
| Marketing pages & copy | **this site** (`src/config`, later a CMS) | — |
| Product *presentation* (package names, positioning, comparison) | **this site config** → maps to POL263 `products.code` | — |
| Service catalogue *presentation* | **this site** until `add_ons` extended (audit §5) | — |
| Analytics | analytics platform (TBD) | emits events |

## Endpoints used today (already exist in POL263 `server/routes.ts` / `server/client-auth.ts`)

| Call | Endpoint | Notes |
|---|---|---|
| `getBranding()` | `GET /api/public/branding?orgId=` | org identity, currencies, timezone |
| `getPackages()` / `getRegistrationOptions()` | `GET /api/public/registration-options?ref=` | needs `POL263_PUBLIC_REF`; matched to packages by `products.code` |
| `getQuote()` | `POST /api/public/quote` | real premium engine; needs `refCode` |
| `registerPolicy()` | `POST /api/public/register-policy` | needs a `referralCode` field (not `refCode` — confirmed by direct testing 2026-09; also requires `nationalId`) + a real `productVersionId`; otherwise captured as a lead |
| `createLead()` | `POST /api/public/agent-vcard/:refCode/quote-lead` | ref-scoped fallback path |

## Customer portal — transparent proxy (built)

`/api/portal/[...path]` (`src/app/api/portal/[...path]/route.ts` + `src/lib/portal.ts`)
forwards an **allow-listed** set of paths to `${POL263_API_BASE_URL}/api/client-auth/<path>`,
relaying cookies both ways (POL263's `Set-Cookie` has its `Domain` stripped so the
session cookie is first-party to the DFS origin). The browser never talks to POL263
directly, so there is no CORS / SameSite problem.

Proxied paths in use: `login`, `logout`, `me`, `claim`, `enroll`, `policies`,
`policies/:id/{payments,members,document,beneficiary}`, `claims`, `receipts`,
`receipts/:id/download`, `notifications`, `payment-intents`,
`payment-intents/:id/{initiate,otp,status}`.

Returns `503 { code: "PORTAL_NOT_CONFIGURED" }` when `POL263_API_BASE_URL` is unset —
the portal UI then shows a "connecting soon" screen instead of an error.

**To go live:** set `POL263_API_BASE_URL` to the DFS tenant host. No other change
needed; the portal, join flow and quote engine all switch from fallback to live.

## Still needed from POL263 to fully activate Phase 2

- **Provision the DFS tenant** (`organizations` row) → `POL263_ORG_ID`.
- **`POL263_PUBLIC_REF`** — an agent/campaign referral code for the DFS org, so the
  existing ref-scoped quote + register-policy endpoints work. (Or add the
  ref-optional variants below.)
- Deploy POL263 so `POL263_API_BASE_URL` resolves to the DFS tenant host, and
  configure PayNow for that tenant.
- ~~Map each package's `pol263ProductCode`~~ done 2026-09-21 — POL263 products use
  the same codes as the package slugs (`ESSENTIAL`/`CLASSIC`/`PRESTIGE`/`BESPOKE`).
  `getQuote()`/`/api/quote` now resolve `packageSlug` → `pol263ProductCode` →
  `product_versions.id` via `resolveProductVersionId()` in `pol263.ts` before
  calling the real quote engine.
- ~~Premiums still need to be entered on the POL263 side~~ done 2026-09-21 —
  age-band rate cards (`age_band_rate_cards`, keyed by product version + age
  band + currency, `ratePerThousand` against each product's `coverAmount`) are
  configured for all four products. Live-verified via `/api/quote`: Essential
  $5.00/mo, Classic $31.25/mo, Prestige $125.00/mo, Bespoke $500.00/mo.

## Endpoints still needed (additive, org-scoped, ref-optional)

Proposed additions to POL263 — small, backwards-compatible, mirror existing patterns:

1. **`GET /api/public/products?orgId=`** — active products + latest versions for an
   org, no agent ref. (Today only `registration-options?ref=` exposes this.)
2. **`POST /api/public/leads`** — `{ orgId, firstName, lastName, phone, email?,
   source, productInterest?, countryOfResidence?, message?, context? }` → creates a
   `lead` with `source` in a D2C set. No ref required.
3. **`POST /api/public/funeral-request`** — `{ orgId, contact*, deceased*,
   serviceLocation, ... }` → creates a **high-priority** lead (and optionally a
   draft `funeral_case`) and fires an internal SMS/notification to the DFS at-need
   team. This is the "Arrange a Funeral Now" backend.
4. **`POST /api/public/quote` (ref-optional)** — accept `orgId` instead of
   requiring `refCode`, for D2C quotes.
5. **`POST /api/public/register-policy` (ref-optional, org-scoped)** — for P2 D2C
   join without an agent link. Already exists ref-scoped.
6. **`add_ons` schema extension** — audit §5. Then a
   `GET /api/public/service-catalogue?orgId=` so `getServiceCatalogue()` can stop
   using local config.

Each `pol263.ts` function already has a `NOT-YET-AVAILABLE` comment marking which
of the above it is waiting on, and a working fallback until then.

## Customer portal

The authenticated area (dashboard, payments, documents, claims, members,
notifications) is the **existing POL263 `/client` portal**, restyled in P2. Serve
it on the DFS domain by reverse-proxying `/client`, `/api/client-auth`,
`/api/public/pay*` and related paths to POL263, or host it at `my.<dfs-domain>`.
`/account` on this site links to `NEXT_PUBLIC_POL263_PORTAL_URL`.

## Security checklist for the new public endpoints

- Rate-limit per IP (POL263 already has `express-rate-limit` + optional Redis).
- Cloudflare Turnstile on lead / funeral-request / quote (already in POL263).
- Validate + normalise phone (intl + local `0…`), never echo PII in URLs.
- `source` allow-list server-side.
- Audit-log lead/funeral-request creation (POL263 `auditLog`).
- CORS: allow only the DFS marketing origin for these routes.
