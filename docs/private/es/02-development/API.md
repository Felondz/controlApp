# API Documentation - ControlApp

>> **Last Updated**: December 5, 2025 - Account Architecture Refactor (v2.6.2)

## 📋 Índice

1. [Rate Limiting & Security](#rate-limiting--security)
2. [Autenticación](#autenticación)
3. [Usuarios](#usuarios)
4. [Proyectos](#proyectos)
5. [Invitaciones](#invitaciones)
6. [Categorías](#categorías)
7. [Cuentas](#cuentas)
8. [Transacciones](#transacciones)
9. [Chat](#chat)
10. [Códigos de Error](#códigos-de-error)
 11. [Herramientas](#herramientas-tools)
 12. [Analíticas](#analíticas-analytics)
 13. [Notificaciones](#notificaciones-notifications)
 14. [Mercado](#mercado-marketplace)

---

## ⏱️ Rate Limiting & Security

### Rate Limits

La API implementa rate limiting para proteger contra ataques de fuerza bruta y abuso:

| Endpoint | Límite | Ventana |
|----------|--------|---------|
| `POST /api/register` | 5 intentos | 1 minuto |
| `POST /api/login` | 5 intentos | 1 minuto |
| `POST /api/forgot-password` | 5 intentos | 1 minuto |
| `POST /api/reset-password` | 5 intentos | 1 minuto |
| `GET /api/reset-password/validate` | 10 intentos | 1 minuto |
| `POST /api/email/verification-notification` | 6 intentos | 1 minuto |

**Response cuando se excede el límite (429)**:
```json
{
  "message": "Too Many Requests"
}
```

### Seguridad

- ✅ Todos los endpoints de autenticación requieren validación fuerte
- ✅ Emails validados con RFC + DNS check
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Tokens con prefijo `controlapp_` y expiración de 24 horas
- ✅ CORS restringido a origen específico
- ✅ Input sanitizado automáticamente

---

## 🔐 Autenticación

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
- `403` - Email no verificado (retorna `error: email_not_verified`)

---

### Resend Verification Email - Reenviar Email de Verificación
Reenvia el email de verificación al usuario. Este endpoint es público y tiene rate limiting estricto.

- **Endpoint**: `POST /api/email/resend-verification`
- **Auth**: Pública (Rate limited: 3 peticiones por minuto)
- **Body**:
  ```json
  {
    "email": "usuario@ejemplo.com"
  }
  ```
- **Response**:
  - `200 OK`: `{"message": "Email de verificación enviado. Revisa tu bandeja de entrada."}`
  - `422 Unprocessable Entity`: Si el email es inválido o ya está verificado.

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

---

## 👤 Usuarios y Perfil

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
  "profile_photo_path": "profile-photos/hash.jpg",
  "profile_photo_url": "http://localhost/storage/profile-photos/hash.jpg",
  "created_at": "2025-11-15 09:45:00",
  "updated_at": "2025-11-15 09:45:00"
}
```

### Update Profile - Actualizar Información
Actualiza el nombre y correo electrónico del usuario.

```http
PUT /api/profile
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "name": "Juan Pérez Actualizado",
  "email": "juan.nuevo@example.com"
}
```

**Response (200)**
```json
{
  "message": "Perfil actualizado correctamente",
  "user": { ... }
}
```
**Nota**: Si se cambia el email, `email_verified_at` se restablece a null.

### Update Password - Cambiar Contraseña
Actualiza la contraseña del usuario.

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
  "message": "Contraseña actualizada correctamente"
}
```

### Upload Photo - Subir Foto de Perfil
Sube o actualiza la foto de perfil.

```http
POST /api/profile/photo
Authorization: Bearer {token}
Content-Type: multipart/form-data
Accept: application/json

profile_photo: (binary file)
```

**Validación**:
- Imagen (jpg, jpeg, png, webp)
- Máx 4MB
- Dimensiones máx 2048x2048

**Response (200)**
```json
{
  "message": "Foto de perfil actualizada",
  "profile_photo_url": "http://localhost/storage/profile-photos/hash.jpg"
}
```

### Delete Photo - Eliminar Foto
Elimina la foto de perfil actual.

```http
DELETE /api/profile/photo
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "message": "Foto de perfil eliminada"
}
```

### Delete Account - Eliminar Cuenta
Elimina permanentemente la cuenta del usuario.

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
  "message": "Cuenta eliminada correctamente"
}
```

---

## 🔍 Búsqueda Global

### Search - Buscar Usuarios y Proyectos
Busca usuarios y proyectos usando Meilisearch/Scout. Solo devuelve proyectos donde el usuario es administrador (Owner o Admin).

**Motor de Búsqueda:**
- **Primario**: Meilisearch (rápido, relevante, configurado por defecto)
- **Fallback**: SQL con `LIKE` (se activa automáticamente si Meilisearch no está disponible)

```http
GET /api/search?query={query}
Authorization: Bearer {token}
Accept: application/json
```

**Parameters**
- `query` (string, optional): Término de búsqueda. Si está vacío, devuelve resultados vacíos.

**Response (200)**
```json
{
  "users": [
    {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "profile_photo_url": "http://localhost/storage/profile-photos/hash.jpg"
    }
  ],
  "projects": [
    {
      "id": 1,
      "nombre": "Mi Proyecto",
      "description": "Descripción del proyecto",
      "icon": "📊",
      "color": "blue",
      "image_path": "projects/abc123.jpg"
    }
  ],
  "query": "Juan"
}
```

**Campos de Búsqueda**
- **Usuarios**: `name`, `email`
- **Proyectos**: `nombre`, `descripcion`

**Seguridad**
- ✅ Requiere autenticación Bearer token
- ✅ Solo devuelve proyectos donde el usuario es Owner o Admin
- ✅ Fallback SQL automático si Meilisearch no está disponible
- ✅ Logs de errores para debugging (`storage/logs/laravel.log`)

**Errors**
- `401` - No autenticado

**Notas**
- El campo `image_path` puede ser `null` si el proyecto no tiene imagen
- El fallback SQL garantiza que la búsqueda siempre funcione, incluso sin Meilisearch
- En producción, se recomienda tener Meilisearch configurado para mejor rendimiento

---

## 🚀 Proyectos

**Autorización**: Solo miembros del proyecto pueden acceder. Solo administradores pueden modificar o gestionar miembros.

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
      "nombre": "Presupuesto 2025",
      "moneda_default": "COP",
      "user_id": 1,
      "created_at": "2025-11-15 10:00:00",
      "updated_at": "2025-11-15 10:00:00"
    }
  ]
}
```

---

### Create Proyecto - Crear Proyecto
Crea un nuevo proyecto. Solo usuarios autenticados pueden crear proyectos.

```http
POST /api/proyectos
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "nombre": "Presupuesto Trimestral",
  "moneda_default": "COP",
  "modules": ["finance", "tasks"],
  "theme": "purple-modern",
  "typography": "sans",
  "descripcion": "Mi plan de presupuesto trimestral",
  "color": "#FF0000",
  "icon": "💰"
}
```

**Nota**: Para subir una imagen, usar `multipart/form-data`.
- `image`: Archivo (jpg, jpeg, png, webp). Máx 4MB.
```

**Response (201)**
```json
{
  "id": 2,
  "nombre": "Presupuesto Trimestral",
  "nombre": "Presupuesto Trimestral",
  "moneda_default": "COP",
  "user_id": 1,
  "created_at": "2025-11-15 11:30:00",
  "updated_at": "2025-11-15 11:30:00"
}
```

**Validación** (FormRequest: `StoreProyectoRequest`)
- `nombre` - Requerido, string, 3-255 caracteres
- `moneda_default` - Requerido, string exacto 3 caracteres (ISO 4217), mayúsculas (ej: USD, COP, EUR)
- `descripcion` - Opcional, string, máx 1000 caracteres
- `color` - Opcional, hex code (ej: #FF0000)
- `icon` - Opcional, string
- `theme` - Opcional, string (ej: purple-modern)
- `typography` - Opcional, string (ej: sans)
- `modules` - Requerido, array de strings (ej: ["finance", "tasks"])
- `image` - Opcional, imagen (jpg, png, etc), máx 4MB

**Autorización**
- ✅ Cualquier usuario autenticado puede crear

**Errors**
- `422` - Validación fallida
- `401` - No autenticado

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
  "nombre": "Presupuesto 2025",
  "moneda_default": "COP",
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

**Autorización**
- ✅ Solo miembros del proyecto pueden ver
- ❌ No miembros reciben 403 Forbidden

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
  "moneda_default": "MXN",
  "theme": "dark-blue",
  "typography": "serif",
  "modules": ["finance"]
}
```

**Nota**: Para subir una nueva imagen, usar `POST` con `_method: PUT` y `Content-Type: multipart/form-data`.
}
```

**Response (200)**
```json
{
  "id": 1,
  "nombre": "Presupuesto 2025 - Actualizado",
  "nombre": "Presupuesto 2025 - Actualizado",
  "moneda_default": "MXN",
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

**Response (422)**
*Si la categoría tiene transacciones asociadas:*
```json
{
  "message": "No se puede eliminar la categoría porque tiene transacciones asociadas. Inhabilítala en su lugar."
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

**Query Parameters**
- `estado` - (Opcional) Filtrar por estado: `activa` (default), `inactiva`, `cerrada`
- `tipo` - (Opcional) Filtrar por tipo: `banco`, `efectivo`, `credito`, etc.

**Response (200)**
```json
{
  "data": [
    {
      "id": 1,
      "proyecto_id": 1,
      "nombre": "Banco Principal",
      "tipo": "banco",
      "saldo_actual": 5000.00,
      "saldo_inicial": 5000.00,
      "estado": "activa",
      "created_at": "2025-11-15 10:00:00"
    }
  ]
}
```

**Arquitectura de Ownership (v2.6.2+)**:
- **Proyectos Personales**: Las cuentas se crean con `propietario_type = 'usuario'` y se vinculan automáticamente al proyecto personal vía la tabla pivot `cuenta_proyecto`.
- **Proyectos Colaborativos**: Las cuentas se crean con `propietario_type = 'proyecto'` (ownership directo del proyecto).
- El endpoint `GET /api/proyectos/{proyecto}/cuentas` retorna **tanto** las cuentas propias del proyecto **como** las cuentas vinculadas (merged), asegurando visibilidad completa.

---

### Create Cuenta - Crear Cuenta

```http
POST /api/proyectos/{proyecto}/cuentas
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "nombre": "Tarjeta BBVA",
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

**Campos Comunes** (todos los tipos):
- `nombre` (string, required): Nombre de la cuenta
- `tipo` (string, required): Tipo de cuenta - valores: `efectivo`, `banco`, `credito`, `inversion`, `prestamo`, `otro`
- `saldo_inicial` (number, required): Saldo inicial en centavos
- `moneda` (string, required): Código ISO 4217 (3 letras) - valores: `COP`, `USD`, `EUR`, `MXN`, `PEN`, `CLP`, `ARS`, `BRL`
- `banco` (string, optional): Nombre del banco
- `descripcion` (string, optional): Descripción adicional
- `color` (string, optional): Código de color hexadecimal (ej: #FF0000)
- `icono` (string, optional): Nombre del ícono

**Campos Específicos por Tipo**:

**Crédito (`tipo: "credito"`)**:
- `limite_credito` (number, required): Límite de crédito en centavos
- `tasa_interes_anual` (number, required): Tasa de interés anual (0-100%)
- `dia_corte` (integer, required): Día del mes de corte (1-31)
- `dia_pago` (integer, required): Día del mes de pago (1-31)
- `fecha_vencimiento` (date, required): Fecha de vencimiento de la tarjeta (YYYY-MM-DD, debe ser futura)

**Inversión (`tipo: "inversion"`)**:
- `tasa_interes_anual` (number, optional): Tasa de interés anual (0-100%)

**Préstamo (`tipo: "prestamo"`)**:
- `tasa_interes_anual` (number, required): Tasa de interés anual (0-100%)
- `dia_pago` (integer, required): Día del mes de pago (1-31)
- `fecha_vencimiento` (date, optional): Fecha de vencimiento del préstamo (YYYY-MM-DD, debe ser futura)
- `plazo` (integer, optional): Plazo en meses
- `valor_cuota` (number, optional): Valor de la cuota mensual en centavos
- `cuotas_pagadas` (integer, optional): Número de cuotas ya pagadas

**Nómina (`tipo: "banco"`)**:
- `es_nomina` (boolean, optional): Marcar como cuenta de nómina
- `dia_nomina` (array, required if es_nomina=true): Array de días de pago (1-31), máx 4 días. Ejemplo: `[15, 30]`
- `valor_nomina` (number, required if es_nomina=true): Valor estimado de nómina en centavos

**Response (201)**
```json
{
  "id": 2,
  "proyecto_id": 1,
  "nombre": "Tarjeta BBVA",
  "tipo": "credito",
  "saldo_inicial": 0,
  "created_at": "2025-11-15 11:30:00"
}
```

**Validación** (FormRequest: `StoreCuentaRequest`)
- Tipos válidos: `efectivo`, `banco`, `credito`, `inversion`, `prestamo`, `otro`
- Monedas válidas: `COP`, `USD`, `EUR`, `MXN`, `PEN`, `CLP`, `ARS`, `BRL`

**Autorización**
- ✅ Solo admins del proyecto pueden crear cuentas

---

### Update Cuenta - Actualizar Cuenta

```http
PUT /api/proyectos/{proyecto}/cuentas/{cuenta}
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "nombre": "Efectivo (Caja Chica)",
  "color": "#00FF00"
}
```

**Response (200)**
```json
{
  "id": 2,
  "nombre": "Efectivo (Caja Chica)",
  "color": "#00FF00"
}
```

---

### Delete Cuenta - Eliminar/Inactivar Cuenta

Si la cuenta tiene transacciones, se marca como `inactiva`. Si no tiene, se elimina permanentemente.

```http
DELETE /api/proyectos/{proyecto}/cuentas/{cuenta}
Authorization: Bearer {token}
Accept: application/json
```

**Response (204)**
*(No Content)*

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
- `status` - pending o completed (opcional)

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
POST /api/proyectos/{proyecto}/transacciones
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "categoria_id": 1,
  "cuenta_id": 1,
  "descripcion": "Compra de alimentos",
  "monto": 50.00,
  "fecha": "2025-11-15",
  "notas": "Opcional",
  "task_id": 5  // Opcional: vincula con tarea financiera
}
```

**Parámetros**:
- `categoria_id` (number, optional): ID de la categoría (puede ser null para facturas)
- `cuenta_id` (number, optional): ID de la cuenta bancaria (null para facturas pendientes)
- `descripcion` (string, required): Descripción de la transacción
- `monto` (number, required): Monto de la transacción (negativo para gastos/facturas)
- `fecha` (date, required): Fecha de la transacción (YYYY-MM-DD)
- `status` (string, optional): 'completed' (default) o 'pending'
- `notas` (string, optional): Notas adicionales
- `task_id` (number, optional): ID de tarea financiera. Si se proporciona, la tarea se marcará automáticamente como "done"

**Response (201)**
```json
{
  "id": 1,
  "cuenta_id": 1,
  "categoria_id": 1,
  "descripcion": "Compra de alimentos",
  "monto": 50.00,
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
PUT /api/proyectos/{proyecto}/transacciones/{transaccion}
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
DELETE /api/proyectos/{proyecto}/transacciones/{transaccion}
Authorization: Bearer {token}
Accept: application/json
```

---

## 💬 Chat

### List Messages - Listar Mensajes
Obtiene los mensajes de un proyecto. Soporta filtrado para mensajes privados.

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
      "content": "¡Hola a todos!",
      "type": "text",
      "created_at": "2025-11-15 10:00:00",
      "user": {
        "id": 1,
        "name": "Juan Pérez",
        "profile_photo_path": "..."
      }
    }
  ],
  "links": {...},
  "meta": {...}
}
```

### Send Message - Enviar Mensaje
Envía un mensaje al proyecto (general) o a un miembro específico (privado).

```http
POST /api/proyectos/{proyecto}/messages
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "content": "¡Hola!",
  "type": "text",
  "recipient_id": 2
}
```

**Parámetros**
- `content`: Requerido, string.
- `type`: Opcional, string (default: 'text').
- `recipient_id`: Opcional, integer. Si se proporciona, envía un mensaje privado.

**Response (201)**
```json
{
  "id": 2,
  "content": "¡Hola!",
  "recipient_id": 2,
  "created_at": "2025-11-15 10:05:00"
}
```

### Mark as Read - Marcar como Leído
Marca todos los mensajes relevantes (generales y privados) como leídos para el usuario en el proyecto.

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

**Última actualización**: 02 de diciembre de 2025

---

## 💬 Chat

### List Messages - Listar Mensajes
Obtiene los mensajes de un proyecto.

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
      "content": "Hola equipo",
      "user_id": 1,
      "user": { "name": "Juan" },
      "created_at": "2025-11-15 10:00:00"
    }
  ]
}
```

### Send Message - Enviar Mensaje
Envía un mensaje al chat general o privado.

```http
POST /api/proyectos/{proyecto}/messages
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "content": "Hola mundo",
  "recipient_id": 2  // Opcional (para DM)
}
```

**Response (201)**
```json
{
  "id": 2,
  "content": "Hola mundo",
  "created_at": "..."
}
```

### Mark as Read - Marcar como Leído
Marca los mensajes como leídos (actualiza `last_read_at`).

```http
POST /api/proyectos/{proyecto}/messages/read
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "message": "Mensajes marcados como leídos"
}
```

### Unread Counts - Contadores No Leídos
Obtiene el conteo de mensajes no leídos.

```http
GET /api/proyectos/{proyecto}/messages/unread
Authorization: Bearer {token}
Accept: application/json
```

**Response (200)**
```json
{
  "unread_count": 5
}
```
