import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/brand";
import { products } from "@/lib/catalog/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/catalogue`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/magasins`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/qui-sommes-nous`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/produit/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages];
}
