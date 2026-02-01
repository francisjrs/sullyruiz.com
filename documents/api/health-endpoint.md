# Health Endpoint

**Endpoint:** `GET /api/health`
**File:** `src/app/api/health/route.ts`

---

## Overview

The health endpoint provides a simple health check for container monitoring and uptime verification.

---

## Request

```
GET /api/health
```

No headers or parameters required.

---

## Response

### Success (200)

```json
{
  "status": "healthy",
  "timestamp": "2024-01-31T12:00:00.000Z"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Always "healthy" if responding |
| `timestamp` | string | ISO 8601 timestamp of response |

---

## Implementation

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  })
}
```

---

## Usage

### Docker Health Check

Configured in `docker-compose.yml`:

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
| `interval` | 30s | Check every 30 seconds |
| `timeout` | 10s | Fail if no response within 10 seconds |
| `retries` | 3 | Mark unhealthy after 3 consecutive failures |
| `start_period` | 40s | Grace period on container startup |

### Manual Check

```bash
curl https://sullyruiz.com/api/health
```

Expected output:
```json
{"status":"healthy","timestamp":"2024-01-31T12:00:00.000Z"}
```

### Container Status

```bash
docker ps
```

Shows health status:
```
CONTAINER ID   IMAGE          STATUS                    NAMES
abc123         sullyruiz...   Up 2 days (healthy)       sullyruiz-app
```

---

## Monitoring

### Uptime Monitoring Services

The health endpoint can be monitored by:
- UptimeRobot
- Pingdom
- StatusCake
- Custom scripts

### Alert Configuration

Example monitoring setup:
- Check: `GET https://sullyruiz.com/api/health`
- Interval: 60 seconds
- Alert if: Response code ≠ 200 for 3 checks

---

## Extending Health Checks

### Adding Database Checks

If needed, extend to check database connectivity:

```typescript
export async function GET() {
  const checks = {
    app: 'healthy',
    timestamp: new Date().toISOString(),
  }

  // Example: Check database
  try {
    await db.query('SELECT 1')
    checks.database = 'healthy'
  } catch {
    checks.database = 'unhealthy'
  }

  const isHealthy = Object.values(checks).every(
    v => v === 'healthy' || v instanceof Date
  )

  return NextResponse.json(checks, {
    status: isHealthy ? 200 : 503,
  })
}
```

### Adding External Service Checks

```typescript
// Check n8n availability
try {
  const response = await fetch(process.env.N8N_WEBHOOK_URL, {
    method: 'HEAD',
    signal: AbortSignal.timeout(5000),
  })
  checks.n8n = response.ok ? 'healthy' : 'unhealthy'
} catch {
  checks.n8n = 'unreachable'
}
```

---

## Troubleshooting

### Health Check Failing

1. **Container not starting:**
   ```bash
   docker compose logs app --tail=50
   ```

2. **Port not bound:**
   ```bash
   docker exec sullyruiz-app netstat -tlnp
   ```

3. **Application error:**
   ```bash
   docker exec sullyruiz-app wget -q -O - http://localhost:3000/api/health
   ```

4. **Network issue:**
   ```bash
   curl -v http://localhost:3000/api/health
   ```

### Container Marked Unhealthy

1. Check logs for errors:
   ```bash
   docker compose logs app | grep -i error
   ```

2. Restart container:
   ```bash
   docker compose restart app
   ```

3. Full restart:
   ```bash
   docker compose down && docker compose up -d
   ```

---

## Related Documentation

- [Deployment Overview](../deployment/overview.md) - Infrastructure
- [Docker](../deployment/docker.md) - Container configuration
- [VPS Management](../deployment/vps-management.md) - Server administration
