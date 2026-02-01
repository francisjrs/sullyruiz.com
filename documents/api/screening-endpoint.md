# Screening Endpoint

**Endpoints:**
- `POST /api/screening` - Submit screening questionnaire
- `GET /api/screening/prefill` - Get prefill data for form

**Files:**
- `src/app/api/screening/route.ts`
- `src/app/api/screening/prefill/route.ts`

---

## Overview

The screening endpoints handle the pre-qualification questionnaire, which collects detailed buyer information and calculates a lead score.

---

## POST /api/screening

### Purpose

Submit a completed screening questionnaire with lead scoring.

### Request

```typescript
{
  session_id: string | null,
  locale: "en" | "es",
  screening: {
    // Contact
    email: string,
    phone: string,
    fullName: string,

    // Pre-approval
    hasPreapproval: "yes" | "no" | "working_on_it",

    // Income & Employment
    immigrationStatus: string,
    monthlyIncome: string,
    monthlyDebt: string,
    paymentType: "w2" | "1099" | "cash" | "other",
    employmentType: string,

    // Credit
    creditScore: "800+" | "740-799" | "700-739" | "640-699" | "600-639" | "below_600" | "unknown",
    hasAutoLoan: "yes" | "no",
    hasCreditCards: "yes" | "no",

    // Finances
    taxYears: "0" | "1" | "2" | "3+",
    downPayment: "0-5k" | "5k-10k" | "10k-20k" | "20k-50k" | "50k+" | "unknown",
    savingsLocation: string,

    // Timeline
    leaseEndDate: string,
    moveDate: "asap" | "1-3_months" | "3-6_months" | "6-12_months" | "12+_months",

    // Property
    propertyType: string,
    isHomeowner: "yes" | "no",
    willSellHome: "yes" | "no" | "not_applicable",

    // Other
    buyingWith: "alone" | "spouse" | "partner" | "family" | "other",
    militaryService: "active" | "veteran" | "spouse" | "none",
    additionalInfo: string
  }
}
```

### Example Request

```bash
curl -X POST https://sullyruiz.com/api/screening \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "locale": "en",
    "screening": {
      "email": "john@example.com",
      "phone": "(512) 555-1234",
      "fullName": "John Doe",
      "hasPreapproval": "yes",
      "immigrationStatus": "citizen",
      "monthlyIncome": "8000",
      "monthlyDebt": "500",
      "paymentType": "w2",
      "employmentType": "full_time",
      "creditScore": "740-799",
      "hasAutoLoan": "yes",
      "hasCreditCards": "yes",
      "taxYears": "3+",
      "downPayment": "20k-50k",
      "savingsLocation": "checking",
      "leaseEndDate": "2024-06-01",
      "moveDate": "1-3_months",
      "propertyType": "single_family",
      "isHomeowner": "no",
      "willSellHome": "not_applicable",
      "buyingWith": "spouse",
      "militaryService": "none",
      "additionalInfo": "Looking for homes in North Austin"
    }
  }'
```

### Response

```json
{
  "success": true,
  "message": "Screening received successfully",
  "lead_score": 85,
  "lead_tier": "hot"
}
```

---

## Lead Scoring Algorithm

The screening endpoint calculates a lead score (0-100) based on qualification factors.

### Scoring Factors

| Factor | Condition | Points |
|--------|-----------|--------|
| Pre-approval | `hasPreapproval === "yes"` | +35 |
| Credit Score | 700+ | +30 |
| Credit Score | 640-699 | +20 |
| Credit Score | 600-639 | +10 |
| Timeline | ASAP | +25 |
| Timeline | 1-3 months | +15 |
| Timeline | 3-6 months | +10 |
| Timeline | 6+ months | +5 |
| Down Payment | $20K+ | +15 |
| Down Payment | $10K-$20K | +10 |
| Down Payment | $0-$10K | +5 |
| Tax History | 2+ years | +10 |
| Employment | W2 | +5 |

**Maximum possible score:** 100 points

### Tier Classification

| Tier | Score Range | Description |
|------|-------------|-------------|
| `hot` | 80-100 | Ready to buy, pre-approved, strong financials |
| `warm` | 50-79 | Interested, needs some preparation |
| `developing` | 25-49 | Early stage, needs significant work |
| `cold` | 0-24 | Not ready, long timeline or major obstacles |

### Implementation

```typescript
function calculateLeadScore(screening: ScreeningData): { score: number; tier: string } {
  let score = 0

  // Pre-approval (35 pts max)
  if (screening.hasPreapproval === 'yes') score += 35

  // Credit score (30 pts max)
  if (['800+', '740-799', '700-739'].includes(screening.creditScore)) {
    score += 30
  } else if (screening.creditScore === '640-699') {
    score += 20
  } else if (screening.creditScore === '600-639') {
    score += 10
  }

  // Timeline (25 pts max)
  if (screening.moveDate === 'asap') {
    score += 25
  } else if (screening.moveDate === '1-3_months') {
    score += 15
  } else if (screening.moveDate === '3-6_months') {
    score += 10
  } else {
    score += 5
  }

  // Down payment (15 pts max)
  if (['20k-50k', '50k+'].includes(screening.downPayment)) {
    score += 15
  } else if (screening.downPayment === '10k-20k') {
    score += 10
  } else if (['0-5k', '5k-10k'].includes(screening.downPayment)) {
    score += 5
  }

  // Tax years (10 pts max)
  if (['2', '3+'].includes(screening.taxYears)) score += 10

  // Employment type (5 pts max)
  if (screening.paymentType === 'w2') score += 5

  // Determine tier
  let tier: string
  if (score >= 80) tier = 'hot'
  else if (score >= 50) tier = 'warm'
  else if (score >= 25) tier = 'developing'
  else tier = 'cold'

  return { score, tier }
}
```

---

## GET /api/screening/prefill

### Purpose

Retrieve previously submitted contact information for form prefill. Used when a user returns via a link with their session ID.

### Request

```
GET /api/screening/prefill?session_id=550e8400-e29b-41d4-a716-446655440000
```

### Response (Success)

```json
{
  "success": true,
  "email": "john@example.com",
  "phone": "(512) 555-1234",
  "name": "John Doe"
}
```

### Response (No Data)

```json
{
  "success": true,
  "email": "",
  "phone": "",
  "name": ""
}
```

### Behavior

1. If `session_id` is missing, returns empty fields
2. If `N8N_LEAD_LOOKUP_WEBHOOK_URL` is not configured, returns empty fields
3. Calls n8n webhook with session_id to lookup previous submission
4. Returns contact info if found, empty fields if not
5. Never throws errors - graceful degradation

---

## Webhook Integration

### Submission Webhook

**Environment Variable:** `N8N_SCREENING_WEBHOOK_URL`

The screening submission is forwarded to n8n asynchronously:

```typescript
if (process.env.N8N_SCREENING_WEBHOOK_URL) {
  // Fire and forget - don't await
  fetch(process.env.N8N_SCREENING_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...body,
      lead_score,
      lead_tier,
      receivedAt: new Date().toISOString()
    })
  }).catch(console.error)
}
```

### Lookup Webhook

**Environment Variable:** `N8N_LEAD_LOOKUP_WEBHOOK_URL`

The prefill endpoint queries n8n for existing data:

```typescript
if (process.env.N8N_LEAD_LOOKUP_WEBHOOK_URL) {
  const response = await fetch(
    `${process.env.N8N_LEAD_LOOKUP_WEBHOOK_URL}?session_id=${session_id}`
  )
  const data = await response.json()
  return { email: data.email, phone: data.phone, name: data.name }
}
```

---

## Error Handling

### POST /api/screening

| Status | Condition | Response |
|--------|-----------|----------|
| 400 | Missing screening data | `{ error: "Missing screening data" }` |
| 400 | Missing required fields | `{ error: "Missing required fields: ..." }` |
| 200 | Success | `{ success: true, lead_score, lead_tier }` |

### GET /api/screening/prefill

The prefill endpoint never returns errors - it always returns a success response with empty fields if data is unavailable:

```typescript
// Always returns 200 with this structure
{
  success: true,
  email: string,  // empty if not found
  phone: string,  // empty if not found
  name: string    // empty if not found
}
```

---

## Validation Rules

### Required Fields

- `email` - Valid email format
- `fullName` - Min 2 characters
- `hasPreapproval` - Must be yes/no/working_on_it
- `creditScore` - Must be valid option
- `moveDate` - Must be valid option
- `downPayment` - Must be valid option
- `paymentType` - Must be valid option

### Optional Fields

- `phone` - Validated if provided
- `additionalInfo` - Free text
- Most other fields have default values

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `N8N_SCREENING_WEBHOOK_URL` | No | Webhook for screening submissions |
| `N8N_LEAD_LOOKUP_WEBHOOK_URL` | No | Webhook for prefill data lookup |

---

## Related Documentation

- [Screening Page](../pages/screening-page.md) - Frontend implementation
- [Lead Scoring](../reference/lead-scoring.md) - Scoring details
- [n8n Overview](../integrations/n8n-overview.md) - Webhook processing
- [Environment Variables](../reference/environment-variables.md) - All env vars
