import { NextResponse } from "next/server";
import { submitPaymentLinkOtp } from "@/lib/pol263";

export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  let body: { otp?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const otp = String(body.otp || "").trim();
  if (!otp) {
    return NextResponse.json({ error: "Enter the code you received." }, { status: 400 });
  }

  const result = await submitPaymentLinkOtp(token, otp);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json(result.data);
}
