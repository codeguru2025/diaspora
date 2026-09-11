"use client";

import { cta } from "@/config/site";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/button";

/** Mobile-only sticky action bar (MEGA PROMPT §41). */
export function StickyCta() {
  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-line bg-abyss/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
      <div className="mx-auto flex max-w-md gap-2">
        <Button
          href={cta.arrange.href}
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={() => track({ name: "cta_click", cta: "arrange", location: "sticky" })}
        >
          Arrange a Funeral
        </Button>
        <Button
          href={cta.protect.href}
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={() => track({ name: "cta_click", cta: "protect", location: "sticky" })}
        >
          Protect My Family
        </Button>
      </div>
    </div>
  );
}
