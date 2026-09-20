"use client";

import { useSyncExternalStore } from "react";

/**
 * The in-progress DFS application, held on the customer's device (localStorage)
 * so the /join flow can be resumed. NOT the source of truth — POL263 owns the
 * real policy once submitted. Cleared on successful submission.
 */

const KEY = "dfs.application.v1";

export type Dependent = {
  firstName: string;
  lastName: string;
  relationship: string;
  dateOfBirth?: string;
};

export type Application = {
  packageSlug: string | null;
  productVersionId: string | null;
  countryOfResidence: string;
  serviceProvince: string;
  paymentSchedule: string;
  currency: string;
  applicant: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    nationalId: string;
    /** POL263 requires exactly "MALE" or "FEMALE" — see client/src/pages/join/register.tsx upstream. */
    gender: string;
  };
  dependents: Dependent[];
  beneficiary: {
    firstName: string;
    lastName: string;
    relationship: string;
    nationalId: string;
    /** Required by POL263 — omitting it causes the whole beneficiary to be silently dropped. */
    phone: string;
  };
  selectedServices: string[];
  updatedAt: number;
};

export const emptyApplication: Application = {
  packageSlug: null,
  productVersionId: null,
  countryOfResidence: "ZW",
  serviceProvince: "",
  paymentSchedule: "monthly",
  currency: "USD",
  applicant: { firstName: "", lastName: "", email: "", phone: "", dateOfBirth: "", nationalId: "", gender: "" },
  dependents: [],
  beneficiary: { firstName: "", lastName: "", relationship: "", nationalId: "", phone: "" },
  selectedServices: [],
  updatedAt: 0,
};

export function readApplication(): Application {
  if (typeof window === "undefined") return emptyApplication;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyApplication;
    // A shallow spread here would let a stored `applicant`/`beneficiary` object saved before a
    // schema change (e.g. before `gender`/`phone` existed) completely replace today's defaults for
    // those nested fields, leaving them `undefined` instead of "" — merge those two nested objects
    // explicitly so an old saved application picks up new fields' defaults.
    const stored = JSON.parse(raw) as Partial<Application>;
    return {
      ...emptyApplication,
      ...stored,
      applicant: { ...emptyApplication.applicant, ...stored.applicant },
      beneficiary: { ...emptyApplication.beneficiary, ...stored.beneficiary },
    };
  } catch {
    return emptyApplication;
  }
}

export function writeApplication(patch: Partial<Application>) {
  if (typeof window === "undefined") return;
  try {
    const next = { ...readApplication(), ...patch, updatedAt: Date.now() };
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("dfs:application"));
  } catch {
    /* storage unavailable */
  }
}

export function clearApplication() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("dfs:application"));
  } catch {
    /* ignore */
  }
}

function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("dfs:application", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("dfs:application", cb);
    window.removeEventListener("storage", cb);
  };
}

let cache = emptyApplication;
function getSnapshot(): Application {
  const next = readApplication();
  if (next.updatedAt !== cache.updatedAt) cache = next;
  return cache;
}

export function useApplication(): Application {
  return useSyncExternalStore(subscribe, getSnapshot, () => emptyApplication);
}
