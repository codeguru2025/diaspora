"use client";

import Script from "next/script";
import { useEffect } from "react";
import { analyticsAllowed, useConsent } from "@/lib/consent";
import { bindConsent } from "@/lib/analytics";

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

/**
 * Loads analytics providers ONLY after the visitor grants consent, and only if
 * the corresponding env var is set. Nothing loads by default.
 */
export function Analytics() {
  const consent = useConsent();

  useEffect(() => {
    bindConsent(analyticsAllowed);
  }, []);

  if (consent !== "granted") return null;

  return (
    <>
      {GA4_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('consent', 'default', { analytics_storage: 'granted' });
              gtag('config', '${GA4_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}
      {PLAUSIBLE_DOMAIN && (
        <Script
          src="https://plausible.io/js/script.manual.js"
          data-domain={PLAUSIBLE_DOMAIN}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
