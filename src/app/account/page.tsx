"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { PortalLogin } from "@/components/portal/portal-login";
import { usePortalSession } from "@/lib/portal-client";

export default function AccountPage() {
  const router = useRouter();
  const { status, refresh } = usePortalSession();

  useEffect(() => {
    if (status.state === "signed-in") router.replace("/account/dashboard");
  }, [status.state, router]);

  return (
    <>
      <section className="border-b border-line bg-cream">
        <Container className="grid gap-10 py-14 md:py-16 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-champagne-deep">
              My account
            </p>
            <h1 className="text-[2.25rem] leading-[1.08] md:text-4xl">
              Manage your protection online.
            </h1>
            <p className="mt-4 max-w-md text-stone">
              See your policy status, covered family, payments, documents and notifications — and
              notify us if a funeral is needed.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/arrange-a-funeral" variant="urgent">
                Notify us of a death
              </Button>
            </div>
          </div>

          <div>
            {status.state === "loading" ? (
              <div className="flex min-h-40 items-center justify-center rounded-2xl border border-line bg-surface">
                <Loader2 className="size-5 animate-spin text-stone" />
              </div>
            ) : status.state === "unconfigured" ? (
              <div className="rounded-2xl border border-line bg-surface p-6">
                <h2 className="text-lg">Sign-in is connecting soon</h2>
                <p className="mt-2 text-sm text-stone">
                  Your policy is administered on the POL263 platform. Online sign-in for the DFS site
                  goes live once the connection is complete. Your Funeral Care Consultant can help in
                  the meantime.
                </p>
                <Button href="/contact" variant="secondary" className="mt-4">
                  Contact us
                </Button>
              </div>
            ) : status.state === "signed-in" ? (
              <div className="flex min-h-40 items-center justify-center rounded-2xl border border-line bg-surface">
                <Loader2 className="size-5 animate-spin text-stone" />
              </div>
            ) : (
              <PortalLogin onSuccess={refresh} />
            )}
          </div>
        </Container>
      </section>

      <Section tone="ivory">
        <SectionHeading eyebrow="In your portal" title="Everything about your cover, in one place." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Your protection", "Active package, policy status, next premium and payment status."],
            ["Your family", "The family members covered on your policy."],
            ["Payments", "Payment history, receipts, and pay a premium online."],
            ["Documents", "Policy documents, statements and receipts."],
            ["Notifications", "Important updates about your policy and any funeral."],
            ["Notify us of a death", "Tell us when your family needs us — we take over from there."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-line bg-surface p-5">
              <ShieldCheck className="size-5 text-champagne-deep" />
              <p className="mt-2 font-semibold text-ink">{t}</p>
              <p className="mt-1 text-sm text-stone">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-mist">
          The portal, authentication, policy data, payments and notifications are provided by the
          POL263 platform — the source of truth for your policy. This website stores no separate copy.
        </p>
      </Section>
    </>
  );
}
