import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/marketing/page-header";
import { Section } from "@/components/ui/section";
import { Badge, NeedsInput } from "@/components/ui/primitives";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Field, TextArea, TextInput } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { getSampleTribute } from "@/config/tribute-sample";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tribute = getSampleTribute(slug);
  if (!tribute) return {};
  return { title: `${tribute.name} — Tribute`, robots: { index: false, follow: false } };
}

export default async function TributePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tribute = getSampleTribute(slug);
  if (!tribute) notFound();

  return (
    <>
      <PageHeader
        tone="ink"
        eyebrow="Tribute page"
        title={tribute.name}
        intro={tribute.dates}
      >
        <Badge tone="accent">Sample — for illustration only</Badge>
      </PageHeader>

      <Section tone="ivory">
        <div className="mx-auto max-w-2xl">
          <ImagePlaceholder
            direction={tribute.photoCaption}
            aspect="aspect-[16/9]"
            className="w-full rounded-2xl border border-line"
          />

          <p className="mt-6 text-lg leading-relaxed text-stone">{tribute.summary}</p>

          <div className="mt-8 rounded-2xl border border-line bg-surface p-6">
            <h2 className="text-lg">Service details</h2>
            <dl className="mt-3 divide-y divide-line">
              {tribute.service.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-sm font-semibold uppercase tracking-[0.1em] text-stone">
                    {row.label}
                  </dt>
                  <dd className="text-right text-ink">
                    <NeedsInput>{row.detail}</NeedsInput>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-10">
            <h2 className="text-lg">Tribute wall</h2>
            <p className="mt-1 text-sm text-stone">
              Messages from family and friends, shared here for everyone to see.
            </p>

            <ul className="mt-5 space-y-3">
              {tribute.messages.map((m, i) => (
                <li key={i} className="rounded-xl border border-line bg-surface p-4">
                  <p className="text-sm text-charcoal">{m.message}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-stone">
                    {m.name} · {m.location}
                  </p>
                </li>
              ))}
            </ul>

            <form className="mt-6 rounded-2xl border border-line bg-cream p-5 opacity-70">
              <fieldset disabled className="space-y-4">
                <Field label="Your name">
                  <TextInput name="name" placeholder="Jane Doe" />
                </Field>
                <Field label="Your message">
                  <TextArea name="message" placeholder="Share a memory or a message of support…" />
                </Field>
                <Button type="submit" size="sm" disabled>
                  Post message
                </Button>
              </fieldset>
              <p className="mt-4 text-xs text-mist">
                <NeedsInput>
                  Posting is disabled on this sample. A real tribute wall needs shared, moderated
                  storage — see docs/POL263-TRIBUTE-SCHEMA.md — which is not yet connected.
                </NeedsInput>
              </p>
            </form>
          </div>
        </div>
      </Section>
    </>
  );
}
