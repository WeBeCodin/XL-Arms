import { NextResponse } from 'next/server';
import { RSRFTPClient } from '@/lib/rsr/ftp-client';

export async function GET() {
  try {
    console.log('Starting RSR FTP health check...');
    
    // Create FTP client from environment
    const ftpClient = RSRFTPClient.fromEnvironment();
    
    // Perform detailed connection check with metrics
    const healthCheck = await ftpClient.checkConnectionWithMetrics();
    
    // Prepare response based on health check results
    const response = {
      timestamp: new Date().toISOString(),
      service: 'RSR FTP Connection',
      status: healthCheck.isHealthy ? 'healthy' : 'unhealthy',
      responseTime: healthCheck.responseTime,
      details: {
        host: process.env.RSR_FTP_HOST,
        port: process.env.RSR_FTP_PORT,
        secure: process.env.RSR_FTP_SECURE === 'true',
        serverInfo: healthCheck.serverInfo,
        error: healthCheck.error,
      },
      vercelInfo: {
        region: process.env.VERCEL_REGION || 'unknown',
        deploymentUrl: process.env.VERCEL_URL || 'local',
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
      }
    };
    
    console.log(`FTP health check completed: ${healthCheck.isHealthy ? 'HEALTHY' : 'UNHEALTHY'} (${healthCheck.responseTime}ms)`);
    
    // Return appropriate HTTP status
    const httpStatus = healthCheck.isHealthy ? 200 : 503;
    return NextResponse.json(response, { status: httpStatus });
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    const errorResponse = {
      timestamp: new Date().toISOString(),
      service: 'RSR FTP Connection',
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      details: {
        host: process.env.RSR_FTP_HOST || 'not configured',
        port: process.env.RSR_FTP_PORT || 'not configured',
        hasCredentials: !!(process.env.RSR_FTP_USER && process.env.RSR_FTP_PASSWORD),
      },
      vercelInfo: {
        region: process.env.VERCEL_REGION || 'unknown',
        deploymentUrl: process.env.VERCEL_URL || 'local',
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
      }
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}