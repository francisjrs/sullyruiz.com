# Consult Page

The consultation request page at `/consult` (English) and `/es/consulta` (Spanish).

**Files:**
- `src/app/[locale]/consult/page.tsx`
- `src/app/[locale]/consult/layout.tsx`
- `src/components/consult/*.tsx`

---

## Overview

The consult page is a dedicated landing page for consultation requests. It provides more context than the landing page and includes a comprehensive qualification form.

---

## Page Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  VideoHero                                                       │
│  [Video Player]                                                  │
│  "Get Your Free Consultation"                                    │
│  [Book Now ↓]                                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ConsultStories                                                  │
│  "Real Results from Real Clients"                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                         │
│  │ Story 1  │ │ Story 2  │ │ Story 3  │                         │
│  └──────────┘ └──────────┘ └──────────┘                         │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ConsultProblem                                                  │
│  "Feeling Overwhelmed?"                                          │
│  Pain points and challenges                                      │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ConsultSolution                                                 │
│  "Here's How I Help"                                             │
│  Solution description                                            │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ConsultDeliverables                                             │
│  "What You'll Get"                                               │
│  ✓ Personalized plan                                             │
│  ✓ Market analysis                                               │
│  ✓ Financing guidance                                            │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ConsultForm                                                     │
│  [Full qualification form - see below]                           │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ConsultFooter                                                   │
│  Contact info and legal                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Components

### VideoHero

**File:** `src/components/consult/video-hero.tsx`

Features:
- Embedded video player
- Headline and subheadline
- CTA button that scrolls to form

```tsx
<VideoHero
  videoUrl="..."
  headline={t('hero.title')}
  subheadline={t('hero.subtitle')}
  ctaText={t('hero.cta')}
/>
```

### ConsultStories

**File:** `src/components/consult/consult-stories.tsx`

Displays 3-4 client success stories with:
- Client name
- Situation description
- Outcome achieved

### ConsultProblem

**File:** `src/components/consult/consult-problem.tsx`

Addresses common pain points:
- Confusion about the buying process
- Not knowing where to start
- Fear of making mistakes
- Overwhelmed by options

### ConsultSolution

**File:** `src/components/consult/consult-solution.tsx`

Explains how the consultation helps:
- Expert guidance
- Step-by-step roadmap
- Answers to all questions
- No pressure environment

### ConsultDeliverables

**File:** `src/components/consult/consult-deliverables.tsx`

Lists what clients receive:
- Personalized buying/selling plan
- Local market analysis
- Financing options overview
- Next steps checklist
- Ongoing support commitment

### ConsultForm

**File:** `src/components/consult/consult-form.tsx`

The main qualification form. See [Lead Capture](../features/lead-capture.md#consultform) for complete details.

### ConsultFooter

**File:** `src/components/consult/consult-footer.tsx`

Contains:
- Contact information
- Phone number (click-to-call)
- Email address
- Office address
- Legal links

---

## Form Fields

### Contact Section

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Name | Text | Yes | Min 2 characters |
| Phone | Text | Yes | US format |
| Email | Text | Yes | Valid email |
| Language | Select | Yes | en/es |

### Qualification Section

| Field | Options |
|-------|---------|
| Timeline | ASAP, 1-3 months, 3-6 months, 6+ months, Just exploring |
| Income Type | W2, 1099, Self-employed, ITIN, Other |
| Bank Status | Pre-approved, Working on it, Haven't started, Cash buyer |
| Down Payment | Less than $10K, $10K-$20K, $20K+, Not sure |
| Area | Austin, Round Rock, Cedar Park, Georgetown, Pflugerville, Hutto, Other |

### Tracking Section

| Field | Type | Required |
|-------|------|----------|
| Source | Select | Yes |
| Notes | Textarea | No |

---

## Form Submission Flow

```
User fills form
       │
       ▼
Client-side validation
       │
       ├── Invalid: Show inline errors
       │
       ▼
POST /api/lead (type: "consult")
       │
       ▼
Server validation + forward to n8n
       │
       ├── Timeout (>30s): Show timeout error
       │
       ▼
n8n processes:
  • Save to Google Sheets
  • Send Gmail to lead
  • Send WhatsApp to lead
  • Notify agent (Gmail + WhatsApp)
       │
       ▼
n8n returns response
       │
       ▼
Show success screen with:
  • Confirmation message
  • Lead ID
  • Notification status
  • Next steps
```

---

## Success Screen

After successful submission, the form is replaced with a success screen:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ✓ Consultation Request Received!                                │
│                                                                  │
│  Thank you! We've received your consultation request             │
│  and will contact you within 24 hours.                           │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Notifications:                                            │  │
│  │  ✓ Confirmation email sent                                 │  │
│  │  ✓ WhatsApp message sent                                   │  │
│  │  ✓ Agent notified                                          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Next Steps:                                                     │
│  1. Check your email for confirmation                            │
│  2. Expect a call or WhatsApp within 24 hours                    │
│  3. Prepare any questions about your real estate goals           │
│                                                                  │
│  Your Lead ID: maria-1706745600000                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Error Handling

The form handles three specific error types:

| Error | Display | Recovery |
|-------|---------|----------|
| Timeout | "Request timed out. Please try again." | Retry button |
| Storage | "Unable to save your information. Please try again." | Retry button |
| Network | "Network error. Please check your connection." | Retry button |

---

## Metadata

**File:** `src/app/[locale]/consult/layout.tsx`

```tsx
export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'consult' })

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
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

### English Metadata

```
Title: Free Homebuyer Consultation | Sully Ruiz
Description: Schedule your free, no-obligation consultation with Sully Ruiz. Get personalized guidance on buying a home in Austin.
```

### Spanish Metadata

```
Title: Consulta Gratis para Compradores | Sully Ruiz
Description: Agenda tu consulta gratuita y sin compromiso con Sully Ruiz. Recibe orientación personalizada para comprar casa en Austin.
```

---

## URL Handling

### English
- Primary: `https://sullyruiz.com/consult`
- With locale: `https://sullyruiz.com/en/consult` (redirects to above)

### Spanish
- Primary: `https://sullyruiz.com/es/consulta`
- Direct: `https://sullyruiz.com/consulta` (redirects to above via middleware)

---

## Analytics

The consult page tracks:

| Event | Trigger |
|-------|---------|
| `page_view` | Page load |
| `cta_click` | "Book Now" button click |
| `form_start` | First field focus |
| `form_submit` | Form submission attempt |
| `lead_generation` | Successful submission |
| `form_error` | Validation failures |

---

## Translation Keys

The consult page uses the `consult` namespace:

```json
{
  "consult": {
    "metadata": {
      "title": "Free Homebuyer Consultation | Sully Ruiz",
      "description": "..."
    },
    "hero": {
      "title": "Get Your Free Consultation",
      "subtitle": "...",
      "cta": "Book Now"
    },
    "form": {
      "title": "Request Your Consultation",
      "name": "Full Name",
      "phone": "Phone Number",
      "email": "Email Address",
      "language": "Preferred Language",
      "timeline": "When are you looking to buy?",
      "submit": "Request Consultation"
    }
  }
}
```

---

## Related Documentation

- [Lead Capture](../features/lead-capture.md#consultform) - Form details
- [API: Lead Endpoint](../api/lead-endpoint.md) - API specification
- [n8n Consult Workflow](../integrations/n8n-consult-workflow.md) - Backend processing
- [Routing & i18n](../architecture/routing-and-i18n.md) - URL handling
