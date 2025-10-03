# RSR FTP Integration - Deployment Scripts

This directory contains automated deployment scripts for the RSR FTP integration.

---

## 🚀 Quick Start

**Run this first:**

```bash
bash scripts/setup-autonomous.sh
```

This interactive script guides you through all deployment options.

---

## 📜 Available Scripts

### 1. `setup-autonomous.sh` ⭐ **START HERE**

**Interactive master setup script with 5 deployment options**

```bash
bash scripts/setup-autonomous.sh
```

**Features:**
- Interactive menu with 5 deployment methods
- Checks prerequisites (Node.js, npm)
- Guides through credentials setup
- Colored output for easy reading
- Complete error handling

**Use this if:** You want an easy, guided setup experience.

---

### 2. `setup-vercel-env-api.js`

**Node.js script for API-based environment variable setup**

```bash
export VERCEL_TOKEN=your_token_here
node scripts/setup-vercel-env-api.js
```

**Features:**
- Uses Vercel REST API directly
- Sets all 10 required environment variables
- Automatically finds your project
- Masks sensitive values in output
- Most reliable method

**Use this if:** You have VERCEL_TOKEN and want automated setup.

---

### 3. `deploy-to-vercel.sh`

**Full automated deployment script (Bash)**

```bash
export VERCEL_TOKEN=your_token_here
bash scripts/deploy-to-vercel.sh
```

**Features:**
- Sets environment variables
- Deploys to production
- Tests the deployment
- All-in-one solution

**Use this if:** You want complete automation with one command.

---

### 4. `setup-vercel-env.sh`

**Environment variable setup only (Bash)**

```bash
# After vercel login or with VERCEL_TOKEN
bash scripts/setup-vercel-env.sh
```

**Features:**
- Sets environment variables via Vercel CLI
- No deployment
- Uses `vercel env add` commands

**Use this if:** You want to set env vars separately from deployment.

---

## 🔐 Required Credentials

### Vercel Token

Get from: https://vercel.com/account/tokens

**Set as environment variable:**
```bash
export VERCEL_TOKEN=your_token_here
```

**Or use Vercel CLI:**
```bash
npx vercel login
```

---

## 📋 Environment Variables

All scripts configure these variables in Vercel:

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

These are automatically set - you don't need to configure them manually.

---

## 🔄 Deployment Flow

### Option 1: Interactive (Recommended)

```
setup-autonomous.sh
    ↓
Choose deployment method
    ↓
Follow guided steps
    ↓
Deployed! ✅
```

### Option 2: API-based

```
Export VERCEL_TOKEN
    ↓
setup-vercel-env-api.js
    ↓
npx vercel --prod
    ↓
Deployed! ✅
```

### Option 3: All-in-one Bash

```
Export VERCEL_TOKEN
    ↓
deploy-to-vercel.sh
    ↓
Deployed! ✅
```

---

## 🧪 Testing After Deployment

```bash
# Check health
curl https://www.xlarms.us/api/rsr/sync

# Trigger sync
curl -X POST https://www.xlarms.us/api/rsr/sync

# View logs
npx vercel logs https://www.xlarms.us --since 1h

# Test products
curl "https://www.xlarms.us/api/rsr/products?page=1&pageSize=5"
```

---

## 🐛 Troubleshooting

### "VERCEL_TOKEN not found"

**Solution:**
```bash
# Get token from: https://vercel.com/account/tokens
export VERCEL_TOKEN=your_token_here
```

### "Project not found"

**Solution:**
```bash
# Link to your Vercel project
npx vercel link

# Use IDs from .vercel/project.json
export VERCEL_PROJECT_ID=prj_xxx
```

### "Permission denied" on scripts

**Solution:**
```bash
# Make scripts executable
chmod +x scripts/*.sh scripts/*.js
```

### Script hangs or freezes

**Solution:**
- Press Ctrl+C to cancel
- Check VERCEL_TOKEN is valid
- Verify network connection
- Try interactive setup: `bash scripts/setup-autonomous.sh`

---

## 📚 Documentation

- **AUTONOMOUS_SETUP.md** - Quick start guide (in repository root)
- **DEPLOYMENT_READY.md** - Detailed deployment guide
- **docs/RSR_FTP_CONFIG.md** - RSR configuration details
- **.github/workflows/README.md** - GitHub Actions setup

---

## 🔒 Security Notes

- Never commit VERCEL_TOKEN to git
- Tokens are sensitive - treat like passwords
- Revoke old tokens periodically
- Use environment variables, not hardcoded values

---

## 💡 Tips

1. **First time?** Use `setup-autonomous.sh` - it's the easiest
2. **Have VERCEL_TOKEN?** Use `setup-vercel-env-api.js` - it's the fastest
3. **Want CI/CD?** Use GitHub Actions (see `.github/workflows/`)
4. **Having issues?** Read `AUTONOMOUS_SETUP.md` first

---

## 🆘 Support

**For script issues:**
- Check documentation in repository root
- Verify prerequisites (Node.js, npm)
- Try interactive setup first

**For RSR integration issues:**
- See `docs/RSR_FTP_CONFIG.md`
- Contact RSR: kseglins@rsrgroup.com

---

## 📝 Script Comparison

| Script | Requires Token | Interactive | Sets Env Vars | Deploys | Best For |
|--------|---------------|-------------|---------------|---------|----------|
| `setup-autonomous.sh` | No* | ✅ Yes | ✅ Yes | ✅ Yes | First-time users |
| `setup-vercel-env-api.js` | ✅ Yes | ❌ No | ✅ Yes | ❌ No | Automation |
| `deploy-to-vercel.sh` | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes | One-command deploy |
| `setup-vercel-env.sh` | Yes** | ❌ No | ✅ Yes | ❌ No | Env setup only |

\* Prompts for token if not set  
\** Can use `vercel login` instead

---

## ✨ Summary

**For most users:**
```bash
bash scripts/setup-autonomous.sh
```

**For automation:**
```bash
export VERCEL_TOKEN=your_token
node scripts/setup-vercel-env-api.js
npx vercel --prod
```

**That's it!** Choose your preferred method and deploy. 🚀
