import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { HOME_HERO_PHOTO } from "@/lib/stock-photos";
import { cta } from "@/config/site";

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden bg-void">
      {/* Warm ambient light — no coffin imagery, no stereotype (MEGA PROMPT §19, §48) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(55rem 38rem at 80% -5%, rgba(207,174,109,0.16), transparent 62%), radial-gradient(40rem 30rem at -5% 105%, rgba(207,174,109,0.06), transparent 60%)",
        }}
      />
      <Container className="grid gap-14 py-16 md:py-24 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20 lg:py-32">
        <div>
          <p className="dfs-eyebrow mb-7">Funeral protection · Zimbabwe &amp; the diaspora</p>
          <h1 className="text-[2.6rem] leading-[1.03] sm:text-6xl lg:text-[4.25rem]">
            Distance should never determine the care{" "}
            <span className="dfs-em">your family</span> receives.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-stone">
            World-class funeral protection and personalised funeral services for families in
            Zimbabwe — whether you&rsquo;re here or thousands of kilometres away. From the essential
            to the extraordinary, we make every funeral personal.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button href={cta.protect.href} size="lg">
              {cta.protect.label}
            </Button>
            <Button href={cta.arrange.href} variant="urgent" size="lg">
              {cta.arrange.label}
            </Button>
          </div>
          <Link
            href={cta.services.href}
            className="group mt-6 inline-flex items-center gap-2 text-sm text-stone transition-colors hover:text-champagne"
          >
            {cta.services.label}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="relative lg:pl-6">
          {/* Offset gold frame behind the portrait */}
          <div
            aria-hidden
            className="absolute inset-0 translate-x-4 translate-y-4 rounded-[4px] border border-champagne/35 lg:left-6"
          />
          <Image
            src={HOME_HERO_PHOTO.src}
            alt="A father embracing his daughter"
            width={HOME_HERO_PHOTO.width}
            height={HOME_HERO_PHOTO.height}
            priority
            className="relative aspect-[4/5] w-full rounded-[4px] object-cover shadow-[var(--shadow-raised)]"
          />
          <div className="absolute -bottom-8 -left-4 hidden border border-line-strong bg-abyss/90 px-6 py-5 shadow-[var(--shadow-raised)] backdrop-blur sm:block lg:left-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-champagne">
              Name it. We provide it.
            </p>
            <p className="mt-1.5 font-[family-name:var(--font-display)] text-xl text-ink">
              Essential <span className="text-champagne">→</span> Bespoke
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
