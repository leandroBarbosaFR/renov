import Link from "next/link";
import type { ImageData } from "@/lib/types";
import { clean, cn } from "@/lib/utils";
import { ArrowBox } from "@/components/shared/ArrowBox";
import { SanityImage } from "@/components/shared/SanityImage";

export interface ProjectCardData {
  _id: string;
  title: string;
  slug: string;
  location?: string | null;
  year?: number | null;
  category?: { title: string; slug: string } | null;
  featuredImage?: ImageData | null;
}

export function ProjectCard({
  project,
  aspect = "aspect-[4/3]",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  size = "md",
  className,
}: {
  project: ProjectCardData;
  aspect?: string;
  sizes?: string;
  size?: "md" | "lg";
  className?: string;
}) {
  const meta = [project.location, project.category?.title].filter(Boolean);
  return (
    <article className={cn("group", className)}>
      <Link href={`/realisations/${clean(project.slug)}`} className="block">
        <div className={cn("relative overflow-hidden rounded-card", aspect)}>
          <SanityImage
            image={project.featuredImage}
            sizes={sizes}
            imgClassName="transition-transform duration-[1200ms] ease-out-soft group-hover:scale-[1.035] motion-reduce:transition-none"
          />
        </div>
        <div className="mt-5 flex items-center justify-between gap-6 border-t border-line pt-5">
          <div className="min-w-0">
            <h3
              className={cn(
                "font-display font-medium tracking-[-0.025em]",
                size === "lg" ? "text-2xl lg:text-[1.75rem]" : "text-xl",
              )}
            >
              {project.title}
            </h3>
            {meta.length > 0 && (
              <p className="mt-2 text-sm text-stone">
                {meta.map((m, i) => (
                  <span key={i}>
                    {i > 0 && <span className="mx-2 text-line">/</span>}
                    {m}
                  </span>
                ))}
              </p>
            )}
          </div>
          <ArrowBox className="bg-mist text-ink group-hover:bg-ink group-hover:text-sand" />
        </div>
      </Link>
    </article>
  );
}
