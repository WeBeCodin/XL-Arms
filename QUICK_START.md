# XL Arms - Quick Start for Vercel Deployment

## 🚀 One-Click Deployment

The easiest way to deploy this project to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/WeBeCodin/XL-Arms)

## 📋 Quick Setup (5 minutes)

### 1. Deploy to Vercel
```bash
# Using the deployment script (recommended)
./deploy.sh --production

# Or manually with Vercel CLI
npx vercel --prod
```

### 2. Configure Environment Variables
In your Vercel dashboard, add these environment variables:

**Required for RSR Integration:**
```
RSR_FTP_HOST=ftps.rsrgroup.com
RSR_FTP_PORT=2222
RSR_FTP_USER=your_rsr_account_number
RSR_FTP_PASSWORD=your_rsr_password
RSR_FTP_SECURE=true
RSR_USE_KV=false
```

### 3. Connect Database
- Go to Vercel Dashboard → Storage
- Add either **Vercel KV** (Redis) or **Postgres**
- For KV: Set `RSR_USE_KV=true`
- For Postgres: Set `RSR_USE_KV=false`

### 4. Test Your Deployment
```bash
# Test the sync endpoint
curl https://your-app.vercel.app/api/rsr/sync

# Test the products endpoint
curl https://your-app.vercel.app/api/rsr/products
```

## ✅ What's Already Configured

- ✅ **Next.js 15.4.5** with TypeScript
- ✅ **Vercel configuration** (`vercel.json`) with cron jobs
- ✅ **API routes** for RSR integration
- ✅ **Database abstraction** (supports KV and Postgres)
- ✅ **Automated sync** every 6 hours
- ✅ **Security best practices**
- ✅ **Production optimizations**

## 🔧 Features Included

### RSR Integration
- **FTP Client**: Secure FTPS connection to RSR servers
- **Inventory Parser**: Handles 77-field RSR data format
- **Database Storage**: Supports both KV (Redis) and Postgres
- **API Endpoints**: RESTful product search and sync management
- **Automated Sync**: Cron job runs every 6 hours
- **Error Handling**: Comprehensive error recovery

### API Endpoints
- `GET /api/rsr/sync` - Check sync status
- `POST /api/rsr/sync` - Trigger manual sync
- `GET /api/rsr/products` - Search products with pagination
- `POST /api/rsr/products` - Advanced product filtering

### Security
- ✅ Environment variable encryption
- ✅ FTPS encrypted connections
- ✅ Input validation and sanitization
- ✅ No hardcoded credentials
- ✅ HTTPS enforcement

## 📖 Documentation

- [**Detailed Deployment Guide**](./VERCEL_DEPLOYMENT_GUIDE.md) - Complete setup instructions
- [**RSR Integration Guide**](./docs/RSR_FTP_INTEGRATION.md) - Technical implementation details
- [**Implementation Checklist**](./docs/IMPLEMENTATION_CHECKLIST.md) - Step-by-step deployment
- [**Security Setup**](./docs/SECURITY_SETUP.md) - Security best practices

## 🆘 Need Help?

### Common Issues

1. **Missing RSR Credentials?**
   - Contact RSR Group to get FTP account
   - Ensure you have valid FFL license

2. **Database Connection Issues?**
   - Verify database is connected in Vercel dashboard
   - Check environment variables are set correctly

3. **API Not Working?**
   - Check function logs in Vercel dashboard
   - Verify environment variables are configured

### Get Support
- Check the [troubleshooting section](./VERCEL_DEPLOYMENT_GUIDE.md#troubleshooting) in the deployment guide
- Review existing documentation in the `/docs` folder
- Check Vercel function logs for detailed error information

## 🎯 Requirements

- **RSR Group FTP Account** (contact RSR to obtain)
- **Valid FFL License** (required for RSR integration)
- **Vercel Account** (free tier works fine)

---

**Ready to deploy?** Run `./deploy.sh --production` and you'll be live in minutes! 🚀