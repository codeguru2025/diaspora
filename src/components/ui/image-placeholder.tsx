import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Stand-in for a real photo. Deliberately minimal — a visitor should read this
 * as "photo not added yet", not as a paragraph of internal art direction.
 * That direction still matters for whoever sources the photo, so it's kept
 * as a `title` tooltip + screen-reader text rather than deleted.
 */
export function ImagePlaceholder({
  direction,
  label,
  aspect = "aspect-[4/3]",
  className,
}: {
  /** Internal guidance for whoever sources the real photo — not shown as body text. */
  direction: string;
  /** Optional short visible caption, e.g. a service or package name. */
  label?: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <div
      title={direction}
      className={cn(
        "relative grid place-items-center overflow-hidden rounded-xl border border-line bg-surface",
        aspect,
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cpath d='M24 3 L45 24 L24 45 L3 24 Z' fill='none' stroke='%23d4af37'/%3E%3C/svg%3E\")",
        }}
      />
      <span className="sr-only">{direction}</span>
      <div aria-hidden className="relative flex flex-col items-center gap-2.5 text-champagne-deep/60">
        <ImageIcon className="size-5" strokeWidth={1.25} />
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-mist">
          {label ?? "Photo to follow"}
        </span>
      </div>
    </div>
  );
}
