# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio/landing page for Sully Ruiz (Texas real estate agent) built with Next.js 16.1.4.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run lint     # Run ESLint
npm start        # Start production server
```

**Docker:**
```bash
docker build -t sullyruiz .
docker compose up -d
```

## Tech Stack

- **Framework:** Next.js 16.1.4 (App Router)
- **Styling:** Tailwind CSS v4
- **Internationalization:** next-intl (English/Spanish)
- **UI Components:** Radix UI primitives with shadcn/ui patterns
- **Animations:** Framer Motion
- **Deployment:** Docker on Hostinger VPS via GitHub Actions

## Architecture

### Routing & i18n
- Uses next-intl with `[locale]` dynamic route segment
- Locales: `en` (default), `es`
- Locale prefix: `as-needed` (no `/en` prefix for default)
- Translation files in `/messages/en.json` and `/messages/es.json`
- Navigation helpers exported from `src/i18n/routing.ts`

### Page Structure
Single-page app with section components rendered in `src/app/[locale]/page.tsx`:
- Hero → TrustSection → About → HowItWorks → Services → LifestyleGallery → LeadMagnet → Testimonials → FAQ → Footer

### Lead Capture Flow
Two lead capture mechanisms, both POST to `/api/lead`:
1. **ChatWizard** - Modal dialog with buy/sell flow questions, triggered from Hero/Services CTAs
2. **LeadMagnet** - Email capture for buyer's guide download

Leads are forwarded to n8n webhook (`N8N_WEBHOOK_URL` env var) for automation.

## Deployment

Push to `main` triggers GitHub Actions:
1. Build Docker image → push to ghcr.io
2. SSH to VPS → pull and restart container

Health check: `curl https://sullyruiz.com/api/health`

## Environment Variables

- `N8N_WEBHOOK_URL` - Webhook URL for lead capture (configured on VPS at /opt/sullyruiz/.env)
