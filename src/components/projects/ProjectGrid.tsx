"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { clean, cn } from "@/lib/utils";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProjectCard, type ProjectCardData } from "./ProjectCard";

interface Category {
  _id: string;
  title: string;
  slug: string;
}

const ALL = "__all__";

export function ProjectGrid({
  projects,
  categories,
  allLabel = "Tous les projets",
}: {
  projects: ProjectCardData[];
  categories: Category[];
  allLabel?: string;
}) {
  const [active, setActive] = useState(ALL);
  const reduce = useReducedMotion();

  const visible = useMemo(
    () => (active === ALL ? projects : projects.filter((p) => clean(p.category?.slug) === active)),
    [active, projects],
  );

  if (projects.length === 0) {
    return (
      <EmptyState
        title="Aucune réalisation pour le moment."
        description="Les projets publiés dans le Studio apparaîtront ici."
      />
    );
  }

  const filters = [{ _id: ALL, title: allLabel, slug: ALL }, ...categories];

  return (
    <div>
      {categories.length > 1 && (
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div role="group" aria-label="Filtrer par catégorie" className="flex min-w-max gap-2 border-b border-line pb-6">
            {filters.map((filter) => {
              const value = filter.slug === ALL ? ALL : clean(filter.slug);
              const pressed = active === value;
              const count =
                value === ALL ? projects.length : projects.filter((p) => clean(p.category?.slug) === value).length;
              return (
                <button
                  key={filter._id}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => setActive(value)}
                  className={cn(
                    "inline-flex min-h-10 items-center gap-2 rounded-card border px-4 text-sm transition-colors duration-300",
                    pressed ? "border-ink bg-ink text-sand" : "border-line text-stone hover:border-ink/40 hover:text-ink",
                  )}
                >
                  {filter.title}
                  <span className={cn("text-xs tabular-nums", pressed ? "text-sand/60" : "text-stone/60")}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {visible.length} projet{visible.length > 1 ? "s" : ""} affiché{visible.length > 1 ? "s" : ""}
      </p>

      <ul className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:mt-16 lg:gap-y-24">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project, i) => (
            <motion.li
              key={project._id}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={cn(i % 2 === 1 && "md:mt-24")}
            >
              <ProjectCard project={project} aspect="aspect-[4/5]" sizes="(min-width: 1440px) 680px, (min-width: 768px) 50vw, 100vw" />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
