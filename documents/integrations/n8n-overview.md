# n8n Integration Overview

This document covers the n8n workflow automation architecture used by sullyruiz.com.

---

## Overview

n8n handles all backend lead processing, including:
- Saving leads to Google Sheets
- Sending confirmation emails
- Sending WhatsApp notifications
- Notifying the agent

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        sullyruiz.com                             │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  ChatWizard     │  │  LeadMagnet     │  │  ConsultForm    │  │
│  │  /api/lead      │  │  /api/lead      │  │  /api/lead      │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
│           │                    │                    │            │
│           └────────────────────┼────────────────────┘            │
│                                │                                 │
│  ┌─────────────────────────────┴─────────────────────────────┐  │
│  │  /api/screening                                            │  │
│  └─────────────────────────────┬─────────────────────────────┘  │
│                                │                                 │
└────────────────────────────────┼────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                           n8n                                    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Webhook Endpoints                                       │    │
│  │                                                          │    │
│  │  • /webhook/lead          (ChatWizard, LeadMagnet)      │    │
│  │  • /webhook/consult-lead  (ConsultForm)                 │    │
│  │  • /webhook/screening     (Screening Quiz)              │    │
│  │  • /webhook/lead-lookup   (Prefill Data)                │    │
│  └─────────────────────────────┬───────────────────────────┘    │
│                                │                                 │
│                                ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Workflows                                               │    │
│  │                                                          │    │
│  │  ┌───────────────┐  ┌───────────────┐  ┌─────────────┐  │    │
│  │  │ Lead Handler  │  │ Consult Lead  │  │ Screening   │  │    │
│  │  │ Workflow      │  │ Handler       │  │ Handler     │  │    │
│  │  └───────┬───────┘  └───────┬───────┘  └──────┬──────┘  │    │
│  │          │                  │                 │          │    │
│  └──────────┼──────────────────┼─────────────────┼──────────┘    │
│             │                  │                 │               │
└─────────────┼──────────────────┼─────────────────┼───────────────┘
              │                  │                 │
              ▼                  ▼                 ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Google Sheets  │  │     Gmail       │  │    WhatsApp     │
│                 │  │                 │  │    Business     │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

## Webhook Endpoints

### Lead Webhook

**Purpose:** Process ChatWizard and LeadMagnet submissions

**URL:** Configured in `N8N_WEBHOOK_URL`

**Payload Types:**
- `type: "chat_wizard"`
- `type: "lead_magnet"`

**Processing:**
1. Save to Google Sheets
2. Send confirmation email to lead
3. Notify agent

### Consult Lead Webhook

**Purpose:** Process ConsultForm submissions with rich response

**URL:** Configured in `N8N_WEBHOOK_URL`

**Payload Type:** `type: "consult"`

**Processing:**
1. Save to Google Sheets
2. Send confirmation email to lead
3. Send WhatsApp to lead
4. Send email to agent
5. Send WhatsApp to agent
6. Return structured response

**Response Format:**
```json
{
  "success": true,
  "leadId": "string",
  "notifications": {
    "emailSent": true,
    "whatsappSent": true,
    "agentNotified": true
  },
  "message": { "en": "...", "es": "..." },
  "nextSteps": { "en": [...], "es": [...] }
}
```

### Screening Webhook

**Purpose:** Process screening questionnaire submissions

**URL:** Configured in `N8N_SCREENING_WEBHOOK_URL`

**Payload:** Full screening data with lead score

**Processing:**
1. Save to Google Sheets (detailed qualification data)
2. Optionally trigger follow-up workflows based on score

### Lead Lookup Webhook

**Purpose:** Retrieve existing lead data for form prefill

**URL:** Configured in `N8N_LEAD_LOOKUP_WEBHOOK_URL`

**Query:** `?session_id=xxx`

**Response:**
```json
{
  "email": "john@example.com",
  "phone": "(512) 555-1234",
  "name": "John Doe"
}
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `N8N_WEBHOOK_URL` | Primary webhook for leads and consult forms |
| `N8N_SCREENING_WEBHOOK_URL` | Webhook for screening submissions |
| `N8N_LEAD_LOOKUP_WEBHOOK_URL` | Webhook for prefill data lookup |
| `N8N_API_KEY` | Optional API key for webhook authentication |

---

## Credentials Required

### Google Sheets

- **Type:** OAuth2 or Service Account
- **Scopes:** Read/Write access to specific spreadsheet
- **Used by:** All workflows for lead storage

### Gmail

- **Type:** OAuth2
- **Scopes:** Send emails
- **Used by:** Confirmation emails to leads, notifications to agent

### WhatsApp Business Cloud API

- **Type:** API credentials from Meta Developer Console
- **Required:** Phone Number ID, Access Token
- **Used by:** WhatsApp messages to leads and agent

---

## Workflow IDs

| Workflow | ID | Purpose |
|----------|-----|---------|
| Consult Lead Handler | `OxdRvcV1l0CeYcVS` | Process consult form submissions |

---

## Error Handling

### Website Behavior

The website handles n8n errors gracefully:

| Scenario | Behavior |
|----------|----------|
| n8n unreachable | Lead logged locally, user sees success |
| n8n timeout (>30s) | ConsultForm shows timeout error |
| n8n returns error | ConsultForm shows specific error |
| Webhook not configured | Lead logged locally only |

### n8n Workflow Behavior

Workflows are configured with `onError: "continueRegularOutput"`:

- Individual node failures don't stop the workflow
- Response is still sent to frontend
- Errors are logged for debugging

---

## Testing Webhooks

### Test with curl

```bash
# Test lead webhook
curl -X POST https://your-n8n-instance.com/webhook/lead \
  -H "Content-Type: application/json" \
  -d '{
    "type": "chat_wizard",
    "flow": "buy",
    "session_id": "test-123",
    "cta_source": "hero_buy",
    "answers": { "area": "Austin" },
    "contact": {
      "name": "Test User",
      "email": "test@example.com"
    },
    "locale": "en"
  }'
```

### Test from Website

1. Submit a test form on the website
2. Check n8n execution history
3. Verify Google Sheets entry
4. Confirm email/WhatsApp received

---

## Monitoring

### n8n Execution History

- View all webhook triggers
- See individual node execution
- Debug failed executions
- Replay failed executions

### Google Sheets

- Real-time view of all leads
- Filter by date, type, status
- Export for reporting

---

## Common Issues

### Webhook Not Triggering

1. Check `N8N_WEBHOOK_URL` is set correctly
2. Verify n8n workflow is activated
3. Check n8n is accessible from VPS
4. Review VPS logs for connection errors

### Notifications Not Sending

1. Check credential configuration in n8n
2. Verify Gmail/WhatsApp API permissions
3. Check for rate limiting
4. Review n8n execution logs

### Timeout Errors

1. Check n8n server performance
2. Review workflow complexity
3. Increase timeout if needed (currently 30s)
4. Consider async processing for complex workflows

---

## Related Documentation

- [n8n Consult Workflow](./n8n-consult-workflow.md) - Detailed consult workflow setup
- [Google Sheets](./google-sheets.md) - Sheet structure and columns
- [API: Lead Endpoint](../api/lead-endpoint.md) - Frontend API
- [API: Screening Endpoint](../api/screening-endpoint.md) - Screening API
- [Environment Variables](../reference/environment-variables.md) - All env vars
