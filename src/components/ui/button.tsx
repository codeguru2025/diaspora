import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "accent" | "urgent";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none text-center";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-ivory hover:bg-charcoal",
  secondary: "bg-cream text-ink border border-line-strong hover:bg-sand",
  outline: "border border-ink/25 text-ink hover:bg-ink/5",
  ghost: "text-ink hover:bg-ink/5",
  accent: "bg-champagne text-ink hover:bg-champagne-deep hover:text-ivory",
  urgent: "bg-terracotta text-ivory hover:bg-[#8f4832]",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-[0.95rem] px-5 py-2.5",
  lg: "text-base px-7 py-3.5",
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
