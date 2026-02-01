# Deployment Overview

This document covers the infrastructure and deployment architecture for sullyruiz.com.

---

## Infrastructure

### Production Environment

| Component | Details |
|-----------|---------|
| Hosting | Hostinger VPS |
| IP Address | 31.220.22.215 |
| OS | Linux (Ubuntu) |
| Domain | sullyruiz.com |
| SSL | Let's Encrypt (auto-renewed) |

### Architecture

```
Internet
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│                        Cloudflare                            │
│                    (DNS, DDoS Protection)                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Hostinger VPS (31.220.22.215)              │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    Docker Network                       │ │
│  │                                                         │ │
│  │  ┌─────────────────────────────────────────────────┐   │ │
│  │  │               Traefik 2.11                       │   │ │
│  │  │                                                  │   │ │
│  │  │  • Reverse proxy                                │   │ │
│  │  │  • SSL termination (Let's Encrypt)              │   │ │
│  │  │  • HTTP → HTTPS redirect                        │   │ │
│  │  │  • www → non-www redirect                       │   │ │
│  │  │  • Security headers                             │   │ │
│  │  │                                                  │   │ │
│  │  │  Ports: 80, 443                                 │   │ │
│  │  └──────────────────────┬──────────────────────────┘   │ │
│  │                         │                               │ │
│  │                         ▼                               │ │
│  │  ┌─────────────────────────────────────────────────┐   │ │
│  │  │            sullyruiz-app (Next.js)              │   │ │
│  │  │                                                  │   │ │
│  │  │  Image: ghcr.io/francisjrs/sullyruiz.com:latest │   │ │
│  │  │  Port: 3000 (internal)                          │   │ │
│  │  │                                                  │   │ │
│  │  │  Health check: GET /api/health                  │   │ │
│  │  └─────────────────────────────────────────────────┘   │ │
│  │                                                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Files:                                                      │
│  • /opt/sullyruiz/.env          (environment variables)     │
│  • /opt/sullyruiz/docker-compose.yml                        │
│  • /opt/sullyruiz/letsencrypt/  (SSL certificates)         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Deployment Flow

```
Developer pushes to main branch
           │
           ▼
┌─────────────────────────────────────────┐
│         GitHub Actions Triggered         │
│                                          │
│  1. Checkout code                        │
│  2. Setup Docker Buildx                  │
│  3. Login to GitHub Container Registry   │
│  4. Build Docker image                   │
│  5. Push to ghcr.io                      │
└─────────────────────┬───────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────┐
│           SSH to VPS                     │
│                                          │
│  1. cd /opt/sullyruiz                    │
│  2. docker compose pull                  │
│  3. docker compose up -d                 │
│  4. docker image prune -f                │
└─────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────┐
│         Health Check                     │
│                                          │
│  GET https://sullyruiz.com/api/health   │
│                                          │
│  Expected: { status: "healthy" }         │
└─────────────────────────────────────────┘
```

---

## Container Configuration

### Docker Images

| Image | Source | Size |
|-------|--------|------|
| sullyruiz-app | ghcr.io/francisjrs/sullyruiz.com:latest | ~150MB |
| traefik | traefik:2.11 | ~100MB |

### Container Health Checks

**Next.js App:**
```yaml
healthcheck:
  test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

---

## SSL Configuration

### Let's Encrypt

Traefik automatically manages SSL certificates:

- **Initial certificate**: Obtained on first request
- **Renewal**: Automatic before expiration
- **Storage**: `/opt/sullyruiz/letsencrypt/acme.json`
- **Email**: Configured via `SSL_EMAIL` env var

### Security Headers

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
```

---

## Environment Variables

### Required on VPS

```bash
# /opt/sullyruiz/.env

# n8n Integration
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/xxxxx
N8N_SCREENING_WEBHOOK_URL=https://your-n8n-instance.com/webhook/xxxxx
N8N_LEAD_LOOKUP_WEBHOOK_URL=https://your-n8n-instance.com/webhook/xxxxx

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# SSL (Traefik)
DOMAIN_NAME=sullyruiz.com
SSL_EMAIL=your-email@example.com
```

### Automatic (Set in Dockerfile)

```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000
HOSTNAME=0.0.0.0
```

---

## GitHub Actions Secrets

Required secrets in repository settings:

| Secret | Description |
|--------|-------------|
| `VPS_HOST` | VPS IP address (31.220.22.215) |
| `VPS_USERNAME` | SSH username (root) |
| `VPS_SSH_KEY` | Private SSH key for deployment |
| `GHCR_TOKEN` | GitHub Container Registry token |

---

## VPS Access

### SSH Connection

```bash
ssh -i ~/.ssh/github_deploy root@31.220.22.215
```

### Common Commands

```bash
# Navigate to app directory
cd /opt/sullyruiz

# View logs
docker compose logs --tail=50
docker compose logs -f  # Follow logs

# View specific container logs
docker compose logs sullyruiz-app --tail=100
docker compose logs traefik --tail=100

# Restart application
docker compose down && docker compose up -d

# Pull latest image
docker compose pull && docker compose up -d

# View running containers
docker ps

# View environment variables
cat .env

# Check disk space
df -h

# Check memory usage
free -m
```

---

## Rollback Procedure

If a deployment fails:

### 1. Check logs for errors

```bash
cd /opt/sullyruiz
docker compose logs --tail=100
```

### 2. Rollback to previous image

```bash
# List available images
docker images | grep sullyruiz

# Pull specific version (if tagged)
docker pull ghcr.io/francisjrs/sullyruiz.com:previous-tag
docker compose up -d
```

### 3. Quick health check

```bash
curl https://sullyruiz.com/api/health
```

---

## Monitoring

### Health Check Endpoint

```bash
curl https://sullyruiz.com/api/health
# Expected: {"status":"healthy","timestamp":"2024-01-31T..."}
```

### Container Status

```bash
docker ps
# Should show: sullyruiz-app (healthy), traefik (running)
```

### Resource Usage

```bash
docker stats
# Shows CPU, memory, network I/O per container
```

---

## Backup Considerations

### What to Backup

| Item | Location | Frequency |
|------|----------|-----------|
| Environment variables | `/opt/sullyruiz/.env` | On change |
| SSL certificates | `/opt/sullyruiz/letsencrypt/` | Weekly |
| docker-compose.yml | `/opt/sullyruiz/docker-compose.yml` | On change |

### Backup Commands

```bash
# Backup env file
cp /opt/sullyruiz/.env /opt/sullyruiz/.env.backup

# Backup SSL certificates
tar -czf letsencrypt-backup.tar.gz /opt/sullyruiz/letsencrypt/
```

---

## Troubleshooting

### Container won't start

```bash
# Check container logs
docker compose logs sullyruiz-app --tail=50

# Check if port is in use
lsof -i :3000

# Restart Docker service
systemctl restart docker
```

### SSL certificate issues

```bash
# Check certificate status
docker compose exec traefik cat /letsencrypt/acme.json | jq

# Force certificate renewal (delete and restart)
rm /opt/sullyruiz/letsencrypt/acme.json
docker compose restart traefik
```

### Health check failing

```bash
# Test health endpoint directly
docker exec sullyruiz-app wget -q -O - http://localhost:3000/api/health

# Check if app is running
docker exec sullyruiz-app ps aux

# Check app logs for errors
docker compose logs sullyruiz-app --tail=100 | grep -i error
```

---

## Related Documentation

- [Docker](./docker.md) - Dockerfile and docker-compose details
- [GitHub Actions](./github-actions.md) - CI/CD pipeline
- [VPS Management](./vps-management.md) - Server administration
- [Environment Variables](../reference/environment-variables.md) - All env vars
