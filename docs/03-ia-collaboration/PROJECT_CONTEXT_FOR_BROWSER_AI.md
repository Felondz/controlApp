# 🤖 CONTEXTO COMPLETO DEL PROYECTO CONTROLAPP PARA IA EN NAVEGADOR

> **Última actualización**: 18 de noviembre de 2025
> 
> **Propósito**: Este documento contiene todo el contexto del proyecto para que una IA en navegador (ChatGPT, Claude, etc.) pueda entender y ayudarte sin necesidad de archivos adicionales.

---

## 📋 TABLA DE CONTENIDOS

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
4. [Base de Datos](#base-de-datos)
5. [API REST](#api-rest)
6. [Seguridad](#seguridad)
7. [Testing](#testing)
8. [Docker y CI/CD](#docker-y-cicd)
9. [Frontend (Estado Actual)](#frontend-estado-actual)
10. [Cómo Usar Este Contexto](#cómo-usar-este-contexto)

---

## 🎯 RESUMEN EJECUTIVO

**ControlApp** es una aplicación web de gestión financiera personal y colaborativa construida con Laravel 11 como API REST pura.

- **Tipo**: API-first Backend
- **Lenguaje**: PHP 8.2 + Laravel 11
- **Base de Datos**: MySQL
- **Autenticación**: Sanctum (API Tokens)
- **Testing**: 131 tests (100% passing)
- **Deployment**: Docker + GitHub Actions
- **Frontend**: No implementado aún (propuesta: React/Vue/Inertia.js)

---

## 🏗️ STACK TECNOLÓGICO

### Backend
```
PHP: 8.2+
Framework: Laravel 11.x
ORM: Eloquent
API: REST (Sin frontend integrado)
Validación: Form Requests (7 clases)
Autorización: Policies (5 clases)
Testing: PHPUnit + Pest
```

### Base de Datos
```
Motor: MySQL
ORM: Eloquent
Migraciones: 15+ migrations
Factories: 6 factories para tests
```

### Code Quality
```
Static Analysis: PHPStan Level 8
Laravel Analysis: Larastan
Linting: Laravel Pint
Code Standards: PSR-12
```

### DevOps
```
Containerización: Docker + Sail
Orquestación: Docker Compose
CI/CD: GitHub Actions
Dependency Management: Composer + Dependabot
```

### Frontend (ACTUAL)
```
❌ React: NO INSTALADO
❌ Vue.js: NO INSTALADO
❌ Inertia.js: NO INSTALADO
❌ npm/Node.js: NO CONFIGURADO
ℹ️ Estado: A CONSTRUIR
```

---

## 📁 ARQUITECTURA DEL PROYECTO

### Estructura de Carpetas

```
controlApp/
│
├── app/                              # Lógica de la aplicación
│   ├── Http/
│   │   ├── Controllers/Api/          ← API Controllers (REST)
│   │   │   ├── AuthController.php
│   │   │   ├── ProyectosController.php
│   │   │   ├── CategoriasController.php
│   │   │   ├── CuentasController.php
│   │   │   ├── TransaccionesController.php
│   │   │   ├── InvitacionesController.php
│   │   │   ├── MiembrosController.php
│   │   │   └── FinanzasPersonalesController.php
│   │   ├── Requests/                 ← Form Validation (7 clases)
│   │   │   ├── LoginRequest.php
│   │   │   ├── RegisterRequest.php
│   │   │   ├── StoreProyectoRequest.php
│   │   │   └── ... (más requests)
│   │   ├── Middleware/               ← Security Middleware
│   │   │   ├── EnsurePersonalProjectAccess.php
│   │   │   ├── RateLimitMiddleware.php
│   │   │   └── CORSMiddleware.php
│   │   ├── Resources/                ← API Response Formatting
│   │   └── Controllers/              ← Web Controllers (vacío)
│   │
│   ├── Models/                       ← Eloquent Models (7 modelos)
│   │   ├── User.php
│   │   ├── Proyecto.php
│   │   ├── Categoria.php
│   │   ├── Cuenta.php
│   │   ├── Transaccion.php
│   │   ├── Invitacion.php
│   │   └── PasswordReset.php
│   │
│   ├── Policies/                     ← Authorization (5 policies)
│   │   ├── ProyectoPolicy.php        ← Quién puede ver/editar proyectos
│   │   ├── CategoriaPolicy.php       ← Autorización de categorías
│   │   ├── CuentaPolicy.php          ← Autorización de cuentas
│   │   ├── TransaccionPolicy.php     ← Autorización de transacciones
│   │   └── InvitacionPolicy.php      ← Autorización de invitaciones
│   │
│   ├── Notifications/                ← Email Notifications
│   │   ├── VerificacionEmailNotification.php
│   │   ├── PasswordResetNotification.php
│   │   └── ... (más notificaciones)
│   │
│   ├── Mail/                         ← Mailables
│   │   ├── VerificacionEmailMail.php
│   │   ├── PasswordResetMail.php
│   │   ├── InvitacionProyectoMail.php
│   │   └── ... (más emails)
│   │
│   ├── Observers/                    ← Event Listeners
│   │   ├── UserObserver.php          ← Crea proyecto personal al registrarse
│   │   └── TransaccionObserver.php   ← Actualiza saldos
│   │
│   ├── Console/
│   │   └── Commands/                 ← Artisan Commands
│   │
│   ├── Providers/
│   │   ├── AppServiceProvider.php    ← Service Registration
│   │   └── ... (más providers)
│   │
│   └── Traits/                       ← Código Reutilizable
│
├── routes/
│   ├── api.php                       ← API Routes (REST)
│   │   └── Endpoints: /api/*
│   ├── web.php                       ← Web Routes (vacío)
│   ├── admin.php                     ← Admin Routes
│   └── console.php                   ← Console Commands
│
├── config/
│   ├── app.php                       ← App Configuration
│   ├── auth.php                      ← Authentication
│   │   └── guards.web, guards.sanctum
│   ├── cors.php                      ← CORS Allowed Origins
│   ├── database.php                  ← Database Connections
│   ├── sanctum.php                   ← API Tokens TTL
│   ├── mail.php                      ← Email Configuration
│   ├── cache.php                     ← Cache Drivers
│   ├── queue.php                     ← Job Queue
│   └── ... (más configuraciones)
│
├── database/
│   ├── migrations/                   ← Database Schema
│   │   ├── *_create_users_table.php
│   │   ├── *_create_proyectos_table.php
│   │   ├── *_create_categorias_table.php
│   │   ├── *_create_cuentas_table.php
│   │   ├── *_create_transacciones_table.php
│   │   ├── *_create_invitaciones_table.php
│   │   └── ... (15+ migrations)
│   │
│   ├── factories/                    ← Test Data Factories
│   │   ├── UserFactory.php
│   │   ├── ProyectoFactory.php
│   │   ├── CategoriaFactory.php
│   │   ├── CuentaFactory.php
│   │   ├── TransaccionFactory.php
│   │   ├── InvitacionFactory.php
│   │   └── PasswordResetFactory.php
│   │
│   └── seeders/
│       ├── DatabaseSeeder.php
│       └── ... (más seeders)
│
├── resources/
│   ├── views/                        ← Blade Templates (vacío)
│   ├── js/                           ← JavaScript (vacío)
│   ├── css/                          ← Stylesheets (vacío)
│   └── ... (listo para frontend)
│
├── tests/
│   ├── Feature/                      ← Integration Tests (100+ tests)
│   │   ├── AuthenticationTest.php
│   │   ├── ProyectosTest.php
│   │   ├── CategoriasTest.php
│   │   ├── CuentasTest.php
│   │   ├── TransaccionesTest.php
│   │   ├── InvitacionesTest.php
│   │   ├── MiembrosTest.php
│   │   ├── FinanzasPersonalesTest.php
│   │   ├── EmailNotificationsTest.php
│   │   ├── PasswordResetTest.php
│   │   ├── VisualEmailTestsInMailpitTest.php
│   │   └── ... (20+ test files)
│   │
│   ├── Unit/                         ← Unit Tests
│   │   └── ... (tests unitarios)
│   │
│   └── TestCase.php                  ← Base Test Class
│
├── docker-compose.yml                ← Docker Compose Configuration
├── Dockerfile                        ← Docker Image Definition
├── .github/
│   ├── workflows/
│   │   ├── tests.yml                 ← Test CI/CD
│   │   ├── codeql.yml                ← CodeQL (deshabilitado)
│   │   └── ... (más workflows)
│   ├── dependabot.yml                ← Auto Dependency Updates
│   └── SECURITY.md                   ← Security Policy
│
├── docs/                             ← Documentación
│   ├── 01-core/
│   │   ├── README.md
│   │   ├── QUICK_REFERENCE.md
│   │   ├── DATABASE.md
│   │   ├── API.md
│   │   ├── ARCHITECTURE.md
│   │   ├── CHANGELOG_DETAILED.md
│   │   └── ONBOARDING.md
│   ├── 02-development/
│   ├── 03-ia-collaboration/
│   ├── 04-testing/
│   ├── 05-reference/
│   └── 06-security/
│
├── bootstrap/
│   ├── app.php                       ← Application Bootstrap
│   └── providers.php
│
├── storage/
│   ├── app/                          ← File Storage
│   ├── framework/                    ← Cache/Sessions
│   └── logs/                         ← Application Logs
│
├── .env.example                      ← Environment Template
├── .env.testing                      ← Testing Environment
├── .env                              ← Local Environment (gitignored)
│
├── artisan                           ← CLI Entrypoint
├── composer.json                     ← PHP Dependencies
├── package.json                      ← Node Dependencies (vacío)
├── Dockerfile                        ← Docker Image
├── docker-compose.yml                ← Docker Compose
├── phpstan.neon                      ← PHPStan Configuration
├── phpunit.xml                       ← PHPUnit Configuration
├── vite.config.js                    ← Vite Configuration (vacío)
└── README.md                         ← Project README

```

### Capas Arquitectónicas

```
┌─────────────────────────────────────────────┐
│         API Clients (React/Vue)             │  ← Frontend (NO IMPLEMENTADO)
│   (Consumirá los endpoints REST)            │
└──────────────────┬──────────────────────────┘
                   │ HTTP Requests
                   ↓
┌─────────────────────────────────────────────┐
│    Laravel API Controllers (app/Http/Controllers/Api/)
│    - Validación con Form Requests           │
│    - Respuestas JSON                        │
│    - Rate Limiting                          │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│    Authorization Layer (Policies)           │
│    - ¿Puede este usuario hacer esto?        │
│    - 5 Policies implementadas               │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│    Business Logic & Service Layer           │
│    - Models (Eloquent)                      │
│    - Observers (Listeners)                  │
│    - Notifications                          │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│         Database Layer (Eloquent ORM)       │
│         MySQL Database                      │
└─────────────────────────────────────────────┘
```

---

## 🗄️ BASE DE DATOS

### Modelos (Entidades)

#### 1. **User**
```php
// Campos principales
- id: integer (PK)
- name: string
- email: string (unique)
- password: string (hashed)
- email_verified_at: timestamp (nullable)
- created_at, updated_at: timestamps

// Relaciones
- proyectos() ← Proyectos creados por este usuario
- proyectosPersonales() ← Su proyecto personal de finanzas
- miembrosEnProyectos() ← Proyectos donde es miembro
- transacciones() ← Transacciones que creó
- invitacionesEnviadas() ← Invitaciones que envió
```

#### 2. **Proyecto**
```php
// Campos principales
- id: integer (PK)
- user_id: integer (FK) → propietario
- nombre: string
- descripcion: text (nullable)
- moneda_default: string (COP, USD, EUR, etc.)
- es_personal: boolean (true = proyecto personal del usuario)
- created_at, updated_at: timestamps

// Relaciones
- usuario() → User (propietario)
- miembros() → Collection de Users (muchos a muchos)
- categorias() → Collection de Categorias
- cuentas() → Collection de Cuentas
- transacciones() → Collection de Transacciones
- invitaciones() → Collection de Invitaciones
```

#### 3. **Categoria**
```php
// Campos principales
- id: integer (PK)
- proyecto_id: integer (FK)
- nombre: string
- descripcion: text (nullable)
- icono: string (emoji)
- color: string (hex color)
- tipo: enum ('ingreso', 'gasto')
- created_at, updated_at: timestamps

// Relaciones
- proyecto() → Proyecto
- transacciones() → Collection de Transacciones (relación inversa)
```

#### 4. **Cuenta**
```php
// Campos principales
- id: integer (PK)
- proyecto_id: integer (FK)
- nombre: string (ej: "Cuenta Corriente Banco X")
- saldo_actual: decimal (10,2)
- tipo_cuenta: string ('corriente', 'ahorro', 'tarjeta_credito')
- numero_cuenta: string (nullable)
- banco: string (nullable)
- created_at, updated_at: timestamps

// Relaciones
- proyecto() → Proyecto
- transacciones() → Collection de Transacciones
```

#### 5. **Transaccion**
```php
// Campos principales
- id: integer (PK)
- proyecto_id: integer (FK)
- user_id: integer (FK) ← quien creó la transacción
- categoria_id: integer (FK)
- cuenta_id: integer (FK)
- tipo: enum ('ingreso', 'gasto', 'transferencia')
- monto: decimal (10,2)
- descripcion: text
- fecha: date
- is_personal: boolean (true = es personal, no compartida)
- created_at, updated_at: timestamps

// Relaciones
- proyecto() → Proyecto
- usuario() → User
- categoria() → Categoria
- cuenta() → Cuenta
```

#### 6. **Invitacion**
```php
// Campos principales
- id: integer (PK)
- proyecto_id: integer (FK)
- email: string ← email del invitado
- token: string (único)
- rol: enum ('miembro', 'admin')
- aceptada: boolean
- fecha_aceptacion: timestamp (nullable)
- expires_at: timestamp
- created_at, updated_at: timestamps

// Relaciones
- proyecto() → Proyecto
```

#### 7. **Miembro** (Tabla Pivote)
```php
// Relación muchos a muchos entre Users y Proyectos
- proyecto_id: integer (PK, FK)
- user_id: integer (PK, FK)
- rol: enum ('miembro', 'admin')
- joined_at: timestamp
```

### Diagrama ER Simplificado

```
┌──────────────┐
│    User      │
│  - id (PK)   │
│  - name      │
│  - email     │
│  - password  │
└──────────────┘
       │ 1:N
       ├────────────────────────────┐
       │                            │
       ↓ Crea                       ↓ Miembro de (N:N)
   ┌──────────────┐         ┌──────────────────┐
   │  Proyecto    │         │   Proyecto_User  │
   │ - id (PK)    │ 1:N     │  (Tabla Pivote)  │
   │ - user_id    ├─────────┤                  │
   │ - nombre     │         └──────────────────┘
   │ - moneda     │
   └──────────────┘
       │ 1:N
       ├──────────────┬──────────────┬────────────────┐
       │              │              │                │
       ↓ 1:N         ↓ 1:N          ↓ 1:N            ↓ 1:N
   ┌──────────────┐ ┌──────────┐ ┌──────────┐  ┌──────────────┐
   │  Categoria   │ │  Cuenta  │ │Transacci.│  │ Invitacion   │
   │ - id (PK)    │ │- id (PK) │ │- id (PK) │  │ - id (PK)    │
   │ - name       │ │- nombre  │ │- monto   │  │ - email      │
   │ - tipo       │ │- saldo   │ │- tipo    │  │ - rol        │
   │ - icono      │ │- banco   │ │- fecha   │  │ - aceptada   │
   └──────────────┘ └──────────┘ └────┬─────┘  └──────────────┘
       ↑                              │
       │ 1:N                          │
       └──────────────────────────────┘
         Categoriza transacciones
```

---

## 🔌 API REST

### Autenticación

```http
POST /api/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}

Response:
{
  "user": { /* User data */ },
  "token": "1|abc123xyz...",
  "message": "Cuenta creada exitosamente"
}
```

```http
POST /api/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}

Response:
{
  "user": { /* User data */ },
  "token": "1|abc123xyz...",
  "message": "Login exitoso"
}
```

```http
POST /api/logout
Authorization: Bearer {token}

Response:
{
  "message": "Logout exitoso"
}
```

### Proyectos

```http
GET /api/proyectos
Authorization: Bearer {token}

Response:
{
  "data": [
    {
      "id": 1,
      "nombre": "Mi Negocio",
      "descripcion": "Gestión de negocio principal",
      "moneda_default": "COP",
      "es_personal": false,
      "user_id": 1,
      "created_at": "2025-11-18T10:00:00Z",
      "updated_at": "2025-11-18T10:00:00Z"
    },
    {
      "id": 2,
      "nombre": "Finanzas Personales",
      "descripcion": null,
      "moneda_default": "COP",
      "es_personal": true,
      "user_id": 1,
      "created_at": "2025-11-18T09:00:00Z",
      "updated_at": "2025-11-18T09:00:00Z"
    }
  ]
}
```

```http
POST /api/proyectos
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Nuevo Proyecto",
  "descripcion": "Descripción opcional",
  "moneda_default": "COP"
}

Response: 201 Created
{
  "data": { /* Proyecto created */ }
}
```

```http
GET /api/proyectos/{id}
Authorization: Bearer {token}

Response: 200 OK
{
  "data": { /* Proyecto details */ }
}
```

```http
PUT /api/proyectos/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Nombre actualizado",
  "descripcion": "Nueva descripción"
}

Response: 200 OK
```

```http
DELETE /api/proyectos/{id}
Authorization: Bearer {token}

Response: 204 No Content
```

### Transacciones

```http
GET /api/proyectos/{proyectoId}/transacciones
Authorization: Bearer {token}

Response:
{
  "data": [
    {
      "id": 1,
      "proyecto_id": 1,
      "user_id": 1,
      "categoria_id": 5,
      "cuenta_id": 3,
      "tipo": "gasto",
      "monto": 50000,
      "descripcion": "Compra en supermercado",
      "fecha": "2025-11-18",
      "is_personal": false,
      "created_at": "2025-11-18T14:30:00Z"
    }
  ]
}
```

```http
POST /api/proyectos/{proyectoId}/transacciones
Authorization: Bearer {token}
Content-Type: application/json

{
  "categoria_id": 5,
  "cuenta_id": 3,
  "tipo": "gasto",
  "monto": 50000,
  "descripcion": "Compra en supermercado",
  "fecha": "2025-11-18",
  "is_personal": false
}

Response: 201 Created
```

### Categorías

```http
GET /api/proyectos/{proyectoId}/categorias
Authorization: Bearer {token}

Response:
{
  "data": [
    {
      "id": 1,
      "proyecto_id": 1,
      "nombre": "Alimentación",
      "descripcion": "Gastos de comida",
      "icono": "🍔",
      "color": "#FF6B6B",
      "tipo": "gasto",
      "created_at": "2025-11-18T10:00:00Z"
    }
  ]
}
```

```http
POST /api/proyectos/{proyectoId}/categorias
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Transporte",
  "descripcion": "Gastos de transporte",
  "icono": "🚕",
  "color": "#4ECDC4",
  "tipo": "gasto"
}

Response: 201 Created
```

### Cuentas

```http
GET /api/proyectos/{proyectoId}/cuentas
Authorization: Bearer {token}

Response:
{
  "data": [
    {
      "id": 1,
      "proyecto_id": 1,
      "nombre": "Cuenta Corriente Banco X",
      "saldo_actual": 1500000,
      "tipo_cuenta": "corriente",
      "numero_cuenta": "1234567890",
      "banco": "Banco X",
      "created_at": "2025-11-18T10:00:00Z"
    }
  ]
}
```

### Invitaciones

```http
POST /api/proyectos/{proyectoId}/invitaciones
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "nuevo@example.com",
  "rol": "miembro"
}

Response: 201 Created
{
  "message": "Invitación enviada",
  "data": { /* Invitacion */ }
}
```

### Miembros

```http
GET /api/proyectos/{proyectoId}/miembros
Authorization: Bearer {token}

Response:
{
  "data": [
    {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "rol": "admin",
      "joined_at": "2025-11-18T10:00:00Z"
    }
  ]
}
```

### Finanzas Personales

```http
GET /api/finanzas-personales
Authorization: Bearer {token}

Response:
{
  "data": {
    "proyecto_personal": { /* Proyecto personal */ },
    "transacciones_totales": 45,
    "gasto_total": 500000,
    "ingreso_total": 1000000,
    "saldo_neto": 500000
  }
}
```

---

## 🔐 SEGURIDAD

### Autenticación
- **Tipo**: Sanctum (API Token-based)
- **Token TTL**: 24 horas (configurable)
- **Rate Limiting**: 
  - 5 requests/minuto en endpoints de auth
  - 60 requests/minuto en otros endpoints
- **CORS**: Configurado para localhost:3000 (frontend local)

### Autorización (Policies)

#### ProyectoPolicy
- `viewAny()` - Usuarios autenticados pueden ver sus proyectos
- `view()` - Solo miembros del proyecto
- `create()` - Todos los usuarios autenticados
- `update()` - Solo administradores del proyecto
- `delete()` - Solo el propietario (creador)
- `manageMembersAndInvitations()` - Solo administradores

#### CategoriaPolicy
- `viewAny()` - Miembros del proyecto
- `view()` - Miembros del proyecto
- `create()` - Miembros del proyecto
- `update()` - Miembros del proyecto
- `delete()` - Solo administradores

#### CuentaPolicy
- Similar a CategoriaPolicy

#### TransaccionPolicy
- `viewAny()` - Miembros del proyecto
- `view()` - Miembros del proyecto
- `create()` - Miembros del proyecto
- `update()` - Creador de la transacción o administradores
- `delete()` - Creador de la transacción o administradores

#### InvitacionPolicy
- `viewAny()` - Administradores del proyecto
- `view()` - Administradores del proyecto
- `create()` - Administradores del proyecto
- `delete()` - Administradores del proyecto

### Validación de Formularios (Form Requests)

1. **LoginRequest** - Valida email y password
2. **RegisterRequest** - Valida nombre, email, password (con confirmación)
3. **StoreProyectoRequest** - Valida nombre, descripción, moneda
4. **StoreCategoriaRequest** - Valida nombre, tipo, icono, color
5. **StoreCuentaRequest** - Valida nombre, saldo, tipo de cuenta
6. **StoreTransaccionRequest** - Valida categoría, cuenta, monto, tipo, fecha
7. **StoreInvitacionRequest** - Valida email, rol

### Middleware de Seguridad

- **EnsurePersonalProjectAccess** - Solo el propietario accede al proyecto personal
- **Authenticate** - Requiere token válido
- **CORS Middleware** - Controla orígenes permitidos
- **Rate Limiting** - Limita requests por usuario/IP

### Otras Medidas

- ✅ Passwords hasheados con bcrypt
- ✅ CSRF Protection (session-based routes)
- ✅ SQL Injection Prevention (Eloquent ORM)
- ✅ XSS Protection (JSON responses)
- ✅ Email Verification (en desarrollo)
- ✅ Password Reset Tokens
- ✅ Secret Scanning (GitHub)
- ✅ Dependency Auditing (Dependabot)

---

## 🧪 TESTING

### Estadísticas

- **Total Tests**: 131
- **Total Assertions**: 342
- **Coverage**: 100% (rutas principales)
- **Status**: ✅ Todos pasando
- **Ejecución**: Docker (Sail)

### Categorías de Tests

#### 1. Authentication Tests (12 tests)
- Registro de usuario
- Login exitoso/fallido
- Logout
- Token validation
- Email verification
- Password reset

#### 2. Proyectos Tests (19 tests)
- Crear proyecto
- Listar proyectos
- Ver proyecto
- Actualizar proyecto
- Eliminar proyecto
- Autorización (Policies)
- Proyecto personal

#### 3. Categorías Tests (6 tests)
- Crear categoría
- Listar categorías
- Actualizar categoría
- Eliminar categoría
- Autorización

#### 4. Cuentas Tests (6 tests)
- Similar a categorías

#### 5. Transacciones Tests (7 tests)
- Crear transacción
- Listar transacciones
- Actualizar transacción
- Eliminar transacción
- Cálculo de saldos

#### 6. Invitaciones Tests (14 tests)
- Enviar invitación
- Aceptar invitación
- Rechazar invitación
- Expiración de invitaciones
- Email notifications

#### 7. Miembros Tests (12 tests)
- Agregar miembro
- Cambiar rol
- Remover miembro
- Listar miembros

#### 8. Email Notifications (20+ tests)
- Verification email
- Password reset email
- Invitation email
- Mailpit visual tests

#### 9. Finanzas Personales Tests
- Acceso a proyecto personal
- Cálculo de totales
- Autorización

### Ejecutar Tests

```bash
# Todos los tests
./vendor/bin/sail artisan test

# Tests específicos
./vendor/bin/sail artisan test tests/Feature/AuthenticationTest.php

# Con cobertura
./vendor/bin/sail artisan test --coverage

# Tests en paralelo
./vendor/bin/sail artisan test --parallel
```

### Setup de Testing

```php
// TestCase.php usa RefreshDatabase
- Crea schema limpio para cada test
- Seedea factories si es necesario
- Rollback después de cada test
- Base de datos totalmente aislada
```

---

## 🐳 DOCKER Y CI/CD

### Dockerfile

```dockerfile
# FROM php:8.2-apache
# - PHP 8.2
# - Apache con mod_rewrite
# - MySQL PDO driver
# - Composer instalado
# - Document root: /var/www/html/public
# - Port 80 exposed
```

**Build**: `docker build -t controlapp:latest .`

**Run**: `docker run -p 80:8000 controlapp:latest`

### Docker Compose (Sail)

```yaml
Services:
  - laravel (PHP 8.2 + Apache)
  - mysql (Database)
  - redis (Cache)
  - mailpit (Email testing)

Network: controlapp (docker network)
Volumes: app data mounted

Usage:
  ./vendor/bin/sail up -d      # Start
  ./vendor/bin/sail down        # Stop
  ./vendor/bin/sail logs -f     # View logs
  ./vendor/bin/sail tinker      # Interactive shell
```

### GitHub Actions CI/CD

#### 1. Tests Workflow (`.github/workflows/tests.yml`)
```yaml
on: [push, pull_request]
- Instala dependencies
- Crea .env.testing
- Crea base de datos
- Ejecuta 131 tests
- Genera coverage reports
```

#### 2. Code Quality (PHPStan)
```yaml
- Ejecuta PHPStan Level 8
- Verifica tipos
- Encuentra bugs potenciales
```

#### 3. Dependabot
```yaml
- Monitorea dependencies
- Crea PRs automáticos
- Prueba actualizaciones
```

#### 4. Secret Scanning
```yaml
- Detecta secrets commiteados
- Push protection habilitado
```

---

## 💻 FRONTEND (ESTADO ACTUAL)

### Situación Actual

```
❌ Ningún framework frontend instalado
❌ React: NO
❌ Vue.js: NO
❌ Inertia.js: NO
❌ npm/Node.js: NO CONFIGURADO
ℹ️ Estado: 100% Backend API-ready
```

### Propuesta de Opciones

#### Opción 1: React Separado (Recomendado para escalabilidad)

```bash
# Crear app React separada
npx create-react-app frontend
cd frontend
npm install axios react-router-dom zustand

# Estructura
frontend/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ...
│   │   ├── Proyectos/
│   │   │   ├── ProyectosList.jsx
│   │   │   ├── ProyectoDetail.jsx
│   │   │   └── ...
│   │   ├── Transacciones/
│   │   │   ├── TransaccionesList.jsx
│   │   │   ├── TransaccionForm.jsx
│   │   │   └── ...
│   │   └── Common/
│   │       ├── Header.jsx
│   │       ├── Navbar.jsx
│   │       └── ...
│   ├── services/
│   │   ├── api.js             ← Axios instance
│   │   ├── auth.service.js
│   │   ├── proyectos.service.js
│   │   └── ...
│   ├── stores/               ← Zustand stores
│   │   ├── authStore.js
│   │   ├── proyectosStore.js
│   │   └── ...
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.local               ← VITE_API_URL=http://localhost:8000
├── vite.config.js
└── package.json

# Ejecutar
npm run dev                  # Development server :5173
npm run build              # Production build
npm run preview            # Preview build
```

**Ventajas**:
- Separación clara entre backend y frontend
- Fácil de escalar
- Deploy independiente
- Mejor para microservicios

**Desventajas**:
- Requiere CORS configurado
- Deploy más complejo
- Manejo de tokens en cliente

#### Opción 2: Inertia.js (React en Laravel)

```bash
# Instalar en Laravel
composer require inertiajs/inertia-laravel
npm install @inertiajs/react react react-dom
php artisan inertia:install --typescript

# Estructura
resources/js/
├── Pages/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── Proyectos/
│   │   ├── Index.jsx
│   │   ├── Show.jsx
│   │   └── Edit.jsx
│   └── ...
├── Components/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   └── ...
├── app.jsx
└── bootstrap.js

# Ventajas
- Single deployment
- Props tipadas
- Routing único
- SSR posible

# Desventajas
- Más acoplado
- Servidor renderiza rutas
```

#### Opción 3: Laravel + Vite + React

```bash
# Laravel ya tiene vite.config.js configurado
npm install react react-dom @vitejs/plugin-react

# resources/js/
├── components/
├── pages/
├── services/
└── app.jsx

# Ejecutar
npm run dev    # Vite dev server
npm run build  # Production build
```

### API Client Pattern

```javascript
// services/api.js (para cualquier framework)
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('api_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### Ejemplo: Login con React

```jsx
import { useState } from 'react';
import apiClient from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/login', { email, password });
      localStorage.setItem('api_token', response.data.token);
      // Redirect to dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## 📖 CÓMO USAR ESTE CONTEXTO

### Para una IA en Navegador (ChatGPT, Claude, etc.)

**Paso 1**: Copia TODO este documento

**Paso 2**: Abre tu IA favorita y pega el contenido

**Paso 3**: Haz tus preguntas contextualizadas:

```
Basado en este contexto de ControlApp:

1. ¿Cómo crear un componente React que liste todos los proyectos del usuario?
2. ¿Qué patrón debería usar para manejar errores en llamadas API?
3. ¿Cómo implementar autenticación con tokens Sanctum?
4. ¿Cuál es la mejor forma de estructurar la carpeta src/ en React?
5. ¿Cómo manejar el refresh de tokens?
```

### Preguntas Típicas que Puedes Hacer

1. **Sobre API**:
   - ¿Cuál es el endpoint para crear una transacción?
   - ¿Qué parámetros necesita el endpoint de invitaciones?
   - ¿Cómo se validan las transacciones?

2. **Sobre Frontend**:
   - ¿Cómo creo un componente React para listar categorías?
   - ¿Qué estado debería manejar en Zustand?
   - ¿Cómo intercambio datos entre componentes?

3. **Sobre Seguridad**:
   - ¿Dónde almaceno el token en el navegador?
   - ¿Cómo valido permisos en el frontend?
   - ¿Qué headers necesito en las requests?

4. **Sobre Testing**:
   - ¿Cómo mockeo las llamadas API en tests?
   - ¿Qué librerías de testing recomiendas?
   - ¿Cómo testeo componentes que usan tokens?

5. **Sobre Deployment**:
   - ¿Cómo depliego la app completa?
   - ¿Dónde configuro las URLs de API?
   - ¿Cómo manejo CORS en producción?

---

## 🔑 INFORMACIÓN ESENCIAL PARA RECORDAR

### URLs Importantes
- **API**: `http://localhost:8000/api`
- **Frontend (desarrollo)**: `http://localhost:3000` (React)
- **Mailpit (testing emails)**: `http://localhost:8025`
- **PHPStan**: `./vendor/bin/phpstan analyse app --level=8`

### Credenciales de Testing
```
Email: test@example.com
Password: password123
```

### Comandos Útiles
```bash
# Dentro del contenedor Sail
./vendor/bin/sail artisan migrate       # Run migrations
./vendor/bin/sail artisan tinker        # Laravel shell
./vendor/bin/sail artisan test          # Run tests
./vendor/bin/sail artisan make:model    # Generate model
./vendor/bin/sail artisan make:migration # Generate migration

# Locales
composer install                        # Install PHP deps
npm install                            # Install JS deps (cuando haya)
```

### Rate Limits
- Auth endpoints: 5 requests/minute
- Other endpoints: 60 requests/minute
- Token expiry: 24 hours

### Importante
- ✅ SIEMPRE incluye `Authorization: Bearer {token}` en requests autenticados
- ✅ Content-Type debe ser `application/json`
- ✅ Todos los datos se devuelven en JSON
- ✅ Los errores incluyen `message` y a veces `errors` (validación)
- ✅ Status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Server Error

---

## 📞 RESUMEN EJECUTIVO PARA COPIAR A IA

```
Proyecto: ControlApp
Tipo: API-first Backend + Frontend (a construir)
Backend: Laravel 11 + PHP 8.2 + MySQL
Testing: 131 tests (100% passing)
Security: Sanctum, Policies, Form Validation, Rate Limiting
Docker: Containerizado (Dockerfile + docker-compose.yml)
Frontend: A CONSTRUIR (propuesta: React con Vite)

Modelos: User, Proyecto, Categoria, Cuenta, Transaccion, Invitacion
Endpoints: 20+ REST endpoints
Autenticación: Token-based (Sanctum)
Rate Limiting: 5 req/min (auth), 60 req/min (otros)

¿Necesitas ayuda con React + Laravel API Integration?
¿Necesitas ayuda creando un componente específico?
¿Necesitas entender cómo funciona el endpoint X?

Contexto completo disponible. Adelante con tus preguntas.
```

---

**Documento generado**: 18 de noviembre de 2025
**Versión**: 1.0
**Mantenido por**: ControlApp Development Team

