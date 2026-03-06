import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getPostsByCategory } from "@/lib/blog";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import type { BlogCategory } from "@/lib/blog-types";
import { siteConfig, getCanonicalUrl, getOgLocale } from "@/lib/seo-config";

export const dynamic = 'force-dynamic';

const VALID_CATEGORIES: BlogCategory[] = [
  "area-guide",
  "market-report",
  "buyer-guide",
  "seller-guide",
  "financing",
  "lifestyle",
  "investment",
];

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;

  if (!VALID_CATEGORIES.includes(category as BlogCategory)) return {};

  const categoryLabel = category
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const title = `${categoryLabel} | Sully Ruiz Blog`;
  const canonicalUrl = getCanonicalUrl(`/blog/category/${category}`, locale);

  return {
    title,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      locale: getOgLocale(locale),
      url: canonicalUrl,
      siteName: siteConfig.siteName,
      title,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  if (!VALID_CATEGORIES.includes(category as BlogCategory)) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = await getPostsByCategory(category as BlogCategory, locale);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          {t(`categories.${category}`)}
        </h1>
        <p className="text-lg text-[var(--blog-text-muted)]">
          {posts.length} {posts.length === 1 ? t("post") : t("posts")}
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-[var(--blog-text-muted)] text-center py-20">
          {t("noPosts")}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
