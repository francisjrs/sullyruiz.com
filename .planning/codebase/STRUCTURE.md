# Codebase Structure

**Analysis Date:** 2026-03-05

## Directory Layout

```
sullyruiz.com/
├── .github/
│   ├── actions/setup-node/   # Reusable action for Node setup
│   └── workflows/            # CI/CD pipelines
├── .planning/
│   └── codebase/             # GSD codebase analysis docs
├── documents/                # Human-written documentation
│   ├── api/                  # API endpoint docs
│   ├── architecture/         # Architecture docs
│   ├── deployment/           # Deployment guides
│   ├── features/             # Feature docs
│   ├── integrations/         # Integration docs
│   ├── pages/                # Page-level docs
│   └── reference/            # Reference tables
├── messages/                 # i18n translation files
│   ├── en.json               # English translations
│   └── es.json               # Spanish translations
├── n8n_doc/                  # n8n workflow documentation
├── n8n_tables/               # n8n database table schemas
├── portrait/                 # Source portrait images (not served directly)
├── public/                   # Static assets served by Next.js
│   ├── guides/               # PDF guides (buyer/seller, en/es)
│   ├── images/               # Optimized web images (.webp, .png)
│   └── videos/               # Video assets and posters
├── scripts/                  # Build/utility scripts
│   └── generate-guides.ts    # PDF guide generation script
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── [locale]/         # Locale-prefixed pages
│   │   │   ├── consult/      # Consultation funnel page
│   │   │   ├── data-deletion/# GDPR data deletion page
│   │   │   ├── privacy/      # Privacy policy page
│   │   │   ├── screening/    # Lead screening wizard page
│   │   │   └── terms/        # Terms of service page
│   │   └── api/              # API route handlers
│   │       ├── health/       # Health check endpoint
│   │       ├── lead/         # Lead capture endpoint
│   │       └── screening/    # Screening submission + prefill
│   ├── components/           # React components
│   │   ├── consult/          # Consult page section components
│   │   └── ui/               # Reusable UI primitives (shadcn/ui)
│   ├── i18n/                 # Internationalization config
│   ├── lib/                  # Shared utilities and helpers
│   └── pdf/                  # PDF generation components (React-PDF)
│       ├── buyers-guide/     # Buyer's guide PDF
│       │   ├── components/   # PDF-specific components
│       │   └── content/      # Localized content data
│       └── sellers-guide/    # Seller's guide PDF
│           └── content/      # Localized content data
├── CLAUDE.md                 # Claude Code instructions
├── Dockerfile                # Production Docker image
├── docker-compose.yml        # Docker Compose config
├── eslint.config.mjs         # ESLint flat config
├── next.config.ts            # Next.js configuration
├── package.json              # Dependencies and scripts
├── postcss.config.mjs        # PostCSS config (Tailwind)
└── tsconfig.json             # TypeScript configuration
```

## Directory Purposes

**`src/app/[locale]/`:**
- Purpose: All user-facing pages, organized by locale dynamic segment
- Contains: `page.tsx` (page component), `layout.tsx` (metadata/providers), `opengraph-image.tsx` (OG image generation)
- Key files: `page.tsx` (landing page), `consult/page.tsx` (consultation funnel), `screening/page.tsx` (screening wizard)

**`src/app/api/`:**
- Purpose: Server-side API route handlers
- Contains: One `route.ts` per endpoint directory
- Key files: `lead/route.ts` (main lead capture), `screening/route.ts` (screening submission), `screening/prefill/route.ts` (prefill lookup), `health/route.ts` (health check)

**`src/components/`:**
- Purpose: All React components -- both page sections and reusable primitives
- Contains: Landing page sections (top-level), consult page sections (`consult/`), UI primitives (`ui/`)
- Key files: `chat-wizard.tsx` (multi-step lead wizard), `screening-wizard.tsx` (screening questionnaire), `lead-magnet.tsx` (guide download form)

**`src/components/ui/`:**
- Purpose: Reusable UI primitives following shadcn/ui patterns (Radix UI + Tailwind)
- Contains: `button.tsx`, `dialog.tsx`, `sheet.tsx`, `input.tsx`, `select.tsx`, `accordion.tsx`, `toast.tsx`, `card.tsx`, `badge.tsx`, `label.tsx`, `separator.tsx`, `textarea.tsx`, `video-player.tsx`
- Pattern: Each file exports a single component built on Radix UI primitives, styled with Tailwind via `cn()` utility

**`src/components/consult/`:**
- Purpose: Section components specific to the consult landing page
- Contains: `consult-hero.tsx`, `video-hero.tsx`, `consult-stories.tsx`, `consult-problem.tsx`, `consult-solution.tsx`, `consult-deliverables.tsx`, `consult-form.tsx`, `consult-footer.tsx`
- Key file: `index.ts` (barrel export)

**`src/lib/`:**
- Purpose: Shared utilities, helpers, and configuration
- Contains: Client-side modules (`analytics.ts`, `meta-pixel.ts`, `utm.ts`, `session.ts`), server-side modules (`meta-capi.ts`), shared modules (`validation.ts`, `seo-config.ts`, `utils.ts`)

**`src/i18n/`:**
- Purpose: next-intl configuration
- Contains: `routing.ts` (locale routing + navigation exports), `request.ts` (server-side message loading), `config.ts` (locale type definitions)

**`src/pdf/`:**
- Purpose: React-PDF components for generating buyer/seller guides
- Contains: PDF document components and localized content data files
- Key files: `buyers-guide/index.tsx`, `sellers-guide/index.tsx`

**`messages/`:**
- Purpose: i18n translation JSON files
- Contains: `en.json`, `es.json` -- flat namespace structure keyed by section (e.g., `hero`, `about`, `faq`, `consult`)
- Used by: `next-intl` via `useTranslations('sectionKey')`

**`public/`:**
- Purpose: Static assets served at root URL path
- Contains: Images (`.webp` format preferred), PDF guides, video posters, SVG icons

**`scripts/`:**
- Purpose: Build-time utility scripts
- Contains: `generate-guides.ts` for PDF generation

**`documents/`:**
- Purpose: Human-written project documentation
- Contains: Detailed docs organized by topic (API, architecture, deployment, features, integrations)

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root layout (minimal pass-through)
- `src/app/[locale]/layout.tsx`: Main layout (fonts, providers, analytics, metadata)
- `src/app/[locale]/page.tsx`: Landing page (composes all sections)
- `src/middleware.ts`: Request middleware (locale detection, redirects)

**Configuration:**
- `next.config.ts`: Next.js config (standalone output, next-intl plugin)
- `tsconfig.json`: TypeScript config (path alias `@/*` -> `src/*`)
- `eslint.config.mjs`: ESLint flat config
- `postcss.config.mjs`: PostCSS with Tailwind
- `components.json`: shadcn/ui component config
- `Dockerfile`: Multi-stage production build
- `docker-compose.yml`: Container orchestration
- `.github/workflows/deploy.yml`: CI/CD pipeline

**Core Logic:**
- `src/app/api/lead/route.ts`: Lead capture API (validation, n8n forwarding, Meta CAPI)
- `src/app/api/screening/route.ts`: Screening API (lead scoring, n8n forwarding)
- `src/lib/validation.ts`: Contact info validation
- `src/lib/analytics.ts`: GA4 + Meta Pixel event tracking
- `src/lib/meta-capi.ts`: Server-side Meta Conversions API
- `src/lib/session.ts`: Session/CTA source tracking
- `src/lib/seo-config.ts`: SEO configuration and helpers
- `src/i18n/routing.ts`: Locale routing with localized pathnames

**Testing:**
- No test files exist in the codebase

## Naming Conventions

**Files:**
- Components: `kebab-case.tsx` (e.g., `chat-wizard.tsx`, `trust-section.tsx`)
- UI primitives: `kebab-case.tsx` (e.g., `button.tsx`, `video-player.tsx`)
- Lib modules: `kebab-case.ts` (e.g., `seo-config.ts`, `meta-capi.ts`)
- API routes: `route.ts` inside purpose-named directory (e.g., `api/lead/route.ts`)
- Pages: `page.tsx` inside route directory
- Layouts: `layout.tsx` inside route directory

**Directories:**
- Route segments: `kebab-case` (e.g., `data-deletion/`, `how-it-works/` implicit in component name)
- Feature groups: `kebab-case` (e.g., `buyers-guide/`, `sellers-guide/`)
- Dynamic segments: `[paramName]` (e.g., `[locale]`)

**Component Exports:**
- Named exports using PascalCase: `export function Hero()`, `export function ChatWizard()`
- Page components use default exports: `export default function Home()`
- Barrel files in feature directories: `index.ts` with re-exports

**Translation Keys:**
- Dot-notation namespaces: `useTranslations('hero')`, `useTranslations('leadMagnet')`
- Nested keys in JSON: `hero.title`, `hero.subtitle`, `faq.items.1.question`

## Where to Add New Code

**New Landing Page Section:**
- Component: `src/components/{section-name}.tsx` -- export named PascalCase function
- Add to page: Import and place in `src/app/[locale]/page.tsx` in section order
- Translations: Add section key to both `messages/en.json` and `messages/es.json`
- Use `useTranslations('sectionName')` in the component

**New Standalone Page:**
- Page: `src/app/[locale]/{page-name}/page.tsx`
- Layout (if custom metadata): `src/app/[locale]/{page-name}/layout.tsx`
- OG image (if needed): `src/app/[locale]/{page-name}/opengraph-image.tsx`
- Add route to `src/i18n/routing.ts` pathnames (with Spanish translation if applicable)
- Add to middleware matcher in `src/middleware.ts`
- Add to `publicPages` array in `src/lib/seo-config.ts` for sitemap inclusion

**New API Endpoint:**
- Route: `src/app/api/{endpoint-name}/route.ts`
- Export named async functions: `GET`, `POST`, `PUT`, `DELETE`
- Use `NextResponse.json()` for responses
- Add validation via `src/lib/validation.ts` if handling user input
- Robots.txt already disallows `/api/` from crawlers

**New UI Primitive:**
- Component: `src/components/ui/{component-name}.tsx`
- Follow shadcn/ui pattern: Radix UI primitive + Tailwind styling via `cn()`
- Use `components.json` config for shadcn/ui CLI additions

**New Consult Page Section:**
- Component: `src/components/consult/{section-name}.tsx`
- Add export to barrel file: `src/components/consult/index.ts`
- Add to page: `src/app/[locale]/consult/page.tsx`

**New Library Utility:**
- Module: `src/lib/{utility-name}.ts`
- Mark client-only modules with `"use client"` directive at top
- Server-only modules (using Node APIs like `crypto`) should NOT have `"use client"`
- Import via `@/lib/{utility-name}`

**New PDF Guide:**
- Directory: `src/pdf/{guide-name}/`
- Content: `src/pdf/{guide-name}/content/en.ts` and `content/es.ts`
- Component: `src/pdf/{guide-name}/index.tsx`
- Output: `public/guides/{guide-file}.pdf`

## Special Directories

**`node_modules/`:**
- Purpose: npm dependencies
- Generated: Yes
- Committed: No

**`.next/`:**
- Purpose: Next.js build output
- Generated: Yes
- Committed: No

**`portrait/`:**
- Purpose: Source portrait/headshot images (raw assets, not web-optimized)
- Generated: No
- Committed: Yes (but not served directly by Next.js)

**`n8n_doc/` and `n8n_tables/`:**
- Purpose: Documentation and schema definitions for n8n automation workflows
- Generated: No
- Committed: Yes
- Note: Reference material only, not used by the application at runtime

**`documents/`:**
- Purpose: Comprehensive human-written documentation
- Generated: No
- Committed: Yes
- Note: Not used by the application, serves as project knowledge base

**`.playwright-mcp/`:**
- Purpose: Reference screenshots for UI development
- Generated: Partially (screenshots captured via Playwright)
- Committed: Yes

---

*Structure analysis: 2026-03-05*
