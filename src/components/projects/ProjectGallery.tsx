import type { PROJECT_QUERY_RESULT } from "@/sanity/types";
import { clean, cn } from "@/lib/utils";
import { Reveal } from "@/components/shared/Reveal";
import { SanityImage } from "@/components/shared/SanityImage";
import type { ImageData } from "@/lib/types";

type GalleryItem = NonNullable<NonNullable<PROJECT_QUERY_RESULT>["gallery"]>[number];

function Caption({ image }: { image?: ImageData | null }) {
  if (!image?.caption) return null;
  return <figcaption className="mt-3 text-[0.8125rem] text-stone">{image.caption}</figcaption>;
}

/** Photography-first gallery alternating full-width, 50/50 pairs and image + text rows. */
export function ProjectGallery({ items }: { items?: GalleryItem[] | null }) {
  if (!items?.length) return null;
  return (
    <section aria-label="Galerie du projet" className="container-site flex flex-col gap-6 pb-24 sm:gap-8 lg:pb-32">
      {items.map((item) => {
        switch (item._type) {
          case "galleryFull":
            return (
              <Reveal as="div" key={item._key}>
                <figure>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-card sm:aspect-[16/9]">
                    <SanityImage image={item.image} sizes="(min-width: 1440px) 1344px, 100vw" />
                  </div>
                  <Caption image={item.image} />
                </figure>
              </Reveal>
            );
          case "galleryPair":
            return (
              <div key={item._key} className="grid gap-6 sm:gap-8 md:grid-cols-2">
                {[item.left, item.right].map((image, i) => (
                  <Reveal key={i} delay={i * 0.08}>
                    <figure>
                      <div className="relative aspect-[4/5] overflow-hidden rounded-card">
                        <SanityImage image={image} sizes="(min-width: 1440px) 670px, (min-width: 768px) 50vw, 100vw" />
                      </div>
                      <Caption image={image} />
                    </figure>
                  </Reveal>
                ))}
              </div>
            );
          case "galleryText": {
            const right = clean(item.imagePosition) === "right";
            return (
              <div key={item._key} className="grid gap-10 py-6 md:grid-cols-12 md:items-center md:gap-0 lg:py-12">
                <Reveal className={cn("md:col-span-6", right && "md:order-2 md:col-start-7")}>
                  <figure>
                    <div className="relative aspect-[4/5] overflow-hidden rounded-card md:aspect-[5/6]">
                      <SanityImage image={item.image} sizes="(min-width: 1440px) 670px, (min-width: 768px) 50vw, 100vw" />
                    </div>
                    <Caption image={item.image} />
                  </figure>
                </Reveal>
                <div className={cn("md:col-span-4", right ? "md:order-1 md:col-start-2" : "md:col-start-8")}>
                  {item.title && <h3 className="text-h3">{item.title}</h3>}
                  <Reveal delay={0.08}>
                    <p className="text-lead mt-5 whitespace-pre-line">{item.text}</p>
                  </Reveal>
                </div>
              </div>
            );
          }
          default:
            return null;
        }
      })}
    </section>
  );
}
