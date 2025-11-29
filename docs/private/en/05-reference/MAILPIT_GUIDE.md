# 📧 Mailpit - Complete Development Guide

## 🎯 Executive Summary

**Mailpit** is a local SMTP tool that simulates an email server. In ControlApp:
- ✅ Runs in Docker with `./vendor/bin/sail up`
- ✅ Web interface at `http://localhost:8025`
- ✅ Used ONLY in local development
- ✅ In GitHub Actions (CI) it's replaced with `MAIL_MAILER=log`

---

## 🚀 Quick Start

### 1. Start Mailpit (with Sail)

```bash
./vendor/bin/sail up
```

Mailpit starts automatically as a Docker service.

### 2. Access the Interface

Open in your browser:
```
http://localhost:8025
```

### 3. View Sent Emails

- All development emails are captured here
- You can see HTML, plaintext, headers
- Emails are NOT sent to real addresses (only captured)

---

## 🔧 Configuration

### In `.env` (Local Development)

```bash
MAIL_MAILER=mailpit
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_ENCRYPTION=
MAIL_USERNAME=
MAIL_PASSWORD=
```

**Note**: Sail configures this automatically in `compose.yaml`

### In `.env.testing` (Local Tests)

```bash
MAIL_MAILER=log
QUEUE_CONNECTION=sync
CI=
```

**Explanation**:
- `MAIL_MAILER=log`: Emails are written to `storage/logs/laravel.log`
- `CI=` (empty): Tests know we're in local, NOT in GitHub Actions
- Mailpit visual tests (VisualEmailTestsInMailpitTest.php) run normally

### In `.env.testing` (GitHub Actions)

The workflow automatically adds:
```bash
CI=true
MAIL_MAILER=log
QUEUE_CONNECTION=sync
```

**Explanation**:
- `CI=true`: Test class setUp() detects this and skips visual tests
- Mailpit visual tests are skipped automatically
- Regular email tests continue using Notification::fake()

---

## 📁 Email Test Structure

### Type 1: Visual Tests (Local Only)

**File**: `tests/Feature/VisualEmailTestsInMailpitTest.php`

**Behavior**:
```php
protected function setUp(): void
{
    parent::setUp();
    
    if (env('CI')) {
        // ⏭️ In GitHub Actions: SKIP these tests
        $this->markTestSkipped('Visual email tests only run locally with Mailpit');
    }
}
```

**Run locally**:
```bash
./vendor/bin/sail artisan test tests/Feature/VisualEmailTestsInMailpitTest.php
```

**Result**:
- ✅ Tests run
- 📧 Emails go to Mailpit
- 🌐 View at http://localhost:8025

**In GitHub Actions**:
- ⏭️ Tests are skipped automatically (don't block)
- ✅ Doesn't affect final workflow result

### Type 2: Functional Tests (Both Environments)

**Files**:
- `tests/Feature/PasswordResetMailTest.php`
- `tests/Feature/InvitacionesApiTest.php`
- `tests/Feature/EmailVerificationApiTest.php`

**Behavior**:
- **Local**: Notification::fake() mocks emails
- **CI**: Notification::fake() mocks emails (no Mailpit)

**Both use**:
```php
public function test_password_reset_notification_is_sent(): void
{
    Notification::fake();
    
    // ... create user and send notification ...
    
    Notification::assertSentTo($user, PasswordResetNotification::class);
}
```

**Advantage**: Don't need Mailpit to validate that emails ARE SENT

---

## 🧪 Visual Tests - How to Use

### Test 1: View Email Verification

```bash
./vendor/bin/sail artisan test tests/Feature/VisualEmailTestsInMailpitTest.php --filter "verificacion"
```

**Result**:
1. Test sends verification email to Mailpit
2. Test prints instructions in console:
   ```
   📧 SENDING VERIFICATION EMAIL
   To: verificacion@example.com
   User: Juan Verificacion
   
   Verification URL:
   http://localhost/verify/...
   
   ✅ Email sent to Mailpit
   
   📬 Go to http://localhost:8025 in your browser
   🔍 Search for email from: no-reply@controlapp.com
   📝 Subject: Verify your email
   ```
3. Open http://localhost:8025 in browser
4. Search for sent email
5. Click to view HTML and details

### Test 2: View Invitation Email

```bash
./vendor/bin/sail artisan test tests/Feature/VisualEmailTestsInMailpitTest.php --filter "invitacion"
```

**Result**: Similar, go to Mailpit to inspect

### Test 3: View ALL Emails at Once

```bash
./vendor/bin/sail artisan test tests/Feature/VisualEmailTestsInMailpitTest.php --filter "todos"
```

**Result**: Sends 3 emails:
1. Email verification
2. Project invitation
3. Password reset

Go to http://localhost:8025 to see all 3

---

## 🔍 Inspect Emails in Mailpit

### In the Web Interface

```
1. Open http://localhost:8025
2. You'll see a list of all captured emails
3. Click an email to open details
4. You can see:
   - HTML (rendered)
   - Plain Text
   - Source (headers and body)
   - Attachments (if any)
5. Test email links directly in browser
```

### View Rendered HTML

```
1. In email details, find "HTML" tab
2. You'll see how it looks in an email client
3. You can click links to test them
4. Useful to verify verification, reset, invitation links work
```

### Copy Tokens from Tests

```
1. Open email in Mailpit
2. Find URL with token
3. Copy complete URL
4. Paste in browser to test complete flow
```

---

## 🚨 Troubleshooting

### Mailpit doesn't appear at http://localhost:8025

**Cause**: Mailpit container isn't running

**Solution**:
```bash
./vendor/bin/sail up -d
# Wait 30 seconds for startup
curl http://localhost:8025
```

### I don't see emails in Mailpit

**Cause 1**: `.env` has incorrect `MAIL_MAILER`

**Check**:
```bash
grep MAIL_MAILER .env
# Should be: MAIL_MAILER=mailpit
```

**Solution**:
```bash
# Edit .env and set:
MAIL_MAILER=mailpit
MAIL_HOST=mailpit
MAIL_PORT=1025

# Restart Sail
./vendor/bin/sail restart
```

**Cause 2**: Email was sent to log instead of Mailpit

**Check**:
```bash
tail -f storage/logs/laravel.log | grep -i "sending"
```

**Solution**: Make sure you're not in `.env.testing`:
```bash
# In .env.testing:
MAIL_MAILER=log  # ← This goes to logs, NOT Mailpit

# For visual tests, use:
./vendor/bin/sail artisan test  # Uses .env.testing
```

### Visual tests are skipped locally

**Check**: Variable `CI`

```bash
grep "^CI=" .env.testing
# Should be empty or absent: CI=
# Should NOT be: CI=true
```

**If it's CI=true**:
```bash
# Edit .env.testing:
CI=
```

---

## 📊 Comparison: Local vs CI

| Aspect | Local (Mailpit) | CI (GitHub Actions) |
|--------|-----------------|---------------------|
| **Tool** | Mailpit | N/A (log driver) |
| **Interface** | http://localhost:8025 | N/A |
| **MAIL_MAILER** | mailpit | log |
| **View Emails** | Web UI | storage/logs/laravel.log |
| **Visual Tests** | ✅ Runs | ⏭️ Skipped |
| **Functional Tests** | ✅ Runs | ✅ Runs |
| **Validate Emails** | Mailpit | Notification::fake() |

---

## 💡 Best Practices

### 1. Always Verify Emails in Mailpit During Dev

```bash
# Terminal 1: Start Sail
./vendor/bin/sail up

# Terminal 2: Run visual tests
./vendor/bin/sail artisan test tests/Feature/VisualEmailTestsInMailpitTest.php

# Browser: See emails at http://localhost:8025
```

### 2. Use Functional Tests for CI

```php
// ✅ GOOD: Use Notification::fake()
Notification::fake();
$user->notify(new MyNotification());
Notification::assertSentTo($user, MyNotification::class);

// ❌ BAD: Trust Mailpit (doesn't exist in CI)
// Just sends email hoping to see in Mailpit
```

### 3. Respect the CI Variable

```php
// Always check CI if tests need Mailpit
if (env('CI')) {
    $this->markTestSkipped('Local development only');
}
```

### 4. Document Visual Tests

```php
/**
 * 📧 VISUAL TEST: See email in Mailpit
 * 
 * ONLY runs locally. Automatically skipped in CI.
 * 
 * Instructions:
 * 1. ./vendor/bin/sail artisan test --filter "this_test"
 * 2. Open http://localhost:8025
 * 3. Inspect the email
 */
```

---

## 🔗 References

- **Mailpit Documentation**: https://mailpit.axllent.org/
- **Docker Compose**: See `compose.yaml` in project root
- **Visual Tests**: `tests/Feature/VisualEmailTestsInMailpitTest.php`
- **Functional Tests**: `tests/Feature/PasswordResetMailTest.php`
- **CI Configuration**: `.github/workflows/tests.yml`

---

## ✅ Developer Checklist

Before committing:

- [ ] Visual tests work locally (Mailpit visible)
- [ ] Functional tests pass in CI (no Mailpit)
- [ ] Verified `CI=` in `.env.testing` (empty)
- [ ] Verified `CI=true` added in workflow
- [ ] If added new email test:
  - [ ] Is it visual (needs Mailpit)? → Add `if (env('CI')) { $this->markTestSkipped(...) }`
  - [ ] Is it functional (Notification::fake())? → No skip needed
- [ ] Documented test with clear comment

---

**Last Updated**: November 16, 2025
**Status**: ✅ Mailpit + Log Driver + CI Skip correctly configured
