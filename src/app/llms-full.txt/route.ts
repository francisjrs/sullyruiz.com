import { NextResponse } from "next/server";
import { getAllPosts, getPostContent } from "@/lib/blog";
import { siteConfig, businessInfo } from "@/lib/seo-config";

export const revalidate = 86400;

export async function GET() {
  const posts = await getAllPosts("en");
  const limited = posts.slice(0, 50);

  const sections = [
    `# ${businessInfo.name} — Full Blog Content`,
    "",
    `> Complete content from ${siteConfig.baseUrl}/blog for AI assistants and search engines.`,
    "",
    `Agent: ${businessInfo.name}, ${businessInfo.brokerage}`,
    `License: TREC #${businessInfo.licenseNumber}`,
    `Service Areas: ${businessInfo.serviceAreas.join(", ")}`,
    `Languages: English, Spanish`,
    `Website: ${siteConfig.baseUrl}`,
    "",
  ];

  for (const post of limited) {
    const data = await getPostContent(post.slug, "en");
    if (!data) continue;

    sections.push(
      `---`,
      "",
      `## ${data.meta.title}`,
      "",
      `URL: ${siteConfig.baseUrl}/blog/${data.meta.slug}`,
      `Category: ${data.meta.category}`,
      `Cities: ${data.meta.cities.join(", ")}`,
      `Author: ${data.meta.author}`,
      `Published: ${data.meta.publishedAt}`,
      `Tags: ${data.meta.tags.join(", ")}`,
      "",
      data.content,
      ""
    );
  }

  if (limited.length === 0) {
    sections.push(
      "---",
      "",
      "No blog posts published yet. Content is published daily covering:",
      "",
      "- Area guides for Central Texas cities along the I-35 corridor",
      "- Monthly market reports for Austin metro area",
      "- Buyer and seller educational guides",
      "- Financing tips for first-time and ITIN buyers",
      ""
    );
  }

  return new NextResponse(sections.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
