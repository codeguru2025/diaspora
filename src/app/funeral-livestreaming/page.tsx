import type { Metadata } from "next";
import { CampaignLanding } from "@/components/marketing/campaign-landing";

export const metadata: Metadata = {
  title: "Funeral Livestreaming",
  description:
    "Private, reliable funeral livestreaming in Zimbabwe so family anywhere in the world can be present. From Diaspora Funeral Services.",
};

export default function FuneralLivestreamingPage() {
  return (
    <CampaignLanding
      eyebrow="Media & memories"
      title="Distance should never mean missing the farewell."
      intro="A private, reliable live broadcast of the service so family anywhere in the world can be there. A recording is provided afterwards."
      bullets={[
        "On-site crew and connectivity managed by DFS",
        "Private stream link shared only with the people you choose",
        "Recording provided after the service",
        "Works alongside photography, videography and a memorial video",
        "We tell you in advance if location connectivity is a risk",
      ]}
      serviceSlugs={["livestreaming", "photography", "videography", "memorial-video"]}
      primary={{ label: "Get a quote with livestreaming", href: "/get-a-quote" }}
      leadSource="speak_to_us"
      leadTitle="Enquire about livestreaming"
    />
  );
}
