import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/marketing/legal-placeholder";

export const metadata: Metadata = { title: "Policy Information", robots: { index: false } };

export default function PolicyInformationPage() {
  return (
    <LegalPlaceholder
      title="Policy Information"
      intro="Key information about DFS funeral policies — the plain-language summary, alongside the full policy documentation."
      sections={[
        "What each package covers and does not cover",
        "Eligibility and who can be covered",
        "Waiting periods (standard, accidental, and any exclusions)",
        "Grace periods and what happens if a payment is missed",
        "How claims and funeral fulfilment work",
        "Beneficiary and family member changes",
        "Premium reviews and package changes",
        "Cancellation and reinstatement",
        "Regulatory information and how to complain",
      ]}
      disclaimers={[
        "All figures, periods and rules in this section are configured in POL263 and must be confirmed by DFS. Nothing on this website overrides the signed policy documentation.",
      ]}
    />
  );
}
