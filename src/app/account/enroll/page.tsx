"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/marketing/page-header";
import { Field, TextInput, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { portalPost, PortalError } from "@/lib/portal-client";

type SecurityQuestion = { id: string; question: string };

function EnrollBody() {
  const router = useRouter();
  const params = useSearchParams();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [clientId, setClientId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [questions, setQuestions] = useState<SecurityQuestion[]>([]);

  async function verify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const data = await portalPost<{
        clientId: string;
        firstName: string;
        securityQuestions: SecurityQuestion[];
      }>("claim", {
        policyNumber: fd.get("policyNumber"),
        activationCode: fd.get("activationCode"),
      });
      setClientId(data.clientId);
      setFirstName(data.firstName);
      setQuestions(data.securityQuestions ?? []);
      setStep(1);
    } catch (err) {
      setError(
        err instanceof PortalError && err.kind === "unconfigured"
          ? "Account activation isn't connected yet. Your consultant can activate your account for you."
          : "That activation code or policy number didn't match. Please check and try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function enroll(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("password") !== fd.get("confirm")) {
      setError("The two passwords don't match.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await portalPost("enroll", {
        clientId,
        password: fd.get("password"),
        securityQuestionId: fd.get("securityQuestionId"),
        securityAnswer: fd.get("securityAnswer"),
      });
      setStep(2);
      setTimeout(() => router.push("/account"), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (step === 2) {
    return (
      <div className="rounded-2xl border border-sage/30 bg-sage/8 p-8 text-center">
        <CheckCircle2 className="mx-auto size-8 text-sage" />
        <h2 className="mt-3 text-2xl">Your account is active.</h2>
        <p className="mt-2 text-stone">Taking you to sign in…</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
      {step === 0 && (
        <form onSubmit={verify}>
          <h2 className="text-xl">Activate your account</h2>
          <p className="mt-1 text-sm text-stone">
            Enter your policy number and the activation code we sent you.
          </p>
          <div className="mt-5 space-y-4">
            <Field label="Policy number" required>
              <TextInput
                name="policyNumber"
                required
                defaultValue={params.get("policy") ?? ""}
                placeholder="e.g. DFS-00042"
              />
            </Field>
            <Field label="Activation code" required>
              <TextInput name="activationCode" required defaultValue={params.get("code") ?? ""} />
            </Field>
          </div>
          {error && <p className="mt-3 text-sm text-terracotta">{error}</p>}
          <Button type="submit" className="mt-5 w-full" disabled={busy}>
            {busy ? "Checking…" : "Continue"}
          </Button>
        </form>
      )}

      {step === 1 && (
        <form onSubmit={enroll}>
          <h2 className="text-xl">Welcome, {firstName}. Set your password.</h2>
          <div className="mt-5 space-y-4">
            <Field label="New password" required hint="At least 8 characters">
              <TextInput name="password" type="password" required minLength={8} autoComplete="new-password" />
            </Field>
            <Field label="Confirm password" required>
              <TextInput name="confirm" type="password" required autoComplete="new-password" />
            </Field>
            <Field label="Security question" required>
              <Select name="securityQuestionId" required defaultValue="">
                <option value="" disabled>
                  Choose a question…
                </option>
                {questions.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.question}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Your answer" required>
              <TextInput name="securityAnswer" required />
            </Field>
          </div>
          {error && <p className="mt-3 text-sm text-terracotta">{error}</p>}
          <Button type="submit" className="mt-5 w-full" disabled={busy}>
            {busy ? "Activating…" : "Activate my account"}
          </Button>
        </form>
      )}
    </div>
  );
}

export default function EnrollPage() {
  return (
    <>
      <PageHeader
        eyebrow="Account activation"
        title="Set up your online account."
        intro="One-time activation using your policy number and activation code."
      />
      <section className="bg-void py-12">
        <Container className="max-w-md">
          <Suspense fallback={<Loader2 className="size-5 animate-spin text-stone" />}>
            <EnrollBody />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
