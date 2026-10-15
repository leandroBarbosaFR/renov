import type { HOME_QUERY_RESULT } from "@/sanity/types";
import { CtaButton } from "@/components/shared/ButtonLink";
import { SanityImage } from "@/components/shared/SanityImage";

type HeroData = NonNullable<NonNullable<HOME_QUERY_RESULT>["hero"]>;

export function Hero({ data }: { data: HeroData }) {
  return (
    <section aria-labelledby="hero-title" className="relative grid lg:min-h-[calc(100svh-5rem)] lg:grid-cols-2">
      <div className="flex lg:items-end">
        <div className="container-site flex flex-col pb-14 pt-14 sm:pt-20 lg:mr-0 lg:max-w-[45rem] lg:pb-24 lg:pr-16 lg:pt-24">
          {data.eyebrow && (
            <p className="eyebrow animate-rise" style={{ animationDelay: "60ms" }}>
              {data.eyebrow}
            </p>
          )}
          <h1 id="hero-title" className="text-display mt-8 max-w-[11ch] animate-rise" style={{ animationDelay: "120ms" }}>
            {data.title}
          </h1>
          {data.description && (
            <p className="text-lead mt-8 max-w-md animate-rise" style={{ animationDelay: "220ms" }}>
              {data.description}
            </p>
          )}
          {(data.primaryCta || data.secondaryCta) && (
            <div className="mt-10 flex flex-col gap-3 animate-rise sm:flex-row" style={{ animationDelay: "320ms" }}>
              <CtaButton cta={data.primaryCta} />
              <CtaButton cta={data.secondaryCta} variant="outline" arrow={false} />
            </div>
          )}
        </div>
      </div>

      <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-auto">
        <SanityImage image={data.image} sizes="(min-width: 1024px) 50vw, 100vw" priority />
      </div>
    </section>
  );
}
