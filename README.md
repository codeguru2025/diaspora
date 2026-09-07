# Diaspora Funeral Services — Customer Website

The premium customer-facing sales, discovery, onboarding and support layer for
**Diaspora Funeral Services (DFS)**. Standalone Next.js app that consumes the
**POL263** platform's APIs. POL263 remains the administrative + communications
backbone and the source of truth for customers, policies, payments and SMS.

> Distance should never determine the quality of care your family receives.
> From the essential to the extraordinary. Name it. We provide it.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS v4** — brand design system in `src/app/globals.css`
- Fonts: Fraunces (display) + Inter (body), via `next/font`
- `lucide-react` icons
- No database of its own. Reads/writes go to POL263 (`src/lib/pol263.ts`) with
  graceful local fallback.

## Getting started

```bash
npm install
cp .env.example .env.local      # fill in POL263_* when the DFS tenant is provisioned
npm run dev                      # http://localhost:3000
npm run build && npm run start   # production build
npm run lint
```

The site runs fully **without** any POL263 configuration — every page renders from
local placeholder config and forms capture leads to a server log. Set the
`POL263_*` env vars to switch reads/writes to the live tenant.

## Project structure

```
src/
  config/          Presentation content + data models (all placeholder, marked CONFIGURE)
    site.ts        Brand, nav, contact channels, CTAs
    packages.ts    The 4 packages (Essential/Classic/Prestige/Bespoke) + comparison matrix
    services.ts    The personalisation marketplace catalogue (categories + items)
    bundles.ts     Curated add-on collections
    faqs.ts        FAQ (policy-dependent answers are placeholders)
    resources.ts   Resource-centre article stubs
    content.ts     Testimonials (empty), trust markers, diaspora data, steps
  lib/
    pol263.ts      POL263 integration — public reads/writes: branding, packages, quote,
                   leads, registration, funeral requests (server-only, typed, with fallback)
    portal.ts      Transparent proxy to POL263 /api/client-auth/* (server-only)
    portal-client.ts    Client-side portal API + usePortalSession() hook
    selection-store.ts  Per-viewer "funeral in progress" (localStorage) + hook
    application-store.ts  The in-progress /join application (localStorage) + hook
    analytics.ts   Event vocabulary (§54) — provider not yet wired
    format.ts, cn.ts
  components/
    ui/            Design-system primitives (Button, Section, Card, Badge, Accordion, Field…)
    layout/        Header, Footer, mobile nav, sticky CTA, Logo
    marketing/     Hero, package cards + comparison, service cards, bundle cards, sections
    forms/         Quote wizard, Join flow, PayNow panel, Arrange-a-Funeral form, Lead form
    portal/        Portal shell (auth guard + sub-nav), login
  app/
    (marketing)    Home, packages, services, how-it-works, for-the-diaspora, about,
                   get-a-quote, protect-my-family, arrange-a-funeral, contact, faq,
                   gallery, resources, digital-services, campaign landing pages, legal
    join/          Guided application (account → family → beneficiary → review → submit)
    account/       Customer portal — login, enroll, dashboard, payments, documents, claims
    api/
      quote · leads · arrange-funeral · join/register   (server-side POL263 calls)
      portal/[...path]   transparent, allow-listed proxy → POL263 /api/client-auth/*
    sitemap.ts, robots.ts, not-found.tsx
docs/
  DFS-SYSTEM-AUDIT.md      Assessment of POL263 + what this site adds
  POL263-INTEGRATION.md    Integration map, source-of-truth table, endpoints still needed
  CONTENT-CHECKLIST.md     Everything DFS must supply before launch
```

## What is real vs. placeholder

| Real / working | Placeholder — needs DFS / POL263 |
|---|---|
| All pages, brand system, mobile-first layout, SEO metadata, sitemap | Prices, benefit amounts, waiting periods, eligibility, policy terms |
| Guided quote wizard + `/join` application flow (account, family, beneficiary, review) | Live premium numbers + real policy creation (needs `POL263_PUBLIC_REF` + tenant provisioned) |
| Customer portal (`/account`): login, enrollment, dashboard, payments, documents, claims — all via a transparent proxy to POL263 `/api/client-auth/*` | A live `POL263_API_BASE_URL` on the DFS tenant; portal shows "connecting soon" until then |
| PayNow payment panel (create intent → initiate → poll → confirm) | A connected POL263 tenant with PayNow configured |
| Lead capture + at-need funeral request (fallback = server log) | Org-scoped public lead / funeral-request endpoints in POL263 |
| Service catalogue, curated bundles, contextual upsell logic | Real service imagery, lead times, supplier info; the `add_ons` schema extension |
| FAQ / resource structure | FAQ answers on policy rules, full article bodies |
| Legal page structure + required-sections outlines | All binding legal wording (DFS legal review) |
| Testimonials structure | Real, signed-off testimonials (none are invented) |
| Analytics event vocabulary | A concrete analytics provider + consent banner |

Anything a developer must not guess is marked `CONFIGURE` / `CONTENT REQUIRED FROM
DFS` in code and rendered with a dashed underline on the site.

## Deployment

Deploys as a Node service (e.g. DigitalOcean App Platform, same as POL263):
`npm run build` → `npm run start` (port 3000, override with `PORT`). Set the
`POL263_*` and `NEXT_PUBLIC_*` env vars in the platform. Point the DFS domain here;
the POL263 `/client` portal continues to serve the authenticated customer area on
the same domain (reverse-proxy `/client`, `/api/client-auth`, etc. to POL263) or a
subdomain — see `docs/POL263-INTEGRATION.md`.
