# Environment Variables

This document lists all environment variables used by sullyruiz.com.

---

## Overview

Environment variables are stored in:
- **Development:** `.env.local` (local machine)
- **Production:** `/opt/sullyruiz/.env` (VPS)
- **Template:** `.env.example` (repository)

---

## n8n Integration

### N8N_WEBHOOK_URL

**Required:** No (leads logged locally if not set)

Primary webhook URL for lead submissions.

```
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/xxxxx
```

**Used by:**
- `POST /api/lead` - All lead types (chat_wizard, lead_magnet, consult)

**Payload types received:**
- ChatWizard submissions
- LeadMagnet submissions
- ConsultForm submissions

---

### N8N_SCREENING_WEBHOOK_URL

**Required:** No (screening data logged locally if not set)

Webhook URL for screening questionnaire submissions.

```
N8N_SCREENING_WEBHOOK_URL=https://your-n8n-instance.com/webhook/screening
```

**Used by:**
- `POST /api/screening`

**Payload includes:**
- Full screening data (19 fields)
- Calculated lead score
- Lead tier classification

---

### N8N_LEAD_LOOKUP_WEBHOOK_URL

**Required:** No (prefill returns empty data if not set)

Webhook URL for looking up existing lead data.

```
N8N_LEAD_LOOKUP_WEBHOOK_URL=https://your-n8n-instance.com/webhook/lead-lookup
```

**Used by:**
- `GET /api/screening/prefill`

**Returns:**
- Previously submitted contact info (email, phone, name)

---

### N8N_API_KEY

**Required:** No

API key for authenticating webhook requests.

```
N8N_API_KEY=your-api-key-here
```

**Behavior:**
- If set, sent as `X-API-Key` header on all webhook requests
- n8n workflow can validate this key

---

## Analytics

### NEXT_PUBLIC_GA_MEASUREMENT_ID

**Required:** No (analytics disabled if not set)

Google Analytics 4 Measurement ID.

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Note:** The `NEXT_PUBLIC_` prefix makes this available client-side.

**Used by:**
- `src/lib/analytics.ts`
- GA4 script in root layout

---

## SSL & Domain (Traefik)

### DOMAIN_NAME

**Required:** Yes (for production)

Domain name for SSL certificate and routing.

```
DOMAIN_NAME=sullyruiz.com
```

**Used by:**
- Traefik configuration
- SSL certificate generation
- Host-based routing

---

### SSL_EMAIL

**Required:** Yes (for production)

Email address for Let's Encrypt notifications.

```
SSL_EMAIL=your-email@example.com
```

**Used by:**
- Let's Encrypt certificate registration
- Certificate expiration warnings

---

## Built-in Variables

These are set automatically in the Docker container:

### NODE_ENV

```
NODE_ENV=production
```

Set in Dockerfile for production builds.

---

### NEXT_TELEMETRY_DISABLED

```
NEXT_TELEMETRY_DISABLED=1
```

Disables Next.js telemetry in Docker builds.

---

### PORT

```
PORT=3000
```

Internal port for the Next.js server.

---

### HOSTNAME

```
HOSTNAME=0.0.0.0
```

Allows connections from outside the container.

---

## Configuration Files

### Development (.env.local)

```bash
# n8n Integration
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/xxxxx
N8N_SCREENING_WEBHOOK_URL=https://your-n8n-instance.com/webhook/screening
N8N_LEAD_LOOKUP_WEBHOOK_URL=https://your-n8n-instance.com/webhook/lead-lookup

# Analytics (optional in development)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Production (/opt/sullyruiz/.env)

```bash
# n8n Integration
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/xxxxx
N8N_SCREENING_WEBHOOK_URL=https://your-n8n-instance.com/webhook/screening
N8N_LEAD_LOOKUP_WEBHOOK_URL=https://your-n8n-instance.com/webhook/lead-lookup
N8N_API_KEY=your-secure-api-key

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# SSL (Traefik)
DOMAIN_NAME=sullyruiz.com
SSL_EMAIL=your-email@example.com
```

### Template (.env.example)

```bash
# n8n Integration (required for lead processing)
N8N_WEBHOOK_URL=
N8N_SCREENING_WEBHOOK_URL=
N8N_LEAD_LOOKUP_WEBHOOK_URL=
N8N_API_KEY=

# Google Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=

# SSL Configuration (required for production)
DOMAIN_NAME=
SSL_EMAIL=
```

---

## Security Notes

### Never Commit

These files should never be committed to version control:
- `.env.local`
- `.env`
- `/opt/sullyruiz/.env`

### Repository Files

Safe to commit:
- `.env.example` (template with empty values)

### VPS Access

View production environment:
```bash
ssh root@31.220.22.215
cat /opt/sullyruiz/.env
```

Update production environment:
```bash
ssh root@31.220.22.215
nano /opt/sullyruiz/.env
# Make changes, save
cd /opt/sullyruiz
docker compose down && docker compose up -d
```

---

## Variable Availability

| Variable | Server | Client | Docker Build |
|----------|--------|--------|--------------|
| N8N_WEBHOOK_URL | Yes | No | No |
| N8N_SCREENING_WEBHOOK_URL | Yes | No | No |
| N8N_LEAD_LOOKUP_WEBHOOK_URL | Yes | No | No |
| N8N_API_KEY | Yes | No | No |
| NEXT_PUBLIC_GA_MEASUREMENT_ID | Yes | Yes | No |
| DOMAIN_NAME | No | No | Docker Compose |
| SSL_EMAIL | No | No | Docker Compose |
| NODE_ENV | Yes | Yes | Yes |

---

## Troubleshooting

### Variable Not Working

1. Check spelling (case-sensitive)
2. Verify file location (`.env.local` vs `.env`)
3. Restart development server
4. For production: restart Docker container

### NEXT_PUBLIC_ Variables

Variables with `NEXT_PUBLIC_` prefix:
- Available in both server and client code
- Bundled into JavaScript at build time
- Changing requires rebuild for client-side changes

### Server-Only Variables

Variables without `NEXT_PUBLIC_` prefix:
- Only available in server-side code (API routes, server components)
- Can be changed without rebuild
- Requires container restart in production

---

## Related Documentation

- [Deployment Overview](../deployment/overview.md) - Infrastructure details
- [VPS Management](../deployment/vps-management.md) - Server access
- [n8n Overview](../integrations/n8n-overview.md) - Webhook configuration
- [Analytics](../features/analytics.md) - GA4 setup
