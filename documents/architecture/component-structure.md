# Component Structure

This document covers the component organization patterns used in sullyruiz.com.

---

## Directory Structure

```
src/
├── components/
│   ├── ui/                    # Radix UI primitives (shadcn/ui pattern)
│   │   ├── accordion.tsx
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   └── textarea.tsx
│   │
│   ├── consult/               # Consult page components
│   │   ├── index.ts           # Barrel export
│   │   ├── video-hero.tsx
│   │   ├── consult-stories.tsx
│   │   ├── consult-problem.tsx
│   │   ├── consult-solution.tsx
│   │   ├── consult-deliverables.tsx
│   │   ├── consult-form.tsx
│   │   └── consult-footer.tsx
│   │
│   ├── hero.tsx               # Landing page hero section
│   ├── navbar.tsx             # Navigation header
│   ├── footer.tsx             # Site footer
│   ├── about.tsx              # About section
│   ├── services.tsx           # Services cards
│   ├── how-it-works.tsx       # Process steps
│   ├── trust-section.tsx      # Stats/credibility
│   ├── testimonials.tsx       # Client testimonials
│   ├── faq.tsx                # FAQ accordion
│   ├── lifestyle-gallery.tsx  # Image gallery
│   ├── lead-magnet.tsx        # Email capture form
│   ├── chat-wizard.tsx        # Modal lead capture
│   ├── screening-wizard.tsx   # Qualification quiz
│   ├── toast-provider.tsx     # Toast notifications
│   └── structured-data.tsx    # JSON-LD schemas
│
├── app/
│   ├── [locale]/
│   │   ├── page.tsx           # Landing page (composes sections)
│   │   ├── layout.tsx         # Locale layout
│   │   ├── consult/
│   │   │   ├── page.tsx       # Consult page
│   │   │   └── layout.tsx     # Consult metadata
│   │   ├── screening/
│   │   │   └── page.tsx       # Screening wizard page
│   │   └── ...
│   └── api/
│       └── ...                # API routes
│
└── lib/
    ├── utils.ts               # General utilities (cn function)
    ├── session.ts             # Session management
    ├── utm.ts                 # UTM tracking
    ├── validation.ts          # Form validation
    ├── analytics.ts           # GA4 events
    └── seo-config.ts          # SEO/business config
```

---

## Component Patterns

### UI Components (shadcn/ui)

Located in `src/components/ui/`, these are Radix UI primitives styled with Tailwind CSS.

**Pattern:**
```tsx
// src/components/ui/button.tsx
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium...',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground...',
        outline: 'border border-input...',
        ghost: 'hover:bg-accent...',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
```

**Usage:**
```tsx
<Button variant="outline" size="lg">Click Me</Button>
```

---

### Section Components

Landing page sections are self-contained components with their own styling and logic.

**Pattern:**
```tsx
// src/components/hero.tsx
'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

interface HeroProps {
  onBuyClick: () => void
  onSellClick: () => void
}

export function Hero({ onBuyClick, onSellClick }: HeroProps) {
  const t = useTranslations('hero')

  return (
    <section id="hero" className="relative min-h-screen...">
      <div className="container mx-auto px-4...">
        <h1 className="text-4xl md:text-6xl font-bold...">
          {t('title')}
        </h1>
        <p className="text-lg md:text-xl...">
          {t('subtitle')}
        </p>
        <div className="flex gap-4">
          <Button onClick={onBuyClick} size="lg">
            {t('buyButton')}
          </Button>
          <Button onClick={onSellClick} variant="outline" size="lg">
            {t('sellButton')}
          </Button>
        </div>
      </div>
    </section>
  )
}
```

**Usage in Page:**
```tsx
// src/app/[locale]/page.tsx
<Hero
  onBuyClick={() => openChat('buy', 'hero_buy')}
  onSellClick={() => openChat('sell', 'hero_sell')}
/>
```

---

### Feature-Grouped Components

Complex features are grouped in subdirectories with barrel exports.

**Pattern:**
```
src/components/consult/
├── index.ts                    # Barrel export
├── video-hero.tsx
├── consult-form.tsx
└── ...
```

**Barrel Export:**
```tsx
// src/components/consult/index.ts
export { VideoHero } from './video-hero'
export { ConsultForm } from './consult-form'
export { ConsultStories } from './consult-stories'
export { ConsultProblem } from './consult-problem'
export { ConsultSolution } from './consult-solution'
export { ConsultDeliverables } from './consult-deliverables'
export { ConsultFooter } from './consult-footer'
```

**Usage:**
```tsx
import {
  VideoHero,
  ConsultForm,
  ConsultStories
} from '@/components/consult'
```

---

### Form Components

Complex forms like ChatWizard and ConsultForm follow a pattern with:
- Internal state management
- Validation hooks
- Submission handlers
- Success/error states

**Pattern:**
```tsx
// Simplified form component pattern
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { validateEmail, validatePhone } from '@/lib/validation'

interface FormData {
  name: string
  email: string
  phone: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
}

export function ExampleForm() {
  const t = useTranslations('form')

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
  })

  // Validation state
  const [errors, setErrors] = useState<FormErrors>({})

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Validation
  const validateField = (field: keyof FormData, value: string) => {
    switch (field) {
      case 'email':
        return validateEmail(value)
      case 'phone':
        return validatePhone(value)
      default:
        return { valid: value.length >= 2 }
    }
  }

  // Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const newErrors: FormErrors = {}
    // ... validation logic

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSuccess(true)
      }
    } catch (error) {
      setErrors({ email: t('errors.network') })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success state
  if (isSuccess) {
    return <SuccessScreen />
  }

  // Form state
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

---

## Component Types

### Client Components

Components that need interactivity use the `'use client'` directive:

```tsx
'use client'

import { useState } from 'react'

export function InteractiveComponent() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

**When to use:**
- User interactions (clicks, inputs)
- Browser APIs (localStorage, window)
- React hooks (useState, useEffect)
- Event handlers

### Server Components

Components without the directive are server components by default:

```tsx
import { getTranslations } from 'next-intl/server'

export async function ServerComponent() {
  const t = await getTranslations('section')
  return <h1>{t('title')}</h1>
}
```

**When to use:**
- Static content
- Data fetching
- SEO-critical content

---

## Styling Patterns

### Tailwind CSS Classes

Direct utility classes for component styling:

```tsx
<div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-gray-900">Title</h2>
  <p className="text-gray-600">Description</p>
</div>
```

### Class Variance Authority (CVA)

For components with variants:

```tsx
import { cva } from 'class-variance-authority'

const cardVariants = cva(
  'rounded-lg p-6',
  {
    variants: {
      variant: {
        default: 'bg-white shadow-md',
        outline: 'border-2 border-gray-200',
        ghost: 'bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)
```

### cn Utility

Merge classes conditionally:

```tsx
import { cn } from '@/lib/utils'

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  className
)}>
```

---

## Animation Patterns

### Framer Motion

Used for scroll-triggered animations:

```tsx
import { motion } from 'framer-motion'

export function AnimatedSection({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}
```

### Animation Variants

Reusable animation configurations:

```tsx
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}
```

---

## Import Conventions

### Path Aliases

Use `@/` for absolute imports from `src/`:

```tsx
// Good
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Avoid
import { Button } from '../../../components/ui/button'
```

### Import Order

1. React/Next.js imports
2. Third-party imports
3. Local imports (components, lib, types)
4. Styles (if any)

```tsx
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { LeadData } from '@/types'
```

---

## Related Documentation

- [Landing Page](../pages/landing-page.md) - Section component usage
- [Consult Page](../pages/consult-page.md) - Consult component usage
- [Lead Capture](../features/lead-capture.md) - Form component details
