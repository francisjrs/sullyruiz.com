# Technology Stack

**Analysis Date:** 2026-03-05

## Languages

**Primary:**
- TypeScript ^5 - All source code (`src/**/*.ts`, `src/**/*.tsx`)

**Secondary:**
- JSON - Translation files (`messages/en.json`, `messages/es.json`), configuration
- YAML - CI/CD workflows (`.github/workflows/*.yml`), Docker Compose (`docker-compose.yml`)

## Runtime

**Environment:**
- Node.js 22 (Alpine) - Production runtime via Docker (`Dockerfile` uses `node:22-alpine`)
- Node.js 20 - CI/CD environment (`.github/workflows/performance-monitoring.yml`)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 16.1.4 - Full-stack React framework with App Router (`next.config.ts`)
- React 19.2.3 - UI library
- React DOM 19.2.3 - DOM rendering

**Styling:**
- Tailwind CSS ^4 - Utility-first CSS (`postcss.config.mjs`, `@tailwindcss/postcss`)
- tw-animate-css ^1.4.0 - Animation utilities (dev dependency)

**Internationalization:**
- next-intl ^4.7.0 - i18n with `[locale]` dynamic route segments (`src/i18n/routing.ts`, `src/i18n/config.ts`, `src/i18n/request.ts`)

**UI Components:**
- Radix UI - Headless primitives: Accordion, Dialog, Label, Select, Separator, Slot (`src/components/ui/`)
- class-variance-authority ^0.7.1 - Component variant management
- clsx ^2.1.1 + tailwind-merge ^3.4.0 - Conditional class composition (`src/lib/utils.ts`)
- Lucide React ^0.562.0 - Icon library

**Animation:**
- Framer Motion ^12.27.5 - Page/component animations

**PDF Generation:**
- @react-pdf/renderer ^4.3.2 - Server-side PDF generation for buyer/seller guides (`src/pdf/`)

**Analytics:**
- @next/third-parties ^16.1.6 - Google Analytics integration (GA4 via `GoogleAnalytics` component)

**Testing:**
- Not detected - No test framework configured

**Build/Dev:**
- tsx ^4.21.0 - TypeScript execution for scripts (`scripts/generate-guides.ts`)
- sharp ^0.34.5 - Image optimization (Next.js image processing, dev dependency)
- ESLint ^9 + eslint-config-next 16.1.4 - Linting (`eslint.config.mjs`)
- PostCSS - CSS processing (`postcss.config.mjs`)

## Key Dependencies

**Critical:**
- `next` 16.1.4 - Core framework, App Router with standalone output mode
- `next-intl` ^4.7.0 - All user-facing text routed through translation files; locale-aware routing with `as-needed` prefix strategy
- `react` 19.2.3 - Uses React 19 features (async server components, `use` hook support)
- `@react-pdf/renderer` ^4.3.2 - Generates downloadable buyer/seller guide PDFs

**Infrastructure:**
- `uuid` ^13.0.0 - Session ID generation for lead tracking (`src/lib/session.ts`)
- `@next/third-parties` ^16.1.6 - GA4 event tracking via `sendGAEvent` (`src/lib/analytics.ts`)

## Configuration

**TypeScript:**
- Config: `tsconfig.json`
- Target: ES2017, strict mode enabled
- Module resolution: bundler
- Path alias: `@/*` maps to `./src/*`
- JSX: react-jsx

**Next.js:**
- Config: `next.config.ts`
- Output: `standalone` (optimized for Docker deployment)
- Plugin: `next-intl/plugin` wraps config for i18n support

**Styling:**
- Config: `postcss.config.mjs`
- Uses `@tailwindcss/postcss` plugin (Tailwind v4 PostCSS integration)

**Linting:**
- Config: `eslint.config.mjs`
- Extends: `eslint-config-next`

**Environment Variables (server-side):**
- `N8N_WEBHOOK_URL` - Lead capture webhook endpoint
- `N8N_SCREENING_WEBHOOK_URL` - Screening form webhook endpoint
- `N8N_LEAD_LOOKUP_WEBHOOK_URL` - Lead data prefill lookup webhook
- `N8N_API_KEY` - API key for n8n webhook authentication
- `META_PIXEL_ID` - Meta Pixel ID for server-side Conversions API
- `META_CAPI_ACCESS_TOKEN` - Meta Conversions API access token

**Environment Variables (client-side / build-time):**
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics 4 measurement ID
- `NEXT_PUBLIC_META_PIXEL_ID` - Meta Pixel ID (fallback hardcoded: `1863481567884620`)

**Environment Files:**
- `.env.example` - Template for required env vars
- `.env.local` - Local development overrides (gitignored)
- VPS production: `/opt/sullyruiz/.env` (loaded via `docker-compose.yml` `env_file`)

## Platform Requirements

**Development:**
- Node.js 20+ (recommended 22 to match production)
- npm for package management
- No database required (stateless, leads forwarded to n8n)

**Production:**
- Docker (multi-stage build: `node:22-alpine`)
- Traefik v2.11 reverse proxy (TLS termination, ACME/Let's Encrypt)
- Hostinger VPS (IP: configured via GitHub Secrets)
- GitHub Container Registry (`ghcr.io`) for image storage

**CI/CD:**
- GitHub Actions
  - `deploy.yml` - Build Docker image, push to GHCR, SSH deploy to VPS on push to `main`
  - `performance-monitoring.yml` - Lighthouse CI audits on push/PR/daily schedule

---

*Stack analysis: 2026-03-05*
