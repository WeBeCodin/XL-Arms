# RSR FTP Integration - Complete Deployment Guide

## Current Status

✅ **Code is Ready for Deployment**

All necessary code changes have been implemented:
- FTP client updated to support direct file paths (no list permission required)
- Default file path set to `/keydealer/rsrinventory-keydlr-new.txt`
- Fallback to .zip file if .txt fails
- Cron schedule fixed (daily at 3 AM UTC)
- Documentation created with RSR details

## RSR Key Dealer Account Details

From RSR's email (September 30, 2025):

```
Account: 52417
Password: gLlK9Pxs
Host: ftps.rsrgroup.com
Port: 2222
File Path: /keydealer/rsrinventory-keydlr-new.txt
Zip File: /keydealer/rsrinventory-keydlr-new.zip
```

**Important**: This account has **NO list/read permission** - the code has been updated to handle this.

---

## Quick Deployment (3 Options)

### Option 1: Automated Setup with API Script (Recommended)

1. Get your Vercel token from: https://vercel.com/account/tokens

2. Run the setup script:
```bash
export VERCEL_TOKEN=your_token_here
node scripts/setup-vercel-env-api.js
```

3. Deploy:
```bash
npx vercel --prod
```

### Option 2: Automated Setup with Bash Script

1. Get your Vercel token from: https://vercel.com/account/tokens

2. Run the deployment script:
```bash
export VERCEL_TOKEN=your_token_here
bash scripts/deploy-to-vercel.sh
```

This will:
- Set all environment variables
- Deploy to production
- Test the deployment

### Option 3: Manual Setup via Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Select your `xl-arms` project
3. Navigate to: Settings → Environment Variables
4. Add the following variables for **Production, Preview, and Development**:

```
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

5. Deploy via Vercel dashboard or CLI:
```bash
npx vercel --prod
```

---

## Testing the Deployment

### 1. Check Health Status
```bash
curl https://www.xlarms.us/api/rsr/sync
```

Expected response:
```json
{
  "status": "healthy",
  "lastSync": null,
  "itemCount": 0,
  "isHealthy": false,
  "message": "RSR sync may be outdated - check logs for issues"
}
```

### 2. Trigger Manual Sync
```bash
curl -X POST https://www.xlarms.us/api/rsr/sync
```

Expected response (success):
```json
{
  "success": true,
  "recordsProcessed": 50000,
  "recordsUpdated": 45000,
  "recordsAdded": 5000,
  "errors": [],
  "syncDate": "2025-09-21T...",
  "processingTime": 35000
}
```

### 3. Check Logs
```bash
npx vercel logs https://www.xlarms.us --since 1h
```

Look for:
- ✅ "Connected to RSR FTP server"
- ✅ "Downloading RSR inventory file from: /keydealer/rsrinventory-keydlr-new.txt"
- ✅ "Successfully downloaded X bytes"
- ✅ "RSR sync completed successfully"

### 4. Verify Data
```bash
curl "https://www.xlarms.us/api/rsr/products?page=1&pageSize=5"
```

---

## Troubleshooting

### "FTP connection failed"
- ✅ Verify credentials are set correctly in Vercel
- ✅ Check `RSR_FTP_SECURE=true` is set
- ✅ Ensure port is 2222 (not 21)

### "No inventory file found"
- ✅ Verify `RSR_INVENTORY_FILE=/keydealer/rsrinventory-keydlr-new.txt` is set
- ✅ This is the exact path from RSR's email
- ✅ Code will automatically try .zip if .txt fails

### "LIST failed" or "Permission denied"
- ✅ This is EXPECTED - the account has no list permission
- ✅ Code has been updated to use direct file paths
- ✅ No changes needed

### "Certificate error"
- ✅ Code already has `rejectUnauthorized: false`
- ✅ RSR uses custom certificate (neither CA nor self-signed)
- ✅ No changes needed

---

## Automated Sync Schedule

The cron job is configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/rsr/sync",
      "schedule": "0 3 * * *"
    }
  ]
}
```

This runs daily at **3:00 AM UTC** (compatible with Vercel Hobby plan).

---

## Security Notes

### Credential Protection
- ✅ Never commit credentials to git (already in `.gitignore`)
- ✅ Credentials stored as Vercel environment variables (encrypted)
- ✅ Mark `RSR_FTP_PASSWORD` as sensitive in Vercel dashboard

### Access Control
- The RSR FTP account is customer-restricted
- No IP allowlisting required
- Standard RSR customer access

---

## What Was Changed

### 1. FTP Client (`src/lib/rsr/ftp-client.ts`)
- ✅ Updated `getInventoryFile()` to use direct file paths
- ✅ Added environment variable support for custom paths
- ✅ Added automatic fallback from .txt to .zip
- ✅ Updated connection checks to use `SIZE` instead of `LIST`
- ✅ Default path set to `/keydealer/rsrinventory-keydlr-new.txt`

### 2. Configuration (`vercel.json`)
- ✅ Fixed cron schedule (daily at 3 AM UTC instead of every 6 hours)
- ✅ Compatible with Vercel Hobby plan

### 3. Documentation
- ✅ Created `docs/RSR_FTP_CONFIG.md` with RSR email details
- ✅ Updated `.env.local.example` with correct defaults
- ✅ This deployment guide

### 4. Deployment Scripts
- ✅ `scripts/setup-vercel-env.sh` - Bash script for env setup
- ✅ `scripts/deploy-to-vercel.sh` - Full automated deployment
- ✅ `scripts/setup-vercel-env-api.js` - API-based env setup (most reliable)

---

## Next Steps After Deployment

1. **Monitor First Sync**
   - Check Vercel logs for the first sync execution
   - Verify all 50,000+ records are processed
   - Look for any parsing errors

2. **Verify Database**
   - Ensure Vercel KV or Postgres is connected
   - Check record counts match expectations
   - Test product search API

3. **Set Up Monitoring**
   - Add health check monitoring (Uptime Robot, etc.)
   - Set up alerts for sync failures
   - Monitor storage usage

4. **Optional: Test Local Development**
   ```bash
   # Copy environment variables
   cp .env.local.example .env.local
   # Edit with actual values
   
   # Test connection
   npx tsx scripts/test-rsr-connection.ts
   ```

---

## Support Contacts

### RSR Support
**Karl Seglins**  
IT Integration Specialist  
kseglins@rsrgroup.com  
(407) 677-6114

### Documentation
- [RSR_FTP_CONFIG.md](./docs/RSR_FTP_CONFIG.md) - Complete RSR details
- [RSR_FTP_INTEGRATION.md](./docs/RSR_FTP_INTEGRATION.md) - Integration guide
- [SECURITY_SETUP.md](./docs/SECURITY_SETUP.md) - Security best practices

---

## Summary

✅ All code is ready  
✅ RSR credentials documented  
✅ Deployment scripts created  
✅ Testing procedures defined  

**You can deploy right now using any of the 3 options above!**
