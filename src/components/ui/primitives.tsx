import { cn } from "@/lib/cn";

/* ---- Badge ---- */
export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "sage" | "clay" | "terracotta" | "outline";
  className?: string;
}) {
  const tones = {
    neutral: "bg-ink/8 text-charcoal",
    accent: "border border-champagne/40 bg-champagne/10 text-champagne",
    sage: "bg-sage/18 text-sage",
    clay: "bg-clay/15 text-clay",
    terracotta: "bg-terracotta/12 text-terracotta",
    outline: "border border-line-strong text-stone",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-tight",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---- Card ---- */
export function Card({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}) {
  return (
    <Tag
      className={cn(
        "dfs-card rounded-[4px] p-6",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/* ---- Availability marker (✓ / + / —) ---- */
export function AvailabilityMark({
  value,
  showLabel = false,
}: {
  value: "included" | "addon" | "not-available";
  showLabel?: boolean;
}) {
  const map = {
    included: { sym: "✓", label: "Included", cls: "text-sage" },
    addon: { sym: "+", label: "Available as add-on", cls: "text-champagne-deep" },
    "not-available": { sym: "—", label: "Not available", cls: "text-mist" },
  } as const;
  const m = map[value];
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-semibold", m.cls)}>
      <span aria-hidden className="text-base leading-none">
        {m.sym}
      </span>
      <span className={showLabel ? "text-sm font-medium" : "sr-only"}>{m.label}</span>
    </span>
  );
}

/* ---- "Needs DFS input" inline marker ---- */
export function NeedsInput({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="needs-input"
      title="Content required from DFS — placeholder"
      data-needs-input
    >
      {children}
    </span>
  );
}

/* ---- Simple divider dot list ---- */
export function DotList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-stone", className)}>
      {items.map((it, i) => (
        <li key={i} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden className="text-mist">·</span>}
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
