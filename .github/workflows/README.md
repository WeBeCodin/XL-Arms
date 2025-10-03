# GitHub Actions Setup for Vercel Deployment

This directory contains GitHub Actions workflows for automated deployment to Vercel.

## Available Workflows

### `deploy-vercel.yml` - Deploy RSR FTP Integration to Vercel

Automatically deploys the RSR FTP integration to Vercel when changes are pushed to main or manually triggered.

## Setup Instructions

### 1. Required GitHub Secrets

Go to your repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

| Secret Name | Value | Description |
|------------|-------|-------------|
| `VERCEL_TOKEN` | Your Vercel token | Get from https://vercel.com/account/tokens |
| `VERCEL_ORG_ID` | Your Vercel team/org ID | Found in `.vercel/project.json` after running `vercel link` |
| `VERCEL_PROJECT_ID` | Your Vercel project ID | Found in `.vercel/project.json` after running `vercel link` |
| `RSR_FTP_PASSWORD` | `gLlK9Pxs` | RSR FTP password (from email) |

**Optional:**
| Secret Name | Value | Description |
|------------|-------|-------------|
| `SETUP_ENV_VARS` | `true` | Set to `true` on first run to create all env vars |

### 2. Get Vercel IDs

Run locally:
```bash
npx vercel link
```

This creates `.vercel/project.json` with your IDs:
```json
{
  "orgId": "team_xxx",
  "projectId": "prj_xxx"
}
```

Add these as GitHub secrets (without quotes).

### 3. Trigger Deployment

#### Option A: Manual Trigger (Recommended for first deployment)
1. Go to: Actions → Deploy RSR FTP Integration to Vercel
2. Click "Run workflow"
3. Select branch: `main`
4. Click "Run workflow" button

#### Option B: Automatic on Push
Push changes to `main` branch that affect:
- `src/lib/rsr/**`
- `src/app/api/rsr/**`
- `vercel.json`
- `.github/workflows/deploy-vercel.yml`

## First Deployment Checklist

- [ ] Add all required GitHub secrets
- [ ] Set `SETUP_ENV_VARS=true` (for first run only)
- [ ] Trigger workflow manually
- [ ] Check workflow logs for success
- [ ] Test deployment with curl commands
- [ ] Remove or set `SETUP_ENV_VARS=false` after first run

## Troubleshooting

### "Error: No token specified"
- Ensure `VERCEL_TOKEN` secret is set correctly
- Token should start with a long alphanumeric string

### "Error: Project not found"
- Verify `VERCEL_PROJECT_ID` matches your Vercel project
- Run `vercel link` locally to get correct IDs

### "Error: Unauthorized"
- Check token has correct permissions
- Token should have full access or project-specific access

### Environment variables not being set
- Set `SETUP_ENV_VARS=true` in GitHub secrets
- Re-run workflow
- After successful setup, remove this secret or set to `false`

## Manual Deployment Alternative

If GitHub Actions isn't working, use local scripts:

```bash
# Option 1: Node.js API script
export VERCEL_TOKEN=your_token
node scripts/setup-vercel-env-api.js

# Option 2: Bash script
export VERCEL_TOKEN=your_token
bash scripts/deploy-to-vercel.sh

# Option 3: Manual via Vercel Dashboard
# See DEPLOYMENT_READY.md for instructions
```

## Security Notes

- Never commit secrets to git
- GitHub encrypts all secrets
- Secrets are only visible during workflow execution
- Rotate tokens regularly

## Support

See also:
- [DEPLOYMENT_READY.md](../DEPLOYMENT_READY.md) - Complete deployment guide
- [RSR_FTP_CONFIG.md](../docs/RSR_FTP_CONFIG.md) - RSR configuration details
