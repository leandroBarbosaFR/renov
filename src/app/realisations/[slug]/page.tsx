import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECT_QUERY, PROJECT_SLUGS_QUERY, SETTINGS_QUERY } from "@/sanity/lib/queries";
import { loadQuery, publishedOptions, type FetchOptions } from "@/sanity/lib/live";
import { WithFetchOptions } from "@/sanity/lib/render";
import { buildMetadata } from "@/lib/metadata";
import { BeforeAfterSection } from "@/components/home/BeforeAfterSection";
import { NextProject } from "@/components/projects/NextProject";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { CTASection } from "@/components/shared/CTASection";
import { PortableText } from "@/components/shared/PortableText";
import { Reveal } from "@/components/shared/Reveal";
import { SanityImage } from "@/components/shared/SanityImage";

export async function generateStaticParams() {
  const { data } = await loadQuery({ query: PROJECT_SLUGS_QUERY, ...publishedOptions });
  return data;
}

export async function generateMetadata(props: PageProps<"/realisations/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const { data } = await loadQuery({ query: PROJECT_QUERY, params: { slug }, ...publishedOptions });
  if (!data) return {};
  const fallbackTitle = [data.title, data.location].filter(Boolean).join(" — ");
  return buildMetadata({
    seo: data.seo,
    title: fallbackTitle,
    description: data.excerpt,
    path: `/realisations/${data.slug}`,
    image: data.featuredImage,
  });
}

async function Project({ slug, ...options }: FetchOptions & { slug: string }) {
  const [{ data: project }, { data: settings }] = await Promise.all([
    loadQuery({ query: PROJECT_QUERY, params: { slug }, ...options }),
    loadQuery({ query: SETTINGS_QUERY, ...options }),
  ]);
  if (!project) notFound();

  const facts = [
    project.location ? { label: "Localisation", value: project.location } : null,
    project.category?.title ? { label: "Catégorie", value: project.category.title } : null,
    project.year ? { label: "Année", value: String(project.year) } : null,
    ...(project.details ?? []).map((d) => ({ label: d.label, value: d.value })),
  ].filter((f): f is { label: string; value: string } => Boolean(f));

  const hasNarrative = project.description?.length || project.objectives?.length || project.workPerformed?.length;
  const hasBeforeAfter = project.beforeImage?.asset && project.afterImage?.asset;

  return (
    <article>
      <header className="container-site pb-12 pt-10 sm:pt-14 lg:pb-16 lg:pt-20">
        <nav aria-label="Fil d’Ariane" className="animate-rise text-sm text-stone">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/realisations" className="link-line pb-0.5 hover:text-ink">
                Réalisations
              </Link>
            </li>
            <li aria-hidden className="text-line">
              /
            </li>
            <li aria-current="page" className="text-ink">
              {project.title}
            </li>
          </ol>
        </nav>
        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow animate-rise" style={{ animationDelay: "60ms" }}>
              {[project.category?.title, project.location].filter(Boolean).join(" · ")}
            </p>
            <h1 className="text-display mt-8 animate-rise" style={{ animationDelay: "120ms" }}>
              {project.title}
            </h1>
          </div>
          {project.excerpt && (
            <p className="text-lead animate-rise lg:col-span-4" style={{ animationDelay: "200ms" }}>
              {project.excerpt}
            </p>
          )}
        </div>
      </header>

      <div className="container-site">
        <div className="relative aspect-[4/5] overflow-hidden rounded-card sm:aspect-[16/9]">
          <SanityImage image={project.featuredImage} sizes="(min-width: 1440px) 1344px, 100vw" priority />
        </div>
      </div>

      <section aria-label="Le projet" className="container-site section-y">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-0">
          <div className="flex flex-col gap-14 lg:col-span-6">
            {project.description && project.description.length > 0 && (
              <div>
                <h2 className="eyebrow">Le projet</h2>
                <PortableText value={project.description} className="mt-6 text-[1.0625rem]" />
              </div>
            )}
            {project.objectives && project.objectives.length > 0 && (
              <div>
                <h2 className="eyebrow">Objectifs</h2>
                <PortableText value={project.objectives} className="mt-6 text-[1.0625rem]" />
              </div>
            )}
            {project.workPerformed && project.workPerformed.length > 0 && (
              <div>
                <h2 className="eyebrow">Travaux réalisés</h2>
                <ul className="mt-6 border-t border-line">
                  {project.workPerformed.map((item, i) => (
                    <li key={i} className="flex gap-6 border-b border-line py-4 text-[1.0625rem]">
                      <span className="w-6 shrink-0 pt-1 text-xs tabular-nums text-accent-deep">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {!hasNarrative && <p className="text-lead">La description de ce projet sera bientôt disponible.</p>}
          </div>

          {facts.length > 0 && (
            <aside className="lg:col-span-5 lg:col-start-8">
              <div className="lg:sticky lg:top-32">
                <h2 className="eyebrow">Informations</h2>
                <dl className="mt-6 border-t border-line">
                  {facts.map((fact, i) => (
                    <Reveal key={i} delay={i * 0.04} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 border-b border-line py-5">
                      <dt className="text-sm text-stone">{fact.label}</dt>
                      <dd className="font-display text-lg tracking-[-0.015em]">{fact.value}</dd>
                    </Reveal>
                  ))}
                </dl>
              </div>
            </aside>
          )}
        </div>
      </section>

      <ProjectGallery items={project.gallery} />

      {hasBeforeAfter && (
        <div className="bg-paper">
          <BeforeAfterSection
            data={{
              eyebrow: "La transformation",
              title: "Avant / Après",
              description: "Faites glisser le curseur pour comparer l’espace avant et après les travaux.",
              beforeImage: project.beforeImage,
              afterImage: project.afterImage,
            }}
          />
        </div>
      )}

      <NextProject project={project.next} />
      <CTASection data={settings?.contactCta} />
    </article>
  );
}

export default async function ProjectPage(props: PageProps<"/realisations/[slug]">) {
  const { slug } = await props.params;
  return <WithFetchOptions render={(options) => <Project slug={slug} {...options} />} />;
}
