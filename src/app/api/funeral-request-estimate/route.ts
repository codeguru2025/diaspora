import { NextResponse } from "next/server";
import { getFuneralRequestEstimate } from "@/lib/pol263";
import { estimateSchema, parseBody } from "@/lib/api-schemas";
import { LIMITS, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const limited = rateLimit(req, LIMITS.estimate);
  if (limited) return limited;

  const body = await parseBody(req, estimateSchema);
  if (!body.ok) return body.response;

  const res = await getFuneralRequestEstimate(body.data.addOnIds);
  return NextResponse.json(res.data);
}
