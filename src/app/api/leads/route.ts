import { NextResponse } from "next/server";
import { createLead } from "@/lib/pol263";
import { leadSchema, parseBody } from "@/lib/api-schemas";
import { LIMITS, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const limited = rateLimit(req, LIMITS.submit);
  if (limited) return limited;

  const body = await parseBody(req, leadSchema);
  if (!body.ok) return body.response;

  const result = await createLead({ ...body.data, lastName: body.data.lastName || "(not given)" });

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
