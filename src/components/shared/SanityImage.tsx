import { Image } from "next-sanity/image";
import { urlFor } from "@/sanity/lib/image";
import type { ImageData } from "@/lib/types";
import { clean, cn } from "@/lib/utils";

interface SanityImageProps {
  image?: ImageData | null;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Applied to the <img>, e.g. hover zoom transitions. */
  imgClassName?: string;
  /** Overrides the hotspot-derived object-position (keeps paired images aligned). */
  objectPosition?: string;
}

/**
 * Fills its parent (which must be positioned and sized) with a Sanity image,
 * cropped with object-fit: cover around the editor-defined hotspot.
 */
export function SanityImage({ image, sizes, priority, className, imgClassName, objectPosition }: SanityImageProps) {
  if (!image?.asset?._ref) {
    return <div aria-hidden className={cn("absolute inset-0 bg-mist", className)} />;
  }

  const position = objectPosition
    ? objectPosition
    : image.hotspot
    ? `${(image.hotspot.x ?? 0.5) * 100}% ${(image.hotspot.y ?? 0.5) * 100}%`
    : "50% 50%";

  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-mist", className)}>
      <Image
        src={urlFor(image).url()}
        alt={clean(image.alt) ?? ""}
        fill
        sizes={sizes}
        priority={priority}
        placeholder={image.lqip ? "blur" : "empty"}
        blurDataURL={image.lqip ?? undefined}
        className={cn("object-cover", imgClassName)}
        style={{ objectPosition: position }}
      />
    </div>
  );
}
