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
/** Writes can fail; the caller decides how to surface that to the user. */
export type Result<T> =
  | { ok: true; data: T; source: "pol263" | "fallback" }
  | { ok: false; error: string; source: "fallback"; data: null };

async function call<T>(
  path: string,
  init?: RequestInit & { timeoutMs?: number },
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
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
    if (!res.ok) return { ok: false, error: `POL263 ${res.status}` };
    return { ok: true, data: (await res.json()) as T };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "network error" };
  } finally {
    clearTimeout(timeout);
  }
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
    products: { id: string; code: string; name: string; versions: { premiumMonthlyUsd?: string | null }[] }[];
  }>(`/api/public/registration-options?ref=${encodeURIComponent(REF)}`);
  if (!r.ok) return { data: fallback, source: "fallback" };

  const byCode = new Map(r.data.products.map((p) => [p.code, p]));
  const resolved = localPackages.map<ResolvedPackage>((p) => {
    const match = p.pol263ProductCode ? byCode.get(p.pol263ProductCode) : undefined;
    const monthly = match?.versions?.[0]?.premiumMonthlyUsd;
    return {
      ...p,
      price: monthly ? { amount: String(monthly), currency: "USD", schedule: "monthly" } : null,
    };
  });
  return { data: resolved, source: "pol263" };
}

/* ------------------------------------------------------------------ *
 * Service catalogue ← POL263 add_ons / price_book (extended model)   *
 * ------------------------------------------------------------------ */

export async function getServiceCatalogue() {
  // NOT-YET-AVAILABLE: the POL263 `add_ons` model needs the additive fields
  // described in docs/POL263-INTEGRATION.md (category, image, lead time, supplier,
  // upsell copy, bundle membership, richer pricing modes) before this can be
  // sourced remotely. Until then the local catalogue is authoritative for
  // presentation and POL263 holds only the priced line items.
  return { ok: true as const, data: localServices, source: "fallback" as const };
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
};

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
    | "diaspora";
  productInterest?: string;
  countryOfResidence?: string;
  message?: string;
  /** Free-form structured payload preserved for the DFS team. */
  context?: Record<string, unknown>;
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
        }),
      },
    );
    if (r.ok) return { ok: true, source: "pol263", data: { leadId: r.data.leadId } };
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
};

export async function getRegistrationOptions(): Promise<Resolved<RegistrationOptions>> {
  const fallback: RegistrationOptions = {
    configured: false,
    products: [],
    branches: [],
    nationalIdFormat: null,
  };
  if (!REF) return { data: fallback, source: "fallback" };
  const r = await call<{
    products: RegistrationOptions["products"];
    branches: RegistrationOptions["branches"];
    nationalIdFormat?: string;
  }>(`/api/public/registration-options?ref=${encodeURIComponent(REF)}`);
  if (!r.ok) return { data: fallback, source: "fallback" };
  return {
    source: "pol263",
    data: {
      configured: true,
      products: r.data.products ?? [],
      branches: r.data.branches ?? [],
      nationalIdFormat: r.data.nationalIdFormat ?? null,
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
  productVersionId?: string;
  currency?: string;
  paymentSchedule?: string;
  packageSlug?: string;
  countryOfResidence?: string;
  dependents?: { firstName: string; lastName: string; relationship: string; dateOfBirth?: string }[];
  beneficiary?: { firstName: string; lastName: string; relationship: string; nationalId?: string };
  serviceProvince?: string;
  selectedServices?: string[];
  consentedAt?: string;
};

export type RegisterPolicyResult = {
  status: "registered" | "captured";
  policyNumber: string | null;
  activationCode: string | null;
  message: string;
};

export async function registerPolicy(
  input: RegisterPolicyInput,
): Promise<Result<RegisterPolicyResult>> {
  // POL263's POST /api/public/register-policy is ref-scoped today. When a real
  // productVersionId and REF are available we submit the real application; the
  // add-on services / diaspora context ride along as a lead so nothing is lost.
  if (REF && input.productVersionId) {
    const r = await call<{ policyNumber: string; activationCode: string }>(
      `/api/public/register-policy`,
      {
        method: "POST",
        body: JSON.stringify({
          ref: REF,
          org: ORG_ID,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
          dateOfBirth: input.dateOfBirth,
          nationalId: input.nationalId,
          productVersionId: input.productVersionId,
          currency: input.currency ?? "USD",
          paymentSchedule: input.paymentSchedule ?? "monthly",
          dependents: input.dependents ?? [],
          beneficiary: input.beneficiary,
          consentedAt: input.consentedAt ?? new Date().toISOString(),
        }),
      },
    );
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
  return {
    ok: true,
    source: lead.source,
    data: {
      status: "captured",
      policyNumber: null,
      activationCode: null,
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
  isExistingPolicyholder?: "yes" | "no" | "unsure";
  policyNumber?: string;
  serviceProvince?: string;
  serviceTownOrArea?: string;
  neededBy?: string;
  callerLocation?: string;
  notes?: string;
};

export async function createFuneralRequest(
  input: FuneralRequestInput,
): Promise<Result<{ reference: string | null }>> {
  // NOT-YET-AVAILABLE: POST /api/public/funeral-request { orgId, ... } which
  // should create a high-priority lead (and optionally a draft funeral_case) and
  // trigger an internal SMS/notification to the DFS at-need team. Until then this
  // routes through createLead with source=arrange_a_funeral and priority context.
  const lead = await createLead({
    firstName: input.contactName.split(" ")[0] || input.contactName,
    lastName: input.contactName.split(" ").slice(1).join(" ") || "(not given)",
    phone: input.contactPhone,
    email: input.contactEmail,
    source: "arrange_a_funeral",
    message: input.notes,
    context: { priority: "urgent", ...input },
  });
  return { ok: true, source: lead.source, data: { reference: lead.data?.leadId ?? null } };
}
