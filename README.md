# ControlApp - Gestión Integral de Proyectos Financieros

<p align="center">
  <strong>La solución moderna para gestionar proyectos financieros en equipo</strong>
</p>

<p align="center">
  <a href="#-características"><strong>Features</strong></a> •
  <a href="#-instalación-rápida"><strong>Instalación</strong></a> •
  <a href="#-documentación"><strong>Docs</strong></a> •
  <a href="#-tecnologías"><strong>Tech Stack</strong></a> •
  <a href="#-licencia"><strong>Licencia</strong></a>
</p>

---

## 🎯 Características

- ✅ **Autenticación Segura** - Sistema de registro y login con tokens JWT (Sanctum)
- ✅ **Verificación de Email** - Confirmación de correo electrónico personalizada en español
- ✅ **Gestión de Proyectos** - Crear, editar, eliminar y listar proyectos
- ✅ **Sistema de Miembros** - Agregar miembros a proyectos con roles (admin/miembro)
- ✅ **Invitaciones** - Enviar invitaciones personalizadas a nuevos miembros
- ✅ **Gestión de Cuentas** - Crear y gestionar múltiples cuentas por proyecto
- ✅ **Categorías** - Organizar transacciones por categorías personalizables
- ✅ **Transacciones** - Registrar y rastrear transacciones financieras
- ✅ **Búsqueda Avanzada** - Búsqueda rápida con Meilisearch
- ✅ **API RESTful Completa** - Documentada con ejemplos

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
- **Laravel 12.38.1** - Framework PHP moderno
- **PHP 8.4.14** - Lenguaje backend
- **Sanctum** - Autenticación basada en tokens JWT
- **Eloquent ORM** - Manejo de base de datos
- **Meilisearch** - Motor de búsqueda
- **Redis** - Cache y sesiones

### Infraestructura
- **Docker & Docker Compose** - Containerización
- **MySQL 8.0** - Base de datos relacional
- **Mailpit** - Testing de emails
- **Nginx** - Web server

### Características de Desarrollo
- **Vite** - Build tool para frontend
- **Composer** - Gestor de dependencias PHP
- **PHPUnit** - Testing unitario

## 📊 Estadísticas del Proyecto

- 📁 **8 Archivos de Documentación** (4,482 líneas)
- 🔌 **50+ Endpoints de API** completamente documentados
- 🗄️ **8 Tablas de BD** con relaciones complejas
- 🔐 **Sistema de autenticación** seguro con Sanctum
- 📧 **Email system** con templates personalizados en español
- ✅ **100% Dockerizado** para desarrollo consistente

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

### v1.1.0 (Próximo)
- 📅 Calendario de transacciones
- 📊 Reportes y gráficas
- 📤 Exportación de datos (CSV, PDF)

### v2.0.0 (Futuro)
- 🏦 Integración bancaria real
- 💱 Conversión de monedas en tiempo real
- 📱 Aplicación móvil

---

**Última actualización**: 15 de noviembre de 2025 | **Versión**: 1.0.0

<p align="center">
  Hecho con ❤️ para gestión financiera colaborativa
</p>

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
