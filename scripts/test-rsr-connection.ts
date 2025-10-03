// Run this locally to test the FTP connection
// Usage: npx tsx scripts/test-rsr-connection.ts

import { RSRFTPClient } from '../src/lib/rsr/ftp-client';
import { RSRInventoryParser } from '../src/lib/rsr/inventory-parser';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function testRSRConnection() {
  console.log('🚀 Starting RSR FTP Connection Test...\n');
  
  // Verify environment variables
  console.log('📋 Checking environment variables...');
  const requiredVars = ['RSR_FTP_HOST', 'RSR_FTP_USER', 'RSR_FTP_PASSWORD', 'RSR_FTP_PORT'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('\nPlease create a .env.local file with the required variables.');
    console.error('See .env.local.example for the template.\n');
    process.exit(1);
  }
  
  console.log('✅ All required environment variables found\n');
  
  // Display connection info (without credentials)
  console.log('🔗 Connection details:');
  console.log(`   Host: ${process.env.RSR_FTP_HOST}`);
  console.log(`   Port: ${process.env.RSR_FTP_PORT}`);
  console.log(`   User: ${process.env.RSR_FTP_USER}`);
  console.log(`   Secure: ${process.env.RSR_FTP_SECURE}`);
  console.log();
  
  let ftpClient: RSRFTPClient | null = null;
  
  try {
    // Test 1: Create FTP client
    console.log('🔧 Creating FTP client...');
    ftpClient = RSRFTPClient.fromEnvironment();
    console.log('✅ FTP client created successfully\n');
    
    // Test 2: Test connection
    console.log('🔌 Testing FTP connection...');
    await ftpClient.connect();
    console.log('✅ Connected to RSR FTP server successfully\n');
    
    // Note: RSR accounts don't have list permission, so we skip directory listing
    console.log('ℹ️  Note: RSR account does not have list permission');
    console.log('   Using direct file path from environment variables\n');
    
    // Test 3: Download and test parsing of the inventory file
    const inventoryFile = process.env.RSR_INVENTORY_PATH || process.env.RSR_INVENTORY_FILE || '/keydealer/rsrinventory-keydlr-new.txt';
    console.log(`📁 Attempting to download inventory file: ${inventoryFile}\n`);
    
    try {
      console.log(`📥 Downloading inventory file...`);
      
      const buffer = await ftpClient.downloadToBuffer(inventoryFile);
      console.log(`✅ Downloaded ${formatBytes(buffer.length)} successfully\n`);
      
      // Test parsing
      console.log('🔍 Testing inventory parser...');
      const parser = new RSRInventoryParser();
      const stats = parser.getParsingStats(buffer);
      
      console.log(`   File size: ${formatBytes(stats.fileSize)}`);
      console.log(`   Total lines: ${stats.totalLines}`);
      console.log(`   Estimated records: ${stats.estimatedRecords}`);
      console.log(`   Encoding: ${stats.encoding}`);
      
      // Parse a small sample
      console.log('\n📊 Parsing sample data (first 10 records)...');
      const sampleParser = new RSRInventoryParser({ maxRecords: 10 });
      const sampleItems = await sampleParser.parseInventory(buffer);
      
      console.log(`✅ Successfully parsed ${sampleItems.length} sample items`);
      
      if (sampleItems.length > 0) {
        console.log('\n📋 Sample product data:');
        const sample = sampleItems[0];
        console.log(`   Stock Number: ${sample.rsrStockNumber}`);
        console.log(`   Description: ${sample.description}`);
        console.log(`   Manufacturer: ${sample.manufacturerName}`);
        console.log(`   Price: $${sample.price.toFixed(2)}`);
        console.log(`   Quantity: ${sample.quantityOnHand}`);
      }
      
      // Save sample for inspection
      const outputDir = './tmp';
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      const samplePath = path.join(outputDir, 'rsr-sample.json');
      fs.writeFileSync(samplePath, JSON.stringify(sampleItems, null, 2));
      console.log(`\n💾 Sample data saved to: ${samplePath}`);
      
    } catch (error) {
      console.error(`❌ Error accessing inventory file: ${error}`);
      console.error('\nTroubleshooting:');
      console.error(`- Verify file path is correct: ${inventoryFile}`);
      console.error('- Check if file has been generated (see RSR schedule)');
      console.error('- Try the .zip version as fallback');
      throw error;
    }
    
    // Test 6: Test basic connection check method
    console.log('\n🔄 Testing connection check method...');
    await ftpClient.disconnect();
    const isHealthy = await ftpClient.checkConnection();
    console.log(`✅ Connection check result: ${isHealthy ? 'Healthy' : 'Failed'}\n`);
    
  } catch (error) {
    console.error(`❌ FTP connection test failed: ${error}`);
    console.error('\nPossible causes:');
    console.error('- Incorrect credentials');
    console.error('- RSR FTP server is down');
    console.error('- Network connectivity issues');
    console.error('- Firewall blocking the connection');
    console.error('- Wrong host/port configuration\n');
    process.exit(1);
    
  } finally {
    // Cleanup
    if (ftpClient) {
      try {
        await ftpClient.disconnect();
      } catch (error) {
        console.warn('Warning: Error during cleanup:', error);
      }
    }
  }
  
  console.log('🎉 RSR FTP connection test completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Deploy your application to Vercel');
  console.log('2. Set up environment variables in Vercel dashboard');
  console.log('3. Test the sync API endpoint');
  console.log('4. Enable the cron job for automatic syncing\n');
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Additional utility functions for testing
async function testDatabaseConnection() {
  console.log('🔧 Testing database connection...');
  
  try {
    const { RSRDatabase } = await import('../src/lib/rsr/database');
    const database = new RSRDatabase();
    const status = await database.getSyncStatus();
    
    console.log('✅ Database connection successful');
    console.log(`   Last sync: ${status.lastSync || 'Never'}`);
    console.log(`   Item count: ${status.itemCount}`);
    console.log(`   Healthy: ${status.isHealthy}`);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.error('Make sure your database is properly configured in Vercel.');
  }
}

async function testAPIEndpoints() {
  console.log('🔧 Testing API endpoints locally...');
  
  // This would need to be run against a deployed instance
  console.log('⚠️  API testing requires a deployed instance');
  console.log('Use these commands after deployment:');
  console.log('');
  console.log('# Check sync status');
  console.log('curl https://your-domain.vercel.app/api/rsr/sync');
  console.log('');
  console.log('# Trigger manual sync');
  console.log('curl -X POST https://your-domain.vercel.app/api/rsr/sync');
  console.log('');
  console.log('# Get products');
  console.log('curl "https://your-domain.vercel.app/api/rsr/products?page=1&pageSize=5"');
}

// Main execution
if (require.main === module) {
  testRSRConnection().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}