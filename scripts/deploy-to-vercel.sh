#!/bin/bash

# RSR FTP Integration - Automated Vercel Deployment Script
# This script automates the deployment process with proper error handling

set -e

echo "🚀 RSR FTP Integration - Automated Deployment"
echo "=============================================="
echo ""

# Check if VERCEL_TOKEN is set
if [ -z "$VERCEL_TOKEN" ]; then
    echo "⚠️  VERCEL_TOKEN not found in environment"
    echo ""
    echo "To use this script, you need to:"
    echo "1. Get your Vercel token from: https://vercel.com/account/tokens"
    echo "2. Export it: export VERCEL_TOKEN=your_token_here"
    echo "3. Re-run this script"
    echo ""
    echo "Alternatively, run: vercel login (if using Vercel CLI)"
    exit 1
fi

# Function to run vercel commands
run_vercel() {
    if command -v vercel &> /dev/null; then
        vercel "$@"
    else
        npx vercel "$@"
    fi
}

echo "Step 1: Setting up environment variables..."
echo ""

# Array of environment variables to set
declare -A env_vars=(
    ["RSR_FTP_HOST"]="ftps.rsrgroup.com"
    ["RSR_FTP_PORT"]="2222"
    ["RSR_FTP_USER"]="52417"
    ["RSR_FTP_PASSWORD"]="gLlK9Pxs"
    ["RSR_FTP_SECURE"]="true"
    ["RSR_INVENTORY_FILE"]="/keydealer/rsrinventory-keydlr-new.txt"
    ["RSR_USE_KV"]="false"
    ["RSR_SYNC_ENABLED"]="true"
    ["RSR_MAX_RECORDS"]="50000"
    ["RSR_BATCH_SIZE"]="100"
)

# Set each environment variable
for var_name in "${!env_vars[@]}"; do
    var_value="${env_vars[$var_name]}"
    echo "📝 Setting $var_name..."
    
    # Remove existing variable if it exists
    run_vercel env rm "$var_name" production --yes 2>/dev/null || true
    run_vercel env rm "$var_name" preview --yes 2>/dev/null || true
    run_vercel env rm "$var_name" development --yes 2>/dev/null || true
    
    # Add the variable
    echo "$var_value" | run_vercel env add "$var_name" production preview development --yes 2>&1 | grep -v "password" || true
done

echo ""
echo "✅ Environment variables configured successfully!"
echo ""

echo "Step 2: Deploying to Vercel..."
echo ""

# Deploy to production
run_vercel --prod --yes

echo ""
echo "✅ Deployment complete!"
echo ""

echo "Step 3: Testing the deployment..."
echo ""

# Get the production URL
PROD_URL=$(run_vercel ls --token="$VERCEL_TOKEN" 2>/dev/null | grep "xl-arms" | grep "Ready" | head -1 | awk '{print $2}' || echo "")

if [ -z "$PROD_URL" ]; then
    echo "⚠️  Could not automatically determine production URL"
    echo "Please test manually:"
    echo "  curl -X POST https://your-domain.vercel.app/api/rsr/sync"
else
    echo "Testing sync endpoint at $PROD_URL..."
    curl -X POST "https://$PROD_URL/api/rsr/sync" -w "\nHTTP Status: %{http_code}\n"
fi

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Check Vercel dashboard: https://vercel.com/dashboard"
echo "2. Monitor logs: vercel logs https://your-domain.vercel.app"
echo "3. Test health: curl https://your-domain.vercel.app/api/rsr/sync"
echo ""
