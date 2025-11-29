# Production Security Recommendations

**Document Version**: 1.0  
**Last Updated**: November 16, 2025  
**Audience**: DevOps, Security Team, Product Managers

---

## 1. Pre-Deployment Security Checklist

### 1.1 Configuration Security

- [ ] **API Guard Configuration**
  - [ ] Verify `config/auth.php` has API guard set to `sanctum`
  - [ ] Test token authentication works with API requests
  - [ ] Verify web guard still works for admin panel (if applicable)

- [ ] **Environment Variables**
  ```bash
  # Check all required variables are set
  env | grep -E "CORS|SANCTUM|AUTH|APP_KEY|APP_URL" | sort
  ```
  Required:
  - `APP_KEY` (must be set, used for encryption)
  - `APP_URL` (must use HTTPS in production)
  - `CORS_ALLOWED_ORIGINS` (explicit origins only)
  - `SANCTUM_TOKEN_PREFIX` (default: `controlapp_`)
  - `SANCTUM_TOKEN_EXPIRATION` (minutes, default: 1440)
  - `SANCTUM_STATEFUL_DOMAINS` (for cookie-based auth)

- [ ] **Database Security**
  - [ ] Use separate database user with minimal privileges
  - [ ] Enable SSL connections to database
  - [ ] Regular automated backups configured
  - [ ] Backup encryption enabled

### 1.2 HTTPS/SSL Configuration

- [ ] **Certificate Installation**
  ```bash
  # Verify SSL certificate
  openssl s_client -connect app.domain.com:443 -showcerts
  ```
  - [ ] Certificate is valid (not self-signed in production)
  - [ ] Certificate chain complete
  - [ ] Expiration date is > 30 days away
  - [ ] Auto-renewal configured (Let's Encrypt cron job)

- [ ] **HTTP Strict Transport Security (HSTS)**
  ```bash
  # Add to nginx/apache config
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  ```

- [ ] **Redirect HTTP to HTTPS**
  ```bash
  # All HTTP requests should redirect to HTTPS
  curl -i http://app.domain.com
  # Should return 301 Moved Permanently to https://
  ```

### 1.3 Security Headers

- [ ] **Add Security Headers**
  ```bash
  # Configure web server to return these headers:
  
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  ```

- [ ] **Content Security Policy (CSP)**
  ```
  # Recommended minimum for API:
  default-src 'self'
  script-src 'self'
  style-src 'self' 'unsafe-inline'
  img-src 'self' data:
  font-src 'self'
  connect-src 'self'
  ```

### 1.4 CORS Verification

- [ ] **Test CORS Configuration**
  ```bash
  # Should succeed with correct origin
  curl -X OPTIONS https://api.domain.com/api/login \
    -H "Origin: https://app.domain.com" \
    -H "Access-Control-Request-Method: POST" \
    -v
  
  # Should contain correct headers in response:
  # Access-Control-Allow-Origin: https://app.domain.com
  # Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
  ```

- [ ] **Verify CORS blocks unauthorized origins**
  ```bash
  # Should fail or not return CORS headers for unauthorized origin
  curl -X OPTIONS https://api.domain.com/api/login \
    -H "Origin: https://attacker.com" \
    -v
  ```

---

## 2. Authentication & Authorization

### 2.1 Token Management

- [ ] **Token Lifecycle**
  - [ ] Tokens expire after 24 hours (or configured expiration)
  - [ ] Expired tokens return 401 Unauthorized
  - [ ] Token refresh mechanism works (if implemented)
  - [ ] Revoked tokens are rejected

- [ ] **Token Security**
  - [ ] Tokens contain prefix `controlapp_` for secret scanning
  - [ ] Tokens are cryptographically random
  - [ ] Tokens never logged in clear text
  - [ ] Tokens passed only via HTTPS

- [ ] **Test Token Expiration**
  ```php
  // In testing:
  SANCTUM_TOKEN_EXPIRATION=1 // 1 minute in .env.testing
  
  $response = $this->actingAs($user)->getJson('/api/user');
  sleep(61);
  $response = $this->getJson('/api/user');
  $response->assertStatus(401); // Token expired
  ```

### 2.2 Rate Limiting

- [ ] **Verify Rate Limits are Enforced**
  ```bash
  # Test login rate limiting (5 per minute)
  for i in {1..6}; do
    curl -X POST https://api.domain.com/api/login \
      -d "email=test@example.com&password=wrong" \
      -s | grep -q "Too Many Requests" && echo "Rate limited on attempt $i"
  done
  ```

- [ ] **Monitor Rate Limit Metrics**
  - [ ] Dashboard shows 429 response rate
  - [ ] Alerts trigger on unusual patterns
  - [ ] Adjust limits based on traffic patterns

- [ ] **Configure Distributed Rate Limiting**
  - [ ] If scaled to multiple servers, use Redis for rate limiting
  - [ ] Redis connection is monitored
  - [ ] Rate limit data is replicated

### 2.3 Password Security

- [ ] **Verify Password Hashing**
  - [ ] Passwords hashed with bcrypt (Laravel default)
  - [ ] Hash cost factor >= 12
  - [ ] No passwords stored in clear text

  ```php
  // Verify in user registration
  $hashedPassword = Hash::make($password); // Uses bcrypt with cost 10+
  ```

- [ ] **Password Reset Security**
  - [ ] Reset tokens expire after 60 minutes
  - [ ] One reset token per user at a time
  - [ ] Reset tokens never logged
  - [ ] Rate limited to 5 attempts per minute

  ```php
  // In config/auth.php
  'passwords' => [
      'users' => [
          'expire' => 60,        // 60 minutes
          'throttle' => 60,      // Prevent spam
      ],
  ],
  ```

### 2.4 Email Verification

- [ ] **Email Verification Enforcement**
  - [ ] New users must verify email before API access
  - [ ] Verification links expire after 24 hours
  - [ ] Can request new verification email (rate limited)
  - [ ] Database field `email_verified_at` is set on verification

  ```php
  // Test unverified user cannot access API
  $unverifiedUser = User::factory()->create(['email_verified_at' => null]);
  $response = $this->actingAs($unverifiedUser)->getJson('/api/user');
  // Should return 409 or similar unverified error
  ```

---

## 3. Data Protection

### 3.1 Input Validation

- [ ] **FormRequest Validation Active**
  - [ ] All POST/PUT/PATCH requests use FormRequest classes
  - [ ] Invalid requests return 422 Unprocessable Entity
  - [ ] Error messages don't reveal system details

  ```bash
  # Test invalid input
  curl -X POST https://api.domain.com/api/proyectos \
    -H "Authorization: Bearer TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"nombre": ""}'
  # Should return 422 with validation error
  ```

- [ ] **Type Validation**
  - [ ] Email validation includes DNS check (`email:rfc,dns`)
  - [ ] Enum fields validated against allowed values
  - [ ] Numeric fields validated for range
  - [ ] String lengths enforced

### 3.2 Authorization Policies

- [ ] **Policy Enforcement**
  - [ ] All destructive operations (DELETE, PATCH) require authorization
  - [ ] Users can only access their own projects
  - [ ] Admins can manage members
  - [ ] 403 Forbidden returned for unauthorized access

  ```bash
  # Test authorization
  USER_TOKEN=$(curl -X POST https://api.domain.com/api/login \
    -d "email=user@example.com&password=password" | jq -r .token)
  
  # Try to delete another user's project
  curl -X DELETE https://api.domain.com/api/proyectos/999 \
    -H "Authorization: Bearer $USER_TOKEN"
  # Should return 403 Forbidden
  ```

### 3.3 Database Security

- [ ] **Connection Security**
  - [ ] Database uses SSL/TLS connections
  - [ ] SSL certificates verified
  - [ ] No clear-text database passwords in logs

  ```php
  // In config/database.php for production
  'mysql' => [
      'driver' => 'mysql',
      'sslmode' => 'require',
      'options' => [
          PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => true,
      ],
  ],
  ```

- [ ] **Query Logging Disabled in Production**
  ```php
  // Ensure logging is disabled to prevent credential leaks
  DB::enableQueryLog(); // NEVER in production
  ```

- [ ] **SQL Injection Prevention**
  - [ ] All queries use parameterized statements (Eloquent ORM)
  - [ ] No raw SQL with unsanitized user input
  - [ ] Test with: `'; DROP TABLE users; --`

### 3.4 Sensitive Data

- [ ] **Password Field Hidden**
  ```php
  // In User model
  protected $hidden = ['password', 'remember_token'];
  // Verify password never returned in API responses
  ```

- [ ] **Token Field Hidden**
  ```php
  // Verify tokens not returned in API responses
  ```

- [ ] **Encryption for Sensitive Fields (Optional)**
  ```php
  // If sensitive data stored, encrypt it
  'bank_account' => 'encrypted:string',
  ```

---

## 4. Logging & Monitoring

### 4.1 Security Logging

- [ ] **Log Authentication Events**
  ```php
  // Log failed login attempts
  Log::warning('Failed login attempt', [
      'email' => $email,
      'ip' => request()->ip(),
      'timestamp' => now(),
  ]);
  
  // Log authorization failures
  Log::warning('Authorization denied', [
      'user_id' => $user->id,
      'action' => 'delete_project',
      'resource_id' => $proyecto->id,
  ]);
  ```

- [ ] **Monitor Suspicious Patterns**
  - [ ] Rapid 401/403 responses
  - [ ] 422 validation errors from same IP
  - [ ] Multiple failed password attempts
  - [ ] Access from unusual locations/IPs

### 4.2 Access Logs

- [ ] **Log all API requests** (optional for high-traffic APIs)
  ```php
  // Middleware to log requests
  Log::info('API request', [
      'method' => $request->method(),
      'path' => $request->path(),
      'ip' => $request->ip(),
      'user_id' => Auth::id(),
      'response_code' => $response->status(),
  ]);
  ```

- [ ] **Monitor 4xx/5xx Responses**
  - [ ] Set up alerts for spike in errors
  - [ ] Investigate patterns

### 4.3 Error Handling

- [ ] **Production Error Handling**
  - [ ] Detailed error messages NOT shown to users
  - [ ] Generic errors: "Server error occurred"
  - [ ] Stack traces only in logs, not responses
  - [ ] Errors sent to logging service (Sentry, Rollbar)

  ```php
  // In config/app.php
  'debug' => env('APP_DEBUG', false), // Must be false in production
  ```

### 4.4 Performance Monitoring

- [ ] **Monitor Query Performance**
  - [ ] Alert on slow queries (> 1 second)
  - [ ] Monitor N+1 query problems
  - [ ] Database connection pool health

- [ ] **Monitor API Response Times**
  - [ ] Alert on slow endpoints (> 500ms)
  - [ ] Monitor timeout rates
  - [ ] Track 5xx error rate

---

## 5. Deployment Process

### 5.1 Pre-Deployment Verification

```bash
# 1. Run security checks
composer audit                          # Check for vulnerable packages
vendor/bin/phpstan analyse --level=8   # Static analysis
php artisan test                        # Run all tests

# 2. Verify configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 3. Check migrations
php artisan migrate:status

# 4. Verify environment
grep -E "^(APP_|CORS_|SANCTUM_)" .env  # Check critical vars
```

### 5.2 Deployment Steps

```bash
# 1. Backup database
mysqldump -u user -p database > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Pull latest code
git pull origin main

# 3. Install/update dependencies
composer install --no-dev --optimize-autoloader

# 4. Run migrations
php artisan migrate --force

# 5. Clear caches
php artisan cache:clear
php artisan config:clear

# 6. Warm up caches
php artisan config:cache
php artisan route:cache

# 7. Verify application
curl -s https://api.domain.com/api/login -X POST | head -c 100

# 8. Monitor for errors
tail -f storage/logs/laravel.log | grep -i error
```

### 5.3 Post-Deployment Verification

- [ ] Application starts without errors
- [ ] Database migrations completed successfully
- [ ] API endpoints responding (200 for health check)
- [ ] Authentication tokens work
- [ ] Rate limiting active
- [ ] Logs don't show security errors
- [ ] Response headers correct (CORS, Security)

---

## 6. Monitoring & Maintenance

### 6.1 Daily Tasks

- [ ] Check error logs for anomalies
- [ ] Monitor application performance
- [ ] Verify backup completion

### 6.2 Weekly Tasks

- [ ] Review failed authentication logs
- [ ] Check rate limiting metrics
- [ ] Verify certificate expiration dates

### 6.3 Monthly Tasks

- [ ] Run `composer audit` for vulnerabilities
- [ ] Review access logs for suspicious activity
- [ ] Update security documentation
- [ ] Test disaster recovery

### 6.4 Quarterly Tasks

- [ ] Full security audit
- [ ] Penetration testing (if budget allows)
- [ ] Update dependencies
- [ ] Review and update policies

### 6.5 Annually

- [ ] Professional security audit
- [ ] Update incident response plan
- [ ] Review compliance requirements
- [ ] Rotate security credentials

---

## 7. Incident Response

### 7.1 Suspected Security Breach

1. **Immediate Actions**
   - [ ] Check error logs for unusual activity
   - [ ] Verify API responses returning 5xx errors
   - [ ] Check rate limiting metrics for abuse

2. **Investigation**
   - [ ] Review access logs for unauthorized activity
   - [ ] Check for unauthorized API tokens
   - [ ] Verify database integrity

3. **Containment**
   - [ ] Revoke compromised tokens
   - [ ] Block malicious IPs
   - [ ] Rotate secrets/credentials

4. **Recovery**
   - [ ] Apply security patches
   - [ ] Reset affected user passwords
   - [ ] Restore from backup if needed

### 7.2 Performance Issues

1. **Identify Problem**
   - [ ] Check error logs
   - [ ] Monitor CPU/Memory/Database load
   - [ ] Identify slow queries

2. **Mitigation**
   - [ ] Scale horizontally (add servers)
   - [ ] Optimize slow queries
   - [ ] Clear caches

3. **Prevention**
   - [ ] Update monitoring thresholds
   - [ ] Add auto-scaling rules

---

## 8. Environment Variable Template

```env
# Application
APP_NAME=ControlApp
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.domain.com
APP_KEY=base64:... # Generated with: php artisan key:generate

# Database
DB_CONNECTION=mysql
DB_HOST=db.domain.com
DB_PORT=3306
DB_DATABASE=controlapp_prod
DB_USERNAME=controlapp_user
DB_PASSWORD=... # Use strong password!

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://app.domain.com,https://www.domain.com

# Sanctum Configuration  
SANCTUM_TOKEN_PREFIX=controlapp_
SANCTUM_TOKEN_EXPIRATION=1440
SANCTUM_STATEFUL_DOMAINS=app.domain.com,www.domain.com

# Mail Configuration
MAIL_MAILER=ses
MAIL_FROM_ADDRESS=noreply@domain.com
MAIL_FROM_NAME="ControlApp"
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_DEFAULT_REGION=us-east-1
AWS_SES_REGION=us-east-1

# Queue Configuration
QUEUE_CONNECTION=database
QUEUE_DRIVER=database

# Cache Configuration
CACHE_DRIVER=redis
REDIS_HOST=redis.domain.com
REDIS_PASSWORD=...

# Logging
LOG_CHANNEL=stack
LOG_LEVEL=notice
SENTRY_LARAVEL_DSN=...
```

---

## 9. Emergency Contacts

- **Security Team Lead**: [Name] - [Email]
- **DevOps Lead**: [Name] - [Email]
- **On-Call**: [Rotation Schedule]
- **Incident Response Hotline**: [Number]

---

## 10. Reference Documentation

- [Laravel Security Checklist](https://laravel.com/docs/security)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Sanctum Documentation](https://laravel.com/docs/sanctum)

---

**Document Version**: 1.0  
**Last Updated**: November 16, 2025  
**Next Review**: February 16, 2026  
**Owner**: Security Team

