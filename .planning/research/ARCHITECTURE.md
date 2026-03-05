# Architecture Research

**Domain:** SEO blog with auto-publishing API for AI search optimization
**Researched:** 2026-03-05
**Confidence:** HIGH

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     External Publishers                         │
│  ┌──────────┐                                                   │
│  │ OpenClaw │──── POST /api/blog/publish ──┐                    │
│  └──────────┘     (API key auth)           │                    │
├────────────────────────────────────────────┼────────────────────┤
│                  Next.js App Router         │                    │
│                                            ▼                    │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐        │
│  │ Blog Pages   │   │  SEO Layer   │   │ Publish API  │        │
│  │ /blog        │   │ sitemap.ts   │   │ Route Handler│        │
│  │ /blog/[slug] │   │ robots.ts    │   │ (validates,  │        │
│  │              │   │ llms.txt     │   │  writes MDX) │        │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘        │
│         │                  │                   │                │
│         ▼                  ▼                   ▼                │
│  ┌─────────────────────────────────────────────────────┐        │
│  │              Content Service (lib/blog)              │        │
│  │  - Reads/writes MDX files                            │        │
│  │  - Manages posts-index.json                          │        │
│  │  - Handles i18n (en/es) content pairs                │        │
│  └──────────────────────┬──────────────────────────────┘        │
├──────────────────────────┼──────────────────────────────────────┤
│                   File System Storage                           │
│  content/                                                       │
│  ├── blog/                                                      │
│  │   ├── posts-index.json    (metadata index)                   │
│  │   ├── area-guide-austin/                                     │
│  │   │   ├── en.mdx                                             │
│  │   │   └── es.mdx                                             │
│  │   └── market-report-jan-2026/                                │
│  │       ├── en.mdx                                             │
│  │       └── es.mdx                                             │
│  └── llms.txt                (AI search manifest)               │
├─────────────────────────────────────────────────────────────────┤
│                     AI/Search Crawlers                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Googlebot│  │ ChatGPT  │  │Perplexity│  │ Gemini   │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│  Consume: HTML pages, JSON-LD, sitemap.xml, llms.txt            │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Publish API** | Authenticate OpenClaw, validate post payload, write MDX files, update index | Next.js Route Handler at `src/app/api/blog/publish/route.ts` |
| **Content Service** | Read/write blog content, parse frontmatter, query posts by category/locale/date | `src/lib/blog.ts` — pure server-side module using `fs` |
| **Blog Pages** | Render blog index and individual post pages with i18n | `src/app/[locale]/blog/page.tsx` and `src/app/[locale]/blog/[slug]/page.tsx` |
| **SEO Layer** | Generate sitemap entries, structured data, llms.txt, OG images for blog posts | Extensions to existing `sitemap.ts`, new `BlogStructuredData` component |
| **AI Search Manifest** | Provide llms.txt with structured site summary for AI crawlers | Static route at `src/app/llms.txt/route.ts` or generated file |
| **Post Index** | JSON file tracking all post metadata for fast listing without parsing every MDX file | `content/blog/posts-index.json` |

## Recommended Project Structure

```
sullyruiz.com/
├── content/                        # Content storage (outside src/)
│   └── blog/
│       ├── posts-index.json        # Metadata index for all posts
│       ├── area-guide-austin/
│       │   ├── en.mdx              # English content with frontmatter
│       │   └── es.mdx              # Spanish content with frontmatter
│       ├── market-report-feb-2026/
│       │   ├── en.mdx
│       │   └── es.mdx
│       └── first-time-buyer-guide/
│           ├── en.mdx
│           └── es.mdx
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   └── blog/
│   │   │       ├── page.tsx                # Blog index page
│   │   │       └── [slug]/
│   │   │           ├── page.tsx            # Individual post page
│   │   │           └── opengraph-image.tsx  # Dynamic OG image per post
│   │   ├── api/
│   │   │   └── blog/
│   │   │       ├── publish/
│   │   │       │   └── route.ts            # POST: create/update post
│   │   │       └── posts/
│   │   │           └── route.ts            # GET: list posts (optional)
│   │   ├── llms.txt/
│   │   │   └── route.ts                    # Dynamic llms.txt generation
│   │   └── sitemap.ts                      # Extended with blog entries
│   ├── components/
│   │   └── blog/
│   │       ├── blog-post-content.tsx        # MDX renderer
│   │       ├── blog-post-card.tsx           # Card for blog index
│   │       ├── blog-structured-data.tsx     # Article/BlogPosting JSON-LD
│   │       ├── blog-breadcrumbs.tsx         # Breadcrumb nav + schema
│   │       └── mdx-components.tsx           # Custom MDX component map
│   ├── lib/
│   │   ├── blog.ts                          # Content service (read/write/query)
│   │   ├── blog-types.ts                    # TypeScript interfaces
│   │   └── seo-config.ts                    # Extended with blog SEO helpers
│   └── i18n/
│       └── routing.ts                       # Extended with /blog pathnames
```

### Structure Rationale

- **content/ outside src/:** Blog content lives outside the source tree because it is written at runtime by the publish API. This keeps the content volume (which grows daily) separate from application code. The Docker volume mount ensures content persists across container restarts.
- **posts-index.json:** Avoids scanning the filesystem on every blog index page load. The publish API updates this file atomically when creating new posts. Contains slug, title, date, category, tags, and locale availability.
- **Per-post directories with locale files:** Each post gets a directory named by slug. Inside, `en.mdx` and `es.mdx` hold the locale-specific content. This mirrors the existing next-intl pattern and makes bilingual content management explicit.
- **lib/blog.ts as single content service:** All filesystem access goes through one module. Blog pages and the publish API both use it. This creates a single boundary for content operations, making it easy to swap storage later (e.g., SQLite) without touching pages or API routes.

## Architectural Patterns

### Pattern 1: File-Based Content with JSON Index

**What:** Store blog posts as MDX files on disk with a companion JSON index file that tracks metadata for all posts. The index enables fast listing without parsing frontmatter from every file.

**When to use:** When you have a VPS with persistent filesystem (not serverless), content volume is moderate (hundreds to low thousands of posts), and you want zero database dependencies.

**Trade-offs:**
- Pro: Zero infrastructure beyond the filesystem. No database to maintain, backup, or migrate.
- Pro: MDX files are human-readable and git-friendly if you ever want to version them.
- Pro: Atomic writes (write temp file, rename) prevent corruption.
- Con: Index file is a single point of consistency. Must be updated atomically with post writes.
- Con: Does not scale beyond ~10K posts without adding search/query infrastructure.

**Example:**
```typescript
// lib/blog-types.ts
export interface BlogPostMeta {
  slug: string;
  title: { en: string; es: string };
  description: { en: string; es: string };
  category: 'area-guide' | 'market-report' | 'education';
  tags: string[];
  publishedAt: string;          // ISO 8601
  updatedAt: string;
  locales: ('en' | 'es')[];     // Which locale files exist
  coverImage?: string;
  cityArea?: string;            // For area guides
}

export interface PostsIndex {
  version: number;
  lastUpdated: string;
  posts: BlogPostMeta[];
}

// lib/blog.ts
import { readFile, writeFile, mkdir, rename } from 'fs/promises';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');
const INDEX_PATH = path.join(CONTENT_DIR, 'posts-index.json');

export async function getPostsIndex(): Promise<PostsIndex> {
  const raw = await readFile(INDEX_PATH, 'utf-8');
  return JSON.parse(raw);
}

export async function getPostContent(
  slug: string,
  locale: 'en' | 'es'
): Promise<string> {
  const filePath = path.join(CONTENT_DIR, slug, `${locale}.mdx`);
  return readFile(filePath, 'utf-8');
}
```

### Pattern 2: API Key Auth with Middleware Guard

**What:** Protect the publish endpoint with a bearer token (API key) validated against an environment variable. Use a reusable auth helper so future write endpoints share the same pattern.

**When to use:** For machine-to-machine APIs where the client (OpenClaw) is a trusted service with a static credential.

**Trade-offs:**
- Pro: Dead simple. One env var, one header check.
- Pro: Matches the existing pattern of using env vars for service credentials (N8N_WEBHOOK_URL, N8N_API_KEY).
- Con: API key rotation requires restarting the container with a new env var.
- Con: No per-request audit trail without adding logging.

**Example:**
```typescript
// lib/auth.ts
export function validateApiKey(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return false;

  const providedKey = authHeader.slice(7);
  const expectedKey = process.env.BLOG_PUBLISH_API_KEY;

  if (!expectedKey) return false;

  // Constant-time comparison to prevent timing attacks
  if (providedKey.length !== expectedKey.length) return false;
  let mismatch = 0;
  for (let i = 0; i < providedKey.length; i++) {
    mismatch |= providedKey.charCodeAt(i) ^ expectedKey.charCodeAt(i);
  }
  return mismatch === 0;
}
```

### Pattern 3: MDX Rendering with next-mdx-remote

**What:** Use `next-mdx-remote` (or its RSC variant `next-mdx-remote-client`) to compile MDX strings into React components at render time, rather than importing MDX files through webpack.

**When to use:** When MDX content is loaded dynamically from the filesystem or an API rather than co-located in the app directory. This is the correct choice here because content is written at runtime by OpenClaw, not at build time.

**Trade-offs:**
- Pro: Content can come from anywhere (filesystem, database, API) -- the renderer does not care.
- Pro: Works with Next.js App Router Server Components.
- Con: MDX compilation happens at render time (adds ~50-200ms per page). Mitigated by caching with ISR or `unstable_cache`.
- Con: Custom components must be passed explicitly to the renderer.

**Example:**
```typescript
// app/[locale]/blog/[slug]/page.tsx
import { compileMDX } from 'next-mdx-remote/rsc';
import { getPostContent, getPostMeta } from '@/lib/blog';
import { mdxComponents } from '@/components/blog/mdx-components';

export default async function BlogPost({ params }) {
  const { locale, slug } = await params;
  const source = await getPostContent(slug, locale);

  const { content, frontmatter } = await compileMDX({
    source,
    components: mdxComponents,
    options: { parseFrontmatter: true },
  });

  return (
    <article className="prose prose-lg max-w-3xl mx-auto">
      <h1>{frontmatter.title}</h1>
      {content}
    </article>
  );
}
```

### Pattern 4: Dynamic Sitemap Extension

**What:** Extend the existing `sitemap.ts` to include blog post entries by reading the posts index. Each post generates two sitemap entries (en + es) with proper alternate language links.

**When to use:** Always. The sitemap is the primary discovery mechanism for search crawlers.

**Trade-offs:**
- Pro: Uses existing Next.js MetadataRoute.Sitemap pattern already in the codebase.
- Pro: Automatically includes new posts as they are published.
- Con: Sitemap regenerates on every request. For large post counts, consider caching or splitting into sitemap index.

## Data Flow

### Publish Flow (OpenClaw -> Content Storage)

```
OpenClaw (AI Agent)
    │
    ├── POST /api/blog/publish
    │   Headers: Authorization: Bearer <API_KEY>
    │   Body: { slug, title, content, category, tags, locale, ... }
    │
    ▼
Publish API Route (src/app/api/blog/publish/route.ts)
    │
    ├── 1. Validate API key (lib/auth.ts)
    ├── 2. Validate payload schema (Zod or manual)
    ├── 3. Sanitize MDX content (strip dangerous patterns)
    │
    ▼
Content Service (lib/blog.ts)
    │
    ├── 4. Create post directory: content/blog/<slug>/
    ├── 5. Write MDX file: content/blog/<slug>/<locale>.mdx
    ├── 6. Read current posts-index.json
    ├── 7. Add/update post metadata in index
    ├── 8. Write updated index atomically (write temp, rename)
    │
    ▼
Response: 201 Created { slug, url }
```

### Read Flow (Crawler/User -> Rendered Page)

```
Request: GET /blog/area-guide-austin (or /es/blog/area-guide-austin)
    │
    ▼
Next.js Middleware (locale detection)
    │
    ▼
Blog Page (src/app/[locale]/blog/[slug]/page.tsx)
    │
    ├── getPostContent(slug, locale) → reads MDX from disk
    ├── compileMDX() via next-mdx-remote → React component
    ├── getPostMeta(slug) → metadata from index
    │
    ▼
Rendered HTML includes:
    ├── Blog content (article)
    ├── JSON-LD structured data (BlogPosting + author as RealEstateAgent)
    ├── Breadcrumb schema
    ├── hreflang alternate links (en ↔ es)
    ├── Canonical URL
    ├── Internal links to lead capture pages
    └── OG meta tags
```

### AI Search Discovery Flow

```
AI Crawler (ChatGPT, Gemini, Perplexity)
    │
    ├── GET /llms.txt
    │   Returns: Site summary, key pages, expertise areas, service area
    │
    ├── GET /sitemap.xml
    │   Returns: All pages including blog posts with lastmod dates
    │
    ├── GET /blog/<slug>
    │   Returns: HTML with rich JSON-LD structured data
    │   - BlogPosting schema with author, datePublished, about
    │   - RealEstateAgent schema (linked from existing site schema)
    │   - BreadcrumbList schema
    │   - LocalBusiness areaServed (service area cities)
    │
    └── Extracts: Authority signals, expertise, service areas, credentials
```

### Key Data Flows

1. **Publish flow:** OpenClaw -> API route -> content service -> filesystem. One-way write. Response is immediate (slug + URL). No async processing needed.
2. **Read flow:** HTTP request -> Next.js page -> content service -> filesystem -> MDX compiler -> HTML. Can be cached with ISR (revalidate on publish) or `unstable_cache`.
3. **Index update flow:** Publish API writes both the MDX file and the JSON index in a single operation. The index is the source of truth for listing pages and sitemap generation.
4. **SEO signal flow:** Blog pages emit structured data that search engines and AI crawlers consume. The llms.txt file provides a high-level site map specifically for AI assistants.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-500 posts | Current architecture. JSON index, filesystem reads, no caching needed. |
| 500-2K posts | Add `unstable_cache` or ISR (`revalidate: 3600`) to blog index page. Split sitemap into sitemap index with per-category sitemaps. |
| 2K-10K posts | Consider SQLite (via better-sqlite3) replacing JSON index for query performance. Add pagination to blog index. |
| 10K+ posts | Unlikely for this use case (daily publish = 3,650/year at most). If reached, migrate to SQLite + full-text search. |

### Scaling Priorities

1. **First bottleneck:** Blog index page reading entire JSON index on every request. Fix with caching (ISR or in-memory cache with invalidation on publish).
2. **Second bottleneck:** Sitemap generation scanning all posts. Fix with sitemap index splitting by year or category.

## Anti-Patterns

### Anti-Pattern 1: Using @next/mdx for API-Published Content

**What people do:** Configure the webpack-based @next/mdx plugin and try to import MDX files that were written at runtime by an API.
**Why it's wrong:** @next/mdx processes MDX at build time through webpack. Content written after the build (by OpenClaw API) will not be picked up until the next build/restart. The site needs to render dynamically-written content without rebuilding.
**Do this instead:** Use `next-mdx-remote` (RSC variant) which compiles MDX strings at render time. It reads from the filesystem like any other data source.

### Anti-Pattern 2: Storing Content in the Database You Do Not Have

**What people do:** Reach for PostgreSQL or MongoDB for blog content because "that's how CMSes work."
**Why it's wrong:** This project runs on a single VPS with Docker. Adding a database means another container, backups, migrations, and operational overhead -- all for content that is write-once, read-many, and perfectly suited to files.
**Do this instead:** MDX files on disk with a JSON index. The VPS has a persistent filesystem. Docker volume mount ensures content survives container restarts.

### Anti-Pattern 3: Building a CMS Admin UI

**What people do:** Build a dashboard for creating/editing blog posts because blogs "need" an admin panel.
**Why it's wrong:** The project explicitly scopes out human editing. OpenClaw is the sole content producer. Building admin UI is wasted effort and increases attack surface.
**Do this instead:** The publish API is the only write interface. If manual editing is ever needed, edit MDX files directly on the VPS via SSH.

### Anti-Pattern 4: Skipping the Content Index

**What people do:** Parse frontmatter from every MDX file on every blog index page load to build the post list.
**Why it's wrong:** As post count grows, this means opening and parsing hundreds of files on every page request. It's also error-prone if any file has malformed frontmatter.
**Do this instead:** Maintain a JSON index file updated atomically on publish. Blog index and sitemap read from this single file.

### Anti-Pattern 5: Trusting MDX Content Without Sanitization

**What people do:** Accept MDX from the API and render it without any validation, allowing arbitrary React components or script injection.
**Why it's wrong:** Even though OpenClaw is a trusted publisher, defense in depth matters. A compromised API key or a bug in OpenClaw could inject malicious content.
**Do this instead:** Validate that published MDX only uses allowed component patterns. Strip or reject `<script>`, `import`, and `export` statements. Only allow the custom MDX components you explicitly define.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **OpenClaw** | POST to `/api/blog/publish` with Bearer token | OpenClaw handles content generation. API key stored as `BLOG_PUBLISH_API_KEY` env var on VPS. |
| **Google Search Console** | Sitemap submission | Extended sitemap automatically includes blog posts. Submit once; Google re-crawls on schedule. |
| **AI Search Engines** | llms.txt + structured data | Passive -- crawlers discover content via llms.txt and standard crawling. No API integration needed. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **Publish API -> Content Service** | Direct function call | API route imports and calls `lib/blog.ts` functions. No HTTP between them. |
| **Blog Pages -> Content Service** | Direct function call | Page components import `lib/blog.ts` to read content. Server-side only. |
| **Blog Pages -> SEO Layer** | Component composition | `BlogStructuredData` component renders JSON-LD in page. Uses data from content service. |
| **Sitemap -> Content Service** | Direct function call | `sitemap.ts` reads posts index to generate blog entries alongside static pages. |
| **llms.txt -> Content Service** | Direct function call | Reads posts index to list recent/important content in the AI manifest. |
| **Blog -> Existing Site** | Internal links + shared layout | Blog layout extends existing locale layout. Posts link to `/consult` and `/screening` for lead capture. |

### Docker Volume Configuration

```yaml
# docker-compose.yml addition
services:
  app:
    volumes:
      - blog-content:/app/content/blog    # Persist blog content across deploys

volumes:
  blog-content:
```

This is critical: without a volume mount, blog content written by OpenClaw would be lost on every container restart or redeployment.

## Build Order (Dependency Chain)

The components have clear dependencies that dictate implementation order:

```
Phase 1: Foundation
  └── lib/blog-types.ts          (no dependencies)
  └── lib/blog.ts                (depends on: blog-types)
  └── content/blog/ directory    (depends on: nothing, just mkdir)
  └── posts-index.json seed      (depends on: blog-types for schema)

Phase 2: Publish API
  └── lib/auth.ts                (depends on: nothing)
  └── api/blog/publish/route.ts  (depends on: auth, blog service)

Phase 3: Blog Pages
  └── components/blog/*          (depends on: blog-types)
  └── [locale]/blog/page.tsx     (depends on: blog service, components)
  └── [locale]/blog/[slug]/*     (depends on: blog service, components, next-mdx-remote)
  └── i18n routing extension     (depends on: nothing, but blog pages need it)
  └── middleware matcher update  (depends on: nothing, but blog routes need it)

Phase 4: SEO & AI Optimization
  └── blog-structured-data.tsx   (depends on: blog-types, seo-config)
  └── sitemap.ts extension       (depends on: blog service)
  └── llms.txt route             (depends on: blog service, seo-config)
  └── robots.ts update           (depends on: nothing)

Phase 5: Polish
  └── OG image generation        (depends on: blog-types)
  └── Internal linking strategy  (depends on: blog pages existing)
  └── Category/tag pages         (depends on: blog service, components)
```

The key dependency insight: **the content service (lib/blog.ts) is the foundation everything else builds on.** Build it first, with solid types, and everything else connects cleanly.

## Sources

- [Next.js MDX Guide](https://nextjs.org/docs/app/guides/mdx) - Official MDX documentation for App Router
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) - Dynamic MDX loading from any source
- [llms.txt proposed standard](https://searchengineland.com/llms-txt-proposed-standard-453676) - AI crawling standard specification
- [llms.txt 2026 adoption analysis](https://www.linkbuildinghq.com/blog/should-websites-implement-llms-txt-in-2026/) - Current adoption rates and platform support
- [Building a blog with Next.js App Router and MDX](https://www.alexchantastic.com/building-a-blog-with-next-and-mdx) - Real-world implementation patterns
- Existing codebase analysis: `src/app/sitemap.ts`, `src/app/api/lead/route.ts`, `src/components/structured-data.tsx`, `src/lib/seo-config.ts`, `src/i18n/routing.ts`

---
*Architecture research for: SEO & AI search optimization blog system*
*Researched: 2026-03-05*
