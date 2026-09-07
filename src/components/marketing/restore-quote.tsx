"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { decodeQuote } from "@/lib/quote-token";
import { setPackage, toggleService, readSelection } from "@/lib/selection-store";
import { writeApplication } from "@/lib/application-store";
import { track } from "@/lib/analytics";

/** "Continue to join" from a shared quote link — loads the token into this device's state. */
export function RestoreQuote({ token }: { token: string }) {
  const router = useRouter();

  function restore() {
    const data = decodeQuote(token);
    if (!data) return;
    setPackage(data.p);
    // Reset then apply the token's services.
    const current = readSelection().serviceSlugs;
    current.forEach((s) => {
      if (!data.s.includes(s)) toggleService(s);
    });
    data.s.forEach((s) => {
      if (!readSelection().serviceSlugs.includes(s)) toggleService(s);
    });
    writeApplication({
      packageSlug: data.p,
      countryOfResidence: data.r,
      serviceProvince: data.province ?? "",
      selectedServices: data.s,
    });
    track({ name: "quote_started", entry: "shared-link" });
    router.push(data.p ? `/join?package=${data.p}` : "/join");
  }

  return (
    <Button type="button" onClick={restore}>
      Continue to join
    </Button>
  );
}
