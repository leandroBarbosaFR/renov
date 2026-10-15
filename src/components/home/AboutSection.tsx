import type { HOME_QUERY_RESULT } from "@/sanity/types";
import { CtaButton } from "@/components/shared/ButtonLink";
import { Reveal } from "@/components/shared/Reveal";
import { SanityImage } from "@/components/shared/SanityImage";

type AboutData = NonNullable<NonNullable<HOME_QUERY_RESULT>["about"]>;

/** 50/50 editorial block: image left, text right. */
export function AboutSection({ data }: { data: AboutData }) {
  if (!data.title) return null;
  return (
    <section aria-labelledby="about-title" className="border-t border-line">
      <div className="container-site section-y">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-0">
          <Reveal className="relative aspect-[4/5] lg:col-span-6 lg:aspect-[5/6]">
            <SanityImage image={data.image} sizes="(min-width: 1440px) 720px, (min-width: 1024px) 50vw, 100vw" className="rounded-card" />
          </Reveal>

          <div className="flex flex-col justify-center lg:col-span-5 lg:col-start-8">
            {data.eyebrow && <p className="eyebrow">{data.eyebrow}</p>}
            <Reveal y={12}>
              <h2 id="about-title" className="text-h2 mt-6">
                {data.title}
              </h2>
            </Reveal>
            {data.description && (
              <Reveal delay={0.08}>
                <p className="text-lead mt-8">{data.description}</p>
              </Reveal>
            )}
            {data.values && data.values.length > 0 && (
              <ul className="mt-12 border-t border-line">
                {data.values.map((value, i) => (
                  <Reveal as="li" key={i} delay={0.06 * i} className="flex items-baseline gap-6 border-b border-line py-5">
                    <span className="w-6 shrink-0 text-xs tabular-nums text-accent-deep">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-display text-lg tracking-[-0.02em]">{value}</span>
                  </Reveal>
                ))}
              </ul>
            )}
            <div className="mt-12">
              <CtaButton cta={data.cta} variant="outline" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
