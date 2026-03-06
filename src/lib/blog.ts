import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type {
  BlogPostMeta,
  BlogPostFrontmatter,
  PostsIndex,
  PublishPayload,
  BlogCategory,
} from "./blog-types";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const INDEX_PATH = path.join(CONTENT_DIR, "posts-index.json");

// --- Read operations ---

export async function getPostsIndex(): Promise<PostsIndex> {
  try {
    const raw = await fs.readFile(INDEX_PATH, "utf-8");
    return JSON.parse(raw) as PostsIndex;
  } catch {
    return { version: 1, lastUpdated: "", posts: [] };
  }
}

export async function getAllPosts(
  locale?: string
): Promise<BlogPostMeta[]> {
  const index = await getPostsIndex();
  let posts = index.posts.filter((p) => !p.draft);
  if (locale) {
    posts = posts.filter((p) => p.locales.includes(locale));
  }
  return posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getPostMeta(
  slug: string
): Promise<BlogPostMeta | null> {
  const index = await getPostsIndex();
  return index.posts.find((p) => p.slug === slug) ?? null;
}

export async function getPostContent(
  slug: string,
  locale: string
): Promise<{ meta: BlogPostMeta; content: string } | null> {
  const meta = await getPostMeta(slug);
  if (!meta || !meta.locales.includes(locale)) return null;

  const filePath = path.join(CONTENT_DIR, slug, `${locale}.mdx`);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const { content } = matter(raw);
    return { meta, content };
  } catch {
    return null;
  }
}

export async function getPostsByCategory(
  category: BlogCategory,
  locale?: string
): Promise<BlogPostMeta[]> {
  const posts = await getAllPosts(locale);
  return posts.filter((p) => p.category === category);
}

export async function getPostsByTag(
  tag: string,
  locale?: string
): Promise<BlogPostMeta[]> {
  const posts = await getAllPosts(locale);
  return posts.filter((p) => p.tags.includes(tag));
}

export async function getAllCategories(): Promise<BlogCategory[]> {
  const posts = await getAllPosts();
  const categories = new Set(posts.map((p) => p.category));
  return Array.from(categories);
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tags = new Set(posts.flatMap((p) => p.tags));
  return Array.from(tags).sort();
}

export async function getRelatedPosts(
  slug: string,
  locale: string,
  limit = 3
): Promise<BlogPostMeta[]> {
  const current = await getPostMeta(slug);
  if (!current) return [];

  const allPosts = await getAllPosts(locale);
  const others = allPosts.filter((p) => p.slug !== slug);

  // Score by shared tags + same category
  const scored = others.map((p) => {
    let score = 0;
    if (p.category === current.category) score += 2;
    for (const tag of p.tags) {
      if (current.tags.includes(tag)) score += 1;
    }
    for (const city of p.cities) {
      if (current.cities.includes(city)) score += 1;
    }
    return { post: p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.post);
}

// --- Write operations ---

export async function writePost(payload: PublishPayload): Promise<void> {
  const postDir = path.join(CONTENT_DIR, payload.slug);
  await fs.mkdir(postDir, { recursive: true });

  const frontmatter: BlogPostFrontmatter = {
    title: payload.title,
    description: payload.description,
    category: payload.category,
    tags: payload.tags,
    cities: payload.cities,
    author: payload.author || "Sully Ruiz",
    publishedAt: new Date().toISOString(),
    ...(payload.coverImage && { coverImage: payload.coverImage }),
    ...(payload.coverImageAlt && { coverImageAlt: payload.coverImageAlt }),
    ...(payload.featured !== undefined && { featured: payload.featured }),
    ...(payload.draft !== undefined && { draft: payload.draft }),
  };

  // Check if file already exists to preserve publishedAt
  const filePath = path.join(postDir, `${payload.locale}.mdx`);
  try {
    const existing = await fs.readFile(filePath, "utf-8");
    const { data } = matter(existing);
    if (data.publishedAt) {
      frontmatter.publishedAt = data.publishedAt;
      frontmatter.updatedAt = new Date().toISOString();
    }
  } catch {
    // New file
  }

  const fileContent = matter.stringify(payload.content, frontmatter);

  // Atomic write: write to temp, then rename
  const tempPath = filePath + ".tmp";
  await fs.writeFile(tempPath, fileContent, "utf-8");
  await fs.rename(tempPath, filePath);
}

export async function updateIndex(slug: string): Promise<void> {
  const postDir = path.join(CONTENT_DIR, slug);
  const locales: string[] = [];
  let frontmatter: BlogPostFrontmatter | null = null;
  let wordCount = 0;

  for (const locale of ["en", "es"]) {
    const filePath = path.join(postDir, `${locale}.mdx`);
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      const { data, content } = matter(raw);
      locales.push(locale);
      if (!frontmatter) {
        frontmatter = data as BlogPostFrontmatter;
      }
      if (locale === "en" || (!wordCount && content)) {
        wordCount = readingTime(content).minutes;
      }
    } catch {
      // Locale file doesn't exist
    }
  }

  if (!frontmatter || locales.length === 0) return;

  const meta: BlogPostMeta = {
    ...frontmatter,
    slug,
    locales,
    readingTime: Math.ceil(wordCount) || 1,
  };

  const index = await getPostsIndex();
  const existingIdx = index.posts.findIndex((p) => p.slug === slug);
  if (existingIdx >= 0) {
    index.posts[existingIdx] = meta;
  } else {
    index.posts.push(meta);
  }
  index.lastUpdated = new Date().toISOString();

  // Atomic write
  const tempPath = INDEX_PATH + ".tmp";
  await fs.writeFile(tempPath, JSON.stringify(index, null, 2), "utf-8");
  await fs.rename(tempPath, INDEX_PATH);
}
