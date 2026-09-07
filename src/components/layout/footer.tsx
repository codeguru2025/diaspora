import Link from "next/link";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { NeedsInput } from "@/components/ui/primitives";
import { footerNav, site } from "@/config/site";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="bg-ink text-ivory/70">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/60">
              {site.tagline}
            </p>
            <p className="mt-3 text-sm text-ivory/60">{site.coverage}</p>

            <div className="mt-6 space-y-2 text-sm">
              <a href={site.contact.phoneHref} className="flex items-center gap-2 hover:text-ivory">
                <Phone className="size-4" /> {site.contact.phoneDisplay}
              </a>
              <a href={site.contact.whatsappHref} className="flex items-center gap-2 hover:text-ivory">
                <MessageCircle className="size-4" /> WhatsApp: {site.contact.whatsappDisplay}
              </a>
              <a href={`mailto:${site.contact.email}`} className="flex items-center gap-2 hover:text-ivory">
                <Mail className="size-4" /> {site.contact.email}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {footerNav.map((col) => (
              <div key={col.title}>
                <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ivory/50">
                  {col.title}
                </h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="hover:text-ivory">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-ivory/12 pt-6 text-xs text-ivory/45">
          <p>
            © {new Date().getFullYear()} {site.name}. Administered on the POL263 platform.
          </p>
          <p className="mt-2 max-w-3xl">
            <NeedsInput>{site.legalEntity}</NeedsInput> ·{" "}
            <NeedsInput>{site.regulatoryLine}</NeedsInput> — regulatory, licensing and policy
            wording to be confirmed and supplied by DFS before launch.
          </p>
        </div>
      </Container>
    </footer>
  );
}
