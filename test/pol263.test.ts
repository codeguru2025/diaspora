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
  // Registration first looks the chosen services up in POL263's benefits list (registration-options),
  // so each becomes a benefit on every covered person; then it registers.
  const options = { status: 200, body: { products: [], addOns: [{ id: "ao-cat", name: "Catering", cashValue: "500.00" }] } };
  const application = {
    ...lead, productVersionId: "pv-1", nationalId: "63-123456A42", selectedServices: ["catering"],
    dependents: [{ firstName: "Rudo", lastName: "Moyo", relationship: "Child", dateOfBirth: "2018-05-01" }],
  };

  it("does not re-send a spent Turnstile token after a POL263 server error", async () => {
    const { mod, calls } = await load([options, { status: 502 }]);
    const res = await mod.registerPolicy(application);

    const writes = calls.filter((c) => !c.url.includes("registration-options"));
    expect(writes).toHaveLength(1);
    expect(writes[0].url).toContain("/api/public/register-policy");
    expect(res).toMatchObject({ ok: true, source: "fallback", data: { status: "captured" } });
  });

  it("returns POL263's rejection message on a 400", async () => {
    const { mod } = await load([options, { status: 400, body: { message: "Bad ID" } }]);
    expect(await mod.registerPolicy(application)).toMatchObject({ ok: false, error: "Bad ID" });
  });

  it("makes no follow-up POL263 call after a successful registration", async () => {
    const { mod, calls } = await load([
      options,
      { status: 200, body: { policyNumber: "P1", activationCode: "A1", paymentLink: null } },
    ]);
    const res = await mod.registerPolicy(application);
    expect(res).toMatchObject({ ok: true, data: { status: "registered", policyNumber: "P1" } });
    expect(calls.filter((c) => !c.url.includes("registration-options"))).toHaveLength(1);
  });

  it("sends each chosen service as a benefit on every covered person", async () => {
    const { mod, calls } = await load([
      options,
      { status: 200, body: { policyNumber: "P2", activationCode: "A2", paymentLink: null } },
    ]);
    await mod.registerPolicy(application);
    const reg = calls.find((c) => c.url.includes("/api/public/register-policy"));
    expect(reg?.body?.memberAddOns).toEqual([
      { memberRef: "holder", addOnId: "ao-cat" },
      { memberRef: "dependent:0", addOnId: "ao-cat" },
    ]);
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

describe("benefitsForEveryone", () => {
  it("names chosen services POL263 can't price yet, so the visitor is told", async () => {
    const { mod } = await load([{ status: 200, body: { products: [], addOns: [
      { id: "ao-cat", name: "Catering", cashValue: "500.00" },
      { id: "ao-pa", name: "PA System", cashValue: null },
    ] } }]);
    const r = await mod.benefitsForEveryone(["catering", "pa-system"], 1);
    expect(r.memberAddOns).toHaveLength(4); // 2 services x (holder + 1 dependant)
    expect(r.unpriced).toEqual(["PA System"]);
  });

  it("sends each chosen option with its quantity, for every person; unknown or repeated options are dropped", async () => {
    const { mod } = await load([{ status: 200, body: { products: [], addOns: [
      { id: "ao-cat", name: "Catering", cashValue: "600.00", options: [
        { key: "traditional", label: "Traditional", unitPrice: "4.00", unit: "guest", minQty: 50, defaultQty: 150 },
        { key: "modern", label: "Modern", unitPrice: "6.00", unit: "guest", minQty: 50, defaultQty: 150 },
      ] },
      { id: "ao-pa", name: "PA System", cashValue: null, options: [{ key: "standard", label: "Standard", unitPrice: "100.00" }] },
    ] } }]);
    const r = await mod.benefitsForEveryone(["catering", "pa-system"], 1, [
      { slug: "catering", optionKey: "modern", quantity: 200 },
      { slug: "catering", optionKey: "modern", quantity: 90 },
      { slug: "catering", optionKey: "gold" },
    ]);
    expect(r.memberAddOns).toEqual([
      { memberRef: "holder", addOnId: "ao-cat", optionKey: "modern", quantity: 200 },
      { memberRef: "dependent:0", addOnId: "ao-cat", optionKey: "modern", quantity: 200 },
      { memberRef: "holder", addOnId: "ao-pa" },
      { memberRef: "dependent:0", addOnId: "ao-pa" },
    ]);
    expect(r.unpriced).toEqual([]); // priced by its options even with no single cash value
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

describe("buildLeadQuote", () => {
  it("prices the visitor's quote in POL263 and lists the benefits as chosen", async () => {
    const { mod } = await load([]);
    const quoteBodies: Record<string, unknown>[] = [];
    vi.stubGlobal("fetch", vi.fn(async (url: string, init?: RequestInit) => {
      const json = (b: unknown) => new Response(JSON.stringify(b), { status: 200, headers: { "content-type": "application/json" } });
      if (url.includes("/registration-options")) {
        return json({
          products: [{ id: "p-classic", code: "CLASSIC", name: "Classic", versions: [{ id: "pv-1", version: 1 }] }],
          addOns: [{ id: "ao-cat", name: "Catering", cashValue: "600.00", options: [
            { key: "modern", label: "Modern menu", unitPrice: "6.00", unit: "guest", minQty: 50, defaultQty: 150 },
          ] }],
        });
      }
      if (url.includes("/api/public/quote")) {
        quoteBodies.push(JSON.parse(String(init?.body)));
        return json({ premium: "19.98", currency: "USD", paymentSchedule: "monthly" });
      }
      return new Response("{}", { status: 404 });
    }));
    const q = await mod.buildLeadQuote({
      firstName: "Tariro", lastName: "Moyo", packageSlug: "classic", policyholderDateOfBirth: "1986-01-01",
      family: [{ relationship: "Child", dateOfBirth: "2018-01-01" }],
      serviceSlugs: ["catering"], serviceChoices: [{ slug: "catering", optionKey: "modern", quantity: 200 }],
    });
    expect(quoteBodies[0]).toMatchObject({
      productVersionId: "pv-1", policyholderDateOfBirth: "1986-01-01", dependentDateOfBirths: ["2018-01-01"],
      memberAddOns: [
        { memberRef: "holder", addOnId: "ao-cat", optionKey: "modern", quantity: 200 },
        { memberRef: "dependent:0", addOnId: "ao-cat", optionKey: "modern", quantity: 200 },
      ],
    });
    expect(q).toMatchObject({
      policyholderName: "Tariro Moyo",
      dependents: [{ firstName: "Child", lastName: "", dateOfBirth: "2018-01-01" }],
      recommended: { productId: "p-classic", productVersionId: "pv-1", productName: "Classic", premium: "19.98" },
      benefits: [{ name: "Catering", detail: "Modern menu × 200 guests" }],
    });
  });

  it("gives nothing without a package or a date of birth", async () => {
    const { mod } = await load([]);
    expect(await mod.buildLeadQuote({ firstName: "A", lastName: "B", packageSlug: "classic" })).toBeUndefined();
  });
});
