import { MetadataRoute } from "next";
import {
  siteConfig,
  publicPages,
  getAlternateLinks,
} from "@/lib/seo-config";
import { getPostsIndex, getAllCategories } from "@/lib/blog";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of publicPages) {
    const alternates = getAlternateLinks(page.path);
    const pathSuffix = page.path === "/" ? "" : page.path;

    // English version (no prefix)
    entries.push({
      url: `${siteConfig.baseUrl}${pathSuffix}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: {
          en: alternates.en,
          es: alternates.es,
        },
      },
    });

    // Spanish version (with /es prefix)
    entries.push({
      url: `${siteConfig.baseUrl}/es${pathSuffix}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: {
          en: alternates.en,
          es: alternates.es,
        },
      },
    });
  }

  // Blog posts
  const index = await getPostsIndex();
  for (const post of index.posts.filter((p) => !p.draft)) {
    const hasEn = post.locales.includes("en");
    const hasEs = post.locales.includes("es");

    const languages: Record<string, string> = {};
    if (hasEn) languages.en = `${siteConfig.baseUrl}/blog/${post.slug}`;
    if (hasEs) languages.es = `${siteConfig.baseUrl}/es/blog/${post.slug}`;

    if (hasEn) {
      entries.push({
        url: `${siteConfig.baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt || post.publishedAt),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: { languages },
      });
    }

    if (hasEs) {
      entries.push({
        url: `${siteConfig.baseUrl}/es/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt || post.publishedAt),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: { languages },
      });
    }
  }

  // Category pages
  const categories = await getAllCategories();
  for (const cat of categories) {
    entries.push({
      url: `${siteConfig.baseUrl}/blog/category/${cat}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    });
    entries.push({
      url: `${siteConfig.baseUrl}/es/blog/category/${cat}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    });
  }

  return entries;
}
