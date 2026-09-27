import type { Metadata } from "next";
import { LegalDocument } from "@/components/marketing/legal-document";

export const metadata: Metadata = { title: "Policy Information", robots: { index: false } };

/** Figures mirror the DFS product rules configured in POL263 — see src/config/faqs.ts. */
export default function PolicyInformationPage() {
  return (
    <LegalDocument
      title="Policy Information"
      intro="A plain-language summary of how DFS funeral policies work. Your policy documents contain the full terms and take precedence over this summary."
      updated="27 September 2026"
      sections={[
        {
          heading: "What each package covers",
          paragraphs: [
            "Every package provides funeral cover and a funeral delivered by DFS. The packages differ in the level of service, choice and personalisation:",
          ],
          list: [
            "Essential — US$1,000 cover. Dignified coffin and hearse, burial coordination and digital updates.",
            "Classic — US$2,500 cover. Everything in Essential, with enhanced casket and ceremony options and venue support.",
            "Prestige — US$5,000 cover. Everything in Classic, with a premium casket, floral arrangements, memorial items and a dedicated Funeral Care consultant.",
            "Bespoke — US$10,000 cover. A fully personalised funeral with end-to-end coordination.",
          ],
        },
        {
          heading: "Who can be covered",
          paragraphs: [
            "A policy covers the main member, their spouse or partner, and their children: up to 2 adults and up to 4 children. Adults must be aged 18 to 70 when they join. Children are covered up to age 20. Extended family members are not covered on the current packages.",
          ],
        },
        {
          heading: "Waiting periods",
          paragraphs: [
            "Cover for death from natural causes starts after a 90-day waiting period from the start of the policy. Accidental death is covered from the start of cover.",
          ],
        },
        {
          heading: "Grace periods and missed payments",
          paragraphs: [
            "If a premium is missed, you have a 30-day grace period to pay it, and your cover continues during that time. If it is still unpaid after 30 days, the policy lapses. To reinstate a lapsed policy, you pay the outstanding arrears and a new waiting period applies.",
          ],
        },
        {
          heading: "How claims and funeral fulfilment work",
          paragraphs: [
            "Contact us as soon as a covered person dies. A Funeral Care Consultant takes over the arrangements, agrees the schedule with the family and coordinates the services in your package and any add-ons. We will ask for the policy number, a copy of the deceased’s ID and the death certificate or burial order.",
          ],
        },
        {
          heading: "Changes to family members",
          paragraphs: [
            "You can ask to add or remove family members through your customer portal or your Funeral Care Consultant. Changes are reviewed before they take effect, and new members are subject to the eligibility rules and waiting period.",
          ],
        },
        {
          heading: "Premiums and package changes",
          paragraphs: [
            "Premiums depend on the package and the ages of the people covered, and are shown on your quote before you join. You can ask to upgrade or downgrade. We will show you the new premium first. When you upgrade, the additional cover may be subject to its own waiting period.",
          ],
        },
        {
          heading: "Cancellation and reinstatement",
          paragraphs: [
            "You can cancel at any time by contacting us. A lapsed policy can be reinstated by paying the arrears, subject to a new waiting period.",
          ],
        },
        {
          heading: "Complaints",
          paragraphs: [
            "If something isn’t right, contact us by phone, WhatsApp or email. We will acknowledge your complaint, investigate it and respond in writing.",
          ],
        },
      ]}
    />
  );
}
