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
- ✅ Notificación personalizada de verificación de email
- ✅ Integración con Mailtrap para testing de emails
- ✅ Mailpit para captura local de emails

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

#### Infraestructura
- ✅ Docker Compose configuration
- ✅ MySQL 8.0 container
- ✅ Redis container para caché
- ✅ Meilisearch container
- ✅ Mailpit para email testing

#### Documentación
- ✅ README.md completo
- ✅ API.md con todos los endpoints
- ✅ CHANGELOG.md
- ✅ Guía de instalación
- ✅ Estructura de desarrollo

### 🔧 Fixed (Corregido)

#### Sesión 1 (15 de noviembre)
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

#### Testing y Validación
- 🔧 Verificación exitosa de usuario ID 14 (testverify@example.com)
- 🔧 Validación de cambio de estado en base de datos: `email_verified_at = 2025-11-15 15:49:17`
- 🔧 Confirmación de funcionamiento de Mailtrap sandbox
- 🔧 Validación de endpoint de invitaciones

### 📚 Changed (Cambio)

- 📝 Estructura de rutas reordenizada para mejor claridad
  - Rutas públicas y privadas claramente separadas
  - Middlewares aplicados correctamente

- 📝 Email verification hash implementation
  - Cambio de signed URLs a manual SHA1 hash validation
  - Permite URLs públicas sin firma criptográfica

- 📝 Custom email notifications
  - Implementada clase `VerificacionEmailNotification` extendiendo `VerifyEmail`
  - Permite personalización completa de emails en español

### 🗑️ Removed (Removido)

- ❌ `MAIL_SCHEME` - Configuración inválida en `.env`
- ❌ `signed` middleware en ruta de verificación de email
- ❌ Dependencia en `EmailVerificationRequest` para verificación pública

### 🚀 Deployment

- Docker Compose completamente funcional
- Todos los containers en estado running:
  - Laravel: puerto 8000 ✓
  - MySQL: puerto 3307 ✓
  - Redis: puerto 6379 ✓
  - Meilisearch: puerto 7700 ✓
  - Mailpit: puerto 8025 ✓

### 📊 Testing Status

- ✅ Registro de usuarios funcional
- ✅ Login y autenticación funcional
- ✅ Email verification flow completo (end-to-end)
- ✅ Project invitations con emails
- ✅ CRUD de proyectos funcional
- ✅ API endpoints respondiendo correctamente
- ✅ Mailtrap capturing emails

### 📖 Documentation Status

- ✅ README.md - Guía completa de instalación y features
- ✅ API.md - Documentación de todos los endpoints
- ✅ CHANGELOG.md - Este archivo
- ⏳ DATABASE.md - Pendiente (esquema de BD)
- ⏳ AUTHENTICATION.md - Pendiente (guía de autenticación)
- ⏳ CONTRIBUTING.md - Pendiente (guía de contribución)

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
