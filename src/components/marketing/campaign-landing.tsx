import { PageHeader } from "@/components/marketing/page-header";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/marketing/service-card";
import { CtaBand } from "@/components/marketing/sections";
import { LeadForm } from "@/components/forms/lead-form";
import { getService } from "@/config/services";

/**
 * Reusable conversion-optimised landing page for social / search campaigns
 * (MEGA PROMPT §61). One headline, one promise, one primary action.
 */
export function CampaignLanding({
  eyebrow,
  title,
  intro,
  bullets,
  serviceSlugs,
  primary,
  leadSource,
  leadTitle,
  image,
  gallery,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  bullets: string[];
  serviceSlugs: string[];
  primary: { label: string; href: string };
  leadSource: React.ComponentProps<typeof LeadForm>["source"];
  leadTitle: string;
  image?: React.ReactNode;
  /** Optional showcase (e.g. a photo slideshow) rendered as its own section, right under the hero. */
  gallery?: { eyebrow?: string; title: string; content: React.ReactNode };
}) {
  const svcs = serviceSlugs.map(getService).filter(Boolean);
  const cta = (
    <div className="flex flex-wrap gap-3">
      <Button href={primary.href} variant="accent">
        {primary.label}
      </Button>
      <Button
        href="#enquire"
        variant="outline"
        className="border-ivory/30 text-ivory hover:bg-ivory/10"
      >
        Ask a question
      </Button>
    </div>
  );
  return (
    <>
      {image ? (
        <PageHeader eyebrow={eyebrow} title={title} intro={intro} tone="ink" visual={image}>
          {cta}
        </PageHeader>
      ) : (
        <PageHeader eyebrow={eyebrow} title={title} intro={intro} tone="ink">
          {cta}
        </PageHeader>
      )}

      {gallery && (
        <Section tone="cream">
          <SectionHeading eyebrow={gallery.eyebrow} title={gallery.title} />
          <div className="mt-8">{gallery.content}</div>
        </Section>
      )}

      <Section tone="ivory">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeading title="What's included" />
            <ul className="mt-5 space-y-2.5">
              {bullets.map((b) => (
                <li key={b} className="flex gap-2.5 text-charcoal">
                  <span aria-hidden className="mt-1 text-sage">
                    ✓
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-stone">
              Available as part of a DFS package or as a standalone service. Pricing is confirmed in
              your quote — we never publish figures we can&rsquo;t stand behind.
            </p>
          </div>

          <div id="enquire">
            <LeadForm source={leadSource} title={leadTitle} submitLabel="Send my enquiry" contactKind="message" />
          </div>
        </div>
      </Section>

      {svcs.length > 0 && (
        <Section tone="cream">
          <SectionHeading eyebrow="Related services" title="Often chosen together" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {svcs.map((s) => (
              <ServiceCard key={s!.slug} service={s!} />
            ))}
          </div>
        </Section>
      )}

      <CtaBand primary={primary} secondary={{ label: "View all packages", href: "/packages" }} />
    </>
  );
}
