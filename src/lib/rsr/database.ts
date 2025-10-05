import { RSRInventoryItem, RSRProduct } from '../types/rsr';
import { sql } from '@vercel/postgres';
import { kv } from '@vercel/kv';
import Redis from 'ioredis';

// This is a simplified example. Adapt to your database solution.
export class RSRDatabase {
  private kvClient: typeof kv | Redis;
  private useRedisProtocol: boolean;

  constructor() {
    // Support both REDIS_URL (direct Redis protocol) and standard KV environment variables (REST API)
    if (process.env.REDIS_URL && !process.env.KV_REST_API_URL) {
      console.log('Using REDIS_URL with ioredis client');
      this.kvClient = new Redis(process.env.REDIS_URL);
      this.useRedisProtocol = true;
    } else {
      console.log('Using standard KV REST API');
      this.kvClient = kv;
      this.useRedisProtocol = false;
    }
  }
  
  /**
   * Save inventory items to Vercel KV (Redis)
   */
  async saveToKV(items: RSRInventoryItem[]): Promise<void> {
    try {
      console.log(`Saving ${items.length} items to Redis/KV...`);
      
      // Save items in batches to avoid memory issues
      const batchSize = 100;
      let savedCount = 0;
      
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        
        // Execute batch operations
        for (const item of batch) {
          const key = `rsr:inventory:${item.rsrStockNumber}`;
          const value = JSON.stringify(item);
          
          if (this.useRedisProtocol) {
            // ioredis syntax: SET key value EX seconds
            await (this.kvClient as Redis).set(key, value, 'EX', 10800);
          } else {
            // @vercel/kv syntax
            await (this.kvClient as typeof kv).set(key, value, { ex: 10800 });
          }
        }
        savedCount += batch.length;
        
        console.log(`Saved batch ${Math.ceil((i + batchSize) / batchSize)} - ${savedCount}/${items.length} items`);
      }
      
      // Update metadata
      const lastSync = new Date().toISOString();
      if (this.useRedisProtocol) {
        await (this.kvClient as Redis).set('rsr:metadata:lastSync', lastSync);
        await (this.kvClient as Redis).set('rsr:metadata:itemCount', items.length.toString());
      } else {
        await (this.kvClient as typeof kv).set('rsr:metadata:lastSync', lastSync);
        await (this.kvClient as typeof kv).set('rsr:metadata:itemCount', items.length);
      }
      
      console.log(`Successfully saved ${savedCount} items to Redis/KV`);
      
    } catch (error) {
      console.error('Failed to save to Redis/KV:', error);
      throw new Error(`KV save failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Save inventory items to Vercel Postgres
   */
  async saveToPostgres(items: RSRInventoryItem[]): Promise<void> {
    try {
      console.log(`Saving ${items.length} items to Postgres...`);
      
      // Create table if it doesn't exist
      await this.createInventoryTable();
      
      // Clear existing data for fresh sync (fast truncate)
      await sql`TRUNCATE TABLE rsr_inventory`;
      
      // Insert new data in larger batches using COPY or multi-value INSERT
      const batchSize = 1000; // Much larger batch for bulk insert
      let savedCount = 0;
      
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        
        // Build a multi-row INSERT statement
        const values = batch.map((item, idx) => {
          const offset = idx * 40; // 40 fields per item
          return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5},
            $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9}, $${offset + 10},
            $${offset + 11}, $${offset + 12}, $${offset + 13}, $${offset + 14}, $${offset + 15},
            $${offset + 16}, $${offset + 17}, $${offset + 18}, $${offset + 19}, $${offset + 20},
            $${offset + 21}, $${offset + 22}, $${offset + 23}, $${offset + 24}, $${offset + 25},
            $${offset + 26}, $${offset + 27}, $${offset + 28}, $${offset + 29}, $${offset + 30},
            $${offset + 31}, $${offset + 32}, $${offset + 33}, $${offset + 34}, $${offset + 35},
            $${offset + 36}, $${offset + 37}, $${offset + 38}, $${offset + 39}, $${offset + 40})`;
        }).join(',\n');
        
        // Flatten all values for parameterized query
        const flatValues = batch.flatMap(item => [
          item.rsrStockNumber,
          item.upcCode,
          item.description,
          item.departmentNumber,
          item.manufacturerId,
          item.manufacturerName,
          item.price,
          item.retailPrice,
          item.quantityOnHand,
          item.weight,
          item.length,
          item.width,
          item.height,
          item.imageUrl,
          item.category,
          item.subcategory,
          item.model,
          item.caliber,
          item.capacity,
          item.action,
          item.barrelLength,
          item.finish,
          item.stock,
          item.sights,
          item.safetyFeatures,
          item.accessories,
          item.warranty,
          item.countryOfOrigin,
          item.federalExciseTax,
          item.shippingWeight,
          item.shippingLength,
          item.shippingWidth,
          item.shippingHeight,
          item.hazmat,
          item.freeShipping,
          item.dropShip,
          item.allocation,
          item.newItem,
          item.closeout,
          new Date().toISOString(),
        ]);
        
        // Execute bulk insert
        await sql.query(`
          INSERT INTO rsr_inventory (
            rsr_stock_number, upc_code, description, department_number, manufacturer_id,
            manufacturer_name, price, retail_price, quantity_on_hand, weight,
            length, width, height, image_url, category, subcategory, model, caliber,
            capacity, action, barrel_length, finish, stock, sights, safety_features,
            accessories, warranty, country_of_origin, federal_excise_tax, shipping_weight,
            shipping_length, shipping_width, shipping_height, hazmat, free_shipping,
            drop_ship, allocation, new_item, closeout, last_updated
          )
          VALUES ${values}
        `, flatValues);
        
        savedCount += batch.length;
        console.log(`Saved batch ${Math.ceil((i + batchSize) / batchSize)} - ${savedCount}/${items.length} items`);
      }
      
      // Update sync metadata
      await this.updateSyncMetadata(items.length);
      
      console.log(`Successfully saved ${savedCount} items to Postgres`);
      
    } catch (error) {
      console.error('Failed to save to Postgres:', error);
      throw new Error(`Postgres save failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get products from KV with pagination
   */
  async getProductsFromKV(page: number = 1, pageSize: number = 50): Promise<RSRProduct[]> {
    try {
      // Get all inventory keys
      let keys: string[];
      if (this.useRedisProtocol) {
        keys = await (this.kvClient as Redis).keys('rsr:inventory:*');
      } else {
        keys = await (this.kvClient as typeof kv).keys('rsr:inventory:*');
      }
      
      // Calculate pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedKeys = keys.slice(startIndex, endIndex);
      
      // Get items for this page
      let items: (string | null)[];
      if (this.useRedisProtocol) {
        const results = await (this.kvClient as Redis).mget(...paginatedKeys);
        items = results;
      } else {
        const results = await (this.kvClient as typeof kv).mget(...paginatedKeys);
        items = results as (string | null)[];
      }
      
      return items
        .filter((item): item is string => item !== null)
        .map((item) => JSON.parse(item) as RSRProduct);
        
    } catch (error) {
      console.error('Failed to get products from KV:', error);
      throw new Error(`KV read failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get products from Postgres with pagination
   */
  async getProductsFromPostgres(page: number = 1, pageSize: number = 50, searchTerm?: string): Promise<{
    products: RSRProduct[];
    totalCount: number;
  }> {
    try {
      const offset = (page - 1) * pageSize;
      
      // Get total count and paginated results
      let countResult;
      let result;
      
      if (searchTerm) {
        const searchPattern = `%${searchTerm}%`;
        countResult = await sql`
          SELECT COUNT(*) as count 
          FROM rsr_inventory 
          WHERE 
            description ILIKE ${searchPattern} OR 
            manufacturer_name ILIKE ${searchPattern} OR
            model ILIKE ${searchPattern} OR
            rsr_stock_number ILIKE ${searchPattern}
        `;
        
        result = await sql`
          SELECT * FROM rsr_inventory 
          WHERE 
            description ILIKE ${searchPattern} OR 
            manufacturer_name ILIKE ${searchPattern} OR
            model ILIKE ${searchPattern} OR
            rsr_stock_number ILIKE ${searchPattern}
          ORDER BY description ASC
          LIMIT ${pageSize} OFFSET ${offset}
        `;
      } else {
        countResult = await sql`
          SELECT COUNT(*) as count 
          FROM rsr_inventory
        `;
        
        result = await sql`
          SELECT * FROM rsr_inventory 
          ORDER BY description ASC
          LIMIT ${pageSize} OFFSET ${offset}
        `;
      }
      
      const totalCount = parseInt(countResult.rows[0].count);
      
      const products: RSRProduct[] = result.rows.map(row => ({
        rsrStockNumber: row.rsr_stock_number,
        upcCode: row.upc_code,
        description: row.description,
        departmentNumber: row.department_number,
        manufacturerId: row.manufacturer_id,
        manufacturerName: row.manufacturer_name,
        price: parseFloat(row.price),
        retailPrice: parseFloat(row.retail_price),
        quantityOnHand: row.quantity_on_hand,
        weight: parseFloat(row.weight),
        length: row.length,
        width: row.width,
        height: row.height,
        imageUrl: row.image_url,
        category: row.category,
        subcategory: row.subcategory,
        model: row.model,
        caliber: row.caliber,
        capacity: row.capacity,
        action: row.action,
        barrelLength: row.barrel_length,
        finish: row.finish,
        stock: row.stock,
        sights: row.sights,
        safetyFeatures: row.safety_features,
        accessories: row.accessories,
        warranty: row.warranty,
        countryOfOrigin: row.country_of_origin,
        federalExciseTax: parseFloat(row.federal_excise_tax),
        shippingWeight: parseFloat(row.shipping_weight),
        shippingLength: row.shipping_length,
        shippingWidth: row.shipping_width,
        shippingHeight: row.shipping_height,
        hazmat: row.hazmat,
        freeShipping: row.free_shipping,
        dropShip: row.drop_ship,
        allocation: row.allocation,
        newItem: row.new_item,
        closeout: row.closeout,
        lastUpdated: new Date(row.last_updated),
      }));
      
      return { products, totalCount };
      
    } catch (error) {
      console.error('Failed to get products from Postgres:', error);
      throw new Error(`Postgres read failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create the inventory table in Postgres
   */
  private async createInventoryTable(): Promise<void> {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS rsr_inventory (
          id SERIAL PRIMARY KEY,
          rsr_stock_number VARCHAR(50) UNIQUE NOT NULL,
          upc_code VARCHAR(20),
          description TEXT NOT NULL,
          department_number INTEGER,
          manufacturer_id VARCHAR(20),
          manufacturer_name VARCHAR(100),
          price DECIMAL(10,2),
          retail_price DECIMAL(10,2),
          quantity_on_hand INTEGER,
          weight DECIMAL(8,2),
          length VARCHAR(20),
          width VARCHAR(20),
          height VARCHAR(20),
          image_url TEXT,
          category VARCHAR(100),
          subcategory VARCHAR(100),
          model VARCHAR(100),
          caliber VARCHAR(50),
          capacity INTEGER,
          action VARCHAR(50),
          barrel_length VARCHAR(20),
          finish VARCHAR(100),
          stock VARCHAR(100),
          sights VARCHAR(100),
          safety_features TEXT,
          accessories TEXT,
          warranty TEXT,
          country_of_origin VARCHAR(100),
          federal_excise_tax DECIMAL(8,2),
          shipping_weight DECIMAL(8,2),
          shipping_length VARCHAR(20),
          shipping_width VARCHAR(20),
          shipping_height VARCHAR(20),
          hazmat BOOLEAN DEFAULT FALSE,
          free_shipping BOOLEAN DEFAULT FALSE,
          drop_ship BOOLEAN DEFAULT FALSE,
          allocation BOOLEAN DEFAULT FALSE,
          new_item BOOLEAN DEFAULT FALSE,
          closeout BOOLEAN DEFAULT FALSE,
          last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      // Create indexes for better performance
      await sql`CREATE INDEX IF NOT EXISTS idx_rsr_stock_number ON rsr_inventory(rsr_stock_number)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_description ON rsr_inventory(description)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_manufacturer ON rsr_inventory(manufacturer_name)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_category ON rsr_inventory(category)`;
      
    } catch (error) {
      console.error('Failed to create inventory table:', error);
      throw error;
    }
  }

  /**
   * Update sync metadata
   */
  private async updateSyncMetadata(itemCount: number): Promise<void> {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS rsr_sync_metadata (
          id SERIAL PRIMARY KEY,
          last_sync TIMESTAMP NOT NULL,
          item_count INTEGER NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      await sql`
        INSERT INTO rsr_sync_metadata (last_sync, item_count)
        VALUES (CURRENT_TIMESTAMP, ${itemCount})
      `;
      
    } catch (error) {
      console.error('Failed to update sync metadata:', error);
    }
  }

  /**
   * Get sync status and metadata
   */
  async getSyncStatus(): Promise<{
    lastSync: Date | null;
    itemCount: number;
    isHealthy: boolean;
  }> {
    try {
      // Try KV first (faster)
      let lastSyncKV: string | null;
      let itemCountKV: string | number | null;
      
      if (this.useRedisProtocol) {
        lastSyncKV = await (this.kvClient as Redis).get('rsr:metadata:lastSync');
        const itemCountStr = await (this.kvClient as Redis).get('rsr:metadata:itemCount');
        itemCountKV = itemCountStr ? parseInt(itemCountStr) : null;
      } else {
        lastSyncKV = await (this.kvClient as typeof kv).get('rsr:metadata:lastSync');
        itemCountKV = await (this.kvClient as typeof kv).get('rsr:metadata:itemCount');
      }
      
      if (lastSyncKV && itemCountKV) {
        const lastSync = new Date(lastSyncKV);
        const itemCount = typeof itemCountKV === 'string' ? parseInt(itemCountKV) : itemCountKV;
        const isHealthy = (Date.now() - lastSync.getTime()) < 3 * 60 * 60 * 1000; // Less than 3 hours old
        
        return { lastSync, itemCount, isHealthy };
      }
      
      // Fallback to Postgres
      const result = await sql`
        SELECT last_sync, item_count 
        FROM rsr_sync_metadata 
        ORDER BY id DESC 
        LIMIT 1
      `;
      
      if (result.rows.length > 0) {
        const row = result.rows[0];
        const lastSync = new Date(row.last_sync);
        const itemCount = row.item_count;
        const isHealthy = (Date.now() - lastSync.getTime()) < 3 * 60 * 60 * 1000;
        
        return { lastSync, itemCount, isHealthy };
      }
      
      return { lastSync: null, itemCount: 0, isHealthy: false };
      
    } catch (error) {
      console.error('Failed to get sync status:', error);
      return { lastSync: null, itemCount: 0, isHealthy: false };
    }
  }
}