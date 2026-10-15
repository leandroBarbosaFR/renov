import type { CtaData, ImageData } from "@/lib/types";
import { BeforeAfterSlider } from "@/components/shared/BeforeAfterSlider";
import { CtaButton } from "@/components/shared/ButtonLink";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";

export interface BeforeAfterData {
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  cta?: CtaData | null;
  beforeImage?: ImageData | null;
  afterImage?: ImageData | null;
}

/** 50/50: heading and CTA on the left, interactive comparison on the right. */
export function BeforeAfterSection({ data, headingAs = "h2" }: { data: BeforeAfterData; headingAs?: "h2" | "h3" }) {
  if (!data.beforeImage?.asset || !data.afterImage?.asset) return null;
  return (
    <section className="border-t border-line">
      <div className="container-site section-y">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-0">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={data.eyebrow} title={data.title} description={data.description} as={headingAs} />
            <div className="mt-10">
              <CtaButton cta={data.cta} variant="outline" />
            </div>
          </div>
          <Reveal className="lg:col-span-6 lg:col-start-7" y={24}>
            <BeforeAfterSlider before={data.beforeImage} after={data.afterImage} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
