import { NextResponse } from "next/server";
import { getPaymentLink } from "@/lib/pol263";
import { paymentTokenSchema } from "@/lib/api-schemas";
import { LIMITS, rateLimit } from "@/lib/rate-limit";

export async function GET(req: Request, ctx: { params: Promise<{ token: string }> }) {
  const limited = rateLimit(req, LIMITS.pay);
  if (limited) return limited;

  const { token } = await ctx.params;
  if (!paymentTokenSchema.safeParse(token).success) {
    return NextResponse.json({ error: "This payment link wasn't found." }, { status: 404 });
  }
  const result = await getPaymentLink(token);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json(result.data);
}
