import { useTranslations, useLocale } from "next-intl";
import { getTranslations, getLocale } from "next-intl/server";
import type { BlogPostMeta } from "@/lib/blog-types";
import { getRelatedPosts } from "@/lib/blog";
import { BlogPostCard } from "./blog-post-card";

interface BlogPostContentProps {
  meta: BlogPostMeta;
  children: React.ReactNode;
}

export async function BlogPostContent({
  meta,
  children,
}: BlogPostContentProps) {
  return (
    <article className="container mx-auto max-w-3xl px-6 md:px-12 py-16 md:py-24">
      <PostHeader meta={meta} />
      <div className="blog-prose mt-8">{children}</div>
      <AuthorBio />
      <RelatedPostsSection slug={meta.slug} />
    </article>
  );
}

function PostHeader({ meta }: { meta: BlogPostMeta }) {
  const t = useTranslations("blog");
  const locale = useLocale();

  const date = new Date(meta.publishedAt).toLocaleDateString(
    locale === "es" ? "es-MX" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <header>
      <div className="flex items-center gap-2 mb-4">
        <span className="blog-category-badge">
          {t(`categories.${meta.category}`)}
        </span>
        <span className="text-xs text-[var(--blog-text-muted)]">
          {meta.readingTime} {t("minutesRead")}
        </span>
      </div>
      <h1 className="heading-lg !text-3xl sm:!text-4xl leading-tight mb-4">
        {meta.title}
      </h1>
      <p className="body-lg text-[var(--blog-text-muted)] mb-4">
        {meta.description}
      </p>
      <div className="flex items-center gap-4 body-sm text-[var(--blog-text-muted)]">
        <span>{meta.author}</span>
        <span>&middot;</span>
        <time dateTime={meta.publishedAt}>{date}</time>
        {meta.updatedAt && (
          <>
            <span>&middot;</span>
            <span>
              {t("updated")}{" "}
              {new Date(meta.updatedAt).toLocaleDateString(
                locale === "es" ? "es-MX" : "en-US",
                { year: "numeric", month: "long", day: "numeric" }
              )}
            </span>
          </>
        )}
      </div>
    </header>
  );
}

function AuthorBio() {
  const t = useTranslations("blog");

  return (
    <div className="mt-12 pt-8 border-t border-[var(--blog-border)]">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-[#BEB09E] font-sans font-bold text-lg shrink-0">
          SR
        </div>
        <div>
          <p className="font-semibold text-sm">Sully Ruiz</p>
          <p className="text-sm text-[var(--blog-text-muted)] mt-1">
            {t("authorBio")}
          </p>
        </div>
      </div>
    </div>
  );
}

async function RelatedPostsSection({ slug }: { slug: string }) {
  const t = await getTranslations("blog");
  const locale = await getLocale();
  const related = await getRelatedPosts(slug, locale);

  if (related.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-[var(--blog-border)]">
      <h2 className="text-xl font-bold mb-6">{t("relatedPosts")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
