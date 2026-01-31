# Consult Lead Handler - n8n Workflow Setup Guide

## Workflow ID: `OxdRvcV1l0CeYcVS`
## Workflow Name: Consult Lead Handler - Official Nodes

---

## Overview

This workflow handles consult form submissions from sullyruiz.com:
1. Receives lead data via webhook
2. Saves to Google Sheets
3. Sends confirmation email/WhatsApp to lead
4. Notifies Sully via email/WhatsApp
5. Returns structured response to frontend

---

## Configuration Required in n8n UI

### 1. Google Sheets Node - "Save to Google Sheets"

**Credentials:** Google OAuth2 (or Service Account)

**Parameters to set:**
- `documentId`: Select your Google Sheets document
- `sheetName`: Select the sheet (should have columns below)

**Required Sheet Columns:**
| Column Name | Description |
|-------------|-------------|
| Lead ID | Unique identifier |
| Received At | Timestamp |
| Name | Lead name |
| Email | Lead email |
| Phone | Lead phone |
| Language | en or es |
| Timeline | Purchase timeline |
| Income Type | W2, 1099, ITIN, etc. |
| Bank Status | Pre-approval status |
| Down Payment | Down payment range |
| Area | Preferred location |
| Source | How they found Sully |
| Notes | Additional notes |
| UTM Source | Marketing source |
| UTM Medium | Marketing medium |
| UTM Campaign | Marketing campaign |
| Session ID | Browser session ID |
| Status | Lead status (new) |

---

### 2. Gmail Nodes - "Gmail Lead" & "Gmail Agent"

**Credentials:** Google OAuth2

The Gmail nodes use the official `n8n-nodes-base.gmail` node with:
- `resource`: message
- `operation`: send

**Gmail Lead** sends to the lead's email address.
**Gmail Agent** sends to `sully@sullyruiz.com`.

---

### 3. WhatsApp Nodes - "WhatsApp Lead" & "WhatsApp Agent"

**Credentials:** WhatsApp Business Cloud API

**Parameters to set in both nodes:**

| Parameter | Value |
|-----------|-------|
| `phoneNumberId` | Your WhatsApp Business Phone Number ID from Meta Developer Console |

**WhatsApp Agent only:**
| Parameter | Value |
|-----------|-------|
| `recipientPhoneNumber` | Sully's phone number (with country code, e.g., +15124122352) |

**How to get phoneNumberId:**
1. Go to Meta Developer Console → Your App → WhatsApp → API Setup
2. Copy the "Phone number ID" from the selected business phone number

---

## VPS Environment Variable

Update `/opt/sullyruiz/.env` on the VPS:

```bash
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/consult-lead
```

The webhook path is `consult-lead` (configured in the Webhook node).

---

## Workflow Flow

```
Webhook (POST /webhook/consult-lead)
    ↓
Prepare Data (normalize fields)
    ↓
Save to Google Sheets
    ↓
Check Language (If node)
    ↓
┌─────────────┴─────────────┐
Spanish Messages      English Messages
└─────────────┬─────────────┘
              ↓
       Merge Messages
              ↓
┌──────┬──────┬──────┬──────┐
Gmail  WhatsApp Gmail  WhatsApp
Lead   Lead    Agent  Agent
└──────┴──────┴──────┴──────┘
              ↓
       Build Response
              ↓
   Respond to Webhook (JSON)
```

---

## Response Format

**Success (200):**
```json
{
  "success": true,
  "leadId": "abc123-1706745600000",
  "notifications": {
    "emailSent": true,
    "whatsappSent": true,
    "agentNotified": true
  },
  "message": {
    "en": "Thank you! We've received your consultation request and will contact you within 24 hours.",
    "es": "¡Gracias! Hemos recibido tu solicitud de consulta y te contactaremos dentro de 24 horas."
  },
  "nextSteps": {
    "en": ["Check your email for confirmation", "Expect a call or WhatsApp within 24 hours", "Prepare any questions about your real estate goals"],
    "es": ["Revisa tu correo para la confirmación", "Espera una llamada o WhatsApp en 24 horas", "Prepara tus preguntas sobre tus metas inmobiliarias"]
  }
}
```

---

## Activation Steps

1. Open workflow `OxdRvcV1l0CeYcVS` in n8n
2. Configure Google Sheets credential and select document/sheet
3. Configure Gmail credential (same for both Gmail nodes)
4. Configure WhatsApp Business Cloud API credential
5. Set `phoneNumberId` in both WhatsApp nodes
6. Set Sully's phone number in "WhatsApp Agent" node
7. Click "Activate" to enable the workflow
8. Update VPS `.env` with the webhook URL
9. Restart the Docker container on VPS

---

## Testing

1. Submit test form on `/consult` or `/es/consulta`
2. Check:
   - Google Sheets for new row
   - Lead receives Gmail confirmation
   - Lead receives WhatsApp message
   - Sully receives both notifications
   - Frontend displays personalized success message

---

## Error Handling

All notification nodes have `onError: "continueRegularOutput"` so the workflow continues even if one notification fails. The response will still be sent to the frontend.

To test error handling, temporarily disconnect Google Sheets and verify the frontend shows an appropriate error message.
