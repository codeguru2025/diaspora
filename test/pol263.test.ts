import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type FetchCall = { url: string; body: Record<string, unknown> | null };

/** Loads pol263.ts against a fake POL263 that answers each call from `responses`, in order. */
async function load(responses: { status: number; body?: unknown }[], env: Record<string, string> = {}) {
  vi.resetModules();
  vi.stubEnv("POL263_API_BASE_URL", "https://pol263.test");
  vi.stubEnv("POL263_ORG_ID", "org-1");
  vi.stubEnv("POL263_PUBLIC_REF", "REF1");
  for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v);

  const calls: FetchCall[] = [];
  const queue = [...responses];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      calls.push({ url, body: init?.body ? JSON.parse(String(init.body)) : null });
      const next = queue.shift() ?? { status: 500 };
      return new Response(JSON.stringify(next.body ?? {}), {
        status: next.status,
        headers: { "content-type": "application/json" },
      });
    }),
  );
  const mod = await import("@/lib/pol263");
  return { mod, calls };
}

const lead = {
  firstName: "Tariro",
  lastName: "Moyo",
  phone: "+447700900000",
  source: "get_a_quote" as const,
  turnstileToken: "tok",
};

let warn: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "info").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("createLead", () => {
  it("sends the message, country and context to POL263", async () => {
    const { mod, calls } = await load([{ status: 200, body: { leadId: "L1" } }]);
    const res = await mod.createLead({
      ...lead,
      message: "Please call after 6pm",
      countryOfResidence: "GB",
      context: { adults: 2, services: ["premium-casket"], empty: "" },
    });

    expect(res).toMatchObject({ ok: true, source: "pol263", data: { leadId: "L1" } });
    expect(calls).toHaveLength(1);
    expect(calls[0].body).toMatchObject({ source: "get_a_quote", countryOfResidence: "GB" });
    expect(calls[0].body?.message).toBe(
      'Please call after 6pm\nCountry of residence: GB\nadults: 2\nservices: ["premium-casket"]',
    );
  });

  it("surfaces a POL263 400 instead of pretending the lead was captured", async () => {
    const { mod } = await load([{ status: 400, body: { message: "Verification failed" } }]);
    expect(await mod.createLead(lead)).toMatchObject({ ok: false, error: "Verification failed" });
  });

  it("redacts sensitive fields when it falls back to the server log", async () => {
    const { mod } = await load([{ status: 503 }]);
    await mod.createLead({
      ...lead,
      context: { beneficiary: { nationalId: "63-123456A42" }, nationalId: "provided", adults: 2 },
    });
    const logged = JSON.stringify(warn.mock.calls);
    expect(logged).not.toContain("63-123456A42");
    expect(logged).not.toContain('"tok"');
    expect(logged).toContain("Tariro");
    expect(logged).toContain('"adults":2');
  });
});

describe("registerPolicy", () => {
  const application = { ...lead, productVersionId: "pv-1", nationalId: "63-123456A42", selectedServices: ["x"] };

  it("does not re-send a spent Turnstile token after a POL263 server error", async () => {
    const { mod, calls } = await load([{ status: 502 }]);
    const res = await mod.registerPolicy(application);

    expect(calls).toHaveLength(1);
    expect(calls[0].url).toContain("/api/public/register-policy");
    expect(res).toMatchObject({ ok: true, source: "fallback", data: { status: "captured" } });
  });

  it("returns POL263's rejection message on a 400", async () => {
    const { mod } = await load([{ status: 400, body: { message: "Bad ID" } }]);
    expect(await mod.registerPolicy(application)).toMatchObject({ ok: false, error: "Bad ID" });
  });

  it("makes no follow-up POL263 call after a successful registration", async () => {
    const { mod, calls } = await load([
      { status: 200, body: { policyNumber: "P1", activationCode: "A1", paymentLink: null } },
    ]);
    const res = await mod.registerPolicy(application);
    expect(res).toMatchObject({ ok: true, data: { status: "registered", policyNumber: "P1" } });
    expect(calls).toHaveLength(1);
  });

  it("captures via a POL263 lead when registration can't be attempted", async () => {
    const { mod, calls } = await load([{ status: 200, body: { leadId: "L2" } }]);
    const res = await mod.registerPolicy({ ...application, productVersionId: undefined });
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toContain("/quote-lead");
    expect(calls[0].body?.turnstileToken).toBe("tok");
    expect(res).toMatchObject({ ok: true, data: { status: "captured" } });
  });
});

describe("createFuneralRequest", () => {
  const request = {
    contactName: "Rudo Ncube",
    contactPhone: "+263770000000",
    relationshipToDeceased: "daughter",
    serviceProvince: "Harare",
    neededBy: "Saturday",
    notes: "Burial at Warren Hills",
    turnstileToken: "tok",
  };

  it("sends the location and timing details that have no dedicated field", async () => {
    const { mod, calls } = await load([{ status: 200, body: { reference: "R1", quotation: null } }]);
    await mod.createFuneralRequest(request);
    const message = String(calls[0].body?.message);
    expect(message).toContain("Burial at Warren Hills");
    expect(message).toContain("Relationship: daughter");
    expect(message).toContain("Service province: Harare");
    expect(message).toContain("Needed by: Saturday");
  });

  it("still confirms the request after a POL263 server error, without re-using the token", async () => {
    const { mod, calls } = await load([{ status: 500 }]);
    const res = await mod.createFuneralRequest(request);
    expect(calls).toHaveLength(1);
    expect(res).toMatchObject({ ok: true, source: "fallback" });
  });
});

describe("leadNote", () => {
  it("returns undefined when there is nothing to say", async () => {
    const { mod } = await load([]);
    expect(mod.leadNote({ context: { a: undefined, b: [], c: "" } })).toBeUndefined();
  });
});
