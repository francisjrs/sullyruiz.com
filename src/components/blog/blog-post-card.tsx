import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import type { BlogPostMeta } from "@/lib/blog-types";

interface BlogPostCardProps {
  post: BlogPostMeta;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const t = useTranslations("blog");
  const locale = useLocale();
  const prefix = locale === "en" ? "" : `/${locale}`;

  const date = new Date(post.publishedAt).toLocaleDateString(
    locale === "es" ? "es-MX" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <Link href={`${prefix}/blog/${post.slug}`} className="block blog-card">
      <article className="border border-[var(--blog-border)] overflow-hidden bg-white">
        {post.coverImage && (
          <div className="relative aspect-[16/9]">
            <Image
              src={post.coverImage}
              alt={post.coverImageAlt || post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="blog-category-badge">
              {t(`categories.${post.category}`)}
            </span>
            <span className="text-xs text-[var(--blog-text-muted)]">
              {post.readingTime} {t("minutesRead")}
            </span>
          </div>
          <h3 className="text-lg font-bold leading-snug mb-2">
            {post.title}
          </h3>
          <p className="text-sm text-[var(--blog-text-muted)] line-clamp-2 mb-3">
            {post.description}
          </p>
          <div className="flex items-center justify-between">
            <time
              dateTime={post.publishedAt}
              className="text-xs text-[var(--blog-text-muted)]"
            >
              {date}
            </time>
            <span className="text-xs font-semibold text-[var(--blog-accent)]">
              {t("readMore")} &rarr;
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
