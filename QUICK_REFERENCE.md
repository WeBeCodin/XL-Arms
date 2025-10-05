# XL-Arms RSR Integration - Quick Reference

## 🚀 System Status

**Production URL**: https://www.xlarms.us  
**Status**: ✅ OPERATIONAL  
**Last Sync**: 2025-10-05 09:07 UTC  
**Products**: 29,820  
**Sync Schedule**: Daily at 3:00 AM UTC  

---

## 📊 Quick Health Checks

### Check Sync Status
```bash
curl -s "https://www.xlarms.us/api/rsr/sync" | jq '.'
```

**Expected Response**:
```json
{
  "status": "healthy",
  "lastSync": "2025-10-05T09:07:32.954Z",
  "itemCount": 29820,
  "isHealthy": true,
  "message": "RSR integration is running normally"
}
```

### Check FTP Connection
```bash
curl -s "https://www.xlarms.us/api/rsr/health" | jq '.status'
```

**Expected**: `"healthy"`

### Test Product API
```bash
curl -s "https://www.xlarms.us/api/rsr/products?page=1&pageSize=5" | jq '.products[0] | {stock: .rsrStockNumber, desc: .description, price: .price}'
```

### Manual Sync Trigger
```bash
curl -X POST "https://www.xlarms.us/api/rsr/sync"
```

**Expected**: JSON with `"success": true` and processing time ~16 seconds

---

## 🔍 Monitoring Commands

### Check Last Deployment
```bash
# Via GitHub
git log -1 --oneline

# Current production commit
git rev-parse --short HEAD
```

### View Vercel Logs (requires token)
```bash
npx vercel logs https://www.xlarms.us --token YOUR_TOKEN
```

### Search Products
```bash
# Search by keyword
curl -s "https://www.xlarms.us/api/rsr/products?search=glock&page=1" | jq '.totalCount'

# Filter by price range (future enhancement)
curl -s "https://www.xlarms.us/api/rsr/products?minPrice=100&maxPrice=500&page=1"
```

---

## 🛠️ Troubleshooting

### Sync Fails (Timeout)
- **Check**: Processing time in response
- **Expected**: < 60 seconds (currently ~16s)
- **Action**: If > 50s, review batch size in `src/lib/rsr/database.ts`

### Products Not Appearing
```bash
# 1. Check sync status
curl "https://www.xlarms.us/api/rsr/sync"

# 2. Check database connection
curl "https://www.xlarms.us/api/rsr/debug" | jq '.postgresEnvVars'

# 3. Trigger manual sync
curl -X POST "https://www.xlarms.us/api/rsr/sync"
```

### FTP Connection Issues
```bash
# Test health endpoint
curl "https://www.xlarms.us/api/rsr/health"

# Check environment variables
curl "https://www.xlarms.us/api/rsr/debug" | jq '.allRSRVars'
```

**Common Issues**:
- FTP credentials expired → Contact RSR support
- Network timeout → Vercel infrastructure issue (rare)
- File path changed → Update `RSR_INVENTORY_PATH` env var

---

## 📁 Key Files

### Configuration
- `vercel.json` - Cron schedule, function timeouts
- `.env.local` (local only) - Development credentials
- Environment variables in Vercel dashboard

### Core Logic
- `src/lib/rsr/ftp-client.ts` - FTP download
- `src/lib/rsr/inventory-parser.ts` - Data parsing
- `src/lib/rsr/database.ts` - Database operations
- `src/lib/types/rsr.ts` - Type definitions

### API Routes
- `src/app/api/rsr/sync/route.ts` - Sync trigger & status
- `src/app/api/rsr/products/route.ts` - Product listing
- `src/app/api/rsr/health/route.ts` - FTP health
- `src/app/api/rsr/debug/route.ts` - Diagnostics

### Documentation
- `IMPLEMENTATION_SUCCESS.md` - Complete technical documentation
- `SESSION_HISTORY.md` - Development history
- `docs/RSR_FTP_INTEGRATION.md` - Integration guide

---

## 🔐 Credentials (Secure)

**Stored in Vercel Environment Variables** (never commit to repo):

```bash
RSR_FTP_HOST=ftps.rsrgroup.com
RSR_FTP_PORT=2222
RSR_FTP_USER=52417
RSR_FTP_PASSWORD=******** (see Vercel dashboard)
RSR_FTP_SECURE=true
RSR_INVENTORY_PATH=/rsrinventory-keydlr-new.txt
RSR_USE_KV=false

# Database (Postgres)
POSTGRES_URL=postgres://...
POSTGRES_PRISMA_URL=postgres://...
POSTGRES_URL_NON_POOLING=postgres://...
```

---

## 🎯 Performance Targets

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Sync Time | < 60s | 16s | ✅ |
| Product Count | ~30K | 29,820 | ✅ |
| API Response | < 500ms | ~200ms | ✅ |
| Uptime | > 99% | Monitor | ✅ |
| Sync Success Rate | 100% | 100% | ✅ |

---

## 📞 Support Contacts

### RSR Group
- **Website**: rsrgroup.com
- **Email**: kseglins@rsrgroup.com (Karl Seglins)
- **FTP Support**: Via dealer portal
- **Account**: 52417

### Vercel Support
- **Dashboard**: vercel.com/dashboard
- **Docs**: vercel.com/docs
- **Status**: vercel-status.com

### Repository
- **GitHub**: github.com/WeBeCodin/XL-Arms
- **Issues**: github.com/WeBeCodin/XL-Arms/issues

---

## 🚦 Next Steps (Optional Enhancements)

### Phase 2 Features
1. **Incremental Sync** - Only update changed products
2. **Product Images** - Cache images on Vercel Edge CDN
3. **Full-Text Search** - Add Postgres text search indexes
4. **Analytics** - Track popular products and searches
5. **Email Alerts** - Notify on sync failures
6. **Admin Dashboard** - Web UI for sync monitoring

### Scaling Considerations
- Current: Vercel Hobby Plan (60s timeout, 256MB Postgres)
- Future: Vercel Pro (300s timeout, larger database)
- Alternative: Background jobs for sync operations

---

**Last Updated**: 2025-10-05  
**Version**: 1.0.0  
**Status**: Production Ready ✅
