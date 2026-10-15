import type { Metadata } from "next";
import { PROJECTS_PAGE_QUERY, SETTINGS_QUERY } from "@/sanity/lib/queries";
import { loadQuery, publishedOptions, type FetchOptions } from "@/sanity/lib/live";
import { WithFetchOptions } from "@/sanity/lib/render";
import { buildMetadata } from "@/lib/metadata";
import { CTASection } from "@/components/shared/CTASection";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { clean } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await loadQuery({ query: PROJECTS_PAGE_QUERY, ...publishedOptions });
  return buildMetadata({
    seo: data.page?.seo,
    title: data.page?.title ?? "Nos réalisations",
    description: data.page?.intro,
    path: "/realisations",
    image: data.projects[0]?.featuredImage,
  });
}

async function Projects(options: FetchOptions) {
  const [{ data }, { data: settings }] = await Promise.all([
    loadQuery({ query: PROJECTS_PAGE_QUERY, ...options }),
    loadQuery({ query: SETTINGS_QUERY, ...options }),
  ]);
  const page = data.page;

  return (
    <>
      <header className="container-site pb-14 pt-16 sm:pt-24 lg:pb-20 lg:pt-32">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow animate-rise">{page?.eyebrow || "Portfolio"}</p>
            <h1 className="text-display mt-8 animate-rise" style={{ animationDelay: "100ms" }}>
              {page?.title || "Nos réalisations"}
            </h1>
          </div>
          {page?.intro && (
            <p className="text-lead animate-rise lg:col-span-4 lg:col-start-9" style={{ animationDelay: "200ms" }}>
              {page.intro}
            </p>
          )}
        </div>
      </header>

      <section aria-label="Projets" className="container-site pb-24 lg:pb-36">
        <ProjectGrid
          projects={data.projects}
          categories={data.categories}
          allLabel={page?.allLabel ? clean(page.allLabel) : undefined}
        />
      </section>

      <CTASection data={settings?.contactCta} />
    </>
  );
}

export default function ProjectsPage() {
  return <WithFetchOptions render={(options) => <Projects {...options} />} />;
}
