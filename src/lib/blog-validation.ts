import { z } from "zod";

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

const BLOG_CATEGORIES = [
  "area-guide",
  "market-report",
  "buyer-guide",
  "seller-guide",
  "financing",
  "lifestyle",
  "investment",
] as const;

export const publishSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(120)
    .regex(SLUG_REGEX, "Slug must be lowercase alphanumeric with hyphens")
    .refine((s) => !s.includes(".."), "Invalid slug"),
  locale: z.enum(["en", "es"]),
  title: z.string().min(10).max(200),
  description: z.string().min(50).max(320),
  content: z.string().min(500),
  category: z.enum(BLOG_CATEGORIES),
  tags: z.array(z.string().min(2).max(50)).min(1).max(10),
  cities: z.array(z.string().min(2).max(50)).max(10).default([]),
  author: z.string().max(100).optional(),
  coverImage: z.string().url().optional(),
  coverImageAlt: z.string().max(200).optional(),
  featured: z.boolean().optional(),
  draft: z.boolean().optional(),
});

export type ValidatedPublishPayload = z.infer<typeof publishSchema>;

export function sanitizeMdxContent(content: string): string {
  // Strip dangerous patterns from MDX content
  let sanitized = content;

  // Remove script tags
  sanitized = sanitized.replace(/<script[\s\S]*?<\/script>/gi, "");
  sanitized = sanitized.replace(/<script[^>]*\/>/gi, "");

  // Remove import/export statements (MDX security)
  sanitized = sanitized.replace(
    /^(import|export)\s+.*$/gm,
    ""
  );

  return sanitized.trim();
}
