# Architecture Overview

This document provides a high-level overview of the sullyruiz.com architecture, technology choices, and data flow.

---

## System Architecture

```
                                    ┌─────────────────┐
                                    │   Cloudflare    │
                                    │      DNS        │
                                    └────────┬────────┘
                                             │
                                             ▼
┌────────────────────────────────────────────────────────────────┐
│                     Hostinger VPS (31.220.22.215)              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                       Traefik 2.11                        │  │
│  │              (Reverse Proxy + SSL Termination)            │  │
│  │                   Port 80 → 443 redirect                  │  │
│  │              Let's Encrypt auto-certificates              │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                           │                                     │
│                           ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Next.js 16.1.4                         │  │
│  │                  (Docker Container)                       │  │
│  │                                                           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │  │
│  │  │   Pages     │  │  API Routes │  │   Static Files  │   │  │
│  │  │ [locale]/   │  │  /api/*     │  │   /images/*     │   │  │
│  │  └─────────────┘  └──────┬──────┘  └─────────────────┘   │  │
│  │                          │                                │  │
│  └──────────────────────────┼────────────────────────────────┘  │
│                             │                                    │
└─────────────────────────────┼────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │     n8n         │
                    │   (External)    │
                    │                 │
                    │  ┌───────────┐  │
                    │  │ Workflows │  │
                    │  │           │  │
                    │  │ • Lead    │  │
                    │  │ • Screen  │  │
                    │  │ • Consult │  │
                    │  └─────┬─────┘  │
                    └────────┼────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │  Google  │  │  Gmail   │  │ WhatsApp │
        │  Sheets  │  │          │  │ Business │
        └──────────┘  └──────────┘  └──────────┘
```

---

## Technology Stack

### Frontend

| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | Next.js 16.1.4 | App Router, server components, API routes |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS v4 | Utility-first CSS |
| UI Library | Radix UI | Accessible primitives |
| Component Patterns | shadcn/ui | Pre-built component variants |
| Animations | Framer Motion | Page transitions, micro-interactions |
| i18n | next-intl | English/Spanish localization |

### Backend

| Component | Technology | Purpose |
|-----------|------------|---------|
| API Routes | Next.js Route Handlers | Lead capture, health checks |
| Validation | Custom validators | Email, phone, required fields |
| Session | sessionStorage | Client-side session tracking |
| Analytics | Google Analytics 4 | Event tracking, user properties |

### Infrastructure

| Component | Technology | Purpose |
|-----------|------------|---------|
| Hosting | Hostinger VPS | Single server deployment |
| Containerization | Docker | Application packaging |
| Reverse Proxy | Traefik 2.11 | SSL, routing, security headers |
| CI/CD | GitHub Actions | Automated deployment on push to main |
| Registry | GitHub Container Registry | Docker image storage |

### Integrations

| Service | Purpose |
|---------|---------|
| n8n | Workflow automation (lead processing, notifications) |
| Google Sheets | Lead data storage |
| Gmail | Email notifications |
| WhatsApp Business | SMS/WhatsApp notifications |
| Google Analytics 4 | User analytics |

---

## Data Flow

### Lead Submission Flow

```
User Action
    │
    ├── ChatWizard (buy/sell flow)
    ├── LeadMagnet (email capture)
    └── ConsultForm (full qualification)
           │
           ▼
    ┌─────────────────┐
    │ Client-side     │
    │ Validation      │
    │ • Email format  │
    │ • Phone format  │
    │ • Required flds │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ POST /api/lead  │
    │                 │
    │ Payload:        │
    │ • type          │
    │ • session_id    │
    │ • cta_source    │
    │ • contact       │
    │ • utm params    │
    │ • locale        │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Server-side     │
    │ Processing      │
    │ • Validate      │
    │ • Normalize     │
    │ • Log locally   │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ n8n Webhook     │
    │                 │
    │ • Save to       │
    │   Google Sheets │
    │ • Send email    │
    │ • Send WhatsApp │
    │ • Notify agent  │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Response to     │
    │ Client          │
    │                 │
    │ • Success msg   │
    │ • Lead ID       │
    │ • Next steps    │
    └─────────────────┘
```

---

## Design Decisions

### Why Next.js App Router?

- **Server Components**: Reduced client-side JavaScript
- **Streaming**: Improved perceived performance
- **Parallel Routes**: Better code organization
- **Built-in i18n**: Native support via dynamic route segments

### Why next-intl?

- **Type-safe translations**: Full TypeScript support
- **Middleware routing**: Automatic locale detection
- **Message formatting**: ICU message format support
- **Small bundle**: Minimal client-side impact

### Why Standalone Docker Build?

- **Smaller images**: ~150MB vs ~1GB for node_modules
- **Faster deploys**: Less data to transfer
- **Security**: Only production dependencies included

### Why Traefik?

- **Automatic SSL**: Let's Encrypt integration
- **Docker-native**: Labels-based configuration
- **Zero-downtime**: Rolling updates support
- **Security headers**: Built-in middleware

### Why n8n vs Direct Integrations?

- **Flexibility**: Easy to modify workflows without code changes
- **Visibility**: Visual workflow debugging
- **Multi-channel**: Gmail + WhatsApp + Sheets in one workflow
- **Error handling**: Built-in retry and error paths

---

## Security Considerations

### Input Validation
- All user inputs validated server-side
- Phone numbers normalized (digits only)
- Email format verified via regex

### HTTPS
- All traffic encrypted via Let's Encrypt
- HTTP automatically redirected to HTTPS
- HSTS headers enabled

### Headers
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
```

### Environment Variables
- Secrets stored in `.env` on VPS
- Never committed to repository
- Separate local `.env.local` for development

---

## Performance Optimizations

### Static Generation
- Legal pages are statically generated
- Landing page uses client components for interactivity

### Image Optimization
- Next.js Image component for automatic optimization
- WebP format with JPEG fallback
- Lazy loading for below-fold images

### Bundle Optimization
- Standalone output mode
- Tree shaking via Next.js
- Dynamic imports for modals

### Caching
- Static assets cached indefinitely (hashed filenames)
- API responses not cached (real-time data)

---

## File Structure Overview

```
src/
├── app/
│   ├── [locale]/           # Localized pages
│   │   ├── page.tsx        # Landing page
│   │   ├── layout.tsx      # Root layout
│   │   ├── consult/        # Consult page
│   │   ├── screening/      # Screening wizard
│   │   ├── privacy/        # Privacy policy
│   │   ├── terms/          # Terms of service
│   │   └── data-deletion/  # GDPR deletion
│   ├── api/
│   │   ├── lead/           # Lead submission
│   │   ├── screening/      # Screening submission
│   │   └── health/         # Health check
│   └── layout.tsx          # App root layout
├── components/
│   ├── ui/                 # Radix UI primitives
│   ├── consult/            # Consult page sections
│   └── *.tsx               # Section components
├── i18n/
│   ├── routing.ts          # Route configuration
│   ├── request.ts          # Server request handler
│   └── config.ts           # Locale types
├── lib/
│   ├── session.ts          # Session management
│   ├── utm.ts              # UTM tracking
│   ├── validation.ts       # Input validation
│   ├── analytics.ts        # GA4 events
│   └── utils.ts            # General utilities
└── middleware.ts           # i18n middleware
```

---

## Related Documentation

- [Routing & i18n](./routing-and-i18n.md) - Detailed i18n configuration
- [Component Structure](./component-structure.md) - Component organization
- [API Overview](../api/overview.md) - API architecture
- [Deployment Overview](../deployment/overview.md) - Infrastructure details
