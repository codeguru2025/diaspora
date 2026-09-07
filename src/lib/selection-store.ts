"use client";

import { useSyncExternalStore } from "react";

/**
 * Per-viewer "funeral in progress" selection — package + chosen services.
 *
 * This is a lightweight browser-only convenience (localStorage), NOT the source of
 * truth. It powers the quote builder's resume behaviour and a future
 * abandoned-application prompt (MEGA PROMPT §44 — only ever acted on with consent
 * and once the POL263 communication path is confirmed). Wrapped in try/catch:
 * private windows and blocked storage must not break the page.
 */

const KEY = "dfs.selection.v1";

export type Selection = {
  packageSlug: string | null;
  serviceSlugs: string[];
  updatedAt: number;
};

const empty: Selection = { packageSlug: null, serviceSlugs: [], updatedAt: 0 };

export function readSelection(): Selection {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Selection;
    return {
      packageSlug: parsed.packageSlug ?? null,
      serviceSlugs: Array.isArray(parsed.serviceSlugs) ? parsed.serviceSlugs : [],
      updatedAt: parsed.updatedAt ?? 0,
    };
  } catch {
    return empty;
  }
}

function write(next: Selection) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...next, updatedAt: Date.now() }));
    window.dispatchEvent(new Event("dfs:selection"));
  } catch {
    /* storage unavailable — ignore */
  }
}

export function setPackage(slug: string | null) {
  const cur = readSelection();
  write({ ...cur, packageSlug: slug });
}

export function toggleService(slug: string): boolean {
  const cur = readSelection();
  const has = cur.serviceSlugs.includes(slug);
  const serviceSlugs = has
    ? cur.serviceSlugs.filter((s) => s !== slug)
    : [...cur.serviceSlugs, slug];
  write({ ...cur, serviceSlugs });
  return !has; // now selected?
}

export function clearSelection() {
  write(empty);
}

/* ---- React binding ---- */

function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("dfs:selection", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("dfs:selection", cb);
    window.removeEventListener("storage", cb);
  };
}

let cache: Selection = empty;
function getSnapshot(): Selection {
  const next = readSelection();
  if (
    next.packageSlug !== cache.packageSlug ||
    next.updatedAt !== cache.updatedAt ||
    next.serviceSlugs.length !== cache.serviceSlugs.length ||
    next.serviceSlugs.some((s, i) => s !== cache.serviceSlugs[i])
  ) {
    cache = next;
  }
  return cache;
}

export function useSelection(): Selection {
  return useSyncExternalStore(subscribe, getSnapshot, () => empty);
}

