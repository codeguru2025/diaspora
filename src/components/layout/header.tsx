"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/cn";
import { mainNav, cta, site } from "@/config/site";
import { track } from "@/lib/analytics";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close the mobile menu on navigation — adjust state during render (React's
  // documented pattern for state that depends on a changing value), not in an effect.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors",
        scrolled || open
          ? "border-line bg-abyss/85 backdrop-blur-xl"
          : "border-transparent bg-abyss",
      )}
    >
      <Container className="flex h-16 max-w-[88rem] items-center justify-between gap-6 md:h-20">
        <Logo tone="light" />

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
          {mainNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative whitespace-nowrap px-3 py-2 text-[0.84rem] tracking-wide transition-colors after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:origin-left after:bg-champagne after:transition-transform after:duration-300",
                  active ? "text-ink after:scale-x-100" : "text-stone after:scale-x-0 hover:text-ink hover:after:scale-x-100",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-5 xl:flex">
          <Link
            href={cta.arrange.href}
            className="inline-flex items-center gap-2 whitespace-nowrap text-[0.84rem] text-stone transition-colors hover:text-ink"
            onClick={() => track({ name: "cta_click", cta: "arrange", location: "header" })}
          >
            <span aria-hidden className="size-1.5 rounded-full bg-terracotta" />
            {cta.arrange.label}
          </Link>
          <Button
            href={cta.protect.href}
            variant="primary"
            size="sm"
            onClick={() => track({ name: "cta_click", cta: "protect", location: "header" })}
          >
            {cta.protect.label}
          </Button>
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-full text-ink xl:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </Container>

      {/* Mobile panel */}
      <div
        hidden={!open}
        className="xl:hidden fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-abyss md:top-20"
      >
        <Container className="flex flex-col gap-1 py-6">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-b border-line px-1 py-4 font-[family-name:var(--font-display)] text-2xl text-ink hover:text-champagne"
            >
              {item.label}
              {item.description && (
                <span className="mt-0.5 block text-sm font-normal text-stone">
                  {item.description}
                </span>
              )}
            </Link>
          ))}

          <div className="mt-4 grid gap-2">
            <Button href={cta.protect.href} variant="primary" size="lg">
              {cta.protect.label}
            </Button>
            <Button href={cta.arrange.href} variant="urgent" size="lg">
              {cta.arrange.label}
            </Button>
            <Button href={cta.account.href} variant="outline" size="md">
              {cta.account.label}
            </Button>
          </div>

          <a
            href={site.contact.phoneHref}
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-stone"
            onClick={() => track({ name: "phone_click", location: "mobile-menu" })}
          >
            <Phone className="size-4" />
            {site.contact.phoneDisplay}
          </a>
        </Container>
      </div>
    </header>
  );
}
