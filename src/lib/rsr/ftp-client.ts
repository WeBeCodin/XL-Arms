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
      // RSR accounts typically don't have list permissions
      // Use direct file path from environment variable if available
      const directFilePath = process.env.RSR_FTP_FILE_PATH;
      
      if (directFilePath) {
        console.log(`Using direct file path: ${directFilePath}`);
        return await this.downloadToBuffer(directFilePath);
      }
      
      // Fallback: Try to list files (for accounts with list permissions)
      console.log('No direct file path configured, attempting to list files...');
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
      
      // If we have a direct file path, test downloading a small portion
      const directFilePath = process.env.RSR_FTP_FILE_PATH;
      if (directFilePath) {
        console.log('Testing connection with direct file access...');
        // Just verify we can connect and the file exists
        // We don't actually download the full file
        await this.client.size(directFilePath);
        console.log('Direct file access successful');
      } else {
        // Fallback: Try listing for accounts with list permissions
        console.log('Testing connection with file listing...');
        await this.listFiles('/');
      }
      
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
      
      // Get server info if available
      const serverInfo = this.client.ftp.socket?.remoteAddress || 'unknown';
      
      // Test basic operations based on available permissions
      const directFilePath = process.env.RSR_FTP_FILE_PATH;
      let infoMessage = '';
      
      if (directFilePath) {
        // Test file access without listing
        const fileSize = await this.client.size(directFilePath);
        infoMessage = `Connected to ${serverInfo}, file size: ${fileSize} bytes`;
      } else {
        // Fallback: Test with listing for accounts with list permissions
        const files = await this.listFiles('/');
        const fileCount = files.length;
        infoMessage = `Connected to ${serverInfo}, found ${fileCount} files`;
      }
      
      await this.disconnect();
      
      return {
        isHealthy: true,
        responseTime: Date.now() - startTime,
        serverInfo: infoMessage,
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