import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "accent" | "urgent";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[3px] font-semibold uppercase tracking-[0.14em] sm:whitespace-nowrap transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none text-center";

// Gold is a signal, not a wash: one solid-gold primary per view; everything else is outlined.
const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-[#dcc084] to-champagne text-void shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_8px_24px_-12px_rgba(207,174,109,0.6)] hover:from-[#e6cd96] hover:to-[#d8b877]",
  secondary: "border border-champagne/45 text-champagne hover:border-champagne hover:bg-champagne/8",
  outline: "border border-ivory/20 text-ink hover:border-ivory/45 hover:bg-ivory/5",
  ghost: "text-ink hover:text-champagne",
  accent:
    "bg-gradient-to-b from-[#dcc084] to-champagne text-void hover:from-[#e6cd96] hover:to-[#d8b877]",
  urgent: "bg-[#a9583c] text-ivory hover:bg-[#b96446]",
};

const sizes: Record<Size, string> = {
  sm: "text-[0.7rem] px-4 py-2.5",
  md: "text-[0.74rem] px-6 py-3",
  lg: "text-[0.78rem] px-8 py-4",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type AsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

export function Button(props: AsButton | AsLink) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href !== undefined) {
    const { href, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    const external = /^https?:\/\//.test(href) || href.startsWith("tel:") || href.startsWith("mailto:");
    if (external) {
      return (
        <a href={href} className={classes} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } =
    props as AsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
