"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export type AccordionItem = { id: string; title: React.ReactNode; content: React.ReactNode };

export function Accordion({
  items,
  className,
  defaultOpen,
}: {
  items: AccordionItem[];
  className?: string;
  defaultOpen?: string;
}) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);
  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((it) => {
        const isOpen = open === it.id;
        return (
          <div key={it.id}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : it.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-medium text-ink"
              >
                <span className="font-[family-name:var(--font-sans)] text-[1.05rem]">{it.title}</span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                    "size-5 shrink-0 text-stone transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
            </h3>
            <div hidden={!isOpen} className="pb-6 pr-8 text-[0.98rem] leading-relaxed text-charcoal">
              {it.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
