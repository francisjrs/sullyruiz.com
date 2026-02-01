# GitHub Actions

This document covers the CI/CD pipeline for automatic deployment.

**File:** `.github/workflows/deploy.yml`

---

## Overview

Push to `main` branch triggers automatic deployment:
1. Build Docker image
2. Push to GitHub Container Registry
3. SSH to VPS and deploy

---

## Workflow Configuration

```yaml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=raw,value=latest

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/sullyruiz
            docker compose pull
            docker compose up -d
            docker image prune -f
```

---

## Workflow Steps

### 1. Checkout Code

```yaml
- name: Checkout code
  uses: actions/checkout@v4
```

Clones the repository to the runner.

### 2. Set up Docker Buildx

```yaml
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3
```

Enables advanced Docker build features:
- Multi-platform builds
- Build caching
- Better layer management

### 3. Login to GHCR

```yaml
- name: Login to GitHub Container Registry
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}
```

Authenticates with GitHub Container Registry using the automatic `GITHUB_TOKEN`.

### 4. Extract Metadata

```yaml
- name: Extract metadata
  id: meta
  uses: docker/metadata-action@v5
  with:
    images: ghcr.io/${{ github.repository }}
    tags: |
      type=raw,value=latest
```

Generates Docker image tags. Currently uses only `latest`.

### 5. Build and Push

```yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: ${{ steps.meta.outputs.tags }}
    labels: ${{ steps.meta.outputs.labels }}
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

Builds the Docker image and pushes to GHCR:
- Uses GitHub Actions cache for faster builds
- Pushes to `ghcr.io/francisjrs/sullyruiz.com:latest`

### 6. Deploy to VPS

```yaml
- name: Deploy to VPS
  uses: appleboy/ssh-action@v1.0.0
  with:
    host: ${{ secrets.VPS_HOST }}
    username: ${{ secrets.VPS_USERNAME }}
    key: ${{ secrets.VPS_SSH_KEY }}
    script: |
      cd /opt/sullyruiz
      docker compose pull
      docker compose up -d
      docker image prune -f
```

SSHs to VPS and:
1. Navigates to app directory
2. Pulls latest image
3. Restarts containers
4. Cleans up old images

---

## Secrets Configuration

Required secrets in repository settings:

| Secret | Description | Example |
|--------|-------------|---------|
| `VPS_HOST` | VPS IP address | `31.220.22.215` |
| `VPS_USERNAME` | SSH username | `root` |
| `VPS_SSH_KEY` | Private SSH key | `-----BEGIN OPENSSH...` |

### Adding Secrets

1. Go to repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each secret

### Generating SSH Key

```bash
# Generate new key pair
ssh-keygen -t ed25519 -C "github-actions-deploy" -f github_deploy

# Add public key to VPS
cat github_deploy.pub >> ~/.ssh/authorized_keys

# Copy private key content for secret
cat github_deploy
```

---

## Trigger Conditions

### Current Trigger

```yaml
on:
  push:
    branches:
      - main
```

Runs on every push to `main`.

### Alternative Triggers

**Manual trigger:**
```yaml
on:
  workflow_dispatch:
```

**On release:**
```yaml
on:
  release:
    types: [published]
```

**On pull request merge:**
```yaml
on:
  pull_request:
    branches:
      - main
    types:
      - closed
```

---

## Caching

### Build Cache

```yaml
cache-from: type=gha
cache-to: type=gha,mode=max
```

Uses GitHub Actions cache to speed up builds:
- Caches Docker layers
- Reduces build time significantly
- Automatically expires after 7 days

### Cache Size

GitHub Actions cache limit: 10 GB per repository

---

## Monitoring Deployments

### Workflow Runs

View at: `https://github.com/[owner]/[repo]/actions`

### Deployment Status

Each run shows:
- Build logs
- Push status
- SSH command output

### Notifications

Set up notifications for workflow failures:
1. Repository → Settings → Notifications
2. Enable "Actions" notifications

---

## Troubleshooting

### Build Failures

**Symptom:** Build step fails

**Check:**
```bash
# View workflow logs in GitHub Actions UI
# Look for error messages in build output
```

**Common causes:**
- Dependency installation failure
- TypeScript errors
- Missing environment variables

### Push Failures

**Symptom:** Image push fails

**Check:**
- GHCR authentication
- Repository permissions
- Package visibility settings

**Fix:**
1. Go to Package settings
2. Ensure repository has write access

### SSH Failures

**Symptom:** Deploy step fails

**Check:**
```bash
# Test SSH manually
ssh -i your_key root@31.220.22.215
```

**Common causes:**
- Wrong SSH key
- Key not authorized on VPS
- Network/firewall issues
- VPS out of disk space

### Container Restart Failures

**Symptom:** `docker compose up -d` fails

**Check VPS:**
```bash
ssh root@31.220.22.215
cd /opt/sullyruiz
docker compose logs --tail=50
```

**Common causes:**
- Missing environment variables
- Port conflicts
- Out of memory

---

## Rolling Back

### Revert Commit

```bash
git revert HEAD
git push origin main
```

### Manual Rollback on VPS

```bash
ssh root@31.220.22.215
cd /opt/sullyruiz

# If previous image is still available
docker images | grep sullyruiz

# Pull specific version (if tagged)
docker pull ghcr.io/francisjrs/sullyruiz.com:previous-tag
docker compose up -d
```

---

## Security Considerations

### Secrets Protection

- Secrets are masked in logs
- Never print secrets in workflow
- Rotate keys periodically

### SSH Key Security

- Use dedicated deploy key
- Limit key permissions on VPS
- Don't use personal keys

### Image Security

- Scan images for vulnerabilities
- Use official base images
- Keep dependencies updated

---

## Extending the Workflow

### Add Testing

```yaml
- name: Run tests
  run: npm test
```

### Add Linting

```yaml
- name: Run linter
  run: npm run lint
```

### Add Notifications

```yaml
- name: Notify Slack
  uses: slackapi/slack-github-action@v1
  with:
    channel-id: 'deploy-notifications'
    slack-message: 'Deployment completed!'
  env:
    SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
```

---

## Related Documentation

- [Deployment Overview](./overview.md) - Infrastructure architecture
- [Docker](./docker.md) - Container configuration
- [VPS Management](./vps-management.md) - Server administration
