# Vercel FTP Strategy for RSR Integration

## Overview

This document outlines the comprehensive strategy for establishing secure FTP connectivity to RSR Group's servers through Vercel's serverless platform. The implementation leverages Vercel's Edge Runtime capabilities while addressing the unique challenges of FTP connections in a serverless environment.

## Architecture Strategy

### 1. Serverless FTP Approach

**Challenge**: Traditional FTP connections require persistent connections, which conflict with Vercel's stateless serverless functions.

**Solution**: 
- Use connection-per-operation pattern
- Implement robust connection pooling within function execution
- Leverage Vercel's extended timeout capabilities (60 seconds for Pro plans)
- Use FTPS (FTP over SSL/TLS) for security compliance

### 2. Environment Configuration

**Vercel-Specific Environment Variables:**
```bash
# RSR FTP Connection Settings
RSR_FTP_HOST=ftps.rsrgroup.com
RSR_FTP_PORT=2222
RSR_FTP_USER=[Your RSR Account Number]
RSR_FTP_PASSWORD=[Your RSR FTP Password]
RSR_FTP_SECURE=true

# Vercel Optimization Settings
NODE_ENV=production
RSR_MAX_RECORDS=50000
RSR_BATCH_SIZE=100
RSR_SYNC_ENABLED=true

# Database Selection (Vercel KV vs Postgres)
RSR_USE_KV=false  # false for Postgres, true for KV
```

## Deployment Strategy

### Phase 1: Environment Setup

1. **Vercel Dashboard Configuration**
   - Add all environment variables in Vercel Dashboard → Settings → Environment Variables
   - Set variables for Production, Preview, and Development environments
   - Ensure RSR_FTP_PASSWORD is marked as sensitive

2. **Database Integration**
   ```bash
   # Option A: Vercel Postgres (Recommended for complex queries)
   vercel storage create postgres
   
   # Option B: Vercel KV (Faster for simple lookups)
   vercel storage create kv
   ```

3. **Function Configuration**
   ```json
   // vercel.json
   {
     "functions": {
       "src/app/api/rsr/sync/route.ts": {
         "maxDuration": 60
       }
     },
     "crons": [
       {
         "path": "/api/rsr/sync",
         "schedule": "0 */6 * * *"
       }
     ]
   }
   ```

### Phase 2: FTP Connection Optimization

**Connection Strategy:**
```typescript
// Optimized for Vercel's serverless environment
export class VercelOptimizedRSRClient extends RSRFTPClient {
  private static connectionPool = new Map();
  
  async connect(): Promise<void> {
    const connectionKey = `${this.config.host}:${this.config.port}`;
    
    // Use connection caching within function execution
    if (VercelOptimizedRSRClient.connectionPool.has(connectionKey)) {
      this.client = VercelOptimizedRSRClient.connectionPool.get(connectionKey);
      return;
    }
    
    await super.connect();
    VercelOptimizedRSRClient.connectionPool.set(connectionKey, this.client);
  }
}
```

### Phase 3: Network Optimization

**Vercel Network Considerations:**
- Vercel functions run on AWS infrastructure
- Outbound connections are allowed on standard ports
- FTPS (port 2222) requires passive mode for firewalls
- Connection timeouts should be set to 30 seconds max

**Connection Configuration:**
```typescript
await this.client.access({
  host: this.config.host,
  port: this.config.port,
  user: this.config.user,
  password: this.config.password,
  secure: true,
  secureOptions: {
    rejectUnauthorized: false, // RSR may use self-signed certs
  },
  timeout: 30000, // 30 second timeout for Vercel
});
```

## Testing Strategy

### 1. Local Development Testing

```bash
# Create .env.local with actual RSR credentials
cp .env.local.example .env.local

# Test FTP connection locally
npx tsx scripts/test-rsr-connection.ts

# Test API endpoints locally
npm run dev
curl http://localhost:3000/api/rsr/sync
```

### 2. Production Deployment Testing

```bash
# Deploy to Vercel
vercel --prod

# Test sync endpoint
curl -X POST https://your-domain.vercel.app/api/rsr/sync

# Monitor function logs
vercel logs --follow
```

### 3. Connection Health Monitoring

```typescript
// Health check endpoint
export async function GET() {
  try {
    const ftpClient = RSRFTPClient.fromEnvironment();
    const isHealthy = await ftpClient.checkConnection();
    
    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      ftpServer: process.env.RSR_FTP_HOST,
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
    }, { status: 500 });
  }
}
```

## Security Strategy

### 1. Credential Management

**Best Practices:**
- Store all credentials in Vercel environment variables
- Never commit credentials to source code
- Use Vercel's encrypted environment variable storage
- Rotate credentials regularly

### 2. Connection Security

**FTPS Configuration:**
```typescript
const secureConfig = {
  host: process.env.RSR_FTP_HOST,
  port: parseInt(process.env.RSR_FTP_PORT || '2222'),
  user: process.env.RSR_FTP_USER,
  password: process.env.RSR_FTP_PASSWORD,
  secure: true, // Always use FTPS
  secureOptions: {
    // RSR-specific TLS settings
    minVersion: 'TLSv1.2',
    ciphers: 'HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA'
  }
};
```

### 3. Error Sanitization

```typescript
function sanitizeError(error: Error): string {
  return error.message
    .replace(/password=[^&\s]*/gi, 'password=***')
    .replace(/user=[^&\s]*/gi, 'user=***')
    .replace(/auth=[^&\s]*/gi, 'auth=***');
}
```

## Performance Strategy

### 1. Data Processing Optimization

**Streaming Approach:**
```typescript
async getInventoryFile(): Promise<Buffer> {
  // Use streaming for large files
  const stream = await this.downloadToStream('inventory.txt');
  const chunks: Buffer[] = [];
  
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}
```

### 2. Database Optimization

**Batch Processing:**
```typescript
async saveToDatabase(items: RSRProduct[]): Promise<void> {
  const batchSize = parseInt(process.env.RSR_BATCH_SIZE || '100');
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await this.processBatch(batch);
    
    // Yield to prevent timeout
    if (i % (batchSize * 10) === 0) {
      await new Promise(resolve => setImmediate(resolve));
    }
  }
}
```

## Monitoring Strategy

### 1. Sync Health Monitoring

```typescript
// Monitor sync frequency and health
const syncMetrics = {
  lastSync: Date.now(),
  recordsProcessed: 0,
  errors: [],
  avgProcessingTime: 0,
  successRate: 0.98
};
```

### 2. Error Alerting

```typescript
// Alert on repeated failures
if (consecutiveFailures > 3) {
  await sendAlert({
    type: 'RSR_SYNC_FAILURE',
    message: 'RSR FTP sync has failed 3+ consecutive times',
    details: { lastError: error.message }
  });
}
```

## Troubleshooting Guide

### Common Connection Issues

1. **DNS Resolution Failures**
   ```
   Error: getaddrinfo ENOTFOUND ftps.rsrgroup.com
   ```
   **Solution**: Verify RSR_FTP_HOST is correct, check network connectivity

2. **Authentication Failures**
   ```
   Error: 530 Login incorrect
   ```
   **Solution**: Verify RSR_FTP_USER and RSR_FTP_PASSWORD are correct

3. **Timeout Issues**
   ```
   Error: Timeout (control socket)
   ```
   **Solution**: Check RSR_FTP_PORT (2222), verify firewall settings

4. **SSL/TLS Issues**
   ```
   Error: unable to verify the first certificate
   ```
   **Solution**: Add `rejectUnauthorized: false` to secureOptions

### Vercel-Specific Issues

1. **Function Timeout**
   - Increase maxDuration to 60 seconds
   - Optimize batch processing
   - Consider splitting into multiple function calls

2. **Memory Limits**
   - Process inventory in smaller chunks
   - Use streaming for large files
   - Clear variables after processing

## Success Criteria

### Phase 1 Success Metrics:
- [ ] FTP connection establishes successfully
- [ ] Environment variables are properly configured
- [ ] Test sync completes without errors
- [ ] Health check endpoint returns "healthy"

### Phase 2 Success Metrics:
- [ ] Automated sync runs every 6 hours via cron
- [ ] Processing time under 45 seconds
- [ ] Error rate below 2%
- [ ] Database updates successfully

### Phase 3 Success Metrics:
- [ ] Monitoring and alerting operational
- [ ] Performance optimizations implemented
- [ ] Security audit passes
- [ ] Documentation complete

## Implementation Timeline

**Week 1**: Environment setup and basic FTP connectivity
**Week 2**: Database integration and sync optimization  
**Week 3**: Monitoring, security, and performance tuning
**Week 4**: Testing, documentation, and deployment

## Support and Maintenance

### Regular Tasks:
- Monitor sync health daily
- Review error logs weekly
- Update credentials quarterly
- Performance optimization monthly

### Emergency Procedures:
- Sync failure: Check logs, verify credentials, manual sync
- Connection issues: Verify RSR server status, check network
- Performance degradation: Review processing times, optimize queries

## Conclusion

This strategy provides a comprehensive approach to implementing RSR FTP connectivity on Vercel's serverless platform. The combination of proper environment configuration, connection optimization, robust error handling, and continuous monitoring ensures reliable inventory synchronization while maintaining security and performance standards.

The implementation leverages Vercel's strengths while addressing the challenges of FTP connections in a serverless environment through careful architecture and optimization strategies.