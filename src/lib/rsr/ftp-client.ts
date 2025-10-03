import * as ftp from 'basic-ftp';
import { Writable } from 'stream';

export interface RSRFTPConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  secure?: boolean;
  secureOptions?: object;
}

export class RSRFTPClient {
  private client: ftp.Client;
  private config: RSRFTPConfig;

  constructor(config: RSRFTPConfig) {
    this.client = new ftp.Client();
    this.config = config;
    
    // Enable logging for debugging in development
    if (process.env.NODE_ENV === 'development') {
      this.client.ftp.verbose = true;
    }
  }

  async connect(): Promise<void> {
    try {
      // Vercel-optimized connection settings
      const connectionOptions = {
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        secure: this.config.secure || false,
        secureOptions: {
          // RSR-specific TLS settings for Vercel compatibility
          minVersion: 'TLSv1.2' as const,
          rejectUnauthorized: false, // RSR may use self-signed certificates
          ...this.config.secureOptions,
        },
      };

      await this.client.access(connectionOptions);
      
      console.log('Connected to RSR FTP server');
    } catch (error) {
      console.error('Failed to connect to RSR FTP server:', error);
      throw new Error(`FTP connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async disconnect(): Promise<void> {
    try {
      this.client.close();
      console.log('Disconnected from RSR FTP server');
    } catch (error) {
      console.error('Error disconnecting from FTP server:', error);
    }
  }

  async listFiles(remotePath: string = '/'): Promise<ftp.FileInfo[]> {
    try {
      const files = await this.client.list(remotePath);
      console.log(`Listed ${files.length} files in ${remotePath}`);
      return files;
    } catch (error) {
      console.error(`Failed to list files in ${remotePath}:`, error);
      throw new Error(`Failed to list files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async downloadFile(remotePath: string, localPath: string): Promise<void> {
    try {
      await this.client.downloadTo(localPath, remotePath);
      console.log(`Downloaded ${remotePath} to ${localPath}`);
    } catch (error) {
      console.error(`Failed to download ${remotePath}:`, error);
      throw new Error(`Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async downloadToBuffer(remotePath: string): Promise<Buffer> {
    try {
      const chunks: Buffer[] = [];
      
      // Create a proper writable stream
      const stream = new Writable({
        write(chunk: Buffer, encoding: BufferEncoding, callback: (error?: Error | null) => void) {
          chunks.push(Buffer.from(chunk));
          callback();
        }
      });
      
      await this.client.downloadTo(stream, remotePath);
      
      const buffer = Buffer.concat(chunks);
      console.log(`Downloaded ${remotePath} to buffer (${buffer.length} bytes)`);
      return buffer;
    } catch (error) {
      console.error(`Failed to download ${remotePath} to buffer:`, error);
      throw new Error(`Failed to download file to buffer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getInventoryFile(): Promise<Buffer> {
    try {
      // If an explicit path or filename is provided via env, prefer that
      // Note: RSR Key Dealer accounts do NOT have read/list permission,
      // so RSR_INVENTORY_PATH is REQUIRED for these accounts
      const envPath = process.env.RSR_INVENTORY_PATH || process.env.RSR_INVENTORY_FILENAME;
      if (envPath) {
        console.log(`RSR_INVENTORY_PATH provided, downloading directly: ${envPath}`);
        return await this.downloadToBuffer(envPath);
      }

      // Attempt automatic discovery (only works if account has list permission)
      console.log('No RSR_INVENTORY_PATH set, attempting automatic file discovery...');
      
      try {
        // RSR typically provides inventory files with names like:
        // - rsrinventory.txt
        // - inventory_YYYYMMDD.txt
        // - current_inventory.csv

        const files = await this.listFiles('/');

        // Broad regex to match inventory-like filenames (csv, txt, optionally gz/zip)
        const pattern = /(rsr|inventory|current)[-_\w\d]*\.(txt|csv|gz|zip)$/i;

        // Also match files that include the word inventory anywhere
        const inventoryFile = files.find(file => pattern.test(file.name) || /inventory/i.test(file.name));

        if (!inventoryFile) {
          // Log the remote file list to make troubleshooting easier (safe to log names)
          const names = files.map(f => f.name).join(', ');
          console.warn('No inventory file matched. Remote files:', names);
          throw new Error('No inventory file found on RSR FTP server');
        }

        console.log(`Found inventory file: ${inventoryFile.name}`);
        return await this.downloadToBuffer(inventoryFile.name);
      } catch (listError) {
        // If listing fails (e.g., no read/list permission), provide helpful error
        console.error('Failed to list files for automatic discovery:', listError);
        throw new Error(
          'Cannot list FTP directory (no read/list permission). ' +
          'Please set RSR_INVENTORY_PATH environment variable with the exact file path. ' +
          'Example: RSR_INVENTORY_PATH=/keydealer/rsrinventory-keydlr-new.txt'
        );
      }
      
    } catch (error) {
      console.error('Failed to get inventory file:', error);
      throw new Error(`Failed to get inventory file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      await this.connect();
      await this.listFiles('/');
      await this.disconnect();
      return true;
    } catch (error) {
      console.error('Connection check failed:', error);
      return false;
    }
  }

  // Vercel-optimized connection check with detailed metrics
  async checkConnectionWithMetrics(): Promise<{
    isHealthy: boolean;
    responseTime: number;
    error?: string;
    serverInfo?: string;
  }> {
    const startTime = Date.now();
    
    try {
      await this.connect();
      
      // Test basic operations
      const files = await this.listFiles('/');
      const fileCount = files.length;
      
      // Get server info if available
      const serverInfo = this.client.ftp.socket?.remoteAddress || 'unknown';
      
      await this.disconnect();
      
      return {
        isHealthy: true,
        responseTime: Date.now() - startTime,
        serverInfo: `Connected to ${serverInfo}, found ${fileCount} files`,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Connection check with metrics failed:', error);
      
      return {
        isHealthy: false,
        responseTime: Date.now() - startTime,
        error: this.sanitizeError(errorMessage),
      };
    }
  }

  // Sanitize error messages to remove sensitive information
  private sanitizeError(error: string): string {
    return error
      .replace(/password=[^&\s]*/gi, 'password=***')
      .replace(/user=[^&\s]*/gi, 'user=***')
      .replace(/auth=[^&\s]*/gi, 'auth=***')
      .replace(/token=[^&\s]*/gi, 'token=***');
  }

  // Helper method to create an RSRFTPClient from environment variables
  static fromEnvironment(): RSRFTPClient {
    const config: RSRFTPConfig = {
      host: process.env.RSR_FTP_HOST || '',
      port: parseInt(process.env.RSR_FTP_PORT || '21'),
      user: process.env.RSR_FTP_USER || '',
      password: process.env.RSR_FTP_PASSWORD || '',
      secure: process.env.RSR_FTP_SECURE === 'true',
    };

    // Validate required environment variables
    if (!config.host || !config.user || !config.password) {
      throw new Error('Missing required RSR FTP environment variables. Please check RSR_FTP_HOST, RSR_FTP_USER, and RSR_FTP_PASSWORD.');
    }

    return new RSRFTPClient(config);
  }
}