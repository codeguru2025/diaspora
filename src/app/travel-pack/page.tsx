import type { Metadata } from "next";
import Image from "next/image";
import { CampaignLanding } from "@/components/marketing/campaign-landing";
import { DFS_PRODUCT_PHOTOS } from "@/lib/service-photos";

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
      image={
        <Image
          src={DFS_PRODUCT_PHOTOS["individual-travel-pack"].src}
          alt="The DFS funeral travel pack: branded travel bag, water, wet wipes, toiletries, neck pillow, eye mask and essentials"
          width={DFS_PRODUCT_PHOTOS["individual-travel-pack"].width}
          height={DFS_PRODUCT_PHOTOS["individual-travel-pack"].height}
          className="aspect-[4/3] w-full rounded-3xl border border-ivory/20 object-cover shadow-[var(--shadow-raised)]"
        />
      }
    />
  );
}
