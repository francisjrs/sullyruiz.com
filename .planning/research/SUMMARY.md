# Project Research Summary

**Project:** SullyRuiz.com SEO & AI Search Authority Engine (Blog + Publishing API)
**Domain:** SEO-optimized real estate authority blog with AI search optimization
**Researched:** 2026-03-05
**Confidence:** HIGH

## Executive Summary

This project adds an automated blog and publishing system to Sully Ruiz's existing Next.js real estate portfolio site. The goal is to establish Sully as a citable authority for Central Texas real estate in both traditional search engines and AI search tools (ChatGPT, Gemini, Perplexity). The expert approach for this type of system is file-based content storage (MDX on disk) with a JSON metadata index, a secure API endpoint for automated publishing from OpenClaw, and layered SEO/structured data that makes every page machine-readable. This avoids database infrastructure entirely while supporting daily auto-publishing via ISR revalidation.

The recommended approach extends the existing Next.js 16 + Tailwind + next-intl stack with minimal new dependencies: next-mdx-remote-client for MDX rendering, gray-matter for frontmatter parsing, Zod for API validation, and schema-dts for type-safe structured data. The architecture centers on a single content service module (lib/blog.ts) that both the publish API and blog pages consume. Content is stored as MDX files in a Docker-volume-mounted directory, organized by slug with per-locale files (en.mdx, es.mdx). A companion posts-index.json enables fast listing without scanning all files.

The primary risks are: (1) scaled content abuse -- Google will suppress AI-generated blog content that lacks genuine local data and expertise signals, so content validation must be built into the publish API from day one; (2) sitemap caching in Next.js silently preventing new posts from being discovered by crawlers; (3) broken hreflang implementation destroying the bilingual competitive advantage; and (4) file corruption from non-atomic writes on the VPS. All four are preventable with deliberate implementation patterns documented in the research.

## Key Findings

### Recommended Stack

The stack adds 6-8 new packages to the existing codebase, all well-established and high-confidence. No database, no CMS, no complex auth system. See [STACK.md](./STACK.md) for full details.

**Core technologies:**
- **next-mdx-remote-client (^2.1):** Dynamic MDX rendering in RSC -- the actively maintained fork with React 19 support, required because content is written at runtime, not build time
- **gray-matter (^4.0.3):** YAML frontmatter parsing from MDX files -- industry standard, stable API
- **Zod (^3.24):** Request validation for the publish API -- TypeScript-first, infers types from schemas
- **schema-dts (^1.1.5):** Google-maintained TypeScript types for Schema.org JSON-LD -- compile-time validation for BlogPosting, RealEstateAgent, LocalBusiness schemas
- **remark-gfm + rehype-slug:** MDX plugins for tables (market reports need them) and heading anchors (SEO deep links)
- **Next.js built-in sitemap.ts + Metadata API:** No external packages needed for sitemap generation or meta tags

### Expected Features

See [FEATURES.md](./FEATURES.md) for full analysis including dependency graph and competitor comparison.

**Must have (table stakes):**
- Blog routing with dynamic `[slug]` pages and bilingual support (en/es)
- BlogPosting JSON-LD structured data on every post with author linked to RealEstateAgent entity
- SEO meta tags (title, description, canonical, hreflang, OG) per post
- XML sitemap extension with blog entries and locale alternates
- Auto-publish API with API key auth for OpenClaw integration
- Mobile-responsive blog layout with heading hierarchy
- Internal linking CTAs from blog posts to lead capture (ChatWizard/ConsultForm)
- Content freshness signals (visible dates, dateModified in schema)

**Should have (competitive advantage):**
- `/llms.txt` for AI crawler guidance (low effort, emerging standard)
- Topic clustering with categories/tags and dedicated category pages
- Area guide content type with hyper-local depth (1,500+ words per city)
- Market report content type with citable statistics
- LocalBusiness schema per service area city
- GEO-optimized content formatting (direct answers, citable claims)

**Defer (v2+):**
- AI citation analytics dashboard
- Content refresh automation (edit API for updating old posts)
- Programmatic internal linking (auto-related posts)
- Video content integration

### Architecture Approach

The system follows a file-based content architecture with four major layers: a publish API that accepts content from OpenClaw, a content service that manages filesystem I/O, blog pages that render MDX via server components, and an SEO layer that generates structured data and sitemaps. All layers communicate through the content service module, creating a clean boundary that could be swapped to SQLite later if needed. See [ARCHITECTURE.md](./ARCHITECTURE.md) for diagrams and code examples.

**Major components:**
1. **Content Service (lib/blog.ts)** -- Single module for all filesystem read/write operations, frontmatter parsing, and index management. Foundation everything else depends on.
2. **Publish API (api/blog/publish/route.ts)** -- Authenticated endpoint that validates payloads, sanitizes MDX, writes files atomically, updates the posts index, and triggers ISR revalidation.
3. **Blog Pages ([locale]/blog/ routes)** -- Server components that read MDX from disk via content service and render with next-mdx-remote-client. Include generateMetadata for per-post SEO.
4. **SEO Layer (structured data + sitemap + llms.txt)** -- BlogPosting JSON-LD component, extended sitemap.ts with blog entries, and dynamic llms.txt route.
5. **Posts Index (posts-index.json)** -- JSON metadata file updated atomically on publish, eliminates need to scan all MDX files for listing pages and sitemap.

### Critical Pitfalls

See [PITFALLS.md](./PITFALLS.md) for all 7 pitfalls with detailed prevention strategies and recovery costs.

1. **Scaled content abuse** -- Google suppresses AI-generated content without genuine local data. Prevention: enforce minimum quality standards in the publish API (require local data fields, minimum word count), link author to RealEstateAgent entity with credentials.
2. **Sitemap caching** -- Next.js caches sitemap.ts by default, preventing new posts from being discovered. Prevention: call `revalidatePath('/sitemap.xml')` after each publish, or set `export const revalidate = 3600`.
3. **Publish API security** -- No rate limiting + no validation = attack vector. Prevention: rate limit (5/hour, 10/day), validate payload schema with Zod, validate slug format against path traversal, log all attempts.
4. **Broken hreflang** -- Missing bidirectional references cause duplicate content penalties on bilingual posts. Prevention: generate alternateLinks in metadata for both locales, only add hreflang when both locale versions exist.
5. **File corruption from non-atomic writes** -- Interrupted writes produce corrupted MDX files that break the blog. Prevention: write to temp file then `fs.rename()`, use Docker named volume for content persistence.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Content Foundation
**Rationale:** The content service is the dependency root -- every other component (API, pages, SEO) requires it. Types and storage must be defined first.
**Delivers:** Blog data model, content service module, file storage structure, posts-index.json, Docker volume configuration
**Addresses:** Content storage (FEATURES), file-based storage pattern (ARCHITECTURE)
**Avoids:** File corruption pitfall (atomic writes from day one), data model inconsistencies

### Phase 2: Publish API
**Rationale:** OpenClaw needs to write content before blog pages can display anything meaningful. The API is the entry point for all content.
**Delivers:** Authenticated POST endpoint, Zod validation, MDX file writing, index updates, ISR revalidation trigger
**Addresses:** Auto-publish API (FEATURES P1), API security (PITFALLS)
**Avoids:** API security pitfalls (rate limiting, content validation, slug sanitization built in from start)

### Phase 3: Blog Pages & Rendering
**Rationale:** With content storage and the publish API in place, blog pages can render real content. This is the read path.
**Delivers:** Blog index page, individual post pages, MDX rendering with custom components, bilingual routing, mobile-responsive layout, internal linking CTAs
**Addresses:** Blog routing, mobile layout, heading hierarchy, internal linking (all FEATURES P1)
**Avoids:** Anti-pattern of using @next/mdx for runtime content

### Phase 4: SEO & Structured Data
**Rationale:** Blog pages must exist before SEO layers can be applied to them. Structured data, sitemap extension, and hreflang depend on working blog routes.
**Delivers:** BlogPosting JSON-LD per post, extended sitemap with blog entries, canonical URLs with hreflang alternates, OG meta tags per post, breadcrumb schema
**Addresses:** All SEO table stakes (FEATURES P1), local SEO signals (PITFALLS)
**Avoids:** Sitemap caching pitfall, broken hreflang pitfall, missing local SEO signals

### Phase 5: AI Search Optimization
**Rationale:** AI optimization layers (llms.txt, GEO formatting) should come after the content and schema foundation is solid. These are enhancements, not foundations.
**Delivers:** `/llms.txt` route, `llms-full.txt` generation, GEO content formatting guidelines for OpenClaw prompts, LocalBusiness schema per city
**Addresses:** Differentiator features (FEATURES P1-P2), AI search optimization (STACK)
**Avoids:** Stale llms.txt pitfall (auto-generation from config)

### Phase 6: Content Types & Clustering
**Rationale:** Specialized content types (area guides, market reports) and topic clustering add value only after the base blog system is publishing daily. Need 20+ posts before clustering is meaningful.
**Delivers:** Area guide template, market report template, category/tag pages, topic clustering
**Addresses:** Area guides, market reports, topic clustering (FEATURES P2)
**Avoids:** Premature optimization of content types before establishing publishing cadence

### Phase Ordering Rationale

- **Phases 1-2 before 3:** Cannot render pages without content to render. Cannot have content without a way to store and publish it. The content service is the architectural foundation per ARCHITECTURE.md's dependency chain.
- **Phase 4 after 3:** SEO metadata generation depends on blog page routes existing. Hreflang tags require both locale pages to reference each other.
- **Phase 5 after 4:** AI optimization builds on structured data foundation. llms.txt references blog content that must already be indexed.
- **Phase 6 last:** Content type specialization and clustering are premature before establishing daily publishing cadence and having enough posts to cluster.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Publish API):** ISR revalidation behavior in Docker production environment needs validation. The `revalidatePath` + `revalidateTag` interaction with Next.js 16 in a containerized environment is not exhaustively documented.
- **Phase 4 (SEO):** Hreflang implementation with next-intl's `as-needed` locale prefix (no `/en` prefix for default locale) needs careful testing. Edge cases around partial locale availability (post exists in en but not es) need explicit handling.
- **Phase 5 (AI Search):** llms.txt is an emerging standard with low adoption (10%). The actual impact on AI citation is unverified. Treat as low-effort experimentation, not a critical feature.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Content Foundation):** Well-documented file storage patterns. MDX + gray-matter is established.
- **Phase 3 (Blog Pages):** Standard Next.js App Router dynamic routing. next-mdx-remote-client has clear documentation.
- **Phase 6 (Content Types):** Standard extension of the blog system with new templates. No novel patterns.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All recommended technologies are mature, well-documented, and verified against Next.js 16 / React 19 compatibility. Zero speculative choices. |
| Features | HIGH | Table stakes validated against real estate SEO best practices and competitor analysis. Differentiators grounded in GEO research. Clear MVP vs. defer boundaries. |
| Architecture | HIGH | File-based content with JSON index is a proven pattern for VPS-hosted blogs. Build order derived from explicit dependency analysis. Code examples provided. |
| Pitfalls | HIGH | Pitfalls sourced from Next.js GitHub issues, real estate SEO case studies, and security best practices. Each has concrete prevention strategies with phase mapping. |

**Overall confidence:** HIGH

### Gaps to Address

- **ISR behavior in Docker:** The exact behavior of `revalidatePath` in a Docker container on a VPS (not Vercel) needs validation during Phase 2 implementation. Next.js ISR works differently on self-hosted vs. Vercel, and the documentation is Vercel-centric.
- **OpenClaw content quality:** Research assumes OpenClaw can generate content with genuine local data (MLS stats, neighborhood specifics). If OpenClaw's output is generic, the entire strategy is undermined by the scaled content abuse pitfall. This is a content pipeline dependency, not a code dependency.
- **Spanish content quality:** The bilingual advantage depends on native-quality Spanish, not machine translation. Need to validate OpenClaw's Spanish output quality or establish a review process.
- **llms.txt impact:** No verified evidence that llms.txt influences AI search citation. Implementation is low-cost so it proceeds regardless, but expectations should be calibrated.

## Sources

### Primary (HIGH confidence)
- [Next.js MDX Guide](https://nextjs.org/docs/app/guides/mdx) -- MDX integration patterns
- [next-mdx-remote-client GitHub](https://github.com/ipikuka/next-mdx-remote-client) -- RSC support, React 19 compatibility
- [Next.js Metadata API](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) -- Built-in SEO capabilities
- [Next.js Sitemap API](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) -- Dynamic sitemap generation
- [Schema.org RealEstateAgent](https://schema.org/RealEstateAgent) -- Structured data type reference
- [schema-dts GitHub](https://github.com/google/schema-dts) -- Google-maintained TypeScript types
- [OWASP API Security Project](https://owasp.org/www-project-api-security/) -- API security patterns

### Secondary (MEDIUM confidence)
- [Search Engine Land: Mastering GEO in 2026](https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142) -- GEO strategies
- [Backlinko: Generative Engine Optimization](https://backlinko.com/generative-engine-optimization-geo) -- GEO best practices
- [HousingWire: Real Estate SEO Guide 2026](https://www.housingwire.com/articles/real-estate-seo/) -- Real estate SEO table stakes
- [Next.js Sitemap Caching Issues (GitHub)](https://github.com/vercel/next.js/discussions/56708) -- Known caching behavior
- [llms.txt Adoption Analysis](https://www.linkbuildinghq.com/blog/should-websites-implement-llms-txt-in-2026/) -- 10% adoption, pragmatic assessment

### Tertiary (LOW confidence)
- [llms.txt Specification](https://llmstxt.org/) -- Emerging standard, unverified impact on AI citation
- [ALLMO llms.txt Report](https://www.allmo.ai/articles/llms-txt) -- AI search optimization claims need validation

---
*Research completed: 2026-03-05*
*Ready for roadmap: yes*
