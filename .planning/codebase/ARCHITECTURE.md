# Architecture

**Analysis Date:** 2026-03-05

## Pattern Overview

**Overall:** Next.js App Router with i18n-first single-page marketing site + multi-page lead capture flows

**Key Characteristics:**
- Single-page landing (`/`) composed of section components, orchestrated by a client-side page component
- Separate dedicated pages for high-intent funnels (`/consult`, `/screening`)
- All lead data flows through `/api/lead` or `/api/screening` API routes, then forwarded to external n8n webhooks
- Internationalization via `next-intl` with `[locale]` dynamic segment; English is default (no prefix), Spanish uses `/es`
- Client-side state management only (React useState, sessionStorage) -- no server state, no database
- Dual analytics tracking: Google Analytics 4 (client) + Meta Pixel (client) + Meta Conversions API (server-side dedup)

## Layers

**Presentation Layer (Components):**
- Purpose: Render UI sections and interactive lead capture forms
- Location: `src/components/`
- Contains: Section components (Hero, About, FAQ, etc.), interactive wizards (ChatWizard, ScreeningWizard), UI primitives
- Depends on: `src/lib/` utilities, `next-intl` translations, UI primitives in `src/components/ui/`
- Used by: Page components in `src/app/[locale]/`

**Page Layer (App Router):**
- Purpose: Compose components into pages, handle metadata/SEO, define routes
- Location: `src/app/[locale]/`
- Contains: `page.tsx` files that assemble section components, `layout.tsx` for providers/fonts/analytics
- Depends on: Components, i18n config, SEO config
- Used by: Next.js router

**API Layer (Route Handlers):**
- Purpose: Receive lead submissions, validate, forward to n8n webhooks, track via Meta CAPI
- Location: `src/app/api/`
- Contains: POST handlers for `/api/lead`, `/api/screening`, `/api/screening/prefill`, GET handler for `/api/health`
- Depends on: `src/lib/validation.ts`, `src/lib/meta-capi.ts`
- Used by: Client-side form submissions via `fetch()`

**Library Layer (Shared Utilities):**
- Purpose: Reusable logic for analytics, validation, session management, SEO
- Location: `src/lib/`
- Contains: Client-side analytics (`analytics.ts`, `meta-pixel.ts`, `utm.ts`, `session.ts`), server-side tracking (`meta-capi.ts`), validation (`validation.ts`), SEO helpers (`seo-config.ts`), Tailwind utility (`utils.ts`)
- Depends on: External SDKs (`@next/third-parties/google`), browser APIs (sessionStorage, localStorage)
- Used by: Components and API routes

**i18n Layer:**
- Purpose: Locale routing, message loading, navigation helpers
- Location: `src/i18n/`
- Contains: Routing config with pathnames (`routing.ts`), request config for message loading (`request.ts`), locale type definitions (`config.ts`)
- Depends on: `next-intl` library, message files in `/messages/`
- Used by: Middleware, layouts, all components via `useTranslations()`

**Middleware Layer:**
- Purpose: Locale detection and routing, custom redirects
- Location: `src/middleware.ts`
- Contains: next-intl middleware wrapper with custom `/consulta` -> `/es/consulta` redirect
- Depends on: `src/i18n/routing.ts`
- Used by: Next.js request pipeline (runs before every matched route)

## Data Flow

**Lead Capture (ChatWizard / LeadMagnet):**

1. User clicks CTA button on landing page -> `openChat()` in `src/app/[locale]/page.tsx` stores CTA source via `setCTASource()` in `src/lib/session.ts`, tracks click via `src/lib/analytics.ts`
2. ChatWizard (`src/components/chat-wizard.tsx`) opens as a Sheet (slide-over panel), guides user through multi-step Q&A flow
3. On form submit, component calls `fetch('/api/lead', { method: 'POST', body: payload })` with session_id, CTA source, answers, contact info, UTM params, and Meta event_id
4. API route (`src/app/api/lead/route.ts`) validates payload via `validateLeadPayload()`, normalizes phone, forwards to n8n webhook (`N8N_WEBHOOK_URL`), fires Meta CAPI server-side event
5. Response returned to client; ChatWizard shows success state; session cleared via `clearSession()`

**Lead Capture (Consult Form):**

1. User lands on `/consult` (en) or `/consulta` (es) -- dedicated landing page
2. ConsultForm (`src/components/consult/consult-form.tsx`) collects contact + qualification data
3. Submits to `/api/lead` with `type: "consult"` -- this type gets special handling: n8n response is parsed and forwarded back to client (unlike chat_wizard/lead_magnet which are fire-and-forget to n8n)
4. On success, n8n returns structured response with `leadId`, `notifications` status, and localized `nextSteps`
5. On failure (timeout/network/storage error), specific error codes are returned for client-side error handling

**Screening Flow:**

1. User arrives at `/screening` page, optionally with `?session_id=` query param for prefill
2. If session_id present, `src/app/[locale]/screening/page.tsx` fetches `/api/screening/prefill` to get previously submitted contact data from n8n
3. ScreeningWizard (`src/components/screening-wizard.tsx`) collects detailed qualification data (25+ fields)
4. Submits to `/api/screening` which calculates a lead score (0-100) and tier (hot/warm/developing/cold), then forwards to n8n via `N8N_SCREENING_WEBHOOK_URL`

**Analytics Tracking:**

1. Page load: UTM params captured from URL -> sessionStorage (`src/lib/utm.ts`), user properties set in GA4, scroll tracking initialized
2. CTA interactions: tracked via `src/lib/analytics.ts` which calls both GA4 (`sendGAEvent`) and Meta Pixel (`trackMetaLead`, `trackMetaViewContent`, `trackMetaContact`)
3. Form submission: client-side Meta Pixel event fired with event_id, then same event_id sent to API route which fires server-side Meta CAPI event for deduplication

**State Management:**
- No global state store (no Redux, Zustand, etc.)
- Page-level state via React `useState` in client components
- Session tracking via `sessionStorage` (session_id, CTA source, UTM params, Meta event IDs)
- Returning user detection via `localStorage` key `sullyruiz_returning`

## Key Abstractions

**Lead Types:**
- Purpose: Discriminated union type for different lead capture mechanisms
- Defined in: `src/app/api/lead/route.ts` (types `LeadMagnetPayload`, `ChatWizardPayload`, `ConsultLeadPayload`)
- Pattern: `type` field discriminates between `"lead_magnet"`, `"chat_wizard"`, and `"consult"` -- each has different required fields and different n8n handling behavior

**CTA Source Tracking:**
- Purpose: Track which button/section triggered lead capture for attribution
- Defined in: `src/lib/session.ts` (type `CTASource`)
- Values: `"navbar"`, `"hero_buy"`, `"hero_sell"`, `"about"`, `"services_buy"`, `"services_sell"`, `"lead_magnet"`, `"consult_form"`
- Pattern: Set in sessionStorage when CTA clicked, included in API payload

**Validation System:**
- Purpose: Consistent contact info validation across client and server
- Defined in: `src/lib/validation.ts`
- Pattern: Individual validators (`validateEmail`, `validatePhone`, `validateName`) return `{ valid: boolean, error?: string }`. Composite `validateLeadPayload()` applies different rules per lead type. Error strings are i18n translation keys (e.g., `"validation.email.required"`).

**SEO Configuration:**
- Purpose: Centralized SEO settings, canonical URLs, alternate links
- Defined in: `src/lib/seo-config.ts`
- Pattern: `siteConfig`, `businessInfo`, `socialLinks` objects + helper functions (`getCanonicalUrl`, `getAlternateLinks`, `getOgLocale`). Used by layouts for metadata and by `src/components/structured-data.tsx` for JSON-LD.

**i18n Navigation:**
- Purpose: Locale-aware Link, redirect, usePathname, useRouter
- Defined in: `src/i18n/routing.ts`
- Pattern: `createNavigation(routing)` exports locale-aware versions of Next.js navigation primitives. Use `Link` from `@/i18n/routing` instead of `next/link`. Supports localized pathnames (e.g., `/consult` in en, `/consulta` in es).

## Entry Points

**Landing Page:**
- Location: `src/app/[locale]/page.tsx`
- Triggers: `GET /` or `GET /es`
- Responsibilities: Renders all landing page sections, manages ChatWizard modal state, initializes analytics

**Consult Page:**
- Location: `src/app/[locale]/consult/page.tsx`
- Triggers: `GET /consult` (en) or `GET /es/consulta` (es)
- Responsibilities: Renders consult funnel sections, manages scroll-to-form behavior

**Screening Page:**
- Location: `src/app/[locale]/screening/page.tsx`
- Triggers: `GET /screening` or `GET /screening?session_id=xxx`
- Responsibilities: Fetches prefill data if session_id present, renders ScreeningWizard

**Lead API:**
- Location: `src/app/api/lead/route.ts`
- Triggers: `POST /api/lead` from ChatWizard, LeadMagnet, or ConsultForm
- Responsibilities: Validates, normalizes, forwards to n8n, fires Meta CAPI, returns structured response for consult type

**Screening API:**
- Location: `src/app/api/screening/route.ts`
- Triggers: `POST /api/screening` from ScreeningWizard
- Responsibilities: Validates, calculates lead score/tier, forwards to n8n

**Health Check:**
- Location: `src/app/api/health/route.ts`
- Triggers: `GET /api/health` (Docker/deployment health checks)
- Responsibilities: Returns `{ status: 'healthy', timestamp }` -- no dependencies checked

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Every request
- Responsibilities: Minimal pass-through (returns `children` only)

**Locale Layout:**
- Location: `src/app/[locale]/layout.tsx`
- Triggers: Every locale-prefixed request
- Responsibilities: Font loading (Montserrat, Cormorant Garamond), NextIntlClientProvider setup, Google Analytics, Meta Pixel, structured data (JSON-LD), ToastProvider

**Middleware:**
- Location: `src/middleware.ts`
- Triggers: Requests matching `['/', '/(en|es)/:path*', '/screening', '/privacy', '/terms', '/data-deletion', '/consult', '/consulta']`
- Responsibilities: Locale detection/redirect, `/consulta` -> `/es/consulta` redirect

## Error Handling

**Strategy:** Graceful degradation -- external service failures do not break user-facing functionality

**Patterns:**
- **API routes**: Try/catch around n8n webhook calls. For `consult` type, errors are returned with specific error codes (`TIMEOUT_ERROR`, `NETWORK_ERROR`, `STORAGE_ERROR`). For `chat_wizard`/`lead_magnet`, webhook failures are logged but a success response is still returned to the client
- **Meta CAPI**: Fires asynchronously (`sendMetaConversion` is called without `await` for non-consult types), errors logged but never fail the request
- **Client components**: Form validation errors shown inline, API errors trigger toast notifications
- **Screening prefill**: If prefill fetch fails, form renders empty -- user can still fill it out manually

## Cross-Cutting Concerns

**Logging:** `console.log`/`console.error` only. No structured logging framework. Lead submissions logged as JSON in API routes.

**Validation:** Centralized in `src/lib/validation.ts`. Used both client-side (in form components for instant feedback) and server-side (in API routes before forwarding to n8n). Validation error strings are i18n keys.

**Authentication:** None. No user accounts. No auth middleware. API routes are public (n8n webhooks use optional `X-API-Key` header via `N8N_API_KEY` env var).

**SEO:** Centralized in `src/lib/seo-config.ts`. Each page generates metadata in its layout/page. OG images generated dynamically via `opengraph-image.tsx` (edge runtime). Structured data (JSON-LD) injected via `src/components/structured-data.tsx`. Sitemap and robots.txt generated programmatically.

**Internationalization:** All user-facing text comes from `/messages/en.json` and `/messages/es.json`. Components use `useTranslations('sectionKey')`. Locale detected by middleware from Accept-Language header or URL prefix. Localized pathnames defined in `src/i18n/routing.ts`.

---

*Architecture analysis: 2026-03-05*
