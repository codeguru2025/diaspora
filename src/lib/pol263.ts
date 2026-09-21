/**
 * POL263 integration layer (MEGA PROMPT §16, §57).
 *
 * POL263 is the administrative + communications backbone and the SOURCE OF TRUTH
 * for customers, policies, beneficiaries, premiums, payments and SMS. This site
 * NEVER stores those records itself — it calls POL263.
 *
 * Design rules honoured here:
 *  - Clean, typed service interface so real endpoints can be swapped in without
 *    touching any page/component.
 *  - Graceful degradation: if POL263 is not configured or is unreachable, reads
 *    fall back to local placeholder config and writes are captured as leads to be
 *    retried / picked up manually. The UI never shows a raw backend error.
 *  - All calls are server-side only. No POL263 credentials reach the browser.
 *
 * Expected environment (see .env.example):
 *   POL263_API_BASE_URL   e.g. https://dfs.pol263.app  (the DFS tenant host)
 *   POL263_ORG_ID         the DFS organization_id in POL263
 *   POL263_PUBLIC_REF     optional agent/campaign referral code for attribution
 *   POL263_API_TOKEN      optional server-to-server token, if provisioned
 *
 * Endpoints referenced below already exist in POL263 (server/routes.ts):
 *   GET  /api/public/branding?orgId=...
 *   POST /api/public/quote
 *   GET  /api/public/registration-options?ref=...
 *   POST /api/public/register-policy
 * Endpoints marked NOT-YET-AVAILABLE need an additive, org-scoped public route in
 * POL263 (see docs/POL263-INTEGRATION.md). Until they exist the fallback is used.
 */

import "server-only";

import { packages as localPackages, type PackageTier } from "@/config/packages";
import { services as localServices } from "@/config/services";
import { site } from "@/config/site";

const BASE = process.env.POL263_API_BASE_URL?.replace(/\/$/, "") || "";
const ORG_ID = process.env.POL263_ORG_ID || "";
const REF = process.env.POL263_PUBLIC_REF || "";
const TOKEN = process.env.POL263_API_TOKEN || "";

export const pol263Configured = Boolean(BASE && ORG_ID);

/** Reads always resolve to data (POL263 or local fallback) — never an error state. */
export type Resolved<T> = { data: T; source: "pol263" | "fallback" };
/**
 * Writes can fail; the caller decides how to surface that to the user.
 * `source: "pol263"` on the failure branch means POL263 actively rejected the
 * request (e.g. a failed Turnstile check) — that's real, user-facing feedback,
 * not an outage, so callers should NOT fall back to the lead-capture safety net
 * for it. `source: "fallback"` means POL263 was unreachable/misconfigured and
 * the write was captured locally instead.
 */
export type Result<T> =
  | { ok: true; data: T; source: "pol263" | "fallback" }
  | { ok: false; error: string; source: "fallback" | "pol263"; data: null };

async function call<T>(
  path: string,
  init?: RequestInit & { timeoutMs?: number },
): Promise<{ ok: true; data: T } | { ok: false; error: string; status?: number; body?: unknown }> {
  if (!BASE) return { ok: false, error: "POL263 not configured" };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), init?.timeoutMs ?? 8000);
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        ...(TOKEN ? { authorization: `Bearer ${TOKEN}` } : {}),
        ...(init?.headers || {}),
      },
      cache: init?.method && init.method !== "GET" ? "no-store" : (init?.cache ?? "no-store"),
    });
    if (!res.ok) {
      let body: unknown;
      try {
        body = await res.json();
      } catch {
        // Non-JSON error body — leave body undefined, status still tells the caller enough.
      }
      return { ok: false, error: `POL263 ${res.status}`, status: res.status, body };
    }
    return { ok: true, data: (await res.json()) as T };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "network error" };
  } finally {
    clearTimeout(timeout);
  }
}

/** Pulls a human-readable `message` off a failed call's JSON error body, if present. */
function messageFrom(body: unknown, fallback: string): string {
  if (body && typeof body === "object" && "message" in body && typeof body.message === "string") {
    return body.message;
  }
  return fallback;
}

/* ------------------------------------------------------------------ *
 * Branding (org identity, enabled currencies, timezone)              *
 * ------------------------------------------------------------------ */

export type Branding = {
  name: string;
  logoUrl: string | null;
  primaryColor: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  enabledCurrencies: string[];
  timezone: string;
};

export async function getBranding(): Promise<Resolved<Branding>> {
  const fallback: Branding = {
    name: site.name,
    logoUrl: null,
    primaryColor: "#c6a568",
    phone: site.contact.phoneDisplay,
    email: site.contact.email,
    website: site.url,
    enabledCurrencies: ["USD"],
    timezone: "Africa/Harare",
  };
  const r = await call<Partial<Branding>>(`/api/public/branding?orgId=${encodeURIComponent(ORG_ID)}`);
  if (!r.ok) return { data: fallback, source: "fallback" };
  return {
    source: "pol263",
    data: { ...fallback, ...r.data, enabledCurrencies: r.data.enabledCurrencies ?? fallback.enabledCurrencies },
  };
}

/* ------------------------------------------------------------------ *
 * Packages ← POL263 products / product_versions                      *
 * ------------------------------------------------------------------ */

export type ResolvedPackage = PackageTier & {
  /** Populated only when POL263 returns a matching product version. */
  price: { amount: string; currency: string; schedule: string } | null;
};

export async function getPackages(): Promise<Resolved<ResolvedPackage[]>> {
  const fallback: ResolvedPackage[] = localPackages.map((p) => ({ ...p, price: null }));

  // NOT-YET-AVAILABLE: an org-scoped public products endpoint. `registration-options`
  // is ref-scoped; a `/api/public/products?orgId=` route is the clean addition.
  if (!REF) return { data: fallback, source: "fallback" };

  const r = await call<{
    products: { id: string; code: string; name: string; versions: { id: string; premiumMonthlyUsd?: string | null }[] }[];
  }>(`/api/public/registration-options?ref=${encodeURIComponent(REF)}`);
  if (!r.ok) return { data: fallback, source: "fallback" };

  const byCode = new Map(r.data.products.map((p) => [p.code, p]));
  const resolved = await Promise.all(
    localPackages.map<Promise<ResolvedPackage>>(async (p) => {
      const match = p.pol263ProductCode ? byCode.get(p.pol263ProductCode) : undefined;
      const productVersionId = match?.versions?.[0]?.id;
      // The flat premiumMonthlyUsd field is unused for individual_age_rated products (the DFS
      // model) — real pricing lives in age_band_rate_cards and only the quote engine can compute
      // it. No policyholderDateOfBirth is passed here on purpose: the engine treats an unknown age
      // as the standard adult (21-65) band, giving the representative "from" figure for the card —
      // never a fabricated number, always whatever POL263 actually has configured right now.
      if (!productVersionId) return { ...p, price: null };
      const quote = await getQuote({ productVersionId, memberCount: 1 });
      if (!quote.data.premium) return { ...p, price: null };
      return {
        ...p,
        price: { amount: quote.data.premium, currency: quote.data.currency, schedule: quote.data.paymentSchedule },
      };
    }),
  );
  return { data: resolved, source: "pol263" };
}

/* ------------------------------------------------------------------ *
 * Service catalogue ← POL263 add_ons / price_book (extended model)   *
 * ------------------------------------------------------------------ */

export type ResolvedService = (typeof localServices)[number] & {
  /** Join key to POL263 `add_ons.id` — null until matched by exact name. */
  pol263AddOnId: string | null;
  /** Real cash value from POL263, or null when not priced yet ("price TBC"). */
  cashValue: string | null;
};

export async function getServiceCatalogue(): Promise<Resolved<ResolvedService[]>> {
  const fallback: ResolvedService[] = localServices.map((s) => ({ ...s, pol263AddOnId: null, cashValue: null }));
  if (!REF) return { data: fallback, source: "fallback" };

  // The local catalogue stays authoritative for presentation (category copy, includes,
  // related services, bundles, images) — none of that lives in POL263. This only joins
  // in the two things POL263 actually owns: the real add-on id (needed for
  // requestedAddOnIds on the quote/register/funeral-request endpoints) and its cash
  // value, matched by exact name against `script/seed-diaspora-catalogue.ts`'s seed.
  const opts = await getRegistrationOptions();
  if (opts.data.addOns.length === 0) return { data: fallback, source: opts.source };

  const byName = new Map(opts.data.addOns.map((a) => [a.name, a]));
  const resolved = localServices.map<ResolvedService>((s) => {
    const match = byName.get(s.name);
    const cashValue = match?.cashValue && Number(match.cashValue) > 0 ? match.cashValue : null;
    return { ...s, pol263AddOnId: match?.id ?? null, cashValue };
  });
  return { data: resolved, source: "pol263" };
}

/* ------------------------------------------------------------------ *
 * Quote ← POST /api/public/quote (real premium engine)               *
 * ------------------------------------------------------------------ */

export type QuoteRequest = {
  productVersionId?: string;
  policyholderDateOfBirth?: string;
  memberCount?: number;
  dependentDateOfBirths?: (string | null)[];
  addOnIds?: string[];
  currency?: string;
  paymentSchedule?: string;
};

export type QuoteResponse = {
  premium: string | null;
  currency: string;
  paymentSchedule: string;
  estimate: boolean;
  note?: string;
  productVersionId?: string;
};

/**
 * Join key: DFS package slug → POL263 `products.code` (`pol263ProductCode` in
 * `src/config/packages.ts`) → the product's current `product_versions.id`, via the
 * same `registration-options` call `getPackages()` uses. The quote engine and
 * `register-policy` both need this real id — a package slug alone means nothing
 * to POL263.
 */
export async function resolveProductVersionId(packageSlug: string): Promise<string | undefined> {
  const pkg = localPackages.find((p) => p.slug === packageSlug);
  if (!pkg?.pol263ProductCode) return undefined;
  const opts = await getRegistrationOptions();
  const product = opts.data.products.find((p) => p.code === pkg.pol263ProductCode);
  return product?.versions?.[0]?.id;
}

export async function getQuote(req: QuoteRequest): Promise<Resolved<QuoteResponse>> {
  const fallback: QuoteResponse = {
    premium: null,
    currency: req.currency ?? "USD",
    paymentSchedule: req.paymentSchedule ?? "monthly",
    estimate: true,
    note: "A Funeral Care Consultant will confirm your exact premium.",
  };
  if (!REF) return { data: fallback, source: "fallback" };

  const r = await call<{ premium: string; currency: string; paymentSchedule: string }>(
    `/api/public/quote`,
    { method: "POST", body: JSON.stringify({ refCode: REF, org: ORG_ID, ...req }) },
  );
  if (!r.ok) return { data: fallback, source: "fallback" };
  return {
    source: "pol263",
    data: {
      premium: r.data.premium,
      currency: r.data.currency,
      paymentSchedule: r.data.paymentSchedule,
      estimate: true,
      productVersionId: req.productVersionId,
      note: "Indicative premium from the DFS pricing engine. Confirmed at application.",
    },
  };
}

/* ------------------------------------------------------------------ *
 * Leads — the safety net for every write we can't complete online    *
 * ------------------------------------------------------------------ */

export type LeadInput = {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  source:
    | "protect_my_family"
    | "get_a_quote"
    | "arrange_a_funeral"
    | "speak_to_us"
    | "bespoke_request"
    | "callback"
    | "diaspora"
    | "tribute_request";
  productInterest?: string;
  countryOfResidence?: string;
  message?: string;
  /** Free-form structured payload preserved for the DFS team. */
  context?: Record<string, unknown>;
  /** Cloudflare Turnstile response token — required on real write actions only. */
  turnstileToken?: string;
};

export async function createLead(input: LeadInput): Promise<Result<{ leadId: string | null }>> {
  // NOT-YET-AVAILABLE: an org-scoped, ref-optional public lead endpoint. The
  // existing lead capture (`/api/public/agent-vcard/:refCode/quote-lead`) requires
  // an agent ref. Proposed: POST /api/public/leads { orgId, ... }.
  if (REF) {
    const r = await call<{ leadId: string }>(
      `/api/public/agent-vcard/${encodeURIComponent(REF)}/quote-lead`,
      {
        method: "POST",
        body: JSON.stringify({
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          email: input.email,
          productInterest: input.productInterest,
          org: ORG_ID,
          turnstileToken: input.turnstileToken,
        }),
      },
    );
    if (r.ok) return { ok: true, source: "pol263", data: { leadId: r.data.leadId } };
    // A 400 here is POL263 actively rejecting the request (e.g. failed bot
    // verification) — that's real feedback for the visitor, not an outage, so
    // it must NOT fall through to the "captured anyway" safety net below.
    if (r.status === 400) {
      return {
        ok: false,
        source: "pol263",
        data: null,
        error: messageFrom(r.body, "We couldn't verify your request. Please try again."),
      };
    }
  }

  // Fallback: persist for the DFS team. In this Phase-1 build that means a
  // structured server log; wire to email/DB when the endpoint lands.
  console.warn("[pol263] lead captured via fallback — no POL263 endpoint reached:", {
    ...input,
    context: input.context,
  });
  return { ok: true, source: "fallback", data: { leadId: null } };
}

/* ------------------------------------------------------------------ *
 * Registration options — products + branches for the join flow       *
 * ------------------------------------------------------------------ */

export type RegistrationOptionsAddOn = {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  pricingMode: string;
  /** Raw cash value from POL263 (`add_ons.coverIncrementAmount`) — null/0 means not priced yet. */
  cashValue?: string | null;
};

export type RegistrationOptions = {
  configured: boolean;
  products: {
    id: string;
    code: string;
    name: string;
    versions: { id: string; version: number; premiumMonthlyUsd?: string | null }[];
  }[];
  branches: { id: string; name: string }[];
  nationalIdFormat: string | null;
  addOns: RegistrationOptionsAddOn[];
};

export async function getRegistrationOptions(): Promise<Resolved<RegistrationOptions>> {
  const fallback: RegistrationOptions = {
    configured: false,
    products: [],
    branches: [],
    nationalIdFormat: null,
    addOns: [],
  };
  if (!REF) return { data: fallback, source: "fallback" };
  const r = await call<{
    products: RegistrationOptions["products"];
    branches: RegistrationOptions["branches"];
    nationalIdFormat?: string;
    addOns?: RegistrationOptionsAddOn[];
  }>(`/api/public/registration-options?ref=${encodeURIComponent(REF)}`);
  if (!r.ok) return { data: fallback, source: "fallback" };
  return {
    source: "pol263",
    data: {
      configured: true,
      products: r.data.products ?? [],
      branches: r.data.branches ?? [],
      nationalIdFormat: r.data.nationalIdFormat ?? null,
      addOns: r.data.addOns ?? [],
    },
  };
}

/* ------------------------------------------------------------------ *
 * Policy registration ← POST /api/public/register-policy             *
 * ------------------------------------------------------------------ */

export type RegisterPolicyInput = {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  dateOfBirth?: string;
  nationalId?: string;
  /** POL263 requires exactly "MALE" or "FEMALE" (server/routes.ts register-policy handler). */
  gender?: string;
  productVersionId?: string;
  currency?: string;
  paymentSchedule?: string;
  packageSlug?: string;
  countryOfResidence?: string;
  dependents?: { firstName: string; lastName: string; relationship: string; dateOfBirth?: string }[];
  /**
   * POL263 requires ALL of firstName/lastName/relationship/nationalId/phone or it silently drops
   * the entire beneficiary with no error — callers should only pass this when genuinely complete.
   */
  beneficiary?: { firstName: string; lastName: string; relationship: string; nationalId: string; phone: string };
  serviceProvince?: string;
  selectedServices?: string[];
  consentedAt?: string;
  /** Cloudflare Turnstile response token — required on real write actions only. */
  turnstileToken?: string;
};

export type RegisterPolicyResult = {
  status: "registered" | "captured";
  policyNumber: string | null;
  activationCode: string | null;
  clientId: string | null;
  /**
   * Present whenever registration comes through an agent referral (ours always does) and the
   * premium is above zero — POL263 issues this automatically alongside the policy. `/pay/[token]`
   * (this site) consumes it directly: no separate email/SMS step is needed to reach payment.
   */
  paymentLink: { token: string; expiresAt: string } | null;
  message: string;
};

export async function registerPolicy(
  input: RegisterPolicyInput,
): Promise<Result<RegisterPolicyResult>> {
  // POL263's POST /api/public/register-policy is ref-scoped today. When a real
  // productVersionId and REF are available we submit the real application; the
  // add-on services / diaspora context ride along as a lead so nothing is lost.
  if (REF && input.productVersionId) {
    const r = await call<{
      policyNumber: string;
      activationCode: string;
      clientId?: string;
      paymentLink?: { token: string; expiresAt: string } | null;
    }>(
      `/api/public/register-policy`,
      {
        method: "POST",
        body: JSON.stringify({
          referralCode: REF,
          org: ORG_ID,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
          dateOfBirth: input.dateOfBirth,
          nationalId: input.nationalId,
          gender: input.gender,
          productVersionId: input.productVersionId,
          currency: input.currency ?? "USD",
          paymentSchedule: input.paymentSchedule ?? "monthly",
          dependents: input.dependents ?? [],
          beneficiary: input.beneficiary,
          consentedAt: input.consentedAt ?? new Date().toISOString(),
          turnstileToken: input.turnstileToken,
        }),
      },
    );
    // A 400 here is POL263 actively rejecting the application (e.g. failed bot
    // verification) — real feedback for the visitor, not an outage, so it must
    // NOT fall through to the "captured as a lead anyway" safety net below.
    if (!r.ok && r.status === 400) {
      return {
        ok: false,
        source: "pol263",
        data: null,
        error: messageFrom(r.body, "We couldn't verify your request. Please try again."),
      };
    }
    if (r.ok) {
      // Best-effort: attach the personalisation context as a lead note.
      await createLead({
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        email: input.email,
        source: "protect_my_family",
        productInterest: input.packageSlug,
        countryOfResidence: input.countryOfResidence,
        context: {
          policyNumber: r.data.policyNumber,
          selectedServices: input.selectedServices,
          serviceProvince: input.serviceProvince,
        },
      }).catch(() => {});
      return {
        ok: true,
        source: "pol263",
        data: {
          status: "registered",
          policyNumber: r.data.policyNumber,
          activationCode: r.data.activationCode,
          clientId: r.data.clientId ?? null,
          paymentLink: r.data.paymentLink ?? null,
          message: "Your application has been created.",
        },
      };
    }
  }

  // Fallback — capture the full application as a lead so a Funeral Care
  // Consultant can complete it. The customer still gets a clean confirmation.
  const lead = await createLead({
    firstName: input.firstName,
    lastName: input.lastName,
    phone: input.phone,
    email: input.email,
    source: "protect_my_family",
    productInterest: input.packageSlug,
    countryOfResidence: input.countryOfResidence,
    turnstileToken: input.turnstileToken,
    context: {
      application: true,
      dateOfBirth: input.dateOfBirth,
      nationalId: input.nationalId ? "provided" : undefined,
      dependents: input.dependents,
      beneficiary: input.beneficiary,
      selectedServices: input.selectedServices,
      serviceProvince: input.serviceProvince,
      paymentSchedule: input.paymentSchedule,
    },
  });
  // Same rule as above: a real rejection from POL263 must reach the visitor,
  // not be reported back as a successful "captured" confirmation.
  if (!lead.ok) return lead;
  return {
    ok: true,
    source: lead.source,
    data: {
      status: "captured",
      policyNumber: null,
      activationCode: null,
      clientId: null,
      paymentLink: null,
      message:
        "We've received your application. A Funeral Care Consultant will confirm the details and your premium, and complete your policy with you.",
    },
  };
}

/* ------------------------------------------------------------------ *
 * At-need funeral request — deliberately minimal, high priority      *
 * ------------------------------------------------------------------ */

export type FuneralRequestInput = {
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  relationshipToDeceased?: string;
  deceasedName?: string;
  deceasedAge?: number;
  deceasedSex?: string;
  isExistingPolicyholder?: "yes" | "no" | "unsure";
  policyNumber?: string;
  serviceProvince?: string;
  serviceTownOrArea?: string;
  neededBy?: string;
  callerLocation?: string;
  notes?: string;
  /** POL263 `add_ons.id`s — the cash-service selection, if any (see getServiceCatalogue). */
  requestedAddOnIds?: string[];
  /** Cloudflare Turnstile response token — required on the real (non-fallback) path. */
  turnstileToken?: string;
};

export type FuneralQuotationItem = { description: string; quantity: string; unitPrice: string; lineTotal: string };
export type FuneralQuotation = {
  id: string;
  quotationNumber: string;
  currency: string;
  total?: string;
  items?: FuneralQuotationItem[];
} | null;

export type FuneralRequestResult = { reference: string; quotation: FuneralQuotation };

export async function createFuneralRequest(input: FuneralRequestInput): Promise<Result<FuneralRequestResult>> {
  const firstName = input.contactName.split(" ")[0] || input.contactName;
  const lastName = input.contactName.split(" ").slice(1).join(" ") || "(not given)";

  if (REF) {
    const r = await call<{ reference: string; leadId: string; quotation: FuneralQuotation }>(
      `/api/public/funeral-request`,
      {
        method: "POST",
        body: JSON.stringify({
          refCode: REF,
          org: ORG_ID,
          firstName,
          lastName,
          phone: input.contactPhone,
          email: input.contactEmail,
          deceasedName: input.deceasedName,
          deceasedAge: input.deceasedAge,
          deceasedSex: input.deceasedSex,
          message:
            [input.relationshipToDeceased && `Relationship: ${input.relationshipToDeceased}`, input.notes]
              .filter(Boolean)
              .join(" — ") || undefined,
          requestedAddOnIds: input.requestedAddOnIds ?? [],
          turnstileToken: input.turnstileToken,
        }),
      },
    );
    // Same rule as every other real write here: a 400 is POL263 actively rejecting the
    // request (failed bot verification) — real feedback for the visitor, not an outage.
    if (!r.ok && r.status === 400) {
      return {
        ok: false,
        source: "pol263",
        data: null,
        error: messageFrom(r.body, "We couldn't verify your request. Please try again."),
      };
    }
    if (r.ok) {
      return { ok: true, source: "pol263", data: { reference: r.data.reference, quotation: r.data.quotation } };
    }
  }

  // Fallback: POL263 unreachable/misconfigured — capture as a lead so a Funeral Care
  // Consultant can follow up; the cash-service selection rides along as context since
  // there's no quotation engine to price it locally.
  const lead = await createLead({
    firstName,
    lastName,
    phone: input.contactPhone,
    email: input.contactEmail,
    source: "arrange_a_funeral",
    message: input.notes,
    context: { priority: "urgent", ...input },
    turnstileToken: input.turnstileToken,
  });
  if (!lead.ok) return lead;
  return { ok: true, source: lead.source, data: { reference: lead.data?.leadId ?? "pending", quotation: null } };
}

/** Live, read-only running total as a visitor ticks/unticks cash services — nothing is
 *  persisted, safe to call on every selection change. Mirrors getQuote()'s role for the
 *  insurance premium estimate. */
export async function getFuneralRequestEstimate(
  addOnIds: string[],
): Promise<Resolved<{ items: { addOnId: string; name: string; unitPrice: string }[]; total: string; currency: string }>> {
  const fallback = { items: [], total: "0.00", currency: "USD" };
  if (!REF || addOnIds.length === 0) return { data: fallback, source: "fallback" };
  const r = await call<{ items: { addOnId: string; name: string; unitPrice: string }[]; total: string; currency: string }>(
    `/api/public/funeral-request-estimate`,
    { method: "POST", body: JSON.stringify({ refCode: REF, org: ORG_ID, requestedAddOnIds: addOnIds }) },
  );
  if (!r.ok) return { data: fallback, source: "fallback" };
  return { data: r.data, source: "pol263" };
}

/** Fetches a previously-submitted cash-service quotation back, e.g. for a shareable
 *  `/quote/cash/[id]` link. */
export async function getFuneralRequestById(id: string): Promise<Resolved<FuneralQuotation>> {
  if (!REF) return { data: null, source: "fallback" };
  const r = await call<NonNullable<FuneralQuotation>>(
    `/api/public/funeral-request/${encodeURIComponent(id)}?ref=${encodeURIComponent(REF)}&org=${encodeURIComponent(ORG_ID)}`,
  );
  if (!r.ok) return { data: null, source: "fallback" };
  return { data: r.data, source: "pol263" };
}

/* ------------------------------------------------------------------ *
 * Public payment link ← POL263-hosted, tokenized, no login required   *
 * The token in the URL path IS the auth — there is no session, no     *
 * cookie, no fallback: this only makes sense when POL263 is reachable *
 * and the link is genuine, so unlike everything else in this file     *
 * there is no local "capture and carry on" safety net for it.         *
 * ------------------------------------------------------------------ */

export type PaymentLinkStatus = "pending" | "paid" | "expired" | "cancelled" | "not_found";

export type PaymentLinkDetails = {
  status: PaymentLinkStatus;
  amount: string;
  currency: string;
  policyNumber?: string | null;
  clientName?: string | null;
};

export type PaymentMethod = "ecocash" | "onemoney" | "innbucks" | "omari" | "visa_mastercard";

export type InitiatePaymentLinkResult = {
  redirectUrl?: string;
  pollUrl?: string;
  innbucksCode?: string;
  innbucksExpiry?: string;
  omariOtpReference?: string;
  needsOtp?: boolean;
};

export type PaymentLinkPollResult = {
  paid: boolean;
  status?: PaymentLinkStatus | "failed" | "cancelled";
  error?: string;
};

function paymentLinkFailure(r: { status?: number; body?: unknown; error: string }): Result<never> {
  if (r.error === "POL263 not configured") {
    return { ok: false, source: "fallback", data: null, error: "Online payment isn't connected yet." };
  }
  if (r.status === 404) {
    return { ok: false, source: "pol263", data: null, error: "This payment link wasn't found." };
  }
  return {
    ok: false,
    source: "pol263",
    data: null,
    error: messageFrom(r.body, "We couldn't reach the payment service. Please try again shortly."),
  };
}

export async function getPaymentLink(token: string): Promise<Result<PaymentLinkDetails>> {
  const r = await call<PaymentLinkDetails>(`/api/pay/${encodeURIComponent(token)}`);
  if (!r.ok) return paymentLinkFailure(r);
  return { ok: true, source: "pol263", data: r.data };
}

export async function initiatePaymentLink(
  token: string,
  method: PaymentMethod,
): Promise<Result<InitiatePaymentLinkResult>> {
  const r = await call<InitiatePaymentLinkResult>(`/api/pay/${encodeURIComponent(token)}/initiate`, {
    method: "POST",
    body: JSON.stringify({ method }),
  });
  if (!r.ok) return paymentLinkFailure(r);
  return { ok: true, source: "pol263", data: r.data };
}

export async function pollPaymentLink(token: string): Promise<Result<PaymentLinkPollResult>> {
  const r = await call<PaymentLinkPollResult>(`/api/pay/${encodeURIComponent(token)}/poll`, {
    method: "POST",
  });
  if (!r.ok) return paymentLinkFailure(r);
  return { ok: true, source: "pol263", data: r.data };
}

export async function submitPaymentLinkOtp(
  token: string,
  otp: string,
): Promise<Result<{ paid: boolean }>> {
  const r = await call<{ paid: boolean }>(`/api/pay/${encodeURIComponent(token)}/otp`, {
    method: "POST",
    body: JSON.stringify({ otp }),
  });
  if (!r.ok) return paymentLinkFailure(r);
  return { ok: true, source: "pol263", data: r.data };
}
