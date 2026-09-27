import type { Metadata } from "next";
import { LegalDocument } from "@/components/marketing/legal-document";

export const metadata: Metadata = { title: "Privacy Policy", robots: { index: false } };

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      intro="How Diaspora Funeral Services collects, uses, stores and protects your personal information."
      updated="27 September 2026"
      sections={[
        {
          heading: "Who we are",
          paragraphs: [
            "Thobela Diaspora Logistics, trading as Diaspora Funeral Services (“DFS”, “we”), of 312 Mership House, Bulawayo, Zimbabwe, is responsible for the personal information described in this policy. We handle it in line with applicable data protection law, including Zimbabwe’s Cyber and Data Protection Act and, where it applies to customers abroad, the data protection laws of the country where you live.",
          ],
        },
        {
          heading: "What information we collect",
          paragraphs: ["Depending on how you use our services, we collect:"],
          list: [
            "Contact details — your name, phone number, WhatsApp number, email address and country.",
            "Application and policy details — the details of the people you cover, including names, dates of birth, national ID numbers and relationships.",
            "Payment details — premium amounts, payment references and the payment method used. Card details are handled by our payment provider; we do not store full card numbers.",
            "Funeral arrangement details — information about the deceased, the family’s wishes and the documents needed to arrange the funeral.",
            "Messages you send us through forms, phone, WhatsApp or email.",
          ],
        },
        {
          heading: "How we use your information",
          paragraphs: ["We use your information to:"],
          list: [
            "prepare quotes, process applications and administer your policy;",
            "collect premiums and issue receipts;",
            "arrange and deliver funerals and the services you have chosen;",
            "keep you updated by SMS, WhatsApp, email or phone;",
            "respond to enquiries and complaints;",
            "meet our legal and regulatory obligations and prevent fraud.",
          ],
        },
        {
          heading: "Consent and your choices",
          paragraphs: [
            "Where we rely on your consent, for example for optional analytics on this website, you can withdraw it at any time. You can also ask us to stop sending you non-essential messages. Service messages about your policy or an active funeral arrangement will still be sent while they are needed.",
          ],
        },
        {
          heading: "Who we share information with",
          paragraphs: [
            "We share information only as needed to provide our services:",
          ],
          list: [
            "POL263, the platform that administers our policies, payments and customer communications, and holds those records on our behalf.",
            "Payment providers that process your premiums.",
            "Suppliers who deliver parts of a funeral (for example caskets, catering, décor or livestreaming), who receive only the details they need.",
            "Authorities, where the law requires it.",
          ],
        },
        {
          heading: "International transfers",
          paragraphs: [
            "Many of our customers live outside Zimbabwe, so your information may be transferred between Zimbabwe and the country where you live, and processed by service providers in other countries. When this happens, we take steps to make sure it remains protected.",
          ],
        },
        {
          heading: "How long we keep your information",
          paragraphs: [
            "We keep policy and payment records for as long as your policy is active and afterwards for the period required by law and to deal with any claims or queries. Enquiries that do not lead to a policy are kept only as long as needed to respond to them and follow up.",
          ],
        },
        {
          heading: "How we protect your information",
          paragraphs: [
            "Information is sent over encrypted connections, access is limited to people who need it to do their job, and our systems are protected against misuse. No system is perfectly secure, but we take reasonable steps to protect your information and to respond quickly if something goes wrong.",
          ],
        },
        {
          heading: "Your rights",
          paragraphs: [
            "You can ask to see the information we hold about you, ask us to correct it, ask us to delete it where we are not required to keep it, or object to how we use it. To make a request, contact us using the details below. We may need to confirm your identity first.",
          ],
        },
        {
          heading: "Cookies and website analytics",
          paragraphs: [
            "This website uses only essential browser storage by default. Analytics is used only if you accept it. See our Cookie Policy for details.",
          ],
        },
        {
          heading: "Changes to this policy",
          paragraphs: [
            "We may update this policy from time to time. The date at the top shows when it last changed.",
          ],
        },
      ]}
    />
  );
}
