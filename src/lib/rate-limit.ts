import { clientIp } from "@/lib/client-ip";

/**
 * Fixed-window, per-IP rate limiting for the public API routes.
 *
 * State is in memory, so each app instance counts separately — fine for the
 * single-instance deploy in `.do/app.yaml`; move to Redis if that changes.
 */

type Window = { count: number; resetAt: number };

const buckets = new Map<string, Map<string, Window>>();

export type RateLimit = { name: string; limit: number; windowMs: number };

/** Returns a 429 response when the caller is over the limit, otherwise null. */
export function rateLimit(req: Request, rule: RateLimit, now = Date.now()): Response | null {
  const ip = clientIp(req) ?? "unknown";
  let bucket = buckets.get(rule.name);
  if (!bucket) {
    bucket = new Map();
    buckets.set(rule.name, bucket);
  }

  // Drop expired windows now and then so the map can't grow without bound.
  if (bucket.size > 10_000) {
    for (const [key, w] of bucket) if (w.resetAt <= now) bucket.delete(key);
  }

  const w = bucket.get(ip);
  if (!w || w.resetAt <= now) {
    bucket.set(ip, { count: 1, resetAt: now + rule.windowMs });
    return null;
  }
  w.count += 1;
  if (w.count <= rule.limit) return null;

  const retryAfter = Math.max(1, Math.ceil((w.resetAt - now) / 1000));
  return Response.json(
    { error: "Too many requests. Please wait a moment and try again." },
    { status: 429, headers: { "retry-after": String(retryAfter) } },
  );
}

/** Limits per route family. Generous for real visitors, tight enough to stop scripted abuse. */
export const LIMITS = {
  /** Forms that create records for the DFS team. */
  submit: { name: "submit", limit: 10, windowMs: 10 * 60_000 },
  /** Price lookups — the quote wizard and cash-service estimate call these as the visitor clicks. */
  estimate: { name: "estimate", limit: 60, windowMs: 60_000 },
  /** Payment-link reads and actions; polling runs every 4s while a payment is pending. */
  pay: { name: "pay", limit: 60, windowMs: 60_000 },
  /** Customer portal — sign-in attempts get their own tighter limit. */
  portal: { name: "portal", limit: 120, windowMs: 60_000 },
  portalAuth: { name: "portal-auth", limit: 10, windowMs: 10 * 60_000 },
} satisfies Record<string, RateLimit>;
