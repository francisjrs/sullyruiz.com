# Routing & Internationalization

This document covers the next-intl configuration, locale handling, middleware, and pathname mappings.

---

## Overview

sullyruiz.com uses next-intl for internationalization with:

- **Locales:** English (en) and Spanish (es)
- **Default locale:** English
- **Locale prefix:** `as-needed` (no `/en` prefix, `/es` for Spanish)
- **Custom pathnames:** Localized URLs for some pages

---

## Configuration Files

| File | Purpose |
|------|---------|
| `src/i18n/routing.ts` | Route configuration and navigation exports |
| `src/i18n/request.ts` | Server-side request handler |
| `src/i18n/config.ts` | Type definitions |
| `src/middleware.ts` | Locale detection and routing |
| `messages/en.json` | English translations |
| `messages/es.json` | Spanish translations |

---

## Routing Configuration

**File:** `src/i18n/routing.ts`

```typescript
import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/consult': {
      en: '/consult',
      es: '/consulta'
    },
    '/privacy': '/privacy',
    '/terms': '/terms',
    '/data-deletion': '/data-deletion',
    '/screening': '/screening'
  }
})

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
```

### Locale Prefix Modes

| Mode | English URL | Spanish URL |
|------|-------------|-------------|
| `as-needed` | `/consult` | `/es/consulta` |
| `always` | `/en/consult` | `/es/consulta` |
| `never` | `/consult` | `/consulta` |

The site uses `as-needed` to avoid redundant `/en` prefix for default locale.

---

## Pathname Mapping

### Localized Paths

| Page | English | Spanish |
|------|---------|---------|
| Home | `/` | `/es` |
| Consult | `/consult` | `/es/consulta` |
| Screening | `/screening` | `/es/screening` |
| Privacy | `/privacy` | `/es/privacy` |
| Terms | `/terms` | `/es/terms` |
| Data Deletion | `/data-deletion` | `/es/data-deletion` |

### Special Handling: `/consulta`

Direct navigation to `/consulta` (without `/es` prefix) is handled by middleware:

```typescript
// src/middleware.ts
if (pathname === '/consulta') {
  return NextResponse.redirect(new URL('/es/consulta', request.url))
}
```

---

## Middleware

**File:** `src/middleware.ts`

The middleware handles:

1. Locale detection from browser/cookie
2. Pathname rewrites for localized routes
3. Special redirects (e.g., `/consulta` → `/es/consulta`)

### Matcher Configuration

```typescript
export const config = {
  matcher: [
    '/',
    '/(en|es)/:path*',
    '/screening',
    '/privacy',
    '/terms',
    '/data-deletion',
    '/consult',
    '/consulta'
  ]
}
```

### Processing Flow

```
Incoming Request
       │
       ▼
┌──────────────────────────────────────────┐
│  Check for /consulta (special case)      │
│  → Redirect to /es/consulta              │
└────────────────────┬─────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────┐
│  next-intl createMiddleware()            │
│  • Detect locale from cookie/header      │
│  • Rewrite paths for locale              │
│  • Set NEXT_LOCALE cookie                │
└──────────────────────────────────────────┘
```

---

## Request Handler

**File:** `src/i18n/request.ts`

Provides translations to server components:

```typescript
import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !hasLocale(routing.locales, locale)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  }
})
```

---

## Using Navigation

### Link Component

```tsx
import { Link } from '@/i18n/routing'

// Automatically handles locale prefix
<Link href="/consult">Book Consultation</Link>

// With locale override
<Link href="/consult" locale="es">Reservar Consulta</Link>
```

### Programmatic Navigation

```tsx
import { useRouter, usePathname } from '@/i18n/routing'

function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()

  const switchToSpanish = () => {
    router.push(pathname, { locale: 'es' })
  }

  return <button onClick={switchToSpanish}>Español</button>
}
```

### Getting Translated Path

```tsx
import { getPathname } from '@/i18n/routing'

const spanishPath = getPathname({
  href: '/consult',
  locale: 'es'
})
// Returns: '/es/consulta'
```

---

## Translation Files

### Structure

```
messages/
├── en.json
└── es.json
```

### Message Format

```json
{
  "common": {
    "getStarted": "Get Started",
    "learnMore": "Learn More"
  },
  "hero": {
    "title": "Your Trusted Austin Realtor",
    "subtitle": "Whether you're buying or selling...",
    "buyButton": "Ready to Buy",
    "sellButton": "Ready to Sell"
  },
  "services": {
    "buyTitle": "Buying a Home",
    "sellTitle": "Selling Your Home"
  }
}
```

### Using Translations

**In Server Components:**

```tsx
import { getTranslations } from 'next-intl/server'

export default async function Page() {
  const t = await getTranslations('hero')

  return (
    <h1>{t('title')}</h1>
  )
}
```

**In Client Components:**

```tsx
'use client'
import { useTranslations } from 'next-intl'

export default function Hero() {
  const t = useTranslations('hero')

  return (
    <button>{t('buyButton')}</button>
  )
}
```

---

## Page Structure

### Layout Hierarchy

```
src/app/
├── layout.tsx              # App-wide layout (html, body)
├── [locale]/
│   ├── layout.tsx          # Locale layout (NextIntlClientProvider)
│   ├── page.tsx            # Landing page
│   ├── consult/
│   │   ├── layout.tsx      # Consult metadata
│   │   └── page.tsx        # Consult page
│   ├── screening/
│   │   └── page.tsx        # Screening wizard
│   └── ...
```

### Locale Layout

**File:** `src/app/[locale]/layout.tsx`

```tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
```

---

## Metadata Generation

### Localized Metadata

```tsx
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: locale === 'en' ? '/consult' : '/es/consulta',
      languages: {
        'en': '/consult',
        'es': '/es/consulta'
      }
    }
  }
}
```

---

## SEO Considerations

### Canonical URLs

Each page should have proper canonical and alternate links:

```tsx
// src/lib/seo-config.ts
export function getCanonicalUrl(path: string): string {
  return `https://sullyruiz.com${path}`
}

export function getAlternateLinks(path: string) {
  return {
    'en': getCanonicalUrl(path),
    'es': getCanonicalUrl(`/es${path}`)
  }
}
```

### hreflang Tags

Generated automatically by Next.js metadata:

```html
<link rel="alternate" hreflang="en" href="https://sullyruiz.com/consult" />
<link rel="alternate" hreflang="es" href="https://sullyruiz.com/es/consulta" />
<link rel="alternate" hreflang="x-default" href="https://sullyruiz.com/consult" />
```

---

## Adding New Localized Pages

### 1. Add pathname mapping

```typescript
// src/i18n/routing.ts
pathnames: {
  // ...existing paths
  '/new-page': {
    en: '/new-page',
    es: '/nueva-pagina'
  }
}
```

### 2. Update middleware matcher

```typescript
// src/middleware.ts
export const config = {
  matcher: [
    // ...existing matchers
    '/new-page',
    '/nueva-pagina'
  ]
}
```

### 3. Add special redirect (if needed)

```typescript
// src/middleware.ts
if (pathname === '/nueva-pagina') {
  return NextResponse.redirect(new URL('/es/nueva-pagina', request.url))
}
```

### 4. Create page component

```tsx
// src/app/[locale]/new-page/page.tsx
export default function NewPage() {
  return <div>New Page Content</div>
}
```

### 5. Add translations

```json
// messages/en.json
{
  "newPage": {
    "title": "New Page"
  }
}

// messages/es.json
{
  "newPage": {
    "title": "Nueva Página"
  }
}
```

---

## Common Patterns

### Language Switcher

```tsx
'use client'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const switchLocale = (newLocale: string) => {
    router.push(pathname, { locale: newLocale })
  }

  return (
    <div>
      <button
        onClick={() => switchLocale('en')}
        disabled={locale === 'en'}
      >
        English
      </button>
      <button
        onClick={() => switchLocale('es')}
        disabled={locale === 'es'}
      >
        Español
      </button>
    </div>
  )
}
```

### Conditional Content by Locale

```tsx
'use client'
import { useLocale } from 'next-intl'

export function LocaleSpecificContent() {
  const locale = useLocale()

  if (locale === 'es') {
    return <SpanishContent />
  }

  return <EnglishContent />
}
```

---

## Related Documentation

- [Component Structure](./component-structure.md) - Component organization
- [Translation Keys](../reference/translation-keys.md) - i18n message structure
- [Landing Page](../pages/landing-page.md) - Page implementation details
