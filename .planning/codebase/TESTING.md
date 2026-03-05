# Testing Patterns

**Analysis Date:** 2026-03-05

## Test Framework

**Runner:**
- No test framework is installed or configured
- No Jest, Vitest, Playwright, or Cypress detected in `package.json` dependencies
- No test configuration files exist in the project root

**Run Commands:**
```bash
# No test commands exist in package.json scripts
# Only available scripts: dev, build, start, lint, generate:guides
```

## Test File Organization

**Location:**
- No test files exist anywhere in the codebase
- No `__tests__` directories, no `*.test.*` files, no `*.spec.*` files

## Current Quality Assurance

**What exists instead of tests:**

1. **ESLint** - `npm run lint` using `eslint-config-next` with core-web-vitals and TypeScript rules
   - Config: `eslint.config.mjs`
   - Provides static analysis and catches common React/Next.js mistakes

2. **TypeScript strict mode** - Catches type errors at compile time
   - Config: `tsconfig.json` with `"strict": true`

3. **Build verification** - `npm run build` catches compilation errors
   - Used in CI/CD via GitHub Actions before deployment

4. **Health check endpoint** - `src/app/api/health/route.ts`
   - Returns `{ status: "healthy", timestamp: "..." }`
   - Used post-deployment: `curl https://sullyruiz.com/api/health`

5. **Client-side validation** - `src/lib/validation.ts` contains pure validation functions that are highly testable but untested

## Recommended Test Setup

If adding tests to this project, the following setup would match the existing stack:

**Recommended Framework:** Vitest (native ESM support, fast, works well with Next.js)

**Installation:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

**Suggested config (`vitest.config.ts`):**
```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

## Highest-Priority Test Targets

**Pure utility functions (easiest to test, highest value):**

1. **`src/lib/validation.ts`** - All validation functions are pure with no dependencies
   - `validateEmail()`, `validatePhone()`, `validateName()`, `normalizePhone()`
   - `validateLeadPayload()` - composite validator

2. **`src/lib/seo-config.ts`** - Pure URL generation functions
   - `getCanonicalUrl()`, `getAlternateLinks()`, `getOgLocale()`

3. **`src/app/api/screening/route.ts`** - `calculateLeadScore()` is a pure function (currently not exported, would need extraction)

**API routes (integration tests):**

4. **`src/app/api/lead/route.ts`** - Lead submission with validation, webhook forwarding
5. **`src/app/api/screening/route.ts`** - Screening with lead scoring

**Example test for validation (shows how tests should be written for this codebase):**
```typescript
// src/lib/__tests__/validation.test.ts
import { describe, it, expect } from "vitest";
import { validateEmail, validatePhone, validateName, normalizePhone, validateLeadPayload } from "../validation";

describe("validateEmail", () => {
  it("rejects empty email", () => {
    expect(validateEmail("")).toEqual({ valid: false, error: "validation.email.required" });
  });

  it("rejects invalid format", () => {
    expect(validateEmail("not-an-email")).toEqual({ valid: false, error: "validation.email.invalid" });
  });

  it("accepts valid email", () => {
    expect(validateEmail("user@example.com")).toEqual({ valid: true });
  });
});

describe("validatePhone", () => {
  it("accepts empty phone (optional)", () => {
    expect(validatePhone("")).toEqual({ valid: true });
  });

  it("accepts US phone formats", () => {
    expect(validatePhone("(512) 555-1234")).toEqual({ valid: true });
    expect(validatePhone("512-555-1234")).toEqual({ valid: true });
    expect(validatePhone("+1 5125551234")).toEqual({ valid: true });
  });
});

describe("normalizePhone", () => {
  it("strips non-digit characters", () => {
    expect(normalizePhone("(512) 555-1234")).toBe("5125551234");
    expect(normalizePhone("+1 512-555-1234")).toBe("15125551234");
  });
});

describe("validateLeadPayload", () => {
  it("validates lead_magnet requires firstName and email", () => {
    const result = validateLeadPayload({ email: "" }, "lead_magnet");
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty("email");
    expect(result.errors).toHaveProperty("firstName");
  });
});
```

## Test Types

**Unit Tests:**
- Not present. Target: validation functions, SEO helpers, lead scoring, UTM parsing
- Location convention if added: co-located `__tests__/` directories or `.test.ts` suffix siblings

**Integration Tests:**
- Not present. Target: API route handlers (lead, screening, health)
- Would use Next.js test utilities or direct handler invocation

**E2E Tests:**
- Not present. Target: lead capture flows (ChatWizard, LeadMagnet, ConsultForm)
- Playwright recommended if added (official Next.js recommendation)

## Coverage

**Requirements:** None enforced. No coverage tooling configured.

## Mocking

**No mocking patterns exist.** If added, key items to mock:
- `fetch` for webhook calls in API routes
- `next-intl` translations in component tests
- `sessionStorage`/`localStorage` for session and UTM utilities
- `@next/third-parties/google` for analytics tracking functions

## Summary

This is a zero-test codebase relying entirely on TypeScript strict mode, ESLint, and build-time checks for quality assurance. The `src/lib/validation.ts` module is the highest-value target for adding initial tests, as it contains pure functions with clear input/output contracts that are critical to lead capture correctness.

---

*Testing analysis: 2026-03-05*
