import "server-only";

import { clientIp } from "@/lib/client-ip";

/**
 * Customer portal transparent proxy (MEGA PROMPT §15, §57).
 *
 * The authenticated customer portal is POL263's `/api/client-auth/*` API, which
 * is session-cookie based. Rather than re-implement auth or fight cross-origin
 * cookies, this site proxies those calls through its own origin: the browser
 * only ever sets first-party cookies for the DFS domain, and this server
 * forwards the session cookie to POL263 and relays POL263's `Set-Cookie` back.
 *
 * POL263's cookies are stored under a `pol263_` prefix on this origin, so only
 * those are forwarded upstream — analytics or any other cookie set on the DFS
 * domain never reaches POL263.
 *
 * No portal data is stored here — POL263 remains the source of truth.
 */

const BASE = process.env.POL263_API_BASE_URL?.replace(/\/$/, "") || "";

export const portalConfigured = Boolean(BASE);

export const COOKIE_PREFIX = "pol263_";

/** Browser-enforced cookie name prefixes have to stay at the front of the name. */
const SECURE_PREFIX = /^(__Host-|__Secure-)/;

/** POL263 cookie name → the name it's stored under on this origin. */
export function toLocalCookieName(name: string): string {
  const m = name.match(SECURE_PREFIX);
  return m ? `${m[1]}${COOKIE_PREFIX}${name.slice(m[1].length)}` : `${COOKIE_PREFIX}${name}`;
}

/** Inverse of toLocalCookieName; null for cookies that aren't POL263's. */
export function toUpstreamCookieName(name: string): string | null {
  const m = name.match(SECURE_PREFIX);
  const rest = m ? name.slice(m[1].length) : name;
  if (!rest.startsWith(COOKIE_PREFIX)) return null;
  return `${m?.[1] ?? ""}${rest.slice(COOKIE_PREFIX.length)}`;
}

/** Keeps only POL263's cookies from the browser's Cookie header, under their original names. */
export function upstreamCookieHeader(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const kept = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .flatMap((c) => {
      const eq = c.indexOf("=");
      if (eq <= 0) return [];
      const name = toUpstreamCookieName(c.slice(0, eq));
      return name ? [`${name}=${c.slice(eq + 1)}`] : [];
    });
  return kept.length ? kept.join("; ") : null;
}

/** Rewrites one upstream Set-Cookie for this origin: prefixed name, no Domain. */
export function localSetCookie(setCookie: string): string {
  const eq = setCookie.indexOf("=");
  if (eq <= 0) return setCookie;
  return `${toLocalCookieName(setCookie.slice(0, eq).trim())}${setCookie.slice(eq)}`.replace(
    /;\s*Domain=[^;]+/i,
    "",
  );
}

/** Response headers worth relaying from POL263 (downloads need their filename). */
const RELAYED_HEADERS = ["content-type", "content-disposition", "cache-control"];

/** Path under /api/client-auth, e.g. "login", "policies", "policies/abc/members" — already URL-encoded. */
export async function proxyClientAuth(
  path: string,
  req: Request,
  init?: { method?: string; body?: string; query?: string },
): Promise<Response> {
  if (!BASE) {
    return Response.json(
      { message: "The customer portal is not connected yet.", code: "PORTAL_NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  const method = init?.method ?? req.method ?? "GET";
  const url = `${BASE}/api/client-auth/${path}${init?.query ? `?${init.query}` : ""}`;

  const headers: Record<string, string> = { accept: "application/json" };
  const cookie = upstreamCookieHeader(req.headers.get("cookie"));
  if (cookie) headers.cookie = cookie;
  const ct = req.headers.get("content-type");
  if (ct) headers["content-type"] = ct;
  // POL263 CSRF (csurf) double-submit token — see xsrfToken() in portal-client.
  const xsrf = req.headers.get("x-xsrf-token");
  if (xsrf) headers["x-xsrf-token"] = xsrf;
  // The caller's IP for POL263 rate-limiting / audit — as the platform saw it,
  // never a client-supplied X-Forwarded-For.
  const ip = clientIp(req);
  if (ip) headers["x-forwarded-for"] = ip;

  let body: string | undefined = init?.body;
  if (body === undefined && method !== "GET" && method !== "HEAD") {
    body = await req.text();
  }

  let upstream: Response;
  try {
    upstream = await fetch(url, { method, headers, body, redirect: "manual", cache: "no-store" });
  } catch {
    return Response.json(
      { message: "Could not reach the customer portal. Please try again shortly." },
      { status: 502 },
    );
  }

  const outHeaders = new Headers();
  for (const name of RELAYED_HEADERS) {
    const value = upstream.headers.get(name);
    if (value) outHeaders.set(name, value);
  }
  for (const c of upstream.headers.getSetCookie?.() ?? []) {
    outHeaders.append("set-cookie", localSetCookie(c));
  }

  // Stream the body through rather than buffering it (receipt/document downloads).
  return new Response(upstream.body, { status: upstream.status, headers: outHeaders });
}
