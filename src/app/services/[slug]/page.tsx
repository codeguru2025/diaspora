import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge, AvailabilityMark, NeedsInput } from "@/components/ui/primitives";
import { ServiceCard } from "@/components/marketing/service-card";
import { AddToFuneralButton } from "@/components/marketing/add-to-funeral-button";
import { Recommendations } from "@/components/marketing/recommendations";
import {
  services,
  getService,
  servicesByCategory,
  serviceCategories,
  pricingModelLabels,
} from "@/config/services";
import { packages } from "@/config/packages";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return { title: s.name, description: s.shortDescription };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const category = serviceCategories.find((c) => c.slug === s.category);
  const related = s.relatedServices.map(getService).filter(Boolean).slice(0, 3);
  const alsoInCategory = servicesByCategory(s.category)
    .filter((x) => x.slug !== s.slug)
    .slice(0, 3);
  const recommendations = related.length > 0 ? related : alsoInCategory;

  return (
    <>
      <PageHeader
        eyebrow={category?.name}
        title={s.name}
        intro={s.description}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="outline">{pricingModelLabels[s.pricing.model]}</Badge>
          <span className="text-sm text-stone">{s.pricing.note}</span>
        </div>
      </PageHeader>

      <Section tone="ivory">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-xl">Why families choose it</h2>
            <p className="mt-2 text-stone">{s.whyChoose}</p>

            <h2 className="mt-10 text-xl">What&rsquo;s included</h2>
            <ul className="mt-4 space-y-2.5">
              {s.includes.map((i, idx) => (
                <li key={idx} className="flex gap-2.5 text-charcoal">
                  <Check className="mt-1 size-4 shrink-0 text-sage" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-xl">Availability by package</h2>
            <dl className="mt-4 divide-y divide-line border-y border-line">
              {packages.map((p) => (
                <div key={p.slug} className="flex items-center justify-between py-3">
                  <dt className="text-charcoal">
                    <Link href={`/packages/${p.slug}`} className="hover:text-ink">
                      {p.name}
                    </Link>
                  </dt>
                  <dd>
                    <AvailabilityMark value={s.availability[p.slug]} showLabel />
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 rounded-xl bg-cream p-4 text-sm text-stone">
              <p>
                <span className="font-medium text-ink">Lead time:</span>{" "}
                <NeedsInput>{s.leadTime}</NeedsInput>
              </p>
              <p className="mt-1">
                Design options, materials, examples and exact specifications are confirmed with you —
                we don&rsquo;t publish specs we can&rsquo;t stand behind.
              </p>
            </div>

            {s.slug === "online-tribute" && (
              <div className="mt-6 rounded-xl border border-champagne-deep/30 bg-champagne/10 p-4 text-sm">
                <p className="text-ink">
                  Want to see the format first?{" "}
                  <Link href="/tribute/sample" className="font-medium text-champagne-deep hover:text-ink">
                    View a sample tribute page →
                  </Link>
                </p>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-line bg-surface p-6">
              <div
                aria-hidden
                className="mb-4 grid aspect-[4/3] place-items-center rounded-xl bg-gradient-to-br from-cream to-sand text-xs uppercase tracking-widest text-mist"
              >
                Image · {s.name}
              </div>
              <h3 className="text-lg">Add {s.name} to your funeral</h3>
              <p className="mt-1 text-sm text-stone">{s.pricing.note}</p>
              <div className="mt-4 grid gap-2">
                <AddToFuneralButton slug={s.slug} name={s.name} />
                <Button href="/get-a-quote" variant="secondary" size="sm">
                  Add it in a quote
                </Button>
                <Link href="/contact" className="text-center text-sm text-stone hover:text-ink">
                  Ask a question first
                </Link>
              </div>
            </div>

            <div className="mt-4">
              <Recommendations seedServices={[s.slug]} intro={s.upsellMessage} />
            </div>
          </aside>
        </div>
      </Section>

      {recommendations.length > 0 && (
        <Section tone="cream">
          <SectionHeading eyebrow="You may also want" title="Services that go together" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((r) => (
              <ServiceCard key={r!.slug} service={r!} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
