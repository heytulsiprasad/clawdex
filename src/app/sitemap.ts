import { MetadataRoute } from "next";
import { client } from "@/lib/sanity/client";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://claudex.io";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all use case slugs with their last modified dates
  const useCases = await client.fetch<
    { slug: string; _updatedAt: string }[]
  >(`*[_type == "useCase" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }`);

  // Fetch all category slugs
  const categories = await client.fetch<
    { slug: string; _updatedAt: string }[]
  >(`*[_type == "category" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }`);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/browse`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/bookmarks`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.4,
    },
  ];

  // Use case pages
  const useCasePages: MetadataRoute.Sitemap = useCases.map((useCase) => ({
    url: `${baseUrl}/use-case/${useCase.slug}`,
    lastModified: new Date(useCase._updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date(category._updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...useCasePages, ...categoryPages];
}
