import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { packages } from "@/config/packages";
import { services } from "@/config/services";
import { resources } from "@/config/resources";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes = [
    "",
    "/packages",
    "/services",
    "/how-it-works",
    "/for-the-diaspora",
    "/about",
    "/get-a-quote",
    "/protect-my-family",
    "/arrange-a-funeral",
    "/contact",
    "/faq",
    "/gallery",
    "/resources",
    "/digital-services",
    "/tribute",
    "/custom-caskets",
    "/funeral-livestreaming",
    "/travel-pack",
    "/will-writing",
    "/grief-support",
    "/legal/terms",
    "/legal/privacy",
    "/legal/cookies",
    "/legal/policy-information",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...packages.map((p) => ({ url: `${base}/packages/${p.slug}`, lastModified: now, priority: 0.8 })),
    ...services.map((s) => ({ url: `${base}/services/${s.slug}`, lastModified: now, priority: 0.6 })),
    ...resources.map((r) => ({ url: `${base}/resources/${r.slug}`, lastModified: now, priority: 0.5 })),
  ];
}
