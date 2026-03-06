import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { getPostContent, getPostMeta, getAllPosts } from "@/lib/blog";
import { mdxComponents } from "@/components/blog/mdx-components";
import { BlogPostContent } from "@/components/blog/blog-post-content";
import { BlogStructuredData } from "@/components/blog/blog-structured-data";
import { BlogBreadcrumbs } from "@/components/blog/blog-breadcrumbs";
import { BlogCTA } from "@/components/blog/blog-cta";
import {
  siteConfig,
  getCanonicalUrl,
  getOgLocale,
} from "@/lib/seo-config";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const meta = await getPostMeta(slug);
  if (!meta) return {};

  const canonicalUrl = getCanonicalUrl(`/blog/${slug}`, locale);

  // Only add hreflang if both locales exist
  const alternates: Metadata["alternates"] = { canonical: canonicalUrl };
  if (meta.locales.includes("en") && meta.locales.includes("es")) {
    alternates.languages = {
      en: `${siteConfig.baseUrl}/blog/${slug}`,
      es: `${siteConfig.baseUrl}/es/blog/${slug}`,
      "x-default": `${siteConfig.baseUrl}/blog/${slug}`,
    };
  }

  return {
    title: meta.title,
    description: meta.description,
    alternates,
    openGraph: {
      type: "article",
      locale: getOgLocale(locale),
      url: canonicalUrl,
      siteName: siteConfig.siteName,
      title: meta.title,
      description: meta.description,
      publishedTime: meta.publishedAt,
      modifiedTime: meta.updatedAt,
      authors: [meta.author],
      tags: meta.tags,
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  const params: { slug: string }[] = [];
  for (const post of posts) {
    params.push({ slug: post.slug });
  }
  return params;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const data = await getPostContent(slug, locale);
  if (!data) notFound();

  const { meta, content } = data;

  return (
    <>
      <BlogStructuredData meta={meta} locale={locale} />
      <BlogBreadcrumbs meta={meta} locale={locale} />
      <BlogPostContent meta={meta}>
        <MDXRemote
          source={content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
            },
          }}
        />
        <BlogCTA category={meta.category} />
      </BlogPostContent>
    </>
  );
}
