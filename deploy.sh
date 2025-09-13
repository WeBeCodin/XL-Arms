#!/bin/bash

# XL Arms Vercel Deployment Script
# This script helps automate the deployment process to Vercel

set -e

echo "🚀 XL Arms Vercel Deployment Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI not found. Installing..."
    npm install -g vercel
    print_success "Vercel CLI installed successfully"
fi

# Check if user is logged into Vercel
print_status "Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    print_warning "Not logged into Vercel. Please login..."
    vercel login
fi

print_success "Authenticated with Vercel"

# Run pre-deployment checks
print_status "Running pre-deployment checks..."

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Make sure you're in the project root directory."
    exit 1
fi

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    print_error "vercel.json not found. This file is required for proper deployment."
    exit 1
fi

print_success "Configuration files found"

# Install dependencies
print_status "Installing dependencies..."
npm install
print_success "Dependencies installed"

# Run build to ensure everything works
print_status "Running production build test..."
npm run build
print_success "Build completed successfully"

# Run linting
print_status "Running linting checks..."
npm run lint
if [ $? -ne 0 ]; then
    print_warning "Linting completed with warnings (this won't block deployment)"
else
    print_success "Linting passed"
fi

# Deploy to Vercel
print_status "Deploying to Vercel..."
if [ "$1" = "--production" ] || [ "$1" = "--prod" ]; then
    print_status "Deploying to production..."
    vercel --prod
else
    print_status "Deploying to preview (use --production flag for production deployment)..."
    vercel
fi

print_success "Deployment completed!"

# Post-deployment reminders
echo ""
echo "📋 Post-Deployment Checklist:"
echo "=============================="
echo "1. Set up environment variables in Vercel dashboard:"
echo "   - RSR_FTP_HOST, RSR_FTP_PORT, RSR_FTP_USER, RSR_FTP_PASSWORD"
echo "   - RSR_FTP_SECURE, RSR_USE_KV"
echo ""
echo "2. Connect a database (Vercel KV or Postgres)"
echo ""
echo "3. Verify cron jobs are active in Vercel dashboard"
echo ""
echo "4. Test API endpoints:"
echo "   - /api/rsr/sync"
echo "   - /api/rsr/products"
echo ""
echo "5. Monitor function logs for any issues"
echo ""
echo "📖 For detailed instructions, see: VERCEL_DEPLOYMENT_GUIDE.md"
echo ""
print_success "Deployment script completed!"