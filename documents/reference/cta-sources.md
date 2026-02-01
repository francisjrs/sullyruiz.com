# CTA Sources

This document lists all CTA (Call-to-Action) source identifiers used for tracking lead attribution.

---

## Overview

CTA sources track which button or section initiated a lead capture. This data is:
- Stored in sessionStorage during user session
- Included in all lead payloads
- Used for attribution reporting in GA4

---

## Source Identifiers

### Landing Page CTAs

| Source | Location | Element | Flow |
|--------|----------|---------|------|
| `navbar` | Navigation header | "Get Started" button | null |
| `hero_buy` | Hero section | "Ready to Buy" button | buy |
| `hero_sell` | Hero section | "Ready to Sell" button | sell |
| `about` | About section | "Work With Me" button | null |
| `services_buy` | Services section | Buy card "Get Started" | buy |
| `services_sell` | Services section | Sell card "Get Started" | sell |
| `lead_magnet` | Lead magnet section | Email capture form | - |

### Other Pages

| Source | Location | Element |
|--------|----------|---------|
| `consult_form` | Consult page | Consultation request form |

---

## Visual Reference

```
┌─────────────────────────────────────────────────────────────────┐
│  Navbar                                                          │
│                                        [Get Started] ← navbar    │
├─────────────────────────────────────────────────────────────────┤
│  Hero                                                            │
│  [Ready to Buy] ← hero_buy    [Ready to Sell] ← hero_sell       │
├─────────────────────────────────────────────────────────────────┤
│  About                                                           │
│                              [Work With Me →] ← about            │
├─────────────────────────────────────────────────────────────────┤
│  Services                                                        │
│  ┌─────────────────┐          ┌─────────────────┐               │
│  │  Buying         │          │  Selling        │               │
│  │  [Get Started]  │          │  [Get Started]  │               │
│  │   ↑             │          │   ↑             │               │
│  │   services_buy  │          │   services_sell │               │
│  └─────────────────┘          └─────────────────┘               │
├─────────────────────────────────────────────────────────────────┤
│  Lead Magnet                                                     │
│  [First Name] [Email] [Download] ← lead_magnet                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Usage

### Setting CTA Source

```typescript
import { setCTASource } from '@/lib/session'

// Hero buy button click
const handleBuyClick = () => {
  setCTASource('hero_buy')
  openChatWizard('buy')
}

// Services sell button click
const handleSellClick = () => {
  setCTASource('services_sell')
  openChatWizard('sell')
}
```

### Getting CTA Source

```typescript
import { getCTASource } from '@/lib/session'

const submitLead = async () => {
  const payload = {
    // ...other fields
    cta_source: getCTASource() || 'unknown',
  }
  // Submit...
}
```

---

## Flow Mapping

| Source | Opens | Initial Flow |
|--------|-------|--------------|
| `navbar` | ChatWizard | null (user selects) |
| `hero_buy` | ChatWizard | buy |
| `hero_sell` | ChatWizard | sell |
| `about` | ChatWizard | null (user selects) |
| `services_buy` | ChatWizard | buy |
| `services_sell` | ChatWizard | sell |
| `lead_magnet` | Inline form | - |
| `consult_form` | Inline form | - |

---

## Analytics Integration

### GA4 Events

CTA source is included in analytics events:

```typescript
// CTA click tracking
trackCTAClick({ cta_source: 'hero_buy', flow: 'buy' })

// Wizard open tracking
trackWizardOpen({ cta_source: 'hero_buy' })

// Lead generation tracking (source in payload)
trackLeadGeneration({ lead_source: 'chat_wizard', flow: 'buy' })
```

### GA4 Reports

Create custom reports with dimensions:
- `cta_source` - Which button was clicked
- `flow` - Buy or sell intent

Example report:
```
CTA Source      | Clicks | Wizard Opens | Leads | Conversion
----------------|--------|--------------|-------|------------
hero_buy        | 500    | 450          | 45    | 10%
hero_sell       | 300    | 270          | 30    | 11%
services_buy    | 200    | 180          | 25    | 14%
navbar          | 150    | 140          | 10    | 7%
lead_magnet     | 400    | -            | 80    | 20%
```

---

## Storage Details

### Key

```typescript
const CTA_SOURCE_KEY = 'sullyruiz_cta_source'
```

### Lifecycle

1. **Set:** When user clicks CTA
2. **Read:** When submitting lead
3. **Clear:** After successful submission

### Behavior

- Only one source stored at a time
- Last click overwrites previous
- Cleared with `clearSession()` after submission

---

## Type Definition

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
```

---

## Adding New CTA Sources

1. Add to type definition in `src/lib/session.ts`:
```typescript
type CTASource =
  | 'navbar'
  | 'hero_buy'
  // ... existing
  | 'new_source'  // Add new source
```

2. Use in component:
```typescript
const handleClick = () => {
  setCTASource('new_source')
  // ... action
}
```

3. Update this documentation

4. Update GA4 reports if needed

---

## Best Practices

### Set Source Immediately

```typescript
// Good - set immediately on click
const handleClick = () => {
  setCTASource('hero_buy')  // ← First
  trackCTAClick({ cta_source: 'hero_buy' })
  openModal()
}

// Bad - set later
const handleClick = () => {
  openModal()
  // Source might be wrong if user navigates
}
```

### Use Consistent Naming

- Lowercase with underscores
- `location_action` pattern
- Clear and descriptive

### Handle Missing Sources

```typescript
const cta_source = getCTASource() || 'direct'
```

---

## Related Documentation

- [Session Management](../features/session-management.md) - Storage details
- [Lead Capture](../features/lead-capture.md) - Form submission flow
- [Analytics](../features/analytics.md) - Event tracking
- [API: Lead Endpoint](../api/lead-endpoint.md) - Payload structure
