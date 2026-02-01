# sullyruiz.com Documentation

Welcome to the documentation for Sully Ruiz's real estate portfolio website. This documentation covers the architecture, features, APIs, integrations, and deployment processes.

---

## Quick Start

```bash
# Development
npm install
npm run dev          # http://localhost:3000

# Production build
npm run build
npm start

# Docker
docker compose up -d
```

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.1.4 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | Radix UI + shadcn/ui patterns |
| Internationalization | next-intl (en/es) |
| Animations | Framer Motion |
| Analytics | Google Analytics 4 |
| Deployment | Docker on Hostinger VPS via GitHub Actions |

---

## Documentation Index

### Architecture
- [Overview](./architecture/overview.md) - System architecture, tech stack, data flow
- [Routing & i18n](./architecture/routing-and-i18n.md) - Internationalization setup, pathnames, middleware
- [Component Structure](./architecture/component-structure.md) - Component organization and patterns

### Pages
- [Landing Page](./pages/landing-page.md) - Main homepage (11 sections)
- [Consult Page](./pages/consult-page.md) - Consultation request page
- [Screening Page](./pages/screening-page.md) - Lead qualification wizard
- [Legal Pages](./pages/legal-pages.md) - Privacy, Terms, Data Deletion

### Features
- [Lead Capture](./features/lead-capture.md) - ChatWizard, LeadMagnet, ConsultForm
- [Session Management](./features/session-management.md) - Session tracking, CTA sources
- [Analytics](./features/analytics.md) - GA4 events, scroll tracking
- [PDF Generation](./features/pdf-generation.md) - Buyer's/Seller's guides

### API Reference
- [API Overview](./api/overview.md) - API architecture, common patterns
- [Lead Endpoint](./api/lead-endpoint.md) - POST /api/lead
- [Screening Endpoint](./api/screening-endpoint.md) - POST /api/screening
- [Health Endpoint](./api/health-endpoint.md) - GET /api/health

### Integrations
- [n8n Overview](./integrations/n8n-overview.md) - Automation architecture
- [n8n Consult Workflow](./integrations/n8n-consult-workflow.md) - Consult form workflow setup
- [Gemini Image API](./integrations/gemini-image-api.md) - AI image generation for Instagram
- [Google Sheets](./integrations/google-sheets.md) - Lead storage configuration

### Deployment
- [Deployment Overview](./deployment/overview.md) - Infrastructure architecture
- [Docker](./deployment/docker.md) - Dockerfile, docker-compose
- [GitHub Actions](./deployment/github-actions.md) - CI/CD pipeline
- [VPS Management](./deployment/vps-management.md) - Server access, troubleshooting

### Reference
- [Environment Variables](./reference/environment-variables.md) - All env vars
- [Translation Keys](./reference/translation-keys.md) - i18n message structure
- [CTA Sources](./reference/cta-sources.md) - CTA tracking identifiers
- [Lead Scoring](./reference/lead-scoring.md) - Screening score algorithm

---

## Key Paths

| Path | Purpose |
|------|---------|
| `src/app/[locale]/` | Page components |
| `src/app/api/` | API routes |
| `src/components/` | UI components |
| `src/lib/` | Utilities (session, validation, analytics) |
| `src/i18n/` | Internationalization config |
| `messages/` | Translation files (en.json, es.json) |

---

## Contact & Business Info

- **Agent:** Sully Ruiz
- **License:** 0742907
- **Phone:** (512) 412-2352
- **Email:** realtor@sullyruiz.com
- **Brokerage:** Keller Williams Austin NW

---

## Related Files

- `CLAUDE.md` - AI assistant context and commands
- `README.md` - Basic setup instructions
- `.env.example` - Environment variable template
