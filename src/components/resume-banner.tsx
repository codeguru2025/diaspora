"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import Link from "next/link";
import { useSelection, clearSelection } from "@/lib/selection-store";
import { useApplication, clearApplication } from "@/lib/application-store";
import { useConsent } from "@/lib/consent";
import { packages } from "@/config/packages";

const HAS_ANALYTICS_PROVIDER =
  !!process.env.NEXT_PUBLIC_GA4_ID || !!process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

/**
 * On-site recovery for an unfinished quote / application (MEGA PROMPT §44).
 *
 * This is the ON-SITE prompt only. No email/SMS "you left something behind"
 * messaging is sent — that waits until the communication architecture and
 * consent requirements are confirmed with DFS.
 */

const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const HIDE_ON = ["/get-a-quote", "/join"];

export function ResumeBanner() {
  const pathname = usePathname();
  const selection = useSelection();
  const app = useApplication();
  const consent = useConsent();
  const [dismissed, setDismissed] = useState(false);
  const [now] = useState(() => Date.now());

  if (dismissed || HIDE_ON.some((p) => pathname.startsWith(p))) return null;
  // Let the consent banner have the screen first.
  if (HAS_ANALYTICS_PROVIDER && consent === "unset") return null;

  const appActive =
    app.updatedAt > 0 &&
    now - app.updatedAt < MAX_AGE_MS &&
    (app.applicant.firstName || app.dependents.length > 0);
  const quoteActive =
    selection.updatedAt > 0 &&
    now - selection.updatedAt < MAX_AGE_MS &&
    (selection.packageSlug || selection.serviceSlugs.length > 0);

  if (!appActive && !quoteActive) return null;

  const pkgSlug = app.packageSlug ?? selection.packageSlug;
  const pkgName = packages.find((p) => p.slug === pkgSlug)?.name;
  const serviceCount = (app.selectedServices.length || selection.serviceSlugs.length) ?? 0;
  const href = appActive ? "/join" : "/get-a-quote";
  const label = appActive ? "Continue your application" : "Continue your quote";

  return (
    <div className="fixed inset-x-0 bottom-16 z-40 px-3 lg:bottom-4">
      <div className="mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-line bg-abyss px-4 py-3 text-ivory shadow-[var(--shadow-raised)]">
        <p className="flex-1 text-sm">
          You have {pkgName ? `a ${pkgName} ` : "an "}
          {appActive ? "application" : "quote"} in progress
          {serviceCount > 0 ? ` with ${serviceCount} service${serviceCount > 1 ? "s" : ""}` : ""}.
        </p>
        <Link
          href={href}
          className="shrink-0 rounded-full bg-champagne px-3 py-1.5 text-xs font-medium text-void hover:bg-champagne-deep hover:text-ivory"
        >
          {label}
        </Link>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => {
            setDismissed(true);
            if (appActive) clearApplication();
            else clearSelection();
          }}
          className="shrink-0 text-ivory/60 hover:text-ivory"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
