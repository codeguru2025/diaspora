import type { Metadata } from "next";
import { CampaignLanding } from "@/components/marketing/campaign-landing";

export const metadata: Metadata = {
  title: "Free Will-Writing Service",
  description:
    "Guided assistance to prepare a will, included free with every Diaspora Funeral Services policy. This service assists with will preparation and does not replace independent legal advice where required.",
};

export default function WillWritingPage() {
  return (
    <CampaignLanding
      eyebrow="Family support"
      title="Protecting your family includes what happens to your estate."
      intro="Guided assistance to help you prepare a will — included free with every DFS policy. This service assists with will preparation and does not replace independent legal advice where that is required."
      bullets={[
        "Guided will preparation, step by step",
        "Document template and support",
        "Guidance on your next steps",
        "Included with every DFS package at no extra cost",
        "We'll tell you when independent legal advice is important",
      ]}
      serviceSlugs={["will-writing", "post-funeral-support", "grief-counselling"]}
      primary={{ label: "Protect My Family", href: "/protect-my-family" }}
      leadSource="speak_to_us"
      leadTitle="Ask about the will-writing service"
    />
  );
}
