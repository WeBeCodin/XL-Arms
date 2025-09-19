#!/bin/bash

# Vercel FTP Setup and Deployment Script
# This script helps deploy the XL-Arms application to Vercel with proper RSR FTP configuration

set -e

echo "🚀 XL Arms - Vercel FTP Deployment Script"
echo "========================================"

# Check if required commands exist
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Please install it first:"
    echo "   npm install -g vercel"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Check for environment file
if [ ! -f ".env.local" ]; then
    echo "⚠️  No .env.local file found."
    echo "   Creating template from .env.local.example..."
    cp .env.local.example .env.local
    echo "   Please edit .env.local with your actual RSR credentials before continuing."
    echo "   Run this script again after updating the credentials."
    exit 1
fi

# Verify RSR credentials are not default values
if grep -q "your_rsr_account_number" .env.local || grep -q "your_rsr_ftp_password" .env.local; then
    echo "❌ Please update .env.local with your actual RSR credentials."
    echo "   Current file contains placeholder values."
    exit 1
fi

echo "✅ Environment configuration found"

# Build and test locally first
echo "🔨 Building application..."
npm run build

echo "🧪 Testing RSR FTP connection locally..."
if npx tsx scripts/test-rsr-connection.ts; then
    echo "✅ Local FTP connection test passed"
else
    echo "⚠️  Local FTP connection test failed"
    echo "   This may be expected if using test credentials."
    echo "   Continue with deployment? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled."
        exit 1
    fi
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."

# Check if this is a production deployment
if [[ "$1" == "--production" || "$1" == "--prod" ]]; then
    echo "   Deploying to PRODUCTION..."
    vercel --prod
else
    echo "   Deploying to PREVIEW..."
    echo "   Use --production flag for production deployment"
    vercel
fi

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Set up environment variables in Vercel Dashboard:"
echo "   - Go to your project settings"
echo "   - Navigate to Environment Variables"
echo "   - Add the following variables from your .env.local file:"
echo "     * RSR_FTP_HOST"
echo "     * RSR_FTP_PORT"
echo "     * RSR_FTP_USER"
echo "     * RSR_FTP_PASSWORD"
echo "     * RSR_FTP_SECURE"
echo "     * RSR_USE_KV (set to false for Postgres, true for KV)"
echo ""
echo "2. Add Vercel Database Integration:"
echo "   - For PostgreSQL: vercel storage create postgres"
echo "   - For KV (Redis): vercel storage create kv"
echo ""
echo "3. Test your deployment:"
echo "   - Health check: curl https://your-domain.vercel.app/api/rsr/health"
echo "   - Sync status: curl https://your-domain.vercel.app/api/rsr/sync"
echo "   - Manual sync: curl -X POST https://your-domain.vercel.app/api/rsr/sync"
echo ""
echo "📖 For detailed setup instructions, see:"
echo "   - vercel-ftp-strategy.md"
echo "   - VERCEL_DEPLOYMENT_GUIDE.md"
echo "   - docs/RSR_FTP_INTEGRATION.md"

echo ""
echo "✅ Setup complete! Your RSR FTP integration is ready for Vercel."