import type { Metadata } from "next";
import { LegalDocument } from "@/components/marketing/legal-document";

export const metadata: Metadata = { title: "Cookie Policy", robots: { index: false } };

export default function CookiesPage() {
  return (
    <LegalDocument
      title="Cookie Policy"
      intro="How this website uses cookies and similar technologies."
      updated="27 September 2026"
      sections={[
        {
          heading: "What cookies and local storage are",
          paragraphs: [
            "Cookies and browser storage are small pieces of information a website saves on your device. They let a site remember things between visits, such as a form you haven’t finished.",
          ],
        },
        {
          heading: "Essential storage we use",
          paragraphs: [
            "By default this website sets no analytics or marketing cookies. It uses your browser’s storage only for essentials:",
          ],
          list: [
            "remembering an unfinished quote, application or service selection on your device, so you don’t lose your progress;",
            "remembering whether a payment has been started, for the current browser tab only;",
            "remembering your cookie choice.",
          ],
        },
        {
          heading: "Analytics",
          paragraphs: [
            "If analytics is enabled, a banner asks you to accept or decline before any analytics provider (such as Google Analytics or Plausible) is loaded. Analytics helps us understand which pages are useful and where people get stuck. If you decline, no analytics is loaded and your choice is remembered.",
          ],
        },
        {
          heading: "Changing your choice",
          paragraphs: [
            "You can change your mind at any time by clearing this site’s data in your browser settings. The banner will then ask again on your next visit. Clearing site data also removes any unfinished quote or application saved on your device.",
          ],
        },
        {
          heading: "Changes to this policy",
          paragraphs: [
            "If we start using any other cookies, we will update this policy and, where required, ask for your consent first.",
          ],
        },
      ]}
    />
  );
}
