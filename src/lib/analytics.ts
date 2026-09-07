/**
 * Analytics event abstraction (MEGA PROMPT §54).
 *
 * The site emits a fixed vocabulary of commercial events. A concrete provider
 * (GA4, PostHog, Segment, a POL263 endpoint) is wired in later by implementing
 * `flush()` / pushing to `window.dataLayer`. Until then events are queued and,
 * in development, logged — nothing is sent anywhere.
 */

export type AnalyticsEvent =
  | { name: "cta_click"; cta: string; location: string }
  | { name: "package_viewed"; slug: string }
  | { name: "package_selected"; slug: string }
  | { name: "package_compared" }
  | { name: "quote_started"; entry: string }
  | { name: "quote_step"; step: number; stepName: string }
  | { name: "quote_completed"; packageSlug?: string; serviceCount: number }
  | { name: "service_viewed"; slug: string }
  | { name: "service_added"; slug: string }
  | { name: "service_removed"; slug: string }
  | { name: "bundle_viewed"; slug: string }
  | { name: "bundle_selected"; slug: string }
  | { name: "application_started"; packageSlug?: string }
  | { name: "application_completed" }
  | { name: "payment_started" }
  | { name: "payment_completed" }
  | { name: "funeral_request_started" }
  | { name: "funeral_request_completed" }
  | { name: "contact_request"; kind: "callback" | "message" | "bespoke" }
  | { name: "whatsapp_click"; location: string }
  | { name: "phone_click"; location: string };

const queue: (AnalyticsEvent & { ts: number })[] = [];

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: AnalyticsEvent) {
  const enriched = { ...event, ts: Date.now() };
  queue.push(enriched);

  if (typeof window !== "undefined") {
    // GTM-style sink — harmless if no container is installed.
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: `dfs_${event.name}`, ...event });
  }

  if (process.env.NODE_ENV === "development" && typeof console !== "undefined") {
    console.debug("[analytics]", enriched);
  }
}

export function getQueuedEvents() {
  return [...queue];
}
