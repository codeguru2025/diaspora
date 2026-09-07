import { cn } from "@/lib/cn";

export function Container({
  className,
  as: Tag = "div",
  children,
}: {
  className?: string;
  as?: React.ElementType;
  children: React.ReactNode;
}) {
  return <Tag className={cn("dfs-container", className)}>{children}</Tag>;
}
