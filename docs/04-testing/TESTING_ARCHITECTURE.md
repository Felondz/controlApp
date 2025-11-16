# 🧪 Arquitectura de Testing - ControlApp

**Documentación técnica completa de la estrategia de testing implementada**

> Este documento explica cómo funciona el sistema de testing en ControlApp, por qué se eligieron estos patrones, y cómo mantenerlos y extenderlos.

---

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Estrategia de Aislamiento](#estrategia-de-aislamiento)
3. [Estructura de Tests](#estructura-de-tests)
4. [Patterns y Convenciones](#patterns-y-convenciones)
5. [Ejecutar Tests](#ejecutar-tests)
6. [Agregar Nuevos Tests](#agregar-nuevos-tests)
7. [Troubleshooting](#troubleshooting)
8. [Métricas y Monitoreo](#métricas-y-monitoreo)

---

## 🎯 Visión General

### Objetivo Principal

> **Garantizar que NUNCA un test afecte datos de producción**

### 🔴 IMPORTANTE: ¿SQLite o MySQL?

**RESPUESTA RÁPIDA: Usamos MYSQL, NO SQLite**

```
.env.testing:
DB_CONNECTION=mysql    ← ✅ Esto es lo que usamos
DB_DATABASE=laravel    ← Misma BD que desarrollo
DB_HOST=mysql          ← Container MySQL en Docker
```

**¿Por qué MySQL y no SQLite?**
- ✅ Realista: tests usan misma BD que producción
- ✅ Confiable: si pasa en MySQL local, pasará en producción
- ✅ Compatible: todas las features de MySQL están disponibles
- ❌ SQLite fallaría: tiene limitaciones que MySQL no tiene

**¿Cómo es seguro si usa misma BD?**
- RefreshDatabase reinicia BD completamente entre tests
- Cada test comienza con BD limpia
- Después de cada test, cambios se revierten
- Producción está protegida por ser distinta máquina

---

### Logro Actual

```
✅ 131 tests pasando
✅ 342 assertions
✅ 3.5 segundos de ejecución
✅ 100% aislamiento de datos
✅ Base de datos de producción protegida (es otra máquina)
✅ Usa MySQL real (no SQLite) = tests realistas
```

### Componentes Principales

```
┌────────────────────────────────────────────────────────┐
│                   Testing Architecture                 │
├────────────────────────────────────────────────────────┤
│                                                        │
│  1. RefreshDatabase Trait                              │
│     └─ Resetea BD completa antes de cada test          │
│                                                        │
│  2. .env.testing Configuration                         │
│     └─ Apunta a BD de testing (aislada)                │
│                                                        │
│  3. Factories para Generación de Datos                 │
│     └─ Datos realistas y consistentes                  │
│                                                        │
│  4. Feature Tests con API Calls                        │
│     └─ Prueba comportamiento real (HTTP)               │
│                                                        │
│  5. Mailpit para Captura de Emails                     │
│     └─ Valida emails sin enviarlos realmente           │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 🔐 Estrategia de Aislamiento

### Problema Original

Necesitábamos ejecutar tests sin:
- ❌ Crear usuarios reales en producción
- ❌ Enviar emails a direcciones reales
- ❌ Crear datos que contaminan la BD
- ❌ Tener permisos MySQL complicados

### Soluciones Evaluadas

#### Opción 1: Base de Datos Separada `laravel_test`

```
Ventajas:
✅ Completamente aislada
✅ Nunca toca producción

Desventajas:
❌ Requiere permisos MySQL especiales
❌ Necesita crear BD manualmente
❌ Procesos Sail a veces sin acceso
❌ Complejidad innecesaria
```

**Resultado**: ❌ Descartada por problemas de permisos

#### Opción 2: SQLite In-Memory (DESCARTADA)

```
Ventajas:
✅ Muy rápido
✅ Automático

Desventajas:
❌ No es realista (SQLite ≠ MySQL)
❌ Features de MySQL no funcionan en SQLite
❌ Errores en producción no se capturan
❌ Tests pasen pero falle en producción con MySQL real
```

**Resultado**: ❌ Descartada por falta de realismo

**Nota**: Si alguien lee "SQLite" en los docs, es una opción que fue evaluada y rechazada.
La decisión final es usar MySQL (opción 3).

#### Opción 3: RefreshDatabase con BD Compartida ✅ ELEGIDA

```
Ventajas:
✅ Usa MySQL (realista)
✅ Completamente aislada entre tests
✅ Sin permisos especiales
✅ Automático con RefreshDatabase
✅ Rápido (solo trunca tablas)

Desventajas:
- Ninguna significativa
```

**Resultado**: ✅ Seleccionada como solución definitiva

---

### Cómo Funciona RefreshDatabase

#### Paso 1: Antes del Test

```
1. Comienza transacción
2. Ejecuta migraciones
   └─ Crea todas las tablas
3. Corre el test
```

#### Paso 2: Durante el Test

```
1. Test crea datos (User, Proyecto, etc.)
2. Test ejecuta acciones (POST, PUT, DELETE)
3. Test valida resultados
4. Base de datos tiene datos del test
```

#### Paso 3: Después del Test

```
1. Revierte transacción
   └─ TODOS los cambios se deshacer
2. Base de datos vuelve al estado limpio
3. Próximo test comienza con BD limpia
```

#### Flujo Visual

```
BD Limpia
    │
    ├─ Test 1
    │  ├─ Crear usuarios
    │  ├─ Validar
    │  └─ [Rollback]
    │
BD Limpia
    │
    ├─ Test 2
    │  ├─ Crear proyectos
    │  ├─ Validar
    │  └─ [Rollback]
    │
BD Limpia
    │
    ├─ Test 3
    │  └─ ...
```

**Garantía**: Ningún cambio persiste en la BD real

---

### Configuración de .env.testing

```env
# .env.testing

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=laravel          # ← Usa BD compartida
DB_USERNAME=sail
DB_PASSWORD=password

# Importante: Misma BD que desarrollo, pero RefreshDatabase
# asegura aislamiento completo
```

**Pregunta**: ¿Por qué misma BD que desarrollo?
**Respuesta**: Porque RefreshDatabase las limpia antes de cada test. Es más realista (usa MySQL) y no requiere crear BD adicionales.

---

## 📁 Estructura de Tests

### Directorio de Tests

```
tests/
├── TestCase.php              ← Clase base
├── Unit/                     ← Tests unitarios
│   └── ExampleTest.php
├── Feature/                  ← Tests de features (API, workflows)
│   ├── AuthenticationApiTest.php
│   ├── CategoriasApiTest.php
│   ├── CuentasApiTest.php
│   ├── EmailVerificationApiTest.php
│   ├── ExampleTest.php
│   ├── FinanzasPersonalesTest.php
│   ├── InvitacionesApiTest.php
│   ├── PasswordResetApiTest.php
│   ├── PasswordResetMailTest.php
│   ├── ProyectoMiembrosApiTest.php
│   ├── ProyectosApiTest.php
│   ├── TransaccionesApiTest.php
│   └── VisualEmailTestsInMailpitTest.php
└── Pest.php                  ← Configuración (si usas Pest)
```

### Tipos de Tests

#### 🧪 Unit Tests

```php
// test_math_function.php
public function test_suma_dos_numeros()
{
    $resultado = suma(2, 3);
    $this->assertEquals(5, $resultado);
}
```

**Cuándo usar**: Funciones puras, helpers, lógica simple

**En ControlApp**: Usamos pocas unit tests (la mayoría son feature tests)

#### 🧪 Feature Tests

```php
// CuentasApiTest.php
public function test_admin_puede_crear_cuenta()
{
    $admin = User::factory()->create();
    $proyecto = Proyecto::factory()->create();
    $proyecto->miembros()->attach($admin, ['rol' => 'admin']);
    
    $response = $this->actingAs($admin)->postJson(
        '/api/proyectos/' . $proyecto->id . '/cuentas',
        ['nombre' => 'Banco Principal', ...]
    );
    
    $response->assertStatus(201);
}
```

**Cuándo usar**: APIs, workflows complejos, integración

**En ControlApp**: 131 feature tests (la mayoría de la suite)

---

## 🎭 Patterns y Convenciones

### Pattern 1: Estructura de Test Feature

```php
<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Proyecto;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MiFeatureTest extends TestCase
{
    use RefreshDatabase;  // ← OBLIGATORIO para aislamiento
    
    /**
     * Test: Descripción clara de qué se prueba
     */
    public function test_descripcion_clara_en_snake_case()
    {
        // ARRANGE: Preparar datos
        $usuario = User::factory()->create();
        $proyecto = Proyecto::factory()->create();
        
        // ACT: Ejecutar acción
        $response = $this->actingAs($usuario)->getJson(
            '/api/proyectos/' . $proyecto->id
        );
        
        // ASSERT: Validar resultado
        $response->assertStatus(200);
        $response->assertJsonStructure(['id', 'nombre']);
    }
}
```

**Convenciones**:
- ✅ `use RefreshDatabase;` siempre
- ✅ Nombre de método: `test_` + descripción
- ✅ Estructura: ARRANGE → ACT → ASSERT
- ✅ Máximo 20 líneas por test (si es más largo, dividir)

### Pattern 2: Factories para Datos Realistas

```php
<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CuentaFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nombre' => fake()->name(),
            'banco' => fake()->randomElement(['Banco A', 'Banco B']),
            'balance' => fake()->numberBetween(0, 1000000),
            'tipo' => fake()->randomElement(['banco', 'efectivo']),
            'estado' => 'activa',
            'propietario_id' => null,      // Se asigna en el test
            'propietario_type' => null,    // Se asigna en el test
        ];
    }
}
```

**Uso**:

```php
// Crear cuenta con datos de factory
$cuenta = Cuenta::factory()->create([
    'propietario_id' => $proyecto->id,
    'propietario_type' => 'proyecto',  // ← MorphMap
]);

// Factory sobrescribe 'nombre' pero usa valor por defecto para otros
$cuenta = Cuenta::factory()->create(['nombre' => 'Mi Banco']);
```

**Regla**: Si creas datos en un test, usa factory en lugar de array directo

### Pattern 3: Asserts Comunes

```php
// Respuesta HTTP
$response->assertStatus(200);
$response->assertStatus(201);      // Created
$response->assertStatus(204);      // No Content
$response->assertStatus(403);      // Forbidden
$response->assertStatus(404);      // Not Found

// Estructura JSON
$response->assertJsonStructure(['id', 'nombre', 'created_at']);
$response->assertJsonCount(3);     // Array con 3 elementos

// Datos específicos
$response->assertJson(['nombre' => 'Test']);

// Base de datos
$this->assertDatabaseHas('usuarios', ['email' => 'test@example.com']);
$this->assertDatabaseMissing('usuarios', ['id' => 999]);

// Autenticación
$response->assertUnauthorized();   // 401
$response->assertForbidden();      // 403

// Redirecciones
$response->assertRedirect('/home');
```

### Pattern 4: Helpers Reutilizables

```php
// En FinanzasPersonalesTest.php
private function getPersonalProject(): Proyecto
{
    // Obtiene proyecto personal del usuario autenticado
    // Consulta fresca desde BD (después de RefreshDatabase)
    return $this->user->proyectos()->first();
}

// En test
public function test_algo_con_proyecto_personal()
{
    $this->actingAs($this->user);
    $proyecto = $this->getPersonalProject();
    // Garantizado que $proyecto es fresh desde BD
}
```

**Razón**: Después de RefreshDatabase, objetos en memoria son stale. Queries frescas garantizan datos correctos.

---

## ▶️ Ejecutar Tests

### Ejecutar Todos los Tests

```bash
./vendor/bin/sail artisan test --env=testing
```

**Output esperado**:
```
Tests:    131 passed (342 assertions)
Duration: 3.50s
```

### Ejecutar Tests de un Archivo

```bash
./vendor/bin/sail artisan test tests/Feature/CuentasApiTest.php --env=testing
```

### Ejecutar un Test Específico

```bash
./vendor/bin/sail artisan test tests/Feature/CuentasApiTest.php \
  --filter "admin_puede_crear_cuenta" --env=testing
```

### Ejecutar con Coverage

```bash
./vendor/bin/sail artisan test --env=testing --coverage
```

**Output**: Genera reporte de líneas de código cubiertas

### Ejecutar en Paralelo (más rápido)

```bash
./vendor/bin/sail artisan test --env=testing --parallel
```

**Nota**: Asegúrate de que los tests sean independientes (RefreshDatabase lo asegura)

---

## ✍️ Agregar Nuevos Tests

### Step 1: Crear Archivo de Test

```bash
./vendor/bin/sail artisan make:test MiFeatureTest
```

Genera `tests/Feature/MiFeatureTest.php`

### Step 2: Agregar Trait RefreshDatabase

```php
<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MiFeatureTest extends TestCase
{
    use RefreshDatabase;  // ← OBLIGATORIO
    
    // Tests aquí
}
```

### Step 3: Escribir Test con Estructura AAA

```php
public function test_usuario_puede_hacer_algo()
{
    // ARRANGE: Preparar datos
    $user = User::factory()->create();
    $data = ['nombre' => 'Test'];
    
    // ACT: Ejecutar acción
    $response = $this->actingAs($user)->postJson(
        '/api/endpoint',
        $data
    );
    
    // ASSERT: Validar
    $response->assertStatus(201);
    $this->assertDatabaseHas('tabla', $data);
}
```

### Step 4: Ejecutar Test

```bash
./vendor/bin/sail artisan test tests/Feature/MiFeatureTest.php --env=testing
```

### Step 5: Iteración

Si falla:
1. Leer error
2. Ajustar test o código
3. Volver a ejecutar
4. Repetir

---

## 📺 Captura de Emails (Mailpit)

### Cómo Funciona

```
┌─────────────────────────────┐
│  Tu Aplicación              │
│  (envía email via SMTP)      │
└─────────────────────────────┘
              │
              ▼
┌─────────────────────────────┐
│  Mailpit (en localhost:1025)│
│  (captura sin enviar)       │
└─────────────────────────────┘
              │
              ▼
┌─────────────────────────────┐
│  Web UI (localhost:8025)    │
│  Ver emails capturados      │
└─────────────────────────────┘
```

### Configuración .env.testing

```env
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_FROM_ADDRESS=no-reply@controlapp.com
```

### Test de Email

```php
public function test_password_reset_email_se_envia()
{
    Mail::fake();  // Captura emails
    
    $user = User::factory()->create();
    
    // Solicitar reset
    $this->postJson('/api/forgot-password', [
        'email' => $user->email
    ]);
    
    // Validar que se envió
    Mail::assertSent(PasswordResetMail::class);
}
```

### Ver Emails Capturados

```bash
# Abre navegador en:
http://localhost:8025

# Verás todos los emails enviados durante tests
```

---

## 🐛 Troubleshooting

### Problema: "SQLSTATE[HY000]: General error: 1030"

**Causa**: A veces RefreshDatabase deja BD en estado inconsistente

**Solución**:
```bash
./vendor/bin/sail artisan migrate:fresh
./vendor/bin/sail artisan test --env=testing
```

---

### Problema: Tests Lentos (>10 segundos)

**Causa**: Algún test espera o hace queries innecesarias

**Solución**:
```bash
./vendor/bin/sail artisan test --env=testing --profile

# Mostrará qué tests son más lentos
```

---

### Problema: "RefreshDatabase not resetting"

**Causa**: Trait no está incluido

**Solución**: Agregar en test:
```php
use RefreshDatabase;
```

---

### Problema: "Stale data after RefreshDatabase"

**Causa**: Objetos en memoria no se refrescan

**Solución**: Hacer query fresca:
```php
// ❌ MAL: $usuario está stale
$usuario->refresh();
$resultado = $usuario->email;

// ✅ BIEN: Query fresca
$usuario = User::find($usuario->id);
$resultado = $usuario->email;
```

---

### Problema: "UNIQUE constraint fails"

**Causa**: Datos duplicados entre tests (emails, códigos)

**Solución**: Usar `uniqid()` en factories o tests:
```php
User::factory()->create([
    'email' => 'test-' . uniqid() . '@example.com'
]);
```

---

## 📊 Métricas y Monitoreo

### Tests Passing Rate

```
Ideal:  100% (131/131 tests)
Bueno:  >95% (125/131 tests)
Alerta: <95% (algo está roto)
```

### Tiempo de Ejecución

```
Ideal:  <3 segundos (actualmente 3.50s)
Bueno:  3-5 segundos
Alerta: >10 segundos
```

### Coverage (Cobertura)

```
Ideal:  >80% del código
Bueno:  >70%
Alerta: <70%
```

**Calcular coverage**:
```bash
./vendor/bin/sail artisan test --env=testing --coverage
```

### Checklist Semanal

- [ ] Todos los tests pasan
- [ ] Tiempo < 5 segundos
- [ ] Coverage > 70%
- [ ] No hay warns o deprecations
- [ ] Documentación está actualizada

---

## 🔍 Análisis Profundo de Cambios Recientes

### Bug Fix: MorphType en CuentaController (16-11-25)

**Que pasó**:
```
2 tests fallaban: 404 en lugar de 200/204
```

**Causa Raíz**:
```
CuentaController verificaba: 'App\Models\Proyecto'
Base de datos guardaba: 'proyecto' (del MorphMap)
No coincidían → 404 → Bug
```

**Cómo los Tests lo Detectaron**:
```php
// Test ejecutaba:
$response = $this->actingAs($admin)->putJson(
    '/api/proyectos/' . $proyecto->id . '/cuentas/' . $cuenta->id,
    ['nombre' => 'Actualizado']
);

// Controlador verificaba:
if ($cuenta->propietario_type !== 'App\Models\Proyecto') {
    abort(404);  // ← AQUÍ fallaba porque era 'proyecto'
}
```

**Lección**: Tests son canarios - detectan bugs en código principal

---

## 🎓 Mejores Prácticas

### ✅ Hacer

- ✅ Use `RefreshDatabase` en todos los tests
- ✅ Nombre tests descriptivamente
- ✅ Use factories para datos
- ✅ Valide múltiples cosas por caso (pero lógicamente relacionadas)
- ✅ Mantenga tests pequeños (<20 líneas)
- ✅ Execute tests frecuentemente durante desarrollo
- ✅ Documente por qué se testea algo (no solo qué)

### ❌ No Hacer

- ❌ Omitir `RefreshDatabase`
- ❌ Tener estado compartido entre tests
- ❌ Directamente insertar datos en SQL (usar factories)
- ❌ Tests que dependan del orden (RefreshDatabase lo previene)
- ❌ Validaciones imposibles de pasar
- ❌ Ignorar failures de tests
- ❌ Commit código si tests no pasan

---

## 📈 Escalabilidad

### Cómo Crecer sin Perder Tests

1. **Al Agregar Nuevo Módulo**:
   - Crear `MiModuloTest.php`
   - Agregar `use RefreshDatabase`
   - Escribir tests primero (TDD)
   - Luego código que pase tests

2. **Al Modificar Existente**:
   - Actualizar tests relacionados
   - Asegurar que tests sigan pasando
   - Si agregan funcionalidad, nuevos tests

3. **Mantener Velocidad**:
   - Tests actuales: 3.50s
   - Objetivo: mantener bajo 10s
   - Si crece >10s: considerar `--parallel`

---

## 🚀 Resumen

### Lo Que Tenemos

```
✅ 131 tests
✅ 342 assertions
✅ RefreshDatabase para aislamiento
✅ Factories para datos realistas
✅ Mailpit para emails
✅ 100% protección de producción
✅ 3.50s de ejecución
```

### Lo Que Permite

```
✅ Ejecutar tests sin miedo
✅ Cambiar código con confianza
✅ Detectar bugs automáticamente
✅ Documentar comportamiento esperado
✅ Ondear nuevas features seguramente
```

### Cómo Mantenerlo

```
✅ Agregar tests para features nuevas
✅ Ejecutar tests antes de commit
✅ Actualizar tests cuando cambia código
✅ Documentar decisiones de testing
✅ Revisar coverage regularmente
```

---

## 📞 Referencias

- [Laravel Testing Docs](https://laravel.com/docs/testing)
- [PHPUnit Docs](https://phpunit.de/documentation.html)
- [Mailpit Docs](https://mailpit.io/)
- [Factories Documentation](https://laravel.com/docs/eloquent-factories)

---

**Versión**: 1.0.0
**Última Actualización**: 16 de noviembre de 2025
**Mantenedor**: Equipo de Desarrollo ControlApp

