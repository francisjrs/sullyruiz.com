# Translation Keys

This document covers the i18n message structure and how to work with translations.

---

## Overview

Translations are stored in JSON files:
- `messages/en.json` - English (default)
- `messages/es.json` - Spanish

---

## Message Structure

### Top-Level Namespaces

```json
{
  "common": {},      // Shared UI elements
  "nav": {},         // Navigation
  "hero": {},        // Hero section
  "trust": {},       // Trust/stats section
  "about": {},       // About section
  "howItWorks": {},  // How it works section
  "services": {},    // Services section
  "leadMagnet": {},  // Lead magnet section
  "testimonials": {},// Testimonials section
  "faq": {},         // FAQ section
  "footer": {},      // Footer
  "chatWizard": {},  // Chat wizard modal
  "consult": {},     // Consult page
  "screening": {},   // Screening page
  "legal": {},       // Legal pages
  "validation": {},  // Form validation messages
  "metadata": {}     // SEO metadata
}
```

---

## Common Namespace

Shared UI elements used across components:

```json
{
  "common": {
    "getStarted": "Get Started",
    "learnMore": "Learn More",
    "contactUs": "Contact Us",
    "submit": "Submit",
    "cancel": "Cancel",
    "close": "Close",
    "next": "Next",
    "back": "Back",
    "loading": "Loading...",
    "success": "Success!",
    "error": "Error",
    "required": "Required"
  }
}
```

---

## Hero Section

```json
{
  "hero": {
    "title": "Your Trusted Austin Realtor",
    "subtitle": "Whether you're buying your first home or selling to move up, I'll guide you every step of the way.",
    "buyButton": "Ready to Buy",
    "sellButton": "Ready to Sell",
    "tagline": "Helping families find their perfect home since 2018"
  }
}
```

---

## Services Section

```json
{
  "services": {
    "title": "How Can I Help You?",
    "buy": {
      "title": "Buying a Home",
      "description": "From search to closing, I'll help you find the perfect home.",
      "features": [
        "Personalized home search",
        "Negotiation expertise",
        "Closing coordination"
      ],
      "cta": "Start Your Search"
    },
    "sell": {
      "title": "Selling Your Home",
      "description": "Get top dollar for your home with my proven marketing strategy.",
      "features": [
        "Professional staging advice",
        "Strategic pricing",
        "Maximum exposure"
      ],
      "cta": "Get Your Home Value"
    }
  }
}
```

---

## Chat Wizard

```json
{
  "chatWizard": {
    "welcome": {
      "greeting": "Hi! I'm Sully.",
      "question": "Are you looking to buy or sell?",
      "buy": "Buy a Home",
      "sell": "Sell My Home"
    },
    "propertyType": {
      "question": "What type of property are you looking for?",
      "options": {
        "house": "House",
        "townhouse": "Townhouse",
        "condo": "Condo",
        "multifamily": "Multi-family",
        "land": "Land",
        "other": "Other"
      }
    },
    "area": {
      "question": "Which area are you interested in?",
      "options": {
        "austin": "Austin",
        "roundRock": "Round Rock",
        "cedarPark": "Cedar Park",
        "georgetown": "Georgetown",
        "pflugerville": "Pflugerville",
        "hutto": "Hutto",
        "other": "Other"
      }
    },
    "budget": {
      "question": "What's your budget range?",
      "options": {
        "under300k": "Under $300K",
        "300k400k": "$300K - $400K",
        "400k500k": "$400K - $500K",
        "500k700k": "$500K - $700K",
        "700k1m": "$700K - $1M",
        "over1m": "Over $1M"
      }
    },
    "timeline": {
      "question": "When are you looking to move?",
      "options": {
        "asap": "As soon as possible",
        "1to3": "1-3 months",
        "3to6": "3-6 months",
        "6plus": "6+ months",
        "exploring": "Just exploring"
      }
    },
    "contact": {
      "name": {
        "question": "What's your name?",
        "placeholder": "Your name"
      },
      "phone": {
        "question": "What's your phone number? (optional)",
        "placeholder": "(512) 555-1234"
      },
      "email": {
        "question": "What's your email address?",
        "placeholder": "you@example.com"
      }
    },
    "success": {
      "title": "Thank You!",
      "message": "I've received your information and will be in touch soon.",
      "close": "Close"
    },
    "errors": {
      "invalidEmail": "Please enter a valid email address",
      "invalidPhone": "Please enter a valid phone number",
      "invalidName": "Please enter your name (at least 2 characters)",
      "required": "This field is required"
    }
  }
}
```

---

## Consult Page

```json
{
  "consult": {
    "metadata": {
      "title": "Free Homebuyer Consultation | Sully Ruiz",
      "description": "Schedule your free consultation with Sully Ruiz."
    },
    "hero": {
      "title": "Get Your Free Consultation",
      "subtitle": "Let's discuss your real estate goals",
      "cta": "Book Now"
    },
    "form": {
      "title": "Request Your Consultation",
      "fields": {
        "name": "Full Name",
        "phone": "Phone Number",
        "email": "Email Address",
        "language": "Preferred Language",
        "timeline": "When are you looking to buy?",
        "incomeType": "How do you receive income?",
        "bankStatus": "Pre-approval status?",
        "downPayment": "Down payment available?",
        "area": "Preferred area?",
        "source": "How did you hear about us?",
        "notes": "Anything else you'd like to share?"
      },
      "submit": "Request Consultation"
    },
    "success": {
      "title": "Request Received!",
      "message": "Thank you! We'll contact you within 24 hours.",
      "emailSent": "Confirmation email sent",
      "whatsappSent": "WhatsApp message sent",
      "agentNotified": "Agent notified",
      "nextSteps": "Next Steps"
    }
  }
}
```

---

## Validation Messages

```json
{
  "validation": {
    "email": {
      "required": "Email is required",
      "invalid": "Please enter a valid email address"
    },
    "phone": {
      "required": "Phone number is required",
      "invalid": "Please enter a valid phone number"
    },
    "name": {
      "required": "Name is required",
      "minLength": "Name must be at least 2 characters"
    },
    "select": {
      "required": "Please select an option"
    }
  }
}
```

---

## Using Translations

### In Server Components

```tsx
import { getTranslations } from 'next-intl/server'

export default async function Page() {
  const t = await getTranslations('hero')

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
    </div>
  )
}
```

### In Client Components

```tsx
'use client'
import { useTranslations } from 'next-intl'

export default function Hero() {
  const t = useTranslations('hero')

  return (
    <button>{t('buyButton')}</button>
  )
}
```

### Nested Keys

```tsx
// Access nested values
t('services.buy.title')      // "Buying a Home"
t('services.buy.features.0') // First feature item
```

### With Variables

```json
{
  "greeting": "Hello, {name}!"
}
```

```tsx
t('greeting', { name: 'Sully' }) // "Hello, Sully!"
```

### Pluralization

```json
{
  "items": "{count, plural, =0 {No items} =1 {1 item} other {# items}}"
}
```

```tsx
t('items', { count: 5 }) // "5 items"
```

---

## Adding New Translations

### 1. Add Key to Both Files

```json
// messages/en.json
{
  "newSection": {
    "title": "New Section Title"
  }
}

// messages/es.json
{
  "newSection": {
    "title": "Título de Nueva Sección"
  }
}
```

### 2. Use in Component

```tsx
const t = useTranslations('newSection')
return <h2>{t('title')}</h2>
```

### 3. Test Both Locales

- Visit `/` (English)
- Visit `/es` (Spanish)

---

## Translation Workflow

### For Developers

1. Add English text first
2. Use descriptive key names
3. Group related keys
4. Add to both files (can use placeholder for Spanish)

### For Translators

1. Copy `en.json` structure
2. Translate values only
3. Keep same key structure
4. Preserve ICU message syntax

### Validation

Ensure both files have matching structure:

```bash
# Simple diff check
diff <(jq 'keys' messages/en.json) <(jq 'keys' messages/es.json)
```

---

## Best Practices

### Naming Conventions

- Use camelCase for keys: `buyButton`, `errorMessage`
- Group by feature/page: `chatWizard.welcome.greeting`
- Be descriptive: `submitButton` not `btn1`

### Content Guidelines

- Keep text user-friendly
- Avoid technical jargon
- Consider text expansion (Spanish ~30% longer)
- Use placeholders for dynamic content

### Maintenance

- Keep translations in sync
- Review periodically for accuracy
- Update after content changes

---

## Related Documentation

- [Routing & i18n](../architecture/routing-and-i18n.md) - i18n configuration
- [Component Structure](../architecture/component-structure.md) - Using translations
