import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/page-header";
import { Section, SectionHeading } from "@/components/ui/section";
import { PackageGrid } from "@/components/marketing/package-grid";
import { Steps, TrustStrip } from "@/components/marketing/sections";
import { Button } from "@/components/ui/button";
import { NeedsInput } from "@/components/ui/primitives";
import { cta } from "@/config/site";

export const metadata: Metadata = {
  title: "Protect My Family",
  description:
    "Set up funeral protection for your family with Diaspora Funeral Services. Choose a package, personalise it, and join online in minutes — from anywhere in the world.",
};

export default async function ProtectMyFamilyPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string }>;
}) {
  const { package: pkg } = await searchParams;
  const quoteHref = pkg ? `/get-a-quote?package=${pkg}` : cta.quote.href;

  return (
    <>
      <PageHeader
        eyebrow="Protect my family"
        title="Protect the people who matter to you."
        intro="Not because something might happen — but because your family should never have to worry about how a farewell will be handled, or paid for. Set up protection in minutes."
      >
        <div className="flex flex-wrap gap-3">
          <Button href={pkg ? `/join?package=${pkg}` : "/join"}>Start my application</Button>
          <Button href={quoteHref} variant="secondary">
            Start with a quote
          </Button>
          <Button href={cta.consultant.href} variant="ghost">
            {cta.consultant.label}
          </Button>
        </div>
      </PageHeader>

      <Section tone="ivory">
        <SectionHeading eyebrow="Step 1" title="Choose your protection" />
        <div className="mt-10">
          <PackageGrid />
        </div>
        <div className="mt-8">
          <Button href="/join">Continue to my application</Button>
        </div>
      </Section>

      <Steps tone="cream" />

      <Section tone="ivory">
        <div className="dfs-card rounded-[4px] p-8">
          <SectionHeading
            eyebrow="Joining online"
            title="What happens when you join"
            intro="The application walks you through it — Package, Family, Location, Personalise, Review, Account, Payment, Confirmation."
          />
          <ol className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Choose your package and personalise it with any services you want",
              "Add the family members you're protecting",
              "Tell us where you live and where your family is",
              "Review your protection and see your premium",
              "Create your account",
              "Pay securely with the methods available in your country",
              "Receive confirmation — by SMS and in your portal",
              "Your policy is activated and administered on POL263",
            ].map((s, i) => (
              <li key={i} className="flex gap-3 rounded-xl bg-cream px-4 py-3 text-sm text-charcoal">
                <span className="font-semibold text-champagne-deep">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-mist">
            Account creation, policy issuance, beneficiaries, premiums and payment are handled by
            POL263. Waiting periods, eligibility and policy terms are{" "}
            <NeedsInput>configured in POL263 and confirmed by DFS</NeedsInput>. When the DFS tenant
            is connected, the application creates your policy and account directly and premiums are
            paid online via PayNow; until then it is captured for a Funeral Care Consultant to
            complete with you.
          </p>
        </div>
      </Section>

      <TrustStrip />
    </>
  );
}
