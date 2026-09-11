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
        "grid place-items-center rounded-xl bg-gradient-to-br from-cream via-surface to-sand",
        aspect,
        className,
      )}
    >
      <span className="sr-only">{direction}</span>
      <div aria-hidden className="flex flex-col items-center gap-2 text-mist">
        <ImageIcon className="size-6" strokeWidth={1.5} />
        {label && <span className="text-xs font-medium tracking-wide">{label}</span>}
      </div>
    </div>
  );
}
