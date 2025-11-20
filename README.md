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
- ✅ **🌍 Internacionalización (i18n)** - Sistema completo multilingüe (Español, Inglés)

### Módulo Financiero (Feature v1.0.0)
- ✅ **Gestión de Cuentas** - Múltiples cuentas por proyecto (banco, efectivo, tarjeta, digital)
- ✅ **Categorías Personalizables** - Organizar transacciones por categorías con colores e iconos
- ✅ **Transacciones** - Registrar ingresos y egresos con tracking automático de saldo
- ✅ **Sincronización de Saldo** - Observer pattern para actualización automática

### Infraestructura
- ✅ **API RESTful Completa** - 50+ endpoints documentados
- ✅ **Búsqueda Avanzada** - Motor Meilisearch integrado
- ✅ **Email System Profesional** - 3 templates estandarizados (verificación, invitación, reset)
- ✅ **Testing Completo** - 131/131 tests pasando (PHPUnit)
- ✅ **Seguridad Auditada** - Policies, FormRequest, Rate Limiting, CORS hardened

## 🚀 Roadmap & Funcionalidades Futuras

### v1.1.0 (Próximo Release)
- 📅 **Calendario** - Vista de transacciones en calendario
- 📊 **Reportes y Gráficas** - Visualización avanzada de datos financieros
- 📤 **Exportación de Datos** - Descarga en CSV, PDF, Excel
- 🌍 **Cambio Dinámico de Idioma** - Selector de idioma en UI (i18n v2)

### v2.0.0+ (Futuro - Gestión Integral)
- 🎯 **Gestión de Tareas** - Sistema de tareas y subtareas por proyecto
- 📋 **Tableros Kanban** - Organización visual de flujos de trabajo
- 🔄 **Integración Bancaria** - Conexión con APIs bancarias reales
- 💱 **Conversión Multi-moneda** - Soporte para múltiples divisas
- 📱 **Aplicación Móvil** - React Native app (iOS/Android)
- 🎨 **Frontend Web Completo** - React 19+ con UI moderna y responsive

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

Para guía completa, ver [docs/02-development/INSTALLATION.md](docs/02-development/INSTALLATION.md)

## 📚 Documentación

Documentación profesional completa en la carpeta `docs/`, estructurada por temas:

### 📍 Comienza Aquí
| Archivo | Contenido |
|---------|-----------|
| **[docs/01-core/INDEX.md](docs/01-core/INDEX.md)** | Índice central - Comienza aquí |
| **[docs/01-core/CHANGELOG_DETAILED.md](docs/01-core/CHANGELOG_DETAILED.md)** | Historial detallado de cambios |
| **[docs/01-core/QUICK_REFERENCE.md](docs/01-core/QUICK_REFERENCE.md)** | Comandos y atajos rápidos |

### 💻 Para Desarrolladores
| Archivo | Contenido |
|---------|-----------|
| **[docs/02-development/INSTALLATION.md](docs/02-development/INSTALLATION.md)** | Guía paso a paso de instalación |
| **[docs/02-development/API.md](docs/02-development/API.md)** | 50+ endpoints, rate limiting, ejemplos |
| **[docs/02-development/AUTHENTICATION.md](docs/02-development/AUTHENTICATION.md)** | Sistema de autenticación segura |
| **[docs/02-development/AUTHORIZATION_VALIDATION.md](docs/02-development/AUTHORIZATION_VALIDATION.md)** | Policies, FormRequest, validación |
| **[docs/02-development/DATABASE.md](docs/02-development/DATABASE.md)** | Esquema de BD, relaciones |
| **[docs/02-development/CONTRIBUTING.md](docs/02-development/CONTRIBUTING.md)** | Cómo contribuir al proyecto |

### 🤖 Para IAs Colaborando
| Archivo | Contenido |
|---------|-----------|
| **[docs/03-ia-collaboration/AI_GUIDELINES.md](docs/03-ia-collaboration/AI_GUIDELINES.md)** | Normas y flujos de trabajo |
| **[docs/03-ia-collaboration/ONBOARDING_FOR_NEW_AIs.md](docs/03-ia-collaboration/ONBOARDING_FOR_NEW_AIs.md)** | Onboarding rápido para nuevas IAs |

### 🧪 Testing
| Archivo | Contenido |
|---------|-----------|
| **[docs/04-testing/TESTING.md](docs/04-testing/TESTING.md)** | Guía general de testing |
| **[docs/04-testing/TESTING_ARCHITECTURE.md](docs/04-testing/TESTING_ARCHITECTURE.md)** | Estrategia y arquitectura de tests |
| **[docs/04-testing/TESTING_SCRIPTS.md](docs/04-testing/TESTING_SCRIPTS.md)** | Scripts de testing disponibles |

### 🔐 Seguridad
| Archivo | Contenido |
|---------|-----------|
| **[docs/06-security/README.md](docs/06-security/README.md)** | Overview de seguridad |
| **[docs/06-security/SECURITY_AUDIT.md](docs/06-security/SECURITY_AUDIT.md)** | Reporte completo de auditoría |
| **[docs/06-security/PRODUCTION_DEPLOYMENT.md](docs/06-security/PRODUCTION_DEPLOYMENT.md)** | Checklist de deployment |

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

Ver [docs/02-development/API.md](docs/02-development/API.md) para documentación completa de endpoints.

## 🛠️ Tecnologías

### Backend
- **Laravel 12.38.1** - Framework PHP moderno y escalable
- **PHP 8.2** - Lenguaje backend con tipado estricto
- **Sanctum** - Autenticación basada en tokens API
- **Eloquent ORM** - Manejo elegante de base de datos con relaciones
- **Meilisearch** - Motor de búsqueda de alto rendimiento
- **Redis** - Cache y sesiones distribuidas

### Frontend
- **React 19** - Librería de UI moderna y reactiva
- **Inertia.js** - Adaptador entre Laravel y React (sin API REST)
- **React Router DOM** - Enrutamiento cliente-lado
- **Vite** - Build tool ultra-rápido (HMR en <100ms)
- **Tailwind CSS** - Utility-first CSS para estilos responsive
- **Axios** - Cliente HTTP con interceptores para autenticación
- **i18next & react-i18next** - Sistema multilingüe (Español, Inglés)
- **JavaScript** - Lenguaje dinámico con path aliases configurados

### Base de Datos
- **MySQL 8.0** - Base de datos relacional altamente confiable
- **Migrations** - Control de versiones de esquema
- **Seeders & Factories** - Data fixtures para testing

### Infraestructura & DevOps
- **Docker & Docker Compose** - Containerización multi-servicio
- **Apache 2.4** - Web server con mod_rewrite para URLs limpias
- **GitHub Container Registry** - Almacenamiento de imágenes Docker
- **GitHub Actions** - CI/CD automático (build, test, deploy)
- **Self-hosted Runner** - Despliegue en homelab privado
- **Mailpit** - Testing local de emails SMTP

### Calidad & Testing
- **PHPUnit** - Testing unitario, funcional e integración (154 tests)
- **Composer** - Gestor de dependencias PHP
- **npm/Node.js** - Gestor de dependencias frontend
- **PHPStan Level 8** - Análisis estático PHP
- **Pint** - Code style automatizado

### Seguridad & Monitoring
- **Laravel Policies** - Autorización granular por recurso
- **Form Requests** - Validación centralizada
- **Rate Limiting** - Protección contra abuso API
- **CORS Configurado** - Seguridad cross-domain hardened
- **Password Hashing** - bcrypt con opciones seguras
- **Email Verification** - Confirmación de cuenta obligatoria

### Documentación & Colaboración
- **Markdown** - Documentación completa en `docs/`
- **API Documentation** - 50+ endpoints documentados
- **AI Collaboration Guides** - Onboarding para IAs
- **CHANGELOG** - Historial detallado de cambios

## 📊 Estado del Proyecto (v1.0.0)

| Aspecto | Estado |
|--------|--------|
| **Backend API** | ✅ Completo y production-ready |
| **Módulo Financiero** | ✅ Funcional - 50+ endpoints |
| **Testing** | ✅ 154/154 tests configurados (342 assertions) |
| **Documentación** | ✅ Completa y estructurada en `docs/` |
| **Email System** | ✅ 3 templates profesionales + Mailpit |
| **Seguridad** | ✅ Auditoría completa - Policies + FormRequest + Rate Limiting |
| **Frontend Web** | 🔄 En desarrollo - React 19 + Inertia + Vite |
| **CI/CD Pipeline** | ✅ GitHub Actions - Build, Test, Deploy automático |
| **Docker & Containerización** | ✅ Dev + Prod compose configurados |
| **App Móvil** | 🔄 Próxima fase (React Native) |
| **Multi-idioma** | 🔄 En desarrollo |
| **Reportes/Gráficas** | 🔄 Próxima release (v1.1.0) |
| **Exportación Datos** | 🔄 Próxima release (v1.1.0) |
| **Calendario** | 🔄 Próxima release (v1.1.0) |

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Lee [docs/02-development/CONTRIBUTING.md](docs/02-development/CONTRIBUTING.md)
2. Fork el repositorio
3. Crea una rama de feature: `git checkout -b feat/mi-feature`
4. Haz commits con convención: `git commit -m "feat(api): descripción"`
5. Push y abre un Pull Request

## 📜 Código de Conducta

Esperamos que todos los participantes sigan nuestro [Código de Conducta](docs/02-development/CONTRIBUTING.md#código-de-conducta).

## 📄 Licencia

Este proyecto está licenciado bajo la licencia MIT - Ver [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Felondz** - [@Felondz](https://github.com/Felondz)

## 📞 Soporte y Contacto

- 📖 **Documentación**: Lee [docs/01-core/INDEX.md](docs/01-core/INDEX.md)
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

**Última actualización**: 18 de noviembre de 2025 | **Versión**: 1.0.0 | **Status**: 🟢 Production-Ready (Auditoría de Seguridad Completada)

<p align="center">
  Hecho con ❤️ para gestión financiera colaborativa
</p>

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
