import { NextResponse } from "next/server";
import { getQuote, resolveProductVersionId, type QuoteRequest } from "@/lib/pol263";

export async function POST(req: Request) {
  let body: QuoteRequest & { packageSlug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const productVersionId =
    body.productVersionId ?? (body.packageSlug ? await resolveProductVersionId(body.packageSlug) : undefined);

  const res = await getQuote({
    productVersionId,
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
