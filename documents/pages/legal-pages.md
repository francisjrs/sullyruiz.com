# Legal Pages

Documentation for the legal pages: Privacy Policy, Terms of Service, and Data Deletion.

---

## Overview

The site includes three legal pages required for compliance:

| Page | English URL | Spanish URL | Purpose |
|------|-------------|-------------|---------|
| Privacy Policy | `/privacy` | `/es/privacy` | Data collection practices |
| Terms of Service | `/terms` | `/es/terms` | Usage terms |
| Data Deletion | `/data-deletion` | `/es/data-deletion` | GDPR/CCPA deletion requests |

---

## Privacy Policy

**File:** `src/app/[locale]/privacy/page.tsx`

### Purpose

Discloses how personal data is collected, used, and protected.

### Content Sections

1. **Introduction**
   - Who we are (Sully Ruiz, Keller Williams Austin NW)
   - Purpose of the policy

2. **Information We Collect**
   - Contact information (name, email, phone)
   - Property preferences
   - Financial qualification data (screening form)
   - Usage data (analytics)
   - Session identifiers

3. **How We Use Information**
   - Providing real estate services
   - Communication about services
   - Improving website experience
   - Marketing (with consent)

4. **Information Sharing**
   - Service providers (n8n, Google)
   - No sale of personal data
   - Legal requirements

5. **Data Security**
   - Encryption in transit (HTTPS)
   - Secure storage practices
   - Limited access

6. **Your Rights**
   - Access your data
   - Correct inaccuracies
   - Delete your data
   - Opt out of marketing

7. **Cookies & Tracking**
   - Session cookies
   - Analytics (GA4)
   - How to disable

8. **Contact Information**
   - Email: realtor@sullyruiz.com
   - Phone: (512) 412-2352

---

## Terms of Service

**File:** `src/app/[locale]/terms/page.tsx`

### Purpose

Defines the terms under which users may use the website.

### Content Sections

1. **Acceptance of Terms**
   - Agreement by using the site
   - Modifications to terms

2. **Use of Website**
   - Permitted uses
   - Prohibited activities
   - Age requirements (18+)

3. **User Submissions**
   - Lead form submissions
   - Accuracy of information
   - No guarantee of service

4. **Intellectual Property**
   - Content ownership
   - Limited license to users
   - Trademark notices

5. **Disclaimer of Warranties**
   - Website provided "as is"
   - No guarantees
   - Real estate advice limitations

6. **Limitation of Liability**
   - Maximum liability limits
   - Exclusion of damages
   - Indemnification

7. **Third-Party Links**
   - External links disclaimer
   - No endorsement

8. **Governing Law**
   - Texas state law
   - Dispute resolution

9. **Contact**
   - How to reach us with questions

---

## Data Deletion

**File:** `src/app/[locale]/data-deletion/page.tsx`

### Purpose

Provides instructions for requesting data deletion (GDPR/CCPA compliance).

### Content Sections

1. **Your Right to Delete**
   - Explanation of rights
   - Applicable regulations

2. **What Data We Have**
   - Lead form submissions
   - Screening questionnaire data
   - Analytics data
   - Session data

3. **How to Request Deletion**

   **Option 1: Email Request**
   - Email: realtor@sullyruiz.com
   - Subject: "Data Deletion Request"
   - Include: Name, email used, phone (if provided)

   **Option 2: Phone Request**
   - Call: (512) 412-2352
   - Provide verification information

4. **Verification Process**
   - Identity verification required
   - Response within 30 days

5. **What Gets Deleted**
   - Lead form data
   - Screening responses
   - Associated analytics
   - Session records

6. **What We May Retain**
   - Legal compliance records
   - Anonymized analytics

7. **Confirmation**
   - Written confirmation provided
   - Timeframe: 30 days

---

## Implementation Details

### Page Structure

Each legal page follows the same pattern:

```tsx
// src/app/[locale]/privacy/page.tsx
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'privacy' })
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  }
}

export default async function PrivacyPage({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'privacy' })

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
      <div className="prose prose-lg max-w-none">
        {/* Content sections */}
      </div>
    </main>
  )
}
```

### Translations

Legal pages are fully translated in both locales:

```json
// messages/en.json
{
  "privacy": {
    "metadata": {
      "title": "Privacy Policy | Sully Ruiz",
      "description": "Learn how we collect, use, and protect your personal information."
    },
    "title": "Privacy Policy",
    "lastUpdated": "Last updated: January 2024",
    "sections": {
      "introduction": {
        "title": "Introduction",
        "content": "..."
      }
    }
  }
}
```

```json
// messages/es.json
{
  "privacy": {
    "metadata": {
      "title": "Política de Privacidad | Sully Ruiz",
      "description": "Conozca cómo recopilamos, usamos y protegemos su información personal."
    },
    "title": "Política de Privacidad",
    "lastUpdated": "Última actualización: enero 2024"
  }
}
```

---

## Styling

Legal pages use a consistent, readable style:

```tsx
<main className="container mx-auto px-4 py-16 max-w-4xl">
  <h1 className="text-4xl font-bold mb-4">{title}</h1>
  <p className="text-gray-600 mb-8">{lastUpdated}</p>

  <div className="prose prose-lg prose-gray">
    <h2>Section Title</h2>
    <p>Section content...</p>

    <ul>
      <li>List item</li>
    </ul>
  </div>
</main>
```

### Typography

- Headings: Bold, scaled sizing
- Body: Readable line height (1.7)
- Lists: Proper spacing and bullets
- Links: Underlined, accessible colors

---

## Navigation

### Footer Links

Legal pages are linked from the site footer:

```tsx
<footer>
  <div className="legal-links">
    <Link href="/privacy">{t('footer.privacy')}</Link>
    <Link href="/terms">{t('footer.terms')}</Link>
    <Link href="/data-deletion">{t('footer.dataDeletion')}</Link>
  </div>
</footer>
```

### Breadcrumbs

Optional breadcrumb navigation:

```
Home > Privacy Policy
Home > Terms of Service
Home > Data Deletion
```

---

## SEO

### Meta Tags

Each legal page has appropriate meta tags:

```tsx
export async function generateMetadata({ params: { locale } }) {
  return {
    title: 'Privacy Policy | Sully Ruiz',
    description: 'Learn how we collect and protect your data.',
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: '/privacy',
      languages: {
        'en': '/privacy',
        'es': '/es/privacy',
      },
    },
  }
}
```

### Sitemap

Legal pages are included in the sitemap:

```tsx
// src/app/sitemap.ts
export default function sitemap() {
  return [
    // ... other pages
    { url: 'https://sullyruiz.com/privacy', lastModified: new Date() },
    { url: 'https://sullyruiz.com/terms', lastModified: new Date() },
    { url: 'https://sullyruiz.com/data-deletion', lastModified: new Date() },
  ]
}
```

---

## Compliance Notes

### GDPR (EU)

- Clear data collection disclosure
- Right to access, rectify, delete
- Data deletion process documented
- Contact information provided

### CCPA (California)

- "Do Not Sell" notice (we don't sell data)
- Right to know what data is collected
- Right to delete
- Non-discrimination

### Real Estate Regulations

- License number displayed
- Brokerage information
- Fair housing notice (if applicable)

---

## Updating Legal Pages

When updating legal content:

1. Update translation files (`messages/en.json`, `messages/es.json`)
2. Update "Last Updated" date
3. Ensure both languages are updated
4. Review with legal counsel if significant changes
5. Deploy updates

---

## Related Documentation

- [Routing & i18n](../architecture/routing-and-i18n.md) - URL handling
- [Session Management](../features/session-management.md) - Data collected
- [Lead Capture](../features/lead-capture.md) - Form data collection
