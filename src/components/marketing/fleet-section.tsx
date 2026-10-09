import Image from "next/image";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { FLEET_PHOTOS } from "@/lib/service-photos";
import { cta } from "@/config/site";

/**
 * The DFS fleet (real photographs) and the DFS promo film. The film loads only when played
 * (preload="none") — it is about 16 MB.
 */
export function FleetSection() {
  return (
    <Section tone="ink" id="fleet">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <SectionHeading
          eyebrow="Our fleet"
          title="Arriving with the dignity they deserve."
          intro="Our own glass hearse and matching family vehicles, each driven by a DFS chauffeur — from the mortuary to the family home and on to the graveside."
          tone="light"
        />
        <Image
          src={FLEET_PHOTOS.convoy.src}
          alt="The Diaspora Funeral Services fleet: a glass hearse trailer and three black Toyota Fortuners, plates Diaspora 1, 2 and 3"
          width={FLEET_PHOTOS.convoy.width}
          height={FLEET_PHOTOS.convoy.height}
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="w-full rounded-3xl"
        />
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <video
          className="aspect-video w-full rounded-3xl border border-ivory/15 bg-black object-cover"
          controls
          playsInline
          preload="none"
          poster={FLEET_PHOTOS.convoy.src}
          aria-label="Diaspora Funeral Services — promotional film"
        >
          <source src="/video/dfs-promo.mp4" type="video/mp4" />
        </video>
        <div>
          <p className="dfs-eyebrow mb-4">Watch</p>
          <h3 className="text-2xl leading-snug md:text-3xl">No distance too far. Family always close.</h3>
          <p className="mt-4 leading-relaxed text-ivory/75">
            See how we care for families at home and abroad — from the first call to the final farewell.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href={cta.arrange.href} size="md">
              {cta.arrange.label}
            </Button>
            <Button href="/brochures" variant="secondary" size="md">
              Our brochures
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
