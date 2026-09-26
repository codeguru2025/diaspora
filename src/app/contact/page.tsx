import type { Metadata } from "next";
import { Phone, Mail, MessageCircle, MapPin, Clock } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Section, SectionHeading } from "@/components/ui/section";
import { LeadForm } from "@/components/forms/lead-form";
import { NeedsInput } from "@/components/ui/primitives";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Speak to a Funeral Care Consultant at Diaspora Funeral Services. Call, WhatsApp, email or request a callback.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  const isBespoke = topic === "bespoke";

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={isBespoke ? "Tell us what you have in mind." : "Speak to a Funeral Care Consultant."}
        intro={
          isBespoke
            ? "Our Bespoke service exists for the things that aren't on a list. Describe what you want and we'll prepare a plan and a quotation."
            : "Whether you're planning ahead, comparing packages, or you need help now — a real person is here to talk it through."
        }
      />

      <Section tone="ivory">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <SectionHeading title="Ways to reach us" />
            <ul className="mt-6 space-y-4">
              <Channel icon={Phone} label="General enquiries" value={site.contact.phoneDisplay} href={site.contact.phoneHref} />
              <Channel icon={Phone} label="If you need help now (care line)" value={site.contact.atNeedPhoneDisplay} href={site.contact.atNeedPhoneHref} />
              <Channel icon={MessageCircle} label="WhatsApp" value={site.contact.whatsappDisplay} href={site.contact.whatsappHref} />
              <Channel icon={Mail} label="Email" value={site.contact.email} href={`mailto:${site.contact.email}`} />
            </ul>

            <div className="mt-8 space-y-2 text-sm text-stone">
              <p className="flex items-center gap-2">
                <MapPin className="size-4" /> <NeedsInput>{site.contact.officeAddress}</NeedsInput>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="size-4" /> <NeedsInput>{site.contact.officeHours}</NeedsInput>
              </p>
            </div>

            <p className="mt-6 rounded-xl bg-cream p-4 text-sm text-stone">
              Prestige and Bespoke customers have a dedicated Funeral Care Consultant. Every customer
              can request a callback, and every family matters.
            </p>
          </div>

          <div id="callback">
            <LeadForm
              source={isBespoke ? "bespoke_request" : "callback"}
              title={isBespoke ? "Request a bespoke service" : "Request a callback"}
              description={
                isBespoke
                  ? "The more detail you give, the faster we can come back with a plan."
                  : "Leave your details and we'll call you at a time that works."
              }
              submitLabel={isBespoke ? "Send my request" : "Request my callback"}
              contactKind={isBespoke ? "bespoke" : "callback"}
              extraFields={
                isBespoke
                  ? [
                      {
                        name: "message",
                        label: "What would you like us to arrange?",
                        type: "textarea",
                        required: true,
                        placeholder: "Describe the service, item or experience you have in mind.",
                      },
                    ]
                  : [
                      {
                        name: "topic",
                        label: "What's it about?",
                        type: "select",
                        options: [
                          "Choosing a package",
                          "Getting a quote",
                          "Joining / my application",
                          "An existing policy",
                          "Personalised services",
                          "For the diaspora",
                          "Something else",
                        ],
                      },
                    ]
              }
            />
          </div>
        </div>
      </Section>
    </>
  );
}

function Channel({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <li>
      <a href={href} className="flex items-start gap-3 dfs-card rounded-[4px] p-4 hover:border-ink/30">
        <Icon className="mt-0.5 size-5 text-champagne-deep" />
        <span>
          <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-stone">
            {label}
          </span>
          <span className="block text-ink">{value}</span>
        </span>
      </a>
    </li>
  );
}
