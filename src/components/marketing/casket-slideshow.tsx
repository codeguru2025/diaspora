"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { CASKET_GALLERY_PHOTOS } from "@/lib/service-photos";

const SLIDE_MS = 5000;

/** Auto-advancing, pan-and-zoom slideshow of every real casket photo DFS has supplied. */
export function CasketSlideshow() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = CASKET_GALLERY_PHOTOS.length;

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
    return () => clearInterval(timer);
  }, [paused, count]);

  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-line shadow-[var(--shadow-raised)] sm:aspect-[21/9]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {CASKET_GALLERY_PHOTOS.map((photo, i) => (
        <div
          key={photo.src}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            i === index ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={photo.src}
            alt={photo.caption}
            fill
            sizes="(min-width: 1024px) 900px, 100vw"
            priority={i === 0}
            className="animate-ken-burns object-cover"
          />
        </div>
      ))}

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-abyss/85 via-abyss/25 to-transparent p-5">
        <p className="text-sm font-medium text-ivory">{CASKET_GALLERY_PHOTOS[index].caption}</p>
        <div className="flex gap-2">
          {CASKET_GALLERY_PHOTOS.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              aria-label={`Show ${photo.caption}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-champagne" : "w-1.5 bg-ivory/40 hover:bg-ivory/70",
              )}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="Previous casket"
        onClick={() => setIndex((i) => (i - 1 + count) % count)}
        className="absolute left-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-abyss/50 text-ivory backdrop-blur transition-colors hover:bg-abyss/70"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Next casket"
        onClick={() => setIndex((i) => (i + 1) % count)}
        className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-abyss/50 text-ivory backdrop-blur transition-colors hover:bg-abyss/70"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
