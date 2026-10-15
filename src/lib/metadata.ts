import type { Metadata } from "next";
import { siteUrl } from "@/sanity/env";
import { urlFor } from "@/sanity/lib/image";
import type { ImageData } from "./types";

interface SeoData {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  noIndex?: boolean | null;
  ogImage?: string | null;
}

/** Builds page metadata from Sanity SEO fields with sensible fallbacks. Pass stega-free data only. */
export function buildMetadata({
  seo,
  title,
  description,
  path,
  image,
}: {
  seo?: SeoData | null;
  title?: string | null;
  description?: string | null;
  path: string;
  image?: ImageData | null;
}): Metadata {
  const finalTitle = seo?.metaTitle || title || undefined;
  const finalDescription = seo?.metaDescription || description || undefined;
  const ogImage =
    seo?.ogImage ??
    (image?.asset?._ref ? urlFor(image).width(1200).height(630).fit("crop").url() : undefined);

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: { canonical: seo?.canonicalUrl || `${siteUrl}${path}` },
    robots: seo?.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: `${siteUrl}${path}`,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
  };
}
