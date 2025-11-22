# API Documentation - ControlApp

> **Last Updated**: November 16, 2025 - Security Audit & Rate Limiting Added

## 📋 Table of Contents

1. [Rate Limiting & Security](#rate-limiting--security)
2. [Authentication](#authentication)
3. [Users](#users)
4. [Projects](#projects)
5. [Invitations](#invitations)
6. [Categories](#categories)
7. [Accounts](#accounts)
8. [Transactions](#transactions)
9. [Error Codes](#error-codes)

---

## ⏱️ Rate Limiting & Security

### Rate Limits

The API implements rate limiting to protect against brute force attacks and abuse:

| Endpoint | Limit | Window |
|----------|--------|---------|
| `POST /api/register` | 5 attempts | 1 minute |
| `POST /api/login` | 5 attempts | 1 minute |
| `POST /api/forgot-password` | 5 attempts | 1 minute |
| `POST /api/reset-password` | 5 attempts | 1 minute |
| `GET /api/reset-password/validate` | 10 attempts | 1 minute |
| `POST /api/email/verification-notification` | 6 attempts | 1 minute |

**Response when limit exceeded (429)**:
```json
{
  "message": "Too Many Requests"
}
```

### Security

- ✅ All authentication endpoints require strong validation
- ✅ Emails validated with RFC + DNS check
- ✅ Passwords hashed with bcrypt
- ✅ Tokens with `controlapp_` prefix and 24-hour expiration
- ✅ CORS restricted to specific origin
- ✅ Input automatically sanitized

---

## 🔐 Authentication

### Register - Create Account
Registers a new user in the application.

```http
POST /api/register
Content-Type: application/json
Accept: application/json

{
  "name": "John Perez",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response (201)**
```json
{
  "message": "User registered successfully. Please log in."
}
```

**Errors**
- `422` - Validation failed (duplicate email, weak password, etc.)

---

### Login - Start Session
Authenticates a user and returns a token.

```http
POST /api/login
Content-Type: application/json
Accept: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200)**
```json
{
  "user": {
    "id": 1,
    "name": "John Perez",
    "email": "john@example.com",
    "email_verified_at": "2025-11-15 10:30:00"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors**
- `401` - Invalid credentials
- `422` - Email not verified

---

### Logout - End Session
Invalidates the user's current token.

```http
POST /api/logout
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "message": "Session ended successfully"
}
```

---

## 👤 Users

### Get Profile - Get User Profile
Gets the authenticated user's information.

```http
GET /api/user
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "id": 1,
  "name": "John Perez",
  "email": "john@example.com",
  "email_verified_at": "2025-11-15 10:30:00",
  "created_at": "2025-11-15 09:45:00",
  "updated_at": "2025-11-15 09:45:00"
}
```

---

## 🚀 Projects

**Authorization**: Only project members can access. Only administrators can modify or manage members.

### List Projects - List All Projects
Gets all projects of the authenticated user.

```http
GET /api/projects
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Budget 2025",
      "currency": "COP",
      "user_id": 1,
      "created_at": "2025-11-15 10:00:00",
      "updated_at": "2025-11-15 10:00:00"
    }
  ]
}
```

---

### Create Project - Create New Project
Creates a new project. Only authenticated users can create projects.

```http
POST /api/projects
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "name": "Quarterly Budget",
  "currency": "COP"
}
```

**Response (201)**
```json
{
  "id": 2,
  "name": "Quarterly Budget",
  "currency": "COP",
  "user_id": 1,
  "created_at": "2025-11-15 11:30:00",
  "updated_at": "2025-11-15 11:30:00"
}
```

**Validation**
- `name` - Required, string, 3-255 characters
- `currency` - Required, string exactly 3 characters (ISO 4217), uppercase

**Errors**
- `422` - Validation failed
- `401` - Not authenticated

---

### Show Project - Get Project Details
Gets the details of a specific project.

```http
GET /api/projects/{id}
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "id": 1,
  "name": "Budget 2025",
  "currency": "COP",
  "user_id": 1,
  "members": [
    {
      "id": 1,
      "name": "John Perez",
      "email": "john@example.com",
      "role": "admin"
    }
  ],
  "categories": [...],
  "accounts": [...],
  "created_at": "2025-11-15 10:00:00",
  "updated_at": "2025-11-15 10:00:00"
}
```

**Authorization**
- ✅ Only project members can view
- ❌ Non-members receive 403 Forbidden

---

### Update Project - Update Project
Updates an existing project (owner only).

```http
PUT /api/projects/{id}
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "name": "Budget 2025 - Updated",
  "currency": "MXN"
}
```

**Response (200)**
```json
{
  "id": 1,
  "name": "Budget 2025 - Updated",
  "currency": "MXN",
  "user_id": 1,
  "updated_at": "2025-11-15 12:00:00"
}
```

---

### Delete Project - Delete Project
Deletes a project (soft delete). Only the owner can delete.

```http
DELETE /api/projects/{id}
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "message": "Project deleted successfully"
}
```

---

## 📨 Invitations

### List Invitations - List All Invitations
Gets all invitations for a project.

```http
GET /api/projects/{project}/invitations
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "data": [
    {
      "id": 1,
      "project_id": 1,
      "email": "new@example.com",
      "status": "pending",
      "created_at": "2025-11-15 10:00:00"
    }
  ]
}
```

---

## 🏷️ Categories

### List Categories - List All Categories
Gets all categories of a project.

```http
GET /api/projects/{project}/categories
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "data": [
    {
      "id": 1,
      "project_id": 1,
      "name": "Food",
      "color": "#FF5733",
      "icon": "🍔",
      "created_at": "2025-11-15 10:00:00"
    }
  ]
}
```

### Delete Category - Delete Category

```http
DELETE /api/projects/{project}/categories/{category}
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "message": "Category deleted successfully"
}
```

**Response (422)**
*If the category has associated transactions:*
```json
{
  "message": "No se puede eliminar la categoría porque tiene transacciones asociadas. Inhabilítala en su lugar."
}
```

---

## 💳 Accounts

### List Accounts - List All Accounts
Gets all accounts of a project.

```http
GET /api/projects/{project}/accounts
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "data": [
    {
      "id": 1,
      "project_id": 1,
      "name": "Main Bank",
      "type": "bank",
      "balance": 5000.00,
      "created_at": "2025-11-15 10:00:00"
    }
  ]
}
```

---

## 💰 Transactions

### List Transactions - List All Transactions
Gets all transactions for an account.

```http
GET /api/projects/{project}/accounts/{account}/transactions
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "data": [
    {
      "id": 1,
      "account_id": 1,
      "category_id": 1,
      "description": "Food purchase",
      "amount": 50.00,
      "type": "expense",
      "date": "2025-11-15",
      "created_at": "2025-11-15 10:00:00"
    }
  ]
}
```

---

## ❌ Error Codes

| Code | Description |
|--------|-------------|
| `200` | OK - Request successful |
| `201` | Created - Resource created |
| `400` | Bad Request - Invalid request |
| `401` | Unauthorized - Not authenticated |
| `403` | Forbidden - Not authorized |
| `404` | Not Found - Resource not found |
| `422` | Unprocessable Entity - Validation failed |
| `429` | Too Many Requests - Rate limit exceeded |
| `500` | Internal Server Error - Server error |

## 📝 Important Notes

### Required Headers
- `Accept: application/json` - All endpoints
- `Authorization: Bearer {token}` - Protected endpoints
- `Content-Type: application/json` - POST/PUT requests

### Rate Limiting
- Authentication: 5 attempts per minute
- General API: 60 requests per minute

### Pagination
- Default limit: 15 items
- Maximum: 100 items
- Query: `?per_page=20&page=2`

---

**Last Updated**: November 15, 2025
