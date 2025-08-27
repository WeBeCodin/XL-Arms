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
      await this.client.access({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        secure: this.config.secure || false,
        secureOptions: this.config.secureOptions,
      });
      
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
      // RSR typically provides inventory files with names like:
      // - rsrinventory.txt
      // - inventory_YYYYMMDD.txt
      // - current_inventory.csv
      
      const files = await this.listFiles('/');
      
      // Look for common RSR inventory file patterns
      const inventoryFile = files.find(file => 
        file.name.toLowerCase().includes('inventory') ||
        file.name.toLowerCase().includes('rsrinventory') ||
        file.name.toLowerCase().includes('current')
      );
      
      if (!inventoryFile) {
        throw new Error('No inventory file found on RSR FTP server');
      }
      
      console.log(`Found inventory file: ${inventoryFile.name}`);
      return await this.downloadToBuffer(inventoryFile.name);
      
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