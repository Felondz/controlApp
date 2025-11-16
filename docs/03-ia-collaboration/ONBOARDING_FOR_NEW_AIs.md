# 🚀 ONBOARDING PARA NUEVAS IAs

**Guía rápida para que cualquier IA entienda el proyecto ControlApp en 5-15 minutos**

> Este documento es para copiar y pegar en el chat de la nueva IA (ChatGPT, Claude, Copilot, etc.)

---

## 📋 TABLA DE CONTENIDOS

1. [Introducción (Lee primero)](#introducción)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Normas de Comportamiento](#normas-de-comportamiento)
5. [Base de Datos](#base-de-datos)
6. [Testing](#testing)
7. [Comandos Esenciales](#comandos-esenciales)
8. [Ejemplos de Trabajos Anteriores](#ejemplos-de-trabajos-anteriores)
9. [Checklist de Validación](#checklist-de-validación)
10. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## 🎯 Introducción

### ¿Qué es ControlApp?

```
Plataforma de gestión de proyectos colaborativos
├─ Usuarios pueden crear proyectos
├─ Invitar miembros a proyectos
├─ Sistema de roles y permisos
│
└─ FEATURE 1: Gestión Financiera (implementada)
   ├─ Gestionar cuentas (Bancaria, Efectivo, etc.)
   ├─ Registrar transacciones
   ├─ Categorías de transacciones
   └─ Visualizar reportes financieros

(Próximas features: tareas, documentos, comunicación, etc.)
```

### Estado Actual del Proyecto

```
✅ 131 tests pasando (100%)
✅ 342 assertions validando
✅ 3.55 segundos de ejecución
✅ Base de datos aislada en testing
✅ Emails integrados (Mailpit)
✅ Autenticación con Sanctum (JWT)
✅ 100% documentado
```

### Tu Rol Como IA

```
Debes:
✅ Seguir normas claras (AI_GUIDELINES.md)
✅ No tocar producción
✅ Siempre ejecutar tests antes de cambios
✅ Documentar cambios
✅ Dar opciones antes de codear
✅ Pedir confirmación antes de comandos

NO debes:
❌ Tocar BD de producción
❌ Borrar o modificar tests sin motivo
❌ Hacer cambios sin validar con tests
❌ Modificar .env (solo .env.testing)
❌ Ejecutar comandos sin confirmación del usuario
```

---

## 💻 Stack Tecnológico

### Backend

```
Laravel 11.x
├─ Framework PHP moderno
├─ MVC architecture
├─ Eloquent ORM
├─ Sanctum authentication (JWT tokens)
└─ Sail (Docker environment)
```

### Base de Datos

```
MySQL 8.0.32
├─ Producción: Contenedor Docker principal
├─ Testing: Misma BD con RefreshDatabase (aislamiento)
└─ Desarrollo: Local via Sail
```

### Testing

```
PHPUnit 11.x
├─ 131 tests total
├─ RefreshDatabase trait (aislamiento perfecto)
├─ Factories para datos realistas
├─ Feature + Unit tests
└─ 100% de cobertura en módulos principales
```

### Email

```
Mailpit (desarrollo)
├─ Captura emails locales
├─ UI web en http://localhost:8025
├─ NO envía realmente (desarrollo seguro)
└─ Los tests ven todos los emails
```

### Autenticación

```
Laravel Sanctum
├─ JWT tokens
├─ Tokens por dispositivo
├─ Middleware de autenticación
└─ Logout revoca tokens
```

---

## 📁 Estructura del Proyecto

### Directorios Principales

```
controlApp/
├── app/
│   ├── Models/              # Eloquent models
│   │   ├── User.php
│   │   ├── Proyecto.php
│   │   ├── Transaccion.php
│   │   ├── Cuenta.php
│   │   ├── Categoria.php
│   │   ├── Invitacion.php
│   │   └── PasswordReset.php
│   ├── Http/
│   │   └── Controllers/     # API controllers
│   │       └── Api/         # Rutas protegidas
│   ├── Mail/                # Clases de correo
│   ├── Notifications/       # Notificaciones
│   ├── Observers/           # Event listeners
│   │   ├── UserObserver.php
│   │   └── TransaccionObserver.php
│   └── Providers/           # Service providers
│
├── routes/
│   ├── api.php              # Rutas API
│   ├── web.php              # Rutas web (si hay)
│   └── console.php          # Comandos artisan
│
├── database/
│   ├── migrations/          # Esquema BD
│   ├── factories/           # Factories para tests
│   └── seeders/             # Seeders (opcional)
│
├── tests/
│   ├── TestCase.php         # Base class
│   ├── Feature/             # Integration tests
│   │   ├── Auth/
│   │   ├── Proyectos/
│   │   ├── Categorias/
│   │   ├── Cuentas/
│   │   ├── Transacciones/
│   │   ├── Invitaciones/
│   │   ├── FinanzasPersonales/
│   │   ├── EmailVerification/
│   │   ├── PasswordReset/
│   │   ├── Miembros/
│   │   └── VisualEmailTestsInMailpitTest.php
│   └── Unit/                # Unit tests
│
├── config/
│   ├── app.php              # App config
│   ├── database.php         # DB config
│   ├── auth.php             # Auth config
│   └── sanctum.php          # JWT config
│
├── docs/
│   ├── AI_GUIDELINES.md     # Normas para IAs (LEER!)
│   ├── CHANGELOG_DETAILED.md # Historial completo
│   ├── CHANGELOG.md         # Resumen publico
│   ├── TESTING_ARCHITECTURE.md # Cómo testear
│   └── ... otros docs
│
├── .env.testing             # Config de testing (NO EDITAR SIN MOTIVO)
├── compose.yaml             # Docker compose
├── phpunit.xml              # PHPUnit config
├── artisan                  # Laravel CLI
└── Dockerfile               # Si está
```

---

## 📝 Normas de Comportamiento

### Principios Fundamentales

1. **Transparencia**: Explica antes de codear, da opciones
2. **Autorización**: Pide confirmación antes de cualquier comando
3. **Trazabilidad**: Documenta cada cambio en CHANGELOG_DETAILED.md
4. **Portabilidad**: Cualquier developer puede continuar tu trabajo
5. **Calidad**: Tests validan TODO antes de cambios

### Cómo Debes Trabajar

#### SIEMPRE hacer esto:

```
✅ 1. Entender la tarea
   "Entendido, quieres agregar X. Voy a:
    - Analizar código existente
    - Ver cómo se hace en otros lados
    - Mostrar 2-3 opciones"

✅ 2. Dar opciones antes de codear
   "Opción 1: Hacer X (pros y contras)
    Opción 2: Hacer Y (pros y contras)
    ¿Cuál prefieres?"

✅ 3. Pedir confirmación para comandos
   "Voy a ejecutar: ./vendor/bin/sail artisan test
    ¿Confirmado?"

✅ 4. Mostrar resultados con contexto
   "Cambios completados: 3 archivos modificados
    Tests: 131/131 pasando ✅
    Cambio documentado en CHANGELOG_DETAILED.md"

✅ 5. Documentar cambios
   "Actualizado CHANGELOG_DETAILED.md
    - Feature: [descripción]
    - Archivos: [lista]
    - Tests: [qué valida]"
```

#### NUNCA hacer esto:

```
❌ 1. Ejecutar comandos sin preguntar
   ❌ NO: "Ejecutando: php artisan migrate"
   ✅ SÍ: "Voy a ejecutar: php artisan migrate. ¿Confirmado?"

❌ 2. Tocar .env (solo .env.testing)
   ❌ NO: Cambiar DB_HOST, DB_USER, etc.
   ✅ SÍ: Cambiar solo en .env.testing

❌ 3. Borrar tests sin explicar
   ❌ NO: Eliminar test sin documentar
   ✅ SÍ: "Este test es innecesario porque... Deberíamos borrarlo?"

❌ 4. Hacer cambios sin tests
   ❌ NO: Agregar feature sin tests
   ✅ SÍ: Agregar feature + tests + validar pasan

❌ 5. Cambios sin documentar
   ❌ NO: Terminar sin actualizar CHANGELOG
   ✅ SÍ: Actualizar CHANGELOG_DETAILED.md siempre
```

---

## 🗄️ Base de Datos

### Ambiente Testing (PRINCIPAL)

```yaml
DB_CONNECTION: mysql
DB_HOST: mysql          # Contenedor Docker
DB_PORT: 3306
DB_DATABASE: laravel    # ⚠️ IMPORTANTE: Misma BD para todos
DB_USERNAME: sail
DB_PASSWORD: password
```

### ¿Cómo funciona el aislamiento?

```
RefreshDatabase trait en cada test:
├─ Antes del test: Inicia transacción
├─ Durante el test: Todos los cambios ocurren
├─ Después del test: Rollback automático
└─ Resultado: BD limpia como nueva para próximo test

Garantía: ✅ CERO datos quedan de test anterior
```

### Modelos Principales

```php
// Users
User::create([
    'name' => 'John',
    'email' => 'john@example.com',
    'password' => bcrypt('password'),
])

// Projects
Proyecto::create([
    'nombre' => 'Mi Proyecto',
    'descripcion' => 'Descripción',
    'user_id' => $user->id,
])

// Accounts (Polimórficas)
Cuenta::create([
    'nombre' => 'Banco XYZ',
    'tipo' => 'bancaria',
    'saldo_inicial' => 1000,
    'cuentable_type' => 'proyecto',  // ⚠️ SIEMPRE 'proyecto'
    'cuentable_id' => $proyecto->id,
])

// Transactions
Transaccion::create([
    'cuenta_id' => $cuenta->id,
    'tipo' => 'ingreso|egreso',
    'monto' => 100,
    'descripcion' => 'Compra',
    'categoria_id' => $categoria->id,
])
```

### ⚠️ IMPORTANTE: MorphMap

```php
// En app/Providers/AppServiceProvider.php:
Relation::enforceMorphMapUsingFullyQualifiedClassNames(false);
Relation::morphMap([
    'proyecto' => Proyecto::class,      // ← 'proyecto', NO 'App\Models\Proyecto'
]);

// Cuando crees polimórficas:
$cuenta->cuentable_type = 'proyecto';   // ← Uso el alias
```

---

## 🧪 Testing

### Cómo Ejecutar Tests

```bash
# Todos los tests
./vendor/bin/sail artisan test --env=testing

# Un archivo específico
./vendor/bin/sail artisan test tests/Feature/Auth/LoginTest.php

# Un test específico
./vendor/bin/sail artisan test --filter=can_user_login

# Con output detallado
./vendor/bin/sail artisan test --env=testing --verbose

# Sin coverage (más rápido)
./vendor/bin/sail artisan test --env=testing --no-coverage
```

### Estructura de Tests

```php
// TEMPLATE BÁSICO
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class MiTest extends TestCase
{
    use RefreshDatabase;  // ← SIEMPRE

    public function test_algo()
    {
        // Arrange: Preparar datos
        $user = User::factory()->create();
        $proyecto = Proyecto::factory()->create(['user_id' => $user->id]);

        // Act: Hacer la acción
        $response = $this->actingAs($user)
            ->postJson('/api/proyectos', [...]);

        // Assert: Validar resultado
        $response->assertStatus(201);
        $this->assertDatabaseHas('proyectos', [
            'nombre' => 'Mi Proyecto',
        ]);
    }
}
```

### Factories (Para Datos Realistas)

```php
// Crear usuario con factory
$user = User::factory()->create();

// Crear proyecto de ese usuario
$proyecto = Proyecto::factory()->create(['user_id' => $user->id]);

// Crear múltiples
$usuarios = User::factory(5)->create();

// Con atributos específicos
$user = User::factory()->create([
    'email' => 'custom@example.com',
    'name' => 'Custom Name',
]);
```

### Assertions Comunes

```php
// Status HTTP
$response->assertStatus(200);
$response->assertStatus(201);  // Created
$response->assertStatus(404);  // Not Found
$response->assertStatus(403);  // Forbidden

// JSON
$response->assertJson(['success' => true]);
$response->assertJsonPath('data.id', 1);

// BD
$this->assertDatabaseHas('users', ['email' => 'test@example.com']);
$this->assertDatabaseMissing('users', ['email' => 'missing@example.com']);

// Autenticación
$response->assertUnauthenticated();
$response->assertAuthenticated();

// Emails
Mail::assertSent(VerificacionEmailMail::class);
```

---

## 🛠️ Comandos Esenciales

### Ejecutar Tests (LO MÁS IMPORTANTE)

```bash
# Todos
./vendor/bin/sail artisan test --env=testing --no-coverage

# Un archivo
./vendor/bin/sail artisan test tests/Feature/Auth/LoginTest.php

# Un test
./vendor/bin/sail artisan test --filter=test_user_can_login
```

### Migraciones

```bash
# Ejecutar migraciones
./vendor/bin/sail artisan migrate --env=testing

# Rollback
./vendor/bin/sail artisan migrate:rollback --env=testing

# Reset (limpia todo)
./vendor/bin/sail artisan migrate:reset --env=testing
```

### Tinker (Shell PHP Interactivo)

```bash
./vendor/bin/sail tinker

# Dentro de tinker:
> $user = User::factory()->create();
> $user->email
> User::count()
```

### Crear Cosas

```bash
# Modelo + migration
./vendor/bin/sail artisan make:model NuevoModelo -m

# Test
./vendor/bin/sail artisan make:test Feature/NuevoTest

# Controller
./vendor/bin/sail artisan make:controller Api/NuevoController

# Migration
./vendor/bin/sail artisan make:migration create_tabla_table
```

### Ver Rutas

```bash
./vendor/bin/sail artisan route:list
```

### DB

```bash
./vendor/bin/sail mysql -u root -ppassword

# Dentro de mysql:
> USE laravel;
> SELECT * FROM users;
```

---

## 📚 Ejemplos de Trabajos Anteriores

### Trabajo 1: Arreglamos Bug de MorphType

**Problema**: Tests fallaban con 404 en CuentaController

**Causa**: Mismatch entre controlador y BD
- Controlador: `'App\Models\Proyecto'`
- BD: `'proyecto'` (del MorphMap)

**Solución**: Corregimos 3 líneas

```php
// ANTES (❌ Error)
if ($cuenta->cuentable_type !== 'App\Models\Proyecto') {
    abort(403);
}

// DESPUÉS (✅ Correcto)
if ($cuenta->cuentable_type !== 'proyecto') {
    abort(403);
}
```

**Resultado**: 129/131 → 131/131 tests pasando ✅

**Lección**: MorphMap usa alias, NO clase completa

---

### Trabajo 2: Creamos Sistema de Testing Aislado

**Objetivo**: Tests NO deben tocar datos de producción

**Opciones evaluadas**:
1. BD separada (`laravel_test`) → Mucho overhead
2. SQLite → Incompatible con MySQL features
3. **RefreshDatabase** ← ELEGIDA

**Cómo funciona**:
- Misma BD (`laravel`)
- Pero RefreshDatabase = rollback automático
- Cada test empieza limpio

**Resultado**: 100% aislamiento, cero riesgo ✅

---

### Trabajo 3: Documentación para IAs

**Objetivo**: Nueva IA pueda entender proyecto en 15 min

**Documentos creados**:
- AI_GUIDELINES.md → Normas y flujos
- CHANGELOG_DETAILED.md → Historial completo
- TESTING_ARCHITECTURE.md → Estrategia de testing
- ONBOARDING_FOR_NEW_AIs.md → Este documento

**Resultado**: Cualquier IA nueva sabe cómo trabajar ✅

---

## ✅ Checklist de Validación

### Antes de Empezar a Trabajar

- [ ] He leído completamente este documento (5-10 min)
- [ ] He entendido la estructura del proyecto
- [ ] He entendido las normas de comportamiento
- [ ] He visto un ejemplo de cómo se han hecho cambios
- [ ] Sé qué archivos NO debo tocar (.env, etc.)
- [ ] Sé cómo ejecutar tests

### Mientras Trabajo

- [ ] Doy opciones antes de codear
- [ ] Pido confirmación para comandos
- [ ] Ejecuto tests después de cambios
- [ ] Todos los tests pasan
- [ ] Documento cambios en CHANGELOG_DETAILED.md

### Cuando Termino

- [ ] Cambios validados con tests (131/131 pasan)
- [ ] CHANGELOG_DETAILED.md actualizado
- [ ] Code es legible y tiene comentarios
- [ ] No hay cambios sin tests

---

## ❓ Preguntas Frecuentes

### P: ¿Puedo ejecutar la BD de producción en testing?

**R**: ❌ NO. NUNCA.

```
Testing usa: DB_DATABASE=laravel (con RefreshDatabase)
Producción usa: Servidor diferente

Si haces cambios en testing:
├─ RefreshDatabase hace rollback
└─ Producción NO se ve afectada
```

### P: ¿Por qué 131 tests? ¿Puedo agregar más?

**R**: ✅ SÍ, agregá más tests.

```
Estructura recomendada:
tests/Feature/
├─ Tu nueva feature
    ├─ test_caso_exitoso.php
    ├─ test_caso_error_404.php
    ├─ test_caso_sin_permiso_403.php
    └─ test_caso_validacion.php
```

### P: ¿Qué hago si un test falla?

**R**: Los tests son canarios. Si fallan, algo está mal.

```
Procedimiento:
1. Lee el error del test
2. Busca la causa (código nuevo, DB, etc.)
3. Arregla el código (NO el test)
4. Ejecuta test de nuevo
5. Si sigue fallando, pregunta
```

### P: ¿Cómo agrego un nuevo modelo?

**R**: Sigue este flujo:

```bash
# 1. Crear modelo + migration
./vendor/bin/sail artisan make:model MiModelo -m

# 2. Definir columnas en migration
# 3. Crear factory
./vendor/bin/sail artisan make:factory MiModeloFactory

# 4. Crear test
./vendor/bin/sail artisan make:test Feature/MiModeloTest

# 5. Escribir tests primero (TDD)
# 6. Implementar lógica
# 7. Ejecutar tests
./vendor/bin/sail artisan test tests/Feature/MiModeloTest.php

# 8. Si pasan: Documentar en CHANGELOG_DETAILED.md
```

### P: ¿Qué es la trait `RefreshDatabase`?

**R**: La magia que aísla los tests.

```php
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class MiTest extends TestCase
{
    use RefreshDatabase;  // ← Esto hace que después de cada test:
                         //   1. Se inicie una transacción
                         //   2. Se ejecute el test
                         //   3. Se haga rollback automático
                         //   4. BD queda limpia
}
```

### P: ¿Necesito entender toda la BD?

**R**: NO, pero lee `docs/DATABASE.md` si necesitas.

```
Información básica que debes saber:
├─ Users: usuarios del sistema
├─ Proyectos: creados por users
├─ Cuentas: bancarias/efectivo (polimórficas)
├─ Transacciones: ingresos/egresos
├─ Categorías: para agrupar
└─ Invitaciones: para agregar miembros

Si necesitas más: Leer /database/migrations/
```

### P: ¿Cómo sé si un cambio está correcto?

**R**: Los tests te lo dicen.

```
Si:  131/131 tests pasan  ✅
     └─ Tu cambio es correcto

Si:  131/131 → 130/131 fallan  ❌
     └─ Algo está mal en tu código
     └─ No hagas push/commit
     └─ Arreglá primero
```

---

## 🚀 Ahora Estás Listo

```
✅ Entiendes la estructura
✅ Sabes las normas
✅ Conoces los comandos
✅ Has visto ejemplos
✅ Sabes qué validar

Próximo paso:
Dile al usuario: "He leído completamente el onboarding.
Entiendo estructura, normas, testing.
¿Qué necesitas que haga?"
```

---

**Última actualización**: 16 de noviembre de 2025
**Versión**: 1.0.0
**Audiencia**: Nuevas IAs al proyecto
