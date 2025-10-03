# RSR FTP Integration - Implementation Summary

## What We Need From You

### 1. Update Vercel Environment Variables

Go to your Vercel Dashboard → Project `xl-arms` → Settings → Environment Variables and update/add these (for **Production** environment):

```bash
# Update these with correct credentials from RSR
RSR_FTP_USER=52417
RSR_FTP_PASSWORD=gLlK9Pxs

# Add this NEW variable (CRITICAL - required since account has no list permission)
RSR_INVENTORY_PATH=/keydealer/rsrinventory-keydlr-new.txt

# Keep existing variables
RSR_FTP_HOST=ftps.rsrgroup.com
RSR_FTP_PORT=2222
RSR_FTP_SECURE=true
RSR_USE_KV=true
RSR_SYNC_ENABLED=true
RSR_MAX_RECORDS=50000
RSR_BATCH_SIZE=100
```

### 2. Why This Was Failing

**Root Cause**: Your RSR Key Dealer account **does NOT have read/list permission** on the FTP server.

- The code was trying to list directory contents first (`listFiles('/')`) to discover inventory files
- RSR blocked this operation since your account can only download files, not browse directories
- This is why you saw "No inventory file found" errors

**Solution**: Set `RSR_INVENTORY_PATH` with the exact file path so the code downloads directly without listing.

### 3. What Changed in the Code

**File**: `src/lib/rsr/ftp-client.ts`
- Modified `getInventoryFile()` to download directly when `RSR_INVENTORY_PATH` is set
- Added better error handling for "no list permission" accounts
- Falls back to automatic discovery only if path is not provided AND account has list permission

**File**: `src/app/api/rsr/sync/route.ts`
- Added debug mode to expose file list in error responses (for troubleshooting)
- Added `discoveredFileList` variable to capture remote files when available

**File**: `vercel.json`
- Updated cron schedule from `0 */6 * * *` (every 6 hours) to `0 3 * * *` (once daily at 3 AM UTC)
- This is required for Vercel Hobby accounts (only support once-daily cron jobs)

## Testing Steps

### Option A: Test in Production (Recommended)

1. **Update Vercel environment variables** (see section 1 above)

2. **Trigger a manual sync**:
   ```bash
   curl -X POST "https://www.xlarms.us/api/rsr/sync"
   ```

3. **Check the response** - should see:
   ```json
   {
     "success": true,
     "recordsProcessed": 50000,
     "recordsAdded": 50000,
     "syncDate": "2025-10-03T...",
     "processingTime": 15000
   }
   ```

4. **Check health endpoint**:
   ```bash
   curl "https://www.xlarms.us/api/rsr/sync"
   ```

   Should show:
   ```json
   {
     "status": "healthy",
     "lastSync": "2025-10-03T...",
     "itemCount": 50000,
     "isHealthy": true,
     "message": "RSR integration is running normally"
   }
   ```

### Option B: Test Locally (if your machine can reach RSR)

1. **Update local `.env.local`** (already done in workspace)

2. **Run FTP connection test**:
   ```bash
   npx tsx scripts/test-rsr-connection.ts
   ```

3. **Start dev server and test**:
   ```bash
   npm run dev
   # In another terminal:
   curl -X POST "http://localhost:3000/api/rsr/sync"
   ```

## What's Working Now

✅ Environment variables prepared  
✅ FTP client updated to handle "no list permission" accounts  
✅ Exact file path support via `RSR_INVENTORY_PATH`  
✅ Cron schedule adjusted for Hobby account (once daily)  
✅ Better error messages for troubleshooting  
✅ Debug mode available if needed  

## What's Left To Do

### 1. Deploy Code Changes
The updated code is in the workspace but needs to be deployed:
```bash
git add .
git commit -m "Fix RSR FTP integration for key dealer accounts without list permission"
git push origin main
```

Vercel will auto-deploy if your repo is connected.

### 2. Set Vercel Environment Variables
**You must do this manually in Vercel Dashboard** - I cannot automate this step:
- Update `RSR_FTP_USER` to `52417`
- Update `RSR_FTP_PASSWORD` to `gLlK9Pxs`
- Add `RSR_INVENTORY_PATH=/keydealer/rsrinventory-keydlr-new.txt`

### 3. Test the Sync
After deploying and updating environment variables:
```bash
curl -X POST "https://www.xlarms.us/api/rsr/sync"
```

### 4. Monitor Cron Job
The cron job will run automatically once per day at 3 AM UTC. Check Vercel logs the next day to confirm it ran successfully.

### 5. Optional: Parse Sample File
The email included sample files:
- `rsrinventory-keydlr-new-sample.xlsx`
- `FTP Downloads.pdf`

If the parser encounters errors, we may need to examine the sample file structure and adjust the parser configuration (delimiter, columns, encoding).

## Troubleshooting

### If sync still fails after updating environment variables:

1. **Check Vercel logs**:
   ```bash
   npx vercel logs https://www.xlarms.us
   ```

2. **Verify environment variables are set** in Vercel Dashboard

3. **Test FTP connection manually** with a simple script

4. **Contact RSR** if you get "Authentication failed" or "Connection refused":
   - Karl Seglins: kseglins@rsrgroup.com
   - Phone: (407) 677-6114

### Common Error Messages:

- **"Cannot list FTP directory (no read/list permission)"**
  → Set `RSR_INVENTORY_PATH` environment variable

- **"530 Login incorrect"**
  → Double-check username (52417) and password (gLlK9Pxs) in Vercel

- **"Timeout (control socket)"**
  → Network/firewall issue (Vercel should have access, but confirm with RSR)

- **"No such file"**
  → Verify path is `/keydealer/rsrinventory-keydlr-new.txt` (with leading slash)

## Summary

**Key Takeaway**: Your RSR Key Dealer account requires an exact file path (`RSR_INVENTORY_PATH`) because it lacks directory listing permissions. Once you set this environment variable in Vercel, the integration should work.

**Next Action for You**:
1. Go to Vercel Dashboard → xl-arms → Settings → Environment Variables
2. Update/add the three variables listed in section 1
3. Deploy the code changes (git push)
4. Test with `curl -X POST https://www.xlarms.us/api/rsr/sync`
5. Report back any errors or success!

---

**Need Help?**
- Share Vercel logs if sync fails
- Share curl response output
- Contact RSR if authentication issues persist

