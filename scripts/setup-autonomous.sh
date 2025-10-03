#!/bin/bash

# RSR FTP Integration - Complete Autonomous Setup
# This is the master script that guides you through the entire setup process

set -e

echo "════════════════════════════════════════════════════════════════"
echo "  RSR FTP Integration - Complete Autonomous Setup"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "This script will help you deploy the RSR FTP integration to Vercel"
echo "with the correct environment variables from RSR's email."
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

# Check prerequisites
echo "Checking prerequisites..."
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js is installed: $NODE_VERSION"
else
    print_error "Node.js is not installed"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm is installed: $NPM_VERSION"
else
    print_error "npm is not installed"
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  Choose Deployment Method"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Select how you want to deploy:"
echo ""
echo "  1) GitHub Actions (Recommended - Fully Automated)"
echo "     → Set up once, deploy automatically on push"
echo "     → Requires: GitHub secrets configuration"
echo ""
echo "  2) Local Deployment with Node.js Script"
echo "     → Deploy from your machine using Vercel API"
echo "     → Requires: VERCEL_TOKEN"
echo ""
echo "  3) Local Deployment with Vercel CLI"
echo "     → Deploy using vercel command"
echo "     → Requires: vercel login"
echo ""
echo "  4) Manual Setup via Vercel Dashboard"
echo "     → Set environment variables manually in browser"
echo "     → No automation, but most straightforward"
echo ""
echo "  5) Show me all the information I need"
echo "     → Display credentials and instructions"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "════════════════════════════════════════════════════════════════"
        echo "  GitHub Actions Setup"
        echo "════════════════════════════════════════════════════════════════"
        echo ""
        print_info "To set up GitHub Actions deployment:"
        echo ""
        echo "1. Go to your GitHub repository settings:"
        echo "   https://github.com/WeBeCodin/XL-Arms/settings/secrets/actions"
        echo ""
        echo "2. Add these secrets (click 'New repository secret'):"
        echo ""
        echo "   VERCEL_TOKEN"
        echo "   → Get from: https://vercel.com/account/tokens"
        echo "   → Should be a long alphanumeric string"
        echo ""
        echo "   VERCEL_PROJECT_ID"
        echo "   → Run: npx vercel link"
        echo "   → Copy projectId from .vercel/project.json"
        echo ""
        echo "   VERCEL_ORG_ID"
        echo "   → Run: npx vercel link"
        echo "   → Copy orgId from .vercel/project.json"
        echo ""
        echo "   RSR_FTP_PASSWORD"
        echo "   → Value: gLlK9Pxs"
        echo ""
        echo "   SETUP_ENV_VARS (optional, for first run)"
        echo "   → Value: true"
        echo ""
        echo "3. Trigger the workflow:"
        echo "   https://github.com/WeBeCodin/XL-Arms/actions"
        echo "   → Click 'Deploy RSR FTP Integration to Vercel'"
        echo "   → Click 'Run workflow'"
        echo ""
        print_success "Detailed instructions: .github/workflows/README.md"
        ;;
    
    2)
        echo ""
        echo "════════════════════════════════════════════════════════════════"
        echo "  Local Deployment with Node.js Script"
        echo "════════════════════════════════════════════════════════════════"
        echo ""
        
        # Check for VERCEL_TOKEN
        if [ -z "$VERCEL_TOKEN" ]; then
            print_warning "VERCEL_TOKEN not found in environment"
            echo ""
            echo "1. Get your Vercel token:"
            echo "   → Go to: https://vercel.com/account/tokens"
            echo "   → Click 'Create Token'"
            echo "   → Copy the token"
            echo ""
            echo "2. Set the token:"
            read -sp "   Paste your VERCEL_TOKEN (hidden): " token
            export VERCEL_TOKEN="$token"
            echo ""
            echo ""
        fi
        
        print_info "Running Node.js deployment script..."
        node scripts/setup-vercel-env-api.js
        
        echo ""
        print_info "Now deploying to Vercel..."
        npx vercel --prod
        
        echo ""
        print_success "Deployment complete!"
        ;;
    
    3)
        echo ""
        echo "════════════════════════════════════════════════════════════════"
        echo "  Local Deployment with Vercel CLI"
        echo "════════════════════════════════════════════════════════════════"
        echo ""
        
        # Check if VERCEL_TOKEN is set or user is logged in
        if [ -z "$VERCEL_TOKEN" ]; then
            print_warning "Not authenticated with Vercel"
            echo ""
            read -p "Do you want to login now? (y/n): " login_choice
            
            if [ "$login_choice" = "y" ]; then
                npx vercel login
            else
                echo ""
                echo "Set VERCEL_TOKEN manually:"
                read -sp "Paste your VERCEL_TOKEN (hidden): " token
                export VERCEL_TOKEN="$token"
                echo ""
                echo ""
            fi
        fi
        
        print_info "Running setup script..."
        bash scripts/deploy-to-vercel.sh
        ;;
    
    4)
        echo ""
        echo "════════════════════════════════════════════════════════════════"
        echo "  Manual Setup via Vercel Dashboard"
        echo "════════════════════════════════════════════════════════════════"
        echo ""
        echo "1. Go to: https://vercel.com/dashboard"
        echo ""
        echo "2. Select your 'xl-arms' project"
        echo ""
        echo "3. Navigate to: Settings → Environment Variables"
        echo ""
        echo "4. Add these variables for Production, Preview, and Development:"
        echo ""
        cat << EOF
   RSR_FTP_HOST=ftps.rsrgroup.com
   RSR_FTP_PORT=2222
   RSR_FTP_USER=52417
   RSR_FTP_PASSWORD=gLlK9Pxs
   RSR_FTP_SECURE=true
   RSR_INVENTORY_FILE=/keydealer/rsrinventory-keydlr-new.txt
   RSR_USE_KV=false
   RSR_SYNC_ENABLED=true
   RSR_MAX_RECORDS=50000
   RSR_BATCH_SIZE=100
EOF
        echo ""
        echo "5. Deploy:"
        echo "   → Either push to git (automatic)"
        echo "   → Or run: npx vercel --prod"
        echo ""
        print_success "See DEPLOYMENT_READY.md for more details"
        ;;
    
    5)
        echo ""
        echo "════════════════════════════════════════════════════════════════"
        echo "  RSR FTP Integration - All Information"
        echo "════════════════════════════════════════════════════════════════"
        echo ""
        echo "RSR Account Details (from email 09/30/2025):"
        echo "────────────────────────────────────────────────────────────────"
        echo "  Account Number: 52417"
        echo "  Password: gLlK9Pxs"
        echo "  Host: ftps.rsrgroup.com"
        echo "  Port: 2222"
        echo "  File Path: /keydealer/rsrinventory-keydlr-new.txt"
        echo "  Zip File: /keydealer/rsrinventory-keydlr-new.zip"
        echo ""
        echo "  ⚠️  Important: Account has NO list/read permission"
        echo "  ✅  Code updated to handle this limitation"
        echo ""
        echo "Environment Variables to Set in Vercel:"
        echo "────────────────────────────────────────────────────────────────"
        cat << EOF
  RSR_FTP_HOST=ftps.rsrgroup.com
  RSR_FTP_PORT=2222
  RSR_FTP_USER=52417
  RSR_FTP_PASSWORD=gLlK9Pxs
  RSR_FTP_SECURE=true
  RSR_INVENTORY_FILE=/keydealer/rsrinventory-keydlr-new.txt
  RSR_USE_KV=false
  RSR_SYNC_ENABLED=true
  RSR_MAX_RECORDS=50000
  RSR_BATCH_SIZE=100
EOF
        echo ""
        echo "Available Scripts:"
        echo "────────────────────────────────────────────────────────────────"
        echo "  scripts/setup-vercel-env.sh      - Bash env setup"
        echo "  scripts/setup-vercel-env-api.js  - Node.js API setup"
        echo "  scripts/deploy-to-vercel.sh      - Full deployment"
        echo ""
        echo "Documentation:"
        echo "────────────────────────────────────────────────────────────────"
        echo "  DEPLOYMENT_READY.md              - Complete deployment guide"
        echo "  docs/RSR_FTP_CONFIG.md          - RSR configuration details"
        echo "  .github/workflows/README.md      - GitHub Actions setup"
        echo ""
        echo "Testing Commands:"
        echo "────────────────────────────────────────────────────────────────"
        echo "  curl https://www.xlarms.us/api/rsr/sync"
        echo "  curl -X POST https://www.xlarms.us/api/rsr/sync"
        echo "  npx vercel logs https://www.xlarms.us --since 1h"
        echo ""
        print_success "All information displayed above"
        ;;
    
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "════════════════════════════════════════════════════════════════"
print_success "Setup script complete!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "For detailed documentation, see:"
echo "  📄 DEPLOYMENT_READY.md"
echo "  📄 docs/RSR_FTP_CONFIG.md"
echo ""
