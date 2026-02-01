# Analytics

This document covers Google Analytics 4 integration and event tracking.

**File:** `src/lib/analytics.ts`

---

## Overview

sullyruiz.com uses Google Analytics 4 (GA4) for:
- Page view tracking
- Custom event tracking
- User property management
- Scroll depth measurement

---

## Setup

### Configuration

GA4 is configured via environment variable:

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Script Loading

GA4 script is loaded in the root layout:

```tsx
// src/app/[locale]/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  )
}
```

---

## Event Tracking Functions

### trackLeadGeneration

Fired when a lead is successfully submitted.

```typescript
interface LeadGenerationParams {
  lead_source: 'chat_wizard' | 'lead_magnet' | 'consult_form'
  flow?: 'buy' | 'sell'           // chat_wizard only
  guide_type?: 'buyer' | 'seller' // lead_magnet only
}

export function trackLeadGeneration(params: LeadGenerationParams): void {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'generate_lead', {
    lead_source: params.lead_source,
    flow: params.flow,
    guide_type: params.guide_type,
  })
}
```

**Usage:**
```typescript
// ChatWizard success
trackLeadGeneration({ lead_source: 'chat_wizard', flow: 'buy' })

// LeadMagnet success
trackLeadGeneration({ lead_source: 'lead_magnet', guide_type: 'buyer' })

// ConsultForm success
trackLeadGeneration({ lead_source: 'consult_form' })
```

---

### trackCTAClick

Fired when user clicks a call-to-action button.

```typescript
interface CTAClickParams {
  cta_source: string
  flow?: 'buy' | 'sell'
}

export function trackCTAClick(params: CTAClickParams): void {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'cta_click', {
    cta_source: params.cta_source,
    flow: params.flow,
  })
}
```

**Usage:**
```typescript
// Hero button click
trackCTAClick({ cta_source: 'hero_buy', flow: 'buy' })

// Services card click
trackCTAClick({ cta_source: 'services_sell', flow: 'sell' })

// Navbar button click
trackCTAClick({ cta_source: 'navbar' })
```

---

### trackWizardOpen

Fired when ChatWizard modal opens.

```typescript
interface WizardOpenParams {
  cta_source: string
}

export function trackWizardOpen(params: WizardOpenParams): void {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'wizard_open', {
    cta_source: params.cta_source,
  })
}
```

---

### trackWizardClose

Fired when user closes ChatWizard without completing.

```typescript
interface WizardCloseParams {
  step: string
  flow?: 'buy' | 'sell'
}

export function trackWizardClose(params: WizardCloseParams): void {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'wizard_close', {
    step: params.step,
    flow: params.flow,
  })
}
```

---

### trackWizardStep

Fired when user completes a step in the wizard.

```typescript
interface WizardStepParams {
  step: string
  flow?: 'buy' | 'sell'
  value?: string
}

export function trackWizardStep(params: WizardStepParams): void {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'wizard_step', {
    step: params.step,
    flow: params.flow,
    value: params.value,
  })
}
```

**Usage:**
```typescript
// User selects property type
trackWizardStep({ step: 'property_type', flow: 'buy', value: 'House' })

// User enters email
trackWizardStep({ step: 'email', flow: 'buy' })
```

---

### trackGuideToggle

Fired when user toggles between buyer's and seller's guide.

```typescript
interface GuideToggleParams {
  guide_type: 'buyer' | 'seller'
}

export function trackGuideToggle(params: GuideToggleParams): void {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'guide_toggle', {
    guide_type: params.guide_type,
  })
}
```

---

### trackFormError

Fired when form validation fails.

```typescript
interface FormErrorParams {
  form_name: 'chat_wizard' | 'lead_magnet' | 'consult_form' | 'screening'
  error_field: 'email' | 'phone' | 'name' | 'firstName'
  error_type: 'invalid' | 'required'
}

export function trackFormError(params: FormErrorParams): void {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'form_error', {
    form_name: params.form_name,
    error_field: params.error_field,
    error_type: params.error_type,
  })
}
```

**Usage:**
```typescript
// Invalid email
trackFormError({
  form_name: 'chat_wizard',
  error_field: 'email',
  error_type: 'invalid'
})

// Missing required field
trackFormError({
  form_name: 'consult_form',
  error_field: 'phone',
  error_type: 'required'
})
```

---

### trackScrollDepth

Fired when user scrolls to specific page depths.

```typescript
export function trackScrollDepth(percent: number): void {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'scroll_depth', {
    percent: percent,
  })
}
```

---

### setUserProperties

Sets user properties for session.

```typescript
interface UserPropertiesParams {
  user_locale: string
  user_type: 'new' | 'returning'
}

export function setUserProperties(params: UserPropertiesParams): void {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('set', 'user_properties', {
    user_locale: params.user_locale,
    user_type: params.user_type,
  })
}
```

---

### initScrollTracking

Initializes automatic scroll depth tracking.

```typescript
export function initScrollTracking(): () => void {
  if (typeof window === 'undefined') return () => {}

  const thresholds = [25, 50, 75, 90]
  const triggered = new Set<number>()

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = (window.scrollY / scrollHeight) * 100

    thresholds.forEach(threshold => {
      if (scrollPercent >= threshold && !triggered.has(threshold)) {
        triggered.add(threshold)
        trackScrollDepth(threshold)
      }
    })
  }

  window.addEventListener('scroll', handleScroll, { passive: true })

  return () => window.removeEventListener('scroll', handleScroll)
}
```

**Usage:**
```typescript
useEffect(() => {
  const cleanup = initScrollTracking()
  return cleanup
}, [])
```

---

## User Properties

### Returning User Detection

```typescript
const RETURNING_KEY = 'sullyruiz_returning'

function isReturningUser(): boolean {
  if (typeof window === 'undefined') return false

  const isReturning = localStorage.getItem(RETURNING_KEY) === 'true'
  if (!isReturning) {
    localStorage.setItem(RETURNING_KEY, 'true')
  }
  return isReturning
}
```

### Setting Properties on Page Load

```typescript
// In landing page useEffect
useEffect(() => {
  setUserProperties({
    user_locale: locale,
    user_type: isReturningUser() ? 'returning' : 'new'
  })
}, [locale])
```

---

## Event Reference

### All Events

| Event Name | Parameters | Trigger |
|------------|------------|---------|
| `generate_lead` | lead_source, flow?, guide_type? | Lead submission success |
| `cta_click` | cta_source, flow? | CTA button click |
| `wizard_open` | cta_source | ChatWizard opens |
| `wizard_close` | step, flow? | ChatWizard closed incomplete |
| `wizard_step` | step, flow?, value? | Wizard step completed |
| `guide_toggle` | guide_type | Guide type changed |
| `form_error` | form_name, error_field, error_type | Validation error |
| `scroll_depth` | percent | Scroll threshold reached |

### User Properties

| Property | Values | Description |
|----------|--------|-------------|
| `user_locale` | en, es | User's language preference |
| `user_type` | new, returning | First visit or return |

---

## GA4 Reports

### Recommended Custom Reports

#### Lead Funnel
```
Dimensions: cta_source, flow
Metrics: event_count (cta_click → wizard_open → generate_lead)
```

#### Form Errors
```
Dimensions: form_name, error_field, error_type
Metrics: event_count
```

#### Scroll Engagement
```
Dimensions: percent
Metrics: event_count, unique_users
```

---

## Debug Mode

### Enable Debug Mode

In browser console:
```javascript
// Enable debug mode
localStorage.setItem('debug_ga', 'true')

// View events being sent
window.gtag('config', 'G-XXXXXXXXXX', { 'debug_mode': true })
```

### GA4 DebugView

1. Open GA4 Dashboard
2. Navigate to Configure → DebugView
3. Events appear in real-time

---

## Privacy Considerations

### Consent Mode

If implementing cookie consent:

```typescript
// Before consent
window.gtag('consent', 'default', {
  'analytics_storage': 'denied'
})

// After consent granted
window.gtag('consent', 'update', {
  'analytics_storage': 'granted'
})
```

### No PII in Events

Never include personally identifiable information in events:

```typescript
// Bad - includes PII
trackWizardStep({ step: 'email', value: 'user@email.com' })

// Good - no PII
trackWizardStep({ step: 'email', flow: 'buy' })
```

---

## Troubleshooting

### Events Not Appearing

1. Check `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
2. Verify GA4 property is configured
3. Check browser console for errors
4. Use GA4 DebugView
5. Wait 24-48 hours for reports

### Duplicate Events

Common causes:
- useEffect running twice (React StrictMode)
- Multiple event listeners
- Component re-mounting

Solution:
```typescript
useEffect(() => {
  let mounted = true

  if (mounted) {
    trackEvent()
  }

  return () => { mounted = false }
}, [])
```

---

## Related Documentation

- [Lead Capture](./lead-capture.md) - Where lead events fire
- [Session Management](./session-management.md) - User tracking
- [Environment Variables](../reference/environment-variables.md) - GA4 setup
