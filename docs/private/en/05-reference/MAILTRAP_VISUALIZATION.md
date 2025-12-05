# 🎨 Email Visualization in Mailtrap

## 📧 Password Reset Email Preview

When a user requests a password reset and the email arrives at Mailtrap, you'll see something like this:

---

## 🌐 Mailtrap Panel - Inbox

```
┌──────────────────────────────────────────────────────────────────────────┐
│ MAILTRAP INBOX                                                           │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  📬 Inbox                    ✉️ 12 emails                  🔍 Search    │
│  📋 All Inboxes                                                         │
│  ⚙️  Settings                                                           │
│  📊 Dashboard                                                           │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  FROM: reset@controlapp.com (ControlApp)     TIME: 2 minutes ago        │
│  TO: juan@example.com                         [MARK] [DELETE]          │
│  SUBJECT: ✉️ Reset your password - ControlApp                          │
│  STATUS: ✅ Delivered                                                  │
│  │                                                                       │
│  ├─ DATE: Nov 15, 2025, 10:30:45 PM UTC                               │
│  ├─ MESSAGE-ID: <abc123@mailtrap.io>                                  │
│  ├─ HEADERS: [Show]                                                    │
│  └─ CONTENT-TYPE: multipart/alternative                               │
│                                                                          │
│  ┌─ PREVIEW ────────────────────────────────────────────────────────┐  │
│  │                                                                  │  │
│  │  Hello!                                                         │  │
│  │                                                                  │  │
│  │  You received this email because you requested to reset...     │  │
│  │                                                                  │  │
│  │  [RESET PASSWORD]                                              │  │
│  │                                                                  │  │
│  │  This link expires in 1 hour.                                  │  │
│  │  If you didn't request...                                       │  │
│  │                                                                  │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 📄 Email HTML View

If you click on the email, you see all the information:

### Headers (Email Headers)

```
RECEIVED: from mailtrap.io [192.0.2.1] by mailtrap.io
          (Postfix) with ESMTP id ABC123DEF456
          for <mailtrap@example.com>; Nov 15 22:30:45 +0000

FROM:       "ControlApp" <reset@controlapp.com>
TO:         juan@example.com
SUBJECT:    Reset your password - ControlApp
DATE:       Mon, 15 Nov 2025 22:30:45 +0000

MESSAGE-ID: <mailj9q8r7s6t5@mailtrap.io>
X-MAILER:   Laravel/11.x
X-PRIORITY: 3 (Normal)
MIME-VERSION: 1.0
CONTENT-TYPE: multipart/alternative; boundary="===============boundary123=="
CONTENT-TRANSFER-ENCODING: 8bit
```

### Body - Plain Text

```
Hello!

You received this email because you requested to reset your password.

Reset Password
http://localhost:3000/reset-password?token=a7k2x9q1m3n5p8l0z6c4v2b9d1f3h5jk2m4n6p&email=juan%40example.com

This link expires in 1 hour.

If you didn't request password reset, ignore this email.

Regards,
ControlApp
```

### Body - HTML (Formatted View)

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.5; }
        .button { background-color: #007bff; color: white; padding: 10px 20px; 
                  text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <h2>Hello!</h2>
    
    <p>You received this email because you requested to reset your password.</p>
    
    <p>
        <a href="http://localhost:3000/reset-password?token=a7k2x9q1m3n5p8l0z6c4v2b9d1f3h5jk2m4n6p&email=juan%40example.com" 
           class="button">
            Reset Password
        </a>
    </p>
    
    <p>This link expires in 1 hour.</p>
    
    <p>If you didn't request password reset, ignore this email.</p>
    
    <p>
        Regards,<br>
        <strong>ControlApp</strong>
    </p>
</body>
</html>
```

---

## 🔗 Links (URL Analysis)

If you click the "Links" tab in Mailtrap:

```
┌────────────────────────────────────────────────────────────────┐
│ LINKS IN THIS EMAIL                                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  🔗 Link #1                                                   │
│  ─────────                                                    │
│  Text:     "Reset Password"                                  │
│  URL:      http://localhost:3000/reset-password?token=a7...  │
│  Status:   Not verified (link not clicked)                    │
│                                                                │
│  ┌─ FULL URL ───────────────────────────────────────────────┐ │
│  │ http://localhost:3000/reset-password                      │ │
│  │   ?token=a7k2x9q1m3n5p8l0z6c4v2b9d1f3h5jk2m4n6p          │ │
│  │   &email=juan%40example.com                               │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                │
│  Parameters:                                                  │
│  • token: a7k2x9q1m3n5p8l0z6c4v2b9d1f3h5jk2m4n6p             │
│  • email: juan@example.com (URL encoded)                     │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 📋 Attachments

```
┌────────────────────────────────────────────────────────────────┐
│ ATTACHMENTS                                                    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  No attachments found                                          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 📊 Email Metadata

```
┌────────────────────────────────────────────────────────────────┐
│ EMAIL METADATA                                                 │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Delivered:      ✅ Yes                                        │
│  Spam Score:     0.0 (Not spam)                               │
│  Bounce Risk:    0.0                                          │
│  Read Status:    Marked as read by recipient                  │
│  Size:           12 KB                                        │
│  Parts:          2 (HTML + Plain text)                        │
│  Charset:        UTF-8                                        │
│  Encoding:       7bit                                         │
│                                                                │
│  AUTHENTICITY CHECKS                                          │
│  ─────────────────────────────────────────────────────────    │
│  SPF:      ✅ Pass   (from smtp.mailtrap.io)                  │
│  DKIM:     ❌ Fail   (Not signed)                             │
│  DMARC:    ⚠️  Neutral                                        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Raw Source View

If you want to see the email in raw format, there's a "Show Source" option:

```
Return-Path: <reset@controlapp.com>
Received: from mailtrap.io (mailtrap.io [192.0.2.1])
	by mailtrap.io (Postfix) with ESMTP id ABC123
	for <mailtrap@example.com>;
	Mon, 15 Nov 2025 22:30:45 +0000 (UTC)

Date: Mon, 15 Nov 2025 22:30:45 +0000
From: "ControlApp" <reset@controlapp.com>
Reply-To: reset@controlapp.com
To: juan@example.com
Subject: Reset your password - ControlApp
Message-ID: <mailj9q8r7s6t5@mailtrap.io>
MIME-Version: 1.0
Content-Type: multipart/alternative;
 boundary="===============boundary123=="
Content-Transfer-Encoding: 8bit

--===============boundary123==
Content-Type: text/plain; charset="utf-8"
Content-Transfer-Encoding: 8bit

Hello!

You received this email because you requested to reset your password.

Reset Password
http://localhost:3000/reset-password?token=a7k2x9q1m3n5p8l0z6c4v2b9d1f3h5jk2m4n6p&email=juan%40example.com

This link expires in 1 hour.

If you didn't request password reset, ignore this email.

Regards,
ControlApp

--===============boundary123==
Content-Type: text/html; charset="utf-8"
Content-Transfer-Encoding: 8bit

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.5; }
        .button { background-color: #007bff; color: white; padding: 10px 20px; 
                  text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <h2>Hello!</h2>
    <p>You received this email because you requested to reset your password.</p>
    <p><a href="http://localhost:3000/reset-password?token=a7k2x9q1m3n5p8l0z6c4v2b9d1f3h5jk2m4n6p&email=juan%40example.com" class="button">Reset Password</a></p>
    <p>This link expires in 1 hour.</p>
    <p>If you didn't request password reset, ignore this email.</p>
    <p>Regards,<br><strong>ControlApp</strong></p>
</body>
</html>

--===============boundary123==--
```

---

## 🖼️ How It Looks in Email Client

When the user opens the email in their email client (Gmail, Outlook, etc.):

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                                                                     │
│  From: ControlApp <reset@controlapp.com>                           │
│  To: juan@example.com                                              │
│  Subject: Reset your password - ControlApp                         │
│  Date: November 15, 2025 10:30 PM                                  │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                                                                     │
│  Hello!                                                            │
│                                                                     │
│  You received this email because you requested to reset your       │
│  password.                                                         │
│                                                                     │
│                                                                     │
│  ┌────────────────────────────────┐                                │
│  │  Reset Password              │  ← CLICKABLE BUTTON             │
│  └────────────────────────────────┘                                │
│                                                                     │
│  This link expires in 1 hour.                                      │
│                                                                     │
│  If you didn't request password reset, ignore this email.         │
│                                                                     │
│                                                                     │
│  Regards,                                                          │
│  ControlApp                                                        │
│                                                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## ✅ Component Verification

When you see an email in Mailtrap, verify it has:

### ✓ Basic Structure
- [x] From (From): reset@controlapp.com
- [x] To (To): user@example.com
- [x] Subject (Subject): "Reset your password - ControlApp"
- [x] Date (Date): Current time

### ✓ Content
- [x] Greeting: "Hello!"
- [x] Explanation: "You received this email because..."
- [x] Button/Link: "Reset Password"
- [x] Expiration message: "This link expires in 1 hour"
- [x] Disclaimer

### ✓ Token and Email in URL
- [x] URL includes `token=abc123...` parameter
- [x] URL includes `email=user%40example.com` parameter
- [x] URL points to frontend (`localhost:3000` or your domain)
- [x] Email is URL encoded (@ = %40)

### ✓ MIME Parts
- [x] MIME Version: 1.0
- [x] Content-Type: multipart/alternative
- [x] Boundary separator defined
- [x] text/plain part
- [x] text/html part

### ✓ Security
- [x] No SPF failures
- [x] Email not marked as spam
- [x] Correct headers
- [x] No viruses (Mailtrap verifies)

---

## 🎯 Use Cases in Mailtrap

### Use Case 1: Verify Correct Token
1. Open email in Mailtrap
2. Find URL in Links section
3. Copy the token (parameter `token=...`)
4. Verify it's different each time reset is requested

### Use Case 2: Test User Email
1. In tests, use different emails
2. Verify each one receives their email
3. Find multiple emails in Mailtrap
4. Confirm each has its own token

### Use Case 3: Verify Expiration
1. Request a reset
2. Wait more than 1 hour
3. Token should be expired
4. Try using it (should fail)

---

## 📞 Support & Troubleshooting

If you don't see emails in Mailtrap:

1. **Verify .env:**
   ```bash
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.mailtrap.io
   MAIL_PORT=2525
   ```

2. **Verify credentials:**
   - MAIL_USERNAME (your Mailtrap username)
   - MAIL_PASSWORD (your Mailtrap token)

3. **Check logs:**
   ```bash
   tail -f storage/logs/laravel.log
   ```

4. **Run test:**
   ```bash
   php artisan test tests/Feature/PasswordResetMailTest.php
   ```

---

**Created**: November 15, 2025
**Topic**: Email visualization in Mailtrap
**Status**: ✅ Complete
