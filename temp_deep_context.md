# 📚 ControlApp - Documentación Completa

Bienvenido a la documentación de **ControlApp** - Plataforma de gestión de proyectos colaborativos.

> **ControlApp** es una plataforma de gestión de proyectos que permite a usuarios crear, colaborar y gestionar proyectos. La primera feature implementada es **Gestión Financiera** (cuentas, transacciones, categorías). Próximas features incluirán más funcionalidades de gestión de proyectos.

> **Nota**: Esta documentación está organizada en carpetas temáticas. Selecciona tu rol para encontrar lo que necesitas.

---

## 🗂️ Estructura de Documentación

```
docs/
├── 01-core/                     # 📍 Comienza aquí
│   ├── INDEX.md                (este archivo)
│   ├── CHANGELOG.md            (cambios técnicos detallados)
│   └── QUICK_REFERENCE.md      (comandos y atajos)
│
├── 02-development/             # 💻 Para desarrolladores
│   ├── INSTALLATION.md         (cómo instalar)
│   ├── API.md                  (endpoints - UPDATED)
│   ├── AUTHENTICATION.md       (sistema de auth - UPDATED)
│   ├── AUTHORIZATION_VALIDATION.md (NEW - Policies, FormRequest, Rate Limiting)
│   ├── DATABASE.md             (esquema y modelos)
│   ├── CONTRIBUTING.md         (cómo contribuir)
│   └── README.md               (guide para developers)
│
├── 03-ia-collaboration/        # 🤖 Para IAs colaborando
│   ├── AI_GUIDELINES.md        (normas y flujos)
│   ├── ONBOARDING_FOR_NEW_AIs.md (COPY-PASTE en chat)
│   └── HOW_TO_SWITCH_TO_NEW_AI.md (procedimiento de cambio)
│
├── 04-testing/                 # 🧪 Testing y QA
│   ├── TESTING_ARCHITECTURE.md (estrategia de testing)
│   ├── TESTING_SCRIPTS.md      (scripts de testing)
│   ├── TESTING.md              (documentación general)
│   └── TESTING_*.md            (archivos históricos)
│
├── 05-reference/               # 📖 Referencias
│   ├── MAILPIT_GUIDE.md        (Mailpit local SMTP)
│   ├── MAILTRAP_GUIDE.md       (configurar emails)
│   └── MAILTRAP_VISUALIZATION.md (ver emails capturados)
│
└── 06-security/                # � Seguridad (NEW - Comprehensive)
    ├── README.md               (overview de seguridad)
    ├── SECURITY_AUDIT.md       (NEW - Audit findings & fixes)
    ├── PRODUCTION_DEPLOYMENT.md (NEW - Deployment checklist)
    ├── COMPLETION_SUMMARY.md   (NEW - What was fixed)
    └── SECURITY_CONFIGURATION.md (herramientas de seguridad)
```

---

## 🎯 Selecciona tu rol

### 👤 Soy usuario final

```
1. Leer: ../../README.md (5 min)
   ↓
2. Instalar: ../02-development/INSTALLATION.md (15 min)
   ↓
3. ¡Comenzar a usar!
```

---

### 💻 Soy desarrollador
````

---

## 🎯 Selecciona tu rol

### 👤 Soy usuario final

```
1. Leer: ../../README.md (5 min)
   ↓
2. Instalar: ../02-development/INSTALLATION.md (15 min)
   ↓
3. ¡Comenzar a usar!
```

---

### 💻 Soy desarrollador

```
1. Leer: ../../README.md (5 min)
   ↓
2. Instalar: ../02-development/INSTALLATION.md (15 min)
   ↓
3. Estudiar: ../02-development/DATABASE.md (10 min)
   ↓
4. Seguridad: ../02-development/AUTHENTICATION.md (10 min)
   ↓
5. Autorización: ../02-development/AUTHORIZATION_VALIDATION.md (20 min)
   ↓
6. API Docs: ../02-development/API.md (15 min)
   ↓
7. Contribuir: ../02-development/CONTRIBUTING.md
   ↓
8. Ver cambios: ../01-core/CHANGELOG.md
```

### 🔐 Necesito entender seguridad

```
1. Empezar: ../06-security/README.md
   ↓
2. Audit: ../06-security/SECURITY_AUDIT.md (comprehensive)
   ↓
3. Deployment: ../06-security/PRODUCTION_DEPLOYMENT.md
   ↓
4. Dev Guide: ../02-development/AUTHENTICATION.md
   ↓
5. Code Examples: ../02-development/AUTHORIZATION_VALIDATION.md
```

---

### 🤖 Soy IA colaborando en el proyecto

**🚀 Quick Start: 5-15 minutos para empezar**

```
1. Copia COMPLETAMENTE: ../03-ia-collaboration/ONBOARDING_FOR_NEW_AIs.md
2. Pega en el chat de esta IA
3. Di: "He aquí el contexto del proyecto, léelo completamente"
4. Espera confirmación
5. Describe tu tarea
✅ Listo, la IA ya tiene todo el contexto necesario
```

**Documentos que DEBES leer**:

| Paso | Documento | Tiempo | Razón |
|------|-----------|--------|-------|
| 1 | **ONBOARDING_FOR_NEW_AIs.md** | 10 min | Entiendes estructura y normas |
| 2 | **AI_GUIDELINES.md** | 15 min | Sabes cómo debo comportarme |
| 3 | **CHANGELOG.md** (últimas entradas) | 5 min | Entiendes contexto histórico |

**Si cambias de IA en próxima sesión**:
→ Lee: **HOW_TO_SWITCH_TO_NEW_AI.md** (tu guía exacta de procedimiento)

---

### 🧪 Soy QA / Testing

```
1. Leer: ../04-testing/TESTING_ARCHITECTURE.md (20 min)
   └─ Entiende estrategia completa

2. Leer: ../04-testing/TESTING_SCRIPTS.md (10 min)
   └─ Aprende todos los comandos

3. Ver: ../04-testing/TESTING.md (referencia)
   └─ Documentación general

✅ Ahora sabes cómo ejecutar y escribir tests
```

---

### 🤝 Soy contribuidor

```
1. Leer: ../02-development/CONTRIBUTING.md (10 min)
   ↓
2. Leer: ../02-development/DATABASE.md (10 min)
   ↓
3. Leer: ../02-development/API.md (15 min)
   ↓
4. Ver: CHANGELOG.md (últimas entradas) (5 min)
   ↓
5. Hacer pull request ✅
```

---

## 📖 Navegación Rápida

### Encuentro lo que busco

| Pregunta | Carpeta | Documento |
|----------|---------|-----------|
| "¿Cómo instalo ControlApp?" | 02-development | INSTALLATION.md |
| "¿Cuáles son los endpoints?" | 02-development | API.md |
| "¿Cómo funciona autenticación?" | 02-development | AUTHENTICATION.md |
| "¿Cuál es estructura de BD?" | 02-development | DATABASE.md |
| "¿Cómo contribuyo?" | 02-development | CONTRIBUTING.md |
| "¿Qué cambios hubo?" | 01-core | CHANGELOG.md |
| "¿Cambios MÁS detallados?" | 01-core | CHANGELOG.md |
| "¿Comandos rápidos?" | 01-core | QUICK_REFERENCE.md |
| "¿Soy una IA?" | 03-ia-collaboration | ONBOARDING_FOR_NEW_AIs.md |
| "¿Cómo testear?" | 04-testing | TESTING_ARCHITECTURE.md |
| "¿Configurar Mailtrap?" | 05-reference | MAILTRAP_GUIDE.md |

---

## 🤖 Para IAs: Instrucciones Claras

### Patrón Principal: NO crear documentos nuevos sin necesidad

**Regla de Oro**:
```
❌ ANTES (incorrecto):
   - Crear SESSION_SUMMARY_*.md
   - Crear DOCUMENTATION_SUMMARY.md
   - Crear CHANGELOG_DIFFERENCE_EXPLAINED.md
   
✅ AHORA (correcto):
   - ¿Es resumen? → Actualizar CHANGELOG.md
   - ¿Es guía? → Actualizar documento existente
   - ¿Es procedimiento? → Agregar a HOW_TO_SWITCH_TO_NEW_AI.md
   - ¿Es REALMENTE nuevo? → Preguntar primero
```

### Flujo de Decisión para IAs

```
¿Necesito crear/modificar documentación?
  │
  ├─ ¿Hay un cambio de código?
  │  └─ SÍ → Actualizar CHANGELOG.md SIEMPRE
  │
  ├─ ¿Es resumen de sesión?
  │  └─ SÍ → Actualizar CHANGELOG.md (NO crear nuevo doc)
  │
  ├─ ¿Es aclaración de norma existente?
  │  └─ SÍ → Actualizar AI_GUIDELINES.md
  │
  ├─ ¿Es procedimiento nuevo?
  │  └─ SÍ → Crear NEW_PROCEDURE.md EN carpeta adecuada + PREGUNTAR
  │
  ├─ ¿Es documento redundante?
  │  └─ SÍ → BORRAR o CONSOLIDAR
  │
  └─ ¿Es REALMENTE nuevo?
     ├─ SÍ → Crear + PREGUNTAR + Usar carpeta temática
     └─ NO → Actualizar existente
```

### Tipos de Cambios Permitidos

| Situación | Acción | Ubicación | Ejemplo |
|-----------|--------|-----------|---------|
| Bug arreglado | UPDATE | CHANGELOG.md | "Corregido MorphType en CuentaController" |
| Feature agregada | UPDATE | CHANGELOG.md | "Agregado sistema de invitaciones" |
| Sesión completada | UPDATE | CHANGELOG.md | "16-11-25: Completada refactorización de..." |
| Norma aclarada | UPDATE | AI_GUIDELINES.md | Agregar sección explicatoria |
| Procedimiento NUEVO | CREATE | En carpeta temática | "PROCEDURE_NAME.md" + PREGUNTAR |
| Documentación vieja | UPDATE | Documento existente | Actualizar sección obsoleta |
| Documento duplicado | DELETE | N/A | Eliminar redundante |

---

## 📋 Checklist para IAs ANTES de crear documento

- [ ] ¿Hay un documento existente sobre este tema?
- [ ] ¿Puedo actualizar uno existente en lugar de crear?
- [ ] ¿Esto es un resumen? → Va en CHANGELOG.md
- [ ] ¿Esto es una clarificación? → Va en AI_GUIDELINES.md
- [ ] ¿Es REALMENTE nuevo y no existe en otro lado?
- [ ] ¿Pregunté al usuario antes de crear?

**Resultado**:
- Sí a 4+ preguntas → Puedes considerar crear
- No a algunas → Actualiza existente o ESPERA confirmación

---

## 🏗️ Estructura Recomendada por Carpeta

```
01-core/
├─ Para: Referencia general, cambios, índice
├─ UPDATE FREQUENCY: Cada cambio importante
└─ Documentos: INDEX, CHANGELOG, QUICK_REFERENCE

02-development/
├─ Para: Cómo desarrollar, instalar, APIs
├─ UPDATE FREQUENCY: Cambios arquitectónicos importantes
└─ Documentos: Installation, APIs, Database, Auth, Contributing

03-ia-collaboration/
├─ Para: Normas y procedimientos de IA
├─ UPDATE FREQUENCY: Raramente (normas estables)
└─ Documentos: Guidelines, Onboarding, How-to-switch

04-testing/
├─ Para: Estrategia de testing y ejecución
├─ UPDATE FREQUENCY: Cambios en testing críticos
└─ Documentos: TESTING_ARCHITECTURE (principal), scripts, referencias

05-reference/
├─ Para: Configuraciones externas específicas
├─ UPDATE FREQUENCY: Cambios en herramientas
└─ Documentos: Integraciones (Mailtrap, etc.)
```

---

## 🚫 Lo que NO debes hacer

- ❌ Crear documento cada vez que terminas
- ❌ "SESSION_SUMMARY_*.md", "DOCUMENTATION_*.md"
- ❌ Tener duplicados en diferentes formatos
- ❌ Documentos "resumen de resumen"
- ❌ Crear archivos sin carpeta temática
- ❌ Archivos históricos sin eliminar si son redundantes

---

## ✅ Lo que SÍ debes hacer

- ✅ Actualizar CHANGELOG.md SIEMPRE con cada cambio
- ✅ Preguntar si no sabes si crear documento
- ✅ Organizar SIEMPRE en carpetas temáticas
- ✅ Eliminar o consolidar documentos obsoletos
- ✅ Mantener información en un único lugar
- ✅ Hacer documentación breve y enfocada

---

## 🔗 Acceso Rápido

Desde cualquier documento, vuelve a:

- **Índice principal**: `INDEX.md`
- **Cambios recientes**: `CHANGELOG.md`
- **Para Developers**: `../02-development/API.md`
- **Para IAs**: `../03-ia-collaboration/ONBOARDING_FOR_NEW_AIs.md`
- **Para Testing**: `../04-testing/TESTING_ARCHITECTURE.md`

---

## 📅 Última Actualización

- **Fecha**: 16 de noviembre de 2025
- **Reorganización**: Consolidada en 5 carpetas temáticas
- **Limpieza**: Removidos documentos redundantes
- **Versión**: 2.0.0 (reorganizado)

---

**🎉 Documentación clara, organizada y mantenible.**

Próximo paso: Selecciona tu rol arriba y comienza a leer.
# API Documentation - ControlApp

> **Last Updated**: November 16, 2025 - Security Audit & Rate Limiting Added

## 📋 Índice

1. [Rate Limiting & Security](#rate-limiting--security)
2. [Autenticación](#autenticación)
3. [Usuarios](#usuarios)
4. [Proyectos](#proyectos)
5. [Invitaciones](#invitaciones)
6. [Categorías](#categorías)
7. [Cuentas](#cuentas)
8. [Transacciones](#transacciones)
9. [Códigos de Error](#códigos-de-error)

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
# Documentación Frontend

## Componentes Reutilizables

### Alert
Componente para mostrar mensajes de estado (información, advertencia, éxito, error) con estilos estandarizados.

**Uso:**
```jsx
import Alert from '@/Components/Alert';

<Alert type="info" title="Nota">
    Este es un mensaje informativo.
</Alert>
```

**Props:**
- `type`: 'info' (azul), 'warning' (ámbar), 'success' (verde), 'error' (rojo). Default: 'info'.
- `title`: Título opcional en negrita.
- `children`: Contenido del mensaje.
- `className`: Clases CSS adicionales.

**Ubicación:** `resources/js/Components/Alert.jsx`

## Iconos
Se utiliza una estrategia híbrida de iconos SVG reutilizables y Heroicons.
- **Ubicación:** `resources/js/Components/Icons.jsx`
- **Nuevos Iconos:** `InfoIcon`, `BookOpenIcon`, `CodeIcon`.

## Tema y Colores
El sistema utiliza Tailwind CSS con variables CSS para el soporte de temas dinámicos.
- **Primario**: Definido por el tema seleccionado (púrpura, azul, verde, etc.).
- **Secundario**: `colors.gray` para mantener el modo oscuro elegante y neutro.
- **Info**: `colors.blue` para elementos informativos y técnicos (ej. tarjeta de desarrollador).
# 🧪 Estrategia de Testing (Consolidado) - ControlApp

**Este documento fusiona la arquitectura de pruebas, el aislamiento de BD y los comandos de ejecución de tests.**

---

## 1. 🎯 Filosofía de Testing y QA

* **Estado Actual**: 206 tests pasando con 677 assertions (100% de cobertura en módulos principales de autenticación y finanzas).
* **Regla de Oro (Quality Gate)**: Si los tests fallan, el código tiene un error. **No hagas commit/push hasta que todos pasen**.
* **Convención**: Usar nombres descriptivos para los tests: `test_admin_puede_crear_usuario`.

---

## 2. 🗄️ Aislamiento de Base de Datos (SQLite In-Memory)
 
La suite de tests ahora está configurada para usar **SQLite en memoria** (`:memory:`).
 
*   **Ventajas**:
    *   🚀 **Velocidad**: Los tests se ejecutan mucho más rápido al no tocar el disco.
    *   🛠️ **Simplicidad**: No requiere un servidor MySQL corriendo ni crear una base de datos de testing separada.
    *   🔄 **Aislamiento**: Cada test inicia con una base de datos fresca en memoria que se destruye al finalizar.
*   **Trait RefreshDatabase**: Sigue siendo esencial. Se encarga de migrar la base de datos en memoria antes de cada test.
 
---
 
## 3. 🛠️ Comandos de Ejecución (Testing Scripts)
 
Puedes ejecutar los tests tanto dentro de Docker (Sail) como en tu máquina local (si tienes PHP instalado), gracias a SQLite.
 
| Propósito | Comando (Local) | Comando (Sail/Docker) |
| :--- | :--- | :--- |
| **Ejecutar todos los tests** | `php artisan test` | `./vendor/bin/sail test` |
| **Ejecutar con testdox (Detallado)** | `php artisan test --testdox` | `./vendor/bin/sail test --testdox` |
| **Ejecutar un archivo específico** | `php artisan test tests/Feature/EjemploTest.php` | `./vendor/bin/sail test ...` |
| **Ejecutar un test específico** | `php artisan test --filter=nombre_del_test` | `./vendor/bin/sail test ...` |
| **Ejecutar tests en paralelo** | `php artisan test --parallel` | `./vendor/bin/sail test --parallel` |
 
> **Nota:** Ya no es necesario ejecutar comandos de migración manual (`migrate:fresh`) para testing, ya que SQLite se migra automáticamente en memoria.

---

## 4. 🔍 Pruebas de Búsqueda
- **Driver**: Usamos el driver `collection` para `Laravel Scout` durante las pruebas.
- **Configuración**: Definida en `.env.testing` (`SCOUT_DRIVER=collection`).
- **Beneficio**: Permite probar la lógica de búsqueda (como control de acceso y formato de resultados) sin requerir una instancia de Meilisearch en ejecución en el entorno de pruebas.
- **Test Clave**: `tests/Feature/SearchTest.php` verifica que:
  - La página de búsqueda es accesible.
  - Los resultados se devuelven correctamente.
  - **Seguridad**: Los usuarios solo ven proyectos de los que son miembros (o admins, según el modo estricto).

---

## 5. 🚀 Integración Continua (CI)

---

## 6. 📝 Assertions y Estructura

*   **Estructura del Test (AAA)**:
    1.  `Arrange`: Preparar datos con Factories.
    2.  `Act`: Ejecutar la acción (ej. `$this->postJson(...)`).
    3.  `Assert`: Validar el resultado (`assertStatus`, `assertDatabaseHas`, `assertJson`, etc.).

* **Assertions Comunes**:
    * `$response->assertStatus(200)` o `assertStatus(201)` (Created)
    * `$response->assertStatus(403)` (Forbidden) o `assertStatus(404)` (Not Found)
    * `$this->assertDatabaseHas('users', [...])`
    * `$this->assertDatabaseMissing('users', [...])`
    * `Mail::assertSent(...)` (Para validar emails)

---

## 5. 🧪 Cobertura de Autenticación (Web + API)

Resumen de los tests clave relacionados con login/registro/verificación y reset de contraseña:

- **Web (Inertia + React)**
  - `tests/Feature/Auth/AuthenticationTest.php`: pantalla de login (Inertia), login correcto/incorrecto, logout y "remember me".
  - `tests/Feature/Auth/RegistrationTest.php`: pantalla de registro, creación de usuario, redirección a login y protección por verificación de email.
  - `tests/Feature/Auth/EmailVerificationTest.php`: flujo de verificación de email en la parte web.
  - `tests/Feature/Auth/PasswordResetTest.php`: solicitud de enlace, pantalla de reset y validaciones de token/contraseña.
  - `tests/Feature/Auth/PasswordUpdateTest.php`: cambio de contraseña del usuario autenticado.

- **API**
  - `tests/Feature/AuthenticationApiTest.php`: registro/login/logout vía API y restricción por email verificado.
  - `tests/Feature/EmailVerificationApiTest.php`: verificación de email vía enlace (`/api/email/verify/{id}/{hash}`) y reenvío del email.
  - `tests/Feature/PasswordResetApiTest.php`: endpoints de reset de contraseña (forgot/reset/validaciones).
  - `tests/Feature/PasswordResetMailTest.php`: contenido y formato del email de reset.
  - `tests/Feature/VisualEmailTestsInMailpitTest.php`: verificación visual de correos de verificación, invitación y reset en Mailpit.

## 6. 🗑️ Tarea de Limpieza Final

Si no lo has hecho ya, por favor, elimina de la carpeta `docs/04-testing/` los archivos `TESTING.md` y `TESTING_SCRIPTS.md` (y cualquier otro archivo histórico), ya que su contenido ha sido fusionado en este documento.

