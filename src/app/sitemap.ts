import type { MetadataRoute } from "next";
import { SITEMAP_QUERY } from "@/sanity/lib/queries";
import { loadQuery, publishedOptions } from "@/sanity/lib/live";
import { siteUrl } from "@/sanity/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await loadQuery({ query: SITEMAP_QUERY, ...publishedOptions });
  const staticRoutes = ["", "/a-propos", "/realisations", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  return [
    ...staticRoutes,
    ...data.projects.map((p) => ({
      url: `${siteUrl}/realisations/${p.slug}`,
      lastModified: p._updatedAt,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...data.legal.map((p) => ({
      url: `${siteUrl}/${p.slug}`,
      lastModified: p._updatedAt,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}
