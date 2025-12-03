# 🧪 Estrategia de Testing (Consolidado) - ControlApp

**Este documento fusiona la arquitectura de pruebas, el aislamiento de BD y los comandos de ejecución de tests.**

---

## 1. 🎯 Filosofía de Testing y QA

* **Estado Actual**:
    - **Backend**: 100% de cobertura funcional (280 tests).
    - **Frontend**: 100% de cobertura de componentes (217 tests en 39 archivos de prueba).
    - **Total**: 497 tests con cobertura completa
* **Regla de Oro (Quality Gate)**: Si los tests fallan, el código tiene un error. **No hagas commit/push hasta que todos pasen**.
* **Convención**: Usar nombres descriptivos: `test_admin_puede_crear_usuario` (backend), `renders correctly` (frontend).
* **CI/CD**: Todos los tests se ejecutan automáticamente en GitHub Actions en cada push/PR.

---

## 2. 🗄️ Testing Backend (PHPUnit)

### Aislamiento de Base de Datos (SQLite In-Memory)
 
La suite de tests está configurada para usar **SQLite en memoria** (`:memory:`).
 
*   **Ventajas**:
    *   🚀 **Velocidad**: Los tests se ejecutan mucho más rápido
    *   🛠️ **Simplicidad**: No requiere servidor MySQL
    *   🔄 **Aislamiento**: Base de datos fresca en cada test
*   **Trait RefreshDatabase**: Migra la base de datos en memoria antes de cada test.

### Estructura de Directorios

- **Backend Tests**: `tests/Unit`, `tests/Feature`
- **Frontend Tests**: `tests/Frontend` (Mirroring `resources/js` structure)
- **E2E Tests**: `tests/Browser` (Dusk)

### Organización de Tests

Los tests están organizados por tipo en `tests/Feature`:

- **Api**: Tests de endpoints API (`tests/Feature/Api`)
- **Web**: Tests de controladores Web/Inertia (`tests/Feature/Web`)
- **Auth**: Tests de flujos de autenticación (`tests/Feature/Auth`)
- **Mail**: Tests de contenido y envío de correos (`tests/Feature/Mail`)
- **Database**: Tests de seeders y migraciones (`tests/Feature/Database`)

### Comandos de Ejecución
 
| Propósito | Comando (Local) | Comando (Sail/Docker) |
| :--- | :--- | :--- |
| **Ejecutar todos los tests** | `./vendor/bin/sail test` | `./vendor/bin/sail test` |
| **Ejecutar con testdox** | `./vendor/bin/sail test --testdox` | `./vendor/bin/sail test --testdox` |
| **Ejecutar archivo específico** | `./vendor/bin/sail test tests/Feature/EjemploTest.php` | `./vendor/bin/sail test tests/Feature/EjemploTest.php` |
| **Ejecutar test específico** | `./vendor/bin/sail test --filter=nombre_del_test` | `./vendor/bin/sail test --filter=nombre_del_test` |
| **Ejecutar en paralelo** | `./vendor/bin/sail test --parallel` | `./vendor/bin/sail test --parallel` |

### Ejemplos de Tests de Feature

- `tests/Feature/Auth/AuthenticationTest.php`: Login, Registro, Logout.
- `tests/Feature/ChatSystemTest.php`: Sistema de chat, mensajes, estado online y contadores.
- `tests/Feature/ProyectosApiTest.php`: CRUD de proyectos.

### Assertions y Estructura

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

## 3. 🎨 Testing Frontend (Vitest + Testing Library)

### Cobertura de Tests

**Estadísticas:**
- **Total de Tests**: 217 tests en 39 archivos de prueba
- **Cobertura**: 100% de componentes React (39/39 archivos de prueba)
- **Framework**: Vitest + @testing-library/react

**Categorías de Tests:**

1. **Componentes UI Core**
   - Checkbox, TextInput, PasswordInput, InputLabel, InputError
   - PrimaryButton, SecondaryButton, DangerButton
   - Dropdown, Modal, Alert
   - RangeSlider, QuantityInput, SelectGroup, ToggleGroup, InputGroup

2. **Componentes de Funcionalidad (Feature)**
   - ImageUploader, Sidebar, ProjectCard, ChatWidget
   - BottomNavigation, ToolsSheet, TypographySelector, ThemeToggle
   - ApplicationLogo, LocaleSelector, SummaryCard, AccountsList, ToolCard
   - FinanceWidget, TasksWidget

3. **Tests de Arquitectura**
   - Verificaciones de calidad ComponentStandards

### Comandos de Ejecución

| Propósito | Comando |
| :--- | :--- |
| **Ejecutar todos los tests frontend** | `npm run test` |
| **Ejecutar en modo CI** | `npm run test:ci` |
| **Ejecutar en modo watch** | `npm run test:watch` |
| **Ejecutar archivo específico** | `npx vitest run ComponentName.test.jsx` |

### Infraestructura de Tests

**Mocks Globales** (`test-setup.js`):
- `@inertiajs/react` (usePage, router, Link, useForm)
- `@/hooks/useTranslate`
- `@/Contexts/GlobalThemeContext`
- `global.route` (Ziggy)
- `axios`
- `Element.prototype.scrollIntoView`

**Ubicación de Tests**: `tests/Frontend/Components` (Reflejando `resources/js/Components`)

### Mejores Prácticas

- ✅ Usar queries semánticas (`getByRole`, `getByLabelText`)
- ✅ Testear comportamiento del usuario, no detalles de implementación
- ✅ Esperar operaciones asíncronas con `waitFor`
- ✅ Verificar claves de traducción, no texto traducido
- ✅ Mantener tests aislados e independientes
- ✅ Seguir patrón AAA (Arrange, Act, Assert)

---

## 4. 🎯 Mejores Prácticas Generales

- ✅ Cada test debe ser independiente
- ✅ Usar nombres descriptivos
- ✅ Seguir el patrón AAA
- ✅ Usar Factories/Mocks para datos de prueba
- ✅ Limpiar después de los tests (RefreshDatabase/cleanup)
- ✅ Testear casos de éxito y fallo
- ✅ Ejecutar tests localmente antes de push
- ✅ Todos los tests deben pasar en CI/CD

---

**Última Actualización**: 2 de Diciembre, 2025
**Estado**: ✅ Estrategia de testing completamente configurada (Backend + Frontend)
**Nota**: Todos los tests del frontend han sido actualizados para usar claves de traducción en lugar de texto hardcodeado, siguiendo el nuevo sistema de i18n.
