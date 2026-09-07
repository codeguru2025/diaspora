import type { Metadata } from "next";
import { CampaignLanding } from "@/components/marketing/campaign-landing";

export const metadata: Metadata = {
  title: "Grief Support",
  description:
    "Confidential online grief support for the whole family, including those abroad. General grief support from Diaspora Funeral Services — distinct from clinical or medical care.",
};

export default function GriefSupportPage() {
  return (
    <CampaignLanding
      eyebrow="Family support"
      title="Caring doesn't end at the graveside."
      intro="Confidential online grief support sessions for family members — including those who could not travel. This is general grief support and is distinct from clinical or medical care; we refer you on where that is needed."
      bullets={[
        "Confidential online sessions",
        "Available to multiple family members, wherever they are",
        "Post-funeral follow-up and practical guidance",
        "Referral guidance where professional clinical care is needed",
        "Included with selected packages; available as an add-on otherwise",
      ]}
      serviceSlugs={["grief-counselling", "post-funeral-support", "family-hospitality"]}
      primary={{ label: "Speak to a consultant", href: "/contact" }}
      leadSource="speak_to_us"
      leadTitle="Ask about grief support"
    />
  );
}
