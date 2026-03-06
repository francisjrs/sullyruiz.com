import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";
import { businessInfo, siteConfig } from "@/lib/seo-config";

export const revalidate = 3600;

export async function GET() {
  const posts = await getAllPosts("en");
  const recent = posts.slice(0, 20);

  const lines = [
    `# ${businessInfo.name} — Central Texas Real Estate`,
    "",
    `> ${businessInfo.name} is a bilingual (English/Spanish) real estate agent at ${businessInfo.brokerage} serving the I-35 corridor in Central Texas. TREC License #${businessInfo.licenseNumber}.`,
    "",
    "## About",
    "",
    `- Name: ${businessInfo.name}`,
    `- Role: Real Estate Agent`,
    `- Brokerage: ${businessInfo.brokerage}`,
    `- License: TREC #${businessInfo.licenseNumber}`,
    `- Languages: English, Spanish`,
    `- Phone: ${businessInfo.phone}`,
    `- Email: ${businessInfo.email}`,
    `- Website: ${siteConfig.baseUrl}`,
    "",
    "## Service Areas (I-35 Corridor, Central Texas)",
    "",
    ...businessInfo.serviceAreas.map((area) => `- ${area}, TX`),
    "",
    "## Specializations",
    "",
    "- First-time home buyers",
    "- ITIN buyers",
    "- Self-employed / 1099 buyers",
    "- Down payment assistance programs",
    "- Bilingual real estate services (English/Spanish)",
    "- Central Texas relocation assistance",
    "- Market analysis and pricing strategy",
    "",
  ];

  if (recent.length > 0) {
    lines.push("## Recent Blog Posts", "");
    for (const post of recent) {
      lines.push(
        `- [${post.title}](${siteConfig.baseUrl}/blog/${post.slug}): ${post.description}`
      );
    }
    lines.push("");
  }

  lines.push(
    "## Contact",
    "",
    `- Schedule a free consultation: ${siteConfig.baseUrl}/consult`,
    `- Get a home valuation: ${siteConfig.baseUrl}/screening`,
    `- Blog (English): ${siteConfig.baseUrl}/blog`,
    `- Blog (Spanish): ${siteConfig.baseUrl}/es/blog`,
    "",
    "## Full Content",
    "",
    `For complete blog content, see: ${siteConfig.baseUrl}/llms-full.txt`
  );

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
