#!/usr/bin/env node

/**
 * RSR FTP Integration - Vercel Environment Variable Setup via API
 * 
 * This script uses the Vercel API to set environment variables programmatically.
 * 
 * Usage:
 *   VERCEL_TOKEN=your_token node scripts/setup-vercel-env-api.js
 *   
 * Or interactively:
 *   node scripts/setup-vercel-env-api.js
 */

const https = require('https');

// Environment variables to set
const ENV_VARS = {
  RSR_FTP_HOST: 'ftps.rsrgroup.com',
  RSR_FTP_PORT: '2222',
  RSR_FTP_USER: '52417',
  RSR_FTP_PASSWORD: 'gLlK9Pxs',
  RSR_FTP_SECURE: 'true',
  RSR_INVENTORY_FILE: '/keydealer/rsrinventory-keydlr-new.txt',
  RSR_USE_KV: 'false',
  RSR_SYNC_ENABLED: 'true',
  RSR_MAX_RECORDS: '50000',
  RSR_BATCH_SIZE: '100',
};

// Get Vercel token from environment or prompt
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID || 'xl-arms';
const TEAM_ID = process.env.VERCEL_TEAM_ID; // Optional

if (!VERCEL_TOKEN) {
  console.error('❌ Error: VERCEL_TOKEN not found');
  console.error('');
  console.error('Please set VERCEL_TOKEN environment variable:');
  console.error('  export VERCEL_TOKEN=your_token_here');
  console.error('');
  console.error('Get your token from: https://vercel.com/account/tokens');
  process.exit(1);
}

/**
 * Make API request to Vercel
 */
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(new Error(`API Error ${res.statusCode}: ${response.error?.message || body}`));
          }
        } catch (err) {
          reject(new Error(`Failed to parse response: ${err.message}`));
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

/**
 * Get Vercel projects
 */
async function getProjects() {
  const options = {
    hostname: 'api.vercel.com',
    path: TEAM_ID ? `/v9/projects?teamId=${TEAM_ID}` : '/v9/projects',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };
  
  return makeRequest(options);
}

/**
 * Create or update environment variable
 */
async function setEnvVar(projectId, key, value, target = ['production', 'preview', 'development']) {
  const data = {
    key,
    value,
    target,
    type: 'encrypted',
  };
  
  const path = TEAM_ID 
    ? `/v10/projects/${projectId}/env?teamId=${TEAM_ID}`
    : `/v10/projects/${projectId}/env`;
  
  const options = {
    hostname: 'api.vercel.com',
    path,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };
  
  return makeRequest(options, data);
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 RSR FTP Integration - Vercel Environment Variable Setup');
  console.log('==========================================================');
  console.log('');
  
  try {
    // Get projects
    console.log('📋 Fetching Vercel projects...');
    const { projects } = await getProjects();
    
    if (!projects || projects.length === 0) {
      throw new Error('No projects found in your Vercel account');
    }
    
    // Find the xl-arms project
    const project = projects.find(p => p.name === PROJECT_ID || p.id === PROJECT_ID);
    
    if (!project) {
      console.log('\nAvailable projects:');
      projects.forEach(p => console.log(`  - ${p.name} (${p.id})`));
      throw new Error(`Project "${PROJECT_ID}" not found. Set VERCEL_PROJECT_ID environment variable.`);
    }
    
    console.log(`✅ Found project: ${project.name} (${project.id})`);
    console.log('');
    
    // Set environment variables
    console.log('📝 Setting environment variables...');
    console.log('');
    
    let successCount = 0;
    let failCount = 0;
    
    for (const [key, value] of Object.entries(ENV_VARS)) {
      try {
        // Mask sensitive values in output
        const displayValue = key.includes('PASSWORD') ? '***' : value;
        process.stdout.write(`  Setting ${key} = ${displayValue}...`);
        
        await setEnvVar(project.id, key, value);
        console.log(' ✅');
        successCount++;
      } catch (err) {
        console.log(` ❌ (${err.message})`);
        failCount++;
      }
    }
    
    console.log('');
    console.log(`📊 Results: ${successCount} succeeded, ${failCount} failed`);
    console.log('');
    
    if (failCount === 0) {
      console.log('✅ All environment variables set successfully!');
      console.log('');
      console.log('Next steps:');
      console.log('1. Deploy: vercel --prod');
      console.log('2. Test: curl -X POST https://your-domain.vercel.app/api/rsr/sync');
      console.log('');
    } else {
      console.log('⚠️  Some variables failed. Check the errors above.');
      process.exit(1);
    }
    
  } catch (err) {
    console.error('');
    console.error('❌ Error:', err.message);
    console.error('');
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { setEnvVar, getProjects };
