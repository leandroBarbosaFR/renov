import type { Metadata } from "next";
import { ABOUT_QUERY, SETTINGS_QUERY } from "@/sanity/lib/queries";
import { loadQuery, publishedOptions, type FetchOptions } from "@/sanity/lib/live";
import { WithFetchOptions } from "@/sanity/lib/render";
import { buildMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import { CTASection } from "@/components/shared/CTASection";
import { EmptyState } from "@/components/shared/EmptyState";
import { PortableText } from "@/components/shared/PortableText";
import { Reveal } from "@/components/shared/Reveal";
import { SanityImage } from "@/components/shared/SanityImage";

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await loadQuery({ query: ABOUT_QUERY, ...publishedOptions });
  return buildMetadata({
    seo: data?.seo,
    title: data?.title ?? "À propos",
    description: data?.intro,
    path: "/a-propos",
    image: data?.heroImage,
  });
}

async function About(options: FetchOptions) {
  const [{ data }, { data: settings }] = await Promise.all([
    loadQuery({ query: ABOUT_QUERY, ...options }),
    loadQuery({ query: SETTINGS_QUERY, ...options }),
  ]);

  if (!data?.title) {
    return (
      <div className="container-site section-y">
        <EmptyState title="Cette page est en cours de rédaction." description="Renseignez le document « À propos » dans le Studio." />
      </div>
    );
  }

  return (
    <>
      <header className="container-site pb-14 pt-16 sm:pt-24 lg:pb-20 lg:pt-32">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            {data.eyebrow && <p className="eyebrow animate-rise">{data.eyebrow}</p>}
            <h1 className="text-display mt-8 animate-rise" style={{ animationDelay: "100ms" }}>
              {data.title}
            </h1>
          </div>
          {data.intro && (
            <p className="text-lead animate-rise lg:col-span-4 lg:col-start-9" style={{ animationDelay: "200ms" }}>
              {data.intro}
            </p>
          )}
        </div>
      </header>

      {data.heroImage?.asset && (
        <div className="container-site">
          <div className="relative aspect-[4/3] overflow-hidden rounded-card sm:aspect-[21/9]">
            <SanityImage image={data.heroImage} sizes="(min-width: 1440px) 1344px, 100vw" priority />
          </div>
        </div>
      )}

      {data.sections?.map((section, i) => {
        const imageRight = i % 2 === 1;
        return (
          <section key={section._key} className="container-site section-y">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-0">
              {section.image?.asset && (
                <Reveal className={cn("relative aspect-[4/5] lg:col-span-6", imageRight && "lg:order-2 lg:col-start-7")}>
                  <SanityImage image={section.image} sizes="(min-width: 1440px) 670px, (min-width: 1024px) 50vw, 100vw" className="rounded-card" />
                </Reveal>
              )}
              <div
                className={cn(
                  "lg:col-span-5",
                  !section.image?.asset ? "lg:col-span-8" : imageRight ? "lg:order-1 lg:col-start-1" : "lg:col-start-8",
                )}
              >
                {section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}
                <Reveal y={12}>
                  <h2 className="text-h2 mt-6">{section.title}</h2>
                </Reveal>
                <PortableText value={section.body} className="mt-8 text-[1.0625rem]" />
              </div>
            </div>
          </section>
        );
      })}

      {data.values && data.values.length > 0 && (
        <section aria-labelledby="values-title" className="border-t border-line bg-paper">
          <div className="container-site section-y">
            <h2 id="values-title" className="text-h2 max-w-2xl">
              {data.valuesTitle || "Nos engagements"}
            </h2>
            <ol className="mt-16 grid gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-3">
              {data.values.map((value, i) => (
                <Reveal as="li" key={value._key} delay={i * 0.06} className="flex flex-col bg-paper p-8 lg:p-10">
                  <span className="text-xs tabular-nums text-accent-deep">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-h3 mt-14">{value.title}</h3>
                  {value.description && <p className="mt-4 leading-relaxed text-stone">{value.description}</p>}
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      <CTASection data={settings?.contactCta} />
    </>
  );
}

export default function AboutPage() {
  return <WithFetchOptions render={(options) => <About {...options} />} />;
}
