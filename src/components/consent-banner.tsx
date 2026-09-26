"use client";

import Link from "next/link";
import { useConsent, setConsent } from "@/lib/consent";
import { Button } from "@/components/ui/button";

const HAS_PROVIDER =
  !!process.env.NEXT_PUBLIC_GA4_ID || !!process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export function ConsentBanner() {
  const consent = useConsent();

  // Nothing to consent to if no analytics provider is configured.
  if (!HAS_PROVIDER || consent !== "unset") return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-0 bottom-16 z-50 px-3 lg:bottom-4"
    >
      <div className="mx-auto max-w-2xl dfs-card rounded-[4px] p-4 shadow-[var(--shadow-raised)]">
        <p className="text-sm text-charcoal">
          We&rsquo;d like to use privacy-friendly analytics to understand how this site is used and
          improve it. Essential features work either way.{" "}
          <Link href="/legal/cookies" className="underline">
            Cookie Policy
          </Link>
          .
        </p>
        <div className="mt-3 flex gap-2">
          <Button size="sm" onClick={() => setConsent("granted")}>
            Accept analytics
          </Button>
          <Button size="sm" variant="outline" onClick={() => setConsent("denied")}>
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
}
