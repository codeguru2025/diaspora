import { NextResponse } from "next/server";
import { initiatePaymentLink, type PaymentMethod } from "@/lib/pol263";

const METHODS: PaymentMethod[] = ["ecocash", "onemoney", "innbucks", "omari", "visa_mastercard"];

export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  let body: { method?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!METHODS.includes(body.method as PaymentMethod)) {
    return NextResponse.json({ error: "Choose a payment method." }, { status: 400 });
  }

  const result = await initiatePaymentLink(token, body.method as PaymentMethod);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json(result.data);
}
