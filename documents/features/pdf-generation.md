# PDF Generation

This document covers the buyer's and seller's guide PDF generation.

---

## Overview

The site offers downloadable guides as lead magnets:
- **Buyer's Guide:** Home buying process, financing, inspections
- **Seller's Guide:** Home prep, pricing, negotiations

---

## Technology

PDFs are generated using `@react-pdf/renderer`:

```typescript
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
```

---

## Guide Structure

### Buyer's Guide

| Section | Content |
|---------|---------|
| Cover | Title, Sully's photo, contact info |
| Introduction | Welcome message, guide overview |
| Step 1: Pre-Approval | Importance, how to get pre-approved |
| Step 2: Finding Homes | Search strategies, must-haves vs nice-to-haves |
| Step 3: Making Offers | Offer strategy, negotiation tips |
| Step 4: Inspections | What to expect, common issues |
| Step 5: Closing | Timeline, what to bring, costs |
| First-Time Buyer Programs | Down payment assistance, Texas programs |
| Glossary | Real estate terms explained |
| Contact | How to reach Sully |

### Seller's Guide

| Section | Content |
|---------|---------|
| Cover | Title, Sully's photo, contact info |
| Introduction | Welcome message, guide overview |
| Step 1: Preparing Your Home | Repairs, staging, curb appeal |
| Step 2: Pricing Strategy | Market analysis, pricing tips |
| Step 3: Marketing | How Sully markets listings |
| Step 4: Showings | Tips for successful showings |
| Step 5: Offers & Negotiations | Evaluating offers, counteroffers |
| Step 6: Closing | Seller responsibilities, timeline |
| Cost Breakdown | Typical seller expenses |
| Contact | How to reach Sully |

---

## Bilingual Content

Both guides are available in English and Spanish.

### Content Organization

```typescript
const guideContent = {
  en: {
    buyer: {
      title: "Your Complete Home Buying Guide",
      sections: [/* English content */]
    },
    seller: {
      title: "Your Complete Home Selling Guide",
      sections: [/* English content */]
    }
  },
  es: {
    buyer: {
      title: "Tu Guía Completa para Comprar Casa",
      sections: [/* Spanish content */]
    },
    seller: {
      title: "Tu Guía Completa para Vender Casa",
      sections: [/* Spanish content */]
    }
  }
}
```

---

## PDF Component Structure

```tsx
// Simplified structure
const BuyerGuide = ({ locale }) => {
  const content = guideContent[locale].buyer

  return (
    <Document>
      <Page size="LETTER">
        <CoverPage title={content.title} />
      </Page>

      <Page size="LETTER">
        <Introduction text={content.intro} />
      </Page>

      {content.sections.map((section, i) => (
        <Page key={i} size="LETTER">
          <Section
            number={i + 1}
            title={section.title}
            content={section.content}
          />
        </Page>
      ))}

      <Page size="LETTER">
        <ContactPage />
      </Page>
    </Document>
  )
}
```

---

## Styling

```tsx
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  coverTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a365d',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2d3748',
  },
  body: {
    fontSize: 12,
    lineHeight: 1.6,
    color: '#4a5568',
  },
  highlight: {
    backgroundColor: '#ebf8ff',
    padding: 12,
    borderRadius: 4,
    marginVertical: 8,
  },
})
```

---

## Delivery Methods

### Immediate Download

Generated client-side and downloaded:

```tsx
import { pdf } from '@react-pdf/renderer'

const handleDownload = async () => {
  const blob = await pdf(<BuyerGuide locale={locale} />).toBlob()
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'buyers-guide.pdf'
  link.click()

  URL.revokeObjectURL(url)
}
```

### Email Delivery

Generated server-side via n8n and sent as attachment:

```javascript
// n8n workflow
// 1. Generate PDF
// 2. Convert to base64
// 3. Attach to Gmail node
```

---

## Lead Magnet Flow

```
User submits email for guide
           │
           ▼
POST /api/lead (type: lead_magnet)
           │
           ▼
Forward to n8n
           │
           ├── Save to Google Sheets
           │
           ├── Generate PDF (if server-side)
           │
           └── Send email with guide
           │
           ▼
Frontend triggers download
           │
           ▼
Generate PDF client-side
           │
           ▼
Download initiated
```

---

## Performance Considerations

### Client-Side Generation

- PDF generated in browser
- May take 1-2 seconds
- Show loading indicator

```tsx
const [isGenerating, setIsGenerating] = useState(false)

const handleDownload = async () => {
  setIsGenerating(true)
  try {
    await generateAndDownload()
  } finally {
    setIsGenerating(false)
  }
}
```

### Pre-Generated PDFs

Alternative: Store static PDFs and serve directly:

```
/public/guides/buyers-guide-en.pdf
/public/guides/buyers-guide-es.pdf
/public/guides/sellers-guide-en.pdf
/public/guides/sellers-guide-es.pdf
```

---

## Content Updates

### Translation Workflow

1. Update English content
2. Send to translator
3. Update Spanish content
4. Regenerate PDFs if pre-generated
5. Test both languages

### Version Control

Track guide versions for analytics:

```typescript
const guideVersion = '2024.1'

// Include in analytics
trackLeadGeneration({
  lead_source: 'lead_magnet',
  guide_type: 'buyer',
  guide_version: guideVersion
})
```

---

## Dependencies

```json
{
  "@react-pdf/renderer": "^4.3.2"
}
```

### Limitations

- No interactive elements (links work)
- Limited font support
- No CSS-in-JS (use StyleSheet)
- Images must be bundled or URLs

---

## Example: Cover Page

```tsx
const CoverPage = ({ title, subtitle, locale }) => (
  <View style={styles.coverContainer}>
    <Image src="/images/sully-headshot.jpg" style={styles.coverImage} />

    <Text style={styles.coverTitle}>{title}</Text>

    <Text style={styles.coverSubtitle}>{subtitle}</Text>

    <View style={styles.contactBox}>
      <Text style={styles.contactName}>Sully Ruiz</Text>
      <Text style={styles.contactInfo}>
        (512) 412-2352{'\n'}
        realtor@sullyruiz.com{'\n'}
        sullyruiz.com
      </Text>
    </View>

    <Text style={styles.license}>
      {locale === 'es' ? 'Licencia' : 'License'} #0742907
    </Text>
  </View>
)
```

---

## Testing

### Manual Testing

1. Submit lead magnet form
2. Verify PDF downloads
3. Open PDF and check:
   - All pages render
   - Images load
   - Text is readable
   - Links work

### Automated Testing

```typescript
import { render } from '@react-pdf/renderer'

test('generates buyer guide PDF', async () => {
  const doc = <BuyerGuide locale="en" />
  const result = await render(doc)

  expect(result).toBeDefined()
  expect(result.pages.length).toBeGreaterThan(0)
})
```

---

## Related Documentation

- [Lead Capture](./lead-capture.md) - LeadMagnet component
- [n8n Overview](../integrations/n8n-overview.md) - Email delivery
- [Analytics](./analytics.md) - Guide download tracking
