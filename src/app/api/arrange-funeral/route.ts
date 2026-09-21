import { NextResponse } from "next/server";
import { createFuneralRequest, type FuneralRequestInput } from "@/lib/pol263";

export async function POST(req: Request) {
  let body: Partial<FuneralRequestInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const contactName = String(body.contactName || "").trim();
  const contactPhone = String(body.contactPhone || "").trim();
  if (!contactName || !contactPhone) {
    return NextResponse.json(
      { error: "We need a name and phone number so we can call you back." },
      { status: 400 },
    );
  }

  const result = await createFuneralRequest({
    contactName,
    contactPhone,
    contactEmail: body.contactEmail ? String(body.contactEmail).trim() : undefined,
    relationshipToDeceased: body.relationshipToDeceased ? String(body.relationshipToDeceased) : undefined,
    deceasedName: body.deceasedName ? String(body.deceasedName) : undefined,
    deceasedAge: typeof body.deceasedAge === "number" ? body.deceasedAge : undefined,
    deceasedSex: body.deceasedSex ? String(body.deceasedSex) : undefined,
    isExistingPolicyholder: body.isExistingPolicyholder,
    policyNumber: body.policyNumber ? String(body.policyNumber) : undefined,
    serviceProvince: body.serviceProvince ? String(body.serviceProvince) : undefined,
    serviceTownOrArea: body.serviceTownOrArea ? String(body.serviceTownOrArea) : undefined,
    neededBy: body.neededBy ? String(body.neededBy) : undefined,
    callerLocation: body.callerLocation ? String(body.callerLocation) : undefined,
    notes: body.notes ? String(body.notes) : undefined,
    requestedAddOnIds: Array.isArray(body.requestedAddOnIds) ? body.requestedAddOnIds : undefined,
    turnstileToken: body.turnstileToken ? String(body.turnstileToken) : undefined,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true, reference: result.data.reference, quotation: result.data.quotation });
}
