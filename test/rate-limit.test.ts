import { describe, expect, it } from "vitest";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/client-ip";

const req = (headers: Record<string, string>) => new Request("https://dfs.test/api/x", { headers });

describe("clientIp", () => {
  it("prefers the platform's header over X-Forwarded-For", () => {
    expect(clientIp(req({ "do-connecting-ip": "1.1.1.1", "x-forwarded-for": "9.9.9.9" }))).toBe("1.1.1.1");
  });

  it("ignores client-supplied X-Forwarded-For entries", () => {
    expect(clientIp(req({ "x-forwarded-for": "6.6.6.6, 2.2.2.2" }))).toBe("2.2.2.2");
  });

  it("returns null when nothing identifies the caller", () => {
    expect(clientIp(req({}))).toBeNull();
  });
});

describe("rateLimit", () => {
  const rule = { name: "test", limit: 2, windowMs: 1000 };

  it("allows up to the limit, then answers 429 with Retry-After", async () => {
    const r = req({ "do-connecting-ip": "3.3.3.3" });
    expect(rateLimit(r, rule, 0)).toBeNull();
    expect(rateLimit(r, rule, 1)).toBeNull();
    const blocked = rateLimit(r, rule, 2);
    expect(blocked?.status).toBe(429);
    expect(blocked?.headers.get("retry-after")).toBe("1");
  });

  it("counts each IP separately and resets after the window", () => {
    const a = req({ "do-connecting-ip": "4.4.4.4" });
    const b = req({ "do-connecting-ip": "5.5.5.5" });
    rateLimit(a, rule, 0);
    rateLimit(a, rule, 0);
    expect(rateLimit(a, rule, 0)?.status).toBe(429);
    expect(rateLimit(b, rule, 0)).toBeNull();
    expect(rateLimit(a, rule, 1000)).toBeNull();
  });
});
