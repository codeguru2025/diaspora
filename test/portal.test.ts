import { describe, expect, it } from "vitest";
import { localSetCookie, toLocalCookieName, toUpstreamCookieName, upstreamCookieHeader } from "@/lib/portal";
import { allowed } from "@/lib/portal-paths";

describe("portal cookies", () => {
  it("forwards only POL263's own cookies, under their original names", () => {
    expect(upstreamCookieHeader("_ga=GA1.1; pol263_connect.sid=s%3Aabc; pol263_XSRF-TOKEN=x1; theme=dark")).toBe(
      "connect.sid=s%3Aabc; XSRF-TOKEN=x1",
    );
    expect(upstreamCookieHeader("_ga=GA1.1")).toBeNull();
    expect(upstreamCookieHeader(null)).toBeNull();
  });

  it("prefixes relayed cookies and drops their Domain", () => {
    expect(localSetCookie("connect.sid=abc; Path=/; Domain=pol263.app; HttpOnly; Secure")).toBe(
      "pol263_connect.sid=abc; Path=/; HttpOnly; Secure",
    );
  });

  it("keeps browser-enforced prefixes at the front", () => {
    expect(toLocalCookieName("__Host-sid")).toBe("__Host-pol263_sid");
    expect(toUpstreamCookieName("__Host-pol263_sid")).toBe("__Host-sid");
    expect(toUpstreamCookieName("__Host-sid")).toBeNull();
  });
});

describe("portal path allow-list", () => {
  it("allows known paths", () => {
    expect(allowed(["policies"])).toBe(true);
    expect(allowed(["policies", "abc-123", "payments"])).toBe(true);
    expect(allowed(["receipts", "r1", "download"])).toBe(true);
  });

  it("rejects unknown paths and dot segments", () => {
    expect(allowed(["admin"])).toBe(false);
    expect(allowed(["policies", "..", "payments"])).toBe(false);
    expect(allowed(["policies", ".", "payments"])).toBe(false);
    expect(allowed([])).toBe(false);
  });
});
