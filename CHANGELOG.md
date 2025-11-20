# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added - 19 de Noviembre de 2025

#### Sistema de Internacionalización (i18n)
- ✅ Implementación completa de i18n con i18next + react-i18next
- ✅ Cascade de preferencias de idioma: Base de datos → Sesión → Config
- ✅ Middleware `SetUserLocale` para resolver idioma en cada request
- ✅ Campo `locale` en tabla `users` (migración nueva)
- ✅ Endpoint API `PUT /api/user/locale` para cambiar idioma del usuario
- ✅ Componente React `LocaleSelector` integrado en layouts autenticados
- ✅ 136 claves de traducción sincronizadas (español e inglés)
- ✅ Tests: `UserLocaleApiTest` con cobertura completa

#### Auditoría y Diagnóstico
- ✅ Auditoría completa de todos los controladores API (12 revisados)
- ✅ Identificación de CRUD incompletos y su estado
- ✅ Documentación exhaustiva de deuda técnica (45+ tareas)
- ✅ Categorización por prioridad (ALTA, MEDIA-ALTA, MEDIA, BAJA)

#### Correcciones de Validación
- ✅ Eliminada regla inválida `'uppercase'` en `StoreProyectoRequest`
- ✅ Eliminado conflicto de validación: `'max:1'` + `'min:3'`
- ✅ Reordenadas reglas de validación para claridad

#### Resolución de Problemas
- ✅ Eliminada carpeta ghost `tests/Feature/Feature/` (causaba errores en IDE)
- ✅ Deshabilitados diagnósticos falsos de Intelephense
- ✅ Limpieza de cachés de Pylance y VSCode

### Changed - 19 de Noviembre de 2025

- 🔄 `ProyectoUiWebController::store()` - Cambio temporal a validación manual para diagnóstico
  - ⚠️ NOTA: Debe revertirse a Form Request injection
- 🔄 `User` model - Agregado campo `locale` y métodos de acceso
- 🔄 Translations - Sincronizadas todas las claves entre es.json y en.json

### Removed - 19 de Noviembre de 2025

- ❌ Lógica de invitaciones para usuarios no autenticados
  - Reconocimiento: Los invitados deben crear cuenta para aceptar invitaciones
- ❌ `LocaleController` - Eliminados endpoints públicos de locale
- ❌ Tests de locale para invitados (out of scope)

### Fixed - 19 de Noviembre de 2025

- 🔧 Validación de proyectos: conflictos entre reglas min/max eliminados
- 🔧 IDE cache errors: deshabilitados diagnósticos falsos
- 🔧 Traducción desincronizada: ambos idiomas ahora tienen 136 keys

### To Do

- 📋 Completar `ProyectoMiembroController` (falta store/show)
- 📋 Crear Form Requests UPDATE para Proyecto, Cuenta, Categoria
- 📋 Completar `ProyectoUiWebController` web (falta index/edit/update/destroy)
- 📋 Completar `ProjectAccountUiWebController` web
- 📋 Crear `TransaccionUiWebController`
- 📋 Crear `CategoriaUiWebController`
- 📋 Implementar middleware `SuperAdminOnly`
- 📋 Ver documentación de sesión: `docs/sessions/2025-11-19.md`

---

## [v0.1.0] - 2025-11-19 (Initial Setup)

### Added

- 🎯 Estructura inicial del proyecto
- 🎯 Setup Laravel 12.38.1 + React 19 + Inertia
- 🎯 Autenticación con Laravel Sanctum
- 🎯 Modelos base: User, Proyecto, Cuenta, Categoria, Transaccion, Invitacion
- 🎯 Controladores API CRUD para Proyectos, Cuentas, Categorias
- 🎯 Sistema de roles para miembros de proyectos (admin/miembro)
- 🎯 Layouts web con Inertia (Authenticated, Guest)
- 🎯 Email verification y password reset
- 🎯 Campo is_super_admin en usuarios
- 🎯 Comando artisan para asignar super admin

---

**Última actualización**: 19 de noviembre de 2025  
**Próximo release**: TBD
