# RSR FTP Integration Guide

## Overview
This integration connects to RSR Group's FTP server to sync product inventory data with your Vercel-deployed store. The system updates every 2 hours to match RSR's update schedule.

## Architecture

### Core Implementation Files

- **lib/rsr/ftp-client.ts** - FTP client for connecting to RSR's server
- **lib/rsr/inventory-parser.ts** - Parser for RSR's 77-field semicolon-delimited format
- **lib/rsr/database.ts** - Database abstraction supporting both Vercel KV and Postgres
- **lib/types/rsr.ts** - TypeScript interfaces for RSR data structures

### API Routes

- **app/api/rsr/sync/route.ts** - Handles inventory synchronization (triggered by cron)
- **app/api/rsr/products/route.ts** - Provides product search and retrieval API

### Configuration Files

- **vercel.json** - Vercel deployment configuration with cron jobs
- **.env.local.example** - Environment variable template

## Features

### Automated Syncing
- Runs every 2 hours via Vercel cron jobs
- Matches RSR's update schedule
- Automatic error handling and retry logic

### Secure Credential Management
- FTP credentials stored in environment variables
- Never committed to source code
- Secure connection support (FTPS)

### Database Flexibility
- Supports both Vercel KV (Redis) and Postgres
- Configurable via environment variable
- Optimized queries and batch operations

### Robust Data Processing
- Handles RSR's 77-field semicolon-delimited format
- Data validation and error reporting
- Memory-efficient batch processing

### API Features
- RESTful product search API
- Pagination support
- Filtering by category, manufacturer, price range
- Search functionality across multiple fields

## Setup Instructions

### 1. Environment Variables

Set up the following environment variables in your Vercel dashboard:

```bash
RSR_FTP_HOST=ftps.rsrgroup.com
RSR_FTP_PORT=2222
RSR_FTP_USER=your_rsr_account_number
RSR_FTP_PASSWORD=your_rsr_ftp_password
RSR_FTP_SECURE=true
RSR_USE_KV=false  # true for KV, false for Postgres
```

### 2. Database Setup

#### Option A: Vercel Postgres
1. Add Vercel Postgres integration to your project
2. Set `RSR_USE_KV=false` in environment variables
3. Database tables will be created automatically on first sync

#### Option B: Vercel KV (Redis)
1. Add Vercel KV integration to your project  
2. Set `RSR_USE_KV=true` in environment variables
3. Data will be stored with automatic expiration (3 hours)

### 3. Deploy Configuration

The `vercel.json` file configures:
- Cron job to run sync every 2 hours
- Extended timeout for sync function (60 seconds)
- Environment variable mapping

### 4. Testing the Integration

Use the test script to verify connectivity:

```bash
npx tsx scripts/test-rsr-connection.ts
```

### 5. Manual Sync

Trigger a manual sync via API:

```bash
curl -X POST https://your-domain.vercel.app/api/rsr/sync
```

### 6. Check Sync Status

Monitor sync health:

```bash
curl https://your-domain.vercel.app/api/rsr/sync
```

## API Usage

### Get Products

```bash
# Basic product listing
GET /api/rsr/products?page=1&pageSize=50

# Search products
GET /api/rsr/products?search=glock&page=1&pageSize=20

# Filter by category
GET /api/rsr/products?category=handguns&inStock=true

# Advanced search with POST
POST /api/rsr/products
{
  "page": 1,
  "pageSize": 50,
  "filters": {
    "search": "rifle",
    "manufacturer": "Smith & Wesson",
    "minPrice": 500,
    "maxPrice": 2000,
    "inStock": true
  },
  "sortBy": "price",
  "sortOrder": "asc"
}
```

### Sync Management

```bash
# Check sync status
GET /api/rsr/sync

# Trigger manual sync
POST /api/rsr/sync
```

## Data Structure

### RSR Product Fields

The integration handles RSR's comprehensive product data including:

- Basic info: Stock number, UPC, description
- Pricing: Cost, retail price, excise tax
- Physical: Weight, dimensions, shipping info
- Product details: Caliber, capacity, barrel length, finish
- Inventory: Quantity on hand, allocation status
- Flags: New item, closeout, hazmat, free shipping

### Database Schema

#### Postgres Table Structure
```sql
CREATE TABLE rsr_inventory (
  id SERIAL PRIMARY KEY,
  rsr_stock_number VARCHAR(50) UNIQUE NOT NULL,
  upc_code VARCHAR(20),
  description TEXT NOT NULL,
  department_number INTEGER,
  manufacturer_id VARCHAR(20),
  manufacturer_name VARCHAR(100),
  price DECIMAL(10,2),
  retail_price DECIMAL(10,2),
  quantity_on_hand INTEGER,
  -- ... additional fields
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### KV Storage Structure
```
rsr:inventory:{stockNumber} -> JSON product data
rsr:metadata:lastSync -> ISO timestamp
rsr:metadata:itemCount -> number of items
```

## Error Handling

### Common Issues

1. **FTP Connection Failures**
   - Check credentials and network access
   - Verify RSR FTP server status
   - Review firewall settings

2. **Parse Errors**
   - RSR may change file format
   - Check for encoding issues
   - Validate field count and structure

3. **Database Errors**
   - Monitor connection limits
   - Check storage quotas
   - Review query performance

### Monitoring

- Sync status available via `/api/rsr/sync` endpoint
- Vercel function logs for detailed error information
- Database metrics in Vercel dashboard

## Performance Considerations

### Memory Usage
- Large inventory files (50K+ products) require careful memory management
- Batch processing prevents memory overflow
- Consider pagination for large datasets

### Processing Time
- Full sync typically takes 30-45 seconds
- 60-second timeout allows for processing delays
- Network latency affects FTP download time

### Database Performance
- Indexes on key fields improve query speed
- Batch inserts optimize database operations
- Consider read replicas for high-traffic applications

## Security Best Practices

1. **Credential Management**
   - Never commit credentials to source code
   - Use Vercel environment variables
   - Rotate credentials regularly

2. **API Security**
   - Consider rate limiting for public APIs
   - Implement authentication if needed
   - Validate input parameters

3. **Data Protection**
   - Encrypt sensitive data at rest
   - Use HTTPS for all API calls
   - Monitor access logs

## Troubleshooting

### Debug Mode
Enable verbose logging in development:
```bash
NODE_ENV=development
```

### Common Commands
```bash
# Test FTP connection
npx tsx scripts/test-rsr-connection.ts

# Check sync status
curl https://your-domain.vercel.app/api/rsr/sync

# Manual sync
curl -X POST https://your-domain.vercel.app/api/rsr/sync

# Check products
curl "https://your-domain.vercel.app/api/rsr/products?page=1&pageSize=5"
```

### Log Analysis
- Check Vercel function logs for sync errors
- Monitor database connection issues
- Review FTP server response codes

## Maintenance

### Regular Tasks
- Monitor sync health and frequency
- Review error logs and failure patterns
- Update credentials as needed
- Monitor database storage usage

### Updates
- Keep dependencies updated
- Review RSR format changes
- Test connectivity regularly
- Monitor performance metrics

This integration provides a robust, scalable solution for RSR inventory management on Vercel's serverless platform.