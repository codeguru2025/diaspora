import { NextResponse } from "next/server";
import { getQuote, type QuoteRequest } from "@/lib/pol263";

export async function POST(req: Request) {
  let body: QuoteRequest & { packageSlug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const res = await getQuote({
    productVersionId: body.productVersionId,
    policyholderDateOfBirth: body.policyholderDateOfBirth,
    memberCount: typeof body.memberCount === "number" ? body.memberCount : undefined,
    dependentDateOfBirths: Array.isArray(body.dependentDateOfBirths)
      ? body.dependentDateOfBirths
      : undefined,
    addOnIds: Array.isArray(body.addOnIds) ? body.addOnIds : undefined,
    currency: body.currency,
    paymentSchedule: body.paymentSchedule,
  });

  return NextResponse.json({ ...res.data, source: res.source });
}
