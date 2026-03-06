import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getAllPosts, getAllCategories } from "@/lib/blog";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = await getAllPosts(locale);
  const categories = await getAllCategories();
  const prefix = locale === "en" ? "" : `/${locale}`;

  return (
    <div className="container mx-auto px-6 md:px-12 py-16 md:py-24">
      <div className="mb-12 text-center">
        <h1 className="heading-lg mb-4">{t("title")}</h1>
        <p className="body-lg text-[var(--blog-text-muted)] max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`${prefix}/blog/category/${cat}`}
              className="blog-category-badge hover:opacity-80 transition-opacity"
            >
              {t(`categories.${cat}`)}
            </Link>
          ))}
        </div>
      )}

      {posts.length === 0 ? (
        <p className="body-lg text-[var(--blog-text-muted)] text-center py-20">
          {t("noPosts")}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
