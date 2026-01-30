import { MetadataRoute } from "next";
import {
  siteConfig,
  publicPages,
  getAlternateLinks,
} from "@/lib/seo-config";

export default function sitemap(): MetadataRoute.Sitemap {
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

  return entries;
}
