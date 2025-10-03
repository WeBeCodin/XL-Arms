import { NextResponse } from 'next/server';
import { RSRFTPClient } from '@/lib/rsr/ftp-client';
import { RSRInventoryParser } from '@/lib/rsr/inventory-parser';
import { RSRDatabase } from '@/lib/rsr/database';
import { RSRSyncResponse } from '@/lib/types/rsr';

export const maxDuration = 60; // Maximum function duration in seconds

export async function POST() {
  const startTime = Date.now();
  let ftpClient: RSRFTPClient | null = null;
  let discoveredFileList: string[] | undefined = undefined;
  
  try {
    console.log('Starting RSR inventory sync...');
    
    // Initialize components
    ftpClient = RSRFTPClient.fromEnvironment();
    const parser = new RSRInventoryParser();
    const database = new RSRDatabase();
    
    // Connect to FTP and download inventory file
    console.log('Connecting to RSR FTP server...');
    await ftpClient.connect();
    
    console.log('Downloading inventory file...');
    let inventoryBuffer: Buffer | null = null;
    try {
      inventoryBuffer = await ftpClient.getInventoryFile();
    } catch (err) {
      // If discovery failed, try to obtain the remote file list for diagnostics
      try {
        const files = await ftpClient.listFiles('/');
        discoveredFileList = files.map(f => f.name);
      } catch (listErr) {
        console.warn('Failed to list files for diagnostics:', listErr);
      }
      throw err;
    }
    
    // Parse the inventory data
    console.log('Parsing inventory data...');
    const inventoryItems = await parser.parseInventory(inventoryBuffer);
    
    // Validate the data
    const validation = parser.validateInventoryData(inventoryItems);
    console.log(`Validation results: ${validation.valid.length} valid, ${validation.invalid.length} invalid items`);
    
    if (validation.invalid.length > 0) {
      console.warn('Some items failed validation:', validation.invalid.slice(0, 5)); // Log first 5 errors
    }
    
    // Save to database (determine which database to use based on environment)
    const useKV = process.env.RSR_USE_KV === 'true';
    const recordsUpdated = 0;
    const recordsAdded = validation.valid.length;
    
    if (useKV) {
      console.log('Saving to Vercel KV...');
      await database.saveToKV(validation.valid);
    } else {
      console.log('Saving to Vercel Postgres...');
      await database.saveToPostgres(validation.valid);
    }
    
    const processingTime = Date.now() - startTime;
    
    // Prepare response
    const response: RSRSyncResponse = {
      success: true,
      recordsProcessed: inventoryItems.length,
      recordsUpdated,
      recordsAdded,
      errors: validation.invalid.map(item => 
        `${item.item.rsrStockNumber || 'Unknown'}: ${item.errors.join(', ')}`
      ).slice(0, 10), // Limit to first 10 errors in response
      syncDate: new Date(),
      processingTime,
    };
    
    console.log(`RSR sync completed successfully in ${processingTime}ms`);
    console.log(`Processed: ${response.recordsProcessed}, Added: ${response.recordsAdded}, Errors: ${validation.invalid.length}`);
    
    return NextResponse.json(response);
    
    } catch (error) {
    const processingTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    console.error('RSR sync failed:', error);
    
    const response: RSRSyncResponse & { remoteFiles?: string[] } = {
      success: false,
      recordsProcessed: 0,
      recordsUpdated: 0,
      recordsAdded: 0,
      errors: [errorMessage],
      syncDate: new Date(),
      processingTime,
    };

    if (process.env.RSR_DEBUG_EXPOSE_FILE_LIST === 'true' && typeof discoveredFileList !== 'undefined') {
      response.remoteFiles = discoveredFileList;
    }

    return NextResponse.json(response, { status: 500 });
    
  } finally {
    // Cleanup FTP connection
    if (ftpClient) {
      try {
        await ftpClient.disconnect();
      } catch (error) {
        console.warn('Error disconnecting FTP client:', error);
      }
    }
  }
}

export async function GET() {
  try {
    // Get sync status
    const database = new RSRDatabase();
    const status = await database.getSyncStatus();
    
    return NextResponse.json({
      status: 'healthy',
      lastSync: status.lastSync,
      itemCount: status.itemCount,
      isHealthy: status.isHealthy,
      message: status.isHealthy 
        ? 'RSR integration is running normally' 
        : 'RSR sync may be outdated - check logs for issues',
    });
    
  } catch (error) {
    console.error('Failed to get sync status:', error);
    
    return NextResponse.json({
      status: 'error',
      lastSync: null,
      itemCount: 0,
      isHealthy: false,
      message: 'Failed to retrieve sync status',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}