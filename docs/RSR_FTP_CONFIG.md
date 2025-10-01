# RSR FTP Integration - Complete Configuration

## Date Received
September 30, 2025

## Contact Information
**Karl Seglins**  
IT Integration Specialist  
RSR Group, Inc.  
Email: kseglins@rsrgroup.com  
Phone: (407) 677-6114  
Fax: (407) 677-4288

---

## Connection Details

### Account Credentials
- **Account Number**: 52417
- **Password**: gLlK9Pxs
- **Host**: ftps.rsrgroup.com
- **Port**: 2222
- **Protocol**: FTPS (FTP over TLS/SSL)

### File Locations
- **Text File**: `/keydealer/rsrinventory-keydlr-new.txt`
- **Zip File**: `/keydealer/rsrinventory-keydlr-new.zip`

---

## Important Account Limitations

### ⚠️ No List/Read Permission
**Critical**: This account does **NOT** have read/list permission on the FTP server.

**What this means:**
- You CANNOT list directory contents (`LIST`, `NLST` commands will fail)
- You MUST use direct file paths to download files
- File discovery/browsing is not possible

**Implementation Impact:**
- Always use explicit file paths (configured in `RSR_INVENTORY_FILE` env variable)
- Cannot use wildcard matching or directory scanning
- Connection tests should use `SIZE` command instead of `LIST`

---

## TLS/SSL Certificate Details

The FTPS certificate is **neither public CA signed nor self-signed**.

**What this means:**
- It's a custom/private certificate authority
- Set `rejectUnauthorized: false` in TLS options for Vercel compatibility
- Certificate validation may need to be relaxed in production

**Current Configuration** (in `ftp-client.ts`):
```typescript
secureOptions: {
  minVersion: 'TLSv1.2',
  rejectUnauthorized: false, // Required for RSR's custom certificate
}
```

---

## File Generation Schedule

According to RSR's documentation (`FTP Downloads.pdf`):
- Files are generated on a regular schedule (see attached PDF for details)
- Inventory data is updated throughout the day
- Both `.txt` and `.zip` versions are available
- Zip files contain the same data but compressed

---

## Environment Variables Configuration

### Required Variables
```bash
# RSR FTP Connection
RSR_FTP_HOST=ftps.rsrgroup.com
RSR_FTP_PORT=2222
RSR_FTP_USER=52417
RSR_FTP_PASSWORD=gLlK9Pxs
RSR_FTP_SECURE=true

# RSR File Paths (account has NO list permission)
RSR_INVENTORY_FILE=/keydealer/rsrinventory-keydlr-new.txt
RSR_INVENTORY_ZIP=/keydealer/rsrinventory-keydlr-new.zip
```

### Optional Variables
```bash
# Database Configuration
RSR_USE_KV=false  # true for Vercel KV, false for Postgres

# Sync Configuration
RSR_SYNC_ENABLED=true
RSR_MAX_RECORDS=50000
RSR_BATCH_SIZE=100
```

---

## Testing Connection

### Test Script
Run the test script to verify connectivity:

```bash
npx tsx scripts/test-rsr-connection.ts
```

### Expected Test Behavior
1. ✅ **Connection** - Should connect successfully to ftps.rsrgroup.com:2222
2. ✅ **File Size Check** - Should be able to get file size using `SIZE` command
3. ✅ **File Download** - Should successfully download inventory file
4. ❌ **Directory Listing** - Will FAIL (expected, account has no list permission)

---

## Security Notes

### Credential Management
- Never commit credentials to source control
- Use Vercel environment variables for production
- Use `.env.local` for local development (already in `.gitignore`)
- Mark `RSR_FTP_PASSWORD` as sensitive in Vercel dashboard

### Access Restrictions
- Access to RSR FTPS is restricted to RSR customers only
- No public access available
- No IP allowlisting required (standard customer access)

---

## File Format Details

### Inventory File Format
- **Delimiter**: Semicolon (`;`)
- **Fields**: 77 fields per record
- **Encoding**: Likely Windows-1252 or UTF-8
- **Format**: Plain text, one record per line

### Sample Files
RSR provided sample inventory files (attached to original email).

See `src/lib/rsr/inventory-parser.ts` for the complete field mapping and parser implementation.

---

## Implementation Checklist

- [x] Update `.env.local` with correct credentials (account 52417)
- [x] Add file path environment variables
- [x] Update FTP client to not rely on list permissions
- [x] Modify `getInventoryFile()` to use direct paths
- [x] Update connection checks to use `SIZE` instead of `LIST`
- [x] Add fallback from .txt to .zip files
- [ ] Test connection with new credentials
- [ ] Parse sample inventory file to validate parser
- [ ] Deploy to Vercel with environment variables
- [ ] Set up cron job for automated syncing
- [ ] Monitor first few syncs for errors

---

## Next Steps

### 1. Test Local Connection
```bash
# Test the connection
npm run test:rsr-connection

# Or manually
npx tsx scripts/test-rsr-connection.ts
```

### 2. Validate Inventory Parser
- Download sample file
- Run through parser
- Verify all 77 fields are correctly mapped
- Check for data type conversions

### 3. Deploy to Vercel
```bash
# Set environment variables in Vercel dashboard
vercel env add RSR_FTP_USER
vercel env add RSR_FTP_PASSWORD
# ... etc

# Deploy
vercel --prod
```

### 4. Test Production
```bash
# Test health endpoint
curl https://your-domain.vercel.app/api/rsr/health

# Manual sync
curl -X POST https://your-domain.vercel.app/api/rsr/sync
```

---

## Troubleshooting

### Common Issues

**"Connection refused" or timeout**
- Verify port 2222 is correct (not standard 21)
- Check FTPS (not SFTP) is being used
- Ensure `secure: true` is set

**"Permission denied" or "LIST failed"**
- Expected! Account has no list permission
- Ensure you're using direct file paths
- Don't try to browse directories

**"File not found"**
- Verify exact file path: `/keydealer/rsrinventory-keydlr-new.txt`
- Check if file has been generated (check schedule)
- Try .zip version as fallback

**TLS/Certificate errors**
- Ensure `rejectUnauthorized: false` is set
- Verify `minVersion: 'TLSv1.2'` is configured
- RSR uses custom certificate (not public CA)

---

## Support

For RSR-specific issues, contact:

**Karl Seglins**  
kseglins@rsrgroup.com  
(407) 677-6114

For integration issues with this codebase, see:
- [RSR_FTP_INTEGRATION.md](./RSR_FTP_INTEGRATION.md)
- [SECURITY_SETUP.md](./SECURITY_SETUP.md)
- [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)
