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
          ? "border-line bg-abyss/95 backdrop-blur"
          : "border-transparent bg-abyss",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4 md:h-[4.75rem]">
        <Logo tone="light" />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {mainNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-2 text-[0.9rem] font-medium transition-colors",
                  active ? "text-ink" : "text-stone hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            href={cta.arrange.href}
            variant="ghost"
            size="sm"
            onClick={() => track({ name: "cta_click", cta: "arrange", location: "header" })}
          >
            {cta.arrange.label}
          </Button>
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
          className="grid size-10 place-items-center rounded-full text-ink lg:hidden"
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
        className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-abyss"
      >
        <Container className="flex flex-col gap-1 py-6">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-3.5 text-lg font-medium text-ink hover:bg-cream"
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
