import { proxyClientAuth } from "@/lib/portal";

/**
 * Transparent proxy: /api/portal/<x> → POL263 /api/client-auth/<x>
 * Only a safe allow-list of client-auth paths is forwarded.
 */

const ALLOW = [
  /^login$/,
  /^logout$/,
  /^me$/,
  /^tenant$/,
  /^claim$/,
  /^enroll$/,
  /^reset-password$/,
  /^change-password$/,
  /^policies$/,
  /^policies\/[^/]+\/(payments|members|document|beneficiary)$/,
  /^claims$/,
  /^notifications$/,
  /^notifications\/unread-count$/,
  /^notifications\/[^/]+\/read$/,
  /^receipts$/,
  /^receipts\/[^/]+\/download$/,
  /^payment-intents$/,
  /^payment-intents\/[^/]+\/(initiate|otp|status)$/,
  /^feedback$/,
  /^dependent-request$/,
];

function allowed(path: string) {
  return ALLOW.some((re) => re.test(path));
}

async function handle(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await ctx.params;
  const path = (parts ?? []).join("/");
  if (!allowed(path)) {
    return Response.json({ message: "Not found" }, { status: 404 });
  }
  const query = new URL(req.url).search.replace(/^\?/, "");
  return proxyClientAuth(path, req, { query });
}

export const GET = handle;
export const POST = handle;
export const PATCH = handle;
export const PUT = handle;
export const DELETE = handle;
