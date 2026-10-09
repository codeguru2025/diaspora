import { NextResponse } from "next/server";
import { benefitsForEveryone, getQuote, resolveProductVersionId } from "@/lib/pol263";
import { parseBody, quoteSchema } from "@/lib/api-schemas";
import { LIMITS, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const limited = rateLimit(req, LIMITS.estimate);
  if (limited) return limited;

  const body = await parseBody(req, quoteSchema);
  if (!body.ok) return body.response;
  const { packageSlug, serviceSlugs, serviceChoices, ...quote } = body.data;

  const productVersionId =
    quote.productVersionId ?? (packageSlug ? await resolveProductVersionId(packageSlug) : undefined);

  // Each chosen service (its option × quantity) is a benefit on every covered person, priced at
  // that person's age.
  const { memberAddOns, unpriced } = await benefitsForEveryone(
    serviceSlugs ?? [],
    (quote.dependentDateOfBirths ?? []).length,
    serviceChoices ?? [],
  );
  const res = await getQuote({ ...quote, productVersionId, memberAddOns: memberAddOns.length ? memberAddOns : undefined });

  return NextResponse.json({ ...res.data, unpricedServices: unpriced, source: res.source });
}
