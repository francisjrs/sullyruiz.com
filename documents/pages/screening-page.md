# Screening Page

The pre-qualification wizard at `/screening` (both locales).

**File:** `src/app/[locale]/screening/page.tsx`
**Component:** `src/components/screening-wizard.tsx`

---

## Overview

The screening page is a multi-step qualification questionnaire that:
- Collects detailed buyer information
- Calculates a lead score
- Supports form prefill via session ID

---

## Page Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  Screening Wizard                                                │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Progress Bar                                              │  │
│  │  [====•---------------] Step 2 of 7                        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  Question                                                  │  │
│  │  "Do you have pre-approval from a lender?"                 │  │
│  │                                                            │  │
│  │  ○ Yes, I'm pre-approved                                   │  │
│  │  ○ I'm working on it                                       │  │
│  │  ○ No, I haven't started                                   │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  [← Back]                               [Next →]           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Wizard Steps

The wizard consists of 7 main sections with 19 total questions.

### Step 1: Contact Information

| Field | Type | Required |
|-------|------|----------|
| Email | Text | Yes |
| Phone | Text | No |
| Full Name | Text | Yes |

### Step 2: Pre-Approval Status

| Field | Options |
|-------|---------|
| Has Pre-approval | Yes / Working on it / No |

### Step 3: Income & Employment

| Field | Options/Type |
|-------|--------------|
| Immigration Status | Citizen, Permanent Resident, Visa, ITIN, Other |
| Monthly Income | Text (number) |
| Monthly Debt | Text (number) |
| Payment Type | W2, 1099, Cash, Other |
| Employment Type | Full-time, Part-time, Self-employed, Contractor |

### Step 4: Credit Profile

| Field | Options |
|-------|---------|
| Credit Score | 800+, 740-799, 700-739, 640-699, 600-639, Below 600, Unknown |
| Has Auto Loan | Yes / No |
| Has Credit Cards | Yes / No |

### Step 5: Savings & Finances

| Field | Options |
|-------|---------|
| Tax Years Filed | 0, 1, 2, 3+ |
| Down Payment | $0-5K, $5K-10K, $10K-20K, $20K-50K, $50K+, Unknown |
| Savings Location | Checking, Savings, Investment, Gift, Other |

### Step 6: Timeline & Move

| Field | Options/Type |
|-------|--------------|
| Lease End Date | Date picker |
| Move Date | ASAP, 1-3 months, 3-6 months, 6-12 months, 12+ months |

### Step 7: Property & Additional

| Field | Options |
|-------|---------|
| Property Type | Single Family, Townhouse, Condo, Multi-family |
| Is Homeowner | Yes / No |
| Will Sell Home | Yes / No / Not Applicable |
| Buying With | Alone, Spouse, Partner, Family, Other |
| Military Service | Active, Veteran, Spouse, None |
| Additional Info | Textarea |

---

## Prefill Mechanism

### URL Parameter

The screening page accepts a `session_id` query parameter:

```
https://sullyruiz.com/screening?session_id=550e8400-e29b-41d4-a716-446655440000
```

### Prefill Flow

```
Page loads with ?session_id=xxx
           │
           ▼
Suspense boundary shows loading
           │
           ▼
GET /api/screening/prefill?session_id=xxx
           │
           ▼
n8n lookup returns { email, phone, name }
           │
           ▼
Form initialized with prefilled values
           │
           ▼
User continues from Step 1 with data pre-filled
```

### Implementation

```tsx
// src/app/[locale]/screening/page.tsx
import { Suspense } from 'react'
import { ScreeningWizard } from '@/components/screening-wizard'

export default function ScreeningPage({
  searchParams
}: {
  searchParams: { session_id?: string }
}) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ScreeningWizardWithPrefill sessionId={searchParams.session_id} />
    </Suspense>
  )
}

async function ScreeningWizardWithPrefill({
  sessionId
}: {
  sessionId?: string
}) {
  let prefillData = { email: '', phone: '', name: '' }

  if (sessionId) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/screening/prefill?session_id=${sessionId}`
      )
      if (response.ok) {
        prefillData = await response.json()
      }
    } catch (error) {
      // Graceful degradation - use empty prefill
    }
  }

  return <ScreeningWizard prefillData={prefillData} sessionId={sessionId} />
}
```

---

## Lead Scoring

The screening submission calculates a lead score (0-100).

### Scoring Algorithm

| Factor | Condition | Points |
|--------|-----------|--------|
| Pre-approval | Yes | +35 |
| Credit Score | 700+ | +30 |
| Credit Score | 640-699 | +20 |
| Credit Score | 600-639 | +10 |
| Timeline | ASAP | +25 |
| Timeline | 1-3 months | +15 |
| Timeline | 3-6 months | +10 |
| Timeline | 6+ months | +5 |
| Down Payment | $20K+ | +15 |
| Down Payment | $10K-$20K | +10 |
| Down Payment | $5K-$10K | +5 |
| Tax History | 2+ years | +10 |
| Employment | W2 | +5 |

### Tier Classification

| Tier | Score | Description |
|------|-------|-------------|
| Hot | 80-100 | Ready to buy, pre-approved, strong financials |
| Warm | 50-79 | Interested, needs some preparation |
| Developing | 25-49 | Early stage, needs work |
| Cold | 0-24 | Long timeline or major obstacles |

---

## State Management

### Wizard State

```typescript
interface WizardState {
  currentStep: number
  screening: ScreeningData
  errors: Record<string, string>
  isSubmitting: boolean
  isComplete: boolean
}
```

### Navigation

```typescript
const goToNextStep = () => {
  if (validateCurrentStep()) {
    setCurrentStep(step => step + 1)
  }
}

const goToPreviousStep = () => {
  setCurrentStep(step => Math.max(1, step - 1))
}
```

### Validation Per Step

Each step validates its fields before allowing progression:

```typescript
const validateStep = (step: number): boolean => {
  switch (step) {
    case 1:
      return validateEmail(screening.email).valid &&
             validateName(screening.fullName).valid
    case 2:
      return !!screening.hasPreapproval
    // ... more steps
  }
}
```

---

## Submission Flow

```
User completes all steps
           │
           ▼
Final validation
           │
           ├── Invalid: Show errors, stay on step
           │
           ▼
POST /api/screening
{
  session_id,
  locale,
  screening: { ...all 19 fields }
}
           │
           ▼
Server calculates lead_score, lead_tier
           │
           ▼
Forward to N8N_SCREENING_WEBHOOK_URL (async)
           │
           ▼
Return { success, lead_score, lead_tier }
           │
           ▼
Show success screen
```

---

## Success Screen

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ✓ Pre-Qualification Complete!                                   │
│                                                                  │
│  Thank you for completing the questionnaire.                     │
│  Sully will review your information and contact you soon.        │
│                                                                  │
│  Your Readiness Score: 85/100                                    │
│  Status: Hot Lead 🔥                                             │
│                                                                  │
│  What happens next:                                              │
│  1. Sully will review your information                           │
│  2. You'll receive a call within 24-48 hours                     │
│  3. Together, you'll create a personalized plan                  │
│                                                                  │
│  [Return to Homepage]                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Structure

```
ScreeningWizard
├── ProgressBar
│   └── Step indicators with completion status
├── StepContent
│   ├── Step1Contact
│   ├── Step2Preapproval
│   ├── Step3Income
│   ├── Step4Credit
│   ├── Step5Savings
│   ├── Step6Timeline
│   └── Step7Additional
├── NavigationButtons
│   ├── Back button (hidden on step 1)
│   └── Next/Submit button
└── SuccessScreen (after completion)
```

---

## Accessibility

### Keyboard Navigation

- Tab through form fields
- Enter to select radio options
- Arrow keys for option navigation

### Screen Reader Support

- Step progress announced
- Field labels properly associated
- Error messages linked to fields

### Focus Management

- Focus moves to first field on step change
- Focus moves to error message on validation failure

---

## Analytics Events

| Event | Trigger |
|-------|---------|
| `screening_start` | First field interaction |
| `screening_step` | Step completion |
| `screening_complete` | Successful submission |
| `screening_abandon` | Page exit before completion |

---

## URL Handling

### Routes

- English: `/screening`
- Spanish: `/es/screening`

### Query Parameters

| Parameter | Purpose |
|-----------|---------|
| `session_id` | Prefill form with existing lead data |

---

## Related Documentation

- [API: Screening Endpoint](../api/screening-endpoint.md) - API specification
- [Lead Scoring](../reference/lead-scoring.md) - Scoring algorithm details
- [Session Management](../features/session-management.md) - Session tracking
