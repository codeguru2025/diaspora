export function formatPrice(
  amount: string | number | null | undefined,
  currency = "USD",
): string | null {
  if (amount === null || amount === undefined || amount === "") return null;
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (Number.isNaN(n)) return null;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(n);
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
}

export function scheduleLabel(schedule: string): string {
  return (
    { monthly: "/ month", weekly: "/ week", biweekly: "/ fortnight", yearly: "/ year" }[
      schedule
    ] ?? ""
  );
}
