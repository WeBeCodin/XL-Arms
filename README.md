# XL Arms - Professional Firearms Services

A Next.js application for XL Arms firearms business with comprehensive RSR inventory integration, designed for Vercel serverless deployment.

## 🚀 Quick Deployment to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/WeBeCodin/XL-Arms)

### One-Command Deployment
```bash
# Deploy to production
./deploy.sh --production

# Deploy to preview
./deploy.sh
```

## ✨ Features

### E-Commerce Storefront
- **Product Catalog** - Browse 29,820+ RSR products with search and filters
- **Product Details** - Comprehensive product pages with specifications
- **Shopping Cart** - Persistent cart with Zustand state management
- **Checkout Flow** - Complete checkout with form validation
- **Responsive Design** - Mobile-first responsive UI

### RSR Integration
- **RSR FTP Integration** - Automated inventory synchronization with RSR Group
- **Dual Database Support** - Works with Vercel KV (Redis) or Postgres
- **Automated Sync** - Cron job runs every 6 hours
- **RESTful API** - Product search and inventory management

### Infrastructure
- **Production Ready** - Optimized for Vercel serverless platform
- **Security First** - Encrypted connections, secure credential storage
- **Payment Ready** - Infrastructure for Stripe/Square integration
- **Shipping Ready** - Placeholder for carrier integration
- **Legal Pages** - Terms, Privacy, and Shipping policy templates

## 📚 Documentation

- [**Quick Start Guide**](./QUICK_START.md) - Get deployed in 5 minutes
- [**Client Integration Guide**](./CLIENT_INTEGRATION_GUIDE.md) - **NEW** Complete integration checklist
- [**E-Commerce Roadmap**](./ECOMMERCE_ROADMAP.md) - Future development plans
- [**Vercel FTP Strategy**](./vercel-ftp-strategy.md) - Comprehensive FTP deployment strategy
- [**Detailed Deployment Guide**](./VERCEL_DEPLOYMENT_GUIDE.md) - Complete setup instructions
- [**RSR Integration Details**](./docs/RSR_FTP_INTEGRATION.md) - Technical implementation
- [**Implementation Checklist**](./docs/IMPLEMENTATION_CHECKLIST.md) - Step-by-step guide

## 🛠 Development

### Prerequisites
- Node.js 18+ 
- npm or yarn
- RSR Group FTP account (for production)

### Local Development
```bash
# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Edit .env.local with your credentials
# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🔧 API Endpoints

### RSR Integration
- `GET /api/rsr/sync` - Check sync status
- `POST /api/rsr/sync` - Trigger manual sync
- `GET /api/rsr/products` - Search products (with filters)
- `POST /api/rsr/products` - Advanced filtering

### Storefront Pages
- `/` - Homepage with store link
- `/store` - Product catalog with search and filters
- `/store/[stockNumber]` - Individual product detail pages
- `/cart` - Shopping cart management
- `/checkout` - Checkout flow
- `/terms` - Terms and conditions (template)
- `/privacy` - Privacy policy (template)
- `/shipping` - Shipping policy (template)

### Environment Variables
Required for production deployment:
```env
RSR_FTP_HOST=ftps.rsrgroup.com
RSR_FTP_PORT=2222
RSR_FTP_USER=your_account_number
RSR_FTP_PASSWORD=your_password
RSR_FTP_SECURE=true
RSR_USE_KV=false
```

## 🗄 Database Options

### Vercel KV (Redis) - Recommended for simple setup
- High-performance caching
- Automatic scaling
- Set `RSR_USE_KV=true`

### Vercel Postgres - Recommended for complex queries
- Full relational database
- Advanced indexing and queries
- Set `RSR_USE_KV=false`

## 🔒 Security

- ✅ FTPS encrypted connections to RSR servers
- ✅ Environment variables for credential storage
- ✅ Input validation and sanitization
- ✅ HTTPS enforcement
- ✅ No hardcoded secrets

## 🚀 Production Deployment

This application is optimized for Vercel deployment:

1. **Automated Setup**: Use `./deploy.sh --production`
2. **Environment Variables**: Configure in Vercel dashboard
3. **Database**: Connect KV or Postgres in Vercel
4. **Cron Jobs**: Automatically configured for inventory sync
5. **Monitoring**: Built-in logging and error tracking

## 📊 RSR Integration

Comprehensive integration with RSR Group's firearms inventory system:

- **77-Field Format Support** - Complete RSR data parsing
- **50,000+ Products** - Handles large inventory catalogs
- **Real-time Sync** - Automated updates every 6 hours
- **Search & Filter** - Advanced product discovery
- **FFL Compliant** - Designed for licensed firearms dealers

## 🆘 Support

- Check [troubleshooting guide](./VERCEL_DEPLOYMENT_GUIDE.md#troubleshooting)
- Review [implementation checklist](./docs/IMPLEMENTATION_CHECKLIST.md)
- Contact RSR Group for FTP credentials
- Monitor Vercel function logs for issues

## 📋 Requirements

- RSR Group FTP account
- Valid FFL license
- Vercel account (free tier sufficient)

---

**Ready to deploy your firearms inventory system?** Start with the [Quick Start Guide](./QUICK_START.md) 🚀
