# Security Setup for RSR FTP Integration

## Environment Variables Setup

### In Vercel Dashboard:

1. **Go to your project settings** in the Vercel dashboard
2. **Navigate to Environment Variables** section
3. **Add the following variables:**

#### Required FTP Credentials
```
RSR_FTP_HOST = ftps.rsrgroup.com
RSR_FTP_PORT = 2222
RSR_FTP_USER = [Your RSR Account Number]
RSR_FTP_PASSWORD = [Your RSR FTP Password]
RSR_FTP_SECURE = true
```

#### Database Configuration
```
RSR_USE_KV = false  # Set to true for KV, false for Postgres
```

#### Optional Configuration
```
RSR_SYNC_ENABLED = true
RSR_MAX_RECORDS = 50000
RSR_BATCH_SIZE = 100
NODE_ENV = production
```

### Environment-Specific Settings

- **Production**: Use all environments (Production, Preview, Development)
- **Preview**: Use for testing with staging credentials if available
- **Development**: Use local `.env.local` file (never commit this file)

## Database Security

### Vercel Postgres
- Database credentials are automatically managed by Vercel
- Connections are encrypted in transit
- Enable connection pooling for better performance
- Monitor connection limits and query performance

### Vercel KV (Redis)
- Redis credentials are automatically managed by Vercel
- All data is encrypted in transit and at rest
- Set appropriate TTL (Time To Live) for data expiration
- Monitor memory usage and key count

## FTP Security

### Connection Security
- Always use FTPS (FTP over SSL/TLS) when available
- Verify SSL certificates
- Use strong passwords and rotate them regularly
- Limit connection timeouts

### Access Control
- Restrict FTP access to specific IP ranges if possible
- Use dedicated FTP accounts for automated systems
- Monitor FTP access logs for suspicious activity
- Implement connection retry logic with exponential backoff

## API Security

### Rate Limiting
```typescript
// Consider implementing rate limiting for public APIs
const rateLimitConfig = {
  '/api/rsr/products': '100 requests per minute',
  '/api/rsr/sync': '10 requests per hour'
};
```

### Authentication (Optional)
```typescript
// Add API key authentication if needed
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/rsr/')) {
    const apiKey = request.headers.get('X-API-Key');
    if (!apiKey || apiKey !== process.env.RSR_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
}
```

### Input Validation
- Validate all query parameters
- Sanitize search inputs
- Limit pagination ranges
- Validate file uploads and data imports

## Network Security

### HTTPS Enforcement
- All API endpoints use HTTPS by default on Vercel
- Redirect HTTP to HTTPS in production
- Use HSTS headers for enhanced security

### CORS Configuration
```typescript
// Configure CORS for API routes if needed
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://your-domain.com',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
```

## Data Protection

### Encryption
- All data is encrypted in transit (HTTPS/TLS)
- Database encryption at rest (handled by Vercel)
- Consider encrypting sensitive fields in application layer

### Data Retention
```typescript
// Set appropriate data retention policies
const dataRetentionPolicy = {
  inventoryData: '7 days',
  syncLogs: '30 days',
  errorLogs: '90 days'
};
```

### PII Handling
- RSR inventory data typically doesn't contain PII
- Ensure customer data is handled separately
- Implement data purging for compliance

## Monitoring and Alerting

### Security Monitoring
- Monitor failed authentication attempts
- Track unusual API usage patterns
- Set up alerts for sync failures
- Monitor database connection failures

### Logging
```typescript
// Implement structured logging
const securityLog = {
  timestamp: new Date().toISOString(),
  event: 'ftp_connection_attempt',
  source: 'rsr-sync',
  success: true,
  metadata: {
    host: process.env.RSR_FTP_HOST,
    duration: connectionTime
  }
};
```

### Error Handling
```typescript
// Don't expose sensitive information in error messages
export function sanitizeError(error: Error): string {
  // Remove credentials, internal paths, etc.
  return error.message
    .replace(/password=[^&\s]*/gi, 'password=***')
    .replace(/token=[^&\s]*/gi, 'token=***')
    .replace(/key=[^&\s]*/gi, 'key=***');
}
```

## Compliance Considerations

### FFL Compliance
- Ensure inventory data handling complies with ATF regulations
- Implement audit trails for all data changes
- Maintain records of sync activities
- Consider data residency requirements

### Access Logs
```typescript
// Maintain detailed access logs
const auditLog = {
  timestamp: new Date().toISOString(),
  action: 'inventory_sync',
  user: 'system',
  recordsProcessed: count,
  source: 'rsr-ftp',
  result: 'success'
};
```

## Incident Response

### Security Incident Procedures
1. **Immediate Response**
   - Disable compromised credentials
   - Review access logs
   - Assess data exposure

2. **Investigation**
   - Collect relevant logs
   - Determine scope of incident
   - Document timeline

3. **Recovery**
   - Rotate all credentials
   - Update security measures
   - Test system integrity

4. **Post-Incident**
   - Conduct lessons learned
   - Update security procedures
   - Improve monitoring

### Emergency Contacts
- RSR Group technical support
- Vercel support team
- Internal security team
- Legal/compliance team

## Regular Security Tasks

### Daily
- Monitor sync status and errors
- Review access logs for anomalies
- Check system health metrics

### Weekly
- Review security alerts
- Validate backup integrity
- Check credential expiration dates

### Monthly
- Audit user access permissions
- Review security configurations
- Update dependencies and patches

### Quarterly
- Rotate FTP credentials
- Security configuration review
- Penetration testing (if applicable)
- Compliance audit

## Security Checklist

### Pre-Deployment
- [ ] All credentials stored in environment variables
- [ ] No sensitive data in source code
- [ ] HTTPS enforced for all endpoints
- [ ] Input validation implemented
- [ ] Error handling sanitizes sensitive data
- [ ] Logging configured appropriately

### Post-Deployment
- [ ] FTP connection tested and secure
- [ ] API endpoints tested for security
- [ ] Monitoring and alerting configured
- [ ] Access logs reviewed
- [ ] Backup and recovery tested
- [ ] Documentation updated

### Ongoing Maintenance
- [ ] Regular credential rotation
- [ ] Security patch management
- [ ] Access log review
- [ ] Performance monitoring
- [ ] Compliance verification
- [ ] Incident response testing

## Contact Information

### RSR Group
- **Technical Support**: [RSR Contact Information]
- **FTP Issues**: [RSR FTP Support]
- **Account Management**: [RSR Account Team]

### Vercel Support
- **General Support**: [Vercel Support Portal]
- **Security Issues**: [Vercel Security Contact]
- **Performance Issues**: [Vercel Performance Support]

Remember: Security is an ongoing process. Regularly review and update these procedures to maintain the highest level of protection for your RSR FTP integration.