"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/cn";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

const SITE_KEY = "0x4AAAAAAE-Fp7TW9unU1vRu";

export type TurnstileHandle = {
  reset: () => void;
};

/**
 * Cloudflare Turnstile widget. Only used immediately before write actions that
 * create real records (leads, funeral requests, policy registration, portal
 * sign-in) — never on the quote-estimate step, which doesn't persist anything.
 */
export const Turnstile = forwardRef<TurnstileHandle, { onToken: (token: string | null) => void; className?: string }>(
  function Turnstile({ onToken, className }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);

    useImperativeHandle(ref, () => ({
      reset() {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
      },
    }));

    useEffect(() => {
      let cancelled = false;
      let pollId: ReturnType<typeof setInterval> | null = null;

      function render() {
        if (cancelled || !containerRef.current || !window.turnstile || widgetIdRef.current) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          callback: (token) => onToken(token),
          "expired-callback": () => onToken(null),
          "error-callback": () => onToken(null),
        });
      }

      if (window.turnstile) {
        render();
      } else {
        pollId = setInterval(() => {
          if (window.turnstile) {
            if (pollId) clearInterval(pollId);
            render();
          }
        }, 100);
      }

      return () => {
        cancelled = true;
        if (pollId) clearInterval(pollId);
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div ref={containerRef} className={cn(className)} />;
  },
);
