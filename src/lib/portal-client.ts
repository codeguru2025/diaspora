"use client";

import { useCallback, useEffect, useState } from "react";

/** Thin client for the proxied POL263 customer-portal API (`/api/portal/*`). */

export type PortalClient = { id: string; firstName: string; lastName: string; email?: string; phone?: string };

export type PortalStatus =
  | { state: "loading" }
  | { state: "unconfigured" }
  | { state: "signed-out" }
  | { state: "signed-in"; client: PortalClient };

export async function portalGet<T>(path: string): Promise<T> {
  const res = await fetch(`/api/portal/${path}`, { headers: { accept: "application/json" } });
  if (res.status === 503) throw new PortalError("unconfigured", "Portal not connected");
  if (res.status === 401) throw new PortalError("unauthorized", "Not signed in");
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new PortalError("error", data.message || "Request failed");
  return data as T;
}

export async function portalPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api/portal/${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (res.status === 503) throw new PortalError("unconfigured", "Portal not connected");
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new PortalError("error", data.message || "Request failed");
  return data as T;
}

export class PortalError extends Error {
  constructor(
    public kind: "unconfigured" | "unauthorized" | "error",
    message: string,
  ) {
    super(message);
  }
}

export function usePortalSession() {
  const [status, setStatus] = useState<PortalStatus>({ state: "loading" });

  const refresh = useCallback(async () => {
    try {
      const data = await portalGet<{ client: PortalClient }>("me");
      setStatus({ state: "signed-in", client: data.client });
    } catch (e) {
      if (e instanceof PortalError && e.kind === "unconfigured") setStatus({ state: "unconfigured" });
      else setStatus({ state: "signed-out" });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { status, refresh };
}
