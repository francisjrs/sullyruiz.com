# sullyruiz.com

Personal portfolio/landing page for Sully Ruiz built with Next.js 16.1.4.

## Tech Stack

- **Framework:** Next.js 16.1.4 (App Router)
- **Styling:** Tailwind CSS
- **Internationalization:** next-intl (English/Spanish)
- **Deployment:** Docker on Hostinger VPS with Nginx reverse proxy

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # Locale-specific pages (en, es)
│   └── api/
│       ├── health/        # Health check endpoint for container
│       └── lead/          # Lead capture endpoint
├── components/            # React components
├── i18n/                  # Internationalization config
└── messages/              # Translation files (en.json, es.json)
```

## Development

```bash
npm install
npm run dev
```

## Build & Production

```bash
npm run build
npm start
```

## Docker

```bash
# Build image
docker build -t sullyruiz .

# Run container
docker compose up -d
```

## Deployment

Deployed via GitHub Actions to Hostinger VPS (31.220.22.215).

- Push to `main` branch triggers deployment
- Docker image built and pushed to ghcr.io
- VPS pulls and runs latest image
- Nginx reverse proxy handles SSL termination

## Environment Variables

- `N8N_WEBHOOK_URL` - Webhook URL for lead capture (configured in /opt/sullyruiz/.env on VPS)

## Health Check

```bash
curl https://sullyruiz.com/api/health
```
