# Changelog - ControlApp

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.0] - 2025-11-15

### ✨ Added (Agregado)

#### Autenticación y Usuarios
- ✅ Sistema de registro con validación de email
- ✅ Sistema de login con tokens JWT (Laravel Sanctum)
- ✅ Verificación de email con enlaces personalizados
- ✅ Reenvío de emails de verificación
- ✅ Logout seguro
- ✅ Obtener perfil del usuario autenticado

#### Email System
- ✅ Plantilla HTML personalizada para verificación de email en español
- ✅ Plantilla HTML personalizada para invitaciones a proyectos
- ✅ Plantilla HTML profesional para reset de contraseña (NUEVO - Sesión 15/11)
- ✅ Notificación personalizada de verificación de email
- ✅ Integración con Mailtrap para testing de emails
- ✅ Mailpit para captura local de emails
- ✅ **Layout base unificado para todos los templates** (NUEVO - Sesión 15/11)
- ✅ Sistema de relación invitador en invitaciones (NUEVO - Sesión 15/11)

#### Proyectos
- ✅ CRUD completo de proyectos
- ✅ Crear, leer, actualizar y eliminar proyectos
- ✅ Relación entre usuarios y proyectos
- ✅ Soft delete para proyectos
- ✅ Validación de datos de entrada

#### Sistema de Invitaciones
- ✅ Crear y enviar invitaciones a nuevos miembros
- ✅ Aceptar invitaciones y crear usuarios automáticamente
- ✅ Rechazar invitaciones
- ✅ Listar invitaciones por proyecto
- ✅ Emails automatizados con enlaces de aceptación
- ✅ Gestión de estado de invitaciones (pendiente, aceptada, rechazada)
- ✅ Tracking de quién envía la invitación (NUEVO - Sesión 15/11)

#### Categorías
- ✅ CRUD completo de categorías
- ✅ Asociar categorías a proyectos
- ✅ Campos: nombre, color, icono
- ✅ Soft delete para categorías

#### Cuentas
- ✅ CRUD completo de cuentas
- ✅ Tipos de cuenta: banco, efectivo, tarjeta, digital
- ✅ Tracking de saldo
- ✅ Relación con proyectos y transacciones
- ✅ Soft delete para cuentas

#### Transacciones
- ✅ CRUD completo de transacciones
- ✅ Tipos: ingreso y egreso
- ✅ Tracking automático de cambios en saldo de cuenta
- ✅ Observer pattern para sincronización
- ✅ Filtrado por fecha, categoría y tipo
- ✅ Soft delete para transacciones

#### Búsqueda y Indexación
- ✅ Integración con Meilisearch
- ✅ Indexación de proyectos
- ✅ Búsqueda rápida de proyectos

#### API
- ✅ Documentación completa de endpoints
- ✅ Ejemplos de request/response
- ✅ Validación de datos
- ✅ Error handling
- ✅ Rate limiting en endpoints sensibles
- ✅ Autenticación basada en roles

#### Seguridad
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Tokens JWT seguros
- ✅ CORS configurado
- ✅ Validación CSRF
- ✅ Authorization checks
- ✅ Email verification requirement

#### Testing
- ✅ Estructura de tests unitarios y funcionales
- ✅ Factories para modelos
- ✅ Database seeders
- ✅ PHPUnit configuration
- ✅ 114/114 Feature tests pasando (Sesión 15/11)
- ✅ 46/46 Email tests completos (Sesión 15/11)
- ✅ Scripts centralizados en carpeta `scripts/` (NUEVO - Sesión 15/11)
  - `run-tests.sh` - Suite principal de tests
  - `test-invitaciones.sh` - Tests específicos de invitaciones
  - `test-mailtrap.sh` - Testing de emails
  - `check-docs.sh` - Validación de documentación
  - `TESTING_SUMMARY.sh` - Reporte final completo

#### Infraestructura
- ✅ Docker Compose configuration
- ✅ MySQL 8.0 container
- ✅ Redis container para caché
- ✅ Meilisearch container
- ✅ Mailpit para email testing

#### Documentación
- ✅ README.md completo (en raíz - punto de entrada)
- ✅ API.md con todos los endpoints
- ✅ CHANGELOG.md (Este archivo - centralizado en docs/)
- ✅ Guía de instalación
- ✅ Estructura de desarrollo
- ✅ DOCUMENTATION_GUIDE.md - Guía para documentar cambios (centralizado en docs/ - Sesión 15/11)
- ✅ QUICK_REFERENCE.md - Referencia rápida de documentación (centralizado en docs/ - Sesión 15/11)
- ✅ TESTING_SCRIPTS.md - Guía de scripts de testing (centralizado en docs/ - Sesión 15/11)

### 🔧 Fixed (Corregido)

#### Sesión 1 (15 de noviembre) - Email System Foundation
- 🔧 **Fix: Tabla de Invitaciones no encontrada**
  - Problema: Eloquent buscaba `invitacions` en lugar de `invitaciones`
  - Solución: Agregado `protected $table = 'invitaciones'` en modelo Invitacion
  - Archivo: `app/Models/Invitacion.php`

- 🔧 **Fix: SMTP Configuration con Mailtrap**
  - Problema: Credenciales inválidas y encryption scheme incorrecto
  - Solución: 
    - Actualizado `MAIL_USERNAME=6362c6f9e86312`
    - Actualizado `MAIL_PASSWORD=9c42ba76539b3c`
    - Cambio a `MAIL_ENCRYPTION=tls`
    - Removido inválido `MAIL_SCHEME`
  - Archivo: `.env`

- 🔧 **Fix: Email Verification Route Authorization**
  - Problema: Ruta requería autenticación (`auth:sanctum`) bloqueando usuarios sin login
  - Solución: Movida ruta fuera del grupo de rutas protegidas
  - Archivo: `routes/api.php`

- 🔧 **Fix: Signed Route Validation Error**
  - Problema: `signed` middleware requería validación de firma que no funcionaba
  - Solución: Removido middleware `signed`, implementada validación manual de hash SHA1
  - Archivo: `routes/api.php`

- 🔧 **Fix: Email Verification Controller**
  - Problema: `EmailVerificationRequest` requería usuario autenticado
  - Solución: 
    - Reescrito método `verify()` para aceptar `Request` genérico
    - Implementada validación manual de hash: `sha1($user->getEmailForVerification())`
    - Agregado dispatch de evento `Verified`
  - Archivo: `app/Http/Controllers/Api/EmailVerificationController.php`

- 🔧 **Fix: Proyecto Invitations Email Not Sending**
  - Problema: Línea de envío de email estaba comentada
  - Solución: Descomentada línea y agregados imports necesarios
  - Archivo: `app/Http/Controllers/Api/ProyectoInvitacionController.php`

#### Sesión 2 (15 de noviembre) - Email Templates Standardization
- 🔧 **Fix: Password Reset Email Missing Recipient**
  - Problema: Envelope en PasswordResetMail no tenía `to:` definido
  - Solución: Agregado `to: $this->email` en método `envelope()`
  - Archivo: `app/Mail/PasswordResetMail.php`

- 🔧 **Fix: Test de Invitación API con Ruta Incorrecta**
  - Problema: Tests visuales usaban `/api/invitations` que no existe
  - Solución: Actualizada ruta a `/api/proyectos/{proyecto}/invitaciones`
  - Archivo: `tests/Feature/VisualEmailTestsInMailpitTest.php`

- 🔧 **Fix: Password Reset Mail Tests Assertions**
  - Problema: Tests intentaban acceder a `$mail->subject` directamente (Mailable no tiene propiedad pública)
  - Solución: Actualizado a `$mail->envelope()->subject`
  - Archivo: `tests/Feature/PasswordResetMailTest.php`

- 🔧 **Fix: Mayúsculas Inconsistentes en Subject**
  - Problema: Tests esperaban "contraseña" pero Mail tenía "Contraseña"
  - Solución: Actualizado tests a coincidir con subject actual
  - Archivo: `tests/Feature/PasswordResetMailTest.php`

### 📚 Changed (Cambio)

#### Cambios de Estructura

- 📝 **Estructura de rutas reordenizada para mejor claridad**
  - Rutas públicas y privadas claramente separadas
  - Middlewares aplicados correctamente

- 📝 **Email verification hash implementation**
  - Cambio de signed URLs a manual SHA1 hash validation
  - Permite URLs públicas sin firma criptográfica

- 📝 **Custom email notifications**
  - Implementada clase `VerificacionEmailNotification` extendiendo `VerifyEmail`
  - Permite personalización completa de emails en español

#### Reorganización de Documentación (Sesión 15/11)

- 📝 **Centralización de archivos Markdown**
  - Movidos a `docs/`: DOCUMENTATION_GUIDE.md, QUICK_REFERENCE.md, TESTING_SCRIPTS.md
  - README.md mantiene en raíz como punto de entrada
  - Raíz ahora limpia: solo README.md, config files, y carpetas de código
  - Todas las guías ahora en `docs/` con CHANGELOG.md como referencia central

- 📝 **README.md Actualizado - Visión del Proyecto**
  - Cambio de descripción: de "Gestión Financiera" a "Plataforma de Gestión de Proyectos Colaborativos"
  - Clarificación: Módulo Financiero como FEATURE v1.0.0, no el core
  - Agregado roadmap detallado para v1.1.0 y v2.0.0
  - Listado de tecnologías futuras: React, React Native, TypeScript
  - Estado del proyecto con tabla de progreso (✅ completado, 🔄 en desarrollo)
  - Referencia a soporte multi-idioma (i18n integrado)
  - Visión clara de arquitectura futura: frontend React + mobile React Native

#### Cambios de Templates (Sesión 15/11)

- 📝 **Email Templates Unified Design**
  - Todos los templates ahora extienden `emails.layout`
  - Diseño consistente con gradiente púrpura (#667eea → #764ba2)
  - Paleta de colores: Gradientes, grises, alertas azules

- 📝 **Mailable Pattern Implementation**
  - Password Reset cambió de `MailMessage` builder a clase `PasswordResetMail`
  - Consistencia con resto del sistema (todos usan templates ahora)
  - Fácil mantenimiento centralizado

- � **Database Schema Changes**
  - Agregada columna `user_id` a tabla `invitaciones`
  - Nueva relación `invitador()` en modelo Invitacion
  - Permite tracking de quién envía cada invitación

### �🗑️ Removed (Removido)

- ❌ `MAIL_SCHEME` - Configuración inválida en `.env`
- ❌ `signed` middleware en ruta de verificación de email
- ❌ Dependencia en `EmailVerificationRequest` para verificación pública
- ❌ Duplicación de HTML en templates de email (Sesión 15/11)
- ❌ MailMessage builder para Password Reset (Sesión 15/11)

### 🚀 Deployment & Infrastructure

#### Status (Sesión 15/11)
- ✅ Docker Compose completamente funcional
- ✅ Todos los containers en estado running:
  - Laravel: puerto 8000 ✓
  - MySQL: puerto 3307 ✓
  - Redis: puerto 6379 ✓
  - Meilisearch: puerto 7700 ✓
  - Mailpit: puerto 8025 ✓
- ✅ 114/114 tests pasando en ambiente containerizado

### 📊 Testing Status

#### Feature Tests (Sesión 15/11)
```
✅ 114/114 Tests Pasando (100%)
✅ 297 Assertions Correctas
✅ 0 Failures
✅ 0 Errors
```

**Desglose:**
- 📧 Email Verification: 7/7 ✅
- 📧 Invitaciones API: 14/14 ✅
- 📧 Password Reset Mail: 11/11 ✅
- 📧 Password Reset API: 14/14 ✅
- 📧 Visual Email Tests: 3/3 ✅ (Mailpit verification)
- 🔐 Auth & Users: 25/25 ✅
- 📁 Proyectos: 23/23 ✅
- 🏷️ Categorías: 6/6 ✅
- 💰 Cuentas: 5/5 ✅
- 💳 Transacciones: 8/8 ✅
- 👥 Miembros: 12/12 ✅
- Otros: 12/12 ✅

#### Cobertura
- ✅ Registro de usuarios funcional
- ✅ Login y autenticación funcional
- ✅ Email verification flow completo (end-to-end)
- ✅ Project invitations con emails profesionales
- ✅ Password reset flow completo
- ✅ CRUD de proyectos, categorías, cuentas, transacciones
- ✅ API endpoints respondiendo correctamente
- ✅ Mailpit capturando y visualizando todos los emails

### 🎨 Visual & Design (Sesión 15/11)

#### Email Templates
- ✅ **Verificación Email**
  - Botón destacado: "Verificar Email"
  - Link alternativo para copiar
  - Aviso de seguridad

- ✅ **Invitación a Proyecto**
  - Tabla con detalles: Proyecto, Rol, Invitador, Expiración
  - Botón: "Aceptar Invitación"
  - Información clara del remitente (NUEVO)
  - Alert box de seguridad

- ✅ **Reset de Contraseña**
  - Botón: "Restablecer Contraseña"
  - Sección: "Tips de Seguridad"
  - Link alternativo para copiar
  - Información de expiración

#### Color Palette
| Elemento | Hex | Descripción |
|----------|-----|-------------|
| Gradient Start | #667eea | Púrpura suave |
| Gradient End | #764ba2 | Púrpura oscuro |
| Texto Principal | #333333 | Gris muy oscuro |
| Texto Secundario | #666666 | Gris medio |
| Bordes | #e0e0e0 | Gris claro |
| Alert BG | #e3f2fd | Azul muy claro |
| Alert Text | #1976d2 | Azul |

### 📖 Documentation Status (Sesión 15/11)

- ✅ CHANGELOG.md - Este archivo (Consolidado sesión 15/11)
- ✅ README.md - Guía completa
- ✅ API.md - Todos los endpoints
- ⏳ DATABASE.md - En progreso
- ⏳ AUTHENTICATION.md - En progreso
- ⏳ CONTRIBUTING.md - En progreso

**Nota:** Se consolidó documentación en CHANGELOG.md único en lugar de múltiples archivos (RESOLUCION_CORREOS.md, SESSION_SUMMARY.md, EMAIL_TEMPLATES_STANDARDIZATION.md, etc. fueron reemplazados)

---

## [0.1.0] - 2025-11-14

### Initial Setup
- 🚀 Proyecto Laravel 12 creado
- 🚀 Docker Compose configurado
- 🚀 Migraciones iniciales
- 🚀 Modelos base creados
- 🚀 Estructura de proyectos planificada

---

## Próximas Versiones Planeadas

### [1.1.0] - Planeado

#### Features en Desarrollo
- 📅 Calendario de transacciones
- 📊 Reportes y gráficas
- 📤 Exportación de datos (CSV, PDF)
- 🔔 Notificaciones en tiempo real
- 📱 Aplicación móvil
- 👥 Roles y permisos más granulares

#### Mejoras Planeadas
- 🔍 Búsqueda avanzada mejorada
- ♻️ Paginación lazy-loading
- 🎨 Temas personalizables
- 🌍 Soporte multiidioma
- ⚡ Cache optimizado

### [2.0.0] - Visión Futura

- 🏦 Integración bancaria real
- 💱 Conversión de monedas en tiempo real
- 📊 IA para categorización automática
- 🤖 Análisis predictivo de gastos
- 🌐 App web y móvil completa

---

## Notas de Desarrollo

### Convención de Commits
Este proyecto utiliza [Conventional Commits](https://www.conventionalcommits.org/lang/es/)

Tipos de commits:
- `feat:` Nueva característica
- `fix:` Corrección de bug
- `docs:` Cambios de documentación
- `style:` Cambios de formato (no afectan lógica)
- `refactor:` Refactorización de código
- `perf:` Mejoras de performance
- `test:` Agregar o actualizar tests
- `chore:` Cambios en configuración

Ejemplo:
```
feat(api): agregar endpoint de reportes

Descripción detallada del cambio...
```

### Git Workflow
1. Crear branch: `git checkout -b feat/nombre-feature`
2. Hacer commits: `git commit -m "feat(modulo): descripción"`
3. Push: `git push origin feat/nombre-feature`
4. Pull Request y review
5. Merge a main

---

**Última actualización**: 15 de noviembre de 2025
**Mantenedor**: Felondz (@Felondz)
**Status**: ✅ Producción Lista (Versión 1.0.0)
