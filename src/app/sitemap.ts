import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getPublishedSlugs } from "@/lib/queries";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getPublishedSlugs();
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/portfolio`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    ...slugs.map((slug) => ({
      url: `${site.url}/work/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
