# Feature Research

**Domain:** SEO-optimized real estate authority blog with AI search optimization
**Researched:** 2026-03-05
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Search Engines Ignore You Without These)

These are non-negotiable. Without them, Google treats blog pages as low-quality content, and AI crawlers skip you entirely.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Blog routing (`/blog`, `/blog/[slug]`) | Search engines need crawlable, permanent URLs for each post | LOW | Next.js App Router dynamic routes. Use `[locale]/blog/[slug]/page.tsx` pattern to leverage existing next-intl setup |
| BlogPosting JSON-LD structured data | Google requires structured data to generate rich results; AI engines use it to extract author/date/topic signals | MEDIUM | Every post needs `@type: BlogPosting` with `headline`, `author` (linked to existing Person schema `@id`), `datePublished`, `dateModified`, `image`, `articleBody`, `inLanguage`. Link author to existing `RealEstateAgent` schema via `@id` reference |
| SEO meta tags per post | Title tags, meta descriptions, and OG images are how Google and social platforms decide to surface content | LOW | Next.js `generateMetadata` in the blog `[slug]` route. Dynamic title, description, canonical URL, OG image per post |
| Canonical URLs with hreflang alternates | Bilingual site without canonicals = duplicate content penalty. Without hreflang, Google won't serve the right language version | MEDIUM | Each post self-canonicalizes. English and Spanish versions cross-reference via `hreflang` alternate links. Never canonical Spanish to English -- each is its own canonical |
| XML sitemap with blog posts | Crawlers discover new posts via sitemap. Without it, daily auto-published content may not get indexed for weeks | LOW | Extend existing `sitemap.ts` to query blog posts and generate entries with `lastModified`, `changeFrequency: 'daily'`, and alternates per locale |
| Heading hierarchy (H1/H2/H3) | Google uses heading structure to understand content organization. AI engines use it to extract structured answers | LOW | Enforce in content templates: one H1 (post title), H2s for sections, H3s for subsections. MDX makes this natural |
| Internal linking to lead capture | Blog posts without CTAs are dead-end pages. Every post should link to consultation/contact to convert SEO traffic | LOW | Template includes CTA components that link to existing ChatWizard/ConsultForm. Standardized placement at post bottom and mid-content |
| Mobile-responsive blog layout | 72% of real estate searches start on mobile (NAR 2025). Non-responsive pages get demoted in mobile-first indexing | LOW | Tailwind CSS handles this. Blog layout uses existing responsive patterns. Ensure readable typography on small screens |
| Content freshness signals | AI engines and Google weigh recency. Posts without dates or with stale dates lose ranking | LOW | Display `datePublished` and `dateModified` visibly on page. Include "Last updated" timestamp. Auto-set `dateModified` when content is refreshed |
| Bilingual blog content (en/es) | Competitive moat -- almost no Central Texas realtors have Spanish real estate content. Google serves language-specific results | MEDIUM | Each post stored with en/es variants. Use existing next-intl patterns. Spanish content must be native-quality, not machine-translated gibberish |

### Differentiators (Competitive Advantage for AI Search)

These set Sully apart from every other Central Texas realtor's blog. They are the reason AI assistants will cite Sully as an expert rather than a generic result.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| `/llms.txt` and `/llms-full.txt` | Provides AI crawlers a curated summary of who Sully is, what areas he serves, and links to key content. While current AI engines don't officially rely on it, adoption is growing (10% of domains) and it costs almost nothing to implement | LOW | Static markdown file at site root. H1 with name, blockquote with summary ("Top Hispanic realtor in Central Texas, bilingual, I-35 corridor specialist"), sections with links to key blog posts, area guides. `llms-full.txt` concatenates all blog content into one file for single-prompt ingestion. Auto-regenerate on publish |
| Area/neighborhood guide content type | Hyper-local pages build topical authority for specific cities. AI engines cite sources that demonstrate deep local knowledge. "Jarrell TX real estate expert" is far less competitive than "Austin realtor" | HIGH | One dedicated page per city in coverage area (10+ cities). 1,500+ words each with market data, schools, amenities, commute info, lifestyle. Structured as reference content AI can cite. Uses `Place` schema markup with `containedInPlace` |
| `RealEstateAgent` + `Person` author linking | When BlogPosting.author links to a well-defined Person/RealEstateAgent entity, AI engines build a knowledge graph connecting Sully to his content. This is how you become "the" answer, not "an" answer | LOW | Already have Person and RealEstateAgent schemas. Blog posts link `author: { "@id": "https://sullyruiz.com/#person" }`. Consistent `@id` references across all structured data create entity cohesion |
| Topic clustering with categories/tags | Search engines reward topical authority -- a cluster of 10 posts about "Georgetown TX real estate" signals deeper expertise than 1 post | MEDIUM | Categories: area guides, market reports, buyer education, seller education. Tags: city names, topics. Category pages (`/blog/category/[slug]`) aggregate posts. Internal linking between related posts reinforces clusters |
| Market report content type | Monthly market data posts (median prices, days on market, inventory) are highly citable by AI engines answering "What's the housing market like in Round Rock?" | MEDIUM | Structured template with data tables, trends, comparisons. Uses `Dataset` or `Article` schema with statistical claims markup. Refreshed monthly = strong freshness signal |
| GEO-optimized content formatting | Generative Engine Optimization: structure content so AI engines can extract direct answers. Immediate answers after questions, clear summaries, citable statistics, authoritative tone | LOW | Content template patterns: lead with a direct answer paragraph, use FAQ-style subheadings, include quotable statistics, end with expert attribution. This is a content strategy, not a code feature |
| Secure auto-publish API for OpenClaw | Daily auto-publishing creates content velocity (12+ pieces/month = up to 200x faster visibility gains per GEO research). No manual bottleneck means consistent publishing cadence | MEDIUM | POST `/api/blog/publish` with API key auth. Accepts structured blog post data (title, body, metadata, locale). Validates, stores, triggers sitemap regeneration. Returns published URL |
| `LocalBusiness` schema per service area city | Each city in the coverage area gets explicit structured data marking Sully as serving that area. AI engines answering "realtor in Georgetown TX" can match directly | LOW | Extend existing `areaServed` in LocalBusiness schema (already implemented). Add `ServiceArea` schema for each city with geo coordinates. Area guide pages get their own `LocalBusiness` reference |
| Content designed for AI citation | Structure every post to be "citable" -- clear expert attribution, specific claims with data, authoritative voice. AI engines cite sources that make definitive statements, not hedging ones | LOW | Content guideline, not code. "The median home price in Georgetown TX is $385,000 as of February 2026" is citable. "Prices are around $350-400K" is not. OpenClaw content templates enforce this |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| CMS admin dashboard | "We need to edit posts" | Blog audience is AI/search engines, not human editors. A CMS adds complexity, security surface, and maintenance burden for a use case that doesn't exist. OpenClaw publishes via API | API-only publishing. If human editing is ever needed, edit the source files directly or add a simple edit endpoint to the API |
| Comments system | "Blogs should have comments" | Comments attract spam, require moderation, and add zero value when the audience is crawlers. Comments also create dynamic content that can dilute page quality signals | No comments. If social proof is needed, embed testimonials from existing review platforms |
| RSS feed | "Standard blog feature" | Primary audience is AI crawlers and search engines, not RSS subscribers. Sitemap.xml serves the discovery function RSS would provide | Sitemap.xml with high `changeFrequency`. Can add RSS later if there's evidence of human readership demand |
| Social sharing buttons | "Help content go viral" | These are for human-reader blogs. They add JavaScript weight, slow page load, and Sully's blog is optimized for crawlers not social virality | If social distribution is needed, handle via n8n automation that posts links to social platforms on publish |
| Real-time search/filtering on blog | "Users need to find posts" | Over-engineering for a blog whose readers are mostly bots. JavaScript-heavy search hurts Core Web Vitals and provides no SEO value | Static category/tag pages that crawlers can index. Simple HTML navigation. Server-side filtering if needed later |
| Content preview/draft system | "Review before publishing" | Adds workflow complexity. OpenClaw output is trusted (per project constraints). Draft states complicate the data model and API | Publish directly. If quality issues arise, add a post-publish review step or content validation in the API endpoint |
| Paginated blog listing | "Show 10 posts per page with next/prev" | Pagination splits link equity across pages. Page 2+ rarely gets crawled. For an SEO blog, all posts should be discoverable from category/tag pages | Single long-scroll blog index with all posts visible (or lazy-loaded). Category pages as the primary navigation. Let sitemap handle deep discovery |
| Image-heavy content | "Blog posts need hero images and galleries" | Large images slow page load, hurt Core Web Vitals, and provide minimal SEO value for text-authority content. AI crawlers ignore images entirely | One optimized hero image per post (for OG/social). Keep content text-heavy for AI consumption. Use Next.js Image component with lazy loading for any images used |

## Feature Dependencies

```
Blog routing (/blog, /blog/[slug])
    |-- requires --> Content storage (MDX/JSON files)
    |-- requires --> Blog post data model (title, body, metadata, locale)
    |
    |-- enables --> BlogPosting JSON-LD structured data
    |-- enables --> SEO meta tags per post
    |-- enables --> Canonical URLs + hreflang alternates
    |-- enables --> XML sitemap extension
    |-- enables --> Internal linking to lead capture

Auto-publish API (/api/blog/publish)
    |-- requires --> Content storage
    |-- requires --> Blog post data model
    |-- enables --> Daily content velocity
    |-- triggers --> Sitemap regeneration
    |-- triggers --> llms.txt / llms-full.txt regeneration

Content storage
    |-- requires --> Blog post data model
    |-- enables --> Blog routing
    |-- enables --> Auto-publish API

Area guide content type
    |-- requires --> Blog routing
    |-- requires --> Content storage
    |-- enhances --> Topic clustering (creates city-specific clusters)
    |-- enhances --> LocalBusiness schema per city

Topic clustering (categories/tags)
    |-- requires --> Blog routing
    |-- requires --> Category/tag data model
    |-- enables --> Category pages (/blog/category/[slug])
    |-- enhances --> Internal linking strategy

llms.txt + llms-full.txt
    |-- requires --> Blog routing (needs content to reference)
    |-- enhanced-by --> Auto-publish API (auto-regenerate on publish)

Market report content type
    |-- requires --> Blog routing
    |-- requires --> Content storage
    |-- enhances --> Topic clustering
    |-- enhances --> Content freshness signals
```

### Dependency Notes

- **Blog routing requires content storage:** Cannot render posts without a place to read them from. This is the foundational dependency -- storage format decision unlocks everything else.
- **Auto-publish API requires content storage + data model:** API must know the schema of a post and where to write it. Design the data model first.
- **llms.txt enhanced by auto-publish:** Manually maintaining llms.txt defeats the purpose. Auto-regenerate whenever a new post is published so it always reflects current content.
- **Area guides enhance topic clustering:** Each area guide becomes the "pillar" page for a city cluster. Blog posts about that city link back to the guide, building topical authority.
- **Market reports enhance freshness:** Monthly market reports give the blog a reliable cadence of fresh, data-rich content that AI engines love to cite.

## MVP Definition

### Launch With (v1)

Minimum viable blog that search engines and AI crawlers can index and cite.

- [ ] Blog routing with dynamic `[slug]` pages -- the foundation everything builds on
- [ ] Content storage (MDX or JSON files) with blog post data model -- posts need a home
- [ ] Auto-publish API with API key auth -- OpenClaw needs to write posts from day one
- [ ] BlogPosting JSON-LD on every post -- structured data is how Google generates rich results
- [ ] SEO meta tags (title, description, canonical, hreflang, OG) per post -- without these, pages are invisible
- [ ] XML sitemap extension for blog posts -- crawler discovery for daily-published content
- [ ] Bilingual support (en/es) using next-intl -- competitive moat from day one
- [ ] `/llms.txt` -- near-zero effort, plants the flag for AI discoverability
- [ ] Internal linking CTAs to lead capture -- every blog page should drive conversions

### Add After Validation (v1.x)

Features to add once the blog is publishing daily and indexed.

- [ ] Topic clustering with categories/tags -- add once there are 20+ posts to cluster
- [ ] Category pages (`/blog/category/[slug]`) -- meaningful only with enough posts per category
- [ ] `/llms-full.txt` auto-regeneration -- concatenate all content on publish for AI ingestion
- [ ] Area guide content type (dedicated template) -- start with 3 highest-value cities (Georgetown, Round Rock, Pflugerville), expand to all 10+
- [ ] Market report content type (structured template) -- begin monthly reports once blog cadence is established

### Future Consideration (v2+)

Features to defer until topical authority is established.

- [ ] Advanced analytics dashboard (which posts get cited by AI engines) -- needs monitoring tools that don't exist yet at scale
- [ ] Content refresh automation (OpenClaw updates old posts with new data) -- requires edit API endpoint and content versioning
- [ ] Video content integration (virtual tours, market updates) -- high effort, moderate SEO value for text-authority strategy
- [ ] Programmatic internal linking (auto-suggest related posts) -- valuable at 100+ posts, premature before that

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Blog routing + content storage | HIGH | MEDIUM | P1 |
| Auto-publish API (OpenClaw) | HIGH | MEDIUM | P1 |
| BlogPosting JSON-LD | HIGH | LOW | P1 |
| SEO meta tags per post | HIGH | LOW | P1 |
| Canonical URLs + hreflang | HIGH | LOW | P1 |
| XML sitemap extension | HIGH | LOW | P1 |
| Bilingual content (en/es) | HIGH | MEDIUM | P1 |
| `/llms.txt` | MEDIUM | LOW | P1 |
| Internal linking CTAs | MEDIUM | LOW | P1 |
| Content freshness signals | MEDIUM | LOW | P1 |
| Heading hierarchy enforcement | MEDIUM | LOW | P1 |
| Mobile-responsive blog layout | HIGH | LOW | P1 |
| Topic clustering (categories/tags) | MEDIUM | MEDIUM | P2 |
| Category/tag pages | MEDIUM | MEDIUM | P2 |
| `/llms-full.txt` auto-regen | LOW | LOW | P2 |
| Area guide content type | HIGH | HIGH | P2 |
| Market report content type | MEDIUM | HIGH | P2 |
| GEO-optimized content formatting | MEDIUM | LOW | P2 |
| LocalBusiness schema per city | MEDIUM | LOW | P2 |
| Content refresh automation | LOW | HIGH | P3 |
| Analytics for AI citations | LOW | HIGH | P3 |

## Competitor Feature Analysis

| Feature | Typical RE Agent Blog | Top-Tier RE SEO Sites (Zillow, Redfin) | Our Approach |
|---------|----------------------|--------------------------------------|--------------|
| Structured data | None or basic | Full BlogPosting + Organization + BreadcrumbList | BlogPosting linked to RealEstateAgent/Person with `@id` references for entity cohesion |
| Bilingual content | Almost never | Rarely (some Spanish landing pages) | Full bilingual blog with native-quality Spanish content -- massive competitive moat in Central TX |
| llms.txt | None | None (even major sites haven't adopted) | Early adopter advantage at near-zero cost |
| Area guides | Generic "about [city]" pages | Comprehensive with market data, schools, commute | Deep hyper-local guides (1,500+ words) with structured data, targeting I-35 corridor cities |
| Content velocity | 1-2 posts/month, manual | Daily, editorial teams | Daily auto-publish via OpenClaw -- matches enterprise velocity without the cost |
| AI search optimization | None | Minimal (some schema.org) | Deliberately structured for AI citation: citable claims, expert attribution, GEO formatting |
| Market reports | Rare, usually PDF | Automated with MLS data | Structured monthly reports with citable statistics |
| Internal linking | Ad hoc | Systematic with related posts | Template-enforced CTAs linking to lead capture + related content |

## Sources

- [llms.txt specification](https://llmstxt.org/) -- official spec for AI-friendly site summaries
- [Bluehost llms.txt guide](https://www.bluehost.com/blog/what-is-llms-txt/) -- adoption rates and implementation details
- [Search Engine Land: llms.txt proposal](https://searchengineland.com/llms-txt-proposed-standard-453676) -- critical analysis of adoption impact
- [Search Engine Land: Mastering GEO in 2026](https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142) -- generative engine optimization strategies
- [Backlinko: Generative Engine Optimization](https://backlinko.com/generative-engine-optimization-geo) -- GEO best practices and content formatting
- [Schema.org: RealEstateAgent](https://schema.org/RealEstateAgent) -- official schema type definition
- [Superblog: Blog Schema Markup Guide 2026](https://superblog.ai/blog/blog-schema-markup-guide/) -- BlogPosting implementation best practices
- [HousingWire: Real Estate SEO Guide 2026](https://www.housingwire.com/articles/real-estate-seo/) -- table stakes for real estate SEO
- [Jeff Lenney: Neighborhood SEO Strategy](https://jefflenney.com/real-estate/neighborhood-seo-strategy/) -- three-layer content structure for area guides
- [myRealPage: Hyperlocal Neighborhood Guides](https://myrealpage.com/blog/the-hyperlocal-advantage-how-to-build-neighborhood-guides-that-dominate-real-estate-seo/) -- content depth and structure for area pages
- [Build with Matija: Canonical Tags and Hreflang in Next.js](https://www.buildwithmatija.com/blog/nextjs-advanced-seo-multilingual-canonical-tags) -- bilingual canonical/hreflang implementation
- [Next.js: Metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) -- native metadata API
- [Next.js: generateSitemaps](https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps) -- dynamic sitemap generation
- [Placester: Real Estate SEO](https://placester.com/real-estate-marketing-academy/real-estate-seo) -- local SEO strategies for agents

---
*Feature research for: SEO & AI Search Authority Blog for sullyruiz.com*
*Researched: 2026-03-05*
