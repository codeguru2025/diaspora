/**
 * The visitor's IP as seen by the hosting platform, for rate limiting and for
 * POL263's audit log.
 *
 * A client can send any `X-Forwarded-For` it likes, so its leftmost entries are
 * never trusted. DigitalOcean App Platform sets `do-connecting-ip` itself; other
 * proxies append the address they saw to the right of `X-Forwarded-For`.
 */
export function clientIp(req: Request): string | null {
  const platform = req.headers.get("do-connecting-ip") ?? req.headers.get("x-real-ip");
  if (platform?.trim()) return platform.trim();
  const fwd = req.headers.get("x-forwarded-for");
  const last = fwd?.split(",").at(-1)?.trim();
  return last || null;
}
