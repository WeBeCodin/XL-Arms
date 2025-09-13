# Vercel Deployment Guide for XL Arms

This guide provides step-by-step instructions to deploy the XL Arms application to Vercel.

## Pre-Deployment Checklist

### ✅ Already Configured
- [x] Next.js 15.4.5 application with TypeScript
- [x] `vercel.json` configuration with cron jobs
- [x] API routes structured properly (`/api/rsr/sync`, `/api/rsr/products`)
- [x] Environment variable mapping in `vercel.json`
- [x] Dependencies include `@vercel/kv` and `@vercel/postgres`
- [x] Build process working without errors
- [x] Comprehensive RSR FTP integration

## Deployment Steps

### 1. Initial Setup
```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy the application
vercel --prod
```

### 2. Environment Variables Setup
After deployment, configure these environment variables in the Vercel dashboard:

**RSR FTP Configuration:**
- `RSR_FTP_HOST` = `ftps.rsrgroup.com`
- `RSR_FTP_PORT` = `2222`
- `RSR_FTP_USER` = `your_rsr_account_number`
- `RSR_FTP_PASSWORD` = `your_rsr_ftp_password`
- `RSR_FTP_SECURE` = `true`

**Database Configuration:**
- `RSR_USE_KV` = `false` (for Postgres) or `true` (for KV/Redis)

**Optional Configuration:**
- `RSR_SYNC_ENABLED` = `true`
- `RSR_MAX_RECORDS` = `50000`
- `RSR_BATCH_SIZE` = `100`
- `NODE_ENV` = `production`

### 3. Database Setup

#### Option A: Vercel KV (Redis)
1. Go to your Vercel dashboard
2. Select your project
3. Navigate to Storage tab
4. Create a new KV Database
5. Connect it to your project
6. Set `RSR_USE_KV=true` in environment variables

#### Option B: Vercel Postgres
1. Go to your Vercel dashboard
2. Select your project
3. Navigate to Storage tab
4. Create a new Postgres Database
5. Connect it to your project
6. Set `RSR_USE_KV=false` in environment variables

### 4. Cron Jobs Configuration
The `vercel.json` file already includes cron job configuration:
```json
{
  "crons": [
    {
      "path": "/api/rsr/sync",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

This will automatically sync RSR inventory every 6 hours.

### 5. Function Configuration
The sync function is configured with extended timeout (60 seconds):
```json
{
  "functions": {
    "src/app/api/rsr/sync/route.ts": {
      "maxDuration": 60
    }
  }
}
```

## Post-Deployment Verification

### 1. Test API Endpoints
```bash
# Test sync status
curl https://your-domain.vercel.app/api/rsr/sync

# Test products API
curl https://your-domain.vercel.app/api/rsr/products
```

### 2. Verify Cron Jobs
1. Go to Vercel dashboard
2. Navigate to Functions tab
3. Check that cron jobs are listed and active

### 3. Monitor Logs
1. Go to Vercel dashboard
2. Navigate to Functions tab
3. Click on individual function executions to view logs

## Required RSR Credentials

Before deployment, ensure you have:
- RSR Group FTP account credentials
- Access to RSR's FTPS server (ftps.rsrgroup.com:2222)
- FFL license (required for RSR integration)

## Security Considerations

### Environment Variables
- Never commit actual credentials to the repository
- Use Vercel's secure environment variable storage
- The `.env.local.example` file provides a template

### HTTPS Enforcement
- Vercel automatically provides HTTPS
- All API endpoints will be secured

### Data Protection
- FTP connections use FTPS (encrypted)
- Database connections are automatically encrypted
- Input validation is implemented

## Troubleshooting

### Common Issues

1. **Environment Variables Not Set**
   - Verify all required variables are configured in Vercel dashboard
   - Ensure variable names match exactly

2. **Database Connection Issues**
   - Check database is properly connected in Vercel dashboard
   - Verify connection strings are auto-populated

3. **FTP Connection Problems**
   - Test credentials with RSR Group
   - Verify firewall settings allow FTPS connections

4. **Function Timeouts**
   - The sync function has 60-second timeout
   - Large inventories may need optimization

### Monitoring and Alerts
1. Set up Vercel monitoring for function failures
2. Monitor cron job execution in dashboard
3. Check function logs regularly

## Performance Optimization

### Current Configuration
- Serverless functions optimized for Vercel
- Database queries optimized for performance
- Batch processing for large inventories
- Memory-efficient file handling

### Recommendations
- Monitor function execution time
- Optimize database queries as needed
- Consider implementing caching for frequently accessed data

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [RSR Integration Documentation](./docs/RSR_FTP_INTEGRATION.md)
- [Implementation Checklist](./docs/IMPLEMENTATION_CHECKLIST.md)

## Success Criteria

After successful deployment, you should have:
- ✅ Application accessible via HTTPS
- ✅ Automated inventory sync every 6 hours
- ✅ Functional API endpoints for product search
- ✅ Secure credential management
- ✅ Error monitoring and logging

## Next Steps

1. Test with actual RSR credentials
2. Configure monitoring and alerting
3. Set up backup procedures
4. Plan for regular maintenance and updates

---

**Note:** This application is specifically designed for firearms dealers with valid FFL licenses and RSR Group accounts. Ensure compliance with all federal, state, and local regulations regarding firearms commerce.