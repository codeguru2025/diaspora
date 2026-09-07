import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/marketing/legal-placeholder";

export const metadata: Metadata = { title: "Cookie Policy", robots: { index: false } };

export default function CookiesPage() {
  return (
    <LegalPlaceholder
      title="Cookie Policy"
      intro="How this website uses cookies and similar technologies."
      sections={[
        "What cookies are",
        "Essential cookies we use",
        "Analytics and performance cookies",
        "How to manage cookies in your browser",
        "Changes to this policy",
      ]}
      disclaimers={[
        "This site currently uses only local browser storage to remember an in-progress quote on your device. No analytics or marketing cookies are set until an analytics provider is configured and a consent banner is added.",
      ]}
    />
  );
}
