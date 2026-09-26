import { cn } from "@/lib/cn";
import { Container } from "./container";

type Tone = "ivory" | "cream" | "sand" | "ink" | "surface";

const tones: Record<Tone, string> = {
  ivory: "bg-void text-charcoal",
  cream: "bg-cream text-charcoal",
  sand: "bg-sand text-charcoal",
  surface: "bg-surface text-charcoal",
  ink: "bg-abyss text-ivory [&_h1]:text-ivory [&_h2]:text-ivory [&_h3]:text-ivory",
};

export function Section({
  tone = "ivory",
  className,
  containerClassName,
  id,
  children,
}: {
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("py-20 md:py-28", tones[tone], className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
  tone = "dark",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="dfs-eyebrow mb-5">{eyebrow}</p>
      )}
      <h2 className="text-[2.1rem] leading-[1.08] md:text-5xl">{title}</h2>
      {intro && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed",
            tone === "light" ? "text-ivory/75" : "text-stone",
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
