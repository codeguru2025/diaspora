import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Wordmark placeholder. DFS should replace this with the final logo asset
 * (ideally served from the POL263 org branding record).
 */
export function Logo({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="Diaspora Funeral Services — home"
    >
      <span
        aria-hidden
        className={cn(
          "grid size-9 place-items-center rounded-full border text-[0.95rem] font-[family-name:var(--font-display)]",
          tone === "light"
            ? "border-ivory/40 text-ivory"
            : "border-champagne-deep/40 text-champagne-deep",
        )}
      >
        D
      </span>
      <span className="leading-tight">
        <span
          className={cn(
            "block font-[family-name:var(--font-display)] text-[1.05rem] tracking-tight",
            tone === "light" ? "text-ivory" : "text-ink",
          )}
        >
          Diaspora
        </span>
        <span
          className={cn(
            "block text-[0.62rem] font-semibold uppercase tracking-[0.22em]",
            tone === "light" ? "text-ivory/60" : "text-stone",
          )}
        >
          Funeral Services
        </span>
      </span>
    </Link>
  );
}
