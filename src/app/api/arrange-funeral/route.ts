import { NextResponse } from "next/server";
import { createFuneralRequest } from "@/lib/pol263";
import { funeralRequestSchema, parseBody } from "@/lib/api-schemas";
import { LIMITS, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const limited = rateLimit(req, LIMITS.submit);
  if (limited) return limited;

  const body = await parseBody(req, funeralRequestSchema);
  if (!body.ok) return body.response;

  const result = await createFuneralRequest(body.data);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true, reference: result.data.reference, quotation: result.data.quotation });
}
