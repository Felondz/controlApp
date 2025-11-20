# 🚀 ONBOARDING COMPLETO PARA NUEVAS IAs - ControlApp

**La Fuente Única de Verdad (Single Source of Truth) para todo el contexto, normas y flujo de trabajo.**

> Este documento es para **copiar y pegar completamente** en el chat de la nueva IA (ChatGPT, Claude, Copilot, etc.) o para usar como archivo de contexto en IDEs.

---

## 📋 1. RESUMEN EJECUTIVO Y FILOSOFÍA DE TRABAJO

### 🎯 Proposito del Proyecto
**ControlApp** es una aplicación web de gestión financiera personal y colaborativa construida con Laravel 11 como API REST pura.
* **Tipo**: API-first Backend (con React a construir).
* **Estado Actual**: 131 tests pasando (100% cobertura).

### Principios Fundamentales
1.  **Transparencia Radical**: Toda decisión debe explicarse ANTES de implementarse.
2.  **Autorización Explícita**: Nunca ejecutar código sin permiso del usuario.
3.  **Trazabilidad Completa**: Cada cambio debe estar registrado y documentado en **CHANGELOG_DETAILED.md**.
4.  **Portabilidad**: El proyecto debe poderse transferir a otro modelo o desarrollador sin fricción.
5.  **Calidad sobre Velocidad**: Mejor código limpio y documentado que rápido.

---

## 🏗️ 2. STACK Y ARQUITECTURA DEL PROYECTO

### Stack Tecnológico
| Componente | Tecnología | Versión/Descripción |
| :--- | :--- | :--- |
| **Backend** | Laravel (PHP) | Laravel 11 + PHP 8.2 (API-first Backend) |
| **Frontend** | React | A construir (Propuesta: React con Vite) |
| **Base de Datos**| MySQL | MySQL 8.0 (Containerizado con Docker) |
| **Autenticación**| Laravel Sanctum | Token-based (API Tokens), Expiración 24h. |
| **Testing** | PHPUnit | 131 tests pasando (100% cobertura) |

### Estructura de la API REST
* **Rutas**: Todos los endpoints están en `routes/api.php` y usan el prefijo `/api/`.
* **Formato de Respuesta**: Todas las respuestas son JSON.
* **Headers Requeridos**:
    * `Accept: application/json`
    * `Authorization: Bearer {token}` (para endpoints protegidos)

### Base de Datos
* **Integridad**: Foreign Keys con `ON DELETE CASCADE` y `ON UPDATE CASCADE`.
* **Modelos Principales**: `User`, `Proyecto`, `Categoria`, `Cuenta`, `Transaccion`, `Invitacion`.
* **Soft Deletes**: Los modelos principales (excepto `User`) usan borrado lógico (`deleted_at`).

---

## 3. 🛡️ NORMAS DE TRABAJO Y QA

### Fases de Desarrollo (El Flujo a Seguir)
1.  **Análisis**: Entender la tarea y revisar *issues* (`#N`). Proponer un plan (qué archivos se modifican).
2.  **Desarrollo**: Escribir código, siguiendo PSR-12.
3.  **Testing**: Escribir/asegurar que los tests pasen (Usar `RefreshDatabase`).
4.  **Documentación**: Actualizar **`CHANGELOG_DETAILED.md`** y luego crear un *commit*.

### Normas Técnicas Esenciales
* **Convención de Commits**: Usar [Conventional Commits](https://www.conventionalcommits.org/lang/es/) siempre (`feat:`, `fix:`, `docs:`, `chore:`, etc.).
* **Seguridad / Autorización**:
    * Usar Laravel **Policies** para todo control de acceso (ej: `ProyectoPolicy`).
    * **NO usar lógica de autorización en controladores** (excepto `Gate::allows()`).
* **Validación**: Usar **FormRequest** para toda validación de entrada (backend).

### Sistema de Testing
* **Aislamiento**: Se usa el trait `RefreshDatabase` en los tests para asegurar que cada prueba se ejecuta con una BD limpia.
* **Regla de Oro del Testing**: Si los tests fallan (`131/131 → 130/131 fallan ❌`), el código está incompleto o incorrecto. **NO hagas commit/push hasta que todos pasen.**

---

## 🌐 4. FLUJO DE TRABAJO CRÍTICO: INTERNACIONALIZACIÓN (i18n)

### Regla de Oro i18n
> **NUNCA hardcodear strings en componentes React**

### 🎯 El Flujo Ideal (CRÍTICO)

**Este es el orden CORRECTO para evitar deuda técnica de traducciones:**

1.  **EDITAR JSON (es):** Abre `resources/lang/es.json` y agrega la clave y el texto en español.
2.  **EDITAR JSON (en):** Abre `resources/lang/en.json` y agrega la clave y el texto en inglés (**¡NUNCA OMITIR ESTE PASO!**).
3.  **LUEGO Escribir React:** Importa el *hook* `useTranslate()` y usa `{t('seccion.clave')}`.

**Fallback Automático (Tu Aliado de Debug):**
* Si ves la clave (`seccion.clave`) en la interfaz, significa que la clave **existe en el código React pero falta en el archivo JSON**. Es un indicador de error inmediato.

---

## 5. COMANDOS ESENCIALES

```bash
# Entrar al contenedor de la aplicación
./vendor/bin/sail shell

# Correr tests (el más importante)
./vendor/bin/sail artisan test --testdox

# Correr migraciones
./vendor/bin/sail artisan migrate --force

# Limpiar cache (si hay problemas)
./vendor/bin/sail artisan cache:clear