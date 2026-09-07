import type { Metadata } from "next";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { NeedsInput } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "My Account",
  description:
    "Sign in to your Diaspora Funeral Services customer portal to manage your policy, family members, payments, documents and notifications.",
  robots: { index: false, follow: true },
};

const PORTAL_URL = process.env.NEXT_PUBLIC_POL263_PORTAL_URL || "";

export default function AccountPage() {
  return (
    <>
      <PageHeader
        eyebrow="My account"
        title="Manage your protection online."
        intro="Your customer portal is where you see your policy status, covered family members, payments, documents and important notifications — and where you notify us if a funeral is needed."
      >
        <div className="flex flex-wrap gap-3">
          {PORTAL_URL ? (
            <Button href={PORTAL_URL}>
              Sign in to the customer portal <ArrowUpRight className="size-4" />
            </Button>
          ) : (
            <Button href="/contact" variant="secondary">
              Portal sign-in — link pending
            </Button>
          )}
          <Button href="/arrange-a-funeral" variant="urgent">
            Notify us of a death
          </Button>
        </div>
        {!PORTAL_URL && (
          <p className="mt-3 text-sm text-mist">
            <NeedsInput>
              Set NEXT_PUBLIC_POL263_PORTAL_URL to the DFS tenant client-portal URL
            </NeedsInput>{" "}
            (the POL263 <code>/client</code> portal on the DFS domain).
          </p>
        )}
      </PageHeader>

      <Section tone="ivory">
        <SectionHeading
          eyebrow="In your portal"
          title="Everything about your cover, in one place."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Your protection", "Active package, policy status, next premium and payment status."],
            ["Your family", "The family members covered on your policy."],
            ["Your services", "The benefits and add-on services you've selected."],
            ["Documents", "Policy documents, statements, receipts and certificates."],
            ["Payments", "Payment history, outstanding amounts, receipts and payment method."],
            ["Communication", "Important notifications and updates."],
            ["Notify us of a death", "Tell us when your family needs us — we take over from there."],
            ["Speak to your consultant", "Prestige and Bespoke customers: reach your dedicated consultant."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-line bg-surface p-5">
              <ShieldCheck className="size-5 text-champagne-deep" />
              <p className="mt-2 font-semibold text-ink">{t}</p>
              <p className="mt-1 text-sm text-stone">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-mist">
          The customer portal, authentication, policy data, payments and notifications are provided
          by the POL263 platform — the source of truth for your policy. This website does not store a
          separate copy of your policy or payment records.
        </p>
      </Section>
    </>
  );
}
