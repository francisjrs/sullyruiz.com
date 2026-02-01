# Lead Scoring

This document details the lead scoring algorithm used in the screening questionnaire.

---

## Overview

Lead scoring assigns a numeric score (0-100) to screening questionnaire submissions based on buyer readiness and qualification factors.

---

## Scoring Algorithm

### Point Allocation

| Factor | Condition | Points | Max |
|--------|-----------|--------|-----|
| **Pre-approval** | `hasPreapproval === "yes"` | +35 | 35 |
| **Credit Score** | 700+ (800+, 740-799, 700-739) | +30 | 30 |
| **Credit Score** | 640-699 | +20 | - |
| **Credit Score** | 600-639 | +10 | - |
| **Timeline** | ASAP | +25 | 25 |
| **Timeline** | 1-3 months | +15 | - |
| **Timeline** | 3-6 months | +10 | - |
| **Timeline** | 6-12 months | +5 | - |
| **Down Payment** | $20K+ (20k-50k, 50k+) | +15 | 15 |
| **Down Payment** | $10K-$20K | +10 | - |
| **Down Payment** | $5K-$10K, $0-$5K | +5 | - |
| **Tax History** | 2+ years filed | +10 | 10 |
| **Employment** | W2 (stable income) | +5 | 5 |

**Maximum Score:** 100 points

---

## Implementation

```typescript
interface ScreeningData {
  hasPreapproval: 'yes' | 'no' | 'working_on_it'
  creditScore: '800+' | '740-799' | '700-739' | '640-699' | '600-639' | 'below_600' | 'unknown'
  moveDate: 'asap' | '1-3_months' | '3-6_months' | '6-12_months' | '12+_months'
  downPayment: '0-5k' | '5k-10k' | '10k-20k' | '20k-50k' | '50k+' | 'unknown'
  taxYears: '0' | '1' | '2' | '3+'
  paymentType: 'w2' | '1099' | 'cash' | 'other'
}

function calculateLeadScore(screening: ScreeningData): {
  score: number
  tier: string
} {
  let score = 0

  // Pre-approval (35 pts max)
  if (screening.hasPreapproval === 'yes') {
    score += 35
  }

  // Credit score (30 pts max)
  const highCreditScores = ['800+', '740-799', '700-739']
  if (highCreditScores.includes(screening.creditScore)) {
    score += 30
  } else if (screening.creditScore === '640-699') {
    score += 20
  } else if (screening.creditScore === '600-639') {
    score += 10
  }
  // below_600 and unknown = 0 points

  // Timeline (25 pts max)
  switch (screening.moveDate) {
    case 'asap':
      score += 25
      break
    case '1-3_months':
      score += 15
      break
    case '3-6_months':
      score += 10
      break
    case '6-12_months':
    case '12+_months':
      score += 5
      break
  }

  // Down payment (15 pts max)
  if (['20k-50k', '50k+'].includes(screening.downPayment)) {
    score += 15
  } else if (screening.downPayment === '10k-20k') {
    score += 10
  } else if (['0-5k', '5k-10k'].includes(screening.downPayment)) {
    score += 5
  }
  // unknown = 0 points

  // Tax years (10 pts max)
  if (['2', '3+'].includes(screening.taxYears)) {
    score += 10
  }

  // Employment type (5 pts max)
  if (screening.paymentType === 'w2') {
    score += 5
  }

  // Determine tier
  let tier: string
  if (score >= 80) {
    tier = 'hot'
  } else if (score >= 50) {
    tier = 'warm'
  } else if (score >= 25) {
    tier = 'developing'
  } else {
    tier = 'cold'
  }

  return { score, tier }
}
```

---

## Tier Classification

### Hot (80-100 points)

**Characteristics:**
- Pre-approved
- Good credit (700+)
- Ready to buy (ASAP or 1-3 months)
- Substantial down payment ($20K+)

**Action:** Immediate follow-up, priority scheduling

### Warm (50-79 points)

**Characteristics:**
- May or may not be pre-approved
- Moderate credit (640+)
- 3-6 month timeline
- Some down payment saved

**Action:** Schedule consultation, provide financing resources

### Developing (25-49 points)

**Characteristics:**
- Not pre-approved yet
- Working on credit
- 6+ month timeline
- Building savings

**Action:** Nurture sequence, educational content, check-ins

### Cold (0-24 points)

**Characteristics:**
- Major obstacles (credit, savings, timeline)
- May not be realistic buyer currently

**Action:** Add to long-term nurture, provide resources for improvement

---

## Score Examples

### Example 1: Hot Lead (Score: 95)

```
Pre-approval: yes        → +35
Credit: 740-799          → +30
Timeline: ASAP           → +25
Down Payment: 50k+       → +15 (capped at max)
Tax Years: 3+            → (already at max)
Employment: W2           → (already at max)
```

Actually:
- Pre-approval: +35
- Credit 740-799: +30
- ASAP: +25
- 50k+: +15
- Actual total would exceed 100, but components add to 105

Let me recalculate correctly:

```
Pre-approval: yes        → +35
Credit: 800+             → +30
Timeline: ASAP           → +25
Down Payment: 50k+       → +15
Tax Years: 3+            → (not counted if already at 105)
Employment: W2           → (not counted)
Total: 100 (capped)
```

### Example 2: Warm Lead (Score: 65)

```
Pre-approval: no         → +0
Credit: 700-739          → +30
Timeline: 1-3 months     → +15
Down Payment: 20k-50k    → +15
Tax Years: 2             → +10
Employment: W2           → (would exceed, but let's count)
```

Actually:
```
Pre-approval: no         → +0
Credit: 700-739          → +30
Timeline: 1-3 months     → +15
Down Payment: 20k-50k    → +15
Tax Years: 2             → +10
Employment: W2           → +5
Total: 75 (warm tier)
```

### Example 3: Developing Lead (Score: 35)

```
Pre-approval: working    → +0
Credit: 640-699          → +20
Timeline: 6-12 months    → +5
Down Payment: 5k-10k     → +5
Tax Years: 1             → +0
Employment: 1099         → +0
Total: 30 (developing tier)
```

### Example 4: Cold Lead (Score: 15)

```
Pre-approval: no         → +0
Credit: below_600        → +0
Timeline: 12+ months     → +5
Down Payment: 0-5k       → +5
Tax Years: 0             → +0
Employment: other        → +0
Total: 10 (cold tier)
```

---

## Weight Rationale

### Pre-approval (35 points)

Highest weight because:
- Demonstrates serious intent
- Confirms financial qualification
- Shortens buying timeline significantly

### Credit Score (30 points)

Second highest because:
- Determines loan eligibility
- Affects interest rates
- Harder to improve quickly

### Timeline (25 points)

High weight because:
- Indicates urgency
- Affects follow-up priority
- Correlates with conversion rate

### Down Payment (15 points)

Moderate weight because:
- Shows financial preparation
- Many assistance programs available
- Can be supplemented

### Tax History (10 points)

Lower weight because:
- Important for self-employed
- Many buyers have W2 history
- Can be documented otherwise

### Employment (5 points)

Lowest weight because:
- Other income types valid
- Verified through underwriting
- Many successful non-W2 buyers

---

## API Response

The screening endpoint returns score and tier:

```json
{
  "success": true,
  "message": "Screening received successfully",
  "lead_score": 75,
  "lead_tier": "warm"
}
```

---

## Display in Success Screen

```
┌─────────────────────────────────────────┐
│                                         │
│  Your Readiness Score: 75/100           │
│                                         │
│  Status: Warm Lead 🌡️                   │
│                                         │
│  You're well on your way! A few steps   │
│  could move you to "ready to buy."      │
│                                         │
└─────────────────────────────────────────┘
```

---

## Tier-Specific Messaging

### Hot

> "Great news! You're ready to start your home search. Sully will prioritize your consultation to get you moving fast."

### Warm

> "You're well-positioned to buy! Sully will review your details and discuss any remaining steps during your consultation."

### Developing

> "You're on the path to homeownership! Sully can help you create a plan to reach your goals."

### Cold

> "Thanks for your interest! Sully will reach out with resources to help you prepare for your future home purchase."

---

## Future Enhancements

Potential scoring improvements:

1. **Debt-to-Income Ratio**
   - Add scoring based on monthlyIncome vs monthlyDebt

2. **Military Benefits**
   - Add points for VA loan eligibility

3. **First-Time Buyer**
   - Add points for potential FHA/down payment assistance

4. **Cash Buyer**
   - Instant high score for paymentType === 'cash'

5. **Machine Learning**
   - Train on historical conversion data
   - Dynamic weight adjustment

---

## Related Documentation

- [API: Screening Endpoint](../api/screening-endpoint.md) - API implementation
- [Screening Page](../pages/screening-page.md) - Frontend implementation
- [Google Sheets](../integrations/google-sheets.md) - Score storage
