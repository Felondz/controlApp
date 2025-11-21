# 🧪 Estrategia de Testing (Consolidado) - ControlApp

**Este documento fusiona la arquitectura de pruebas, el aislamiento de BD y los comandos de ejecución de tests.**

---

## 1. 🎯 Filosofía de Testing y QA

* **Estado Actual**: 131 tests pasando con 342 assertions (100% de cobertura en módulos principales).
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
| **Ejecutar todos los tests (Principal)** | `./vendor/bin/sail artisan test --testdox` |
| **Ejecutar un archivo específico** | `./vendor/bin/sail artisan test tests/Feature/Auth/LoginTest.php` |
| **Ejecutar un test específico** | `./vendor/bin/sail artisan test --filter=can_user_login` |
| **Ejecutar tests en paralelo** | `./vendor/bin/sail artisan test --parallel` |
| **Ejecutar migraciones de testing** | `./vendor/bin/sail artisan migrate --env=testing` |

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

## 5. 🗑️ Tarea de Limpieza Final

Si no lo has hecho ya, por favor, elimina de la carpeta `docs/04-testing/` los archivos `TESTING.md` y `TESTING_SCRIPTS.md` (y cualquier otro archivo histórico), ya que su contenido ha sido fusionado en este documento.

