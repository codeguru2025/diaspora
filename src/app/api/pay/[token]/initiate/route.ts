import { NextResponse } from "next/server";
import { initiatePaymentLink } from "@/lib/pol263";
import { parseBody, paymentMethodSchema, paymentTokenSchema } from "@/lib/api-schemas";
import { LIMITS, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) {
  const limited = rateLimit(req, LIMITS.pay);
  if (limited) return limited;

  const { token } = await ctx.params;
  if (!paymentTokenSchema.safeParse(token).success) {
    return NextResponse.json({ error: "This payment link wasn't found." }, { status: 404 });
  }
  const body = await parseBody(req, paymentMethodSchema);
  if (!body.ok) return body.response;

  const result = await initiatePaymentLink(token, body.data.method);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json(result.data);
}
