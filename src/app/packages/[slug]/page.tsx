import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge, AvailabilityMark, NeedsInput } from "@/components/ui/primitives";
import { CtaBand } from "@/components/marketing/sections";
import { ServiceCard } from "@/components/marketing/service-card";
import { packages, getPackage, comparison } from "@/config/packages";
import { services } from "@/config/services";
import { getPackages } from "@/lib/pol263";
import { formatPrice, scheduleLabel } from "@/lib/format";

export function generateStaticParams() {
  return packages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) return {};
  return {
    title: `${pkg.name} Package`,
    description: `${pkg.positioning} — ${pkg.summary}`,
  };
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const base = getPackage(slug);
  if (!base) notFound();

  const resolved = (await getPackages()).data.find((p) => p.slug === slug)!;
  const price = resolved.price ? formatPrice(resolved.price.amount, resolved.price.currency) : null;

  const addOnServices = services.filter(
    (s) => s.availability[base.slug] === "addon" && s.active,
  );
  const includedServices = services.filter((s) => s.availability[base.slug] === "included");

  return (
    <>
      <PageHeader eyebrow={`${base.name} package`} title={base.positioning} intro={base.summary}>
        <div className="flex flex-wrap items-center gap-4">
          {price ? (
            <p className="text-ink">
              <span className="text-sm text-stone">from</span>{" "}
              <span className="text-2xl font-semibold">{price}</span>{" "}
              <span className="text-sm text-stone">{scheduleLabel(resolved.price!.schedule)}</span>
            </p>
          ) : (
            <p className="text-sm text-stone">
              Pricing <NeedsInput>configured in POL263</NeedsInput>
            </p>
          )}
          <Button href={`/get-a-quote?package=${base.slug}`}>Get a {base.name} quote</Button>
          <Button href="/packages#compare" variant="ghost">
            Compare packages
          </Button>
        </div>
      </PageHeader>

      <Section tone="ivory">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <SectionHeading title={`Who ${base.name} is for`} />
            <p className="mt-3 text-stone">{base.audience}</p>

            <h3 className="mt-10 text-xl">Highlights</h3>
            <ul className="mt-4 space-y-2.5">
              {base.highlights.map((h, i) => (
                <li key={i} className="flex gap-2.5 text-charcoal">
                  <Check className="mt-1 size-4 shrink-0 text-sage" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <h3 className="mt-10 text-xl">How this package compares</h3>
            <div className="mt-4 divide-y divide-line border-y border-line">
              {comparison.map((g) => (
                <div key={g.group} className="py-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-deep">
                    {g.group}
                  </p>
                  <dl className="space-y-2">
                    {g.rows.map((r) => (
                      <div key={r.label} className="flex items-start justify-between gap-4">
                        <dt className="text-sm text-charcoal">{r.label}</dt>
                        <dd>
                          <AvailabilityMark value={r.values[base.slug]} showLabel />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-line bg-surface p-6">
              <Badge tone="accent">{base.concierge}</Badge>
              <h3 className="mt-3 text-lg">Ready to protect your family?</h3>
              <p className="mt-2 text-sm text-stone">
                Get an indicative quote in a few minutes. No obligation.
              </p>
              <div className="mt-4 grid gap-2">
                <Button href={`/get-a-quote?package=${base.slug}`} size="sm">
                  Get a Quote
                </Button>
                <Button href={`/join?package=${base.slug}`} variant="secondary" size="sm">
                  Start my application
                </Button>
                <Link href="/contact" className="text-center text-sm text-stone hover:text-ink">
                  Speak to a consultant
                </Link>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-line bg-cream p-6">
              <p className="text-sm text-stone">
                All package inclusions, benefit amounts, waiting periods and eligibility rules are{" "}
                <NeedsInput>configured in POL263 and confirmed by DFS</NeedsInput>. This page shows
                the intended structure.
              </p>
            </div>
          </aside>
        </div>
      </Section>

      {includedServices.length > 0 && (
        <Section tone="surface">
          <SectionHeading eyebrow="Included services" title={`Comes with ${base.name}`} />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {includedServices.slice(0, 6).map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </Section>
      )}

      <Section tone="cream">
        <SectionHeading
          eyebrow="Make it yours"
          title={`Personalise your ${base.name} funeral`}
          intro="Start with the package. Then add the services that matter to your family."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {addOnServices.slice(0, 9).map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
        <div className="mt-8">
          <Button href="/services" variant="secondary">
            Explore all services
          </Button>
        </div>
      </Section>

      <CtaBand
        title={`Start with ${base.name}. Make it your own.`}
        primary={{ label: `Get a ${base.name} quote`, href: `/get-a-quote?package=${base.slug}` }}
      />
    </>
  );
}
