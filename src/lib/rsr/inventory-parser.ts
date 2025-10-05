import { parse } from 'csv-parse/sync';
import { RSRInventoryItem } from '../types/rsr';

export interface RSRParseOptions {
  delimiter?: string;
  encoding?: BufferEncoding;
  skipHeader?: boolean;
  maxRecords?: number;
}

export class RSRInventoryParser {
  private options: RSRParseOptions;

  constructor(options: RSRParseOptions = {}) {
    this.options = {
      delimiter: ';', // RSR uses semicolon-delimited format
      encoding: 'utf8',
      skipHeader: false,
      maxRecords: undefined,
      ...options
    };
  }

  /**
   * Parse RSR inventory data from buffer
   * RSR provides data in a 77-field semicolon-delimited format
   */
  async parseInventory(buffer: Buffer): Promise<RSRInventoryItem[]> {
    try {
      const content = buffer.toString(this.options.encoding);
      const lines = content.split('\n').filter(line => line.trim().length > 0);
      
      console.log(`Parsing ${lines.length} lines from RSR inventory file`);
      
      const records: RSRInventoryItem[] = [];
      let processedCount = 0;
      let errorCount = 0;
      
      for (let i = this.options.skipHeader ? 1 : 0; i < lines.length; i++) {
        if (this.options.maxRecords && records.length >= this.options.maxRecords) {
          break;
        }
        
        try {
          const line = lines[i].trim();
          if (!line) continue;
          
          const fields = this.parseLine(line);
          const item = this.mapFieldsToInventoryItem(fields);
          
          if (item) {
            records.push(item);
          }
          
          processedCount++;
        } catch (error) {
          errorCount++;
          console.warn(`Error parsing line ${i + 1}:`, error);
          
          // Continue processing other lines, but log the error
          if (errorCount > 100) {
            console.error('Too many parsing errors, stopping');
            break;
          }
        }
      }
      
      console.log(`Successfully parsed ${records.length} inventory items from ${processedCount} lines (${errorCount} errors)`);
      return records;
      
    } catch (error) {
      console.error('Failed to parse inventory data:', error);
      throw new Error(`Inventory parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private parseLine(line: string): string[] {
    try {
      // Handle semicolon-delimited format with potential quoted fields
      const records = parse(line, {
        delimiter: this.options.delimiter,
        quote: '"',
        escape: '"',
        skip_empty_lines: true,
      });
      
      return records[0] || [];
    } catch (parseError) {
      // Fallback to simple split if CSV parsing fails
      console.warn('CSV parsing failed, using simple split:', parseError);
      return line.split(this.options.delimiter || ';');
    }
  }

  private mapFieldsToInventoryItem(fields: string[]): RSRInventoryItem | null {
    try {
      // RSR's 77-field format mapping (positions may vary by RSR's current format)
      // This is a simplified mapping - you should adjust based on RSR's actual format documentation
      
      if (fields.length < 20) {
        console.warn('Insufficient fields in line, skipping');
        return null;
      }

      const item: RSRInventoryItem = {
        rsrStockNumber: this.cleanField(fields[0] || ''),
        upcCode: this.cleanField(fields[1] || ''),
        description: this.cleanField(fields[2] || ''),
        departmentNumber: this.parseNumber(fields[3]) || 0,
        manufacturerId: this.cleanField(fields[4] || ''),
        retailPrice: this.parseFloat(fields[5]) || 0,  // Field 6: MSRP - what customer pays
        price: this.parseFloat(fields[6]) || 0,         // Field 7: Your cost - wholesale price
        quantityOnHand: this.parseNumber(fields[7]) || 0, // Field 8: Quantity
        weight: this.parseFloat(fields[8]) || 0,        // Field 9: Weight
        category: this.cleanField(fields[9] || ''),     // Field 10: Category
        manufacturerName: this.cleanField(fields[10] || ''), // Field 11: Manufacturer Name
        model: this.cleanField(fields[11] || ''),       // Field 12: Model
        subcategory: this.cleanField(fields[12] || ''),  // Field 13: Special status like "Closeout"
        // Field 14: Full detailed description
        imageUrl: this.cleanField(fields[14] || ''),    // Field 15: Image filename
        // Additional fields from later in the record
        closeout: this.cleanField(fields[12]).toLowerCase() === 'closeout',
        // Shipping dimensions from fields 73-75
        length: this.cleanField(fields[72] || ''),
        width: this.cleanField(fields[73] || ''),
        height: this.cleanField(fields[74] || ''),
        // Placeholder values for unused fields
        caliber: this.cleanField(fields[16] || ''),
        capacity: 0,
        action: '',
        barrelLength: '',
        finish: '',
        stock: '',
        sights: '',
        safetyFeatures: '',
        accessories: '',
        warranty: '',
        countryOfOrigin: '',
        federalExciseTax: 0,
        shippingWeight: this.parseFloat(fields[8]) || 0,
        shippingLength: this.cleanField(fields[72] || ''),
        shippingWidth: this.cleanField(fields[73] || ''),
        shippingHeight: this.cleanField(fields[74] || ''),
        hazmat: false,
        freeShipping: false,
        dropShip: false,
        allocation: false,
        newItem: false,
        lastUpdated: new Date(),
      };

      // Validate required fields
      if (!item.rsrStockNumber || !item.description) {
        console.warn('Missing required fields, skipping item');
        return null;
      }

      return item;
      
    } catch (error) {
      console.warn('Error mapping fields to inventory item:', error);
      return null;
    }
  }

  private cleanField(value: string): string {
    return value.trim().replace(/^"|"$/g, ''); // Remove surrounding quotes
  }

  private parseNumber(value: string): number {
    const cleaned = this.cleanField(value);
    const parsed = parseInt(cleaned, 10);
    return isNaN(parsed) ? 0 : parsed;
  }

  private parseFloat(value: string): number {
    const cleaned = this.cleanField(value);
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }

  private parseBoolean(value: string): boolean {
    const cleaned = this.cleanField(value).toLowerCase();
    return cleaned === 'true' || cleaned === '1' || cleaned === 'yes' || cleaned === 'y';
  }

  /**
   * Validate inventory data structure
   */
  validateInventoryData(items: RSRInventoryItem[]): {
    valid: RSRInventoryItem[];
    invalid: { item: RSRInventoryItem; errors: string[] }[];
  } {
    const valid: RSRInventoryItem[] = [];
    const invalid: { item: RSRInventoryItem; errors: string[] }[] = [];

    items.forEach(item => {
      const errors: string[] = [];

      // Required field validation
      if (!item.rsrStockNumber) errors.push('Missing RSR stock number');
      if (!item.description) errors.push('Missing description');
      if (!item.manufacturerId) errors.push('Missing manufacturer ID');
      
      // Data type validation
      if (typeof item.price !== 'number' || item.price < 0) errors.push('Invalid price');
      if (typeof item.quantityOnHand !== 'number' || item.quantityOnHand < 0) errors.push('Invalid quantity');
      
      // Business logic validation
      if (item.price > 0 && item.retailPrice > 0 && item.retailPrice < item.price) {
        errors.push('Retail price is less than cost price');
      }

      if (errors.length === 0) {
        valid.push(item);
      } else {
        invalid.push({ item, errors });
      }
    });

    return { valid, invalid };
  }

  /**
   * Get parsing statistics
   */
  getParsingStats(buffer: Buffer): {
    totalLines: number;
    estimatedRecords: number;
    fileSize: number;
    encoding: string;
  } {
    const content = buffer.toString(this.options.encoding);
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    
    return {
      totalLines: lines.length,
      estimatedRecords: this.options.skipHeader ? lines.length - 1 : lines.length,
      fileSize: buffer.length,
      encoding: this.options.encoding || 'utf8',
    };
  }
}