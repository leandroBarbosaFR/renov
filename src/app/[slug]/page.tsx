import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LEGAL_PAGE_QUERY, LEGAL_SLUGS_QUERY } from "@/sanity/lib/queries";
import { loadQuery, publishedOptions, type FetchOptions } from "@/sanity/lib/live";
import { WithFetchOptions } from "@/sanity/lib/render";
import { buildMetadata } from "@/lib/metadata";
import { PortableText } from "@/components/shared/PortableText";

export async function generateStaticParams() {
  const { data } = await loadQuery({ query: LEGAL_SLUGS_QUERY, ...publishedOptions });
  return data;
}

export async function generateMetadata(props: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const { data } = await loadQuery({ query: LEGAL_PAGE_QUERY, params: { slug }, ...publishedOptions });
  if (!data) return {};
  return buildMetadata({ seo: data.seo, title: data.title, path: `/${slug}` });
}

async function LegalPage({ slug, ...options }: FetchOptions & { slug: string }) {
  const { data } = await loadQuery({ query: LEGAL_PAGE_QUERY, params: { slug }, ...options });
  if (!data) notFound();

  const updated = new Date(data._updatedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <article className="container-site section-y">
      <div className="grid gap-12 lg:grid-cols-12">
        <header className="lg:col-span-4">
          <h1 className="text-h2">{data.title}</h1>
          <p className="mt-6 text-sm text-stone">Mise à jour le {updated}</p>
        </header>
        <div className="lg:col-span-7 lg:col-start-6">
          {data.body?.length ? (
            <PortableText value={data.body} className="text-[1.0625rem]" />
          ) : (
            <p className="text-lead">Le contenu de cette page est en cours de rédaction.</p>
          )}
        </div>
      </div>
    </article>
  );
}

// Awaiting `params` inside Suspense keeps client navigations instant (Partial Prefetching).
export default function Page(props: PageProps<"/[slug]">) {
  return (
    <Suspense fallback={<LegalSkeleton />}>
      <LegalRoute params={props.params} />
    </Suspense>
  );
}

async function LegalRoute({ params }: { params: PageProps<"/[slug]">["params"] }) {
  const { slug } = await params;
  return <WithFetchOptions render={(options) => <LegalPage slug={slug} {...options} />} />;
}

function LegalSkeleton() {
  return (
    <div aria-busy="true" aria-label="Chargement de la page" className="container-site section-y">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="h-24 rounded-card bg-mist lg:col-span-4" />
        <div className="h-64 animate-pulse rounded-card bg-mist lg:col-span-7 lg:col-start-6" />
      </div>
    </div>
  );
}
