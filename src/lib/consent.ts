"use client";

import { useSyncExternalStore } from "react";

/**
 * Cookie / analytics consent (privacy-first).
 *
 * Default is "unset" → no analytics provider loads, nothing but essential local
 * storage is used. The banner lets the visitor accept or decline; the choice is
 * remembered on their device. Declining is a first-class outcome, not a nag.
 */

const KEY = "dfs.consent.v1";
export type ConsentState = "unset" | "granted" | "denied";

export function readConsent(): ConsentState {
  if (typeof window === "undefined") return "unset";
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : "unset";
  } catch {
    return "unset";
  }
}

export function setConsent(state: Exclude<ConsentState, "unset">) {
  try {
    window.localStorage.setItem(KEY, state);
    window.dispatchEvent(new Event("dfs:consent"));
  } catch {
    /* ignore */
  }
}

export function analyticsAllowed(): boolean {
  return readConsent() === "granted";
}

function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("dfs:consent", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("dfs:consent", cb);
    window.removeEventListener("storage", cb);
  };
}

export function useConsent(): ConsentState {
  return useSyncExternalStore(subscribe, readConsent, () => "unset");
}
