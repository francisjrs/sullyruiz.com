# Google Sheets Integration

This document covers the Google Sheets configuration for lead storage.

---

## Overview

Google Sheets is used as the primary lead database, accessed via n8n workflows.

---

## Sheet Structure

### Leads Sheet

Stores all lead submissions from ChatWizard, LeadMagnet, and ConsultForm.

| Column | Type | Source | Description |
|--------|------|--------|-------------|
| Lead ID | String | Generated | Unique identifier (name-timestamp) |
| Received At | DateTime | Server | ISO timestamp of submission |
| Type | String | Payload | lead_magnet, chat_wizard, consult |
| Name | String | Contact | Lead's full name |
| Email | String | Contact | Lead's email address |
| Phone | String | Contact | Lead's phone (normalized) |
| Language | String | Contact | Preferred language (en/es) |
| Flow | String | Payload | buy or sell (chat_wizard) |
| Guide Type | String | Payload | buyer or seller (lead_magnet) |
| Property Type | String | Answers | House, Townhouse, etc. |
| Area | String | Answers/Qual | Austin, Round Rock, etc. |
| Budget | String | Answers | Budget range |
| Timeline | String | Answers/Qual | ASAP, 1-3 months, etc. |
| Reason | String | Answers | Sell reason (sell flow) |
| Address | String | Answers | Current address (sell flow) |
| Income Type | String | Qualification | W2, 1099, etc. (consult) |
| Bank Status | String | Qualification | Pre-approval status |
| Down Payment | String | Qualification | Down payment range |
| Source | String | Tracking | How they heard about Sully |
| Notes | String | Tracking | Additional notes |
| UTM Source | String | UTM | Marketing source |
| UTM Medium | String | UTM | Marketing medium |
| UTM Campaign | String | UTM | Marketing campaign |
| UTM Term | String | UTM | Search term |
| UTM Content | String | UTM | Ad variation |
| Session ID | String | Session | Browser session ID |
| CTA Source | String | Session | Which CTA triggered |
| Status | String | Workflow | new, contacted, qualified, etc. |

---

### Screening Sheet

Stores detailed qualification data from the screening wizard.

| Column | Type | Description |
|--------|------|-------------|
| Session ID | String | Links to leads sheet |
| Received At | DateTime | Submission timestamp |
| Email | String | Lead email |
| Phone | String | Lead phone |
| Full Name | String | Lead name |
| Has Pre-approval | String | yes/no/working_on_it |
| Immigration Status | String | Citizen, Visa, ITIN, etc. |
| Monthly Income | String | Dollar amount |
| Monthly Debt | String | Dollar amount |
| Payment Type | String | W2, 1099, Cash, Other |
| Employment Type | String | Full-time, Part-time, etc. |
| Credit Score | String | Score range |
| Has Auto Loan | String | yes/no |
| Has Credit Cards | String | yes/no |
| Tax Years | String | 0, 1, 2, 3+ |
| Down Payment | String | Dollar range |
| Savings Location | String | Where savings are held |
| Lease End Date | Date | When current lease ends |
| Move Date | String | Desired move timeline |
| Property Type | String | Desired property type |
| Is Homeowner | String | yes/no |
| Will Sell Home | String | yes/no/not_applicable |
| Buying With | String | alone, spouse, etc. |
| Military Service | String | active, veteran, spouse, none |
| Additional Info | String | Free text notes |
| Lead Score | Number | Calculated score (0-100) |
| Lead Tier | String | hot, warm, developing, cold |

---

## Column Mapping

### ChatWizard → Leads Sheet

| Payload Field | Sheet Column |
|---------------|--------------|
| contact.name | Name |
| contact.email | Email |
| contact.phone | Phone |
| flow | Flow |
| answers.propertyType | Property Type |
| answers.area | Area |
| answers.budget | Budget |
| answers.timeline | Timeline |
| answers.reason | Reason |
| answers.address | Address |
| utm.utm_source | UTM Source |
| session_id | Session ID |
| cta_source | CTA Source |

### LeadMagnet → Leads Sheet

| Payload Field | Sheet Column |
|---------------|--------------|
| contact.firstName | Name |
| contact.email | Email |
| guideType | Guide Type |
| utm.utm_source | UTM Source |
| session_id | Session ID |
| cta_source | CTA Source |

### ConsultForm → Leads Sheet

| Payload Field | Sheet Column |
|---------------|--------------|
| contact.name | Name |
| contact.email | Email |
| contact.phone | Phone |
| contact.languagePreference | Language |
| qualification.timeline | Timeline |
| qualification.incomeType | Income Type |
| qualification.bankStatus | Bank Status |
| qualification.downPayment | Down Payment |
| qualification.area | Area |
| tracking.source | Source |
| tracking.notes | Notes |
| utm.* | UTM columns |
| session_id | Session ID |

---

## n8n Configuration

### Credentials

**Google OAuth2:**
1. Create OAuth2 credentials in Google Cloud Console
2. Enable Google Sheets API
3. Add credentials to n8n
4. Authorize with Google account that owns the sheet

**Service Account (Alternative):**
1. Create service account in Google Cloud Console
2. Download JSON key file
3. Share sheet with service account email
4. Add credentials to n8n using JSON key

### Node Configuration

```javascript
// Google Sheets node settings
{
  resource: 'sheet',
  operation: 'appendOrUpdate',
  documentId: 'your-sheet-id',
  sheetName: 'Leads',
  columns: {
    // Mapping configured in n8n UI
  },
  options: {
    valueInputMode: 'USER_ENTERED'
  }
}
```

---

## Lead ID Generation

Generated in n8n workflow:

```javascript
// Generate unique Lead ID
const name = $json.contact.name || $json.contact.firstName || 'unknown';
const sanitizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
const timestamp = Date.now();
const leadId = `${sanitizedName}-${timestamp}`;
return { leadId };
```

Example: `john-doe-1706745600000`

---

## Status Values

### Lead Status

| Status | Description |
|--------|-------------|
| new | Just submitted |
| contacted | Initial contact made |
| qualified | Meets criteria |
| nurturing | Long-term follow-up |
| active | Currently working with |
| closed-won | Became client |
| closed-lost | Did not convert |

### Lead Tier (Screening)

| Tier | Score | Description |
|------|-------|-------------|
| hot | 80-100 | Ready to buy |
| warm | 50-79 | Needs preparation |
| developing | 25-49 | Early stage |
| cold | 0-24 | Not ready |

---

## Data Validation

### Required Fields by Type

| Type | Required |
|------|----------|
| lead_magnet | firstName, email |
| chat_wizard | name, email |
| consult | name, email, phone |

### Phone Format

Phone numbers are normalized before storage:
- Input: `(512) 555-1234`
- Stored: `5125551234`

### Timestamps

All timestamps in ISO 8601 format:
```
2024-01-31T12:00:00.000Z
```

---

## Reporting

### Recommended Filters

**Hot Leads:**
```
Lead Tier = "hot" AND Status = "new"
```

**Recent Consults:**
```
Type = "consult" AND Received At > [7 days ago]
```

**By CTA Source:**
```
GROUP BY CTA Source, COUNT(*)
```

### Export Options

- Download as CSV/Excel
- Connect to Google Data Studio
- Query via Google Sheets API

---

## Backup

### Automatic Backups

Google Sheets maintains version history:
- File → Version history → See version history

### Manual Backup

Export periodically:
```
File → Download → Microsoft Excel (.xlsx)
```

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Row not appearing | Column mismatch | Verify column names match exactly |
| Auth error | Token expired | Reconnect OAuth in n8n |
| Duplicate rows | Retry logic | Check for existing session_id |
| Slow performance | Too many columns | Archive old data periodically |

### Checking for Duplicates

```javascript
// In n8n, check for existing session_id before insert
const existingRows = await sheets.getRows({
  filter: `Session ID = "${sessionId}"`
});
if (existingRows.length > 0) {
  // Update instead of insert
}
```

---

## Security

### Access Control

- Limit sheet access to necessary accounts
- Use service account for automation
- Don't share edit access broadly

### Sensitive Data

- Phone numbers stored for business use
- Email addresses not shared externally
- Consider data retention policies

---

## Related Documentation

- [n8n Overview](./n8n-overview.md) - Automation architecture
- [n8n Consult Workflow](./n8n-consult-workflow.md) - Workflow setup
- [Lead Capture](../features/lead-capture.md) - Data collection
- [API: Lead Endpoint](../api/lead-endpoint.md) - Payload structure
