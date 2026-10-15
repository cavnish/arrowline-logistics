import type { MetadataRoute } from "next";

import { sanityFetch } from "@/lib/sanity/client";
import { sitemapQuery } from "@/lib/sanity/queries";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

interface SitemapData {
  services?: Array<{ slug: string; parent?: string | null; _updatedAt?: string }>;
  posts?: Array<{ slug: string; _updatedAt?: string }>;
  pages?: Array<{ slug: string; _updatedAt?: string }>;
  industries?: Array<{ slug: string; _updatedAt?: string }>;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/industries`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/gallery`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
  ];

  const data = await sanityFetch<SitemapData>(sitemapQuery);
  if (!data) return staticEntries;

  const serviceEntries: MetadataRoute.Sitemap = (data.services || []).map((service) => ({
    url: service.parent
      ? `${SITE_URL}/services/${service.parent}/${service.slug}`
      : `${SITE_URL}/services/${service.slug}`,
    lastModified: service._updatedAt ? new Date(service._updatedAt) : now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const postEntries: MetadataRoute.Sitemap = (data.posts || []).map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post._updatedAt ? new Date(post._updatedAt) : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const pageEntries: MetadataRoute.Sitemap = (data.pages || []).map((page) => ({
    url: `${SITE_URL}/${page.slug}`,
    lastModified: page._updatedAt ? new Date(page._updatedAt) : now,
    changeFrequency: "yearly",
    priority: 0.4,
  }));

  return [...staticEntries, ...serviceEntries, ...postEntries, ...pageEntries];
}
