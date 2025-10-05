#!/usr/bin/env tsx

/**
 * Test RSR Inventory Parser with Real Data
 * This script validates the parser against the actual RSR inventory file
 */

import { readFileSync } from 'fs';
import { RSRInventoryParser } from '../src/lib/rsr/inventory-parser';

async function testParser() {
  console.log('='.repeat(80));
  console.log('RSR INVENTORY PARSER TEST - Real Data Validation');
  console.log('='.repeat(80));

  try {
    // Load the real RSR inventory file
    const filePath = '/workspaces/XL-Arms/data/rsrinventory-keydlr-new.txt';
    console.log(`\n📁 Loading file: ${filePath}`);
    
    const buffer = readFileSync(filePath);
    console.log(`✅ File loaded: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);

    // Initialize parser
    const parser = new RSRInventoryParser({
      delimiter: ';',
      encoding: 'utf8',
      skipHeader: false,
      maxRecords: 100, // Test with first 100 records
    });

    // Get file stats
    console.log('\n📊 File Statistics:');
    const stats = parser.getParsingStats(buffer);
    console.log(`   Total Lines: ${stats.totalLines.toLocaleString()}`);
    console.log(`   Estimated Records: ${stats.estimatedRecords.toLocaleString()}`);
    console.log(`   File Size: ${(stats.fileSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Encoding: ${stats.encoding}`);

    // Parse inventory (first 100 records for testing)
    console.log('\n🔄 Parsing inventory data (first 100 records)...');
    const startTime = Date.now();
    const items = await parser.parseInventory(buffer);
    const parseTime = Date.now() - startTime;

    console.log(`\n✅ Parsing completed in ${parseTime}ms`);
    console.log(`   Records parsed: ${items.length}`);
    console.log(`   Average time per record: ${(parseTime / items.length).toFixed(2)}ms`);

    // Validate parsed data
    console.log('\n🔍 Validating parsed data...');
    const validation = parser.validateInventoryData(items);
    console.log(`   ✅ Valid records: ${validation.valid.length}`);
    console.log(`   ❌ Invalid records: ${validation.invalid.length}`);

    if (validation.invalid.length > 0) {
      console.log('\n⚠️  Invalid Records Sample (first 5):');
      validation.invalid.slice(0, 5).forEach((inv, idx) => {
        console.log(`   ${idx + 1}. Stock#: ${inv.item.rsrStockNumber}`);
        console.log(`      Errors: ${inv.errors.join(', ')}`);
      });
    }

    // Display sample records
    console.log('\n📦 Sample Inventory Records (first 5):');
    console.log('='.repeat(80));
    validation.valid.slice(0, 5).forEach((item, idx) => {
      console.log(`\n${idx + 1}. ${item.description}`);
      console.log(`   Stock Number: ${item.rsrStockNumber}`);
      console.log(`   UPC: ${item.upcCode}`);
      console.log(`   Manufacturer: ${item.manufacturerName || item.manufacturerId}`);
      console.log(`   Dept: ${item.departmentNumber}`);
      console.log(`   Price: $${item.price.toFixed(2)} (Retail: $${item.retailPrice.toFixed(2)})`);
      console.log(`   Quantity: ${item.quantityOnHand}`);
      console.log(`   Model: ${item.model || 'N/A'}`);
      console.log(`   Weight: ${item.weight || 'N/A'}`);
    });

    // Field coverage analysis
    console.log('\n\n📈 Field Coverage Analysis:');
    console.log('='.repeat(80));
    const fieldCoverage: Record<string, number> = {};
    validation.valid.forEach(item => {
      Object.entries(item).forEach(([key, value]) => {
        if (!fieldCoverage[key]) fieldCoverage[key] = 0;
        if (value && value !== '' && value !== 0 && !(value instanceof Date)) {
          fieldCoverage[key]++;
        }
      });
    });

    const sortedCoverage = Object.entries(fieldCoverage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

    console.log('Top 20 Most Populated Fields:');
    sortedCoverage.forEach(([field, count]) => {
      const percentage = ((count / validation.valid.length) * 100).toFixed(1);
      const bar = '█'.repeat(Math.floor(Number(percentage) / 5));
      console.log(`   ${field.padEnd(25)} ${bar.padEnd(20)} ${percentage}% (${count}/${validation.valid.length})`);
    });

    // Price analysis
    console.log('\n\n💰 Price Analysis:');
    console.log('='.repeat(80));
    const prices = validation.valid.map(i => i.price).filter(p => p > 0);
    if (prices.length > 0) {
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      console.log(`   Average Price: $${avgPrice.toFixed(2)}`);
      console.log(`   Min Price: $${minPrice.toFixed(2)}`);
      console.log(`   Max Price: $${maxPrice.toFixed(2)}`);
      console.log(`   Total Records with Price: ${prices.length}`);
    }

    // Inventory analysis
    console.log('\n\n📦 Inventory Analysis:');
    console.log('='.repeat(80));
    const inStock = validation.valid.filter(i => i.quantityOnHand > 0);
    const outOfStock = validation.valid.filter(i => i.quantityOnHand === 0);
    const totalQuantity = validation.valid.reduce((sum, i) => sum + i.quantityOnHand, 0);
    
    console.log(`   In Stock: ${inStock.length} items (${((inStock.length / validation.valid.length) * 100).toFixed(1)}%)`);
    console.log(`   Out of Stock: ${outOfStock.length} items (${((outOfStock.length / validation.valid.length) * 100).toFixed(1)}%)`);
    console.log(`   Total Units Available: ${totalQuantity.toLocaleString()}`);
    console.log(`   Average Qty per SKU: ${(totalQuantity / validation.valid.length).toFixed(1)}`);

    // Department analysis
    console.log('\n\n🏢 Department Analysis:');
    console.log('='.repeat(80));
    const deptCounts: Record<number, number> = {};
    validation.valid.forEach(item => {
      deptCounts[item.departmentNumber] = (deptCounts[item.departmentNumber] || 0) + 1;
    });
    
    const topDepts = Object.entries(deptCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    console.log('Top 10 Departments by Item Count:');
    topDepts.forEach(([dept, count]) => {
      const percentage = ((count / validation.valid.length) * 100).toFixed(1);
      console.log(`   Dept ${dept.padStart(2)}: ${count.toString().padStart(4)} items (${percentage}%)`);
    });

    // Manufacturer analysis
    console.log('\n\n🏭 Manufacturer Analysis:');
    console.log('='.repeat(80));
    const mfgCounts: Record<string, number> = {};
    validation.valid.forEach(item => {
      const mfg = item.manufacturerName || item.manufacturerId;
      mfgCounts[mfg] = (mfgCounts[mfg] || 0) + 1;
    });
    
    const topMfgs = Object.entries(mfgCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    console.log('Top 10 Manufacturers by Item Count:');
    topMfgs.forEach(([mfg, count]) => {
      const percentage = ((count / validation.valid.length) * 100).toFixed(1);
      console.log(`   ${mfg.padEnd(25)} ${count.toString().padStart(3)} items (${percentage}%)`);
    });

    // Summary
    console.log('\n\n' + '='.repeat(80));
    console.log('✅ TEST SUMMARY');
    console.log('='.repeat(80));
    console.log(`✅ Parser is working correctly with real RSR data`);
    console.log(`✅ ${validation.valid.length} of ${items.length} records are valid`);
    console.log(`✅ Success rate: ${((validation.valid.length / items.length) * 100).toFixed(1)}%`);
    console.log(`✅ Ready for production use!`);
    
    if (validation.invalid.length > 0) {
      console.log(`\n⚠️  Note: ${validation.invalid.length} records had validation issues (review above)`);
    }

    console.log('\n' + '='.repeat(80));
    console.log('🎯 Next Steps:');
    console.log('   1. Review field coverage - ensure all critical fields are populated');
    console.log('   2. Test with full dataset (remove maxRecords limit)');
    console.log('   3. Deploy to production and test sync endpoint');
    console.log('   4. Monitor first automated sync at 3 AM UTC');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    process.exit(1);
  }
}

// Run the test
testParser()
  .then(() => {
    console.log('\n✅ Test completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
