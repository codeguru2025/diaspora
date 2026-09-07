"use client";

import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelection, toggleService } from "@/lib/selection-store";
import { track } from "@/lib/analytics";

export function AddToFuneralButton({ slug, name }: { slug: string; name: string }) {
  const selection = useSelection();
  const selected = selection.serviceSlugs.includes(slug);

  return (
    <Button
      type="button"
      variant={selected ? "secondary" : "primary"}
      size="sm"
      onClick={() => {
        const nowSelected = toggleService(slug);
        track({ name: nowSelected ? "service_added" : "service_removed", slug });
      }}
    >
      {selected ? (
        <>
          <Check className="size-4" /> Added to your funeral
        </>
      ) : (
        <>
          <Plus className="size-4" /> Add {name} to My Funeral
        </>
      )}
    </Button>
  );
}
