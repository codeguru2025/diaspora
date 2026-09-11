"use client";

import { useState } from "react";
import { CheckCircle2, Phone } from "lucide-react";
import { Field, TextInput, TextArea, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { site } from "@/config/site";
import { zimbabweProvinces } from "@/config/content";

/**
 * Deliberately short (MEGA PROMPT §24). Someone who has just lost a family member
 * should not be pushed through an insurance-style registration. Name + phone are
 * the only required fields; everything else helps but is optional.
 */
export function ArrangeFuneralForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    track({ name: "funeral_request_started" });
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/arrange-funeral", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      track({ name: "funeral_request_completed" });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-sage/30 bg-sage/8 p-8">
        <CheckCircle2 className="size-8 text-sage" />
        <h2 className="mt-3 text-2xl">We have your details. Our team is on it.</h2>
        <p className="mt-2 text-stone">
          A member of our care team will call you very shortly. If you need to speak to someone right
          now, please call our care line.
        </p>
        <a
          href={site.contact.atNeedPhoneHref}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-abyss px-5 py-3 text-sm font-medium text-ivory"
        >
          <Phone className="size-4" />
          {site.contact.atNeedPhoneDisplay}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <p className="rounded-xl bg-cream px-4 py-3 text-sm text-charcoal">
        You only need to give us your name and a phone number. We&rsquo;ll call you and take it from
        there. Everything else below is optional and just helps us prepare.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Your name" required>
          <TextInput name="contactName" required autoComplete="name" />
        </Field>
        <Field label="Phone number" required hint="Include your country code if you're abroad">
          <TextInput name="contactPhone" type="tel" required inputMode="tel" autoComplete="tel" />
        </Field>
        <Field label="Email">
          <TextInput name="contactEmail" type="email" autoComplete="email" />
        </Field>
        <Field label="Your relationship to the person who has passed">
          <TextInput name="relationshipToDeceased" placeholder="e.g. son, daughter, spouse" />
        </Field>

        <Field label="Name of the person who has passed away">
          <TextInput name="deceasedName" />
        </Field>
        <Field label="Are they an existing DFS policyholder?">
          <Select name="isExistingPolicyholder" defaultValue="unsure">
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="unsure">I&rsquo;m not sure</option>
          </Select>
        </Field>

        <Field label="Policy number (if you have it)">
          <TextInput name="policyNumber" />
        </Field>
        <Field label="Where will the service be?">
          <Select name="serviceProvince" defaultValue="">
            <option value="">Select a province</option>
            {zimbabweProvinces.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Town or area">
          <TextInput name="serviceTownOrArea" />
        </Field>
        <Field label="Where are you contacting us from?">
          <TextInput name="callerLocation" placeholder="City / country" />
        </Field>

        <Field label="Anything we should know right now?" className="sm:col-span-2">
          <TextArea name="notes" placeholder="Optional" />
        </Field>
      </div>

      {status === "error" && (
        <p className="mt-4 text-sm text-terracotta">
          Something went wrong. Please call our care line directly on {site.contact.atNeedPhoneDisplay}.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" variant="urgent" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send this to our care team"}
        </Button>
        <a
          href={site.contact.atNeedPhoneHref}
          className="inline-flex items-center justify-center gap-2 text-sm font-medium text-ink"
        >
          <Phone className="size-4" /> Or call now · {site.contact.atNeedPhoneDisplay}
        </a>
      </div>
    </form>
  );
}
