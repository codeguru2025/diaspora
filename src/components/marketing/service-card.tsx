import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { pricingModelLabels, type ServiceItem } from "@/config/services";
import { SERVICE_PHOTOS } from "@/lib/service-photos";

export function ServiceCard({ service }: { service: ServiceItem }) {
  const photo = SERVICE_PHOTOS[service.slug];
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group dfs-card dfs-card-hover flex flex-col rounded-[4px] p-5"
    >
      {photo ? (
        <Image
          src={photo.src}
          alt={service.name}
          width={photo.width}
          height={photo.height}
          className="mb-5 aspect-[4/3] w-full rounded-[2px] object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-100"
        />
      ) : (
        <ImagePlaceholder
          direction={`Photo of ${service.name} — dignified, no coffin imagery, Zimbabwean where possible.`}
          className="mb-4"
        />
      )}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl leading-snug">{service.name}</h3>
        <ArrowUpRight className="mt-1 size-4 shrink-0 text-mist transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-champagne" />
      </div>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-stone">{service.shortDescription}</p>
      <div className="mt-4 flex items-center gap-2">
        <Badge tone="outline">{pricingModelLabels[service.pricing.model] ?? "Priced on request"}</Badge>
      </div>
    </Link>
  );
}
