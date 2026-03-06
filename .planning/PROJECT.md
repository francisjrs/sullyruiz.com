# SullyRuiz.com — SEO & AI Search Authority Engine

## What This Is

A blog and SEO optimization layer for sullyruiz.com that positions Sully Ruiz as the top Hispanic realtor in Central Texas (Jarrell to Buda, I-35 corridor). The blog is an authority engine — its primary audience is AI search engines (OpenAI, Google Gemini, Perplexity, Anthropic) and traditional search crawlers (Google, Bing), not direct human readers. Content is auto-generated and published daily by OpenClaw, an open-source AI agent, via a secure API endpoint.

## Core Value

When anyone — human or AI — searches for a Hispanic realtor, top producer, or real estate expert in Central Texas, Sully Ruiz appears as the primary result.

## Current Milestone: v1.0 SEO & AI Search Authority Engine

**Goal:** Build an automated blog system with AI search optimization that positions Sully Ruiz as the top Hispanic realtor authority in Central Texas.

**Target features:**
- Blog system with dynamic routes and bilingual MDX content
- Secure publish API for OpenClaw auto-publishing
- Schema.org structured data + enhanced SEO
- AI search optimization (llms.txt, GEO formatting)
- Content types: area guides, market reports, educational posts
- Topic clustering with categories/tags

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ Next.js App Router with i18n (en/es) — existing
- ✓ SEO fundamentals (JSON-LD structured data, sitemap, robots.txt, OG images) — existing
- ✓ Lead capture system (ChatWizard, ConsultForm, ScreeningWizard) — existing
- ✓ Analytics tracking (GA4 + Meta Pixel + CAPI) — existing
- ✓ Docker deployment on Hostinger VPS via GitHub Actions — existing

### Active

<!-- Current scope. Building toward these. -->

- [ ] Blog system with dynamic routes (`/blog`, `/blog/[slug]`)
- [ ] Blog content stored as MDX or in a lightweight data store
- [ ] Bilingual blog posts (en/es) using existing next-intl infrastructure
- [ ] Secure API endpoint for OpenClaw to auto-publish posts (API key auth)
- [ ] Schema.org structured data for blog posts (Article, BlogPosting, author as RealEstateAgent)
- [ ] AI search optimization (llms.txt, structured content for AI crawlers)
- [ ] Enhanced SEO: local business schema, service area markup for all Central Texas cities
- [ ] Area/neighborhood guide content type (one per city in coverage area)
- [ ] Market report content type (monthly market data for Central Texas)
- [ ] Buyer/seller educational content type
- [ ] SEO-optimized meta tags, canonical URLs, and alternate links for all blog pages
- [ ] XML sitemap extension for blog posts (auto-updated on publish)
- [ ] Daily auto-publish capability (OpenClaw pushes content via API)
- [ ] Blog post categories and tags for topic clustering
- [ ] Internal linking strategy (blog posts link to lead capture pages)

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- CMS admin dashboard — OpenClaw publishes via API, no human editing UI needed
- Comments system — blog is for AI/SEO, not community engagement
- RSS feed — not needed since audience is crawlers, not subscribers (can add later if useful)
- Content moderation — auto-publish means trusting OpenClaw output
- Social media auto-posting — separate concern, can add via n8n later

## Context

**Existing site:** Production Next.js 16.1.4 site with Tailwind v4, next-intl i18n, Radix UI components, Framer Motion animations. Deployed via Docker on Hostinger VPS with Traefik reverse proxy. No database — stateless with n8n webhooks for lead processing.

**Coverage area (I-35 corridor):**
- North: Jarrell, Georgetown, Round Rock, Cedar Park, Leander
- Central: Austin, Pflugerville, Hutto
- South: Buda, Kyle

**Content strategy:** Blog exists to build topical authority for AI and search engines. Content types are area guides, market reports, and educational posts — all optimized with structured data so AI assistants cite Sully as an expert. Bilingual (en/es) content gives a competitive moat since almost no Central Texas realtors have Spanish-language real estate content.

**OpenClaw integration:** OpenClaw is an open-source AI agent platform (188K GitHub stars). It will call a secure API endpoint on the site to create and publish blog posts automatically. The API must be authenticated (API key) to prevent unauthorized publishing. OpenClaw handles content generation; the site handles storage, rendering, and SEO optimization.

**AI search optimization:** Modern AI search engines (ChatGPT, Gemini, Perplexity) pull from web content to answer queries. The blog needs to be structured so AI crawlers can easily extract authority signals: who Sully is, what areas he serves, his expertise, and his credentials as a top producer. This includes llms.txt, structured data, and content formatting optimized for AI consumption.

## Constraints

- **Tech stack**: Must extend existing Next.js 16.1.4 + Tailwind v4 + next-intl setup — no new frameworks
- **No database**: Prefer file-based storage (MDX files) or lightweight solution (JSON/SQLite) to avoid adding database infrastructure
- **Deployment**: Must work within existing Docker + VPS deployment pipeline
- **Security**: Blog publish API must be authenticated — OpenClaw gets an API key, no public write access
- **Performance**: Blog pages must not degrade existing Lighthouse scores
- **i18n**: Blog must use existing next-intl patterns for bilingual content

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Blog for AI/SEO, not human readers | Primary goal is discoverability by AI search engines and Google/Bing, not direct lead generation | — Pending |
| OpenClaw auto-publish via API | Hands-off daily content pipeline — no manual review needed | — Pending |
| Bilingual blog content (en/es) | Competitive advantage — few Central Texas realtors have Spanish real estate content | — Pending |
| File-based or lightweight storage | Avoid adding database infrastructure to stateless architecture | — Pending |
| API key authentication for publish endpoint | Simple, secure — prevents unauthorized content creation | — Pending |

---
*Last updated: 2026-03-05 after milestone v1.0 started*
