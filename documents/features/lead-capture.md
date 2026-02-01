# Lead Capture

This document covers all lead capture mechanisms on sullyruiz.com, including form validation, data flow, and success states.

---

## Overview

The site has three distinct lead capture mechanisms:

| Mechanism | Location | Fields | Purpose |
|-----------|----------|--------|---------|
| ChatWizard | Landing page modals | Progressive (8-10 steps) | Buy/sell intent capture |
| LeadMagnet | Landing page section | First name, email | Guide download |
| ConsultForm | Consult page | Full qualification | Consultation requests |

All mechanisms share:
- Common validation library (`src/lib/validation.ts`)
- Session tracking (`src/lib/session.ts`)
- UTM parameter capture (`src/lib/utm.ts`)
- Same API endpoint (`POST /api/lead`)

---

## ChatWizard

**File:** `src/components/chat-wizard.tsx` (674 lines)

### Trigger Points

| CTA Source | Location | Initial Flow |
|------------|----------|--------------|
| `navbar` | Get Started button | null (user selects) |
| `hero_buy` | Hero "Ready to Buy" | buy |
| `hero_sell` | Hero "Ready to Sell" | sell |
| `about` | About "Work With Me" | null |
| `services_buy` | Services buy card | buy |
| `services_sell` | Services sell card | sell |

### Conversation Flow

```
┌─────────────────────────────────────────────────────┐
│ Step 1: Welcome                                      │
│ "Hi! I'm Sully. Looking to buy or sell?"            │
│ [Buy] [Sell]                                         │
└─────────────────────┬───────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
┌─────────────────────┐   ┌─────────────────────┐
│ Buy Flow            │   │ Sell Flow           │
│                     │   │                     │
│ 2. Property Type    │   │ 2. Property Type    │
│ 3. Area             │   │ 3. Area             │
│ 4. Budget           │   │ 4. Price Range      │
│ 5. Timeline         │   │ 5. Timeline         │
│                     │   │ 6. Reason           │
│                     │   │ 7. Current Address  │
└─────────┬───────────┘   └─────────┬───────────┘
          │                         │
          └───────────┬─────────────┘
                      ▼
┌─────────────────────────────────────────────────────┐
│ Contact Collection                                   │
│                                                     │
│ 8. What's your name?                                │
│ 9. What's your phone? (optional)                    │
│ 10. What's your email?                              │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│ Step 11: Success Screen                             │
│ "Thanks! I'll be in touch soon."                    │
│ [Close]                                             │
└─────────────────────────────────────────────────────┘
```

### Question Options

**Property Type (Buy):**
- House
- Townhouse
- Condo
- Multi-family
- Land
- Other

**Property Type (Sell):**
- House
- Townhouse
- Condo
- Multi-family
- Land

**Areas:**
- Austin
- Round Rock
- Cedar Park
- Georgetown
- Pflugerville
- Hutto
- Other

**Budget (Buy):**
- Under $300K
- $300K - $400K
- $400K - $500K
- $500K - $700K
- $700K - $1M
- Over $1M

**Timeline:**
- ASAP
- 1-3 months
- 3-6 months
- 6+ months
- Just exploring

**Sell Reasons:**
- Relocating
- Upgrading
- Downsizing
- Investment
- Life changes

### Payload Schema

```typescript
{
  type: "chat_wizard",
  flow: "buy" | "sell",
  session_id: string,
  cta_source: CTASource,
  answers: {
    propertyType?: string,
    area?: string,
    budget?: string,       // buy flow
    timeline?: string,
    reason?: string,       // sell flow
    address?: string       // sell flow
  },
  contact: {
    name: string,
    phone: string,         // optional, validated if provided
    email: string
  },
  locale: "en" | "es",
  utm?: UTMParams
}
```

### UI Features

- Conversational message interface (chat bubbles)
- Auto-scroll to latest message
- Input validation with inline errors
- Option buttons for choices
- Free-text input for address
- Loading states during submission
- Animated transitions between steps

---

## LeadMagnet

**File:** `src/components/lead-magnet.tsx` (372 lines)

### Purpose

Capture email addresses in exchange for downloadable buyer's/seller's guides.

### UI Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┌────────────────────┐    ┌─────────────────────────────────┐  │
│  │                    │    │                                  │  │
│  │   [Guide Preview]  │    │  Get Your Free Guide             │  │
│  │                    │    │                                  │  │
│  │   [Buyer] [Seller] │    │  ┌──────────────────────────┐   │  │
│  │                    │    │  │ First Name               │   │  │
│  │                    │    │  └──────────────────────────┘   │  │
│  │                    │    │                                  │  │
│  │                    │    │  ┌──────────────────────────┐   │  │
│  │                    │    │  │ Email                    │   │  │
│  │                    │    │  └──────────────────────────┘   │  │
│  │                    │    │                                  │  │
│  │                    │    │  [Download Free Guide]           │  │
│  │                    │    │                                  │  │
│  └────────────────────┘    └─────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Guide Toggle

Users can toggle between buyer's guide and seller's guide:

| Guide Type | Content Focus |
|------------|---------------|
| Buyer | Home buying process, financing, inspections |
| Seller | Home prep, pricing, negotiations |

Toggle action tracked via GA4 `trackGuideToggle()`.

### Validation

| Field | Rules |
|-------|-------|
| First Name | Required, min 2 characters |
| Email | Required, valid email format |

### Payload Schema

```typescript
{
  type: "lead_magnet",
  guideType: "buyer" | "seller",
  session_id: string,
  cta_source: "lead_magnet",
  contact: {
    firstName: string,
    email: string
  },
  locale: "en" | "es",
  utm?: UTMParams
}
```

### Success State

On successful submission:
1. Toast notification: "Guide sent to your email!"
2. Form fields cleared
3. Download triggered (if configured)
4. GA4 event: `trackLeadGeneration({ lead_source: "lead_magnet", guide_type })`

---

## ConsultForm

**File:** `src/components/consult/consult-form.tsx` (796 lines)

### Purpose

Full qualification form for consultation requests. Collects more detailed information than ChatWizard.

### Form Sections

#### Contact Information

| Field | Type | Validation |
|-------|------|------------|
| Name | Text | Required, min 2 chars |
| Phone | Text | **Required**, US format |
| Email | Text | Required, valid format |
| Language | Select | Required (en/es) |

**Note:** Phone is required for ConsultForm (unlike ChatWizard) because it's used for WhatsApp notifications.

#### Qualification Questions

| Field | Options |
|-------|---------|
| Timeline | ASAP, 1-3 months, 3-6 months, 6+ months, Just exploring |
| Income Type | W2, 1099, Self-employed, ITIN, Other |
| Bank Status | Pre-approved, Working on it, Haven't started, Cash buyer |
| Down Payment | Less than $10K, $10K-$20K, $20K+, Not sure |
| Area | Austin, Round Rock, Cedar Park, Georgetown, Pflugerville, Hutto, Other |

#### Tracking

| Field | Type | Description |
|-------|------|-------------|
| Source | Select | How they heard about Sully |
| Notes | Textarea | Optional additional info |

### Payload Schema

```typescript
{
  type: "consult",
  session_id: string,
  cta_source: "consult_form",
  contact: {
    name: string,
    phone: string,              // Required
    email: string,
    languagePreference: "en" | "es"
  },
  qualification: {
    timeline: string,
    incomeType: string,
    bankStatus: string,
    downPayment: string,
    area: string
  },
  tracking: {
    source: string,
    notes?: string
  },
  locale: "en" | "es",
  utm?: UTMParams
}
```

### Success Response

ConsultForm receives a rich response from n8n:

```typescript
{
  success: true,
  leadId: "abc123-1706745600000",
  notifications: {
    emailSent: boolean,
    whatsappSent: boolean,
    agentNotified: boolean
  },
  message: {
    en: "Thank you! We've received your consultation request...",
    es: "¡Gracias! Hemos recibido tu solicitud..."
  },
  nextSteps: {
    en: ["Check your email...", "Expect a call..."],
    es: ["Revisa tu correo...", "Espera una llamada..."]
  }
}
```

### Success Screen Display

```
┌─────────────────────────────────────────────────────┐
│                                                      │
│  ✓ Consultation Request Received                     │
│                                                      │
│  Thank you! We've received your consultation         │
│  request and will contact you within 24 hours.       │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │ Notifications Sent:                            │  │
│  │ ✓ Confirmation email sent                      │  │
│  │ ✓ WhatsApp message sent                        │  │
│  │ ✓ Agent notified                               │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│  Next Steps:                                         │
│  1. Check your email for confirmation                │
│  2. Expect a call or WhatsApp within 24 hours        │
│  3. Prepare your questions about real estate goals   │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Error Handling

ConsultForm handles specific error types:

| Error Code | Message (EN) | Cause |
|------------|--------------|-------|
| `TIMEOUT_ERROR` | "Request timed out. Please try again." | n8n took > 30s |
| `STORAGE_ERROR` | "Unable to save your information." | Google Sheets failed |
| `NETWORK_ERROR` | "Network error. Please try again." | n8n unreachable |

---

## Validation Library

**File:** `src/lib/validation.ts`

### Functions

```typescript
// Email validation
validateEmail(email: string): ValidationResult
// Regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Phone validation (optional field)
validatePhone(phone: string): ValidationResult
// Returns valid if empty or matches format

// Phone validation (required field)
validatePhoneRequired(phone: string): ValidationResult
// Must match US phone format

// Name validation
validateName(name: string): ValidationResult
// Min 2 characters

// Phone normalization
normalizePhone(phone: string): string
// Extracts digits only: "(512) 555-1234" → "5125551234"

// Full payload validation
validateLeadPayload(contact, type): LeadValidationResult
```

### Phone Format

Accepted formats:
- `5125551234`
- `512-555-1234`
- `(512) 555-1234`
- `512.555.1234`
- `+1 512-555-1234`
- `+1 (512) 555-1234`

Regex: `/^(?:\+1\s?)?(?:\([0-9]{3}\)|[0-9]{3})[\s.\-]?[0-9]{3}[\s.\-]?[0-9]{4}$/`

### Validation by Lead Type

| Type | Name | Email | Phone |
|------|------|-------|-------|
| `lead_magnet` | firstName required | Required | - |
| `chat_wizard` | name required | Required | Optional (validated if provided) |
| `consult` | name required | Required | **Required** |

---

## Session Tracking

**File:** `src/lib/session.ts`

### Session ID

Generated once per browser session using UUID v4. Stored in `sessionStorage`.

```typescript
getSessionId(): string
// Returns existing or creates new UUID
```

### CTA Source Tracking

Records which button/section initiated the lead capture:

```typescript
setCTASource(source: CTASource): void
getCTASource(): CTASource | null
```

### Session Cleanup

After successful submission:

```typescript
clearSession(): void
// Removes session_id and cta_source from sessionStorage
```

---

## UTM Parameter Tracking

**File:** `src/lib/utm.ts`

### Captured Parameters

| Parameter | Example |
|-----------|---------|
| `utm_source` | google, facebook |
| `utm_medium` | cpc, social |
| `utm_campaign` | spring_2024 |
| `utm_term` | austin real estate |
| `utm_content` | hero_cta |

### Behavior

- Captured on page load if URL contains UTM params
- Stored in sessionStorage
- First UTM params win (not overwritten during session)
- Included in all lead payloads

---

## Analytics Events

**File:** `src/lib/analytics.ts`

### Lead Events

```typescript
// On successful submission
trackLeadGeneration({
  lead_source: "chat_wizard" | "lead_magnet",
  flow?: "buy" | "sell",      // chat_wizard only
  guide_type?: "buyer" | "seller"  // lead_magnet only
})
```

### Engagement Events

```typescript
trackCTAClick({ cta_source, flow? })
trackWizardOpen({ cta_source })
trackWizardClose({ step, flow? })
trackWizardStep({ step, flow?, value? })
trackGuideToggle({ guide_type })
```

### Error Events

```typescript
trackFormError({
  form_name: "chat_wizard" | "lead_magnet",
  error_field: "email" | "phone" | "name" | "firstName",
  error_type: "invalid" | "required"
})
```

---

## Complete Data Flow

```
User clicks CTA
    │
    ├── setCTASource(source)
    │
    ▼
Modal/Form opens
    │
    ├── trackWizardOpen({ cta_source })
    │
    ▼
User fills form
    │
    ├── trackWizardStep({ step, value }) per step
    │
    ▼
Client-side validation
    │
    ├── If invalid: trackFormError({ field, type })
    │
    ▼
POST /api/lead
    │
    ├── Payload: { type, session_id, cta_source, contact, utm, locale }
    │
    ▼
Server validation
    │
    ├── Normalize phone
    ├── Log locally
    │
    ▼
Forward to n8n webhook
    │
    ├── n8n saves to Google Sheets
    ├── n8n sends notifications
    │
    ▼
Return response
    │
    ├── Success: { success: true, leadId, ... }
    ├── Error: { success: false, error, code }
    │
    ▼
Client handles response
    │
    ├── Show success screen
    ├── clearSession()
    ├── trackLeadGeneration()
    │
    ▼
Done
```

---

## Related Documentation

- [API: Lead Endpoint](../api/lead-endpoint.md) - Full API specification
- [Session Management](./session-management.md) - Session tracking details
- [Analytics](./analytics.md) - All GA4 events
- [n8n Overview](../integrations/n8n-overview.md) - Webhook processing
