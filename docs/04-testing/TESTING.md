# 🧪 Guía de Testing - ControlApp

## Índice
1. [Introducción](#introducción)
2. [Configuración](#configuración)
3. [Tipos de Tests](#tipos-de-tests)
4. [Ejecutar Tests](#ejecutar-tests)
5. [Escribir Tests](#escribir-tests)
6. [CI/CD](#cicd)
7. [Buenas Prácticas](#buenas-prácticas)

---

## Introducción

Este proyecto utiliza **PHPUnit** como framework de testing. Los tests se organizan en:

- **Feature Tests** (`tests/Feature/`) - Pruebas de endpoints/APIs completas
- **Unit Tests** (`tests/Unit/`) - Pruebas de lógica individual

### ¿Por qué tests?

| Aspecto | Beneficio |
|--------|-----------|
| **Confianza** | Cambios sin miedo a romper funcionalidad |
| **Documentación** | Los tests son documentación viva del código |
| **Bugs temprano** | Se encuentran antes de producción |
| **Refactoring** | Puedes mejorar código con seguridad |
| **CI/CD** | Automatización confiable de despliegues |

---

## Configuración

### ⚠️ IMPORTANTE: Ejecutar Tests Dentro de Docker

**PROBLEMA IDENTIFICADO (Nov 16, 2025)**: Si ejecutas los tests desde el host (`php artisan test`), la conexión a la base de datos MySQL en Docker se queda **colgada indefinidamente** (timeout >15 min).

**SOLUCIÓN**: Siempre ejecuta los tests **DENTRO del contenedor Docker**:

```bash
# ❌ NO HACER ESTO (se cuelga)
php artisan test

# ✅ HACER ESTO (correcto)
docker compose exec -T laravel.test php artisan test --testdox
```

**Por qué sucede:**
- El contenedor MySQL tiene hostname `mysql` resoluble solo dentro de Docker
- Desde el host, no se puede resolver ese hostname
- Laravel espera la conexión indefinidamente

**Verificación rápida:**
```bash
# Ver contenedores corriendo
docker compose ps

# Verificar que laravel.test esté running
# Status debe ser "Up"
```

---

### phpunit.xml

Ya está configurado en el proyecto:

```xml
<env name="DB_DATABASE" value="testing"/>
<env name="MAIL_MAILER" value="array"/>
<env name="APP_ENV" value="testing"/>
```

Esto significa:
- BD separada para tests (`testing`)
- Emails no se envían realmente (se almacenan en memoria)
- Ambiente de testing aislado

### Factories

Las factories crean datos fake para tests:

```php
// database/factories/UserFactory.php
User::factory()->create(['email' => 'test@example.com']);
```

---

## Tipos de Tests

### 1. Feature Tests (Recomendado para APIs)

Prueban **endpoints completos** con toda la lógica:

```php
public function test_admin_can_send_invitation(): void
{
    $response = $this->actingAs($this->admin)
        ->postJson('/api/proyectos/' . $this->proyecto->id . '/invitaciones', [
            'email' => 'newuser@example.com',
            'rol' => 'miembro',
        ]);

    $response->assertStatus(201)
        ->assertJsonStructure(['id', 'token', 'email']);
}
```

**Ventajas:**
- Prueban la integración completa
- Incluyen autenticación, validación, BD
- Muy realistas

### 2. Unit Tests

Prueban **métodos individuales**:

```php
public function test_user_can_check_project_membership(): void
{
    $user = User::factory()->create();
    $proyecto = Proyecto::factory()->create();
    $user->proyectos()->attach($proyecto->id);

    $this->assertTrue($user->esMiembroDe($proyecto));
}
```

**Ventajas:**
- Rápidos
- Enfocados en una responsabilidad
- Fáciles de debuguear

---

## Ejecutar Tests

### ✅ Opción Correcta: Dentro de Docker (REQUIRED)

```bash
# 📍 SIEMPRE USAR ESTO - Todos los tests
docker compose exec -T laravel.test php artisan test --testdox

# 📍 Solo Feature tests (la mayoría de tests)
docker compose exec -T laravel.test php artisan test tests/Feature --testdox

# 📍 Archivo específico (para debugging)
docker compose exec -T laravel.test php artisan test tests/Feature/InvitacionesApiTest.php --testdox

# 📍 Con cobertura de código (genera reporte)
docker compose exec -T laravel.test php artisan test --coverage
```

**Output esperado:**
```
Tests: 131, Assertions: 342
OK (131 tests, 342 assertions)
```

### ❌ EVITAR: Ejecutar Localmente (HANG/TIMEOUT)

```bash
# ❌ NO HAGAS ESTO - Se cuelga por 15+ minutos
php artisan test

# ❌ NO HAGAS ESTO - Mismo problema
php artisan test --testdox
```

**Por qué se cuelga:**
- Docker Compose expone MySQL en hostname `mysql`
- Desde el host, `mysql` no es resolvible
- Laravel se queda esperando conexión indefinidamente
- Timeout ocurre después de 15+ minutos

**Solución rápida si se cuelga:**
```bash
# Cancelar con Ctrl+C
# Luego ejecutar correctamente dentro de Docker
docker compose exec -T laravel.test php artisan test --testdox
```

### Script Helper

Usamos el script `run-tests.sh` para automatizar:

```bash
bash run-tests.sh
```

---

## Escribir Tests

### Template de Feature Test

```php
<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MyFeatureTest extends TestCase
{
    use RefreshDatabase;  // ← Limpia BD entre tests

    protected function setUp(): void
    {
        parent::setUp();
        // Preparar datos comunes
        $this->user = User::factory()->create();
    }

    /**
     * Test 1: Descripción clara
     */
    public function test_something_works(): void
    {
        $response = $this->actingAs($this->user)
            ->getJson('/api/endpoint');

        $response->assertStatus(200)
            ->assertJsonStructure(['id', 'name']);
    }

    /**
     * Test 2: Caso de error
     */
    public function test_unauthenticated_user_cannot_access(): void
    {
        $response = $this->getJson('/api/endpoint');

        $response->assertStatus(401); // Unauthorized
    }
}
```

### Aserciones Comunes

```php
// HTTP
$response->assertStatus(200);
$response->assertOk();
$response->assertUnauthorized();  // 401
$response->assertForbidden();     // 403
$response->assertNotFound();      // 404

// JSON
$response->assertJson(['id' => 1]);
$response->assertJsonStructure(['id', 'name', 'email']);
$response->assertJsonCount(5);

// BD
$this->assertDatabaseHas('users', ['email' => 'test@example.com']);
$this->assertDatabaseMissing('users', ['email' => 'deleted@example.com']);
```

---

## CI/CD

### GitHub Actions Workflow

El archivo `.github/workflows/tests.yml` ejecuta automáticamente:

1. **En cada push a main/develop**
2. **En cada Pull Request**

**Procesos:**
- ✅ Instala dependencias
- ✅ Configura BD de testing
- ✅ Ejecuta migraciones
- ✅ Corre todos los tests
- ✅ Verifica calidad de código (PHPStan, PHPCS)

**Estado en README:**

```markdown
[![Tests](https://github.com/Felondz/controlApp/actions/workflows/tests.yml/badge.svg)](https://github.com/Felondz/controlApp/actions)
```

---

## Buenas Prácticas

### ✅ DO's

```php
// ✅ Nombres descriptivos
public function test_admin_can_send_invitation_to_new_user(): void

// ✅ AAA Pattern (Arrange, Act, Assert)
public function test_something(): void
{
    // ARRANGE
    $user = User::factory()->create();
    
    // ACT
    $response = $this->actingAs($user)->postJson('/api/endpoint', []);
    
    // ASSERT
    $response->assertStatus(201);
}

// ✅ RefreshDatabase para tests aislados
use RefreshDatabase;

// ✅ Factories para datos consistentes
$user = User::factory()->create();

// ✅ Múltiples aserciones relacionadas
$response->assertStatus(201)
    ->assertJsonStructure(['id', 'token'])
    ->assertJsonPath('rol', 'miembro');
```

### ❌ DON'Ts

```php
// ❌ Nombres vagos
public function test_it_works(): void

// ❌ BD global en tests (sin RefreshDatabase)
// → Los tests interfieren entre sí

// ❌ Crear datos manualmente
User::create(['email' => 'test@example.com']); // ← NO

// ❌ Múltiples responsabilidades por test
public function test_everything(): void {
    // Crea usuario, proyecto, invitación, acepta...
}

// ❌ Assertions débiles
$this->assertTrue($response->ok()); // ← Muy vago
```

### Organización de Tests

```
tests/
├── Feature/
│   ├── InvitacionesApiTest.php     ← Tests de invitaciones
│   ├── ProyectosApiTest.php
│   └── AuthApiTest.php
├── Unit/
│   ├── Models/
│   │   ├── UserTest.php
│   │   └── ProyectoTest.php
│   └── Services/
│       └── InvitacionServiceTest.php
└── TestCase.php                     ← Base para todos los tests
```

---

## Cobertura de Tests

Para ver qué porcentaje del código está cubierto:

```bash
docker compose exec -T laravel.test php artisan test --coverage

# Generar reporte HTML
docker compose exec -T laravel.test php artisan test --coverage --coverage-html storage/coverage
```

---

## Debugging Tests

### Ver salida detallada

```bash
# Verbose
php artisan test --verbose

# Con información de BD
php artisan test --verbose --debug
```

### Pausar en un punto

```php
public function test_something(): void
{
    // ... código ...
    
    $this->dump($variable);  // Imprime y continúa
    $this->dd($variable);    // Imprime y detiene
}
```

### Ejecutar solo un test

```php
// Usar "only" para ejecutar un test específico
public function test_something(): void {
    $this->only();  // Solo este test
}

// En CLI
php artisan test --filter=test_admin_can_send_invitation
```

---

## Recursos

- **Laravel Testing**: https://laravel.com/docs/testing
- **PHPUnit**: https://phpunit.de/documentation.html
- **Factories**: https://laravel.com/docs/eloquent-factories

---

## Próximos Pasos

1. ✅ Tests de invitaciones (DONE)
2. 📝 Tests de autenticación
3. 📝 Tests de proyectos
4. 📝 Tests de transacciones
5. 📝 Tests de categorías
6. 🔄 Mejorar cobertura a 80%+

---

**¡Feliz testing! 🚀**
