# Technology Stack

**Project:** SullyRuiz.com SEO & AI Search Authority Engine (Blog + Publishing API)
**Researched:** 2026-03-05

## Recommended Stack

This stack extends the existing Next.js 16.1.4 site. Only new additions are listed below -- the existing stack (Tailwind v4, next-intl, Radix UI, Framer Motion) remains unchanged.

### Content Storage & Rendering

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| MDX files on disk | N/A | Blog post storage | Fits the "no database" constraint. OpenClaw API writes MDX files to `/content/blog/`. Git-trackable, zero infrastructure, survives Docker rebuilds via volume mount. Simpler than SQLite for a write-rarely, read-often blog. | HIGH |
| next-mdx-remote-client | ^2.1 | Render MDX from file system in RSC | The actively maintained fork of next-mdx-remote. Supports React 19 (v2.x), Next.js App Router via `/rsc` export, and loading MDX from any source (files, API). @next/mdx only works with co-located MDX files and cannot handle dynamic slug-based routing from a content directory. | HIGH |
| @mdx-js/mdx | ^3.1 | MDX compiler (peer dep of next-mdx-remote-client) | Required peer dependency. Provides the actual MDX-to-JSX compilation. | HIGH |
| gray-matter | ^4.0.3 | YAML frontmatter parsing | Industry standard (3000+ dependents). Extracts title, slug, locale, date, category, tags, description from MDX frontmatter. Last release was 2019, but the API is stable and complete -- no reason to use alternatives. | HIGH |
| reading-time | ^1.5.0 | Estimate read time from content | Lightweight, zero-dep. Adds "5 min read" metadata for structured data and display. | HIGH |

### MDX Plugins (remark/rehype)

| Library | Version | Purpose | Why | Confidence |
|---------|---------|---------|-----|------------|
| remark-gfm | ^4.0.1 | GitHub Flavored Markdown (tables, strikethrough) | Market reports need tables. GFM is the expected markdown dialect. | HIGH |
| rehype-slug | ^6.0.0 | Add IDs to headings | Required for anchor links and table of contents. Works with rehype-autolink-headings. | HIGH |
| rehype-autolink-headings | ^7.1.0 | Linkable heading anchors | Improves SEO (anchor links) and AI crawlability (section-level deep links). | MEDIUM |
| rehype-pretty-code | ^0.14.3 | Syntax highlighting (shiki-based) | Only needed if technical content is planned. Build-time highlighting, zero client JS. Include if market reports or guides have code/data snippets. Optional -- can defer. | LOW |

### Structured Data & SEO

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| schema-dts | ^1.1.5 | TypeScript types for Schema.org JSON-LD | Google-maintained. Provides compile-time validation for BlogPosting, RealEstateAgent, LocalBusiness, and FAQPage schemas. Catches schema errors before deploy rather than discovering them in Google Search Console. Zero runtime cost (types only). | HIGH |
| Next.js built-in Metadata API | (built-in) | Meta tags, OG images, canonical URLs | Use `generateMetadata()` in page.tsx. No library needed -- Next.js 16 handles title, description, openGraph, alternates (for i18n hreflang), and canonical natively. | HIGH |
| Next.js built-in sitemap.ts | (built-in) | Dynamic XML sitemap | Use `app/sitemap.ts` with `MetadataRoute.Sitemap` return type. Dynamically reads blog content directory to include all posts. No need for next-sitemap package -- the built-in API handles dynamic generation natively and is simpler for this use case. | HIGH |

### AI Search Optimization

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Static `/llms.txt` file | N/A | AI crawler guidance | A markdown file at the site root describing who Sully is, what areas he serves, and linking to key content. Adoption is still early (10% of sites) and no AI crawler has confirmed using it for ranking, but it costs nothing to implement and is the emerging standard. Treat as low-effort, low-risk signal. | MEDIUM |
| Structured JSON-LD per page | N/A (via schema-dts types) | AI-consumable authority signals | The real AI optimization lever. AI search engines (ChatGPT, Gemini, Perplexity) extract structured data to answer queries. BlogPosting with author as RealEstateAgent, LocalBusiness with areaServed, and Article with about properties give AI crawlers explicit entity relationships. This is what actually drives AI citation. | HIGH |
| Semantic HTML + heading hierarchy | N/A | Content structure for AI extraction | AI crawlers parse HTML structure. Proper h1/h2/h3 hierarchy, article tags, and semantic sections make content extractable. No library needed -- just disciplined markup. | HIGH |

### Publishing API (OpenClaw Integration)

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Next.js Route Handler | (built-in) | `POST /api/blog/publish` endpoint | App Router route handlers are the standard way to build APIs in Next.js 16. No framework needed -- a single `route.ts` file handles the endpoint. | HIGH |
| API key via `Authorization: Bearer` header | N/A | Authentication | Simple, stateless, sufficient for machine-to-machine auth. OpenClaw sends `Authorization: Bearer <API_KEY>`, the route handler compares against `OPENCLAW_API_KEY` env var. No need for JWT, OAuth, or NextAuth -- this is a single-client API, not a user-facing auth system. | HIGH |
| Zod | ^3.24 | Request body validation | Validates incoming post data (title, slug, content, locale, category, tags) with type-safe schemas. Catches malformed payloads before writing to disk. Already widely used in the Next.js ecosystem. | HIGH |
| Node.js `fs/promises` | (built-in) | Write MDX files to disk | The publish API writes validated content as MDX files to `/content/blog/[locale]/[slug].mdx`. No ORM, no database driver -- just file writes. The content directory is volume-mounted in Docker so files persist across container restarts. | HIGH |

### Development & Build

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| tsx | ^4.21 (existing) | Run TypeScript scripts | Already in the project. Useful for content migration scripts, seed data generation. | HIGH |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Content storage | MDX files on disk | SQLite (better-sqlite3) | Adds native dependency (C++ compilation in Docker), requires schema management. Overkill for a write-once-daily, read-at-build blog. MDX files are simpler, git-trackable, and match the "no database" constraint. |
| Content storage | MDX files on disk | Headless CMS (Payload, Sanity, Strapi) | Adds infrastructure, hosting costs, and complexity. OpenClaw is the "CMS" -- it generates content and pushes via API. A CMS layer between them is redundant. |
| MDX rendering | next-mdx-remote-client | @next/mdx | Cannot load MDX from arbitrary file paths. Requires MDX files to be co-located in the app directory. Does not support dynamic slug-based routing from a content directory. |
| MDX rendering | next-mdx-remote-client | next-mdx-remote (HashiCorp) | Effectively unmaintained since 2023. next-mdx-remote-client is the actively maintained fork with React 19 and App Router RSC support. |
| MDX rendering | next-mdx-remote-client | Contentlayer | Project was abandoned in 2023. Not viable. |
| Sitemap | Next.js built-in sitemap.ts | next-sitemap | Adds a dependency for something Next.js handles natively. next-sitemap was valuable in Pages Router era but is unnecessary with App Router's metadata file conventions. |
| API auth | Bearer API key | NextAuth / Auth.js | Designed for user session management. Massive overkill for a single machine-to-machine API key. Adds complexity, dependencies, and attack surface for zero benefit. |
| API auth | Bearer API key | JWT tokens | JWTs add token generation, expiration, refresh logic. Unnecessary when the client (OpenClaw) is a single trusted agent with a static key. |
| Validation | Zod | Joi, Yup | Zod is TypeScript-first, infers types from schemas, and is the de facto standard in the Next.js ecosystem. Joi/Yup are older and do not provide type inference. |
| AI optimization | llms.txt + JSON-LD | Dedicated AI SEO tools | No established tooling exists yet. The space is too new for specialized libraries. Manual implementation of llms.txt and structured data is the pragmatic approach. |

## Content Directory Structure

```
/content/
  blog/
    en/
      central-texas-housing-market-march-2026.mdx
      jarrell-tx-neighborhood-guide.mdx
    es/
      mercado-inmobiliario-texas-central-marzo-2026.mdx
      guia-del-vecindario-jarrell-tx.mdx
```

### MDX Frontmatter Schema

```yaml
---
title: "Central Texas Housing Market Report - March 2026"
slug: "central-texas-housing-market-march-2026"
locale: "en"
description: "Monthly market analysis for the I-35 corridor..."
category: "market-report"  # market-report | area-guide | education
tags: ["central-texas", "market-data", "i-35-corridor"]
author: "Sully Ruiz"
publishedAt: "2026-03-05T12:00:00Z"
updatedAt: "2026-03-05T12:00:00Z"
coverImage: "/images/blog/central-texas-market-march-2026.jpg"
featured: false
cities: ["jarrell", "georgetown", "round-rock", "austin"]
---
```

## Installation

```bash
# Content rendering
npm install next-mdx-remote-client @mdx-js/mdx gray-matter reading-time

# MDX plugins
npm install remark-gfm rehype-slug rehype-autolink-headings

# Structured data types
npm install schema-dts

# API validation
npm install zod

# Optional: syntax highlighting (defer unless needed)
# npm install rehype-pretty-code shiki
```

Total new dependencies: **8 packages** (or 6 if deferring syntax highlighting and autolink headings).

## Key Architecture Decisions

### Why MDX Files Over SQLite

The PROJECT.md states "no database" as a constraint. MDX files satisfy this:

1. **Write path**: OpenClaw POSTs to `/api/blog/publish` -> route handler validates with Zod -> writes `.mdx` file to `/content/blog/[locale]/[slug].mdx`
2. **Read path**: Blog pages use `fs.readFileSync` to load MDX, `gray-matter` to parse frontmatter, `next-mdx-remote-client` to render
3. **Persistence**: Docker volume mount on `/content` ensures files survive container restarts
4. **Rebuild**: After writing a new file, the API calls `revalidatePath('/blog')` and `revalidatePath('/sitemap.xml')` to trigger ISR

### Why Not a Build-Time-Only Blog

The daily auto-publish requirement means content must be addable at runtime without rebuilding/redeploying. ISR (Incremental Static Regeneration) with on-demand revalidation solves this -- new posts are written to disk, revalidation is triggered, and Next.js regenerates the affected pages on the next request.

### Docker Volume Mount

```yaml
# docker-compose.yml addition
volumes:
  - ./content:/app/content
```

This ensures blog content persists outside the container image and can be written to at runtime by the API.

## Sources

- [Next.js MDX Guide](https://nextjs.org/docs/app/guides/mdx) - Official documentation
- [next-mdx-remote-client GitHub](https://github.com/ipikuka/next-mdx-remote-client) - RSC support, React 19 compatibility
- [llms.txt Specification](https://llmstxt.org/) - Official spec
- [llms.txt Adoption Analysis](https://www.linkbuildinghq.com/blog/should-websites-implement-llms-txt-in-2026/) - 10% adoption rate, pragmatic assessment
- [Schema.org RealEstateAgent](https://schema.org/RealEstateAgent) - Structured data type reference
- [schema-dts GitHub](https://github.com/google/schema-dts) - Google-maintained TypeScript types
- [Next.js Sitemap API](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) - Built-in dynamic sitemap
- [Next.js Authentication Guide](https://nextjs.org/docs/app/guides/authentication) - Security patterns
- [Rehype Pretty Code](https://rehype-pretty.pages.dev/) - Shiki-based syntax highlighting
- [gray-matter npm](https://www.npmjs.com/package/gray-matter) - Frontmatter parsing (v4.0.3)
