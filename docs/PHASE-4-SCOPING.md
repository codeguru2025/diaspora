# Phase 4 scoping

`DFS-SYSTEM-AUDIT.md` §7 lists four Phase 4 items with no further detail. This
breaks each one down into what's actually there today, what's genuinely
missing, and — for the two that reach outside this repo — what decision has to
happen before code gets written. Phases 1–3 shipped against a detailed brief
("MEGA PROMPT", referenced throughout code comments); no equivalent brief
exists for Phase 4, so nothing here should be read as DFS-confirmed scope,
only as a proposal.

## 1. Concierge tiers — mostly done, one piece deferred

Already built: every package (`src/config/packages.ts` → `concierge`) carries
a support-level description, shown as a badge on package detail pages and
explained across all four tiers in `ConciergeSection` (home + `/packages`).
Requesting a human is already live via "Speak to a Funeral Care Consultant"
(contact CTA) and "Request a Callback" (footer, `/contact`).

Not built, and deliberately not started here: actually **assigning** a named
consultant to a Prestige/Bespoke customer and surfacing them in the customer
portal. That needs consultant/staff-assignment data that doesn't exist in
POL263 yet — building portal UI for it now would mean inventing a data model
no one asked for. Revisit once POL263 has a concept of staff-to-policy
assignment.

## 2. Digital-memorial area — the real gap, now scaffolded

The marketing description already existed (`online-tribute` service,
`/digital-services`), but the actual product — a shareable tribute page with a
multi-writer guestbook — did not. Built in this pass:

- `/tribute` — explainer + a "Request a tribute page" lead form
  (`source: "tribute_request"`, wired through the existing `/api/leads` path)
- `/tribute/[slug]` — the tribute page template (photo, summary, service
  details, tribute wall), resolving one clearly-labelled fictional sample
  (`src/config/tribute-sample.ts`) so the format can be reviewed without
  inventing a real memorial
- `docs/POL263-TRIBUTE-SCHEMA.md` — the `tributes` + `tribute_messages` schema,
  migration SQL and public endpoints needed to make it real, following the
  same additive pattern as `POL263-ADDON-SCHEMA.md`

The guestbook is the one piece that cannot be faked with local/URL-encoded
state (every visitor needs to see the same, growing list) — it is blocked on
that schema landing in POL263, exactly like pricing is blocked on the pricing
engine.

## 3. Supplier / fulfilment management — belongs in POL263, not this site

This site sells services; it doesn't run the suppliers who fulfil them. That
management surface — assigning a florist, caterer, transport provider, etc. to
an order, tracking fulfilment status — is an operational/admin tool, which is
what POL263 is for (per `DFS-SYSTEM-AUDIT.md` §4: "what must NOT be rebuilt").

`POL263-ADDON-SCHEMA.md` already stubs the join point (`add_ons.supplierId` →
"a suppliers table, when one exists"). The remaining work — a `suppliers`
table and the admin CRUD/assignment UI — is a POL263 feature. Nothing to build
here until that exists; there's no customer-facing surface for it on this
site beyond what's already shown (lead time, "supplier-dependent" pricing
note).

## 4. Multi-country config — needs a product decision first

The site is Zimbabwe-specific by design: `src/config/content.ts` →
`diasporaCountries` lists *where the diaspora lives*, but the funeral itself,
currency, packages and eligibility rules all assume Zimbabwe. Generalising
that touches pricing/currency formatting, package eligibility, legal/regulatory
copy per country, and POL263's own multi-country support (unknown from this
repo) — none of which should be guessed at.

**Before any code:** which second country, and does POL263 already support
multi-country organisations, or does that need building there too? Once
answered, the shape is: promote the implicit "Zimbabwe" assumption in
`site.ts`/`packages.ts`/`lib/format.ts` to an explicit, configurable
`country` — not a rewrite, since the config-driven structure already
separates content from components.
