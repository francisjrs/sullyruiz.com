# Landing Page

The main landing page at `sullyruiz.com` (English) and `sullyruiz.com/es` (Spanish).

**File:** `src/app/[locale]/page.tsx`

---

## Overview

The landing page is a client component that renders 11 sections in sequence. It manages global state for the ChatWizard modal and initializes analytics tracking.

---

## Page Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  Navbar                                                          │
│  [Logo] [Services] [About] [FAQ] [Contact]    [EN|ES] [Get Started]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Hero Section                                                    │
│  "Your Trusted Austin Realtor"                                   │
│  [Ready to Buy]  [Ready to Sell]                                 │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Trust Section (Stats)                                           │
│  150+ Homes | $15M+ Sales | 95% Satisfaction | 5.0 Rating        │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  About Section                                                   │
│  [Photo] "Hi, I'm Sully..." [Work With Me →]                    │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  How It Works                                                    │
│  1. Schedule  2. Strategy  3. Search  4. Close                   │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Services                                                        │
│  ┌─────────────────┐  ┌─────────────────┐                       │
│  │  Buying a Home  │  │  Selling Home   │                       │
│  │  [Get Started]  │  │  [Get Started]  │                       │
│  └─────────────────┘  └─────────────────┘                       │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Lifestyle Gallery                                               │
│  [Austin lifestyle images grid]                                  │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Lead Magnet                                                     │
│  [Guide Preview]  [First Name] [Email] [Download]                │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Testimonials                                                    │
│  "Great experience..." - Maria G.                                │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  FAQ                                                             │
│  ▶ How long does buying take?                                    │
│  ▶ What are closing costs?                                       │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Footer                                                          │
│  Contact | Social | Legal                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  ChatWizard (Modal Overlay)                                      │
│  [Conversational lead capture form]                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Sections

### 1. Navbar

**File:** `src/components/navbar.tsx`

| Element | Action |
|---------|--------|
| Logo | Scroll to top |
| Services | Scroll to services section |
| About | Scroll to about section |
| FAQ | Scroll to FAQ section |
| Contact | Scroll to footer |
| Language Switcher | Toggle EN/ES |
| Get Started | Opens ChatWizard (source: `navbar`) |

### 2. Hero

**File:** `src/components/hero.tsx`

The hero section includes:
- Background image/gradient
- Main headline and subheadline
- Two CTA buttons

| CTA | Flow | CTA Source |
|-----|------|------------|
| Ready to Buy | `buy` | `hero_buy` |
| Ready to Sell | `sell` | `hero_sell` |

### 3. TrustSection

**File:** `src/components/trust-section.tsx`

Displays credibility metrics:

| Stat | Value |
|------|-------|
| Homes Sold | 150+ |
| Total Sales | $15M+ |
| Client Satisfaction | 95% |
| Google Rating | 5.0 (150 reviews) |

### 4. About

**File:** `src/components/about.tsx`

| Element | Purpose |
|---------|---------|
| Photo | Professional headshot |
| Bio | Personal introduction |
| Work With Me CTA | Opens ChatWizard (source: `about`) |

### 5. HowItWorks

**File:** `src/components/how-it-works.tsx`

Four-step process visualization:

1. **Schedule** - Book your free consultation
2. **Strategy** - Create your personalized plan
3. **Search** - Find your perfect home
4. **Close** - Complete your purchase

### 6. Services

**File:** `src/components/services.tsx`

Two service cards with CTAs:

| Service | CTA | Flow | CTA Source |
|---------|-----|------|------------|
| Buying a Home | Get Started | `buy` | `services_buy` |
| Selling Your Home | Get Started | `sell` | `services_sell` |

### 7. LifestyleGallery

**File:** `src/components/lifestyle-gallery.tsx`

Grid of Austin lifestyle images showcasing:
- Local neighborhoods
- Community events
- Home interiors
- Outdoor activities

### 8. LeadMagnet

**File:** `src/components/lead-magnet.tsx`

Email capture form for guide downloads. See [Lead Capture](../features/lead-capture.md) for details.

### 9. Testimonials

**File:** `src/components/testimonials.tsx`

Client success stories with:
- Quote text
- Client name
- Optional photo
- Star rating

### 10. FAQ

**File:** `src/components/faq.tsx`

Accordion-style frequently asked questions covering:
- Buying process timeline
- Financing options
- Closing costs
- First-time buyer programs
- Selling timeline
- Home preparation

### 11. Footer

**File:** `src/components/footer.tsx`

Contains:
- Contact information
- Social media links
- Legal links (Privacy, Terms)
- License information
- Copyright

---

## State Management

The landing page manages two pieces of state:

```tsx
const [isChatOpen, setIsChatOpen] = useState(false)
const [initialFlow, setInitialFlow] = useState<'buy' | 'sell' | null>(null)
```

### Opening ChatWizard

```tsx
const openChat = (flow: 'buy' | 'sell' | null, source: CTASource) => {
  setCTASource(source)
  setInitialFlow(flow)
  setIsChatOpen(true)
  trackCTAClick({ cta_source: source, flow })
  trackWizardOpen({ cta_source: source })
}
```

### CTA Handlers

```tsx
// Hero buttons
<Button onClick={() => openChat('buy', 'hero_buy')}>Ready to Buy</Button>
<Button onClick={() => openChat('sell', 'hero_sell')}>Ready to Sell</Button>

// About button
<Button onClick={() => openChat(null, 'about')}>Work With Me</Button>

// Services buttons
<Button onClick={() => openChat('buy', 'services_buy')}>Get Started</Button>
<Button onClick={() => openChat('sell', 'services_sell')}>Get Started</Button>

// Navbar button
<Button onClick={() => openChat(null, 'navbar')}>Get Started</Button>
```

---

## Analytics Initialization

On page mount, the following analytics are initialized:

```tsx
useEffect(() => {
  // Capture UTM parameters from URL
  captureUTMParams()

  // Set user properties
  setUserProperties({
    user_locale: locale,
    user_type: isReturningUser() ? 'returning' : 'new'
  })

  // Initialize scroll depth tracking
  const cleanup = initScrollTracking()

  return cleanup
}, [locale])
```

### Scroll Depth Tracking

Tracks when users scroll to:
- 25% of page
- 50% of page
- 75% of page
- 90% of page

---

## Metadata

**File:** `src/app/[locale]/layout.tsx`

```tsx
export const metadata: Metadata = {
  title: 'Sully Ruiz | Austin Real Estate Agent',
  description: 'Your trusted Austin realtor helping buyers and sellers...',
  openGraph: {
    title: 'Sully Ruiz | Austin Real Estate Agent',
    description: '...',
    images: ['/opengraph-image'],
    locale: 'en_US',
    alternateLocale: 'es_MX'
  }
}
```

---

## Structured Data

**File:** `src/components/structured-data.tsx`

JSON-LD schemas included:

### RealEstateAgent Schema

```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Sully Ruiz",
  "description": "...",
  "telephone": "(512) 412-2352",
  "email": "realtor@sullyruiz.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "9606 N Mopac Expy, Ste 950",
    "addressLocality": "Austin",
    "addressRegion": "TX",
    "postalCode": "78759"
  },
  "areaServed": ["Austin", "Round Rock", "Cedar Park", "Georgetown", "Pflugerville", "Hutto"]
}
```

### LocalBusiness Schema

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Sully Ruiz - Keller Williams Austin NW",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "150"
  }
}
```

---

## Responsive Design

The landing page uses Tailwind CSS breakpoints:

| Breakpoint | Width | Adjustments |
|------------|-------|-------------|
| Mobile | < 640px | Single column, stacked CTAs |
| Tablet | 640-1024px | Two columns for services |
| Desktop | > 1024px | Full layout, side-by-side sections |

---

## Performance Optimizations

### Image Loading

- Hero image: Eager loading (above fold)
- Gallery images: Lazy loading with blur placeholder
- Next.js Image component for automatic optimization

### Code Splitting

- ChatWizard loaded on demand (only when opened)
- FAQ accordion items rendered on expand

### Animation

- Framer Motion for scroll-triggered animations
- `whileInView` for lazy animation triggering
- Reduced motion support via `prefers-reduced-motion`

---

## Related Documentation

- [Lead Capture](../features/lead-capture.md) - ChatWizard and LeadMagnet details
- [Analytics](../features/analytics.md) - All tracked events
- [Routing & i18n](../architecture/routing-and-i18n.md) - Localization
