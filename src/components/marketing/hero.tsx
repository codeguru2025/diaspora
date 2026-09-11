import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { cta } from "@/config/site";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-void">
      {/* Warm ambient background — no coffin imagery, no stereotype (MEGA PROMPT §19, §48) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60rem 40rem at 78% -10%, rgba(198,165,104,0.22), transparent 60%), radial-gradient(50rem 40rem at 0% 100%, rgba(111,115,87,0.12), transparent 55%)",
        }}
      />
      <Container className="grid gap-10 py-16 md:py-24 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:py-28">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-champagne-deep">
            Funeral protection &amp; personalised funeral services · Zimbabwe
          </p>
          <h1 className="text-[2.5rem] leading-[1.06] sm:text-5xl lg:text-[3.6rem]">
            Distance should never determine the care your family receives.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone">
            World-class funeral protection and personalised funeral services for families in
            Zimbabwe — whether you&rsquo;re here or thousands of kilometres away. From the essential
            to the extraordinary, we make every funeral personal.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href={cta.protect.href} size="lg">
              {cta.protect.label}
            </Button>
            <Button href={cta.arrange.href} variant="urgent" size="lg">
              {cta.arrange.label}
            </Button>
            <Button href={cta.services.href} variant="ghost" size="lg">
              {cta.services.label}
            </Button>
          </div>

          <p className="mt-6 text-sm text-mist">
            Your family. Your wishes. Our commitment to make it happen.
          </p>
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="grid aspect-[4/5] w-full place-items-center rounded-3xl border border-line bg-gradient-to-br from-cream via-surface to-sand p-8 text-center shadow-[var(--shadow-raised)]"
          >
            <span className="max-w-xs text-sm font-medium uppercase tracking-widest text-mist">
              Photography direction: family, care, warmth, dignity — Zimbabwean where possible.
              No coffin imagery. Asset required from DFS.
            </span>
          </div>
          <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-line bg-surface px-5 py-4 shadow-[var(--shadow-soft)] sm:block">
            <p className="text-xs text-stone">Name it. We provide it.</p>
            <p className="text-sm font-semibold text-ink">Essential → Bespoke</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
