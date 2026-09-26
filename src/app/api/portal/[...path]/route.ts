import { proxyClientAuth } from "@/lib/portal";
import { AUTH_PATHS, allowed } from "@/lib/portal-paths";
import { LIMITS, rateLimit } from "@/lib/rate-limit";

/**
 * Transparent proxy: /api/portal/<x> → POL263 /api/client-auth/<x>
 * Only a safe allow-list of client-auth paths is forwarded (src/lib/portal-paths.ts).
 */

async function handle(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: parts = [] } = await ctx.params;
  if (!allowed(parts)) {
    return Response.json({ message: "Not found" }, { status: 404 });
  }

  const limited =
    rateLimit(req, LIMITS.portal) ??
    (req.method !== "GET" && AUTH_PATHS.has(parts[0]) ? rateLimit(req, LIMITS.portalAuth) : null);
  if (limited) return limited;

  // Segments arrive decoded; re-encode each so a "?" or "#" inside an id can't
  // change the upstream URL's query or fragment.
  const path = parts.map(encodeURIComponent).join("/");
  const query = new URL(req.url).search.replace(/^\?/, "");
  return proxyClientAuth(path, req, { query });
}

export const GET = handle;
export const POST = handle;
export const PATCH = handle;
export const PUT = handle;
export const DELETE = handle;
