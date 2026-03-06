import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "anthropic-ai",
          "ClaudeBot",
          "PerplexityBot",
          "Google-Extended",
        ],
        allow: ["/", "/blog/", "/llms.txt", "/llms-full.txt"],
        disallow: "/api/",
      },
    ],
    sitemap: `${siteConfig.baseUrl}/sitemap.xml`,
  };
}
