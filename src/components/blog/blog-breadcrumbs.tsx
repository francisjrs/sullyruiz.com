import Link from "next/link";
import { siteConfig } from "@/lib/seo-config";
import type { BlogPostMeta } from "@/lib/blog-types";

interface BlogBreadcrumbsProps {
  meta: BlogPostMeta;
  locale: string;
}

export function BlogBreadcrumbs({ meta, locale }: BlogBreadcrumbsProps) {
  const prefix = locale === "en" ? "" : `/${locale}`;
  const homeUrl = `${siteConfig.baseUrl}${prefix || ""}`;
  const blogUrl = `${siteConfig.baseUrl}${prefix}/blog`;
  const categoryUrl = `${siteConfig.baseUrl}${prefix}/blog/category/${meta.category}`;
  const postUrl = `${siteConfig.baseUrl}${prefix}/blog/${meta.slug}`;

  const categoryLabel = meta.category
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "es" ? "Inicio" : "Home",
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: blogUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: categoryLabel,
        item: categoryUrl,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: meta.title,
        item: postUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-6"
      >
        <ol className="flex flex-wrap items-center gap-1 text-xs text-[var(--blog-text-muted)]">
          <li>
            <Link href={`${prefix}/`} className="hover:text-[var(--blog-accent)]">
              {locale === "es" ? "Inicio" : "Home"}
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href={`${prefix}/blog`}
              className="hover:text-[var(--blog-accent)]"
            >
              Blog
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href={`${prefix}/blog/category/${meta.category}`}
              className="hover:text-[var(--blog-accent)]"
            >
              {categoryLabel}
            </Link>
          </li>
          <li>/</li>
          <li className="text-[var(--blog-text)] font-medium truncate max-w-[200px]">
            {meta.title}
          </li>
        </ol>
      </nav>
    </>
  );
}
