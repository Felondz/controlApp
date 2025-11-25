# 🧪 Estrategia de Testing (Consolidado) - ControlApp

**Este documento fusiona la arquitectura de pruebas, el aislamiento de BD y los comandos de ejecución de tests.**

---

## 1. 🎯 Filosofía de Testing y QA

* **Estado Actual**: 176 tests pasando con 557 assertions (100% de cobertura en módulos principales de autenticación y finanzas).
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

## 4. 📝 Assertions y Estructura

* **Estructura del Test (AAA)**:
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

