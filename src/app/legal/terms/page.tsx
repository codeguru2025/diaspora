import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/marketing/legal-placeholder";

export const metadata: Metadata = { title: "Terms & Conditions", robots: { index: false } };

export default function TermsPage() {
  return (
    <LegalPlaceholder
      title="Terms & Conditions"
      intro="The terms governing your use of this website and the services provided by Diaspora Funeral Services."
      sections={[
        "Who we are and how to contact us",
        "Use of this website",
        "Funeral policy terms (cover, eligibility, waiting periods, exclusions)",
        "Claims terms and the funeral fulfilment process",
        "Payment terms and premium collection",
        "Add-on services and bespoke quotations",
        "Cancellation and refund terms",
        "Changes to packages, services and pricing",
        "Liability",
        "Complaints and dispute resolution",
        "Governing law",
      ]}
      disclaimers={[
        "Policy terms, benefit amounts, waiting periods and exclusions are set out in the DFS funeral policy documentation, administered on POL263.",
        "The free will-writing service assists with will preparation and does not replace independent legal advice where that is required.",
        "Grief support is general support and is distinct from clinical or medical care.",
      ]}
    />
  );
}
