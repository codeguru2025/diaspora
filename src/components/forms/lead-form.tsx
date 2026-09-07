"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Field, TextInput, TextArea, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import type { LeadInput } from "@/lib/pol263";

type ExtraField =
  | { name: string; label: string; type: "text" | "tel" | "email"; required?: boolean; placeholder?: string }
  | { name: string; label: string; type: "textarea"; required?: boolean; placeholder?: string }
  | { name: string; label: string; type: "select"; required?: boolean; options: string[] };

export function LeadForm({
  source,
  title = "Request a callback",
  description,
  submitLabel = "Send",
  extraFields = [],
  contactKind,
}: {
  source: LeadInput["source"];
  title?: string;
  description?: string;
  submitLabel?: string;
  extraFields?: ExtraField[];
  contactKind?: "callback" | "message" | "bespoke";
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const fd = new FormData(e.currentTarget);
    const payload = {
      firstName: String(fd.get("firstName") || ""),
      lastName: String(fd.get("lastName") || ""),
      phone: String(fd.get("phone") || ""),
      email: String(fd.get("email") || "") || undefined,
      source,
      message: String(fd.get("message") || "") || undefined,
      context: Object.fromEntries(
        extraFields.map((f) => [f.name, String(fd.get(f.name) || "")]).filter(([, v]) => v),
      ),
    };
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      if (contactKind) track({ name: "contact_request", kind: contactKind });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-sage/30 bg-sage/8 p-6">
        <CheckCircle2 className="size-6 text-sage" />
        <h3 className="mt-3 text-lg">Thank you — we have your details.</h3>
        <p className="mt-1 text-sm text-stone">
          A member of our team will be in touch. If this is urgent, please call our care line.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-line bg-surface p-6">
      <h3 className="text-xl">{title}</h3>
      {description && <p className="mt-1 text-sm text-stone">{description}</p>}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="First name" required>
          <TextInput name="firstName" required autoComplete="given-name" />
        </Field>
        <Field label="Last name" required>
          <TextInput name="lastName" required autoComplete="family-name" />
        </Field>
        <Field label="Phone (with country code)" required hint="e.g. +263 77 000 0000 or +44 7000 000000">
          <TextInput name="phone" type="tel" required autoComplete="tel" inputMode="tel" />
        </Field>
        <Field label="Email" hint="Optional">
          <TextInput name="email" type="email" autoComplete="email" />
        </Field>

        {extraFields.map((f) => (
          <Field
            key={f.name}
            label={f.label}
            required={f.required}
            className={f.type === "textarea" ? "sm:col-span-2" : undefined}
          >
            {f.type === "textarea" ? (
              <TextArea name={f.name} required={f.required} placeholder={f.placeholder} />
            ) : f.type === "select" ? (
              <Select name={f.name} required={f.required} defaultValue="">
                <option value="" disabled>
                  Select…
                </option>
                {f.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </Select>
            ) : (
              <TextInput name={f.name} type={f.type} required={f.required} placeholder={f.placeholder} />
            )}
          </Field>
        ))}

        {!extraFields.some((f) => f.name === "message") && (
          <Field label="Anything you'd like us to know?" className="sm:col-span-2">
            <TextArea name="message" placeholder="Optional" />
          </Field>
        )}
      </div>

      {status === "error" && (
        <p className="mt-4 text-sm text-terracotta">
          Something went wrong sending your request. Please try again, or call us directly.
        </p>
      )}

      <p className="mt-4 text-xs text-mist">
        By submitting this form you agree to be contacted by Diaspora Funeral Services about your
        enquiry. See our{" "}
        <a href="/legal/privacy" className="underline">
          Privacy Policy
        </a>
        .
      </p>

      <Button type="submit" className="mt-4 w-full sm:w-auto" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : submitLabel}
      </Button>
    </form>
  );
}
