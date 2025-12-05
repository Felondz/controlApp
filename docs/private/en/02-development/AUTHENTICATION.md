# Authentication Guide - ControlApp

Complete guide to the authentication and authorization system in ControlApp.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication Flow](#authentication-flow)
3. [User Registration](#user-registration)
4. [Login and Tokens](#login-and-tokens)
5. [Email Verification](#email-verification)
6. [Authorization](#authorization)
7. [Security](#security)
8. [Troubleshooting](#troubleshooting)

---

## 🔐 Overview

ControlApp uses **Laravel Sanctum** for API token-based authentication. This system enables:

- ✅ Secure stateless authentication
- ✅ Multiple tokens per user
- ✅ Configurable token expiration
- ✅ Required email verification
- ✅ Customizable roles and permissions

### Security Stack

| Component | Technology | Purpose |
|-----------|-----------|----------|
| **Authentication** | Laravel Sanctum | JWT Tokens |
| **Encryption** | bcrypt | Passwords |
| **Emails** | Mailtrap + Custom Templates | Verification |
| **CORS** | Laravel CORS | Cross-Origin |
| **Rate Limiting** | Laravel Throttle | DDoS Protection |

---

## 🔄 Authentication Flow

### Step 1: Registration
```
POST /api/register
├── Validate data
├── Create user with encrypted password
├── Trigger Registered event
└── Send verification email
```

### Step 2: Email Verification
```
GET /api/email/verify/{id}/{hash}
├── Validate SHA1 hash
├── Mark email as verified
├── Trigger Verified event
└── User ready to login
```

### Step 3: Login
```
POST /api/login
├── Validate credentials
├── Verify email is verified
├── Generate Sanctum token
└── Return token + user data
```

### Step 4: Authenticated Usage
```
Any protected endpoint
├── Header: Authorization: Bearer {token}
├── Sanctum validates token
└── Execute action
```

### Step 5: Logout
```
POST /api/logout
├── Invalidate current token
└── User disconnected
```

---

## 👤 User Registration

### Endpoint
```http
POST /api/register
Content-Type: application/json
Accept: application/json
```

### Request Body
```json
{
  "name": "John Perez Garcia",
  "email": "john@example.com",
  "password": "MyPassword123!",
  "password_confirmation": "MyPassword123!"
}
```

### Validations
```
name:
  - Required
  - String
  - Maximum 255 characters
  - Minimum 2 characters

email:
  - Required
  - Valid email
  - Unique (no other user can have this email)
  - Maximum 255 characters

password:
  - Required
  - Minimum 8 characters
  - Confirmation must match
  - Recommended: uppercase, lowercase, numbers, symbols
```

### Response (201)
```json
{
  "message": "User registered successfully. Please log in."
}
```

### Error Responses

**422 - Duplicate Email**
```json
{
  "message": "The email has already been taken.",
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```

**422 - Weak Password**
```json
{
  "message": "The password confirmation does not match.",
  "errors": {
    "password": ["The password confirmation does not match."]
  }
}
```

### Post-Registration Flow

```
1. User registers
   ↓
2. System creates user in database
   ↓
3. Registered event is triggered
   ↓
4. Listener sends verification email
   ↓
5. Email contains link with SHA1 hash
   ↓
6. User clicks link
   ↓
7. Email is marked as verified
```

---

## 🔑 Login and Tokens

### Login Endpoint
```http
POST /api/login
Content-Type: application/json
Accept: application/json
```

### Request Body
```json
{
  "email": "john@example.com",
  "password": "MyPassword123!"
}
```

### Response (200)
```json
{
  "user": {
    "id": 1,
    "name": "John Perez Garcia",
    "email": "john@example.com",
    "email_verified_at": "2025-11-15 10:30:00",
    "created_at": "2025-11-15 09:45:00",
    "updated_at": "2025-11-15 09:45:00"
  },
  "token": "1|qZ8J9xK4mP2wL6vN3hD5sT7gF9eR2aB1cU5iO8jL9pM4q"
}
```

### Token Structure

The token has the format: `{tokenId}|{hash}`

- **{tokenId}**: Unique token ID in database
- **{hash}**: SHA256 hash of the full token

### Login Validations

```
If credentials invalid (401):
- Email does not exist in database
- Password does not match

If email not verified (422):
- User registered but did not verify email
- Must verify first to be able to login
```

### Error Responses

**401 - Invalid Credentials**
```json
{
  "message": "The provided credentials are invalid."
}
```

**422 - Email Not Verified**
```json
{
  "message": "Email not verified"
}
```

### Using the Token

Once logged in, use the token in all requests:

```http
GET /api/user
Authorization: Bearer 1|qZ8J9xK4mP2wL6vN3hD5sT7gF9eR2aB1cU5iO8jL9pM4q
Accept: application/json
```

### Store Token (Security)

#### ❌ DO NOT DO THIS (Insecure)
```javascript
// Don't store in localStorage
localStorage.setItem('token', response.token);

// Don't send via URL
fetch('/api/user?token=' + token)

// Don't expose in public logs
console.log('Token: ' + token);
```

#### ✅ DO THIS (Secure)
```javascript
// Store in httpOnly cookie
document.cookie = `token=${token}; HttpOnly; Secure; SameSite=Strict`;

// Or in memory (lost on page refresh)
let authToken = response.token;

// Send via header
fetch('/api/user', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Implement CSRF protection
// If using cookies, Laravel handles it automatically
```

---

## ✉️ Email Verification

### Complete Flow

```
1. User registers
   ↓
2. Email is sent with link:
   http://localhost:8000/api/email/verify/1/0a67a28003c728819cadf18f440831ff0349525d
   ↓
3. User clicks link
   ↓
4. System validates:
   - User ID exists
   - Hash matches SHA1 of email
   ↓
5. If valid:
   - Mark email as verified
   - Trigger Verified event
   ↓
6. User can login
```

### Hash Generation

The hash is calculated as:

```php
$hash = sha1($user->email);
```

Example:
- Email: `john@example.com`
- SHA1: `0a67a28003c728819cadf18f440831ff0349525d`

### Verification Endpoint

```http
GET /api/email/verify/{id}/{hash}
Accept: application/json
```

**⚠️ Important**: This endpoint does NOT require authentication.

### Response (200)
```json
{
  "message": "Email verified successfully! You can now log in."
}
```

### Error Responses

**404 - User Not Found**
```json
{
  "message": "User not found"
}
```

**400 - Invalid Hash or Email Already Verified**
```json
{
  "message": "The verification link is invalid or the email has already been verified"
}
```

### Resend Email

If the user does not receive the email:

```http
POST /api/email/verification-notification
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "status": "verification-link-sent"
}
```

---

## 🔒 Authorization

### Access Levels

#### 1. Without Authentication (Public)
```
- POST /api/register
- POST /api/login
- GET /api/email/verify/{id}/{hash}
- GET /api/projects/{id}
- GET /api/projects/{project}/invitations/{invitation}
```

#### 2. Authenticated (auth:sanctum)
```
- GET /api/user
- POST /api/logout
- POST /api/projects (create)
- PUT /api/projects/{id} (update own)
- DELETE /api/projects/{id} (delete own)
- POST /api/projects/{id}/categories
```

#### 3. Owner (ownership check)
```
- Only owner can:
  - Edit project
  - Delete project
  - Invite members
  - Change settings
```

### Implementation

#### Sanctum Middleware
```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
```

#### Policy (Authorization)
```php
class ProjectPolicy
{
    public function update(User $user, Project $project): bool
    {
        return $user->id === $project->user_id;
    }
}
```

### Authorization Error Handling

**401 - Not Authenticated**
```json
{
  "message": "Unauthenticated"
}
```

**403 - Not Authorized**
```json
{
  "message": "This action is unauthorized"
}
```

---

## 🛡️ Security

**Last Updated**: November 16, 2025 - Comprehensive Security Audit Applied

### 1. Authentication & Tokens (Laravel Sanctum)

#### Password Encryption

All passwords are encrypted with **bcrypt**:

```php
Hash::make($password); // Encrypt
Hash::check($password, $hash); // Verify
```

Features:
- Algorithm: bcrypt
- Rounds: 12 (configurable)
- Salt: auto-generated
- Time constant: resistant to timing attacks

#### Token Configuration

```env
# Sanctum Token Settings (in .env)
SANCTUM_TOKEN_PREFIX=controlapp_        # Detected by GitHub secret scanning
SANCTUM_TOKEN_EXPIRATION=1440            # 24 hours - configurable
```

**Token Prefix Benefit**: `controlapp_` prefix enables automatic detection by GitHub's secret scanning if accidentally committed.

**Token Lifecycle**:
- Tokens generated at login
- Expire after 24 hours (configurable)
- User must login again
- Tokens revoked at logout

```php
// Create multiple tokens
$token1 = $user->createToken('web');
$token2 = $user->createToken('mobile');
```

### 2. Sanctum Tokens

Each token:
- Is stored in database with SHA256 hash
- Has configurable expiration (by default, no expiration)
- Can be revoked anytime
- Is unique and non-reusable

### 3. CORS Protection

```php
// config/cors.php
'allowed_origins' => ['http://localhost:3000'],
'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE'],
'allowed_headers' => ['Content-Type', 'Authorization'],
'max_age' => 3600,
```

### 4. Rate Limiting

```php
// Authentication: maximum 5 attempts per minute
Route::post('/login', ...)->middleware('throttle:5,1');

// General API: maximum 60 requests per minute
Route::middleware('throttle:60,1')->group(function () {
    // routes
});
```

| Endpoint | Limit | Window | Purpose |
|----------|--------|---------|----------|
| `/login` | 5 | 1 min | Prevent brute force |
| `/register` | 5 | 1 min | Prevent spam |
| `/forgot-password` | 5 | 1 min | Prevent abuse |
| `/reset-password` | 5 | 1 min | Prevent abuse |
| `/email/verification-notification` | 6 | 1 min | Prevent spam |

**Response when exceeded (HTTP 429)**:
```json
{
  "message": "Too Many Requests"
}
```

### 5. Email Verification Requirement

Email must be verified before using the API:

```php
// In login controller
if (!$user->hasVerifiedEmail()) {
    return response()->json(['message' => 'Email not verified'], 422);
}
```

### 6. CSRF Validation

For requests from web (not API), Laravel includes CSRF automatically:

```html
<form method="POST">
    @csrf
    <!-- form -->
</form>
```

### 7. Best Practices

```php
// ✅ GOOD: Use Policies for authorization
$this->authorize('update', $project);

// ✅ GOOD: Validate input
$validated = $request->validate([
    'email' => 'required|email|unique:users',
    'password' => 'required|min:8|confirmed',
]);

// ✅ GOOD: Use bcrypt for passwords
'password' => Hash::make($request->password),

// ✅ GOOD: Log security events
Log::warning('Failed login attempt', ['email' => $email]);

// ✅ GOOD: Rate limiting on sensitive endpoints
Route::post('/login', [...])
    ->middleware('throttle:5,1');

// ❌ BAD: Store passwords in plain text
// ❌ BAD: Expose internal IDs without checking permissions
// ❌ BAD: Use == instead of hash_equals
// ❌ BAD: Store tokens in localStorage without protection
```

---

## 🔧 Troubleshooting

### Problem: "The provided credentials are invalid"

**Possible causes:**
1. Email does not exist
2. Password incorrect

**Solution:**
```bash
# Verify user exists
docker compose exec mysql mysql -h mysql -u sail -ppassword laravel \
  -e "SELECT id, email FROM users WHERE email='test@example.com';"

# Verify password with artisan tinker
docker compose exec laravel.test php artisan tinker
>>> $user = App\Models\User::find(1);
>>> Hash::check('password', $user->password);
```

### Problem: "Email not verified"

**Possible causes:**
1. User did not verify email
2. Email verification link expired

**Solution:**
```bash
# Resend verification email
# POST /api/email/verification-notification with token

# Or verify manually
docker compose exec mysql mysql -h mysql -u sail -ppassword laravel \
  -e "UPDATE users SET email_verified_at=NOW() WHERE id=1;"
```

### Problem: "Unauthenticated" on Protected Endpoints

**Possible causes:**
1. Token not sent in header
2. Token invalid or expired
3. Token belongs to another user

**Solution:**
```bash
# Verify header
curl -H "Authorization: Bearer {token}" http://localhost:8000/api/user

# Generate new token
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Problem: "The email has already been taken"

**Cause:** Email already exists in database

**Solution:**
```bash
# Use unique email
# Or query database
docker compose exec mysql mysql -h mysql -u sail -ppassword laravel \
  -e "SELECT email FROM users WHERE email='test@example.com';"
```

### Problem: Invalid Hash in Email Verification

**Possible causes:**
1. User email changed
2. Hash calculated incorrectly
3. Incorrect user ID

**Solution:**
```bash
# Calculate correct hash
echo -n "john@example.com" | sha1sum

# Verify user data
docker compose exec mysql mysql -h mysql -u sail -ppassword laravel \
  -e "SELECT id, email FROM users WHERE id=1;"
```

### Problem: CORS Error

**Possible cause:** Origin not allowed in `config/cors.php`

**Solution:**
```php
// config/cors.php
'allowed_origins' => ['*'], // Allow all (development only)
// Or specifically
'allowed_origins' => ['http://localhost:3000'],
```

---

## 📚 Additional Resources

- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)
- [Laravel Authentication](https://laravel.com/docs/authentication)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [bcrypt Documentation](https://en.wikipedia.org/wiki/Bcrypt)

---

**Last Updated**: November 15, 2025
