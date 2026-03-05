# External Integrations

**Analysis Date:** 2026-03-05

## APIs & External Services

**n8n Workflow Automation (Lead Processing):**
- Used for: Receiving and processing all lead capture data, sending notifications (email, WhatsApp, agent alerts)
- Endpoints consumed:
  - Lead webhook (`N8N_WEBHOOK_URL`) - receives chat wizard, lead magnet, and consult form submissions
  - Screening webhook (`N8N_SCREENING_WEBHOOK_URL`) - receives screening questionnaire data with lead scores
  - Lead lookup webhook (`N8N_LEAD_LOOKUP_WEBHOOK_URL`) - retrieves existing lead data for form prefill
- Auth: API key via `X-API-Key` header (`N8N_API_KEY` env var)
- Client: Native `fetch` API with 30s timeout (AbortController) for lead webhook; no timeout for screening
- Implementation files:
  - `src/app/api/lead/route.ts` - POST handler, forwards to n8n, parses typed response (`N8nSuccessResponse` / `N8nErrorResponse`)
  - `src/app/api/screening/route.ts` - POST handler with lead scoring algorithm, forwards enriched data to n8n
  - `src/app/api/screening/prefill/route.ts` - GET handler, fetches lead data from n8n for form prefill

**Meta (Facebook) Conversions API:**
- Used for: Server-side conversion tracking (deduplication with client-side Pixel)
- API: `https://graph.facebook.com/v21.0/{pixelId}/events`
- Auth: Access token via query parameter (`META_CAPI_ACCESS_TOKEN` env var)
- Pixel ID: `META_PIXEL_ID` env var
- Events tracked: `Lead` (chat wizard, lead magnet), `Contact` (consult form - higher value)
- PII handling: All user data (email, phone, name) is SHA256 hashed before sending per Meta requirements
- Cookie extraction: `_fbc` (click ID) and `_fbp` (browser ID) extracted from request cookies
- Implementation: `src/lib/meta-capi.ts` - server-side event sending with `extractUserData()` and `sendConversionEvent()`
- Called non-blocking from lead API route (fire-and-forget pattern)

**Meta (Facebook) Pixel (Client-Side):**
- Used for: Client-side conversion tracking with event deduplication
- SDK: Facebook Pixel JS SDK loaded via `next/script` with `afterInteractive` strategy
- Pixel ID: `NEXT_PUBLIC_META_PIXEL_ID` env var, hardcoded fallback `1863481567884620`
- Events tracked: `PageView`, `Lead`, `ViewContent`, `Contact`
- Event ID deduplication: Each event generates a unique ID shared between client Pixel and server CAPI
- Implementation files:
  - `src/components/meta-pixel.tsx` - Pixel script injection component
  - `src/lib/meta-pixel.ts` - Client-side tracking functions (`trackMetaLead`, `trackMetaViewContent`, `trackMetaContact`)

**Google Analytics 4:**
- Used for: Page analytics, lead funnel tracking, scroll depth, UTM attribution
- SDK: `@next/third-parties/google` (`GoogleAnalytics` component + `sendGAEvent`)
- Auth: `NEXT_PUBLIC_GA_MEASUREMENT_ID` env var (conditionally rendered)
- Events tracked:
  - `generate_lead` - Lead form submissions (value: $1 for wizard/magnet, $5 for consult)
  - `cta_click` - CTA button interactions
  - `wizard_opened` / `wizard_closed` / `wizard_step` - Wizard funnel tracking
  - `guide_type_selected` - Guide toggle interaction
  - `scroll_depth` - 25%, 50%, 75%, 90% milestones
  - `form_error` - Validation error tracking
  - User properties: `user_locale`, `user_type`, UTM first-touch attribution
- Implementation: `src/lib/analytics.ts` - Unified analytics layer wrapping both GA4 and Meta Pixel

**Google Fonts:**
- Used for: Typography
- Fonts loaded: Montserrat (400-700), Cormorant Garamond (400-700)
- Loaded via `next/font/google` with `display: swap` for performance
- Implementation: `src/app/[locale]/layout.tsx`

## Data Storage

**Databases:**
- None - Application is stateless. All lead data is forwarded to n8n webhooks for external storage/processing.

**File Storage:**
- Local filesystem only (static assets in `public/`)
- PDF guides generated at build time via `scripts/generate-guides.ts` using `@react-pdf/renderer`
- PDF content defined in `src/pdf/buyers-guide/` and `src/pdf/sellers-guide/`

**Caching:**
- None (beyond Next.js built-in static/ISR caching)

**Session Management:**
- Client-side only via `sessionStorage`
- Session ID: UUID v4 generated per browser session (`src/lib/session.ts`)
- UTM parameters: Captured from URL on first load, persisted in `sessionStorage` (`src/lib/utm.ts`)
- Meta event IDs: Stored in `sessionStorage` for CAPI deduplication (`src/lib/meta-pixel.ts`)

## Authentication & Identity

**Auth Provider:**
- None - Public-facing marketing site with no user authentication
- n8n webhook auth uses shared API key (`N8N_API_KEY` via `X-API-Key` header)

## Monitoring & Observability

**Error Tracking:**
- None (no Sentry, Datadog, etc.)
- Errors logged to `console.error` (visible in Docker container logs)

**Logs:**
- `console.log` / `console.error` throughout API routes
- Accessible via `docker compose logs` on VPS

**Performance Monitoring:**
- Lighthouse CI via GitHub Actions (`.github/workflows/performance-monitoring.yml`)
- Runs on push to main, PRs, and daily at 6 AM UTC
- Reports uploaded as GitHub Actions artifacts (30-day retention)
- Measures: Performance, Accessibility, Best Practices, SEO scores

**Health Check:**
- Endpoint: `GET /api/health` (`src/app/api/health/route.ts`)
- Returns: `{ status: "healthy", timestamp: "..." }`
- Used by Docker healthcheck (wget every 30s, 3 retries, 60s start period)

## CI/CD & Deployment

**Hosting:**
- Hostinger VPS (Docker-based deployment)
- Domain: `sullyruiz.com` (with www redirect to non-www)

**Container Registry:**
- GitHub Container Registry (`ghcr.io/francisjrs/sullyruiz.com:latest`)

**Reverse Proxy:**
- Traefik v2.11 (`docker-compose.yml`)
- Handles: TLS termination (Let's Encrypt ACME), HTTP-to-HTTPS redirect, www-to-non-www redirect
- Security headers: HSTS (10 years), XSS filter, content type nosniff, STS preload

**CI Pipeline:**
- GitHub Actions
  - **Deploy** (`.github/workflows/deploy.yml`): On push to `main` - build Docker image with Buildx (GHA cache), push to GHCR, SSH to VPS, pull and restart via `docker compose`
  - **Performance** (`.github/workflows/performance-monitoring.yml`): Lighthouse CI audits on push/PR/schedule

## Environment Configuration

**Required env vars (server-side, production):**
- `N8N_WEBHOOK_URL` - Lead capture webhook URL
- `N8N_API_KEY` - n8n API authentication key
- `META_PIXEL_ID` - Meta Pixel ID for CAPI
- `META_CAPI_ACCESS_TOKEN` - Meta Conversions API token

**Optional env vars (server-side):**
- `N8N_SCREENING_WEBHOOK_URL` - Screening form webhook (screening works without it, just logs locally)
- `N8N_LEAD_LOOKUP_WEBHOOK_URL` - Lead prefill lookup (returns empty data if not configured)

**Required env vars (client-side / build-time):**
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - GA4 measurement ID (GA disabled if missing)
- `NEXT_PUBLIC_META_PIXEL_ID` - Meta Pixel ID (has hardcoded fallback)

**Docker Compose env vars:**
- `DOMAIN_NAME` - Domain for Traefik routing rules
- `SSL_EMAIL` - Email for Let's Encrypt certificate registration

**Secrets location:**
- Production: `/opt/sullyruiz/.env` on VPS (loaded by Docker Compose `env_file`)
- CI/CD: GitHub repository secrets (`VPS_HOST`, `VPS_USERNAME`, `VPS_SSH_KEY`, `GITHUB_TOKEN`)
- Local dev: `.env.local` (gitignored)

## Webhooks & Callbacks

**Incoming:**
- `POST /api/lead` - Receives lead submissions from frontend (chat wizard, lead magnet, consult form)
- `POST /api/screening` - Receives screening questionnaire submissions
- `GET /api/screening/prefill` - Returns existing lead data for form prefill
- `GET /api/health` - Health check endpoint

**Outgoing:**
- n8n lead webhook (`N8N_WEBHOOK_URL`) - Lead data with UTM params and timestamp
- n8n screening webhook (`N8N_SCREENING_WEBHOOK_URL`) - Screening data with calculated lead score/tier
- n8n lead lookup webhook (`N8N_LEAD_LOOKUP_WEBHOOK_URL`) - Session ID lookup for prefill
- Meta Conversions API (`graph.facebook.com/v21.0`) - Server-side conversion events

---

*Integration audit: 2026-03-05*
