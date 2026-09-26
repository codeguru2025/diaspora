import { z } from "zod";
import type { LeadInput } from "@/lib/pol263";

/**
 * Request-body schemas for the public API routes. Everything a visitor sends is
 * trimmed, length-capped and type-checked here before it is passed to POL263.
 */

/** Optional text: empty strings and nulls count as "not given". */
const optText = (max: number) =>
  z.preprocess(
    (v) => (v === "" || v === null ? undefined : v),
    z.string().trim().max(max).optional(),
  );

const requiredText = (max: number, message: string) =>
  z.string({ error: message }).trim().min(1, message).max(max);

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Dates must be YYYY-MM-DD.");
const optIsoDate = z.preprocess((v) => (v === "" || v === null ? undefined : v), isoDate.optional());

const id = z.string().trim().min(1).max(100);
const idList = z.array(id).max(60);
const currency = z.string().regex(/^[A-Z]{3}$/, "Unknown currency.");
const paymentSchedule = z.string().regex(/^[a-z_]{1,20}$/, "Unknown payment schedule.");
const turnstileToken = optText(4096);

/** Free-form context for the DFS team: small, flat-ish JSON only. */
const context = z
  .record(z.string().max(60), z.unknown())
  .refine((c) => JSON.stringify(c).length <= 5000, "Too much detail in one request.");

const LEAD_SOURCES = [
  "protect_my_family",
  "get_a_quote",
  "arrange_a_funeral",
  "speak_to_us",
  "bespoke_request",
  "callback",
  "diaspora",
  "tribute_request",
] as const satisfies readonly LeadInput["source"][];

export const leadSchema = z.object({
  firstName: requiredText(100, "Name and phone are required"),
  lastName: optText(100),
  phone: requiredText(40, "Name and phone are required"),
  email: optText(200),
  // Unknown sources are filed as a general enquiry rather than rejected.
  source: z.enum(LEAD_SOURCES).catch("speak_to_us"),
  productInterest: optText(100),
  countryOfResidence: optText(60),
  message: optText(5000),
  context: context.optional(),
  turnstileToken,
});

export const quoteSchema = z.object({
  packageSlug: optText(60),
  productVersionId: id.optional(),
  policyholderDateOfBirth: optIsoDate,
  memberCount: z.number().int().min(1).max(30).optional(),
  dependentDateOfBirths: z.array(isoDate.nullable()).max(30).optional(),
  addOnIds: idList.optional(),
  currency: currency.optional(),
  paymentSchedule: paymentSchedule.optional(),
});

const text = (max: number) => z.preprocess((v) => v ?? "", z.string().trim().max(max));

/** The join flow allows half-filled family rows; rows without a first name are dropped. */
const dependents = z
  .array(
    z.object({
      firstName: text(100),
      lastName: text(100),
      relationship: text(60),
      dateOfBirth: optIsoDate,
    }),
  )
  .max(20)
  .transform((rows) => rows.filter((d) => d.firstName));

const beneficiary = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  relationship: z.string().trim().min(1).max(60),
  nationalId: z.string().trim().min(1).max(40),
  phone: z.string().trim().min(1).max(40),
});

export const registerSchema = z.object({
  firstName: requiredText(100, "Your name and phone number are required."),
  lastName: requiredText(100, "Your name and phone number are required."),
  phone: requiredText(40, "Your name and phone number are required."),
  email: optText(200),
  dateOfBirth: optIsoDate,
  nationalId: optText(40),
  gender: optText(10),
  productVersionId: id.optional(),
  currency: currency.optional(),
  paymentSchedule: paymentSchedule.optional(),
  packageSlug: optText(60),
  countryOfResidence: optText(60),
  dependents: dependents.optional(),
  // POL263 drops an incomplete beneficiary silently, so only a complete one is accepted.
  beneficiary: beneficiary.optional(),
  serviceProvince: optText(60),
  selectedServices: z.array(z.string().max(100)).max(60).optional(),
  turnstileToken,
});

export const funeralRequestSchema = z.object({
  contactName: requiredText(200, "We need a name and phone number so we can call you back."),
  contactPhone: requiredText(40, "We need a name and phone number so we can call you back."),
  contactEmail: optText(200),
  relationshipToDeceased: optText(100),
  deceasedName: optText(200),
  // The short form posts form values as strings; the cash-quote form sends a number.
  deceasedAge: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z.number().int().min(0).max(130).optional(),
  ),
  deceasedSex: optText(20),
  isExistingPolicyholder: z.enum(["yes", "no", "unsure"]).optional().catch(undefined),
  policyNumber: optText(60),
  serviceProvince: optText(60),
  serviceTownOrArea: optText(100),
  neededBy: optText(100),
  callerLocation: optText(100),
  notes: optText(5000),
  requestedAddOnIds: idList.optional(),
  turnstileToken,
});

export const estimateSchema = z.object({
  addOnIds: idList.catch([]),
});

export const paymentMethodSchema = z.object({
  method: z.enum(["ecocash", "onemoney", "innbucks", "omari", "visa_mastercard"], {
    error: "Choose a payment method.",
  }),
});

export const otpSchema = z.object({
  otp: requiredText(12, "Enter the code you received."),
});

/** Payment-link tokens are opaque, URL-safe strings issued by POL263. */
export const paymentTokenSchema = z.string().regex(/^[A-Za-z0-9_-]{1,200}$/);

/**
 * Reads and validates a JSON body. On failure returns a 400 response carrying
 * the first problem as `{ error }`, the shape every form already displays.
 */
export async function parseBody<S extends z.ZodType>(
  req: Request,
  schema: S,
): Promise<{ ok: true; data: z.output<S> } | { ok: false; response: Response }> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return { ok: false, response: Response.json({ error: "Invalid request" }, { status: 400 }) };
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid request";
    return { ok: false, response: Response.json({ error: message }, { status: 400 }) };
  }
  return { ok: true, data: parsed.data };
}
