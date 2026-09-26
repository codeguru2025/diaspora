import { describe, expect, it } from "vitest";
import { funeralRequestSchema, leadSchema, parseBody, quoteSchema, registerSchema } from "@/lib/api-schemas";
import { decodeQuote, encodeQuote } from "@/lib/quote-token";

describe("leadSchema", () => {
  it("files unknown sources as a general enquiry and trims input", () => {
    const r = leadSchema.parse({ firstName: " Tariro ", phone: "+44 7700", source: "nope", email: "" });
    expect(r).toMatchObject({ firstName: "Tariro", source: "speak_to_us" });
    expect(r.email).toBeUndefined();
  });

  it("requires a name and phone", () => {
    expect(leadSchema.safeParse({ firstName: "", phone: "1" }).success).toBe(false);
  });

  it("caps the size of free-form context", () => {
    expect(leadSchema.safeParse({ firstName: "A", phone: "1", context: { x: "y".repeat(6000) } }).success).toBe(
      false,
    );
  });
});

describe("registerSchema", () => {
  it("drops half-filled family rows", () => {
    const r = registerSchema.parse({
      firstName: "A",
      lastName: "B",
      phone: "1",
      dependents: [
        { firstName: "C", lastName: "D", relationship: "child", dateOfBirth: "2015-01-02" },
        { firstName: "", lastName: "", relationship: "", dateOfBirth: "" },
      ],
    });
    expect(r.dependents).toEqual([{ firstName: "C", lastName: "D", relationship: "child", dateOfBirth: "2015-01-02" }]);
  });
});

describe("funeralRequestSchema", () => {
  it("accepts an age sent as a form string", () => {
    const r = funeralRequestSchema.parse({ contactName: "A", contactPhone: "1", deceasedAge: "74" });
    expect(r.deceasedAge).toBe(74);
  });
});

describe("quoteSchema", () => {
  it("rejects malformed currencies", () => {
    expect(quoteSchema.safeParse({ currency: "usd; drop" }).success).toBe(false);
  });
});

describe("parseBody", () => {
  it("returns the first problem as { error }", async () => {
    const res = await parseBody(
      new Request("https://dfs.test", { method: "POST", body: JSON.stringify({ firstName: "A" }) }),
      leadSchema,
    );
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.response.status).toBe(400);
      expect(await res.response.json()).toEqual({ error: "Name and phone are required" });
    }
  });
});

describe("quote tokens", () => {
  it("round-trips and clamps values", () => {
    const token = encodeQuote({ p: "classic", s: ["a"], a: 99, c: -1, r: "GB" });
    expect(decodeQuote(token)).toMatchObject({ p: "classic", s: ["a"], a: 20, c: 0, r: "GB" });
    expect(decodeQuote("not-a-token")).toBeNull();
  });
});
