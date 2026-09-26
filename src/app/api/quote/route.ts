import { NextResponse } from "next/server";
import { getQuote, resolveProductVersionId } from "@/lib/pol263";
import { parseBody, quoteSchema } from "@/lib/api-schemas";
import { LIMITS, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const limited = rateLimit(req, LIMITS.estimate);
  if (limited) return limited;

  const body = await parseBody(req, quoteSchema);
  if (!body.ok) return body.response;
  const { packageSlug, ...quote } = body.data;

  const productVersionId =
    quote.productVersionId ?? (packageSlug ? await resolveProductVersionId(packageSlug) : undefined);

  const res = await getQuote({ ...quote, productVersionId });

  return NextResponse.json({ ...res.data, source: res.source });
}
