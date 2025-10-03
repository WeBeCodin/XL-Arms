#!/bin/bash

# RSR FTP Integration - Vercel Environment Variable Setup
# This script sets up all required environment variables for the RSR FTP integration
# Run this after authenticating with: vercel login

set -e

echo "🚀 Setting up Vercel Environment Variables for RSR FTP Integration"
echo ""

# Check if vercel CLI is available
if ! command -v vercel &> /dev/null && ! command -v npx &> /dev/null; then
    echo "❌ Error: Neither vercel CLI nor npx is available"
    echo "Please install Node.js and npm first"
    exit 1
fi

# Function to add environment variable
add_env_var() {
    local var_name=$1
    local var_value=$2
    local environments=${3:-"production,preview,development"}
    
    echo "📝 Setting $var_name..."
    
    # Use npx vercel if vercel is not installed globally
    if command -v vercel &> /dev/null; then
        echo "$var_value" | vercel env add "$var_name" $environments --yes 2>&1 || true
    else
        echo "$var_value" | npx vercel env add "$var_name" $environments --yes 2>&1 || true
    fi
}

echo "Setting RSR FTP connection variables..."
echo ""

# RSR FTP Connection Variables
add_env_var "RSR_FTP_HOST" "ftps.rsrgroup.com"
add_env_var "RSR_FTP_PORT" "2222"
add_env_var "RSR_FTP_USER" "52417"
add_env_var "RSR_FTP_PASSWORD" "gLlK9Pxs"
add_env_var "RSR_FTP_SECURE" "true"

echo ""
echo "Setting RSR inventory file path..."
echo ""

# RSR Inventory File Path (CRITICAL: Key Dealer account has NO list permission)
add_env_var "RSR_INVENTORY_FILE" "/keydealer/rsrinventory-keydlr-new.txt"

echo ""
echo "Setting optional configuration variables..."
echo ""

# Optional Configuration
add_env_var "RSR_USE_KV" "false"
add_env_var "RSR_SYNC_ENABLED" "true"
add_env_var "RSR_MAX_RECORDS" "50000"
add_env_var "RSR_BATCH_SIZE" "100"

echo ""
echo "✅ Environment variables setup complete!"
echo ""
echo "Next steps:"
echo "1. Verify variables in Vercel dashboard: https://vercel.com/dashboard"
echo "2. Deploy the application: vercel --prod"
echo "3. Test the integration: curl -X POST https://your-domain.vercel.app/api/rsr/sync"
echo ""
