"use client";

import { Plus, X } from "lucide-react";
import { Select, TextInput } from "@/components/ui/field";
import type { OptionChoice } from "@/lib/selection-store";

/** One way a benefit is priced in POL263 (see ServiceOption in src/lib/pol263.ts). */
export type BenefitOption = {
  key: string;
  label: string;
  unitPrice: string;
  unit?: string | null;
  minQty?: number | null;
  defaultQty?: number | null;
};

const money = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: amount % 1 ? 2 : 0 }).format(amount);

/** Whole-cent multiply so 0.50 × 150 shows 75, never 74.99999. */
const lineTotal = (unitPrice: string, qty: number) => (Math.round(Number(unitPrice) * 100) * qty) / 100;

function qtyOf(o: BenefitOption, chosen?: number) {
  const min = Math.max(1, o.minQty ?? 1);
  return Math.max(min, chosen ?? o.defaultQty ?? min);
}

/**
 * Pick the option of a chosen benefit and, for per-guest/per-night/… options, how many. Several
 * options can be taken (a grave tent and chairs). Each line's value is shown; POL263 adds it to
 * every covered person's cover at their own age, so the premium updates as these change.
 */
export function BenefitChoices({
  name,
  options,
  value,
  onChange,
  included,
  currency = "USD",
}: {
  name: string;
  options: BenefitOption[];
  value: OptionChoice[];
  onChange: (next: OptionChoice[]) => void;
  /** The chosen package already includes this benefit — nothing to pick, nothing added. */
  included?: boolean;
  currency?: string;
}) {
  if (included) {
    return <p className="mt-2 text-xs font-medium text-sage">Included free with your package.</p>;
  }
  if (options.length === 0) return null;

  const rows: OptionChoice[] = value.length ? value : [{ optionKey: options[0].key }];
  const used = new Set(rows.map((r) => r.optionKey ?? options[0].key));
  const update = (i: number, patch: OptionChoice) => onChange(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  return (
    <div className="mt-3 space-y-2" onClick={(e) => e.stopPropagation()}>
      {rows.map((row, i) => {
        const opt = options.find((o) => o.key === row.optionKey) ?? options[0];
        const qty = opt.unit ? qtyOf(opt, row.quantity) : 1;
        return (
          <div key={i} className="flex flex-wrap items-center gap-2">
            <Select
              aria-label={`${name} — option ${i + 1}`}
              value={opt.key}
              onChange={(e) => update(i, { optionKey: e.target.value, quantity: undefined })}
              className="min-w-0 flex-1 py-2 text-sm"
            >
              {options
                .filter((o) => o.key === opt.key || !used.has(o.key))
                .map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label} — {money(Number(o.unitPrice), currency)}
                    {o.unit ? ` per ${o.unit}` : ""}
                  </option>
                ))}
            </Select>
            {opt.unit && (
              <label className="flex items-center gap-1.5 text-xs text-stone">
                <TextInput
                  type="number"
                  inputMode="numeric"
                  min={Math.max(1, opt.minQty ?? 1)}
                  max={5000}
                  // Shows what was typed (the usual quantity as a hint); the price uses at least the minimum.
                  value={row.quantity ?? ""}
                  placeholder={String(qtyOf(opt))}
                  onChange={(e) => {
                    const n = Math.floor(Number(e.target.value));
                    update(i, { quantity: e.target.value !== "" && Number.isFinite(n) && n > 0 ? Math.min(n, 5000) : undefined });
                  }}
                  aria-label={`How many ${opt.unit}s`}
                  className="w-24 py-2 text-sm"
                />
                {opt.unit}s{(opt.minQty ?? 1) > 1 ? ` (min ${opt.minQty})` : ""}
              </label>
            )}
            <span className="w-20 text-right text-sm font-medium text-ink">{money(lineTotal(opt.unitPrice, qty), currency)}</span>
            {rows.length > 1 && (
              <button
                type="button"
                onClick={() => onChange(rows.filter((_, j) => j !== i))}
                aria-label={`Remove ${opt.label}`}
                className="rounded-full p-1 text-mist hover:bg-line/50 hover:text-ink"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        );
      })}
      {used.size < options.length && (
        <button
          type="button"
          onClick={() => onChange([...rows, { optionKey: options.find((o) => !used.has(o.key))!.key }])}
          className="inline-flex items-center gap-1 text-xs font-medium text-champagne-deep hover:underline"
        >
          <Plus className="size-3.5" /> Add another {name.toLowerCase()} option
        </button>
      )}
    </div>
  );
}
