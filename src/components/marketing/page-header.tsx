import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";

export function PageHeader({
  eyebrow,
  title,
  intro,
  tone = "cream",
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: React.ReactNode;
  tone?: "cream" | "ink" | "ivory";
  children?: React.ReactNode;
}) {
  const tones = {
    cream: "bg-cream text-charcoal",
    ivory: "bg-ivory text-charcoal",
    ink: "bg-ink text-ivory [&_h1]:text-ivory",
  };
  return (
    <section className={cn("border-b border-line", tones[tone])}>
      <Container className="py-14 md:py-20">
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
        <h1 className="max-w-3xl text-[2.25rem] leading-[1.08] md:text-5xl">{title}</h1>
        {intro && (
          <div
            className={cn(
              "mt-5 max-w-2xl text-lg leading-relaxed",
              tone === "ink" ? "text-ivory/75" : "text-stone",
            )}
          >
            {intro}
          </div>
        )}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  );
}
