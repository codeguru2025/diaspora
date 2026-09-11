import type { Metadata } from "next";
import Image from "next/image";
import { CampaignLanding } from "@/components/marketing/campaign-landing";
import { CasketSlideshow } from "@/components/marketing/casket-slideshow";

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
      gallery={{
        eyebrow: "Our work",
        title: "Caskets we've made and dressed.",
        content: <CasketSlideshow />,
      }}
      image={
        <Image
          src="/images/caskets/custom-casket-showcase.jpg"
          alt="A custom-made casket with detailed gold hardware, crafted by DFS"
          width={810}
          height={1080}
          className="aspect-[4/5] w-full rounded-3xl border border-ivory/20 object-cover shadow-[var(--shadow-raised)]"
        />
      }
    />
  );
}
