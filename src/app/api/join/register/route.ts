import { NextResponse } from "next/server";
import { registerPolicy } from "@/lib/pol263";
import { parseBody, registerSchema } from "@/lib/api-schemas";
import { LIMITS, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const limited = rateLimit(req, LIMITS.submit);
  if (limited) return limited;

  const body = await parseBody(req, registerSchema);
  if (!body.ok) return body.response;

  const result = await registerPolicy({ ...body.data, consentedAt: new Date().toISOString() });

  // A real rejection from POL263 (e.g. failed bot verification) is genuine
  // feedback for the visitor — surface it instead of a fabricated confirmation.
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result.data);
}
