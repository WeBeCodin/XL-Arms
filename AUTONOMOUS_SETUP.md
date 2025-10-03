# 🚀 RSR FTP Integration - Ready to Deploy

## TL;DR - Quick Start

**All code is ready. RSR credentials configured. Just run one command:**

```bash
bash scripts/setup-autonomous.sh
```

This will guide you through deployment options and handle everything automatically.

---

## What's Been Done

✅ **Code Updated** - FTP client handles Key Dealer account (no list permission)  
✅ **RSR Credentials** - Account 52417, configured from email response  
✅ **File Path Set** - `/keydealer/rsrinventory-keydlr-new.txt`  
✅ **Fallback Added** - Automatically tries .zip if .txt fails  
✅ **Cron Fixed** - Daily sync at 3 AM UTC (Hobby plan compatible)  
✅ **Deployment Scripts** - 3 automated options created  
✅ **GitHub Actions** - Workflow ready for fully automated deployments  
✅ **Documentation** - Complete guides for all scenarios  

---

## Choose Your Deployment Path

### Option 1: Fully Automated (Recommended)

Run the master setup script:

```bash
bash scripts/setup-autonomous.sh
```

Choose from:
1. **GitHub Actions** - Set up once, auto-deploy forever
2. **Local with Node.js** - API-based setup and deployment
3. **Local with Vercel CLI** - Traditional vercel command
4. **Manual Dashboard** - Browser-based configuration
5. **Show me everything** - Display all credentials and instructions

### Option 2: Direct Deployment (If you have VERCEL_TOKEN)

```bash
# Set your Vercel token
export VERCEL_TOKEN=your_token_here

# Run automated deployment
node scripts/setup-vercel-env-api.js
npx vercel --prod
```

### Option 3: GitHub Actions (Best for CI/CD)

1. Add secrets to GitHub repo
2. Trigger workflow from Actions tab
3. Done!

See: [.github/workflows/README.md](.github/workflows/README.md)

---

## RSR Account Information

**From RSR's email (September 30, 2025):**

```
Account: 52417
Password: gLlK9Pxs
Host: ftps.rsrgroup.com
Port: 2222
File: /keydealer/rsrinventory-keydlr-new.txt
```

⚠️ **Important**: This Key Dealer account has **NO list/read permission**  
✅ **Solution**: Code updated to use direct file paths (already done)

---

## Environment Variables

These will be set automatically by the scripts, or manually via Vercel dashboard:

```bash
RSR_FTP_HOST=ftps.rsrgroup.com
RSR_FTP_PORT=2222
RSR_FTP_USER=52417
RSR_FTP_PASSWORD=gLlK9Pxs
RSR_FTP_SECURE=true
RSR_INVENTORY_FILE=/keydealer/rsrinventory-keydlr-new.txt
RSR_USE_KV=false
RSR_SYNC_ENABLED=true
RSR_MAX_RECORDS=50000
RSR_BATCH_SIZE=100
```

---

## Testing After Deployment

```bash
# Check health
curl https://www.xlarms.us/api/rsr/sync

# Trigger manual sync
curl -X POST https://www.xlarms.us/api/rsr/sync

# View logs
npx vercel logs https://www.xlarms.us --since 1h

# Test products API
curl "https://www.xlarms.us/api/rsr/products?page=1&pageSize=5"
```

---

## Documentation

| File | Purpose |
|------|---------|
| **DEPLOYMENT_READY.md** | Complete deployment guide with all options |
| **docs/RSR_FTP_CONFIG.md** | RSR email response and configuration details |
| **docs/RSR_FTP_INTEGRATION.md** | Technical integration documentation |
| **.github/workflows/README.md** | GitHub Actions setup instructions |

---

## Scripts Available

| Script | Purpose |
|--------|---------|
| **scripts/setup-autonomous.sh** | Interactive master setup (start here!) |
| **scripts/setup-vercel-env-api.js** | Node.js API-based env setup |
| **scripts/deploy-to-vercel.sh** | Bash automated deployment |
| **scripts/setup-vercel-env.sh** | Bash env setup only |

---

## Troubleshooting

**"No VERCEL_TOKEN"**
- Get token from: https://vercel.com/account/tokens
- Run: `export VERCEL_TOKEN=your_token`

**"Project not found"**
- Run: `npx vercel link`
- Copy IDs from `.vercel/project.json`

**"FTP connection failed"**
- Credentials are already correct (from RSR email)
- Check Vercel environment variables are set
- See logs: `npx vercel logs https://www.xlarms.us`

**"No inventory file found"**
- This shouldn't happen - file path is hardcoded
- Code automatically tries .zip if .txt fails
- Check Vercel logs for exact error

---

## Support

**RSR Support:**  
Karl Seglins  
kseglins@rsrgroup.com  
(407) 677-6114

**Integration Issues:**  
See documentation in `docs/` directory

---

## What Happens Next

Once deployed:

1. ✅ Automatic daily sync at 3 AM UTC
2. ✅ Health monitoring via `/api/rsr/sync` (GET)
3. ✅ Manual sync trigger via `/api/rsr/sync` (POST)
4. ✅ Products API for searching inventory
5. ✅ Logs available via Vercel dashboard

---

## Quick Sanity Check

Before deploying, verify:

- [ ] You have a Vercel account
- [ ] You have a Vercel token OR can run `vercel login`
- [ ] The `xl-arms` project exists in Vercel
- [ ] You've chosen a deployment method from above

If all checked, run:

```bash
bash scripts/setup-autonomous.sh
```

**That's it! The script handles everything else.**

---

## License

See LICENSE file in repository root.

## Questions?

1. Read [DEPLOYMENT_READY.md](DEPLOYMENT_READY.md) - comprehensive guide
2. Check [docs/RSR_FTP_CONFIG.md](docs/RSR_FTP_CONFIG.md) - RSR details
3. Review [.github/workflows/README.md](.github/workflows/README.md) - GitHub Actions setup

Everything you need is documented. Just pick a deployment method and go! 🚀
