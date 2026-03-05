# Coding Conventions

**Analysis Date:** 2026-03-05

## Naming Patterns

**Files:**
- Components: kebab-case (`chat-wizard.tsx`, `lead-magnet.tsx`, `trust-section.tsx`)
- UI primitives (shadcn): kebab-case (`button.tsx`, `dialog.tsx`, `select.tsx`)
- Lib/utilities: kebab-case (`seo-config.ts`, `meta-pixel.ts`, `meta-capi.ts`)
- API routes: `route.ts` inside descriptive directories (`api/lead/route.ts`, `api/health/route.ts`)
- i18n files: camelCase for config (`routing.ts`, `request.ts`, `config.ts`)
- Translation JSON: locale code (`en.json`, `es.json`)

**Components:**
- Use PascalCase named exports matching the conceptual name: `export function Hero(...)`, `export function ChatWizard(...)`
- One primary component per file; the component name matches the file name conceptually (`hero.tsx` exports `Hero`)
- Barrel files (`index.ts`) used for grouped components like `src/components/consult/index.ts`

**Functions:**
- camelCase for all functions: `trackLeadGeneration`, `validateEmail`, `getSessionId`
- Prefix getters with `get`: `getSessionData`, `getUTMParams`, `getCanonicalUrl`
- Prefix setters with `set`: `setCTASource`, `setUserProperties`
- Prefix validators with `validate`: `validateEmail`, `validatePhone`, `validateLeadPayload`
- Prefix trackers with `track`: `trackCTAClick`, `trackWizardOpen`, `trackScrollDepth`
- Boolean checkers use `has`/`is`: `hasUTMParams`

**Variables:**
- camelCase for local variables and state: `isSubmitting`, `formData`, `fieldError`
- SCREAMING_SNAKE_CASE for module-level constants: `SESSION_KEY`, `RETURNING_USER_KEY`, `DEFAULT_DURATION`
- Regex constants: SCREAMING_SNAKE_CASE (`EMAIL_REGEX`, `US_PHONE_REGEX`)

**Types/Interfaces:**
- PascalCase for all types and interfaces: `LeadPayload`, `CTASource`, `ValidationResult`
- Use `interface` for object shapes: `interface HeroProps`, `interface FormData`, `interface FormErrors`
- Use `type` for unions and aliases: `type FlowType = "buy" | "sell" | null`, `type Step = "welcome" | ...`
- Suffix props interfaces with `Props`: `HeroProps`, `ChatWizardProps`
- Suffix result interfaces with `Result`: `ValidationResult`, `LeadValidationResult`

## Code Style

**Formatting:**
- No dedicated Prettier config detected; relies on ESLint and editor defaults
- Double quotes for strings (consistent across all files)
- Semicolons at end of statements
- 2-space indentation
- Trailing commas in multiline structures

**Linting:**
- ESLint 9 with flat config at `eslint.config.mjs`
- Extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- No custom rules added; relies entirely on Next.js defaults
- Run with: `npm run lint`

**TypeScript:**
- Strict mode enabled in `tsconfig.json`
- Target: ES2017, module: esnext, moduleResolution: bundler
- `as const` assertions used liberally for configuration objects (see `src/lib/seo-config.ts`)
- Explicit return types on exported utility functions; implicit return types on React components

## Import Organization

**Order (observed pattern):**
1. React/framework imports (`react`, `next`, `next-intl`)
2. Third-party libraries (`framer-motion`, `lucide-react`, `uuid`)
3. Internal UI components (`@/components/ui/button`)
4. Internal feature components (`@/components/toast-provider`)
5. Internal lib/utilities (`@/lib/session`, `@/lib/validation`, `@/lib/analytics`)
6. Relative imports (CSS: `../globals.css`)

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- Always use `@/` prefix for imports from `src/`: `@/components/ui/button`, `@/lib/utils`
- Never use relative paths for cross-directory imports

## Error Handling

**API Routes (`src/app/api/*/route.ts`):**
- Wrap entire handler in try/catch
- Return `NextResponse.json({ error: "..." }, { status: N })` for errors
- Use specific HTTP status codes: 400 for validation, 500 for server errors, 504 for timeouts
- Log errors with `console.error("Context:", error)` before returning error responses
- Webhook failures are non-blocking for non-critical lead types (chat_wizard, lead_magnet) but blocking for consult type
- Use `AbortController` with 30-second timeout for external webhook calls

```typescript
// Standard API error pattern
try {
  // ... logic
} catch (error) {
  console.error("Error processing lead:", error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
```

**Client-side form submissions:**
- Validate client-side first, then handle server-side validation errors from response
- Use toast notifications for user-facing errors via `useToast()` from `@/components/toast-provider`
- Track form validation errors to analytics: `trackFormError({ form_name, error_field, error_type })`
- Display inline field errors below inputs with `<p className="text-sm text-red-500">`

```typescript
// Standard client-side submit pattern
try {
  const response = await fetch("/api/lead", { method: "POST", ... });
  if (response.ok) {
    // success path
  } else {
    const data = await response.json();
    if (data.details) {
      // map server validation errors to form fields
    }
    toast({ title: tValidation("submitError"), variant: "error" });
  }
} catch (error) {
  console.error("Error submitting:", error);
  toast({ title: tValidation("networkError"), variant: "error" });
}
```

**Validation (`src/lib/validation.ts`):**
- Return `{ valid: boolean; error?: string }` objects
- Error strings are i18n keys like `"validation.email.invalid"` -- resolved to display text by the caller using `useTranslations("validation")`
- Separate validators per field: `validateEmail()`, `validatePhone()`, `validateName()`
- Composite validator `validateLeadPayload()` for API-side validation

## Logging

**Framework:** `console` (no structured logging library)

**Patterns:**
- `console.log` for development info: `console.log("New lead received:", ...)`
- `console.error` for errors with context prefix: `console.error("Error forwarding to webhook:", webhookError)`
- Use `JSON.stringify(data, null, 2)` for structured data in logs
- No log levels beyond console methods

## Comments

**When to Comment:**
- Section headers in JSX: `{/* Background Image */}`, `{/* Content */}`, `{/* Messages */}`
- Above utility functions: JSDoc with `/** */` for public API functions in lib files
- Inline comments for non-obvious logic: `// Phone is optional but must be valid format if provided`
- `// eslint-disable-next-line` with specific rule name when suppressing

**JSDoc:**
- Used in lib utility files (`src/lib/session.ts`, `src/lib/utm.ts`, `src/lib/seo-config.ts`)
- Short one-line descriptions: `/** Get or create a session ID for lead tracking. */`
- Not used in React components or API routes

## Function Design

**Size:** Components can be large (ChatWizard at 679 lines, ConsultForm at 805 lines) due to combining UI, state, and submission logic. Utility functions are small and focused (5-30 lines).

**Parameters:**
- Components use destructured props interfaces: `({ onBuy, onSell }: HeroProps)`
- Utility functions use typed parameter objects for 2+ params: `trackCTAClick(params: { cta_source: string; flow?: ... })`
- Simple utilities use positional params: `validateEmail(email: string)`

**Return Values:**
- Validation functions return `{ valid: boolean; error?: string }` objects
- Analytics functions return `string` (event ID) when deduplication is needed, `void` otherwise
- Session functions return the requested value or null for missing data
- SSR-safe functions check `typeof window === "undefined"` and return safe defaults

## Module Design

**Exports:**
- Named exports exclusively; no default exports except Next.js pages/layouts (which require `export default`)
- Components: `export function ComponentName(...)`
- UI primitives: `export { Button, buttonVariants }` (multiple related exports per file)
- Lib utilities: individual named function exports

**Barrel Files:**
- Used for grouped feature components: `src/components/consult/index.ts`
- Not used at the top-level `src/components/` directory; each component imported individually

## Component Patterns

**Client Components:**
- Begin with `"use client";` directive
- Use `useTranslations("namespace")` for i18n text
- Use `useLocale()` for current locale
- Common state pattern: `const [isSubmitting, setIsSubmitting] = useState(false)`
- Animation pattern: `useRef` + `useInView` + conditional `motion.div` animate

```typescript
"use client";

import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function SectionName() {
  const t = useTranslations("sectionKey");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        {/* content using t("key") for text */}
      </motion.div>
    </section>
  );
}
```

**UI Styling:**
- Tailwind CSS v4 with utility classes inline
- `cn()` helper from `@/lib/utils` for conditional class merging (clsx + tailwind-merge)
- Brand color `#BEB09E` used directly in class strings (not via Tailwind theme)
- Consistent form styling: `rounded-none border-[#BEB09E]/30 focus:border-[#BEB09E] h-12`
- Button pattern: `bg-black text-white hover:bg-[#BEB09E] font-sans text-sm uppercase tracking-widest px-10 py-6 rounded-none`
- CVA (class-variance-authority) for variant-based components (`src/components/ui/button.tsx`)

**Context Pattern:**
- React Context for cross-cutting concerns: `ToastProvider` + `useToast()` (`src/components/toast-provider.tsx`)
- `createContext` + custom hook that throws if used outside provider

---

*Convention analysis: 2026-03-05*
