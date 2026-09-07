import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/marketing/legal-placeholder";

export const metadata: Metadata = { title: "Privacy Policy", robots: { index: false } };

export default function PrivacyPage() {
  return (
    <LegalPlaceholder
      title="Privacy Policy"
      intro="How Diaspora Funeral Services collects, uses, stores and protects your personal information."
      sections={[
        "What information we collect (enquiry, application, policy and payment data)",
        "How we use your information",
        "Consent and how to withdraw it",
        "Who we share information with (including the POL263 platform as our administration provider)",
        "How we communicate with you (SMS, email, phone) and how to change your preferences",
        "How long we keep your information (data retention)",
        "How we protect your information",
        "Your rights over your information",
        "Cookies and website analytics",
        "International transfers (relevant for diaspora customers)",
        "How to contact us about privacy",
      ]}
      disclaimers={[
        "Customer, policy, payment and communication records are held in the POL263 platform, which is the source of truth for those records.",
        "This website captures enquiry details and passes them to DFS; it does not hold a separate copy of your policy or payment history.",
      ]}
    />
  );
}
