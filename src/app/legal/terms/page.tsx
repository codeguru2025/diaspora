import type { Metadata } from "next";
import { LegalDocument } from "@/components/marketing/legal-document";

export const metadata: Metadata = { title: "Terms & Conditions", robots: { index: false } };

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms & Conditions"
      intro="The terms governing your use of this website and the services provided by Diaspora Funeral Services."
      updated="27 September 2026"
      sections={[
        {
          heading: "Who we are",
          paragraphs: [
            "This website is operated by Thobela Diaspora Logistics, trading as Diaspora Funeral Services (“DFS”, “we”, “us”), of 312 Mership House, Bulawayo, Zimbabwe. DFS provides funeral protection policies and funeral services for families in Zimbabwe, including families whose policyholder lives abroad. Our contact details are on the Contact page.",
            "By using this website, requesting a quote, applying for a policy or buying a service, you agree to these terms.",
          ],
        },
        {
          heading: "Use of this website",
          paragraphs: [
            "You may use this website to learn about our packages and services, get a quote, apply for a policy, pay premiums, arrange a funeral and contact us. You must not misuse the website, attempt to access other people’s information, or submit information you know to be false.",
            "We work to keep the website accurate and available, but information on it is general. It does not replace your policy documents or advice from a Funeral Care Consultant about your circumstances.",
          ],
        },
        {
          heading: "Funeral policy terms",
          paragraphs: [
            "Each package (Essential, Classic, Prestige and Bespoke) provides a defined level of funeral cover and service. Your policy documents set out the full cover, benefits, exclusions and conditions, and they take precedence over anything on this website.",
            "In summary, and subject to your policy documents:",
          ],
          list: [
            "The main member and any adult on the policy must be aged 18 to 70 when they join. Children are covered up to age 20.",
            "A policy covers up to 2 adults and up to 4 children.",
            "Cover for death from natural causes starts after a 90-day waiting period. Accidental death is covered from the start of cover.",
            "You have a 30-day grace period for a missed premium. If it remains unpaid, the policy lapses. Reinstatement requires payment of arrears, and a new waiting period applies.",
          ],
        },
        {
          heading: "Claims and funeral fulfilment",
          paragraphs: [
            "When a covered person dies, contact us as soon as possible. We will ask for the policy number, a copy of the deceased’s ID and the death certificate or burial order, and any other documents reasonably required.",
            "DFS provides the funeral services included in your package, and any add-on services you have chosen, subject to availability at the location and any restrictions set out in your policy documents. Where an item is unavailable, we will offer a comparable alternative.",
          ],
        },
        {
          heading: "Payments",
          paragraphs: [
            "Premiums are payable monthly in the currency shown on your quote or policy. You can pay using the methods offered at checkout, which may include mobile money (such as EcoCash, OneMoney or InnBucks) and card payments processed by our payment provider. We do not store your full card details.",
            "Quotes shown on this website are estimates until your policy is issued. Premiums depend on the package and the ages of the people covered.",
          ],
        },
        {
          heading: "Add-on services and bespoke quotations",
          paragraphs: [
            "Add-on services are priced as shown for each service: some adjust your monthly premium, some are one-time fees, and some are priced per person, per item or by quotation. Bespoke and custom items are provided under a written quotation, which sets out what is included, the price and the timing.",
          ],
        },
        {
          heading: "Cancellation",
          paragraphs: [
            "You may cancel your policy at any time by contacting us. Before we process a cancellation, we will explain what it means for your cover and for anyone else on the policy. Cover ends at the end of the period for which premiums have been paid, unless your policy documents state otherwise.",
            "Custom-made items that have already been ordered or produced for a funeral may not be refundable.",
          ],
        },
        {
          heading: "Changes to packages, services and pricing",
          paragraphs: [
            "We may update our packages, services and premiums from time to time. If a change affects your existing policy, we will give you reasonable notice before it takes effect. You may change package on request; when you upgrade, the additional cover may be subject to its own waiting period.",
          ],
        },
        {
          heading: "Will writing and grief support",
          paragraphs: [
            "The will-writing service provides guided will-preparation assistance. It does not replace independent legal advice where that is required, for example for complex estates or property in more than one country.",
            "Online grief support is general emotional support. It is not clinical, medical or psychiatric care, and we will refer you to other services where that is needed.",
          ],
        },
        {
          heading: "Liability",
          paragraphs: [
            "We will provide our services with reasonable care and skill. We are not responsible for delays or failures caused by events outside our reasonable control, such as severe weather, road closures, power or network outages affecting livestreaming, or actions of public authorities. Nothing in these terms limits any liability that cannot be limited by law.",
          ],
        },
        {
          heading: "Complaints",
          paragraphs: [
            "If you are unhappy with any part of our service, please tell us by phone, WhatsApp or email. We will acknowledge your complaint promptly, investigate it and respond in writing. If you remain dissatisfied, you may refer the matter to the relevant regulator or seek independent advice.",
          ],
        },
        {
          heading: "Governing law",
          paragraphs: [
            "These terms are governed by the laws of Zimbabwe, and the courts of Zimbabwe have jurisdiction over any dispute, without affecting any rights you have under the laws of the country where you live.",
          ],
        },
      ]}
    />
  );
}
