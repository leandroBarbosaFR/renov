import type { SETTINGS_QUERY_RESULT } from "@/sanity/types";
import { CtaButton } from "./ButtonLink";
import { Reveal } from "./Reveal";
import { SanityImage } from "./SanityImage";

type ContactCta = NonNullable<NonNullable<SETTINGS_QUERY_RESULT>["contactCta"]>;

/** 50/50 closing call to action: text on the left, architectural photo on the right. */
export function CTASection({ data }: { data?: ContactCta | null }) {
  if (!data?.title) return null;
  return (
    <section aria-labelledby="cta-title" className="border-t border-line bg-paper">
      <div className="grid lg:grid-cols-2">
        <div className="flex items-center">
          <div className="container-site section-y lg:mr-0 lg:max-w-[45rem] lg:pr-16">
            <Reveal>
              <h2 id="cta-title" className="text-h2 max-w-lg">
                {data.title}
              </h2>
            </Reveal>
            {data.description && (
              <Reveal delay={0.08}>
                <p className="text-lead mt-6 max-w-md">{data.description}</p>
              </Reveal>
            )}
            <Reveal delay={0.14} className="mt-10">
              <CtaButton cta={data.cta} />
            </Reveal>
          </div>
        </div>
        <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[36rem]">
          <SanityImage image={data.image} sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
      </div>
    </section>
  );
}
