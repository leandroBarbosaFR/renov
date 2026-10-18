import Link from "next/link";
import { clean } from "@/lib/utils";
import { ArrowBox } from "@/components/shared/ArrowBox";
import { SanityImage } from "@/components/shared/SanityImage";
import type { ProjectCardData } from "./ProjectCard";

/** Full-bleed teaser for the following project. */
export function NextProject({ project }: { project?: ProjectCardData | null }) {
  if (!project?.slug) return null;
  return (
    <section aria-label="Projet suivant" className="border-t border-line">
      <Link href={`/realisations/${clean(project.slug)}`} className="group relative block overflow-hidden">
        <div className="relative aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]">
          <SanityImage
            image={project.featuredImage}
            sizes="100vw"
            imgClassName="transition-transform duration-[1400ms] ease-out-soft group-hover:scale-[1.03] motion-reduce:transition-none"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <div className="container-site flex flex-col gap-6 pb-10 text-sand sm:flex-row sm:items-end sm:justify-between lg:pb-16">
            <div>
              <p className="eyebrow !text-sand/70">Projet suivant</p>
              <p className="text-h2 mt-4">{project.title}</p>
              {project.location && <p className="mt-3 text-sand/75">{project.location}</p>}
            </div>
            <span className="inline-flex min-h-12 w-fit items-center gap-5 rounded-card border border-sand/60 py-[3px] pl-6 pr-[3px] text-[0.9375rem] font-medium transition-colors duration-300 group-hover:bg-sand group-hover:text-ink">
              Découvrir le projet
              <ArrowBox className="bg-sand text-ink group-hover:bg-ink group-hover:text-sand" />
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
