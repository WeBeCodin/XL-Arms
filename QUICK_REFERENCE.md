# 📋 RSR Integration Quick Reference

**Production URL:** https://www.xlarms.us  
**Status:** ✅ Operational  
**Last Sync:** Oct 5, 2025 09:07 UTC  
**Products:** 29,820

---

## 🔌 API Endpoints

### Health Check
```bash
GET https://www.xlarms.us/api/rsr/health
```
Response: FTP connection status, ~500ms

### Manual Sync
```bash
POST https://www.xlarms.us/api/rsr/sync
```
Response: Sync results, ~16s processing time

### Product Search
```bash
GET https://www.xlarms.us/api/rsr/products
```
**Parameters:**
- `page` (default: 1)
- `pageSize` (default: 50, max: 100)
- `search` - Search term
- `category` - Filter by category
- `manufacturer` - Filter by manufacturer
- `minPrice`, `maxPrice` - Price range
- `inStock` - Only in-stock items (true/false)

**Example:**
```bash
# Basic pagination
curl "https://www.xlarms.us/api/rsr/products?page=1&pageSize=10"

# Search
curl "https://www.xlarms.us/api/rsr/products?search=Glock"

# Multiple filters
curl "https://www.xlarms.us/api/rsr/products?category=pistol&inStock=true&minPrice=100"
```

---

## 📊 Response Format

### Products API Response
```json
{
  "products": [
    {
      "rsrStockNumber": "12345",
      "description": "Product Name",
      "price": 499.99,
      "quantityOnHand": 5,
      "manufacturerName": "Brand",
      "category": "Pistols",
      // ... 40 total fields
    }
  ],
  "totalProducts": 29820,
  "totalCount": 150,
  "totalPages": 15,
  "page": 1,
  "pageSize": 10,
  "hasMore": true,
  "lastSync": "2025-10-05T09:07:32.954Z"
}
```

---

## 🤖 Automation

**Cron Schedule:** Daily at 3:00 AM UTC  
**File:** `vercel.json`  
**Endpoint:** POST `/api/rsr/sync`  
**Duration:** ~16 seconds

---

## 🔐 Environment Variables

Required in Vercel dashboard:
```
RSR_FTP_HOST=ftps.rsrgroup.com
RSR_FTP_PORT=2222
RSR_FTP_USER=52417
RSR_FTP_PASSWORD=********
RSR_INVENTORY_FILE=rsrinventory-keydlr-new.txt
RSR_USE_KV=false
POSTGRES_URL=postgresql://...
```

---

## 🧪 Quick Tests

```bash
# 1. Check health
curl https://www.xlarms.us/api/rsr/health | jq '.status'

# 2. Check product count
curl https://www.xlarms.us/api/rsr/products | jq '.totalProducts'

# 3. Test search
curl "https://www.xlarms.us/api/rsr/products?search=Glock" | jq '.products | length'

# 4. Trigger sync
curl -X POST https://www.xlarms.us/api/rsr/sync | jq '{success, recordsProcessed}'
```

---

## 📁 Key Files

```
src/lib/rsr/
  ├── ftp-client.ts       # FTP connection
  ├── inventory-parser.ts # Data parsing
  └── database.ts         # Postgres operations

src/app/api/rsr/
  ├── health/route.ts     # Health endpoint
  ├── sync/route.ts       # Sync endpoint
  └── products/route.ts   # Products endpoint
```

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| Sync fails | Check FTP credentials, verify health endpoint |
| Timeout | File may be larger, check logs |
| No products | Verify `RSR_USE_KV=false`, check database |
| Slow search | Normal for complex queries (200-800ms) |

---

## 📈 Metrics

| Metric | Value |
|--------|-------|
| Sync Time | 16s |
| Products | 29,820 |
| Database | 50MB / 256MB |
| API Response | 200-800ms |
| Success Rate | 100% |

---

## 📚 Documentation

- **RSR_INTEGRATION_COMPLETE.md** - Full guide
- **DEPLOYMENT_STATUS.md** - System status
- **SESSION_HISTORY.md** - Development log
- **QUICK_REFERENCE.md** - This file

---

**Last Updated:** October 5, 2025  
**Git Commit:** c7afe80  
**Status:** ✅ Production Ready
