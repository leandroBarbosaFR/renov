"use client";

import { useCallback, useId, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";
import type { ImageData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SanityImage } from "./SanityImage";

const KEY_STEP = 2;
const PAGE_STEP = 10;

export function BeforeAfterSlider({
  before,
  after,
  beforeLabel = "Avant",
  afterLabel = "Après",
  aspect = "aspect-[4/5] sm:aspect-[4/3]",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  initial = 50,
  className,
}: {
  before: ImageData;
  after: ImageData;
  beforeLabel?: string;
  afterLabel?: string;
  /** Tailwind aspect classes; the box size never depends on the images, so nothing shifts. */
  aspect?: string;
  sizes?: string;
  initial?: number;
  className?: string;
}) {
  const [position, setPosition] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const descriptionId = useId();

  const updateFromClientX = useCallback((clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    updateFromClientX(event.clientX);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragging) updateFromClientX(event.clientX);
  };

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = {
      ArrowLeft: -KEY_STEP,
      ArrowDown: -KEY_STEP,
      ArrowRight: KEY_STEP,
      ArrowUp: KEY_STEP,
      PageDown: -PAGE_STEP,
      PageUp: PAGE_STEP,
    };
    if (event.key in moves) {
      event.preventDefault();
      setPosition((p) => Math.min(100, Math.max(0, p + moves[event.key])));
    } else if (event.key === "Home") {
      event.preventDefault();
      setPosition(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setPosition(100);
    }
  };

  const rounded = Math.round(position);
  // Animate jumps (click, keyboard) but follow the pointer 1:1 while dragging.
  const motion = dragging ? "" : "transition-[clip-path,left] duration-300 ease-out-soft motion-reduce:transition-none";

  return (
    <figure className={cn("relative", className)}>
      <div
        ref={frameRef}
        className={cn(
          "relative w-full select-none overflow-hidden rounded-card bg-mist",
          "touch-pan-y",
          dragging ? "cursor-grabbing" : "cursor-ew-resize",
          aspect,
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
      >
        {/* After: full frame underneath */}
        <SanityImage image={after} sizes={sizes} objectPosition="50% 50%" />

        {/* Before: same frame, revealed from the left */}
        <div
          className={cn("absolute inset-0", motion)}
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          aria-hidden
        >
          <SanityImage image={before} sizes={sizes} objectPosition="50% 50%" />
        </div>

        <span
          className={cn(
            "pointer-events-none absolute left-4 top-4 rounded-card bg-ink/70 px-2.5 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-sand backdrop-blur-sm transition-opacity duration-300",
            position < 12 && "opacity-0",
          )}
        >
          {beforeLabel}
        </span>
        <span
          className={cn(
            "pointer-events-none absolute right-4 top-4 rounded-card bg-sand/85 px-2.5 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-ink backdrop-blur-sm transition-opacity duration-300",
            position > 88 && "opacity-0",
          )}
        >
          {afterLabel}
        </span>

        {/* Divider + handle */}
        <div
          className={cn("pointer-events-none absolute inset-y-0 -ml-px w-0.5 bg-sand", motion)}
          style={{ left: `${position}%` }}
        >
          <div
            role="slider"
            tabIndex={0}
            aria-label={`Comparer ${beforeLabel.toLowerCase()} et ${afterLabel.toLowerCase()}`}
            aria-describedby={descriptionId}
            aria-orientation="horizontal"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={rounded}
            aria-valuetext={`${rounded} % ${beforeLabel.toLowerCase()}`}
            onKeyDown={onKeyDown}
            className={cn(
              "pointer-events-auto absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-card border border-sand bg-sand/90 text-ink shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-sm transition-transform duration-300",
              dragging ? "scale-95" : "hover:scale-105",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand",
            )}
          >
            <MoveHorizontal aria-hidden strokeWidth={1.5} className="size-5" />
          </div>
        </div>
      </div>
      <figcaption id={descriptionId} className="sr-only">
        Faites glisser la poignée ou utilisez les flèches du clavier pour comparer les photos avant et après
        rénovation.
      </figcaption>
    </figure>
  );
}
