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
        <p className="dfs-eyebrow mb-5">{eyebrow}</p>
      )}
      <h1 className={cn("text-[2.4rem] leading-[1.05] md:text-6xl", !visual && "max-w-3xl")}>
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
    <section className={cn("relative overflow-hidden border-b border-line", tones[tone])}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(50rem 28rem at 85% -20%, rgba(207,174,109,0.10), transparent 65%)" }}
      />
      <Container className="relative py-16 md:py-24">
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
