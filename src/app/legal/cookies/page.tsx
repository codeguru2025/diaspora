import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/marketing/legal-placeholder";

export const metadata: Metadata = { title: "Cookie Policy", robots: { index: false } };

export default function CookiesPage() {
  return (
    <LegalPlaceholder
      title="Cookie Policy"
      intro="How this website uses cookies and similar technologies."
      sections={[
        "What cookies and local storage are",
        "Essential local storage we use (in-progress quote/application, your consent choice)",
        "Analytics — only after you accept, and what each provider stores",
        "How to change your choice or clear stored data",
        "Changes to this policy",
      ]}
      disclaimers={[
        "By default this site sets no analytics or marketing cookies. It uses your browser's local storage only for essentials: remembering an unfinished quote or application on your device, and remembering your cookie choice.",
        "If analytics is enabled, a banner asks you to accept or decline before any analytics provider (e.g. Google Analytics or Plausible) is loaded. Declining is respected and remembered. You can change your mind by clearing this site's data in your browser.",
      ]}
    />
  );
}
