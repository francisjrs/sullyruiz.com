# VPS Management

This document covers server administration for the Hostinger VPS hosting sullyruiz.com.

---

## Server Details

| Property | Value |
|----------|-------|
| Provider | Hostinger |
| IP Address | 31.220.22.215 |
| OS | Ubuntu Linux |
| SSH User | root |
| App Directory | /opt/sullyruiz/ |

---

## SSH Access

### Connection

```bash
ssh -i ~/.ssh/github_deploy root@31.220.22.215
```

### SSH Key Setup

The deployment SSH key is stored at `~/.ssh/github_deploy`.

To add your key to the server:
```bash
ssh-copy-id -i ~/.ssh/your_key root@31.220.22.215
```

---

## Directory Structure

```
/opt/sullyruiz/
├── docker-compose.yml    # Container orchestration
├── .env                  # Environment variables
└── letsencrypt/
    └── acme.json         # SSL certificates
```

---

## Common Operations

### Navigate to App Directory

```bash
cd /opt/sullyruiz
```

### View Container Status

```bash
docker ps
```

Expected output:
```
CONTAINER ID   IMAGE                                    STATUS                    NAMES
abc123         ghcr.io/francisjrs/sullyruiz.com:latest  Up 2 days (healthy)      sullyruiz-app
def456         traefik:2.11                             Up 2 days                 traefik
```

### View Logs

```bash
# All containers
docker compose logs --tail=50

# Follow logs in real-time
docker compose logs -f

# Specific container
docker compose logs app --tail=100
docker compose logs traefik --tail=100

# Filter errors
docker compose logs app 2>&1 | grep -i error
```

### Restart Application

```bash
# Restart containers
docker compose restart

# Full restart (down + up)
docker compose down && docker compose up -d
```

### Pull Latest Deployment

```bash
docker compose pull
docker compose up -d
```

### Clean Up Old Images

```bash
docker image prune -f
```

---

## Environment Variables

### View Current Variables

```bash
cat /opt/sullyruiz/.env
```

### Edit Variables

```bash
nano /opt/sullyruiz/.env
```

After editing:
```bash
docker compose down && docker compose up -d
```

### Required Variables

```bash
# n8n Integration
N8N_WEBHOOK_URL=https://...
N8N_SCREENING_WEBHOOK_URL=https://...
N8N_LEAD_LOOKUP_WEBHOOK_URL=https://...

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...

# SSL
DOMAIN_NAME=sullyruiz.com
SSL_EMAIL=your-email@example.com
```

---

## Health Monitoring

### Check Application Health

```bash
curl https://sullyruiz.com/api/health
```

Expected response:
```json
{"status":"healthy","timestamp":"2024-01-31T12:00:00.000Z"}
```

### Check Container Health

```bash
docker inspect sullyruiz-app --format='{{.State.Health.Status}}'
```

Expected: `healthy`

### Check Resource Usage

```bash
# CPU and memory per container
docker stats

# System memory
free -h

# Disk space
df -h
```

---

## Troubleshooting

### Application Not Responding

1. Check container status:
```bash
docker ps -a
```

2. Check logs for errors:
```bash
docker compose logs app --tail=100
```

3. Restart the application:
```bash
docker compose restart app
```

4. If still failing, full restart:
```bash
docker compose down && docker compose up -d
```

### SSL Certificate Issues

1. Check certificate status:
```bash
cat /opt/sullyruiz/letsencrypt/acme.json | head -50
```

2. Force certificate renewal:
```bash
rm /opt/sullyruiz/letsencrypt/acme.json
docker compose restart traefik
```

3. Check Traefik logs:
```bash
docker compose logs traefik --tail=50
```

### Container Keeps Restarting

1. Check exit code:
```bash
docker inspect sullyruiz-app --format='{{.State.ExitCode}}'
```

2. Check logs before crash:
```bash
docker compose logs app --tail=100
```

3. Common causes:
   - Missing environment variables
   - Port already in use
   - Memory exhaustion

### Health Check Failing

1. Test health endpoint inside container:
```bash
docker exec sullyruiz-app wget -q -O - http://localhost:3000/api/health
```

2. If that fails, check application logs:
```bash
docker compose logs app --tail=50 | grep -i error
```

3. Verify port binding:
```bash
docker exec sullyruiz-app netstat -tlnp
```

### Out of Disk Space

1. Check disk usage:
```bash
df -h
```

2. Clean Docker resources:
```bash
docker system prune -a --volumes
```

3. Clean old log files:
```bash
journalctl --vacuum-time=3d
```

---

## Backup Procedures

### Backup Environment Variables

```bash
cp /opt/sullyruiz/.env /opt/sullyruiz/.env.backup.$(date +%Y%m%d)
```

### Backup SSL Certificates

```bash
tar -czf /root/letsencrypt-backup-$(date +%Y%m%d).tar.gz /opt/sullyruiz/letsencrypt/
```

### Restore from Backup

```bash
# Restore env
cp /opt/sullyruiz/.env.backup.20240131 /opt/sullyruiz/.env

# Restore SSL
tar -xzf /root/letsencrypt-backup-20240131.tar.gz -C /
```

---

## Security

### Firewall Status

```bash
ufw status
```

Ensure ports 80 and 443 are open:
```bash
ufw allow 80
ufw allow 443
```

### SSH Security

Best practices:
- Use key-based authentication only
- Disable password authentication
- Use non-standard SSH port (optional)

### Docker Security

- Containers run as non-root user (nextjs)
- No privileged containers
- Minimal image (Alpine-based)

---

## Useful Commands Reference

| Task | Command |
|------|---------|
| SSH to server | `ssh -i ~/.ssh/github_deploy root@31.220.22.215` |
| Go to app directory | `cd /opt/sullyruiz` |
| View containers | `docker ps` |
| View all logs | `docker compose logs -f` |
| View app logs | `docker compose logs app --tail=100` |
| Restart app | `docker compose restart` |
| Full restart | `docker compose down && docker compose up -d` |
| Pull latest | `docker compose pull && docker compose up -d` |
| Health check | `curl https://sullyruiz.com/api/health` |
| View env vars | `cat .env` |
| Edit env vars | `nano .env` |
| Disk space | `df -h` |
| Memory usage | `free -h` |
| Clean images | `docker image prune -f` |

---

## Emergency Recovery

### Complete Redeploy

If everything is broken:

```bash
cd /opt/sullyruiz

# Stop all containers
docker compose down

# Remove all containers and images
docker system prune -a --volumes

# Pull fresh images
docker compose pull

# Start fresh
docker compose up -d

# Verify
docker ps
curl https://sullyruiz.com/api/health
```

### Rollback to Previous Image

If the latest deployment is broken:

```bash
# List available images
docker images | grep sullyruiz

# Tag previous working image
docker tag ghcr.io/francisjrs/sullyruiz.com:previous-working ghcr.io/francisjrs/sullyruiz.com:latest

# Restart with that image
docker compose up -d
```

---

## Related Documentation

- [Deployment Overview](./overview.md) - Infrastructure architecture
- [Docker](./docker.md) - Container configuration
- [GitHub Actions](./github-actions.md) - CI/CD pipeline
- [Environment Variables](../reference/environment-variables.md) - Configuration
