# Codebase Concerns

**Analysis Date:** 2026-03-05

## Tech Debt

**Duplicated Type Definitions:**
- Issue: `ScreeningData` interface is defined identically in two files, `N8nSuccessResponse`/`N8nErrorResponse` interfaces duplicated across two files, and `CTASource` type is defined separately in both `src/lib/session.ts` and `src/app/api/lead/route.ts`.
- Files: `src/components/screening-wizard.tsx` (line 22), `src/app/api/screening/route.ts` (line 4), `src/components/consult/consult-form.tsx` (line 52), `src/app/api/lead/route.ts` (line 89), `src/lib/session.ts` (line 6), `src/app/api/lead/route.ts` (line 5)
- Impact: Changes to data shape require updating multiple files. Types can drift out of sync silently since there is no shared source of truth.
- Fix approach: Extract shared types into `src/lib/types.ts` (or `src/types/`) and import from there. Create separate type files for API payloads (`src/types/lead.ts`, `src/types/screening.ts`, `src/types/n8n.ts`).

**Large Monolithic Components:**
- Issue: Several components exceed 600 lines with mixed concerns (state management, validation, rendering, API calls all in a single file).
- Files: `src/components/screening-wizard.tsx` (919 lines), `src/components/consult/consult-form.tsx` (804 lines), `src/components/chat-wizard.tsx` (679 lines)
- Impact: Hard to test individual behaviors, difficult to maintain, and slow to reason about when modifying.
- Fix approach: Extract custom hooks for form state/validation (e.g., `useScreeningForm`, `useConsultForm`). Extract API submission logic into service functions in `src/lib/`. Break step rendering into subcomponents.

**Verbose Console Logging in Production:**
- Issue: API routes log full lead payloads with `console.log("New lead received:", JSON.stringify(body, null, 2))`. This logs PII (names, emails, phone numbers) to stdout in production Docker containers.
- Files: `src/app/api/lead/route.ts` (line 213), `src/app/api/screening/route.ts` (line 167)
- Impact: PII in server logs creates privacy compliance risk. Verbose JSON logging degrades log readability in production.
- Fix approach: Add environment-aware logging. Suppress or redact PII in production. Use structured logging with a logger utility that respects `NODE_ENV`.

**No Middleware for Shared Request Handling:**
- Issue: No Next.js middleware file exists. Each API route independently handles validation, webhook forwarding, and error responses with duplicated patterns.
- Files: `src/app/api/lead/route.ts`, `src/app/api/screening/route.ts`, `src/app/api/screening/prefill/route.ts`
- Impact: Cross-cutting concerns (rate limiting, CORS, request logging) must be added to each route individually.
- Fix approach: Create `src/middleware.ts` for shared request processing. Extract common webhook-forwarding logic into a shared utility.

**eslint-disable Comments for Images:**
- Issue: Multiple `eslint-disable-next-line @next/next/no-img-element` comments used to bypass Next.js Image optimization warnings.
- Files: `src/components/about.tsx` (line 35), `src/components/lifestyle-gallery.tsx` (line 34), `src/components/lead-magnet.tsx` (line 239), `src/components/services.tsx` (lines 70, 122), `src/components/meta-pixel.tsx` (line 35), `src/pdf/sellers-guide/index.tsx` (line 251), `src/pdf/buyers-guide/index.tsx` (line 263)
- Impact: Missing out on automatic image optimization (lazy loading, responsive sizing, WebP conversion). The PDF renderer images are a valid exception.
- Fix approach: Replace `<img>` with `next/image` `<Image>` component in non-PDF files. Keep `<img>` only in `src/pdf/` files where `@react-pdf/renderer` requires it.

## Security Considerations

**No Rate Limiting on Lead Submission Endpoints:**
- Risk: API endpoints `/api/lead` and `/api/screening` accept unlimited POST requests. A bot or malicious actor could flood the n8n webhook with thousands of fake leads, exhaust n8n resources, or trigger excessive Meta CAPI events.
- Files: `src/app/api/lead/route.ts`, `src/app/api/screening/route.ts`
- Current mitigation: None. No rate limiting, no CAPTCHA, no honeypot fields.
- Recommendations: Add rate limiting via middleware (e.g., IP-based with an in-memory store or Redis). Add a honeypot hidden field to forms. Consider adding reCAPTCHA or Turnstile for the consult form which has the highest value.

**No CSRF Protection:**
- Risk: Form submissions to `/api/lead` and `/api/screening` have no CSRF token validation. Any external site could craft a POST request to these endpoints.
- Files: `src/app/api/lead/route.ts`, `src/app/api/screening/route.ts`
- Current mitigation: None detected. No `Origin` or `Referer` header checking.
- Recommendations: Add Origin/Referer header validation in API routes. For the consult form (highest value), consider implementing CSRF tokens.

**No Input Sanitization:**
- Risk: User-submitted text fields (names, addresses, additional info) are forwarded directly to n8n without sanitization. While XSS is not a direct concern for API-only routes, the data flows into n8n workflows that may render it in notifications (email, WhatsApp).
- Files: `src/app/api/lead/route.ts`, `src/app/api/screening/route.ts`, `src/lib/validation.ts`
- Current mitigation: Basic format validation only (email regex, phone regex, name length check). No content sanitization.
- Recommendations: Sanitize text inputs before forwarding to webhooks. Strip HTML tags, limit string lengths, validate against injection patterns.

**Meta Pixel ID Hardcoded:**
- Risk: Meta Pixel ID `1863481567884620` is hardcoded as a fallback in the component. While Pixel IDs are public by nature (visible in page source), hardcoding makes rotation harder.
- Files: `src/components/meta-pixel.tsx` (line 7)
- Current mitigation: Environment variable `NEXT_PUBLIC_META_PIXEL_ID` takes precedence if set.
- Recommendations: Low priority. Acceptable since Pixel IDs are public. Document the fallback behavior.

**Access Token in URL Query Parameter:**
- Risk: Meta CAPI access token is passed as a URL query parameter in the fetch call to Facebook's Graph API. While this is Meta's documented approach, the token could appear in server access logs.
- Files: `src/lib/meta-capi.ts` (line 134)
- Current mitigation: This is the standard Meta CAPI integration pattern.
- Recommendations: Low priority. This follows Meta's official documentation. Ensure server logs do not capture full outbound request URLs.

## Performance Bottlenecks

**No Timeout on Screening Webhook:**
- Problem: The screening API route does not implement a timeout for the n8n webhook call, unlike the lead route which has a 30-second abort controller.
- Files: `src/app/api/screening/route.ts` (line 188)
- Cause: The fetch call to n8n has no `AbortController` or timeout, so a stalled n8n server could hang the request indefinitely.
- Improvement path: Add an `AbortController` with a 30-second timeout, matching the pattern in `src/app/api/lead/route.ts` (lines 221-222).

**Multiple `<img>` Elements Without Lazy Loading:**
- Problem: Native `<img>` tags used instead of Next.js `<Image>` do not benefit from automatic lazy loading or srcset generation.
- Files: `src/components/about.tsx`, `src/components/lifestyle-gallery.tsx`, `src/components/lead-magnet.tsx`, `src/components/services.tsx`
- Cause: eslint rule was disabled rather than migrating to `next/image`.
- Improvement path: Replace with `<Image>` component to get automatic lazy loading, responsive sizes, and WebP optimization.

**Hero Poster Image is PNG (796K):**
- Problem: The hero video poster is served as a PNG file at 796K.
- Files: `/public/videos/hero-poster.png`
- Cause: Not converted to WebP format like the other images.
- Improvement path: Convert to WebP format. Other images in the project already use WebP and are significantly smaller.

## Fragile Areas

**Chat Wizard Step Flow Logic:**
- Files: `src/components/chat-wizard.tsx` (lines 318-355, `handleOptionSelect`)
- Why fragile: Step transitions are managed through a long chain of if/else statements based on `step` and `flow` state. Adding a new step or changing flow order requires modifying multiple conditional branches.
- Safe modification: Trace the entire step flow before making changes. The buy flow is: welcome -> propertyType -> area -> budget -> timeline -> contactName -> contactPhone -> contactEmail -> submit. The sell flow is: welcome -> propertyType -> address -> reason -> timeline -> contactName -> contactPhone -> contactEmail -> submit.
- Test coverage: None. All flow paths must be tested manually.

**Lead API Route Branching:**
- Files: `src/app/api/lead/route.ts` (343 lines)
- Why fragile: The single POST handler manages three distinct lead types (`lead_magnet`, `chat_wizard`, `consult`) with different response handling. The `consult` type has special error handling that returns n8n's response directly, while other types silently swallow webhook errors.
- Safe modification: Changes to one lead type's handling can accidentally affect others. Test all three flows after any change.
- Test coverage: None.

**Session/CTA Source Tracking:**
- Files: `src/lib/session.ts`, `src/app/[locale]/page.tsx`
- Why fragile: Session ID and CTA source are stored in `sessionStorage` and must be set before the wizard opens. If `setCTASource` is not called before a form submission, the CTA source will be `null`. Multiple CTA buttons overwrite the source without history.
- Safe modification: Verify CTA source is set in every click handler that opens a wizard or form.
- Test coverage: None.

## Scaling Limits

**In-Memory Session Storage (Client-Side):**
- Current capacity: Single browser tab session.
- Limit: Session data is lost on tab close. No server-side session persistence. Lead data has no local fallback if n8n webhook fails for non-consult lead types.
- Scaling path: For the current use case (single-page lead gen site), this is acceptable. If multi-step flows need persistence across sessions, add server-side session storage.

**Single n8n Webhook Endpoint:**
- Current capacity: All leads funnel through one or two n8n webhook URLs.
- Limit: n8n becomes a single point of failure. If the n8n server is down, `consult` leads fail with an error. Other lead types silently succeed on the client but data is lost (logged to console only).
- Scaling path: Add a database or queue as a fallback store when n8n is unreachable. At minimum, persist failed webhook payloads for retry.

## Dependencies at Risk

**No Lockfile Validation:**
- Risk: `package-lock.json` is referenced in Dockerfile but there is no `npm audit` step in the build pipeline.
- Impact: Vulnerable dependencies could be deployed without detection.
- Migration plan: Add `npm audit --production` to CI pipeline. Consider adding Dependabot or Renovate for automated dependency updates.

## Missing Critical Features

**No Persistent Lead Storage:**
- Problem: If n8n is unreachable, leads for `chat_wizard` and `lead_magnet` types are acknowledged as successful to the user but the data exists only in server console logs. There is no database, file, or queue fallback.
- Blocks: Lead recovery after n8n outages. Audit trail for submitted leads. Analytics on lead submission patterns independent of n8n.

**No Automated Testing:**
- Problem: Zero test files exist in the project. No unit tests, integration tests, or end-to-end tests.
- Blocks: Safe refactoring of complex components. Confidence in deployment. Regression prevention.

## Test Coverage Gaps

**All Code is Untested:**
- What's not tested: Every component, API route, utility function, and integration.
- Files: All files in `src/`
- Risk: Any change could introduce regressions in lead capture flows (the core business function of the site). The three-way branching in `src/app/api/lead/route.ts` is particularly risky to modify without tests.
- Priority: High - Start with API route tests (`src/app/api/lead/route.ts`, `src/app/api/screening/route.ts`) and validation utilities (`src/lib/validation.ts`) as they handle the critical lead capture pipeline. Then add component tests for the wizard flows.

---

*Concerns audit: 2026-03-05*
