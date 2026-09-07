import type { Metadata } from "next";
import { CampaignLanding } from "@/components/marketing/campaign-landing";

export const metadata: Metadata = {
  title: "Custom Caskets",
  description:
    "Custom-made caskets in Zimbabwe, designed to your specification. Part of the Diaspora Funeral Services personalisation marketplace.",
};

export default function CustomCasketsPage() {
  return (
    <CampaignLanding
      eyebrow="Personalisation"
      title="A casket made for them — not off a shelf."
      intro="For families who want the centrepiece of the farewell to reflect the person it honours. Designed with our team, built to your specification."
      bullets={[
        "Design consultation with our team",
        "Choice of materials, finishes and detailing",
        "Personalisation and engraving options",
        "Matching grave marker and personalised items available",
        "Prepared and delivered by DFS",
      ]}
      serviceSlugs={["custom-casket", "custom-grave-marker", "custom-coffin-lace", "floral-arrangement"]}
      primary={{ label: "Request a bespoke quotation", href: "/contact?topic=bespoke" }}
      leadSource="bespoke_request"
      leadTitle="Enquire about a custom casket"
    />
  );
}
