"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { usePortalSession, portalPost } from "@/lib/portal-client";
import { PortalLogin } from "./portal-login";

const nav = [
  { href: "/account/dashboard", label: "Overview" },
  { href: "/account/payments", label: "Payments" },
  { href: "/account/documents", label: "Documents" },
  { href: "/account/claims", label: "Funeral & claims" },
];

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { status, refresh } = usePortalSession();

  if (status.state === "loading") {
    return (
      <Container className="flex min-h-[50vh] items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-stone" />
      </Container>
    );
  }

  if (status.state === "unconfigured") {
    return (
      <Container className="max-w-xl py-16">
        <h1 className="text-2xl">The customer portal is connecting soon.</h1>
        <p className="mt-3 text-stone">
          Your policy, payments and documents are administered on the POL263 platform. Online sign-in
          for the DFS site will be available once the connection is live. In the meantime, your
          Funeral Care Consultant can help with anything you need.
        </p>
        <div className="mt-6 flex gap-3">
          <Button href="/contact">Contact us</Button>
          <Button href="/arrange-a-funeral" variant="urgent">
            Notify us of a death
          </Button>
        </div>
      </Container>
    );
  }

  if (status.state === "signed-out") {
    return (
      <Container className="max-w-md py-16">
        <PortalLogin onSuccess={refresh} />
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-stone">Your account</p>
          <h1 className="text-2xl">
            Welcome back, {status.client.firstName || "there"}.
          </h1>
        </div>
        <button
          type="button"
          onClick={async () => {
            await portalPost("logout").catch(() => {});
            refresh();
          }}
          className="inline-flex items-center gap-2 text-sm text-stone hover:text-ink"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </div>

      <nav className="mt-6 flex gap-1 overflow-x-auto border-b border-line">
        {nav.map((n) => {
          const active = pathname === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "border-champagne text-champagne"
                  : "border-transparent text-stone hover:text-ink",
              )}
            >
              {n.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8">{children}</div>
    </Container>
  );
}
