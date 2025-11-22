# Authentication Guide - ControlApp

Guía completa sobre el sistema de autenticación y autorización en ControlApp.

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Flujo de Autenticación](#flujo-de-autenticación)
3. [Registro de Usuarios](#registro-de-usuarios)
4. [Login y Tokens](#login-y-tokens)
5. [Verificación de Email](#verificación-de-email)
6. [Autorización](#autorización)
7. [Seguridad](#seguridad)
8. [Troubleshooting](#troubleshooting)

---

## 🔐 Visión General

ControlApp utiliza **Laravel Sanctum** para la autenticación basada en tokens API. Este sistema permite:

- ✅ Autenticación segura sin estado (stateless)
- ✅ Múltiples tokens por usuario
- ✅ Expiración de tokens configurable
- ✅ Verificación de email requerida
- ✅ Roles y permisos personalizables

### Stack de Seguridad

| Componente | Tecnología | Propósito |
|-----------|-----------|----------|
| **Autenticación** | Laravel Sanctum | Tokens JWT |
| **Encriptación** | bcrypt | Contraseñas |
| **Emails** | Mailpit + Custom Templates | Verificación |
| **CORS** | Laravel CORS | Cross-Origin |
| **Rate Limiting** | Laravel Throttle | DDoS Protection |

---

## 🔄 Flujo de Autenticación

### Paso 1: Registro
```
POST /api/register
├── Validación de datos
├── Crear usuario con contraseña encriptada
├── Dispara evento Registered
└── Envía email de verificación
```

### Paso 2: Verificación de Email
```
GET /api/email/verify/{id}/{hash}
├── Valida hash SHA1
├── Marca email como verificado
├── Dispara evento Verified
└── Usuario listo para login
```

### Paso 3: Login
```
POST /api/login
├── Valida credenciales
├── Verifica email verificado
├── Genera token Sanctum
└── Retorna token + user data
```

### Paso 4: Uso Autenticado
```
Cualquier endpoint protegido
├── Header: Authorization: Bearer {token}
├── Sanctum valida token
└── Ejecuta acción
```

### Paso 5: Logout
```
POST /api/logout
├── Invalida token actual
└── Usuario desconectado
```

---

## 👤 Registro de Usuarios

### Endpoint
```http
POST /api/register
Content-Type: application/json
Accept: application/json
```

### Request Body
```json
{
  "name": "Juan Pérez García",
  "email": "juan@example.com",
  "password": "MiContraseña123!",
  "password_confirmation": "MiContraseña123!"
}
```

### Validaciones
```
name:
  - Requerido
  - String
  - Máximo 255 caracteres
  - Mínimo 2 caracteres

email:
  - Requerido
  - Email válido
  - Único (no puede existir otro usuario con este email)
  - Máximo 255 caracteres

password:
  - Requerido
  - Mínimo 8 caracteres
  - Confirmación debe ser idéntica
  - Se recomienda: mayúsculas, minúsculas, números, símbolos
```

### Response (201)
```json
{
  "message": "Usuario registrado exitosamente. Por favor, inicia sesión."
}
```

### Error Responses

**422 - Email duplicado**
```json
{
  "message": "The email has already been taken.",
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```

**422 - Contraseña débil**
```json
{
  "message": "The password confirmation does not match.",
  "errors": {
    "password": ["The password confirmation does not match."]
  }
}
```

### Flujo Post-Registro

```
1. Usuario se registra
   ↓
2. Sistema crea usuario en BD
   ↓
3. Se dispara evento Registered
   ↓
4. Listener envía email de verificación
   ↓
5. Email contiene enlace con hash SHA1
   ↓
6. Usuario hace clic en enlace
   ↓
7. Email se marca como verificado
```

---

## 🔑 Login y Tokens

### Endpoint Login
```http
POST /api/login
Content-Type: application/json
Accept: application/json
```

### Request Body
```json
{
  "email": "juan@example.com",
  "password": "MiContraseña123!"
}
```

### Response (200)
```json
{
  "user": {
    "id": 1,
    "name": "Juan Pérez García",
    "email": "juan@example.com",
    "email_verified_at": "2025-11-15 10:30:00",
    "created_at": "2025-11-15 09:45:00",
    "updated_at": "2025-11-15 09:45:00"
  },
  "token": "1|qZ8J9xK4mP2wL6vN3hD5sT7gF9eR2aB1cU5iO8jL9pM4q"
}
```

### Estructura del Token

El token tiene el formato: `{tokenId}|{hash}`

- **{tokenId}**: ID único del token en BD
- **{hash}**: Hash SHA256 del token completo

### Validaciones Login

```
Si credenciales inválidas (401):
- Email no existe en BD
- Contraseña no coincide

Si email no verificado (422):
- Usuario registrado pero no verificó email
- Debe verificar primero para poder login
```

### Error Responses

**401 - Credenciales inválidas**
```json
{
  "message": "The provided credentials are invalid."
}
```

**422 - Email no verificado**
```json
{
  "message": "Email not verified"
}
```

### Usando el Token

Una vez logueado, usar el token en todos los requests:

```http
GET /api/user
Authorization: Bearer 1|qZ8J9xK4mP2wL6vN3hD5sT7gF9eR2aB1cU5iO8jL9pM4q
Accept: application/json
```

### Guardar Token (Seguridad)

#### ❌ NO HAGAS ESTO (Inseguro)
```javascript
// No guardes en localStorage
localStorage.setItem('token', response.token);

// No lo envíes por URL
fetch('/api/user?token=' + token)

// No lo expongas en logs públicos
console.log('Token: ' + token);
```

#### ✅ HAZLO ESTO (Seguro)
```javascript
// Guardar en cookie httpOnly
document.cookie = `token=${token}; HttpOnly; Secure; SameSite=Strict`;

// O en memory (se pierde al refrescar página)
let authToken = response.token;

// Enviar por header
fetch('/api/user', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Implementar CSRF protection
// Si usas cookies, Laravel lo maneja automáticamente
```

---

## ✉️ Verificación de Email

### Flujo Completo

```
1. Usuario se registra
   ↓
2. Se envía email con enlace:
   http://localhost:8000/api/email/verify/1/0a67a28003c728819cadf18f440831ff0349525d
   ↓
3. Usuario hace clic en enlace
   ↓
4. Sistema valida:
   - ID de usuario existe
   - Hash coincide con SHA1 del email
   ↓
5. Si válido:
   - Marca email como verificado
   - Dispara evento Verified
   ↓
6. Usuario puede hacer login
```

### Génesis del Hash

El hash se calcula como:

```php
$hash = sha1($user->email);
```

Ejemplo:
- Email: `juan@example.com`
- SHA1: `0a67a28003c728819cadf18f440831ff0349525d`
### Endpoint de Verificación

```http
GET /api/email/verify/{id}/{hash}
```

**⚠️ Importante**:
- Este endpoint NO requiere autenticación.
- Está pensado para abrirse en el navegador al hacer clic en el enlace del correo.
- No devuelve JSON: redirige a la pantalla de login con mensajes en sesión.

### Comportamiento

- **Usuario existente y hash válido**
  - HTTP `302` → `route('login')`
  - `session('status') = "¡Email verificado exitosamente! Ahora puedes iniciar sesión."`

- **Usuario no encontrado**
  - HTTP `302` → `route('login')`
  - `session('error') = "Usuario no encontrado."`

- **Hash inválido**
  - HTTP `302` → `route('login')`
  - `session('error') = "El enlace de verificación es inválido o ha expirado."`

- **Email ya verificado**
  - HTTP `302` → `route('login')`
  - `session('status') = "El email ya había sido verificado. Puedes iniciar sesión."`

### Cobertura de Tests

- `Tests\Feature\Auth\EmailVerificationTest`: cubre el flujo de verificación desde la interfaz web (Inertia).
- `Tests\Feature\EmailVerificationApiTest`: valida redirecciones y mensajes de sesión del endpoint `/api/email/verify/{id}/{hash}` y el reenvío del correo.
- `Tests\Feature\VisualEmailTestsInMailpitTest`: comprueba en Mailpit que el correo de verificación se envía con la URL correcta.

### Reenviar Email

Si el usuario no recibe el email:

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

## 🔒 Autorización

### Niveles de Acceso

#### 1. Sin Autenticación (Public)
```
- POST /api/register
- POST /api/login
- GET /api/email/verify/{id}/{hash}
- GET /api/proyectos/{id}
- GET /api/proyectos/{proyecto}/invitaciones/{invitacion}
```

#### 2. Autenticado (auth:sanctum)
```
- GET /api/user
- POST /api/logout
- POST /api/proyectos (create)
- PUT /api/proyectos/{id} (update propio)
- DELETE /api/proyectos/{id} (delete propio)
- POST /api/proyectos/{id}/categorias
```

#### 3. Propietario (ownership check)
```
- Solo el propietario puede:
  - Editar proyecto
  - Eliminar proyecto
  - Invitar miembros
  - Cambiar configuración
```

### Implementación

#### Middleware Sanctum
```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
```

#### Policy (Authorization)
```php
class ProyectoPolicy
{
    public function update(User $user, Proyecto $proyecto): bool
    {
        return $user->id === $proyecto->user_id;
    }
}
```

### Manejo de Errores de Autorización

**401 - No autenticado**
```json
{
  "message": "Unauthenticated"
}
```

**403 - No autorizado**
```json
{
  "message": "This action is unauthorized"
}
```

---

## 🛡️ Seguridad

**Última Actualización**: November 16, 2025 - Comprehensive Security Audit Applied

### 1. Autenticación & Tokens (Laravel Sanctum)

#### Encriptación de Contraseñas

Todas las contraseñas se encriptan con **bcrypt**:

```php
Hash::make($password); // Encriptar
Hash::check($password, $hash); // Verificar
```

Características:
- Algoritmo: bcrypt
- Rondas: 12 (configurable)
- Salt: generado automáticamente
- Time constant: resistente a timing attacks

#### Token Configuration

```env
# Sanctum Token Settings (in .env)
SANCTUM_TOKEN_PREFIX=controlapp_        # Detectado por GitHub secret scanning
SANCTUM_TOKEN_EXPIRATION=1440            # 24 hours - configurable
```

**Token Prefix Benefit**: `controlapp_` prefix enables automatic detection by GitHub's secret scanning if accidentally committed.

**Token Lifecycle**:
- Tokens generados al login
- Expiran después de 24 horas (configurable)
- Usuario debe hacer login nuevamente
- Tokens revocados al logout

### 2. Rate Limiting (Protección contra Brute Force)

**Configurado en `routes/api.php`**:

```php
Route::post('/login', [...])
    ->middleware('throttle:5,1')        // 5 intentos por minuto

Route::post('/forgot-password', [...])
    ->middleware('throttle:5,1')        // 5 intentos por minuto
```

| Endpoint | Límite | Ventana | Propósito |
|----------|--------|---------|----------|
| `/login` | 5 | 1 min | Prevenir brute force |
| `/register` | 5 | 1 min | Prevenir spam |
| `/forgot-password` | 5 | 1 min | Prevenir abuse |
| `/reset-password` | 5 | 1 min | Prevenir abuse |
| `/email/verification-notification` | 6 | 1 min | Prevenir spam |

**Response cuando se excede (HTTP 429)**:
```json
{
  "message": "Too Many Requests"
}
```

### 3. Input Validation (Validación de Entrada)

**FormRequest Classes** (`app/Http/Requests/`):

```php
// Antes: Inline validation (inconsistente)
$request->validate(['email' => 'required|email']);

// Ahora: FormRequest class (consistente, reutilizable)
class StoreProyectoRequest extends FormRequest {
    public function rules() {
        return [
            'email' => 'required|email:rfc,dns',  // RFC + DNS validation
            'rol' => 'required|string|in:admin,miembro',
            'moneda' => 'required|string|size:3|uppercase',
        ];
    }
}
```

**Beneficios**:
- ✅ Email validation con DNS check
- ✅ Enum validation para campos fijos
- ✅ Custom error messages
- ✅ Reutilizable across endpoints
- ✅ Centralizado para auditoría

### 4. Authorization Policies (Control de Acceso)

**Nueva: Policies Pattern** (`app/Policies/`):

```php
// Antes: Autorización dispersa
abort_if(!$user->esAdminDe($proyecto), 403);

// Ahora: Policy centralizada
if (!Gate::allows('manageMembersAndInvitations', $proyecto)) {
    abort(403, 'No permission');
}
```

**Policy Actions**:
- `view` - Leer recurso
- `create` - Crear recurso nuevo
- `update` - Modificar recurso
- `delete` - Eliminar recurso
- `manageMembersAndInvitations` - Gestionar miembros (custom)

**Ventajas**:
- ✅ Lógica de autorización centralizada
- ✅ Fácil de auditar
- ✅ Fácil de testear
- ✅ Sigue patrón Laravel estándar

### 5. CORS Security (Cross-Origin)

**Configuración mejorada** (`config/cors.php`):

```php
// ❌ Antes: TOO PERMISSIVE
'allowed_methods' => ['*'],      // Permitía cualquier método
'allowed_headers' => ['*'],      // Aceptaba cualquier header

// ✅ Ahora: SECURE
'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
'allowed_headers' => ['Authorization', 'Content-Type', 'Accept', ...],
'supports_credentials' => true,
```

**Origins Configuration** (configurable por ambiente):

```env
# Development
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://controlapp:8000

# Production  
CORS_ALLOWED_ORIGINS=https://app.yourdomain.com,https://www.yourdomain.com
```

**Beneficios**:
- ✅ Solo métodos necesarios permitidos
- ✅ Headers explícitos (sin wildcard)
- ✅ Credenciales manejadas correctamente
- ✅ Ambiente-specific configuration

### 6. Input Sanitization (Limpieza de Entrada)

**Middleware**: `SanitizeInput.php`

```php
// Automáticamente:
- HTML entity escaping: <script> → &lt;script&gt;
- Whitespace trimming: "  admin  " → "admin"
- Recursive array sanitization
```

**Protege contra**:
- XSS (Cross-Site Scripting)
- HTML injection
- Malicious JavaScript

### 7. Email Validation (Validación de Emails)

**Strict validation** en FormRequest:

```php
'email' => 'required|email:rfc,dns'  // RFC compliant + DNS check
```

**Previene**:
- ✅ Invalid email formats
- ✅ Non-existent domains
- ✅ Temporary email services (optional)

### 8. Best Practices

```php
// ✅ BIEN: Usar Policies para autorización
$this->authorize('update', $proyecto);

// ✅ BIEN: FormRequest para validación
class UpdateProyectoRequest extends FormRequest {
    public function authorize() { return true; }
    public function rules() { return [...]; }
}

// ✅ BIEN: Usar bcrypt para contraseñas
'password' => Hash::make($request->password),

// ✅ BIEN: Logging de eventos de seguridad
Log::warning('Unauthorized access attempt', ['user_id' => $user->id]);

// ✅ BIEN: Rate limiting en endpoints sensibles
Route::post('/login', [...])
    ->middleware('throttle:5,1');

// ❌ MAL: Guardar contraseñas en texto plano
// ❌ MAL: Autorización inline sin Policies
// ❌ MAL: CORS permitiendo cualquier método
// ❌ MAL: Tokens sin expiración
// ❌ MAL: No validar entrada del usuario
```

---

### 2. Tokens Sanctum

Cada token:
- Se almacena en BD con hash SHA256
- Tiene expiration configurable (por defecto, sin expiración)
- Puede revocarse en cualquier momento
- Es único y no reutilizable

```php
// Crear múltiples tokens
$token1 = $user->createToken('web');
$token2 = $user->createToken('mobile');
```

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
// Autenticación: máximo 5 intentos por minuto
Route::post('/login', ...)->middleware('throttle:5,1');

// API General: máximo 60 solicitudes por minuto
Route::middleware('throttle:60,1')->group(function () {
    // rutas
});
```

### 5. Email Verification Requirement

El email debe ser verificado antes de poder usar la API:

```php
// En login controller
if (!$user->hasVerifiedEmail()) {
    return response()->json(['message' => 'Email not verified'], 422);
}
```

### 6. Validación CSRF

Para requests desde web (no API), Laravel incluye CSRF automáticamente:

```html
<form method="POST">
    @csrf
    <!-- form -->
</form>
```

### 7. Best Practices

```php
// ✅ BIEN: Usar Policies para autorización
$this->authorize('update', $proyecto);

// ✅ BIEN: Validar entrada
$validated = $request->validate([
    'email' => 'required|email|unique:users',
    'password' => 'required|min:8|confirmed',
]);

// ✅ BIEN: Usar bcrypt para contraseñas
'password' => Hash::make($request->password),

// ✅ BIEN: Logging de eventos de seguridad
Log::warning('Failed login attempt', ['email' => $email]);

// ❌ MAL: Guardar contraseñas en texto plano
// ❌ MAL: Exponer IDs internos sin validar permisos
// ❌ MAL: Usar == en lugar de hash_equals
// ❌ MAL: Guardar tokens en localStorage sin protección
```

---

## 🔧 Troubleshooting

### Problema: "The provided credentials are invalid"

**Posibles causas:**
1. Email no existe
2. Contraseña incorrecta

**Solución:**
```bash
# Verificar que el usuario existe
docker compose exec mysql mysql -h mysql -u sail -ppassword laravel \
  -e "SELECT id, email FROM users WHERE email='test@example.com';"

# Verificar contraseña con artisan tinker
docker compose exec laravel.test php artisan tinker
>>> $user = App\Models\User::find(1);
>>> Hash::check('password', $user->password);
```

### Problema: "Email not verified"

**Posibles causas:**
1. Usuario no verificó email
2. Email verification link expiró

**Solución:**
```bash
# Reenviar email de verificación
# POST /api/email/verification-notification con token

# O verificar manualmente
docker compose exec mysql mysql -h mysql -u sail -ppassword laravel \
  -e "UPDATE users SET email_verified_at=NOW() WHERE id=1;"
```

### Problema: "Unauthenticated" en endpoints protegidos

**Posibles causas:**
1. Token no enviado en header
2. Token inválido o expirado
3. Token pertenece a otro usuario

**Solución:**
```bash
# Verificar header
curl -H "Authorization: Bearer {token}" http://localhost:8000/api/user

# Generar nuevo token
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Problema: "The email has already been taken"

**Causa:** Email ya existe en BD

**Solución:**
```bash
# Usar email único
# O consultar BD
docker compose exec mysql mysql -h mysql -u sail -ppassword laravel \
  -e "SELECT email FROM users WHERE email='test@example.com';"
```

### Problema: Hash inválido en verificación de email

**Posibles causas:**
1. Email del usuario cambió
2. Hash calculado incorrectamente
3. ID de usuario incorrecto

**Solución:**
```bash
# Calcular hash correcto
echo -n "juan@example.com" | sha1sum

# Verificar datos del usuario
docker compose exec mysql mysql -h mysql -u sail -ppassword laravel \
  -e "SELECT id, email FROM users WHERE id=1;"
```

### Problema: CORS error

**Posible causa:** Origen no permitido en `config/cors.php`

**Solución:**
```php
// config/cors.php
'allowed_origins' => ['*'], // Permitir todos (solo desarrollo)
// O específicamente
'allowed_origins' => ['http://localhost:3000'],
```

---

## 📚 Recursos Adicionales

- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)
- [Laravel Authentication](https://laravel.com/docs/authentication)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [bcrypt Documentation](https://en.wikipedia.org/wiki/Bcrypt)

---

**Última actualización**: 15 de noviembre de 2025
