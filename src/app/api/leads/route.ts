import { NextResponse } from "next/server";
import { createLead, type LeadInput } from "@/lib/pol263";

const SOURCES: LeadInput["source"][] = [
  "protect_my_family",
  "get_a_quote",
  "arrange_a_funeral",
  "speak_to_us",
  "bespoke_request",
  "callback",
  "diaspora",
  "tribute_request",
];

export async function POST(req: Request) {
  let body: Partial<LeadInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const firstName = String(body.firstName || "").trim();
  const lastName = String(body.lastName || "").trim();
  const phone = String(body.phone || "").trim();

  if (!firstName || !phone) {
    return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
  }

  const source = SOURCES.includes(body.source as LeadInput["source"])
    ? (body.source as LeadInput["source"])
    : "speak_to_us";

  const result = await createLead({
    firstName,
    lastName: lastName || "(not given)",
    phone,
    email: body.email ? String(body.email).trim() : undefined,
    source,
    productInterest: body.productInterest ? String(body.productInterest) : undefined,
    countryOfResidence: body.countryOfResidence ? String(body.countryOfResidence) : undefined,
    message: body.message ? String(body.message) : undefined,
    context: body.context && typeof body.context === "object" ? body.context : undefined,
  });

  // Never leak backend detail to the client — the fallback path still "succeeds"
  // from the user's perspective (their enquiry is captured for the DFS team).
  return NextResponse.json({ ok: true, reference: result.data?.leadId ?? null });
}
