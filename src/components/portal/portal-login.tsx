"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Field, TextInput } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Turnstile, type TurnstileHandle } from "@/components/ui/turnstile";
import { portalPost, PortalError } from "@/lib/portal-client";

export function PortalLogin({ onSuccess }: { onSuccess: () => void }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");
    const fd = new FormData(e.currentTarget);
    try {
      await portalPost("login", {
        policyNumber: String(fd.get("policyNumber") ?? "").trim().toUpperCase(),
        password: fd.get("password"),
        turnstileToken,
      });
      onSuccess();
    } catch (e) {
      setStatus("error");
      turnstileRef.current?.reset();
      setTurnstileToken(null);
      setMessage(
        e instanceof PortalError && e.message !== "Request failed"
          ? e.message
          : "We couldn't sign you in. Check your policy number and password.",
      );
    }
  }

  return (
    <div>
      <h1 className="text-2xl">Sign in to your account</h1>
      <p className="mt-2 text-sm text-stone">
        Use your policy number and the password you set when you activated your account.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border border-line bg-surface p-6">
        <Field label="Policy number" required>
          <TextInput name="policyNumber" required autoComplete="username" placeholder="e.g. DFS-00042" />
        </Field>
        <Field label="Password" required>
          <TextInput name="password" type="password" required autoComplete="current-password" />
        </Field>
        <Turnstile ref={turnstileRef} onToken={setTurnstileToken} />
        {status === "error" && <p className="text-sm text-terracotta">{message}</p>}
        <Button type="submit" className="w-full" disabled={status === "submitting" || !turnstileToken}>
          {status === "submitting" ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="mt-4 space-y-1 text-sm">
        <p className="text-stone">
          First time here?{" "}
          <Link href="/account/enroll" className="font-medium text-champagne-deep hover:text-ink">
            Activate your account
          </Link>
        </p>
        <p className="text-stone">
          Not a customer yet?{" "}
          <Link href="/protect-my-family" className="font-medium text-champagne-deep hover:text-ink">
            Protect your family
          </Link>
        </p>
      </div>
    </div>
  );
}
