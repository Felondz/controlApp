# 🧪 Estrategia de Testing (Consolidado) - ControlApp

**Este documento fusiona la arquitectura de pruebas, el aislamiento de BD y los comandos de ejecución de tests.**

---

## 1. 🎯 Filosofía de Testing y QA

* **Estado Actual**: 176 tests pasando con 557 assertions (100% de cobertura en módulos principales de autenticación y finanzas).
* **Regla de Oro (Quality Gate)**: Si los tests fallan, el código tiene un error. **No hagas commit/push hasta que todos pasen**.
* **Convención**: Usar nombres descriptivos para los tests: `test_admin_puede_crear_usuario`.

---

## 2. 🗄️ Aislamiento de Base de Datos (Estrategia Crítica)

### El Trait RefreshDatabase
La suite de tests utiliza el trait `Illuminate\Foundation\Testing\RefreshDatabase` en cada `TestCase`.

* **Propósito**: Asegurar que cada test se ejecute con una base de datos completamente limpia, previniendo que los datos de un test anterior afecten al siguiente.
* **Mecanismo**: Inicia una transacción antes de cada test y hace un `rollback` automático al finalizar.
* **Setup**: Los datos se preparan utilizando **Factories** para generar instancias aisladas y realistas para cada prueba.

---

## 3. 🛠️ Comandos de Ejecución (Testing Scripts)

Todos los tests deben ejecutarse dentro del contenedor de la aplicación a través de **Sail**.

| Propósito | Comando |
| :--- | :--- |
| **Ejecutar todos los tests (Principal)** | `./vendor/bin/sail test` |
| **Ejecutar todos los tests con testdox** | `./vendor/bin/sail test --testdox` |
| **Ejecutar un archivo específico** | `./vendor/bin/sail test tests/Feature/Auth/AuthenticationTest.php` |
| **Ejecutar un test específico** | `./vendor/bin/sail test --filter=test_users_can_logout` |
| **Ejecutar tests en paralelo** | `./vendor/bin/sail test --parallel` |
| **Ejecutar migraciones de testing** | `./vendor/bin/sail artisan migrate:fresh --env=testing` |

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

