# RSR FTP Integration Details

**Last Updated:** September 30, 2025

## Account Information

- **Account Number:** 52417
- **Protocol:** FTPS (FTP over TLS)
- **Host:** ftps.rsrgroup.com
- **Port:** 2222

## File Access Details

### Inventory File Location
- **Path:** `/keydealer/rsrinventory-keydlr-new.txt`
- **Zip Format Available:** Yes - `rsrinventory-keydlr-new.zip`

### Access Permissions
⚠️ **Important:** This account does **NOT** have read/list permission for the directory.
- Direct file access only
- Cannot list directory contents
- Must use exact file path for downloads

### File Format
- **Delimiter:** Semicolon (`;`)
- **Fields:** 77 fields per record
- **Encoding:** UTF-8 / Windows-1252
- **Sample files:** Available in RSR communication (attached to email)

## Connection Details

### TLS/SSL Configuration
- **Certificate Type:** Custom (neither public CA nor self-signed)
- **Minimum TLS Version:** TLSv1.2
- **Certificate Validation:** `rejectUnauthorized: false` (required for RSR's custom certificate)

### Authentication
- Username: Account number (52417)
- Password: gLlK9Pxs
- Port: 2222 (non-standard FTPS port)

## File Generation Schedule

Refer to the attached "FTP Downloads.pdf" document provided by RSR for detailed information about:
- File generation times
- Update frequency
- Time zone considerations
- File retention policy

## Integration Implementation

### Environment Variables Required

```bash
RSR_FTP_HOST=ftps.rsrgroup.com
RSR_FTP_PORT=2222
RSR_FTP_USER=52417
RSR_FTP_PASSWORD=gLlK9Pxs
RSR_FTP_SECURE=true
RSR_FTP_FILE_PATH=/keydealer/rsrinventory-keydlr-new.txt
```

### Key Implementation Notes

1. **No Directory Listing:** The account cannot list files in the directory. Always use the direct file path.

2. **Direct File Access:** Use `RSR_FTP_FILE_PATH` environment variable to specify the exact file path.

3. **Connection Testing:** Test connection by checking file size or attempting to download, not by listing.

4. **Fallback Strategy:** Code includes fallback to listing for accounts that have those permissions.

5. **Custom Certificate:** FTPS connection requires `rejectUnauthorized: false` due to RSR's custom certificate.

## Security Considerations

### Access Restrictions
- Access to RSR FTPS is restricted to RSR customers only
- Valid FFL license required
- IP allowlisting may be available (contact RSR for details)

### Credential Management
- Never commit credentials to source code
- Use environment variables (Vercel dashboard for production)
- Rotate credentials regularly
- Store securely in .env.local for development

### Network Security
- All connections use FTPS (encrypted)
- TLS 1.2 minimum
- Custom certificate configuration required

## Support Contact

**RSR IT Integration Team**
- **Contact:** Karl Seglins, IT Integration Specialist
- **Email:** kseglins@rsrgroup.com
- **Phone:** (407) 677-6114
- **Fax:** (407) 677-4288
- **General Support:** directconnect@rsrgroup.com

## Testing & Validation

### Local Testing
```bash
# Set up environment variables in .env.local
# Run the test script
npx tsx scripts/test-rsr-connection.ts
```

### Expected Test Results
- ✅ Connection successful to ftps.rsrgroup.com:2222
- ✅ File size retrieved (file exists)
- ✅ File download successful
- ✅ Parsing successful

### Common Issues & Solutions

**Issue:** "Connection failed" or "ECONNREFUSED"
- **Solution:** Verify port 2222 is not blocked by firewall
- Check that host is ftps.rsrgroup.com (not ftp.rsrgroup.com)

**Issue:** "Failed to list files" or "Permission denied"
- **Solution:** This is expected! Use direct file path instead
- Ensure RSR_FTP_FILE_PATH is set in environment

**Issue:** "Certificate validation failed"
- **Solution:** Verify `rejectUnauthorized: false` in TLS settings
- RSR uses a custom certificate (not public CA or self-signed)

**Issue:** "File not found"
- **Solution:** Verify exact file path: `/keydealer/rsrinventory-keydlr-new.txt`
- Check if RSR has updated the file name

## API Endpoints

### Health Check
```bash
GET /api/rsr/health
```
Returns FTP connection health status and metrics.

### Manual Sync
```bash
POST /api/rsr/sync
```
Triggers manual inventory synchronization.

### Sync Status
```bash
GET /api/rsr/sync
```
Returns last sync status and details.

## Production Deployment

### Vercel Configuration

1. **Environment Variables:** Set all RSR_FTP_* variables in Vercel dashboard
2. **Function Timeout:** Sync function configured for 60 seconds max
3. **Cron Schedule:** Every 2 hours (matches RSR update schedule)
4. **IP Allowlisting:** May require Vercel IPs to be allowlisted by RSR

### Monitoring

- Check Vercel function logs for sync errors
- Monitor `/api/rsr/health` endpoint
- Set up alerts for failed syncs
- Track sync frequency and duration

## Additional Resources

- **Main Documentation:** See `/docs/RSR_FTP_INTEGRATION.md`
- **Deployment Guide:** See `/VERCEL_DEPLOYMENT_GUIDE.md`
- **Sample Files:** Attached to RSR email (September 30, 2025)
- **FTP Downloads PDF:** Provided by RSR (file generation schedule)

## Notes

1. **Account 52417** is the correct account for this integration (not 54255)
2. The account **does not have list permissions** - this is by design
3. Always use **direct file path** for downloads
4. Test connectivity before deploying to production
5. Coordinate with RSR for any IP allowlisting needs

## Troubleshooting Checklist

- [ ] Verify all environment variables are set
- [ ] Confirm RSR_FTP_FILE_PATH is correct
- [ ] Check network/firewall allows FTPS on port 2222
- [ ] Verify credentials (account 52417, password gLlK9Pxs)
- [ ] Ensure rejectUnauthorized is false for TLS
- [ ] Test with local script first
- [ ] Check Vercel function logs for errors
- [ ] Contact RSR support if issues persist

---

**Confidential:** This document contains sensitive credential information. Do not share outside authorized personnel.
