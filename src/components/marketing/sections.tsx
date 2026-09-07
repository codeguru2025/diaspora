import Link from "next/link";
import { ArrowRight, Phone, MessageCircle, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge, NeedsInput } from "@/components/ui/primitives";
import { cta, site } from "@/config/site";
import { howItWorks, dfsDifference, nameItShowcase, diasporaPoints, trustMarkers } from "@/config/content";

/* -------------------------------------------------------------- */
export function CtaBand({
  title = "Start with your protection. Make it your own. Let us take care of the rest.",
  body = "Whether your family needs the essentials handled with dignity or a farewell designed entirely around your wishes — that decision is yours, and the commitment to deliver it is ours.",
  primary = cta.protect,
  secondary = cta.quote,
}: {
  title?: string;
  body?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <Section tone="ink">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl md:text-[2.5rem]">{title}</h2>
        <p className="mt-4 text-lg text-ivory/75">{body}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href={primary.href} variant="accent" size="lg">
            {primary.label}
          </Button>
          <Button href={secondary.href} variant="outline" size="lg" className="border-ivory/30 text-ivory hover:bg-ivory/10">
            {secondary.label}
          </Button>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------- */
export function FuneralNowBand() {
  return (
    <Section tone="cream">
      <div className="overflow-hidden rounded-3xl border border-terracotta/25 bg-surface">
        <div className="grid gap-6 p-8 md:grid-cols-[1.5fr_1fr] md:items-center md:p-12">
          <div>
            <Badge tone="terracotta">Immediate assistance</Badge>
            <h2 className="mt-3 text-3xl">A loved one has passed away? We&rsquo;re here.</h2>
            <p className="mt-3 max-w-xl text-stone">
              You should not have to fill in forms right now. Tell us what has happened and where,
              and our team takes over the arrangements — while keeping you informed every step of
              the way, wherever you are.
            </p>
          </div>
          <div className="grid gap-3">
            <Button href={cta.arrange.href} variant="urgent" size="lg">
              {cta.arrange.label}
            </Button>
            <a
              href={site.contact.atNeedPhoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 px-5 py-3 text-sm font-medium text-ink hover:bg-ink/5"
            >
              <Phone className="size-4" />
              Call our care line · {site.contact.atNeedPhoneDisplay}
            </a>
            <a
              href={site.contact.whatsappHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 px-5 py-3 text-sm font-medium text-ink hover:bg-ink/5"
            >
              <MessageCircle className="size-4" />
              Message us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------- */
export function Steps({ tone = "ivory" }: { tone?: "ivory" | "cream" | "sand" | "surface" }) {
  return (
    <Section tone={tone} id="how-it-works">
      <SectionHeading
        eyebrow="How it works"
        title="Four steps. Then we carry it."
        intro="From choosing your cover to the day itself, the process is deliberately simple."
      />
      <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {howItWorks.map((s, i) => (
          <li key={s.title} className="rounded-2xl border border-line bg-surface p-6">
            <span className="font-[family-name:var(--font-display)] text-3xl text-champagne-deep">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-lg">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone">{s.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* -------------------------------------------------------------- */
export function DifferenceSection() {
  return (
    <Section tone="surface">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <SectionHeading
          eyebrow="The DFS difference"
          title="More than funeral cover. Complete funeral fulfilment."
          intro="From the essentials to the details that make a farewell uniquely personal, Diaspora Funeral Services helps families create the funeral they want — with professional support from start to finish."
        />
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {dfsDifference.map((d) => (
            <li key={d} className="flex items-start gap-2.5 rounded-xl bg-cream px-4 py-3 text-sm text-charcoal">
              <Check className="mt-0.5 size-4 shrink-0 text-sage" />
              {d}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------- */
export function NameItShowcase() {
  return (
    <Section tone="ink">
      <SectionHeading
        tone="light"
        eyebrow="Name it. We provide it."
        title="A funeral is deeply personal. So we went beyond the traditional package."
        intro="Start with your package. Then choose from a wide catalogue of services to make it yours."
      />
      <div className="mt-10 flex flex-wrap gap-2.5">
        {nameItShowcase.map((item) => (
          <Link
            key={item.label}
            href={item.serviceSlug ? `/services/${item.serviceSlug}` : "/services"}
            className="rounded-full border border-ivory/20 px-4 py-2 text-sm text-ivory/85 transition-colors hover:border-champagne hover:text-ivory"
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/services"
          className="rounded-full bg-champagne px-4 py-2 text-sm font-medium text-ink hover:bg-champagne-deep hover:text-ivory"
        >
          Explore everything we offer →
        </Link>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------- */
export function DiasporaSection() {
  return (
    <Section tone="cream" id="diaspora">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="For the diaspora"
            title="Thousands of kilometres away. Still completely involved."
            intro="Distance should never determine the quality of care your family receives. Set up protection for family back home and stay involved from wherever you are."
          />
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href={cta.protectDiaspora.href} size="md">
              {cta.protectDiaspora.label}
            </Button>
            <Button href="/for-the-diaspora" variant="outline" size="md">
              How it works for the diaspora
            </Button>
          </div>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {diasporaPoints.map((p) => (
            <li key={p.title} className="rounded-xl border border-line bg-surface p-4">
              <p className="text-sm font-semibold text-ink">{p.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-stone">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------- */
export function TrustStrip() {
  const shown = trustMarkers.filter((m) => !m.needsInput);
  const pending = trustMarkers.filter((m) => m.needsInput);
  return (
    <Section tone="ivory">
      <SectionHeading eyebrow="Why families trust us" title="Professional. Transparent. Accountable." />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((m) => (
          <div key={m.label} className="rounded-xl border border-line bg-surface p-5">
            <p className="text-sm font-semibold text-ink">{m.label}</p>
            <p className="mt-1 text-sm text-stone">{m.detail}</p>
          </div>
        ))}
      </div>
      {pending.length > 0 && (
        <p className="mt-4 text-xs text-mist">
          Additional trust markers pending real figures from DFS:{" "}
          {pending.map((p, i) => (
            <span key={p.label}>
              {i > 0 && ", "}
              <NeedsInput>{p.label}</NeedsInput>
            </span>
          ))}
          . We do not publish statistics, testimonials or accreditations until DFS confirms them.
        </p>
      )}
    </Section>
  );
}

/* -------------------------------------------------------------- */
export function ConciergeSection() {
  const tiers = [
    { name: "Essential", line: "Digital service with standard support. Every family matters." },
    { name: "Classic", line: "Priority customer support." },
    { name: "Prestige", line: "A dedicated Funeral Care consultant." },
    { name: "Bespoke", line: "Highly personalised, end-to-end coordination." },
  ];
  return (
    <Section tone="surface">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-center">
        <SectionHeading
          eyebrow="Human support"
          title="Premium without elitism."
          intro="The difference between our packages is the level of service and choice — never the value of a person's life. Someone choosing Essential is treated with the same respect as someone choosing Bespoke."
        />
        <ul className="grid gap-3 sm:grid-cols-2">
          {tiers.map((t) => (
            <li key={t.name} className="rounded-xl border border-line bg-cream p-4">
              <p className="text-sm font-semibold text-ink">{t.name}</p>
              <p className="mt-1 text-xs text-stone">{t.line}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------- */
export function SmallLinkRow({ links }: { links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={cn("inline-flex items-center gap-1 text-sm font-medium text-champagne-deep hover:text-ink")}
        >
          {l.label} <ArrowRight className="size-3.5" />
        </Link>
      ))}
    </div>
  );
}
