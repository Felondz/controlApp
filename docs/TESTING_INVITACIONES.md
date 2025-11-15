# Testing de Invitaciones - ControlApp

Guía completa para probar el sistema de invitaciones a proyectos.

## 📋 Tabla de Contenidos

1. [Flujo General](#flujo-general)
2. [Requisitos Previos](#requisitos-previos)
3. [Testing Manual (cURL)](#testing-manual-curl)
4. [Testing con Postman](#testing-con-postman)
5. [Testing Unitario](#testing-unitario)
6. [Troubleshooting](#troubleshooting)

---

## 🔄 Flujo General

```
┌─────────────────────────────────────────────────────────────┐
│                  FLUJO DE INVITACIONES                       │
└─────────────────────────────────────────────────────────────┘

1. ADMIN se registra y crea PROYECTO
   ↓
2. ADMIN invita a NEW_USER por email
   ↓
3. Email enviado (ver en Mailpit)
   ↓
4. NEW_USER acepta invitación
   ↓
5. NEW_USER se agrega como miembro del proyecto
```

---

## ✅ Requisitos Previos

### 1. Asegurate que tu entorno esté corriendo:

```bash
# Ver estado de containers
docker compose ps

# Debería verse algo como:
# mysql       Up 2 hours
# redis       Up 2 hours
# laravel.test Up 2 hours
# mailpit     Up 2 hours
# meilisearch Up 2 hours
```

### 2. Acceso a Mailpit (para ver emails):
```
http://localhost:8025
```

### 3. Herramientas de testing:
- `curl` (línea de comandos)
- O Postman (interfaz gráfica)

---

## 🧪 Testing Manual (cURL)

### Paso 1: Registrar ADMIN (propietario del proyecto)

```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

**Response (201):**
```json
{
  "message": "Usuario registrado exitosamente. Por favor, inicia sesión."
}
```

### Paso 2: Login ADMIN (obtener token)

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "email_verified_at": "2025-11-15 12:00:00"
  },
  "token": "1|abc123def456..."
}
```

**⚠️ Guarda el token**, lo necesitarás para los próximos pasos.

```bash
# Guardar en variable (bash)
TOKEN="1|abc123def456..."
```

### Paso 3: Verificar Email del ADMIN

Normalmente harías clic en el link del email. Para testing:

```bash
# Calcular hash del email
HASH=$(echo -n "admin@example.com" | sha1sum | cut -d' ' -f1)

# Verificar email
curl http://localhost:8000/api/email/verify/1/$HASH

# Response:
# {"message":"¡Email verificado exitosamente! Ahora puedes loguearte."}
```

### Paso 4: ADMIN Login (después de verificar)

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

**Guarda el nuevo token**

### Paso 5: ADMIN Crea un PROYECTO

```bash
TOKEN="1|abc123..."

curl -X POST http://localhost:8000/api/proyectos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "nombre": "Mi Proyecto Financiero",
    "moneda": "USD"
  }'
```

**Response (201):**
```json
{
  "id": 1,
  "nombre": "Mi Proyecto Financiero",
  "moneda": "USD",
  "user_id": 1,
  "created_at": "2025-11-15 12:05:00",
  "updated_at": "2025-11-15 12:05:00"
}
```

**Guarda el proyecto ID (1)**

### Paso 6: ADMIN Invita a NEW_USER ⭐

```bash
TOKEN="1|abc123..."
PROYECTO_ID="1"

curl -X POST http://localhost:8000/api/proyectos/$PROYECTO_ID/invitaciones \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "newuser@example.com",
    "rol": "miembro"
  }'
```

**Response (201):**
```json
{
  "id": 1,
  "proyecto_id": 1,
  "email": "newuser@example.com",
  "rol": "miembro",
  "token": "abcd1234efgh5678...",
  "expires_at": "2025-11-22 12:05:00",
  "created_at": "2025-11-15 12:05:00"
}
```

**Guarda el token de invitación: `abcd1234efgh5678...`**

### ✅ Verificar que Email fue Enviado

1. Abre: http://localhost:8025
2. Deberías ver un email a `newuser@example.com`
3. Haz clic para ver el contenido
4. Busca el link de aceptación

### Paso 7: NEW_USER Acepta Invitación

El link en el email será algo como:
```
http://localhost:8000/api/proyectos/1/invitaciones/1/aceptar?token=abcd1234efgh5678
```

```bash
PROYECTO_ID="1"
INVITACION_ID="1"
TOKEN_INVITACION="abcd1234efgh5678"

curl -X POST http://localhost:8000/api/proyectos/$PROYECTO_ID/invitaciones/$INVITACION_ID/aceptar \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "newpassword123",
    "token": "'$TOKEN_INVITACION'"
  }'
```

**Response (200):**
```json
{
  "message": "Invitación aceptada exitosamente",
  "user": {
    "id": 2,
    "email": "newuser@example.com"
  },
  "token": "2|xyz789abc123..."
}
```

### ✅ Verificar que NEW_USER ahora es Miembro

```bash
TOKEN="1|abc123..." # Token del ADMIN
PROYECTO_ID="1"

curl -X GET http://localhost:8000/api/proyectos/$PROYECTO_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"
```

**Response:**
```json
{
  "id": 1,
  "nombre": "Mi Proyecto Financiero",
  "moneda": "USD",
  "miembros": [
    {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com",
      "pivot": {
        "proyecto_id": 1,
        "user_id": 1,
        "rol": "admin"
      }
    },
    {
      "id": 2,
      "name": "New User",
      "email": "newuser@example.com",
      "pivot": {
        "proyecto_id": 1,
        "user_id": 2,
        "rol": "miembro"
      }
    }
  ]
}
```

---

## 📮 Testing con Postman

### Crear Colección en Postman:

#### 1. Registrar Admin

```
POST http://localhost:8000/api/register
Headers:
  Content-Type: application/json
  Accept: application/json

Body (JSON):
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

#### 2. Login Admin

```
POST http://localhost:8000/api/login
Headers:
  Content-Type: application/json
  Accept: application/json

Body (JSON):
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**💾 Guardar token en variable Postman:**
- En la pestaña "Tests":
```javascript
pm.environment.set("admin_token", pm.response.json().token);
pm.environment.set("admin_id", pm.response.json().user.id);
```

#### 3. Crear Proyecto

```
POST http://localhost:8000/api/proyectos
Headers:
  Authorization: Bearer {{admin_token}}
  Content-Type: application/json
  Accept: application/json

Body (JSON):
{
  "nombre": "Mi Proyecto Financiero",
  "moneda": "USD"
}
```

**💾 Guardar proyecto ID:**
```javascript
pm.environment.set("proyecto_id", pm.response.json().id);
```

#### 4. Invitar a Nuevo Usuario ⭐

```
POST http://localhost:8000/api/proyectos/{{proyecto_id}}/invitaciones
Headers:
  Authorization: Bearer {{admin_token}}
  Content-Type: application/json
  Accept: application/json

Body (JSON):
{
  "email": "newuser@example.com",
  "rol": "miembro"
}
```

**💾 Guardar token de invitación:**
```javascript
pm.environment.set("invitacion_token", pm.response.json().token);
pm.environment.set("invitacion_id", pm.response.json().id);
```

#### 5. Ver Email en Mailpit

Abre: http://localhost:8025
- Busca email a `newuser@example.com`
- Copia el token de la URL de aceptación

#### 6. Aceptar Invitación

```
POST http://localhost:8000/api/proyectos/{{proyecto_id}}/invitaciones/{{invitacion_id}}/aceptar
Headers:
  Content-Type: application/json
  Accept: application/json

Body (JSON):
{
  "email": "newuser@example.com",
  "password": "newpassword123",
  "token": "{{invitacion_token}}"
}
```

---

## 🧬 Testing Unitario

### Crear archivo de test:

```bash
php artisan make:test ProyectoInvitacionTest
```

### Contenido del test (`tests/Feature/ProyectoInvitacionTest.php`):

```php
<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Proyecto;
use App\Models\Invitacion;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProyectoInvitacionTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test: Invitar a un nuevo usuario al proyecto
     */
    public function test_admin_puede_invitar_usuario()
    {
        // 1. Crear Admin
        $admin = User::factory()->create();
        $admin->markEmailAsVerified();

        // 2. Crear Proyecto
        $proyecto = Proyecto::factory()->create(['user_id' => $admin->id]);

        // 3. Admin invita a nuevo usuario
        $response = $this->actingAs($admin)->postJson(
            "/api/proyectos/{$proyecto->id}/invitaciones",
            [
                'email' => 'newuser@example.com',
                'rol' => 'miembro',
            ]
        );

        // 4. Verificar respuesta
        $response->assertStatus(201);
        $response->assertJsonStructure([
            'id',
            'proyecto_id',
            'email',
            'rol',
            'token',
        ]);

        // 5. Verificar que invitación existe en BD
        $this->assertDatabaseHas('invitaciones', [
            'proyecto_id' => $proyecto->id,
            'email' => 'newuser@example.com',
            'rol' => 'miembro',
        ]);
    }

    /**
     * Test: No admin NO puede invitar
     */
    public function test_non_admin_no_puede_invitar()
    {
        // 1. Crear usuarios
        $admin = User::factory()->create();
        $noAdmin = User::factory()->create();
        $admin->markEmailAsVerified();
        $noAdmin->markEmailAsVerified();

        // 2. Crear proyecto
        $proyecto = Proyecto::factory()->create(['user_id' => $admin->id]);

        // 3. No-admin intenta invitar
        $response = $this->actingAs($noAdmin)->postJson(
            "/api/proyectos/{$proyecto->id}/invitaciones",
            [
                'email' => 'newuser@example.com',
                'rol' => 'miembro',
            ]
        );

        // 4. Debe ser 403 (forbidden)
        $response->assertStatus(403);
    }

    /**
     * Test: No se puede invitar usuario que ya es miembro
     */
    public function test_no_puede_invitar_miembro_existente()
    {
        // 1. Crear usuarios
        $admin = User::factory()->create();
        $miembro = User::factory()->create();
        $admin->markEmailAsVerified();
        $miembro->markEmailAsVerified();

        // 2. Crear proyecto y agregar miembro
        $proyecto = Proyecto::factory()->create(['user_id' => $admin->id]);
        $proyecto->miembros()->attach($miembro);

        // 3. Admin intenta invitar usuario que ya es miembro
        $response = $this->actingAs($admin)->postJson(
            "/api/proyectos/{$proyecto->id}/invitaciones",
            [
                'email' => $miembro->email,
                'rol' => 'miembro',
            ]
        );

        // 4. Debe retornar 409 (conflict)
        $response->assertStatus(409);
        $response->assertJson([
            'message' => 'Este usuario ya es miembro del proyecto.'
        ]);
    }

    /**
     * Test: No se puede invitar mismo email dos veces
     */
    public function test_no_puede_invitar_mismo_email_dos_veces()
    {
        // 1. Crear admin
        $admin = User::factory()->create();
        $admin->markEmailAsVerified();

        // 2. Crear proyecto
        $proyecto = Proyecto::factory()->create(['user_id' => $admin->id]);

        // 3. Primera invitación
        $this->actingAs($admin)->postJson(
            "/api/proyectos/{$proyecto->id}/invitaciones",
            [
                'email' => 'newuser@example.com',
                'rol' => 'miembro',
            ]
        );

        // 4. Segunda invitación al mismo email
        $response = $this->actingAs($admin)->postJson(
            "/api/proyectos/{$proyecto->id}/invitaciones",
            [
                'email' => 'newuser@example.com',
                'rol' => 'miembro',
            ]
        );

        // 5. Debe retornar 409 (conflict)
        $response->assertStatus(409);
        $response->assertJson([
            'message' => 'Este usuario ya tiene una invitación pendiente para este proyecto.'
        ]);
    }

    /**
     * Test: Usuario puede aceptar invitación
     */
    public function test_usuario_puede_aceptar_invitacion()
    {
        // 1. Crear admin y proyecto
        $admin = User::factory()->create();
        $admin->markEmailAsVerified();
        $proyecto = Proyecto::factory()->create(['user_id' => $admin->id]);

        // 2. Crear invitación
        $invitacion = Invitacion::factory()->create([
            'proyecto_id' => $proyecto->id,
            'email' => 'newuser@example.com',
        ]);

        // 3. Aceptar invitación
        $response = $this->postJson(
            "/api/proyectos/{$proyecto->id}/invitaciones/{$invitacion->id}/aceptar",
            [
                'email' => 'newuser@example.com',
                'password' => 'password123',
                'token' => $invitacion->token,
            ]
        );

        // 4. Verificar respuesta
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
            'user' => ['id', 'email'],
            'token',
        ]);

        // 5. Verificar que usuario fue creado
        $this->assertDatabaseHas('users', [
            'email' => 'newuser@example.com',
        ]);

        // 6. Verificar que usuario es miembro del proyecto
        $newUser = User::where('email', 'newuser@example.com')->first();
        $this->assertTrue($proyecto->miembros()->where('user_id', $newUser->id)->exists());
    }
}
```

### Ejecutar tests:

```bash
# Todos los tests
docker compose exec laravel.test php artisan test

# Solo invitaciones
docker compose exec laravel.test php artisan test --filter=ProyectoInvitacion

# Con output verbose
docker compose exec laravel.test php artisan test --verbose
```

---

## 🔧 Troubleshooting

### ❌ Error: "Solo los administradores pueden enviar invitaciones"

**Causa:** El usuario autenticado no es propietario del proyecto

**Solución:**
1. Verifica que usas el token del user que creó el proyecto
2. O agrega el usuario como admin del proyecto primero

### ❌ Error: "Este usuario ya es miembro del proyecto"

**Causa:** El usuario ya está agregado al proyecto

**Solución:**
1. Usa un email diferente
2. O elimina el usuario del proyecto primero

### ❌ Error: "Este usuario ya tiene una invitación pendiente"

**Causa:** Hay una invitación activa para ese email

**Solución:**
1. Cancela la invitación anterior: `DELETE /api/proyectos/{id}/invitaciones/{invitacion_id}`
2. Luego envía la nueva invitación

### ❌ Email no se recibe

**Causa:** Mailtrap/Mailpit no está configurado

**Solución:**
1. Verifica que Mailpit esté corriendo: http://localhost:8025
2. Revisa `.env`:
   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=sandbox.smtp.mailtrap.io
   MAIL_PORT=2525
   MAIL_USERNAME=tu_username
   MAIL_PASSWORD=tu_password
   ```
3. O usa Mailpit local (debería estar por defecto)

### ❌ "Invalid signature" al aceptar invitación

**Causa:** Token inválido o expirado

**Solución:**
1. Copia el token correcto del email
2. Verifica que no haya expirado (7 días)
3. Reinvita al usuario

---

## 📊 Comandos Útiles

### Ver todas las invitaciones en BD:

```bash
docker compose exec mysql mysql -h mysql -u sail -ppassword laravel \
  -e "SELECT * FROM invitaciones;"
```

### Ver miembros de un proyecto:

```bash
docker compose exec mysql mysql -h mysql -u sail -ppassword laravel \
  -e "SELECT * FROM proyecto_user WHERE proyecto_id=1;"
```

### Limpiar invitaciones expiradas:

```bash
docker compose exec laravel.test php artisan invitaciones:limpiar-expiradas
```

---

## ✅ Checklist de Testing

- [ ] Registrar admin
- [ ] Verificar email del admin
- [ ] Login admin
- [ ] Crear proyecto
- [ ] Invitar nuevo usuario
- [ ] Ver email en Mailpit
- [ ] Aceptar invitación
- [ ] Verificar que usuario es miembro
- [ ] Verificar que no puede invitar el mismo email dos veces
- [ ] Verificar que non-admin no puede invitar
- [ ] Correr tests unitarios

---

**Última actualización**: 15 de noviembre de 2025
