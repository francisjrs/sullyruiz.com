# Session Management

This document covers session tracking and CTA source management.

**File:** `src/lib/session.ts`

---

## Overview

Session management tracks:
- **Session ID:** Unique identifier for the browser session
- **CTA Source:** Which button/section initiated the lead capture

Both are stored in browser `sessionStorage` and cleared after successful submission.

---

## Session ID

### Purpose

The session ID links multiple interactions within a single browser session. It enables:
- Correlating leads with their original traffic source
- Form prefill functionality
- Analytics continuity

### Generation

Session IDs are UUIDs generated on first access:

```typescript
import { v4 as uuidv4 } from 'uuid'

const SESSION_ID_KEY = 'sullyruiz_session_id'

export function getSessionId(): string {
  if (typeof window === 'undefined') return ''

  let sessionId = sessionStorage.getItem(SESSION_ID_KEY)

  if (!sessionId) {
    sessionId = uuidv4()
    sessionStorage.setItem(SESSION_ID_KEY, sessionId)
  }

  return sessionId
}
```

### Lifecycle

```
User visits site
       │
       ▼
First interaction (CTA click)
       │
       ▼
getSessionId() called
       │
       ├── Session ID exists → Return existing
       │
       └── No Session ID → Generate UUID, store, return
       │
       ▼
Session ID included in lead payload
       │
       ▼
Successful submission
       │
       ▼
clearSession() called
       │
       ▼
Session ID removed from storage
```

### Storage

- **Key:** `sullyruiz_session_id`
- **Storage:** `sessionStorage`
- **Duration:** Until browser tab/window closed
- **Cleared:** After successful lead submission

---

## CTA Source

### Purpose

Tracks which call-to-action initiated the lead capture. Used for:
- Attribution reporting
- Conversion optimization
- Understanding user journey

### Available Sources

| Source | Location | Description |
|--------|----------|-------------|
| `navbar` | Navigation header | "Get Started" button |
| `hero_buy` | Hero section | "Ready to Buy" button |
| `hero_sell` | Hero section | "Ready to Sell" button |
| `about` | About section | "Work With Me" button |
| `services_buy` | Services section | Buy card "Get Started" |
| `services_sell` | Services section | Sell card "Get Started" |
| `lead_magnet` | Lead magnet section | Email capture form |
| `consult_form` | Consult page | Consultation form |

### Implementation

```typescript
type CTASource =
  | 'navbar'
  | 'hero_buy'
  | 'hero_sell'
  | 'about'
  | 'services_buy'
  | 'services_sell'
  | 'lead_magnet'
  | 'consult_form'

const CTA_SOURCE_KEY = 'sullyruiz_cta_source'

export function setCTASource(source: CTASource): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(CTA_SOURCE_KEY, source)
}

export function getCTASource(): CTASource | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem(CTA_SOURCE_KEY) as CTASource | null
}
```

### Usage Pattern

```typescript
// When user clicks CTA
const handleBuyClick = () => {
  setCTASource('hero_buy')
  trackCTAClick({ cta_source: 'hero_buy', flow: 'buy' })
  openChatWizard('buy')
}

// When submitting lead
const submitLead = async () => {
  const payload = {
    // ... other fields
    cta_source: getCTASource() || 'unknown',
    session_id: getSessionId(),
  }

  await fetch('/api/lead', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
```

---

## Combined Utilities

### getSessionData

Convenience function to get both values:

```typescript
export function getSessionData(): {
  session_id: string
  cta_source: CTASource | null
} {
  return {
    session_id: getSessionId(),
    cta_source: getCTASource(),
  }
}
```

### clearSession

Clears all session data after successful submission:

```typescript
export function clearSession(): void {
  if (typeof window === 'undefined') return

  sessionStorage.removeItem(SESSION_ID_KEY)
  sessionStorage.removeItem(CTA_SOURCE_KEY)
}
```

---

## Integration Points

### ChatWizard

```typescript
// Opening wizard
const openChat = (flow: 'buy' | 'sell' | null, source: CTASource) => {
  setCTASource(source)
  // ... open modal
}

// Submitting lead
const handleSubmit = async () => {
  const { session_id, cta_source } = getSessionData()

  await submitLead({
    type: 'chat_wizard',
    session_id,
    cta_source,
    // ... other fields
  })

  clearSession()
}
```

### LeadMagnet

```typescript
// Submit email capture
const handleSubmit = async () => {
  const { session_id } = getSessionData()

  await submitLead({
    type: 'lead_magnet',
    session_id,
    cta_source: 'lead_magnet',
    // ... other fields
  })

  clearSession()
}
```

### ConsultForm

```typescript
// Submit consultation request
const handleSubmit = async () => {
  const { session_id } = getSessionData()

  await submitLead({
    type: 'consult',
    session_id,
    cta_source: 'consult_form',
    // ... other fields
  })

  clearSession()
}
```

### Screening Wizard

```typescript
// Submit screening
const handleSubmit = async () => {
  const session_id = getSessionId()

  await submitScreening({
    session_id,
    // ... screening data
  })

  // Note: Session not cleared - user may return
}
```

---

## Server-Side Handling

### Receiving Session Data

```typescript
// src/app/api/lead/route.ts
export async function POST(request: Request) {
  const body = await request.json()
  const { session_id, cta_source } = body

  // Include in webhook payload
  await forwardToN8n({
    ...body,
    session_id,
    cta_source,
    receivedAt: new Date().toISOString(),
  })
}
```

### Prefill Lookup

```typescript
// src/app/api/screening/prefill/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const session_id = searchParams.get('session_id')

  if (!session_id) {
    return Response.json({ email: '', phone: '', name: '' })
  }

  // Lookup in n8n
  const data = await lookupSession(session_id)
  return Response.json(data)
}
```

---

## Storage Details

### sessionStorage Behavior

| Scenario | Behavior |
|----------|----------|
| Same tab | Data persists |
| New tab (same window) | Data NOT shared |
| New window | Data NOT shared |
| Tab refresh | Data persists |
| Tab close | Data cleared |
| Browser close | Data cleared |

### Why sessionStorage?

- **Privacy:** Automatically cleared on browser close
- **Scope:** Isolated per tab (prevents cross-tab contamination)
- **Simplicity:** No expiration management needed
- **Security:** Not sent with requests (unlike cookies)

---

## Best Practices

### Always Use Helpers

```typescript
// Good
const sessionId = getSessionId()

// Avoid
const sessionId = sessionStorage.getItem('sullyruiz_session_id')
```

### Clear After Success

```typescript
// Always clear after successful submission
try {
  await submitLead(payload)
  clearSession()  // ← Important!
  showSuccess()
} catch (error) {
  // Don't clear on error - user may retry
  showError()
}
```

### Set CTA Source Early

```typescript
// Set immediately when user clicks CTA
const handleCTAClick = () => {
  setCTASource('hero_buy')  // ← Set immediately
  trackClick()
  openModal()
}
```

### Handle Missing Values

```typescript
// Always provide fallbacks
const payload = {
  session_id: getSessionId() || 'unknown',
  cta_source: getCTASource() || 'direct',
}
```

---

## Debugging

### View Session Data

In browser console:

```javascript
// View current session data
console.log({
  session_id: sessionStorage.getItem('sullyruiz_session_id'),
  cta_source: sessionStorage.getItem('sullyruiz_cta_source'),
})

// Clear session manually
sessionStorage.removeItem('sullyruiz_session_id')
sessionStorage.removeItem('sullyruiz_cta_source')
```

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| No session ID | SSR context | Check `typeof window` |
| Session lost | Tab closed | Expected behavior |
| Wrong CTA source | Multiple clicks | Last click wins |

---

## Related Documentation

- [Lead Capture](./lead-capture.md) - Form submission flow
- [Analytics](./analytics.md) - Event tracking
- [CTA Sources](../reference/cta-sources.md) - All source identifiers
- [API: Lead Endpoint](../api/lead-endpoint.md) - Payload structure
