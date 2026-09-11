import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";

export function PageHeader({
  eyebrow,
  title,
  intro,
  tone = "cream",
  visual,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: React.ReactNode;
  tone?: "cream" | "ink" | "ivory";
  visual?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const tones = {
    cream: "bg-cream text-charcoal",
    ivory: "bg-void text-charcoal",
    ink: "bg-abyss text-ivory [&_h1]:text-ivory",
  };
  const copy = (
    <div>
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-xs font-semibold uppercase tracking-[0.18em]",
            tone === "ink" ? "text-champagne" : "text-champagne-deep",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h1 className={cn("text-[2.25rem] leading-[1.08] md:text-5xl", !visual && "max-w-3xl")}>
        {title}
      </h1>
      {intro && (
        <div
          className={cn(
            "mt-5 text-lg leading-relaxed",
            !visual && "max-w-2xl",
            tone === "ink" ? "text-ivory/75" : "text-stone",
          )}
        >
          {intro}
        </div>
      )}
      {children && <div className="mt-8">{children}</div>}
    </div>
  );
  return (
    <section className={cn("border-b border-line", tones[tone])}>
      <Container className="py-14 md:py-20">
        {visual ? (
          <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center">
            {copy}
            {visual}
          </div>
        ) : (
          copy
        )}
      </Container>
    </section>
  );
}
