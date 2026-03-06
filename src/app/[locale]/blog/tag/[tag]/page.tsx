import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getPostsByTag, getAllTags } from "@/lib/blog";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { siteConfig, getCanonicalUrl, getOgLocale } from "@/lib/seo-config";

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}): Promise<Metadata> {
  const { locale, tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const title = `${decodedTag} | Sully Ruiz Blog`;
  const canonicalUrl = getCanonicalUrl(`/blog/tag/${tag}`, locale);

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

export default async function TagPage({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}) {
  const { locale, tag } = await params;
  setRequestLocale(locale);

  const decodedTag = decodeURIComponent(tag);
  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = await getPostsByTag(decodedTag, locale);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          #{decodedTag}
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
