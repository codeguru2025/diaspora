/** The POL263 `/api/client-auth/*` paths the portal proxy may forward. */

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

/** Credential-guessing targets get a much tighter limit than the rest of the portal. */
export const AUTH_PATHS = new Set(["login", "claim", "enroll", "reset-password", "change-password"]);

export function allowed(parts: string[]): boolean {
  // Dot segments would be resolved by URL parsing and step outside the matched path.
  if (parts.some((p) => p === "" || p === "." || p === "..")) return false;
  const path = parts.join("/");
  return ALLOW.some((re) => re.test(path));
}

