"use client";

import { useEffect, useId, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { getConsent, onConsentChange, onConsentOpen, openConsentPreferences, setConsent } from "@/lib/consent";
import { clean, cn } from "@/lib/utils";

const subscribe = (cb: () => void) => onConsentChange(cb);
// Snapshot is a primitive so React can compare it between renders.
const getSnapshot = () => (getConsent() ? "set" : "unset");
const getServerSnapshot = () => "pending";

export function CookieBanner({
  title,
  text,
  privacySlug,
}: {
  title?: string | null;
  text?: string | null;
  privacySlug?: string | null;
}) {
  const status = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [reopened, setReopened] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const reduce = useReducedMotion();
  const titleId = useId();

  useEffect(
    () =>
      onConsentOpen(() => {
        setAnalytics(getConsent()?.analytics ?? false);
        setCustomize(true);
        setReopened(true);
      }),
    [],
  );

  const visible = status === "unset" || reopened;

  const save = (value: boolean) => {
    setConsent({ analytics: value });
    setReopened(false);
    setCustomize(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          className="fixed inset-x-3 bottom-3 z-[60] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[26rem]"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="rounded-card border border-line bg-paper p-6 shadow-[0_24px_60px_-30px_rgba(34,37,35,0.35)]">
            <p id={titleId} className="font-display text-lg font-medium tracking-[-0.02em]">
              {title || "Vos préférences cookies"}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-stone">
              {text ||
                "Nous utilisons des cookies nécessaires au bon fonctionnement du site. Avec votre accord, des cookies de mesure d’audience peuvent nous aider à l’améliorer."}{" "}
              {privacySlug && (
                <Link href={`/${clean(privacySlug)}`} className="text-ink underline underline-offset-2">
                  En savoir plus
                </Link>
              )}
            </p>

            {customize && (
              <fieldset className="mt-5 divide-y divide-line border-y border-line">
                <legend className="sr-only">Catégories de cookies</legend>
                <label className="flex items-start justify-between gap-4 py-3.5 text-sm">
                  <span>
                    <span className="block font-medium">Nécessaires</span>
                    <span className="mt-0.5 block text-stone">Fonctionnement du site et mémorisation de vos choix.</span>
                  </span>
                  <span className="mt-0.5 shrink-0 text-xs uppercase tracking-[0.14em] text-stone">Toujours actifs</span>
                </label>
                <Toggle
                  label="Mesure d’audience"
                  description="Statistiques anonymes de fréquentation."
                  checked={analytics}
                  onChange={setAnalytics}
                />
              </fieldset>
            )}

            <div className="mt-6 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => save(false)} className={buttonClass("outline")}>
                Tout refuser
              </button>
              <button type="button" onClick={() => save(true)} className={buttonClass("primary")}>
                Tout accepter
              </button>
              {customize ? (
                <button type="button" onClick={() => save(analytics)} className={cn(buttonClass("outline"), "col-span-2")}>
                  Enregistrer mes choix
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCustomize(true)}
                  className="col-span-2 py-2 text-sm text-stone underline underline-offset-2 hover:text-ink"
                >
                  Personnaliser
                </button>
              )}
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

function buttonClass(variant: "primary" | "outline") {
  return cn(
    "min-h-11 rounded-card border px-4 text-sm font-medium transition-colors duration-300",
    variant === "primary"
      ? "border-olive bg-olive text-sand hover:bg-olive-deep"
      : "border-ink/70 text-ink hover:bg-ink hover:text-sand",
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 py-3.5 text-sm">
      <span>
        <span className="block font-medium">{label}</span>
        <span className="mt-0.5 block text-stone">{description}</span>
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className="relative mt-0.5 h-5 w-9 shrink-0 rounded-card border border-ink/40 transition-colors duration-300 peer-checked:border-olive peer-checked:bg-olive peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink peer-checked:[&>span]:translate-x-4 peer-checked:[&>span]:bg-sand"
      >
        <span className="absolute left-0.5 top-0.5 size-3.5 rounded-[1px] bg-ink/50 transition-transform duration-300" />
      </span>
    </label>
  );
}

export function ManageCookiesButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openConsentPreferences} className={className}>
      Gérer les cookies
    </button>
  );
}
