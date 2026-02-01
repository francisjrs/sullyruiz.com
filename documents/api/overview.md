# API Overview

This document provides an overview of the API architecture for sullyruiz.com.

---

## Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/lead` | POST | Submit lead from ChatWizard, LeadMagnet, or ConsultForm |
| `/api/screening` | POST | Submit screening questionnaire |
| `/api/screening/prefill` | GET | Get prefill data for screening form |
| `/api/health` | GET | Health check for container monitoring |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Next.js App                              │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                     src/app/api/                         │    │
│  │                                                          │    │
│  │  ┌─────────────────┐  ┌─────────────────────────────┐   │    │
│  │  │ /api/lead       │  │ /api/screening              │   │    │
│  │  │ route.ts        │  │ ├── route.ts                │   │    │
│  │  │                 │  │ └── prefill/route.ts        │   │    │
│  │  └────────┬────────┘  └─────────────┬───────────────┘   │    │
│  │           │                         │                    │    │
│  │  ┌────────┴─────────────────────────┴───────────────┐   │    │
│  │  │              Shared Utilities                     │   │    │
│  │  │  • src/lib/validation.ts                         │   │    │
│  │  └──────────────────────────────────────────────────┘   │    │
│  │                                                          │    │
│  │  ┌─────────────────┐                                    │    │
│  │  │ /api/health     │                                    │    │
│  │  │ route.ts        │                                    │    │
│  │  └─────────────────┘                                    │    │
│  │                                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      n8n            │
                    │  (External webhooks)│
                    └─────────────────────┘
```

---

## Common Patterns

### Request Handling

All POST endpoints follow this pattern:

```typescript
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // 1. Parse body
    const body = await request.json()

    // 2. Validate
    if (!body.requiredField) {
      return NextResponse.json(
        { error: 'Missing required field' },
        { status: 400 }
      )
    }

    // 3. Process
    const result = await processData(body)

    // 4. Return success
    return NextResponse.json({ success: true, ...result })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Validation

Shared validation utilities from `src/lib/validation.ts`:

```typescript
import { validateEmail, validatePhone, validateName } from '@/lib/validation'

// Validate contact information
const emailResult = validateEmail(body.contact.email)
if (!emailResult.valid) {
  return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
}
```

### Webhook Forwarding

Pattern for forwarding to n8n:

```typescript
if (process.env.N8N_WEBHOOK_URL) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (process.env.N8N_API_KEY) {
    headers['X-API-Key'] = process.env.N8N_API_KEY
  }

  await fetch(process.env.N8N_WEBHOOK_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      ...body,
      receivedAt: new Date().toISOString(),
    }),
  })
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | Success | Request processed successfully |
| 400 | Bad Request | Validation failed, missing fields |
| 500 | Server Error | Unexpected error |

### Error Response Format

```json
{
  "error": "Description of the error"
}
```

### Consult-Specific Errors

ConsultForm submissions return structured errors:

```json
{
  "success": false,
  "error": "timeout",
  "message": "Request timed out. Please try again.",
  "code": "TIMEOUT_ERROR"
}
```

| Code | Cause |
|------|-------|
| `TIMEOUT_ERROR` | n8n took > 30 seconds |
| `STORAGE_ERROR` | Google Sheets save failed |
| `NETWORK_ERROR` | n8n unreachable |

---

## Authentication

### Webhook Authentication

Optional API key authentication for n8n webhooks:

```typescript
// If N8N_API_KEY is set, include in headers
if (process.env.N8N_API_KEY) {
  headers['X-API-Key'] = process.env.N8N_API_KEY
}
```

### No Client Authentication

API endpoints do not require client authentication. Protection is via:
- CORS (same-origin requests)
- Rate limiting (TODO)
- Input validation

---

## Data Flow

### Lead Submission

```
Frontend Form
    │
    ├── Client-side validation
    │
    ▼
POST /api/lead
    │
    ├── Server-side validation
    ├── Phone normalization
    ├── Local logging
    │
    ▼
n8n Webhook (async or sync)
    │
    ├── Save to Google Sheets
    ├── Send notifications
    │
    ▼
Response to Frontend
```

### Screening Submission

```
Screening Wizard
    │
    ├── Client-side validation
    │
    ▼
POST /api/screening
    │
    ├── Server-side validation
    ├── Calculate lead score
    ├── Local logging
    │
    ▼
n8n Webhook (async, fire-and-forget)
    │
    ▼
Response with score/tier
```

---

## Timeouts

| Endpoint | Timeout | Reason |
|----------|---------|--------|
| `/api/lead` (consult) | 30 seconds | Wait for n8n response |
| `/api/lead` (others) | None | Async webhook |
| `/api/screening` | None | Async webhook |
| `/api/screening/prefill` | 10 seconds | Quick lookup |
| `/api/health` | None | Instant response |

---

## Logging

All endpoints log to console for debugging:

```typescript
console.log(`[Lead] Type: ${body.type}, Email: ${body.contact.email}`)
console.log(`[Screening] Score: ${score}, Tier: ${tier}`)
```

Logs are visible via:
```bash
docker compose logs app --tail=100
```

---

## Testing

### curl Examples

**Lead Submission:**
```bash
curl -X POST https://sullyruiz.com/api/lead \
  -H "Content-Type: application/json" \
  -d '{"type":"lead_magnet","contact":{"firstName":"Test","email":"test@example.com"},"locale":"en"}'
```

**Health Check:**
```bash
curl https://sullyruiz.com/api/health
```

**Screening Prefill:**
```bash
curl "https://sullyruiz.com/api/screening/prefill?session_id=abc123"
```

---

## Environment Variables

| Variable | Used By |
|----------|---------|
| `N8N_WEBHOOK_URL` | `/api/lead` |
| `N8N_SCREENING_WEBHOOK_URL` | `/api/screening` |
| `N8N_LEAD_LOOKUP_WEBHOOK_URL` | `/api/screening/prefill` |
| `N8N_API_KEY` | All webhooks |

---

## Related Documentation

- [Lead Endpoint](./lead-endpoint.md) - Full specification
- [Screening Endpoint](./screening-endpoint.md) - Full specification
- [Health Endpoint](./health-endpoint.md) - Health check
- [n8n Overview](../integrations/n8n-overview.md) - Webhook processing
