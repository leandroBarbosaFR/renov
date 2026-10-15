import type { HOME_QUERY_RESULT } from "@/sanity/types";
import { CtaButton } from "@/components/shared/ButtonLink";
import { EmptyState } from "@/components/shared/EmptyState";
import { Reveal } from "@/components/shared/Reveal";
import { ProjectCard } from "./ProjectCard";

type ProjectsData = NonNullable<NonNullable<HOME_QUERY_RESULT>["projects"]>;

/** One large lead project and two supporting cards in an offset editorial grid. */
export function FeaturedProjects({ data }: { data: ProjectsData }) {
  const items = (data.items ?? []).filter((p): p is NonNullable<typeof p> => Boolean(p?.slug));
  const [lead, ...rest] = items;

  return (
    <section aria-labelledby="projects-title" className="border-t border-line bg-paper">
      <div className="container-site section-y">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-6" y={12}>
            <h2 id="projects-title" className="text-h2">
              {data.title || "Nos réalisations"}
            </h2>
          </Reveal>
          <div className="flex flex-col items-start gap-8 lg:col-span-5 lg:col-start-8">
            {data.subtitle && <p className="text-lead">{data.subtitle}</p>}
          </div>
        </div>

        {lead ? (
          <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-x-8">
            <Reveal className="lg:col-span-7">
              <ProjectCard
                project={lead}
                size="lg"
                aspect="aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]"
                sizes="(min-width: 1440px) 800px, (min-width: 1024px) 58vw, 100vw"
              />
            </Reveal>
            {rest.length > 0 && (
              <div className="flex flex-col gap-14 lg:col-span-4 lg:col-start-9 lg:pt-40">
                {rest.slice(0, 2).map((project, i) => (
                  <Reveal key={project._id} delay={0.08 * (i + 1)}>
                    <ProjectCard
                      project={project}
                      aspect={i === 0 ? "aspect-[4/3]" : "aspect-[4/5]"}
                      sizes="(min-width: 1440px) 460px, (min-width: 1024px) 33vw, 100vw"
                    />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            className="mt-16"
            title="Les réalisations arrivent bientôt."
            description="Ajoutez des projets dans le Studio pour les afficher ici."
          />
        )}

        {data.cta && (
          <div className="mt-20 flex justify-center border-t border-line pt-12 lg:mt-28">
            <CtaButton cta={data.cta} variant="outline" />
          </div>
        )}
      </div>
    </section>
  );
}
