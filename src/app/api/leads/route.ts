import { NextResponse } from "next/server";
import { buildLeadQuote, createLead, type ServiceChoice } from "@/lib/pol263";
import { leadSchema, parseBody } from "@/lib/api-schemas";
import { LIMITS, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const limited = rateLimit(req, LIMITS.submit);
  if (limited) return limited;

  const body = await parseBody(req, leadSchema);
  if (!body.ok) return body.response;
  const lastName = body.data.lastName || "(not given)";

  // "Get a quote": price it in POL263 from what the visitor entered (never a figure from the
  // browser) and send it with the lead, so POL263 saves the quote and emails them the PDF.
  let quote;
  if (body.data.source === "get_a_quote") {
    const c = (body.data.context ?? {}) as Record<string, unknown>;
    quote = await buildLeadQuote({
      firstName: body.data.firstName,
      lastName: body.data.lastName ?? "",
      packageSlug: typeof c.package === "string" ? c.package : null,
      policyholderDateOfBirth: typeof c.policyholderDateOfBirth === "string" ? c.policyholderDateOfBirth : null,
      family: Array.isArray(c.family) ? (c.family as { relationship?: string; dateOfBirth?: string }[]) : [],
      serviceSlugs: Array.isArray(c.services) ? (c.services as unknown[]).filter((s): s is string => typeof s === "string") : [],
      serviceChoices: Array.isArray(c.serviceChoices) ? (c.serviceChoices as ServiceChoice[]) : [],
    }).catch(() => undefined);
  }

  const result = await createLead({ ...body.data, lastName, quote });

  // A real rejection from POL263 (e.g. failed bot verification) is genuine
  // feedback for the visitor — surface it instead of the usual "always succeeds"
  // fallback response.
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Never leak backend detail to the client — the fallback path still "succeeds"
  // from the user's perspective (their enquiry is captured for the DFS team).
  return NextResponse.json({ ok: true, reference: result.data?.leadId ?? null });
}
