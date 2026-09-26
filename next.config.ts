import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Third-party origins the site actually uses: Cloudflare Turnstile on forms, and
 * GA4 / Plausible once a visitor accepts analytics (src/components/analytics.tsx).
 * Add an origin here before embedding anything new.
 */
const TURNSTILE = "https://challenges.cloudflare.com";
const GA = "https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com";
const PLAUSIBLE = "https://plausible.io";

// 'unsafe-inline' scripts are needed without nonces (Next's inline bootstrap and the
// GA init snippet); nonces would force every page to render dynamically. The other
// directives still block framing, plugins, base-tag hijacking and off-site form posts.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} ${TURNSTILE} ${GA} ${PLAUSIBLE}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' blob: data: ${GA}`,
  "font-src 'self'",
  `connect-src 'self' ${TURNSTILE} ${GA} ${PLAUSIBLE}`,
  `frame-src ${TURNSTILE}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      // Payment-link and saved-quote URLs carry their token in the path: don't send
      // it as a Referer to the card checkout or any other site. (Last match wins.)
      {
        source: "/:section(pay|q|account)/:path*",
        headers: [{ key: "Referrer-Policy", value: "no-referrer" }],
      },
    ];
  },
};

export default nextConfig;
