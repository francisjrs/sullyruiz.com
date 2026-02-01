# Docker Configuration

This document covers the Dockerfile and docker-compose setup for sullyruiz.com.

---

## Dockerfile

**File:** `Dockerfile`

### Build Strategy

Uses multi-stage build for optimized image size:

1. **Builder stage:** Compiles the Next.js application
2. **Runner stage:** Minimal production image

### Full Dockerfile

```dockerfile
# Builder stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Set build-time environment
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Runner stage
FROM node:22-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
```

### Key Features

#### Multi-stage Build

| Stage | Purpose | Size Impact |
|-------|---------|-------------|
| Builder | Compile app with all dev dependencies | ~1GB |
| Runner | Only production runtime | ~150MB |

#### Standalone Output

Next.js `output: 'standalone'` mode creates a self-contained build:
- Includes only necessary node_modules
- No need for full npm install in production
- Single `server.js` entry point

#### Non-root User

Security best practice:
```dockerfile
RUN adduser --system --uid 1001 nextjs
USER nextjs
```

---

## Docker Compose

**File:** `docker-compose.yml`

### Full Configuration

```yaml
services:
  traefik:
    image: traefik:2.11
    container_name: traefik
    restart: unless-stopped
    command:
      - "--api.insecure=false"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--entrypoints.web.http.redirections.entrypoint.to=websecure"
      - "--entrypoints.web.http.redirections.entrypoint.scheme=https"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=${SSL_EMAIL}"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./letsencrypt:/letsencrypt"
    networks:
      - web

  app:
    image: ghcr.io/francisjrs/sullyruiz.com:latest
    container_name: sullyruiz-app
    restart: unless-stopped
    env_file:
      - .env
    labels:
      - "traefik.enable=true"
      # Main domain
      - "traefik.http.routers.sullyruiz.rule=Host(`${DOMAIN_NAME}`)"
      - "traefik.http.routers.sullyruiz.entrypoints=websecure"
      - "traefik.http.routers.sullyruiz.tls.certresolver=letsencrypt"
      # WWW redirect
      - "traefik.http.routers.sullyruiz-www.rule=Host(`www.${DOMAIN_NAME}`)"
      - "traefik.http.routers.sullyruiz-www.entrypoints=websecure"
      - "traefik.http.routers.sullyruiz-www.tls.certresolver=letsencrypt"
      - "traefik.http.routers.sullyruiz-www.middlewares=www-redirect"
      - "traefik.http.middlewares.www-redirect.redirectregex.regex=^https://www\\.(.+)"
      - "traefik.http.middlewares.www-redirect.redirectregex.replacement=https://$${1}"
      - "traefik.http.middlewares.www-redirect.redirectregex.permanent=true"
      # Security headers
      - "traefik.http.middlewares.security-headers.headers.stsSeconds=31536000"
      - "traefik.http.middlewares.security-headers.headers.stsIncludeSubdomains=true"
      - "traefik.http.middlewares.security-headers.headers.browserXssFilter=true"
      - "traefik.http.middlewares.security-headers.headers.contentTypeNosniff=true"
      - "traefik.http.routers.sullyruiz.middlewares=security-headers"
      # Service
      - "traefik.http.services.sullyruiz.loadbalancer.server.port=3000"
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - web

networks:
  web:
    driver: bridge
```

---

## Service Configuration

### Traefik

#### Purpose
- Reverse proxy
- SSL termination
- HTTP → HTTPS redirect
- www → non-www redirect
- Security headers

#### Ports

| Port | Protocol | Purpose |
|------|----------|---------|
| 80 | HTTP | Redirect to HTTPS |
| 443 | HTTPS | Main traffic |

#### Volumes

| Path | Purpose |
|------|---------|
| `/var/run/docker.sock` | Docker socket for container discovery |
| `./letsencrypt` | SSL certificate storage |

#### SSL Configuration

```yaml
# ACME/Let's Encrypt
--certificatesresolvers.letsencrypt.acme.tlschallenge=true
--certificatesresolvers.letsencrypt.acme.email=${SSL_EMAIL}
--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json
```

### App (Next.js)

#### Image

```yaml
image: ghcr.io/francisjrs/sullyruiz.com:latest
```

Built and pushed by GitHub Actions on each deployment.

#### Environment

```yaml
env_file:
  - .env
```

Loads environment variables from `/opt/sullyruiz/.env`.

#### Health Check

```yaml
healthcheck:
  test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

| Parameter | Value | Description |
|-----------|-------|-------------|
| interval | 30s | Check every 30 seconds |
| timeout | 10s | Fail if no response in 10s |
| retries | 3 | Mark unhealthy after 3 failures |
| start_period | 40s | Grace period on startup |

---

## Routing Configuration

### Main Domain

```yaml
# Route: sullyruiz.com → app:3000
- "traefik.http.routers.sullyruiz.rule=Host(`${DOMAIN_NAME}`)"
- "traefik.http.routers.sullyruiz.entrypoints=websecure"
- "traefik.http.routers.sullyruiz.tls.certresolver=letsencrypt"
```

### WWW Redirect

```yaml
# Route: www.sullyruiz.com → sullyruiz.com
- "traefik.http.middlewares.www-redirect.redirectregex.regex=^https://www\\.(.+)"
- "traefik.http.middlewares.www-redirect.redirectregex.replacement=https://$${1}"
- "traefik.http.middlewares.www-redirect.redirectregex.permanent=true"
```

### Security Headers

```yaml
- "traefik.http.middlewares.security-headers.headers.stsSeconds=31536000"
- "traefik.http.middlewares.security-headers.headers.stsIncludeSubdomains=true"
- "traefik.http.middlewares.security-headers.headers.browserXssFilter=true"
- "traefik.http.middlewares.security-headers.headers.contentTypeNosniff=true"
```

| Header | Value | Purpose |
|--------|-------|---------|
| HSTS | 1 year | Force HTTPS |
| X-XSS-Protection | 1; mode=block | XSS filtering |
| X-Content-Type-Options | nosniff | Prevent MIME sniffing |

---

## Commands

### Start Services

```bash
cd /opt/sullyruiz
docker compose up -d
```

### Stop Services

```bash
docker compose down
```

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f app
docker compose logs -f traefik
```

### Pull Latest Image

```bash
docker compose pull
docker compose up -d
```

### Restart Services

```bash
docker compose restart

# Or full restart
docker compose down && docker compose up -d
```

### Check Health

```bash
# Container status
docker ps

# Health check
curl https://sullyruiz.com/api/health
```

---

## Building Locally

### Build Image

```bash
docker build -t sullyruiz .
```

### Run Locally

```bash
docker run -p 3000:3000 --env-file .env.local sullyruiz
```

### Test Health Check

```bash
curl http://localhost:3000/api/health
```

---

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker compose logs app --tail=50

# Check container status
docker ps -a

# Inspect container
docker inspect sullyruiz-app
```

### SSL Certificate Issues

```bash
# Check certificate status
cat /opt/sullyruiz/letsencrypt/acme.json | jq '.letsencrypt.Certificates'

# Force certificate renewal
rm /opt/sullyruiz/letsencrypt/acme.json
docker compose restart traefik
```

### Health Check Failing

```bash
# Test inside container
docker exec sullyruiz-app wget -q -O - http://localhost:3000/api/health

# Check app logs
docker compose logs app --tail=100 | grep -i error
```

### Out of Disk Space

```bash
# Clean unused images
docker image prune -a

# Clean all unused resources
docker system prune -a
```

---

## Related Documentation

- [Deployment Overview](./overview.md) - Infrastructure architecture
- [GitHub Actions](./github-actions.md) - CI/CD pipeline
- [VPS Management](./vps-management.md) - Server administration
- [Environment Variables](../reference/environment-variables.md) - Configuration
