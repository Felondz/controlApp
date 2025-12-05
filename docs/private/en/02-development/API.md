# API Documentation - ControlApp

>> **Last Updated**: December 5, 2025 - Bills Automation + Recurring Bills + Auto Categories (v2.6.4)

## 📋 Table of Contents

1. [Rate Limiting & Security](#rate-limiting--security)
2. [Authentication](#authentication)
3. [Users](#users)
4. [Projects](#projects)
5. [Invitations](#invitations)
6. [Categories](#categories)
7. [Accounts](#accounts)
8. [Transactions](#transactions)
9. [Tools](#tools)
10. [Chat](#chat)
11. [Analytics](#analytics)
 12. [Notifications](#notifications)
 13. [Marketplace](#marketplace)
 14. [Error Codes](#error-codes)

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
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response (201)**
```json
{
  "message": "User registered successfully. Please login."
}
```

**Errors**
- `422` - Validation failed (duplicate email, weak password, etc.)

---

#### Resend Verification Email
Resends the email verification link to the user. This action invalidates any previously sent verification links.

- **Endpoint**: `POST /api/email/resend-verification`
- **Auth**: Public (Rate limited: 3 requests per minute)
- **Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**:
  - `200 OK`: `{"message": "Verification link sent"}`
  - `422 Unprocessable Entity`: If email is invalid or already verified.

#### Login
 - Sign In
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
    "name": "John Doe",
    "email": "john@example.com",
    "email_verified_at": "2025-11-15 10:30:00"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors**
- `401` - Invalid credentials
- `403` - Email not verified (returns `error: email_not_verified`)

---

### Logout - Sign Out
Invalidates the user's current token.

```http
POST /api/logout
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "message": "Session closed successfully"
}
```

---

### Email Verification
Verifies the user's email address via a unique link.

```http
GET /api/email/verify/{id}/{hash}
Accept: application/json
```

**Parameters**
- `id` - User ID (number)
- `hash` - SHA1 hash of email (string)

**Response (200)**
```json
{
  "message": "Email verified successfully! You can now login."
}
```

**Errors**
- `404` - User not found
- `400` - Email already verified or invalid hash

**Note**: This endpoint does NOT require authentication. The hash is generated as `sha1(email)`.

---

### Resend Verification Email
Resends the verification email to the authenticated user.

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

## 👤 Users and Profile

### Get Profile
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
  "name": "John Doe",
  "email": "john@example.com",
  "email_verified_at": "2025-11-15 10:30:00",
  "profile_photo_path": "profile-photos/hash.jpg",
  "profile_photo_url": "http://localhost/storage/profile-photos/hash.jpg",
  "created_at": "2025-11-15 09:45:00",
  "updated_at": "2025-11-15 09:45:00"
}
```

### Update Profile
Updates the user's name and email.

```http
PUT /api/profile
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "name": "John Doe Updated",
  "email": "john.new@example.com"
}
```

**Response (200)**
```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```
**Note**: If email is changed, `email_verified_at` is reset to null.

### Update Password
Updates the user's password.

```http
PUT /api/password
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "current_password": "password123",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

**Response (200)**
```json
{
  "message": "Password updated successfully"
}
```

### Upload Photo
Uploads or updates profile photo.

```http
POST /api/profile/photo
Authorization: Bearer {token}
Content-Type: multipart/form-data
Accept: application/json

profile_photo: (binary file)
```

**Validation**:
- Image (jpg, jpeg, png, webp)
- Max 4MB
- Max dimensions 2048x2048

**Response (200)**
```json
{
  "message": "Profile photo updated",
  "profile_photo_url": "http://localhost/storage/profile-photos/hash.jpg"
}
```

### Delete Photo
Removes current profile photo.

```http
DELETE /api/profile/photo
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "message": "Profile photo deleted"
}
```

### Delete Account
Permanently deletes the user's account.

```http
DELETE /api/profile
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "password": "password123"
}
```

**Response (200)**
```json
{
  "message": "Account deleted successfully"
}
```

---

## 🔍 Global Search

### Search - Search Users and Projects
Searches for users and projects using Meilisearch/Scout. Only returns projects where the user is an administrator (Owner or Admin).

**Search Engine:**
- **Primary**: Meilisearch (fast, relevant, configured by default)
- **Fallback**: SQL with `LIKE` (activates automatically if Meilisearch is unavailable)

```http
GET /api/search?query={query}
Authorization: Bearer {token}
Accept: application/json
```

**Parameters**
- `query` (string, optional): Search term. If empty, returns empty results.

**Response (200)**
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "profile_photo_url": "http://localhost/storage/profile-photos/hash.jpg"
    }
  ],
  "projects": [
    {
      "id": 1,
      "nombre": "My Project",
      "descripcion": "Project description",
      "icon": "📊",
      "color": "blue",
      "image_path": "projects/abc123.jpg"
    }
  ],
  "query": "John"
}
```

**Search Fields**
- **Users**: `name`, `email`
- **Projects**: `nombre`, `descripcion`

**Security**
- ✅ Requires Bearer token authentication
- ✅ Only returns projects where user is Owner or Admin
- ✅ Automatic SQL fallback if Meilisearch is unavailable
- ✅ Error logs for debugging (`storage/logs/laravel.log`)

**Errors**
- `401` - Not authenticated

**Notes**
- The `image_path` field can be `null` if the project has no image
- SQL fallback ensures search always works, even without Meilisearch
- In production, it's recommended to have Meilisearch configured for better performance

---

## 🚀 Projects

**Authorization**: Only project members can access. Only administrators can modify or manage members.

### List Projects
Gets all projects for the authenticated user.

```http
GET /api/proyectos
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "data": [
    {
      "id": 1,
      "nombre": "Budget 2025",
      "moneda_default": "USD",
      "user_id": 1,
      "created_at": "2025-11-15 10:00:00",
      "updated_at": "2025-11-15 10:00:00"
    }
  ]
}
```

### Create Project
Creates a new project. Only authenticated users can create projects.

```http
POST /api/proyectos
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "nombre": "Quarterly Budget",
  "moneda_default": "USD",
  "modules": ["finance", "tasks"],
  "theme": "purple-modern",
  "typography": "sans",
  "descripcion": "My quarterly budget plan",
  "color": "#FF0000",
  "icon": "💰"
}
```

**Note**: To upload an image, use `multipart/form-data`.
- `image`: File (jpg, jpeg, png, webp). Max 4MB.

**Response (201)**
```json
{
  "id": 2,
  "nombre": "Quarterly Budget",
  "moneda_default": "USD",
  "user_id": 1,
  "created_at": "2025-11-15 11:30:00",
  "updated_at": "2025-11-15 11:30:00"
}
```

**Validation** (FormRequest: `StoreProyectoRequest`)
- `nombre` - Required, string, 3-255 chars
- `moneda_default` - Required, exact 3 chars (ISO 4217), uppercase (e.g., USD, COP, EUR)
- `descripcion` - Optional, string, max 1000 chars
- `color` - Optional, hex code (e.g., #FF0000)
- `icon` - Optional, string
- `theme` - Optional, string (e.g., purple-modern)
- `typography` - Optional, string (e.g., sans)
- `modules` - Required, array of strings (e.g., ["finance", "tasks"])
- `image` - Optional, image (jpg, png, etc), max 4MB

**Authorization**
- ✅ Any authenticated user can create

**Errors**
- `422` - Validation failed
- `401` - Not authenticated

### Show Project
Gets details of a specific project.

```http
GET /api/proyectos/{id}
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "id": 1,
  "nombre": "Budget 2025",
  "moneda_default": "USD",
  "user_id": 1,
  "miembros": [
    {
      "id": 1,
      "nombre": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    }
  ],
  "categorias": [...],
  "cuentas": [...],
  "created_at": "2025-11-15 10:00:00",
  "updated_at": "2025-11-15 10:00:00"
}
```

**Authorization**
- ✅ Only project members can view
- ❌ Non-members receive 403 Forbidden

### Update Project
Updates an existing project (owner only).

```http
PUT /api/proyectos/{id}
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "nombre": "Budget 2025 - Updated",
  "moneda_default": "EUR",
  "theme": "dark-blue",
  "typography": "serif",
  "modules": ["finance"]
}
```

**Note**: To upload a new image, use `POST` with `_method: PUT` and `Content-Type: multipart/form-data`.

**Response (200)**
```json
{
  "id": 1,
  "nombre": "Budget 2025 - Updated",
  "moneda_default": "EUR",
  "user_id": 1,
  "updated_at": "2025-11-15 12:00:00"
}
```

### Delete Project
Deletes a project (soft delete). Only owner can delete.

```http
DELETE /api/proyectos/{id}
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

### List Invitations
Gets all invitations for a project.

```http
GET /api/proyectos/{proyecto}/invitaciones
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "data": [
    {
      "id": 1,
      "proyecto_id": 1,
      "email": "new@example.com",
      "estado": "pendiente",
      "created_at": "2025-11-15 10:00:00"
    }
  ]
}
```

### Create Invitation
Creates and sends an invitation to a new member.

```http
POST /api/proyectos/{proyecto}/invitaciones
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "email": "new@example.com",
  "nombre": "New Member"
}
```

**Response (201)**
```json
{
  "id": 1,
  "proyecto_id": 1,
  "email": "new@example.com",
  "estado": "pendiente",
  "created_at": "2025-11-15 10:00:00"
}
```

**Validation**
- `email` - Required, valid email, must not be a member of the project
- `nombre` - Required, string

**Functionality**
- Email is sent automatically to recipient
- Email contains acceptance link
- Only owner can send invitations

### Show Invitation
Gets details of a specific invitation.

```http
GET /api/proyectos/{proyecto}/invitaciones/{invitacion}
Accept: application/json
```

**Response (200)**
```json
{
  "id": 1,
  "proyecto_id": 1,
  "proyecto": {
    "id": 1,
    "nombre": "Budget 2025"
  },
  "email": "new@example.com",
  "estado": "pendiente",
  "created_at": "2025-11-15 10:00:00"
}
```

**Note**: This endpoint is public to allow accepting invitations.

### Accept Invitation
Accepts an invitation and adds user to project.

```http
POST /api/proyectos/{proyecto}/invitaciones/{invitacion}/aceptar
Content-Type: application/json
Accept: application/json

{
  "email": "new@example.com",
  "password": "newpassword123"
}
```

**Response (200)**
```json
{
  "message": "Invitation accepted successfully",
  "user": {
    "id": 5,
    "email": "new@example.com"
  }
}
```

### Reject Invitation
Rejects a project invitation.

```http
POST /api/proyectos/{proyecto}/invitaciones/{invitacion}/rechazar
Accept: application/json
```

**Response (200)**
```json
{
  "message": "Invitation rejected"
}
```

---

## 🏷️ Categories

### List Categories
Gets all categories for a project.

```http
GET /api/proyectos/{proyecto}/categorias
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "data": [
    {
      "id": 1,
      "proyecto_id": 1,
      "nombre": "Food",
      "color": "#FF5733",
      "icono": "🍔",
      "created_at": "2025-11-15 10:00:00"
    }
  ]
}
```

### Create Category
Creates a new category in a project.

```http
POST /api/proyectos/{proyecto}/categorias
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "nombre": "Transport",
  "color": "#3498DB",
  "icono": "🚗"
}
```

**Response (201)**
```json
{
  "id": 2,
  "proyecto_id": 1,
  "nombre": "Transport",
  "color": "#3498DB",
  "icono": "🚗",
  "created_at": "2025-11-15 11:00:00"
}
```

### Update Category

```http
PUT /api/proyectos/{proyecto}/categorias/{categoria}
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "nombre": "Urban Transport",
  "color": "#2980B9"
}
```

**Response (200)**
```json
{
  "id": 2,
  "nombre": "Urban Transport",
  "color": "#2980B9"
}
```

### Delete Category

```http
DELETE /api/proyectos/{proyecto}/categorias/{categoria}
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
*If category has associated transactions:*
```json
{
  "message": "Cannot delete category because it has associated transactions. Disable it instead."
}
```

---

## 💳 Accounts

### List Accounts
Gets all accounts for a project.

```http
GET /api/proyectos/{proyecto}/cuentas
**Query Parameters**
- `estado` - (Optional) Filter by status: `activa` (default), `inactiva`, `cerrada`
- `tipo` - (Optional) Filter by type: `banco`, `efectivo`, `credito`, etc.

**Response (200)**
```json
{
  "data": [
    {
      "id": 1,
      "proyecto_id": 1,
      "nombre": "Main Bank",
      "tipo": "banco",
      "saldo_actual": 5000.00,
      "saldo_inicial": 5000.00,
      "estado": "activa",
      "created_at": "2025-11-15 10:00:00"
    }
  ]
}
```

### Create Account

```http
POST /api/proyectos/{proyecto}/cuentas
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "nombre": "BBVA Card",
  "tipo": "credito",
  "banco": "BBVA",
  "saldo_inicial": 0,
  "moneda": "COP",
  "limite_credito": 5000000,
  "tasa_interes_anual": 24.5,
  "dia_corte": 15,
  "dia_pago": 20,
  "fecha_vencimiento": "2028-12-31"
}
```

**Common Fields** (all types):
- `nombre` (string, required): Account name
- `tipo` (string, required): Account type - values: `efectivo`, `banco`, `credito`, `inversion`, `prestamo`, `otro`
- `saldo_inicial` (number, required): Initial balance in cents
- `moneda` (string, required): ISO 4217 code (3 letters) - values: `COP`, `USD`, `EUR`, `MXN`, `PEN`, `CLP`, `ARS`, `BRL`
- `banco` (string, optional): Bank name
- `descripcion` (string, optional): Additional description
- `color` (string, optional): Hex color code (e.g., #FF0000)
- `icono` (string, optional): Icon name

**Type-Specific Fields**:

**Credit (`tipo: "credito"`)**:
- `limite_credito` (number, required): Credit limit in cents
- `tasa_interes_anual` (number, required): Annual interest rate (0-100%)
- `dia_corte` (integer, required): Cut-off day of month (1-31)
- `dia_pago` (integer, required): Payment day of month (1-31)
- `fecha_vencimiento` (date, required): Card expiration date (YYYY-MM-DD, must be future)

**Investment (`tipo: "inversion"`)**:
- `tasa_interes_anual` (number, optional): Annual interest rate (0-100%)

**Loan (`tipo: "prestamo"`)**:
- `tasa_interes_anual` (number, required): Annual interest rate (0-100%)
- `dia_pago` (integer, required): Payment day of month (1-31)
- `fecha_vencimiento` (date, optional): Loan due date (YYYY-MM-DD, must be future)
- `plazo` (integer, optional): Term in months
- `valor_cuota` (number, optional): Monthly payment amount in cents
- `cuotas_pagadas` (integer, optional): Number of installments already paid

**Payroll (`tipo: "banco"`)**:
- `es_nomina` (boolean, optional): Mark as payroll account
- `dia_nomina` (array, required if es_nomina=true): Array of payment days (1-31), max 4 days. Example: `[15, 30]`
- `valor_nomina` (number, required if es_nomina=true): Estimated payroll amount in cents

**Response (201)**
```json
{
  "id": 2,
  "proyecto_id": 1,
  "nombre": "BBVA Card",
  "tipo": "credito",
  "saldo_inicial": 0,
  "created_at": "2025-11-15 11:30:00"
}
```

**Validation** (FormRequest: `StoreCuentaRequest`)
- Valid types: `efectivo`, `banco`, `credito`, `inversion`, `prestamo`, `otro`
- Valid currencies: `COP`, `USD`, `EUR`, `MXN`, `PEN`, `CLP`, `ARS`, `BRL`

**Authorization**
- ✅ Only project admins can create accounts

---

### Update Account

```http
PUT /api/proyectos/{proyecto}/cuentas/{cuenta}
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "nombre": "Petty Cash",
  "color": "#00FF00"
}
```

**Response (200)**
```json
{
  "id": 2,
  "nombre": "Petty Cash",
  "color": "#00FF00"
}
```

### Delete Account

Deletes or deactivates an account. **Account balance must be zero before deletion.**

```http
DELETE /api/proyectos/{proyecto}/cuentas/{cuenta}
Authorization: Bearer {token}
Accept: application/json
```

**Balance Validation**:
- ⚠️ If `saldo != 0` → Request rejected with HTTP 422
- If `saldo = 0` + has transactions → Marked as "inactiva" (soft-delete)
- If `saldo = 0` + no transactions → Permanently deleted

**Response (200)** - Account deactivated
```json
{
  "message": "La cuenta ha sido marcada como inactiva"
}
```

**Response (204)** - Account deleted
*(No Content)*

**Response (422)** - Balance not zero
```json
{
  "message": "No se puede eliminar o inactivar una cuenta con saldo. Debes ajustar el saldo a cero antes de continuar.",
  "saldo_actual": 150000.50
}
```

---

## 💰 Transactions

### List Transactions
Gets all transactions for an account.

```http
GET /api/proyectos/{proyecto}/cuentas/{cuenta}/transacciones
Authorization: Bearer {token}
Accept: application/json
```

**Query Parameters**
- `fecha_desde` - Start date (YYYY-MM-DD)
- `fecha_hasta` - End date (YYYY-MM-DD)
- `categoria_id` - Category ID (optional)
- `tipo` - ingreso or egreso (optional)

**Response (200)**
```json
{
  "data": [
    {
      "id": 1,
      "cuenta_id": 1,
      "categoria_id": 1,
      "descripcion": "Grocery shopping",
      "monto": 50.00,
      "tipo": "egreso",
      "fecha": "2025-11-15",
      "created_at": "2025-11-15 10:00:00"
    }
  ]
}
```

### Create Transaction

```http
POST /api/proyectos/{proyecto}/cuentas/{cuenta}/transacciones
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "categoria_id": 1,
  "descripcion": "Grocery shopping",
  "monto": 50.00,
  "tipo": "egreso",
  "fecha": "2025-11-15"
}
```

**Response (201)**
```json
{
  "id": 1,
  "cuenta_id": 1,
  "categoria_id": 1,
  "descripcion": "Grocery shopping",
  "monto": 50.00,
  "tipo": "egreso",
  "fecha": "2025-11-15",
  "created_at": "2025-11-15 10:00:00"
}
```

**Validation**
- `categoria_id` - Valid project category ID
- `descripcion` - Required, max 255 chars
- `monto` - Required, positive number
- `tipo` - `ingreso` or `egreso`
- `fecha` - Required, format YYYY-MM-DD

### Update Transaction

```http
PUT /api/proyectos/{proyecto}/cuentas/{cuenta}/transacciones/{transaccion}
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "descripcion": "Grocery shopping - updated",
  "monto": 55.00
}
```

### Delete Transaction

```http
DELETE /api/proyectos/{proyecto}/cuentas/{cuenta}/transacciones/{transaccion}
Authorization: Bearer {token}
Accept: application/json
```


---

## 🛠️ Tools

### List Tools
Gets all available tools with their enabled status for the authenticated user.

```http
GET /api/tools
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
[
  {
    "id": "financial-calculator",
    "name_key": "dashboard.calculator",
    "description_key": "dashboard.calculator_desc",
    "status": "active",
    "is_enabled": true
  },
  {
    "id": "calendar",
    "name_key": "dashboard.calendar",
    "description_key": "dashboard.calendar_desc",
    "status": "coming_soon",
    "is_enabled": false
  }
]
```

**Authorization**
- ✅ Requires authentication

**Notes**
- `name_key` and `description_key` are translation keys to be resolved on the client side
- `status` can be: `active`, `coming_soon`, `maintenance`
- `is_enabled` indicates if the user has enabled this tool

### Toggle Tool
Enables or disables a tool for the authenticated user.

```http
POST /api/tools/toggle
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "tool": "financial-calculator",
  "enable": true
}
```

**Response (200)**
```json
{
  "message": "Tool status updated successfully.",
  "enabled_tools": ["financial-calculator"]
}
```

**Validation**
- `tool` - Required, string (tool identifier)
- `enable` - Required, boolean

**Authorization**
- ✅ Requires authentication

**Errors**
- `422` - Validation failed (invalid tool ID or missing parameters)

---

## 💬 Chat

### List Messages
Gets messages for a project. Supports filtering for private messages.

```http
GET /api/proyectos/{proyecto}/messages
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "data": [
    {
      "id": 1,
      "proyecto_id": 1,
      "user_id": 1,
      "recipient_id": null,
      "content": "Hello everyone!",
      "type": "text",
      "created_at": "2025-11-15 10:00:00",
      "user": {
        "id": 1,
        "name": "John Doe",
        "profile_photo_path": "..."
      }
    }
  ],
  "links": {...},
  "meta": {...}
}
```

### Send Message
Sends a message to the project (general) or a specific member (private).

```http
POST /api/proyectos/{proyecto}/messages
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "content": "Hello!",
  "type": "text",
  "recipient_id": 2
}
```

**Parameters**
- `content`: Required, string.
- `type`: Optional, string (default: 'text').
- `recipient_id`: Optional, integer. If provided, sends a private message.

**Response (201)**
```json
{
  "id": 2,
  "content": "Hello!",
  "recipient_id": 2,
  "created_at": "2025-11-15 10:05:00"
}
```

### Mark as Read
Marks all relevant messages (general and private) as read for the user in the project.

```http
POST /api/proyectos/{proyecto}/messages/read
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "status": "success"
}
```

---

## 🚨 Error Codes

| Code | Description |
|--------|-------------
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

---
 
 ## 📊 Analytics
 
 ### Get Metrics
 Gets key metrics for a project (income, expenses, balance).
 
 ```http
 GET /api/proyectos/{proyecto}/analytics/metrics
 Authorization: Bearer {token}
 Accept: application/json
 ```
 
 **Response (200)**
 ```json
 {
   "income": 5000.00,
   "expenses": 1200.00,
   "balance": 3800.00,
   "trend": "up"
 }
 ```
 
 ### Get Summary
 Gets a summary of financial activity.
 
 ```http
 GET /api/proyectos/{proyecto}/analytics/summary
 Authorization: Bearer {token}
 Accept: application/json
 ```
 
 ### Get Insights
 Gets AI-powered insights for the project.
 
 ```http
 GET /api/proyectos/{proyecto}/analytics/insights
 Authorization: Bearer {token}
 Accept: application/json
 ```
 
 ---
 
 ## 🔔 Notifications
 
 ### List Notifications
 Gets all notifications for the authenticated user.
 
 ```http
 GET /api/notifications
 Authorization: Bearer {token}
 Accept: application/json
 ```
 
 ### Mark as Read
 Marks a specific notification as read.
 
 ```http
 POST /api/notifications/{id}/read
 Authorization: Bearer {token}
 Accept: application/json
 ```
 
 ### Mark All as Read
 Marks all notifications as read.
 
 ```http
 POST /api/notifications/read-all
 Authorization: Bearer {token}
 Accept: application/json
 ```
 
 ### Get Preferences
 Gets notification preferences.
 
 ```http
 GET /api/notifications/preferences
 Authorization: Bearer {token}
 Accept: application/json
 ```
 
 ### Update Preferences
 Updates notification preferences.
 
 ```http
 POST /api/notifications/preferences
 Authorization: Bearer {token}
 Content-Type: application/json
 
 {
   "email_notifications": true,
   "push_notifications": false
 }
 ```
 
 ---
 
 ## 🏪 Marketplace
 
 ### List Modules
 Lists available modules for a project.
 
 ```http
 GET /api/proyectos/{proyecto}/marketplace
```
 Authorization: Bearer {token}
 Accept: application/json
 ```
 
 ### Toggle Module
 Enables or disables a module for a project.
 
 ```http
 POST /api/proyectos/{proyecto}/marketplace/{module}
 Authorization: Bearer {token}
 Content-Type: application/json
 
 {
   "enable": true
 }
 ```
 
 ---
 
 ## ⚙️ Project Settings
 
 ### Update Settings
 Updates project settings (widgets, preferences, etc.).
 
 ```http
 PUT /api/proyectos/{proyecto}/settings
 Authorization: Bearer {token}
 Content-Type: application/json
 Accept: application/json
 
 {
   "settings": {
     "widgets": {
       "balance_summary": true,
       "savings_goal": false,
       "credit_simulation": true,
       "financial_charts": true
     }
   }
 }
 ```
 
 **Authorization**: Only project admins can update settings.
 
 **Response (200)**
 ```json
 {
   "success": true,
   "message": "Configuración actualizada correctamente",
   "settings": { ... }
 }
 ```
 
 ---
 
 ## 👑 Ownership Transfer
 
 ### Transfer Project Ownership
 Transfers project ownership to another admin member.
 
 ```http
 POST /api/proyectos/{proyecto}/transfer-ownership
 Authorization: Bearer {token}
 Content-Type: application/json
 Accept: application/json
 
 {
   "new_owner_id": 5,
   "password": "your_current_password"
 }
 ```
 
 **Validation**:
 - ✅ Only the current owner can transfer ownership
 - ✅ New owner must be a project member
 - ✅ New owner must already be an Admin
 - ✅ Current password required for confirmation
 
 **Response (200)**
 ```json
 {
   "success": true,
   "message": "Propiedad del proyecto transferida exitosamente.",
   "new_owner": {
     "id": 5,
     "name": "John Doe",
     "email": "john@example.com"
   }
 }
 ```
 
 **Response (403)** - Not the owner
 ```json
 {
   "message": "Solo el Dueño del proyecto puede transferir la propiedad."
 }
 ```
 
 **Response (422)** - Validation failed
 ```json
 {
   "message": "El nuevo dueño debe ser miembro del proyecto."
 }
 ```
 
 ---
 
 ## 🧾 Direct Bill Payment
 
 ### Pay Bill Directly
 Pays a bill using its default payment account.
 
 ```http
 POST /api/proyectos/{proyecto}/bills/{transaccion}/pay-direct
 Authorization: Bearer {token}
 Accept: application/json
 ```
 
 **Validation**:
 - ✅ Bill must have a default account assigned (`cuenta_predeterminada_id`)
 - ✅ Bill must be in "pending" status
 - ✅ Account must have sufficient balance
 
 **Response (200)**
 ```json
 {
   "success": true,
   "message": "Factura pagada correctamente",
   "payment": {
     "id": 123,
     "cuenta_id": 5,
     "monto": -50000,
     "status": "completed",
     "fecha": "2025-12-05"
   }
 }
 ```
 
 **Response (400)** - No default account
 ```json
 {
   "error": "Esta factura no tiene cuenta predeterminada"
 }
 ```
 
 ---
 
 ## 📤 Exports
 
 ### Export to CSV
 Exports project data (transactions, accounts, or categories) to CSV format.
 
 ```http
 GET /api/proyectos/{proyecto}/export/csv?type=transactions&from=2024-01-01&to=2024-12-31
 Authorization: Bearer {token}
 Accept: text/csv
 ```
 
 **Query Parameters**:
 - `type` (optional): `transactions` (default), `accounts`, `categories`
 - `from` (optional): Start date (YYYY-MM-DD)
 - `to` (optional): End date (YYYY-MM-DD)
 
 **Response**: CSV file download
 
 **CSV Columns by Type**:
 - **transactions**: Fecha, Descripcion, Monto, Categoria, Cuenta, Tipo
 - **accounts**: Nombre, Tipo, Saldo, Moneda, Estado
 - **categories**: Nombre, Tipo, Icono, Color
 
 ---
 
 ### Export to PDF
 Generates a PDF financial report for the project.
 
 ```http
 POST /api/proyectos/{proyecto}/export/pdf
 Authorization: Bearer {token}
 Content-Type: application/json
 Accept: application/pdf
 
 {
   "type": "summary",
   "from": "2024-01-01",
   "to": "2024-12-31"
 }
 ```
 
 **Request Body**:
 - `type` (optional): `summary` (default), `transactions`, `all`
 - `from` (optional): Start date (YYYY-MM-DD)
 - `to` (optional): End date (YYYY-MM-DD)
 
 **Response**: PDF file download
 
 **PDF Contents**:
 - Project name and date range
 - Summary: Total income, total expenses, balance
 - Accounts list with current balances
 - Transactions table (if type is "transactions" or "all")
 
 ---
 
 ## ❌ Error Codes
 
 | Code | Description |
 |------|-------------|
 | 400 | Bad Request - Invalid input data |
 | 401 | Unauthorized - Missing or invalid token |
 | 403 | Forbidden - Insufficient permissions |
 | 404 | Not Found - Resource doesn't exist |
 | 422 | Unprocessable Entity - Validation failed |
 | 429 | Too Many Requests - Rate limit exceeded |
 | 500 | Server Error - Internal error |
```
