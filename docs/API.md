# API Documentation - ControlApp

## 📋 Índice

1. [Autenticación](#autenticación)
2. [Usuarios](#usuarios)
3. [Proyectos](#proyectos)
4. [Invitaciones](#invitaciones)
5. [Categorías](#categorías)
6. [Cuentas](#cuentas)
7. [Transacciones](#transacciones)
8. [Códigos de Error](#códigos-de-error)

---

## 🔐 Autenticación

### Register - Crear Cuenta
Registra un nuevo usuario en la aplicación.

```http
POST /api/register
Content-Type: application/json
Accept: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response (201)**
```json
{
  "message": "Usuario registrado exitosamente. Por favor, inicia sesión."
}
```

**Errors**
- `422` - Validación fallida (email duplicado, contraseña débil, etc.)

---

### Login - Iniciar Sesión
Autentica un usuario y devuelve un token.

```http
POST /api/login
Content-Type: application/json
Accept: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response (200)**
```json
{
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "email_verified_at": "2025-11-15 10:30:00"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors**
- `401` - Credenciales inválidas
- `422` - Email no verificado

---

### Logout - Cerrar Sesión
Invalida el token actual del usuario.

```http
POST /api/logout
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

---

### Email Verification - Verificar Email
Verifica la dirección de email del usuario mediante un enlace único.

```http
GET /api/email/verify/{id}/{hash}
Accept: application/json
```

**Parámetros**
- `id` - ID del usuario (number)
- `hash` - SHA1 hash del email (string)

**Response (200)**
```json
{
  "message": "¡Email verificado exitosamente! Ahora puedes loguearte."
}
```

**Errors**
- `404` - Usuario no encontrado
- `400` - Email ya verificado o hash inválido

**Nota**: Este endpoint NO requiere autenticación. El hash se genera como `sha1(email)`.

---

### Resend Verification Email - Reenviar Email de Verificación
Reenvia el email de verificación al usuario autenticado.

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

## 👤 Usuarios

### Get Profile - Obtener Perfil
Obtiene la información del usuario autenticado.

```http
GET /api/user
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "email_verified_at": "2025-11-15 10:30:00",
  "created_at": "2025-11-15 09:45:00",
  "updated_at": "2025-11-15 09:45:00"
}
```

---

## 🚀 Proyectos

### List Proyectos - Listar Proyectos
Obtiene todos los proyectos del usuario autenticado.

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
      "nombre": "Presupuesto 2025",
      "moneda": "USD",
      "user_id": 1,
      "created_at": "2025-11-15 10:00:00",
      "updated_at": "2025-11-15 10:00:00"
    }
  ]
}
```

---

### Create Proyecto - Crear Proyecto
Crea un nuevo proyecto.

```http
POST /api/proyectos
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "nombre": "Presupuesto Trimestral",
  "moneda": "USD"
}
```

**Response (201)**
```json
{
  "id": 2,
  "nombre": "Presupuesto Trimestral",
  "moneda": "USD",
  "user_id": 1,
  "created_at": "2025-11-15 11:30:00",
  "updated_at": "2025-11-15 11:30:00"
}
```

**Validación**
- `nombre` - Requerido, string, máx 255 caracteres
- `moneda` - Requerido, string, máx 3 caracteres

---

### Show Proyecto - Obtener Proyecto
Obtiene los detalles de un proyecto específico.

```http
GET /api/proyectos/{id}
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "id": 1,
  "nombre": "Presupuesto 2025",
  "moneda": "USD",
  "user_id": 1,
  "miembros": [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "role": "admin"
    }
  ],
  "categorias": [...],
  "cuentas": [...],
  "created_at": "2025-11-15 10:00:00",
  "updated_at": "2025-11-15 10:00:00"
}
```

---

### Update Proyecto - Actualizar Proyecto
Actualiza un proyecto existente (solo el propietario).

```http
PUT /api/proyectos/{id}
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "nombre": "Presupuesto 2025 - Actualizado",
  "moneda": "MXN"
}
```

**Response (200)**
```json
{
  "id": 1,
  "nombre": "Presupuesto 2025 - Actualizado",
  "moneda": "MXN",
  "user_id": 1,
  "updated_at": "2025-11-15 12:00:00"
}
```

---

### Delete Proyecto - Eliminar Proyecto
Elimina un proyecto (soft delete). Solo el propietario puede eliminar.

```http
DELETE /api/proyectos/{id}
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "message": "Proyecto eliminado exitosamente"
}
```

---

## 📨 Invitaciones

### List Invitaciones - Listar Invitaciones
Obtiene todas las invitaciones de un proyecto.

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
      "email": "nuevo@example.com",
      "estado": "pendiente",
      "created_at": "2025-11-15 10:00:00"
    }
  ]
}
```

---

### Create Invitacion - Enviar Invitación
Crea y envía una invitación a un nuevo miembro.

```http
POST /api/proyectos/{proyecto}/invitaciones
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "email": "nuevo@example.com",
  "nombre": "Nuevo Miembro"
}
```

**Response (201)**
```json
{
  "id": 1,
  "proyecto_id": 1,
  "email": "nuevo@example.com",
  "estado": "pendiente",
  "created_at": "2025-11-15 10:00:00"
}
```

**Validación**
- `email` - Requerido, email válido, no debe ser miembro del proyecto
- `nombre` - Requerido, string

**Funcionalidad**
- Se envía email automáticamente al destinatario
- Email contiene enlace de aceptación
- Solo el propietario puede enviar invitaciones

---

### Show Invitacion - Obtener Invitación
Obtiene los detalles de una invitación específica.

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
    "nombre": "Presupuesto 2025"
  },
  "email": "nuevo@example.com",
  "estado": "pendiente",
  "created_at": "2025-11-15 10:00:00"
}
```

**Nota**: Este endpoint es público para permitir aceptar invitaciones.

---

### Accept Invitacion - Aceptar Invitación
Acepta una invitación y agrega el usuario al proyecto.

```http
POST /api/proyectos/{proyecto}/invitaciones/{invitacion}/aceptar
Content-Type: application/json
Accept: application/json

{
  "email": "nuevo@example.com",
  "password": "newpassword123"
}
```

**Response (200)**
```json
{
  "message": "Invitación aceptada exitosamente",
  "user": {
    "id": 5,
    "email": "nuevo@example.com"
  }
}
```

---

### Reject Invitacion - Rechazar Invitación
Rechaza una invitación de proyecto.

```http
POST /api/proyectos/{proyecto}/invitaciones/{invitacion}/rechazar
Accept: application/json
```

**Response (200)**
```json
{
  "message": "Invitación rechazada"
}
```

---

## 🏷️ Categorías

### List Categorías - Listar Categorías
Obtiene todas las categorías de un proyecto.

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
      "nombre": "Alimentación",
      "color": "#FF5733",
      "icono": "🍔",
      "created_at": "2025-11-15 10:00:00"
    }
  ]
}
```

---

### Create Categoría - Crear Categoría
Crea una nueva categoría en un proyecto.

```http
POST /api/proyectos/{proyecto}/categorias
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "nombre": "Transporte",
  "color": "#3498DB",
  "icono": "🚗"
}
```

**Response (201)**
```json
{
  "id": 2,
  "proyecto_id": 1,
  "nombre": "Transporte",
  "color": "#3498DB",
  "icono": "🚗",
  "created_at": "2025-11-15 11:00:00"
}
```

---

### Update Categoría - Actualizar Categoría

```http
PUT /api/proyectos/{proyecto}/categorias/{categoria}
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "nombre": "Transporte Urbano",
  "color": "#2980B9"
}
```

**Response (200)**
```json
{
  "id": 2,
  "nombre": "Transporte Urbano",
  "color": "#2980B9"
}
```

---

### Delete Categoría - Eliminar Categoría

```http
DELETE /api/proyectos/{proyecto}/categorias/{categoria}
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "message": "Categoría eliminada exitosamente"
}
```

---

## 💳 Cuentas

### List Cuentas - Listar Cuentas
Obtiene todas las cuentas de un proyecto.

```http
GET /api/proyectos/{proyecto}/cuentas
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
      "nombre": "Banco Principal",
      "tipo": "banco",
      "saldo": 5000.00,
      "created_at": "2025-11-15 10:00:00"
    }
  ]
}
```

---

### Create Cuenta - Crear Cuenta

```http
POST /api/proyectos/{proyecto}/cuentas
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "nombre": "Efectivo",
  "tipo": "efectivo",
  "saldo_inicial": 1000.00
}
```

**Response (201)**
```json
{
  "id": 2,
  "proyecto_id": 1,
  "nombre": "Efectivo",
  "tipo": "efectivo",
  "saldo": 1000.00
}
```

**Tipos válidos**: `banco`, `efectivo`, `tarjeta`, `digital`

---

## 💰 Transacciones

### List Transacciones - Listar Transacciones
Obtiene todas las transacciones de una cuenta.

```http
GET /api/proyectos/{proyecto}/cuentas/{cuenta}/transacciones
Authorization: Bearer {token}
Accept: application/json
```

**Query Parameters**
- `fecha_desde` - Fecha inicio (YYYY-MM-DD)
- `fecha_hasta` - Fecha fin (YYYY-MM-DD)
- `categoria_id` - ID de categoría (opcional)
- `tipo` - ingreso o egreso (opcional)

**Response (200)**
```json
{
  "data": [
    {
      "id": 1,
      "cuenta_id": 1,
      "categoria_id": 1,
      "descripcion": "Compra de alimentos",
      "monto": 50.00,
      "tipo": "egreso",
      "fecha": "2025-11-15",
      "created_at": "2025-11-15 10:00:00"
    }
  ]
}
```

---

### Create Transacción - Crear Transacción

```http
POST /api/proyectos/{proyecto}/cuentas/{cuenta}/transacciones
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "categoria_id": 1,
  "descripcion": "Compra de alimentos",
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
  "descripcion": "Compra de alimentos",
  "monto": 50.00,
  "tipo": "egreso",
  "fecha": "2025-11-15",
  "created_at": "2025-11-15 10:00:00"
}
```

**Validación**
- `categoria_id` - ID válido de categoría del proyecto
- `descripcion` - Requerido, máx 255 caracteres
- `monto` - Requerido, número positivo
- `tipo` - `ingreso` o `egreso`
- `fecha` - Requerido, formato YYYY-MM-DD

---

### Update Transacción - Actualizar Transacción

```http
PUT /api/proyectos/{proyecto}/cuentas/{cuenta}/transacciones/{transaccion}
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "descripcion": "Compra de alimentos - actualizado",
  "monto": 55.00
}
```

---

### Delete Transacción - Eliminar Transacción

```http
DELETE /api/proyectos/{proyecto}/cuentas/{cuenta}/transacciones/{transaccion}
Authorization: Bearer {token}
Accept: application/json
```

---

## ❌ Códigos de Error

| Código | Descripción |
|--------|-------------|
| `200` | OK - Solicitud exitosa |
| `201` | Created - Recurso creado |
| `400` | Bad Request - Solicitud inválida |
| `401` | Unauthorized - No autenticado |
| `403` | Forbidden - No autorizado |
| `404` | Not Found - Recurso no encontrado |
| `422` | Unprocessable Entity - Validación fallida |
| `429` | Too Many Requests - Rate limit excedido |
| `500` | Internal Server Error - Error del servidor |

## 📝 Notas Importantes

### Headers Requeridos
- `Accept: application/json` - Todos los endpoints
- `Authorization: Bearer {token}` - Endpoints protegidos
- `Content-Type: application/json` - POST/PUT requests

### Rate Limiting
- Autenticación: 5 intentos por minuto
- API General: 60 solicitudes por minuto

### Paginación
- Límite por defecto: 15 items
- Máximo: 100 items
- Query: `?per_page=20&page=2`

---

**Última actualización**: 15 de noviembre de 2025
