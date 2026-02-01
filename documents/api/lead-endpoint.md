# Lead Endpoint

**Endpoint:** `POST /api/lead`
**File:** `src/app/api/lead/route.ts`

---

## Overview

The lead endpoint handles all lead submissions from the website. It supports three lead types, each with different payload structures and processing logic.

---

## Request

### Headers

```
Content-Type: application/json
```

### Common Fields

All payloads must include:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | Lead type: `"lead_magnet"`, `"chat_wizard"`, or `"consult"` |
| `session_id` | string | Yes | UUID from sessionStorage |
| `cta_source` | string | Yes | CTA that initiated the lead |
| `locale` | string | Yes | User's locale: `"en"` or `"es"` |
| `utm` | object | No | UTM parameters if captured |

### UTM Object

```typescript
{
  utm_source?: string,
  utm_medium?: string,
  utm_campaign?: string,
  utm_term?: string,
  utm_content?: string
}
```

---

## Lead Type: `lead_magnet`

### Payload

```typescript
{
  type: "lead_magnet",
  guideType: "buyer" | "seller",
  session_id: string,
  cta_source: "lead_magnet",
  contact: {
    firstName: string,    // Required, min 2 chars
    email: string         // Required, valid format
  },
  locale: "en" | "es",
  utm?: UTMParams
}
```

### Example Request

```bash
curl -X POST https://sullyruiz.com/api/lead \
  -H "Content-Type: application/json" \
  -d '{
    "type": "lead_magnet",
    "guideType": "buyer",
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "cta_source": "lead_magnet",
    "contact": {
      "firstName": "John",
      "email": "john@example.com"
    },
    "locale": "en"
  }'
```

### Response

```json
{
  "success": true,
  "message": "Lead captured successfully"
}
```

---

## Lead Type: `chat_wizard`

### Payload

```typescript
{
  type: "chat_wizard",
  flow: "buy" | "sell",
  session_id: string,
  cta_source: CTASource,
  answers: {
    propertyType?: string,
    area?: string,
    budget?: string,      // buy flow
    timeline?: string,
    reason?: string,      // sell flow
    address?: string      // sell flow
  },
  contact: {
    name: string,         // Required, min 2 chars
    phone: string,        // Optional, validated if provided
    email: string         // Required, valid format
  },
  locale: "en" | "es",
  utm?: UTMParams
}
```

### Example Request (Buy Flow)

```bash
curl -X POST https://sullyruiz.com/api/lead \
  -H "Content-Type: application/json" \
  -d '{
    "type": "chat_wizard",
    "flow": "buy",
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "cta_source": "hero_buy",
    "answers": {
      "propertyType": "House",
      "area": "Austin",
      "budget": "$400K - $500K",
      "timeline": "1-3 months"
    },
    "contact": {
      "name": "John Doe",
      "phone": "(512) 555-1234",
      "email": "john@example.com"
    },
    "locale": "en"
  }'
```

### Example Request (Sell Flow)

```bash
curl -X POST https://sullyruiz.com/api/lead \
  -H "Content-Type: application/json" \
  -d '{
    "type": "chat_wizard",
    "flow": "sell",
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "cta_source": "services_sell",
    "answers": {
      "propertyType": "House",
      "area": "Round Rock",
      "budget": "$500K - $700K",
      "timeline": "3-6 months",
      "reason": "Relocating",
      "address": "123 Main St, Round Rock, TX"
    },
    "contact": {
      "name": "Jane Doe",
      "email": "jane@example.com"
    },
    "locale": "en"
  }'
```

### Response

```json
{
  "success": true,
  "message": "Lead captured successfully"
}
```

---

## Lead Type: `consult`

### Payload

```typescript
{
  type: "consult",
  session_id: string,
  cta_source: "consult_form",
  contact: {
    name: string,               // Required, min 2 chars
    phone: string,              // Required, US format
    email: string,              // Required, valid format
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

### Example Request

```bash
curl -X POST https://sullyruiz.com/api/lead \
  -H "Content-Type: application/json" \
  -d '{
    "type": "consult",
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "cta_source": "consult_form",
    "contact": {
      "name": "Maria Garcia",
      "phone": "(512) 555-9876",
      "email": "maria@example.com",
      "languagePreference": "es"
    },
    "qualification": {
      "timeline": "1-3 months",
      "incomeType": "W2",
      "bankStatus": "Pre-approved",
      "downPayment": "$20K+",
      "area": "Austin"
    },
    "tracking": {
      "source": "Facebook",
      "notes": "Interested in East Austin area"
    },
    "locale": "es"
  }'
```

### Success Response

```json
{
  "success": true,
  "leadId": "maria-1706745600000",
  "notifications": {
    "emailSent": true,
    "whatsappSent": true,
    "agentNotified": true
  },
  "message": {
    "en": "Thank you! We've received your consultation request and will contact you within 24 hours.",
    "es": "¡Gracias! Hemos recibido tu solicitud de consulta y te contactaremos dentro de 24 horas."
  },
  "nextSteps": {
    "en": [
      "Check your email for confirmation",
      "Expect a call or WhatsApp within 24 hours",
      "Prepare any questions about your real estate goals"
    ],
    "es": [
      "Revisa tu correo para la confirmación",
      "Espera una llamada o WhatsApp en 24 horas",
      "Prepara tus preguntas sobre tus metas inmobiliarias"
    ]
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "timeout",
  "message": "Request timed out. Please try again.",
  "code": "TIMEOUT_ERROR"
}
```

---

## Error Codes

### Validation Errors (400)

```json
{
  "error": "Missing required field: type"
}
```

```json
{
  "error": "Invalid email format"
}
```

```json
{
  "error": "Invalid phone format"
}
```

### Consult-Specific Errors (200 with error payload)

| Code | Error | Cause |
|------|-------|-------|
| `TIMEOUT_ERROR` | `timeout` | n8n webhook took > 30 seconds |
| `STORAGE_ERROR` | `storage_failed` | n8n couldn't save to Google Sheets |
| `NETWORK_ERROR` | `network_error` | n8n webhook unreachable |

---

## Processing Logic

### 1. Validation

```typescript
// Required fields
if (!body.type) return error("Missing required field: type")
if (!body.locale) return error("Missing required field: locale")

// Contact validation (varies by type)
const validation = validateLeadPayload(body.contact, body.type)
if (!validation.valid) return error(validation.message)
```

### 2. Phone Normalization

```typescript
// Strip all non-digit characters
const normalizedPhone = normalizePhone(body.contact.phone)
// "(512) 555-1234" → "5125551234"
```

### 3. Local Logging

```typescript
console.log(`[Lead] Type: ${body.type}, Email: ${body.contact.email}`)
```

### 4. Webhook Forwarding

```typescript
if (process.env.N8N_WEBHOOK_URL) {
  const response = await fetch(process.env.N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.N8N_API_KEY && { 'X-API-Key': process.env.N8N_API_KEY })
    },
    body: JSON.stringify({
      ...body,
      contact: {
        ...body.contact,
        phone: normalizedPhone
      },
      receivedAt: new Date().toISOString()
    }),
    signal: AbortSignal.timeout(30000)  // 30 second timeout
  })
}
```

### 5. Response Handling (Consult Only)

For `type: "consult"`, the endpoint parses and returns the n8n response:

```typescript
if (body.type === 'consult') {
  const n8nResponse = await response.json()
  return NextResponse.json(n8nResponse)
}
```

---

## CTA Sources

Valid values for `cta_source`:

| Value | Description |
|-------|-------------|
| `navbar` | Get Started button in navigation |
| `hero_buy` | Hero section "Ready to Buy" button |
| `hero_sell` | Hero section "Ready to Sell" button |
| `about` | About section "Work With Me" button |
| `services_buy` | Services section buy card |
| `services_sell` | Services section sell card |
| `lead_magnet` | Lead magnet email capture |
| `consult_form` | Consultation form |

---

## Qualification Field Options

### Timeline

| Value |
|-------|
| ASAP |
| 1-3 months |
| 3-6 months |
| 6+ months |
| Just exploring |

### Income Type

| Value |
|-------|
| W2 |
| 1099 |
| Self-employed |
| ITIN |
| Other |

### Bank Status

| Value |
|-------|
| Pre-approved |
| Working on it |
| Haven't started |
| Cash buyer |

### Down Payment

| Value |
|-------|
| Less than $10K |
| $10K-$20K |
| $20K+ |
| Not sure |

### Area

| Value |
|-------|
| Austin |
| Round Rock |
| Cedar Park |
| Georgetown |
| Pflugerville |
| Hutto |
| Other |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `N8N_WEBHOOK_URL` | No | Webhook URL for lead processing |
| `N8N_API_KEY` | No | API key for webhook authentication |

If `N8N_WEBHOOK_URL` is not set, leads are logged locally but not forwarded.

---

## Related Documentation

- [Lead Capture](../features/lead-capture.md) - Client-side implementation
- [n8n Overview](../integrations/n8n-overview.md) - Webhook processing
- [n8n Consult Workflow](../integrations/n8n-consult-workflow.md) - Consult-specific workflow
- [Environment Variables](../reference/environment-variables.md) - All env vars
