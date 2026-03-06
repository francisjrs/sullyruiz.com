import { siteConfig, businessInfo } from "@/lib/seo-config";
import type { BlogPostMeta } from "@/lib/blog-types";

interface BlogStructuredDataProps {
  meta: BlogPostMeta;
  locale: string;
}

export function BlogStructuredData({ meta, locale }: BlogStructuredDataProps) {
  const canonicalUrl =
    locale === "en"
      ? `${siteConfig.baseUrl}/blog/${meta.slug}`
      : `${siteConfig.baseUrl}/${locale}/blog/${meta.slug}`;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    url: canonicalUrl,
    datePublished: meta.publishedAt,
    dateModified: meta.updatedAt || meta.publishedAt,
    author: {
      "@id": `${siteConfig.baseUrl}/#person`,
    },
    publisher: {
      "@id": `${siteConfig.baseUrl}/#organization`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    inLanguage: locale === "es" ? "es-MX" : "en-US",
    keywords: meta.tags.join(", "),
    ...(meta.coverImage && {
      image: {
        "@type": "ImageObject",
        url: meta.coverImage,
      },
    }),
    wordCount: meta.readingTime * 200,
    articleSection: meta.category,
  };

  // LocalBusiness schema per city
  const citySchemas = meta.cities.map((city) => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.baseUrl}/#business-${city.toLowerCase().replace(/\s+/g, "-")}`,
    name: `${businessInfo.name} - ${city} Real Estate`,
    url: canonicalUrl,
    areaServed: {
      "@type": "City",
      name: city,
      containedInPlace: {
        "@type": "State",
        name: "Texas",
      },
    },
    parentOrganization: {
      "@id": `${siteConfig.baseUrl}/#organization`,
    },
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingSchema),
        }}
      />
      {citySchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}
