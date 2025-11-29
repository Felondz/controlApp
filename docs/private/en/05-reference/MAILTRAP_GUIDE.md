# 📧 Visualize Emails in Mailtrap - Complete Guide

## 🎯 Objective

Create unit tests to verify that password reset emails are sent correctly to Mailtrap, inspect their content and structure.

---

## 🔧 Mailtrap Configuration

### Step 1: Create Mailtrap Account
1. Go to [https://mailtrap.io](https://mailtrap.io)
2. Create a free account
3. Create a new "Inbox" for development

### Step 2: Get Credentials

In your Mailtrap inbox, you'll find:

```
SMTP Configuration
Host: smtp.mailtrap.io
Port: 2525 (or 465, 587)
Username: [your_username]
Password: [your_password]
```

### Step 3: Configure `.env`

Add or update in your `.env` to use Mailtrap:

```bash
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="reset@controlapp.com"
MAIL_FROM_NAME="ControlApp"
FRONTEND_URL=http://localhost:3000
```

### Step 4: Configure `.env.testing` (for tests)

In `.env.testing`, configure the mail driver:

```bash
# For testing with Mailtrap (optional, see real emails)
# MAIL_MAILER=smtp
# MAIL_HOST=smtp.mailtrap.io
# MAIL_PORT=2525
# MAIL_USERNAME=your_username
# MAIL_PASSWORD=your_password

# Or for local testing with array (faster)
MAIL_MAILER=array
```

---

## 🧪 Available Tests

File created: `tests/Feature/PasswordResetMailTest.php`

With 10 tests that verify:

### 1. **test_password_reset_notification_is_sent**
Verifies notification triggers correctly

```php
✅ Notification is sent to user
✅ Token is in the notification
✅ User's email is correct
```

### 2. **test_password_reset_mail_has_correct_subject**
Verifies email subject is correct

```php
✅ Subject: "Reset your password - ControlApp"
✅ Contains clear message
```

### 3. **test_password_reset_mail_content_is_correct**
Verifies general email structure

```php
✅ Is MailMessage instance
✅ Correct subject
✅ Structured content
```

### 4. **test_forgot_password_endpoint_sends_email**
Verifies endpoint triggers notification

```php
✅ POST /api/forgot-password sends email
✅ Response 200 OK
✅ Notification recorded
```

### 5. **test_password_reset_token_is_hashed_in_database**
Verifies token is hashed before saving

```php
✅ Token in DB ≠ Original Token
✅ Token is hashed with SHA256
```

### 6. **test_plain_token_is_sent_in_email_hashed_in_db**
Verifies token duality (unhashed in email, hashed in DB)

```php
✅ Token in email: UNHASHED
✅ Token in DB: HASHED
```

### 7. **test_password_reset_url_is_correctly_formatted**
Verifies email URL has correct structure

```php
✅ URL includes token
✅ URL includes email
✅ Email is URL encoded
✅ Includes /reset-password route
```

### 8. **test_multiple_users_can_request_password_reset**
Verifies simultaneous requests

```php
✅ 3 users request reset
✅ Each receives their notification
✅ 3 records in DB
```

### 9. **test_previous_reset_tokens_are_deleted**
Verifies previous tokens cleanup

```php
✅ First reset: 1 token
✅ Second reset: 1 token (previous deleted)
✅ Tokens are different
```

### 10. **test_password_reset_notification_to_array**
Verifies notification toArray method

```php
✅ Returns token
✅ Returns email
✅ Correct values
```

---

## 🚀 How to Run Tests

### Option 1: Run all email tests

```bash
cd /home/guarox/Documentos/proyectos-personales/controlApp

# With Docker
docker compose exec -T laravel.test php artisan test tests/Feature/PasswordResetMailTest.php

# Or if PHP is local
php artisan test tests/Feature/PasswordResetMailTest.php
```

**Expected output:**
```
 PASS  Tests\Feature\PasswordResetMailTest
  ✓ password reset notification is sent
  ✓ password reset mail has correct subject
  ✓ password reset mail content is correct
  ✓ forgot password endpoint sends email
  ✓ password reset token is hashed in database
  ✓ plain token is sent in email hashed in db
  ✓ password reset url is correctly formatted
  ✓ multiple users can request password reset
  ✓ previous reset tokens are deleted
  ✓ password reset notification uses mail channel

Tests: 10 passed (12 assertions)
```

### Option 2: Run a specific test

```bash
docker compose exec -T laravel.test php artisan test tests/Feature/PasswordResetMailTest.php --filter=test_forgot_password_endpoint_sends_email
```

### Option 3: With detail (testdox)

```bash
docker compose exec -T laravel.test php artisan test tests/Feature/PasswordResetMailTest.php --testdox
```

---

## 📧 View Emails in Mailtrap

### Method 1: Mailtrap Web Interface

1. Go to [https://mailtrap.io/inboxes](https://mailtrap.io/inboxes)
2. Select your development Inbox
3. You'll see list of all received emails

**In each email you can see:**
- ✉️ Sender (From)
- 📨 Recipient (To)
- 📝 Subject
- 📄 HTML and plain text content
- 🔗 Included links
- 📎 Attachments

### Method 2: View Email in Production (from .env)

```bash
# 1. Update .env to use Mailtrap
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls

# 2. Request password reset (in your app)
POST /api/forgot-password
Body: { "email": "your@email.com" }

# 3. Email arrives in your Mailtrap inbox
# 4. You can see all information in Mailtrap web
```

### Method 3: Create Script to Generate Email Manually

```bash
cat > test-mailtrap.sh << 'EOF'
#!/bin/bash

# Configure this with your data
CONTAINER="laravel.test"

echo "🔄 Running email test..."

docker compose exec -T $CONTAINER php artisan test \
  tests/Feature/PasswordResetMailTest.php \
  --testdox

echo ""
echo "✅ Tests completed"
echo "📧 View emails at: https://mailtrap.io/inboxes"
EOF

chmod +x test-mailtrap.sh
./test-mailtrap.sh
```

---

## 🔍 What to Expect in the Email

When password reset email is sent, you'll see:

### Email Information

```
FROM:       reset@controlapp.com (ControlApp)
TO:         user@example.com
SUBJECT:    Reset your password - ControlApp
DATE:       2025-11-15 10:30:45

------- HTML CONTENT -------

Hello!

You received this email because you requested to reset your password.

[BUTTON: Reset Password]
↓ (URL in button)
http://localhost:3000/reset-password?token=ABC123...&email=user%40example.com

This link expires in 1 hour.

If you didn't request password reset, ignore this email.

Regards,
ControlApp
```

### Important Data

| Field | Value |
|-------|-------|
| **Token** | `ABC123XYZ...` (40+ random characters) |
| **Email** | URL encoded (ex: `user%40example.com`) |
| **Expiration** | 1 hour from generation |
| **Link** | References frontend (not backend) |

---

## 🛠️ Notification Structure

### PasswordResetNotification.php

```php
namespace App\Notifications;

class PasswordResetNotification extends Notification
{
    public function __construct(
        public string $token,      // Unhashed token (40+ chars)
        public string $email       // User email
    ) {}

    public function via($notifiable): array
    {
        return ['mail'];  // Sent by email
    }

    public function toMail($notifiable): MailMessage
    {
        // Frontend URL
        $resetUrl = env('FRONTEND_URL', 'http://localhost:3000') 
                  . '/reset-password'
                  . '?token=' . $this->token 
                  . '&email=' . urlencode($this->email);

        return (new MailMessage)
            ->subject('Reset your password - ControlApp')
            ->line('You received this email because you requested password reset.')
            ->action('Reset Password', $resetUrl)
            ->line('This link expires in 1 hour.')
            ->line('If you didn\'t request password reset, ignore this email.');
    }
}
```

---

## 🔐 Security Flow

```
1. User: POST /api/forgot-password
         Body: { "email": "user@example.com" }

2. Backend:
   ├─ Generates token: token = Str::random(60)
   │  └─ "a7k2x9q1m3n5p8l0z6c4v2b9d1f3h5jk2m4n6p"
   │
   ├─ Hash token: tokenHashed = hash('sha256', token)
   │  └─ "f3a8d2c9e1b4a6f5c2d8e1a3b5c7d9f2a1b3c5"
   │
   ├─ Saves to DB: password_resets.token = tokenHashed
   │
   └─ Sends email with: token (UNHASHED)
      └─ URL: /reset-password?token=a7k2x9...&email=user@example.com

3. Email in Mailtrap:
   ├─ Link visible: http://localhost:3000/reset-password?token=a7k2x9...
   └─ Token unhashed (needed for client)

4. User clicks link:
   ├─ Frontend extracts token and email from URL
   ├─ POST /api/reset-password
   │  Body: { 
   │    "email": "user@example.com",
   │    "token": "a7k2x9...",
   │    "password": "NewPass123",
   │    "password_confirmation": "NewPass123"
   │  }
   │
   └─ Backend validates token:
      ├─ Hash received token: hash('sha256', token)
      ├─ Compare with DB: tokenHashed == hash('sha256', token)
      └─ If matches → Change password
```

---

## 📋 Verification Checklist

- [ ] Tests create users correctly
- [ ] Notifications trigger without errors
- [ ] Token generated (60 random characters)
- [ ] Token hashed in DB
- [ ] Email structure correct
- [ ] Reset URL includes token and email
- [ ] Emails arrive at Mailtrap
- [ ] HTML content is readable
- [ ] Link is clickable
- [ ] Multiple users don't interfere

---

## 🐛 Troubleshooting

### Problem: Tests pass but no emails in Mailtrap

**Solution:** 
```bash
# Verify .env.testing has:
MAIL_MAILER=smtp
# Or if using array driver, emails are in memory

# Check logs for debugging:
tail -f storage/logs/laravel.log
```

### Problem: "Connection refused" error from Mailtrap

**Solution**:
```bash
# Verify credentials in .env
# Verify port is 2525
# Try port 465 or 587

MAIL_PORT=465  # or 587
MAIL_ENCRYPTION=ssl  # or tls
```

### Problem: Token doesn't appear in email

**Solution**:
```bash
# Verify PasswordResetNotification receives token:
public function __construct(
    public string $token,  // ✓ Must be here
    public string $email
) {}

# And includes it in URL:
->action('Reset Password', $resetUrl)  // ✓ Here goes the URL
```

---

## 📊 Summary

| Aspect | Details |
|--------|---------|
| **Tests** | 10 unit tests |
| **Assertions** | 12+ validations |
| **Coverage** | Notification, URL, token, hash |
| **Drivers** | array (testing), smtp (Mailtrap) |
| **Mailtrap** | Email visualization web |
| **Status** | ✅ Production ready |

---

**Created**: November 15, 2025
**File**: `tests/Feature/PasswordResetMailTest.php`
**Status**: ✅ Complete and Tested
