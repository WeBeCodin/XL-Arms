# RSR FTP Configuration Summary

**Date**: September 30, 2025  
**Contact**: Karl Seglins (IT Integration Specialist, RSR Group, Inc.)  
**Email**: kseglins@rsrgroup.com  
**Phone**: (407) 677-6114  

## Confirmed FTP Details

### Connection Information
- **Host**: `ftps.rsrgroup.com`
- **Port**: `2222`
- **Protocol**: FTPS (FTP over TLS)
- **Account Number**: `52417`
- **Password**: `gLlK9Pxs`

### Inventory File Locations
- **Text File**: `/keydealer/rsrinventory-keydlr-new.txt`
- **Compressed File**: `/keydealer/rsrinventory-keydlr-new.zip` (alternative)

### Account Permissions & Limitations
- ❌ **No read/list permission** - Cannot list directory contents
- ✅ **Can download files** - Direct file access with exact path
- 🔒 **Access restricted** - FTPS documents restricted to RSR customers only

### TLS Certificate
- Neither public CA nor self-signed (as stated by RSR)
- May require `rejectUnauthorized: false` in secureOptions

### File Generation Schedule
- Details provided in attached `FTP Downloads.pdf` (refer to attachment)

## Required Environment Variables

### Vercel Production Environment
```bash
RSR_FTP_HOST=ftps.rsrgroup.com
RSR_FTP_PORT=2222
RSR_FTP_USER=52417
RSR_FTP_PASSWORD=gLlK9Pxs
RSR_FTP_SECURE=true

# CRITICAL: Must specify exact path since account has no list permission
RSR_INVENTORY_PATH=/keydealer/rsrinventory-keydlr-new.txt

# Optional: Use compressed file instead
# RSR_INVENTORY_PATH=/keydealer/rsrinventory-keydlr-new.zip

# Database and sync settings
RSR_USE_KV=true
RSR_SYNC_ENABLED=true
RSR_MAX_RECORDS=50000
RSR_BATCH_SIZE=100
NODE_ENV=production
```

## Critical Implementation Notes

### 1. No Directory Listing
Since the account does NOT have read/list permission, the integration MUST:
- Use `RSR_INVENTORY_PATH` environment variable with the exact file path
- NOT attempt to call `listFiles()` or directory browsing
- Download the file directly using the provided path

### 2. Current Code Changes Needed
The `getInventoryFile()` method in `src/lib/rsr/ftp-client.ts` already supports `RSR_INVENTORY_PATH`, but you must:
- Remove or skip the `listFiles('/')` call when `RSR_INVENTORY_PATH` is set
- Handle the case where listing fails gracefully

### 3. File Format
- Sample files attached to email: `rsrinventory-keydlr-new-sample.xlsx` and `FTP Downloads.pdf`
- Need to examine the sample file structure to configure the parser
- Determine delimiter, encoding, and column structure

### 4. Compressed File Option
If using the `.zip` file (`/keydealer/rsrinventory-keydlr-new.zip`):
- Add decompression logic to `RSRInventoryParser`
- Use Node.js `zlib` or `adm-zip` module
- Extract the `.txt` file and parse normally

## Testing Checklist

- [ ] Update Vercel environment variables with correct credentials
- [ ] Set `RSR_INVENTORY_PATH=/keydealer/rsrinventory-keydlr-new.txt`
- [ ] Update local `.env.local` for testing
- [ ] Test FTP connection with correct credentials
- [ ] Verify file download works without directory listing
- [ ] Parse sample inventory file to validate format
- [ ] Deploy to Vercel and test production endpoint
- [ ] Monitor sync logs for errors
- [ ] Verify cron job runs successfully

## Next Steps

1. **Update Vercel environment variables** (do this in Vercel dashboard):
   - Go to Project Settings → Environment Variables
   - Update `RSR_FTP_USER` to `52417`
   - Update `RSR_FTP_PASSWORD` to `gLlK9Pxs`
   - Add `RSR_INVENTORY_PATH=/keydealer/rsrinventory-keydlr-new.txt`

2. **Modify FTP client** (if needed):
   - Ensure `getInventoryFile()` doesn't call `listFiles()` when path is provided
   - Handle "permission denied" errors gracefully

3. **Test locally** (if network allows):
   - Run `npx tsx scripts/test-rsr-connection.ts`
   - Verify file downloads successfully

4. **Deploy and test in production**:
   - Push code to trigger Vercel deployment
   - Manually trigger sync: `curl -X POST https://www.xlarms.us/api/rsr/sync`
   - Check Vercel logs for success/errors

5. **Parse sample file**:
   - Extract column structure from `rsrinventory-keydlr-new-sample.xlsx`
   - Update `RSRInventoryParser` configuration if needed

## Contact Information

**For RSR FTP/Integration Issues**:
- Karl Seglins
- Email: kseglins@rsrgroup.com
- Phone: (407) 677-6114
- Fax: (407) 677-4288
