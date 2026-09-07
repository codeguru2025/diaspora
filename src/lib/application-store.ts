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
  };
  dependents: Dependent[];
  beneficiary: {
    firstName: string;
    lastName: string;
    relationship: string;
    nationalId: string;
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
  applicant: { firstName: "", lastName: "", email: "", phone: "", dateOfBirth: "", nationalId: "" },
  dependents: [],
  beneficiary: { firstName: "", lastName: "", relationship: "", nationalId: "" },
  selectedServices: [],
  updatedAt: 0,
};

export function readApplication(): Application {
  if (typeof window === "undefined") return emptyApplication;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyApplication;
    return { ...emptyApplication, ...(JSON.parse(raw) as Application) };
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
