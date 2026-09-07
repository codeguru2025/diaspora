import { cn } from "@/lib/cn";

const inputCls =
  "w-full rounded-xl border border-line-strong bg-surface px-4 py-3 text-[0.98rem] text-charcoal placeholder:text-mist focus-visible:outline-2 focus-visible:outline-champagne-deep";

export function Field({
  label,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-terracotta"> *</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-stone">{hint}</span>}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputCls, props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputCls, "min-h-28 resize-y", props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={cn(inputCls, "appearance-none bg-[right_1rem_center] pr-10", props.className)}>
      {props.children}
    </select>
  );
}
