import type { SanityImageCrop, SanityImageHotspot } from "@/sanity/types";

/** Shape of every image projected with the `image` GROQ fragment. */
export interface ImageData {
  asset?: { _ref: string } | null;
  hotspot?: SanityImageHotspot | null;
  crop?: SanityImageCrop | null;
  alt?: string | null;
  caption?: string | null;
  lqip?: string | null;
  aspectRatio?: number | null;
}

export interface CtaData {
  label?: string | null;
  href?: string | null;
}
