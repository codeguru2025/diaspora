/**
 * Shareable quote tokens (MEGA PROMPT §45).
 *
 * A saved quote is a URL that encodes the selection, so it works with zero
 * backend and can be texted / WhatsApped / emailed by the customer or a
 * consultant. When the POL263 quotes table is wired in, a short server id can be
 * added alongside — the render page accepts either.
 */

export type QuoteTokenData = {
  p: string | null; // package slug
  s: string[]; // service slugs
  a: number; // adults
  c: number; // children
  r: string; // country of residence code
  province?: string;
  /**
   * The estimate shown when the link was saved. Kept for older links, but never
   * displayed: `/q/[token]` recalculates the price server-side because anyone can
   * edit a link.
   */
  premium?: string | null;
  currency?: string;
};

function toBase64Url(s: string): string {
  const b64 =
    typeof window === "undefined"
      ? Buffer.from(s, "utf8").toString("base64")
      : btoa(unescape(encodeURIComponent(s)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): string {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  return typeof window === "undefined"
    ? Buffer.from(b64, "base64").toString("utf8")
    : decodeURIComponent(escape(atob(b64)));
}

export function encodeQuote(data: QuoteTokenData): string {
  return toBase64Url(JSON.stringify(data));
}

export function decodeQuote(token: string): QuoteTokenData | null {
  try {
    const parsed = JSON.parse(fromBase64Url(token)) as QuoteTokenData;
    if (typeof parsed !== "object" || parsed === null) return null;
    return {
      p: typeof parsed.p === "string" ? parsed.p : null,
      s: Array.isArray(parsed.s) ? parsed.s.filter((x) => typeof x === "string").slice(0, 60) : [],
      a: Number.isFinite(parsed.a) ? Math.max(1, Math.min(20, parsed.a)) : 1,
      c: Number.isFinite(parsed.c) ? Math.max(0, Math.min(20, parsed.c)) : 0,
      r: typeof parsed.r === "string" ? parsed.r.slice(0, 6) : "ZW",
      province: typeof parsed.province === "string" ? parsed.province.slice(0, 40) : undefined,
      premium: typeof parsed.premium === "string" ? parsed.premium : null,
      currency: typeof parsed.currency === "string" ? parsed.currency.slice(0, 4) : "USD",
    };
  } catch {
    return null;
  }
}
