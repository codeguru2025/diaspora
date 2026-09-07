import type { Metadata } from "next";
import { CampaignLanding } from "@/components/marketing/campaign-landing";

export const metadata: Metadata = {
  title: "Travel Packs",
  description:
    "Coming home for a funeral? Diaspora Funeral Services individual and family travelling packs take care of the practical details.",
};

export default function TravelPackPage() {
  return (
    <CampaignLanding
      eyebrow="Travel"
      title="Coming home for the funeral? We've thought of the details."
      intro="You're booking flights and grieving at the same time. Our individual and family travelling packs handle the practical things so you don't have to."
      bullets={[
        "Individual travelling pack for one family member",
        "Family travelling pack for a group travelling together",
        "Configurable contents — essentials, personal care, funeral-related items",
        "Finalised with you before you travel",
        "Travel and attendance assistance available alongside",
      ]}
      serviceSlugs={["individual-travel-pack", "family-travel-pack", "travel-assistance", "memorial-programme"]}
      primary={{ label: "Add a travel pack to your quote", href: "/get-a-quote" }}
      leadSource="speak_to_us"
      leadTitle="Enquire about travelling packs"
    />
  );
}
