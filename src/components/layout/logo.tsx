import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

const WORDMARK = {
  dark: { src: "/brand/dfs-wordmark.png", width: 881, height: 257 },
  light: { src: "/brand/dfs-wordmark-light.png", width: 923, height: 335 },
} as const;

export function Logo({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const mark = WORDMARK[tone];

  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center", className)}
      aria-label="Diaspora Funeral Services — home"
    >
      <Image
        src={mark.src}
        alt="Diaspora Funeral Services"
        width={mark.width}
        height={mark.height}
        priority
        className="h-9 w-auto md:h-10"
      />
    </Link>
  );
}
