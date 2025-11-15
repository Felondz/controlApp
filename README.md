# ControlApp - Plataforma de Gestión de Proyectos Colaborativos

<p align="center">
  <strong>Plataforma moderna y escalable para gestionar proyectos en equipo</strong>
  <br />
  Con módulo financiero como primer feature + roadmap hacia gestión integral
</p>

<p align="center">
  <a href="#-características"><strong>Features</strong></a> •
  <a href="#-instalación-rápida"><strong>Instalación</strong></a> •
  <a href="#-documentación"><strong>Docs</strong></a> •
  <a href="#-tecnologías"><strong>Tech Stack</strong></a> •
  <a href="#-licencia"><strong>Licencia</strong></a>
</p>

---

## 🎯 Características Actuales (v1.0.0 - Módulo Financiero)

### Core
- ✅ **Autenticación Segura** - Sistema de registro y login con tokens JWT (Sanctum)
- ✅ **Verificación de Email** - Confirmación personalizada en múltiples idiomas
- ✅ **Gestión de Proyectos** - Crear, editar, eliminar y listar proyectos
- ✅ **Sistema de Miembros** - Agregar miembros con roles y permisos
- ✅ **Invitaciones Colaborativas** - Invitar miembros por email con seguimiento

### Módulo Financiero (Feature v1.0.0)
- ✅ **Gestión de Cuentas** - Múltiples cuentas por proyecto (banco, efectivo, tarjeta, digital)
- ✅ **Categorías Personalizables** - Organizar transacciones por categorías con colores e iconos
- ✅ **Transacciones** - Registrar ingresos y egresos con tracking automático de saldo
- ✅ **Sincronización de Saldo** - Observer pattern para actualización automática

### Infraestructura
- ✅ **API RESTful Completa** - 50+ endpoints documentados
- ✅ **Búsqueda Avanzada** - Motor Meilisearch integrado
- ✅ **Email System Profesional** - 3 templates estandarizados (verificación, invitación, reset)
- ✅ **Testing Completo** - 114/114 tests pasando (PHPUnit)

## 🚀 Roadmap & Funcionalidades Futuras

### v1.1.0 (Próximo Release)
- 📅 **Calendario** - Vista de transacciones en calendario
- 📊 **Reportes y Gráficas** - Visualización avanzada de datos financieros
- 📤 **Exportación de Datos** - Descarga en CSV, PDF, Excel
- 🌍 **Soporte Multi-idioma** - Interface completa en inglés, español, portugués

### v2.0.0+ (Futuro - Gestión Integral)
- 🎯 **Gestión de Tareas** - Sistema de tareas y subtareas por proyecto
- 📋 **Tableros Kanban** - Organización visual de flujos de trabajo
- 🔄 **Integración Bancaria** - Conexión con APIs bancarias reales
- 💱 **Conversión Multi-moneda** - Soporte para múltiples divisas
- 📱 **Aplicación Móvil** - React Native app (iOS/Android)
- 🎨 **Frontend Web** - React 18+ con UI moderna y responsive

### 🔮 Visión Futura
- 🤖 Automatización de flujos
- 🔔 Sistema de notificaciones inteligentes
- 📊 Analytics avanzado y BI
- 👥 Gestión avanzada de equipos
- 🔐 SSO y autenticación OAuth

## ⚡ Instalación Rápida

### Con Docker (Recomendado)

```bash
# 1. Clonar repositorio
git clone https://github.com/Felondz/controlApp.git
cd controlApp

# 2. Configurar variables
cp .env.example .env

# 3. Levantar servicios
docker compose up -d

# 4. Instalar dependencias
docker compose exec -T laravel.test composer install

# 5. Generar key
docker compose exec laravel.test php artisan key:generate

# 6. Migraciones
docker compose exec laravel.test php artisan migrate

# 7. Acceder
# App: http://localhost:8000
# API: http://localhost:8000/api
# Mailpit: http://localhost:8025
```

### Sin Docker

```bash
# 1. Requisitos: PHP 8.4, MySQL 8, Redis, Composer
php -v && mysql --version && redis-cli --version

# 2. Clonar y instalar
git clone https://github.com/Felondz/controlApp.git
cd controlApp
composer install

# 3. Configurar
cp .env.example .env
php artisan key:generate
php artisan migrate

# 4. Servir
php artisan serve
```

Para guía completa, ver [docs/INSTALLATION.md](docs/INSTALLATION.md)

## 📚 Documentación

Documentación profesional completa en la carpeta `docs/`:

| Archivo | Contenido |
|---------|-----------|
| **[docs/INDEX.md](docs/INDEX.md)** | Índice y navegación de toda la documentación |
| **[docs/API.md](docs/API.md)** | 50+ endpoints con ejemplos de requests/responses |
| **[docs/AUTHENTICATION.md](docs/AUTHENTICATION.md)** | Sistema de autenticación y seguridad |
| **[docs/DATABASE.md](docs/DATABASE.md)** | Esquema de BD, relaciones y queries útiles |
| **[docs/INSTALLATION.md](docs/INSTALLATION.md)** | Guía paso a paso de instalación |
| **[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)** | Cómo contribuir al proyecto |
| **[docs/CHANGELOG.md](docs/CHANGELOG.md)** | Historial de cambios y versiones |

## 🌐 Acceso a Servicios

Una vez levantado el proyecto, accede a:

| Servicio | URL |
|----------|-----|
| **App** | http://localhost:8000 |
| **API** | http://localhost:8000/api |
| **Mailpit** | http://localhost:8025 |
| **Meilisearch** | http://localhost:7700 |
| **Redis** | localhost:6379 |
| **MySQL** | localhost:3307 |

## 💻 Primeros Pasos

```bash
# 1. Registrar usuario
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Mi Nombre",
    "email": "email@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'

# 2. Verificar email (ver link en Mailpit)

# 3. Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "email@example.com",
    "password": "password123"
  }'

# 4. Usar token en requests
curl -H "Authorization: Bearer {token}" \
  http://localhost:8000/api/user
```

Ver [docs/API.md](docs/API.md) para documentación completa de endpoints.

## 🛠️ Tecnologías

### Backend
- **Laravel 12.38.1** - Framework PHP moderno y escalable
- **PHP 8.4.14** - Lenguaje backend
- **Sanctum** - Autenticación basada en tokens JWT
- **Eloquent ORM** - Manejo elegante de base de datos
- **Meilisearch** - Motor de búsqueda de alto rendimiento
- **Redis** - Cache y sesiones distribuidas

### Frontend (Próximamente)
- **React 18+** - Librería de UI moderna para web
- **React Native** - Desarrollo de app móvil (iOS/Android)
- **Tailwind CSS** - Estilos modernos y responsive
- **TypeScript** - Tipado estático para confiabilidad

### Infraestructura & DevOps
- **Docker & Docker Compose** - Containerización y orquestación
- **MySQL 8.0** - Base de datos relacional
- **Nginx** - Web server de alto rendimiento
- **Mailpit** - Testing local de emails
- **Redis** - Caché distribuida

### Calidad & Testing
- **PHPUnit** - Testing unitario y funcional
- **Vite** - Build tool moderno para frontend
- **Composer** - Gestor de dependencias PHP
- **Git** - Control de versiones

### Extras
- **Soporte Multi-idioma** - i18n integrado
- **Mailtrap/Mailpit** - Integración email
- **CORS Configurado** - Seguridad cross-domain

## 📊 Estado del Proyecto (v1.0.0)

| Aspecto | Estado |
|--------|--------|
| **Backend API** | ✅ Completo y funcional |
| **Módulo Financiero** | ✅ Production-ready |
| **Testing** | ✅ 114/114 tests pasando |
| **Documentación** | ✅ Centralizada en `docs/` |
| **Email System** | ✅ 3 templates profesionales |
| **Seguridad** | ✅ JWT + Roles + Validación |
| **Frontend Web** | 🔄 Próxima fase (React) |
| **App Móvil** | 🔄 Próxima fase (React Native) |
| **Multi-idioma** | 🔄 En desarrollo |
| **Reportes/Gráficas** | 🔄 Próxima release |
| **Exportación Datos** | 🔄 Próxima release |
| **Calendario** | 🔄 Próxima release |

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Lee [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)
2. Fork el repositorio
3. Crea una rama de feature: `git checkout -b feat/mi-feature`
4. Haz commits con convención: `git commit -m "feat(api): descripción"`
5. Push y abre un Pull Request

## 📜 Código de Conducta

Esperamos que todos los participantes sigan nuestro [Código de Conducta](docs/CONTRIBUTING.md#código-de-conducta).

## 📄 Licencia

Este proyecto está licenciado bajo la licencia MIT - Ver [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Felondz** - [@Felondz](https://github.com/Felondz)

## 📞 Soporte y Contacto

- 📖 **Documentación**: Lee [docs/INDEX.md](docs/INDEX.md)
- 🐛 **Issues**: [GitHub Issues](https://github.com/Felondz/controlApp/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Felondz/controlApp/discussions)

## 🚀 Roadmap

### v1.1.0 (Próximo Release)
- 📅 Calendario de transacciones
- 📊 Reportes y gráficas avanzadas
- 📤 Exportación de datos (CSV, PDF, Excel)
- 🌍 Soporte multi-idioma en API

### v2.0.0 (Futuro - Gestión Integral)
- 🏦 Integración bancaria real
- 💱 Conversión de monedas en tiempo real
- 📱 Aplicación móvil con React Native
- 🎨 Frontend web con React 18+

---

**Última actualización**: 15 de noviembre de 2025 | **Versión**: 1.0.0 | **Status**: 🟢 Production-Ready

<p align="center">
  Hecho con ❤️ para gestión financiera colaborativa
</p>

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
