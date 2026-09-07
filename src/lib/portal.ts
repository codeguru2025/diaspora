import "server-only";

/**
 * Customer portal transparent proxy (MEGA PROMPT §15, §57).
 *
 * The authenticated customer portal is POL263's `/api/client-auth/*` API, which
 * is session-cookie based. Rather than re-implement auth or fight cross-origin
 * cookies, this site proxies those calls through its own origin: the browser
 * only ever sets first-party cookies for the DFS domain, and this server
 * forwards the session cookie to POL263 and relays POL263's `Set-Cookie` back.
 *
 * No portal data is stored here — POL263 remains the source of truth.
 */

const BASE = process.env.POL263_API_BASE_URL?.replace(/\/$/, "") || "";

export const portalConfigured = Boolean(BASE);

/** Path under /api/client-auth, e.g. "login", "policies", "policies/abc/members". */
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
  const cookie = req.headers.get("cookie");
  if (cookie) headers.cookie = cookie;
  const ct = req.headers.get("content-type");
  if (ct) headers["content-type"] = ct;
  // Forward the caller's IP for POL263 rate-limiting / audit.
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) headers["x-forwarded-for"] = fwd;

  let body: string | undefined = init?.body;
  if (body === undefined && method !== "GET" && method !== "HEAD") {
    body = await req.text();
  }

  let upstream: Response;
  try {
    upstream = await fetch(url, { method, headers, body, redirect: "manual" });
  } catch {
    return Response.json(
      { message: "Could not reach the customer portal. Please try again shortly." },
      { status: 502 },
    );
  }

  // Relay body + status, and pass through Set-Cookie (stripping Domain so the
  // cookie is scoped to the DFS origin the browser is actually talking to).
  const outHeaders = new Headers();
  const contentType = upstream.headers.get("content-type");
  if (contentType) outHeaders.set("content-type", contentType);

  const setCookie = upstream.headers.getSetCookie?.() ?? [];
  for (const c of setCookie) {
    outHeaders.append("set-cookie", c.replace(/;\s*Domain=[^;]+/i, ""));
  }

  const buf = await upstream.arrayBuffer();
  return new Response(buf, { status: upstream.status, headers: outHeaders });
}
