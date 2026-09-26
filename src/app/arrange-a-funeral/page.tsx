import type { Metadata } from "next";
import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ArrangeFuneralForm } from "@/components/forms/arrange-funeral-form";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Arrange a Funeral Now",
  description:
    "If a loved one has passed away, Diaspora Funeral Services is here. Tell us what has happened and our team takes over the arrangements — wherever you are.",
  robots: { index: true, follow: true },
};

export default function ArrangeAFuneralPage() {
  return (
    <>
      <section className="border-b border-line bg-cream">
        <Container className="py-14 md:py-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">
            We&rsquo;re here
          </p>
          <h1 className="max-w-3xl text-[2.25rem] leading-[1.08] md:text-5xl">
            A loved one has passed away. We&rsquo;ll take it from here.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone">
            You don&rsquo;t need to work anything out right now. Leave your name and a number, and a
            member of our care team will call you. If you&rsquo;re far away, we coordinate everything
            on the ground and keep you informed at every step.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={site.contact.atNeedPhoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-abyss px-6 py-3.5 text-base font-medium text-ivory hover:bg-sand"
            >
              <Phone className="size-5" />
              Call our care line · {site.contact.atNeedPhoneDisplay}
            </a>
            <a
              href={site.contact.whatsappHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/25 px-6 py-3.5 text-base font-medium text-ink hover:bg-ink/5"
            >
              <MessageCircle className="size-5" />
              Message us on WhatsApp
            </a>
          </div>
        </Container>
      </section>

      <section className="bg-void py-12 md:py-16">
        <Container className="max-w-3xl">
          <ArrangeFuneralForm />
          <div className="mt-8 grid gap-4 sm:grid-cols-3 text-sm">
            {[
              { t: "1. You tell us", d: "Your name, a number, and whatever you already know." },
              { t: "2. We call you", d: "A care consultant calls, gathers what's needed, and starts arrangements." },
              { t: "3. We coordinate", d: "The service is coordinated on the ground while you stay informed." },
            ].map((s) => (
              <div key={s.t} className="dfs-card rounded-[4px] p-4">
                <p className="font-semibold text-ink">{s.t}</p>
                <p className="mt-1 text-stone">{s.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 dfs-card rounded-[4px] p-4 text-sm text-stone">
            Not urgent, or just want a sense of cost first?{" "}
            <Link href="/quote/cash" className="font-medium text-ink underline underline-offset-2">
              Price out specific services
            </Link>{" "}
            and get a live estimate before you talk to anyone.
          </p>
        </Container>
      </section>
    </>
  );
}
