import { NextResponse } from "next/server";
import { registerPolicy, type RegisterPolicyInput } from "@/lib/pol263";

export async function POST(req: Request) {
  let body: Partial<RegisterPolicyInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const firstName = String(body.firstName || "").trim();
  const lastName = String(body.lastName || "").trim();
  const phone = String(body.phone || "").trim();
  if (!firstName || !lastName || !phone) {
    return NextResponse.json(
      { error: "Your name and phone number are required." },
      { status: 400 },
    );
  }

  const result = await registerPolicy({
    firstName,
    lastName,
    phone,
    email: body.email ? String(body.email).trim() : undefined,
    dateOfBirth: body.dateOfBirth ? String(body.dateOfBirth) : undefined,
    nationalId: body.nationalId ? String(body.nationalId).trim() : undefined,
    productVersionId: body.productVersionId ? String(body.productVersionId) : undefined,
    currency: body.currency ? String(body.currency) : undefined,
    paymentSchedule: body.paymentSchedule ? String(body.paymentSchedule) : undefined,
    packageSlug: body.packageSlug ? String(body.packageSlug) : undefined,
    countryOfResidence: body.countryOfResidence ? String(body.countryOfResidence) : undefined,
    dependents: Array.isArray(body.dependents) ? body.dependents : undefined,
    beneficiary: body.beneficiary,
    serviceProvince: body.serviceProvince ? String(body.serviceProvince) : undefined,
    selectedServices: Array.isArray(body.selectedServices) ? body.selectedServices : undefined,
    consentedAt: new Date().toISOString(),
  });

  return NextResponse.json(result.data);
}
