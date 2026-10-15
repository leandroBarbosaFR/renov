"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { CtaData, ImageData } from "@/lib/types";
import { clean, cn } from "@/lib/utils";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Logo } from "./Logo";

export interface NavLink {
  _key?: string;
  label: string;
  href: string;
}

function isActive(pathname: string, href: string) {
  const target = clean(href);
  return target === "/" ? pathname === "/" : pathname === target || pathname.startsWith(`${target}/`);
}

export function Navbar({
  companyName,
  logo,
  links,
  cta,
}: {
  companyName: string;
  logo?: ImageData | null;
  links: NavLink[];
  cta?: CtaData | null;
}) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mobile menu on navigation.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-sand/90 backdrop-blur-md transition-colors duration-300",
          scrolled || open ? "border-line" : "border-transparent",
        )}
      >
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-sand"
        >
          Aller au contenu
        </a>
        <div className="container-site flex h-16 items-center justify-between gap-8 lg:h-20">
          <Logo name={companyName} logo={logo} />

          <nav aria-label="Navigation principale" className="hidden items-center gap-10 md:flex">
            <ul className="flex items-center gap-8 lg:gap-10">
              {links.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link._key ?? link.href}>
                    <Link
                      href={clean(link.href)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "link-line pb-1 text-[0.875rem] transition-colors duration-300",
                        active ? "text-ink" : "text-stone hover:text-ink",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            {cta?.label && cta.href && (
              <ButtonLink href={cta.href} arrow={false} className="min-h-10 px-5 text-[0.8125rem]">
                {cta.label}
              </ButtonLink>
            )}
          </nav>

          <button
            type="button"
            className="-mr-2 flex size-11 items-center justify-center md:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-6">
              <span
                className={cn(
                  "absolute left-0 top-0 h-px w-6 bg-ink transition-transform duration-300",
                  open && "translate-y-1.5 rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-px w-6 bg-ink transition-transform duration-300",
                  open && "-translate-y-1.5 -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Outside <header>: its backdrop-filter would otherwise contain this fixed overlay. */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col overflow-y-auto border-t border-line bg-sand md:hidden"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label="Navigation mobile" className="container-site flex flex-1 flex-col justify-between py-10">
              <ul className="flex flex-col">
                {links.map((link, i) => {
                  const active = isActive(pathname, link.href);
                  return (
                    <motion.li
                      key={link._key ?? link.href}
                      className="border-b border-line"
                      initial={reduce ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.05 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={clean(link.href)}
                        aria-current={active ? "page" : undefined}
                        className="flex items-baseline justify-between py-5 font-display text-3xl tracking-[-0.03em] text-ink/55 aria-[current=page]:text-ink"
                      >
                        {link.label}
                        <span className="text-xs tabular-nums text-stone">{String(i + 1).padStart(2, "0")}</span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
              {cta?.label && cta.href && (
                <ButtonLink href={cta.href} className="mt-10 w-full">
                  {cta.label}
                </ButtonLink>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
