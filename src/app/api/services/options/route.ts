import { NextResponse } from "next/server";
import { getServiceCatalogue } from "@/lib/pol263";

/**
 * How each service is priced in POL263 — its options (unit price, and for per-guest/per-night/…
 * options the minimum and usual quantity) and the packages that include it free. The quote
 * builder shows these so the visitor picks an option and quantity and sees the premium move.
 */
export async function GET() {
  const catalogue = await getServiceCatalogue();
  const services = catalogue.data
    .filter((s) => s.pol263AddOnId)
    .map((s) => ({ slug: s.slug, options: s.options, includedProductCodes: s.includedProductCodes }));
  return NextResponse.json({ services, source: catalogue.source });
}
