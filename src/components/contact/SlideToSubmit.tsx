"use client";

import { useEffect, useId, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { ArrowRight, LoaderCircle } from "lucide-react";

const PADDING = 4;
const HANDLE = 48;
/** Share of the track the handle must cover before the form submits. */
const THRESHOLD = 0.85;

/**
 * Slide-to-send submit control. The handle is a real submit button, so keyboard
 * (Enter / Space) and implicit form submission keep working; pointer users drag it
 * to the right end to send. Released early, it springs back to the start.
 */
export function SlideToSubmit({ label, pending }: { label: string; pending: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pendingRef = useRef(pending);
  const [max, setMax] = useState(0);
  const reduce = useReducedMotion();
  const hintId = useId();

  const x = useMotionValue(0);
  const labelOpacity = useTransform(x, (v) => (max ? 1 - Math.min(1, v / (max * 0.6)) : 1));
  const fillWidth = useTransform(x, (v) => v + HANDLE + PADDING * 2);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setMax(Math.max(0, track.clientWidth - HANDLE - PADDING * 2));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  // Slide back once a submission finishes without leaving the form (server error).
  useEffect(() => {
    const wasPending = pendingRef.current;
    pendingRef.current = pending;
    if (wasPending && !pending) {
      animate(x, 0, reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 });
    }
  }, [pending, reduce, x]);

  const springBack = () => animate(x, 0, reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 });

  const submit = () => {
    animate(x, max, { duration: reduce ? 0 : 0.15 });
    const button = buttonRef.current;
    button?.form?.requestSubmit(button);
    // Client-side validation may stop the submission; if nothing started, slide back.
    window.setTimeout(() => {
      if (!pendingRef.current) springBack();
    }, 250);
  };

  return (
    <div className="w-full sm:w-[23rem]">
      <div
        ref={trackRef}
        className="relative flex h-14 select-none items-center overflow-hidden rounded-card bg-olive"
      >
        <motion.div aria-hidden className="absolute inset-y-0 left-0 bg-olive-deep" style={{ width: fillWidth }} />
        <motion.span
          aria-hidden
          style={{ opacity: pending ? 1 : labelOpacity, paddingLeft: HANDLE + PADDING * 2 + 16 }}
          className="relative w-full pr-6 text-center text-[0.9375rem] font-medium text-sand"
        >
          {pending ? "Envoi en cours…" : label}
        </motion.span>

        <motion.button
          ref={buttonRef}
          type="submit"
          aria-label={label}
          aria-describedby={hintId}
          disabled={pending}
          drag={pending ? false : "x"}
          dragConstraints={{ left: 0, right: max }}
          dragElastic={0}
          dragMomentum={false}
          onDragEnd={() => (max > 0 && x.get() >= max * THRESHOLD ? submit() : springBack())}
          onClick={(event) => {
            // Keyboard activation and Enter-in-field submissions have detail 0: let them submit.
            if (event.detail === 0) return;
            event.preventDefault();
            // A plain click hints that the handle slides.
            if (x.get() === 0 && !reduce) animate(x, [0, 28, 0], { duration: 0.6, ease: "easeInOut" });
          }}
          style={{ x, left: PADDING, top: PADDING, touchAction: "pan-y" }}
          className="absolute z-10 flex size-12 cursor-grab items-center justify-center rounded-card bg-sand text-olive active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand disabled:cursor-wait"
        >
          {pending ? (
            <LoaderCircle aria-hidden strokeWidth={1.5} className="size-5 animate-spin" />
          ) : (
            <ArrowRight aria-hidden strokeWidth={1.5} className="size-[18px]" />
          )}
        </motion.button>
      </div>
      <p id={hintId} className="mt-3 text-[0.8125rem] text-stone">
        Faites glisser la flèche vers la droite pour envoyer, ou appuyez sur Entrée.
      </p>
    </div>
  );
}
