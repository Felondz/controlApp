# Installation Guide - ControlApp

Guía paso a paso para instalar y configurar ControlApp en tu ambiente local o producción.

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación Local (Docker)](#instalación-local-docker)
3. [Instalación sin Docker](#instalación-sin-docker)
4. [Configuración Post-Instalación](#configuración-post-instalación)
5. [Verificación](#verificación)
6. [Troubleshooting](#troubleshooting)
7. [Instalación en Producción](#instalación-en-producción)

---

## ✅ Requisitos Previos

### Opción 1: Con Docker (Recomendado)

#### Windows
- [ ] Docker Desktop para Windows (≥ 4.0)
- [ ] WSL 2 (Windows Subsystem for Linux 2)
- [ ] Git para Windows
- [ ] 4GB RAM mínimo (8GB recomendado)

**Descargar:**
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [WSL 2](https://docs.microsoft.com/en-us/windows/wsl/install-win10)
- [Git](https://git-scm.com/download/win)

#### macOS
- [ ] Docker Desktop para Mac (≥ 4.0)
- [ ] Git (incluido en Xcode)
- [ ] 4GB RAM mínimo (8GB recomendado)

**Descargar:**
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

#### Linux
- [ ] Docker (≥ 24.0)
- [ ] Docker Compose (≥ 2.20)
- [ ] Git
- [ ] 2GB RAM mínimo (4GB recomendado)

**Instalar:**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose git

# Fedora
sudo dnf install docker docker-compose git

# Iniciar Docker
sudo systemctl start docker
sudo systemctl enable docker

# Agregar usuario a grupo docker
sudo usermod -aG docker $USER
newgrp docker
```

### Opción 2: Sin Docker

#### Requisitos Mínimos
- [ ] PHP 8.4 o superior
- [ ] Composer 2.6 o superior
- [ ] MySQL 8.0 o superior
- [ ] Redis 6.0 o superior (opcional pero recomendado)
- [ ] Git

#### Requisitos PHP
```bash
# Extensiones requeridas
php -m | grep -E "(bcmath|ctype|fileinfo|json|mbstring|openssl|pdo|tokenizer|xml)"

# Deberían aparecer todas estas extensiones
```

**Instalar PHP y Extensiones:**
```bash
# Ubuntu/Debian
sudo apt-get install php8.4 php8.4-bcmath php8.4-ctype \
  php8.4-fileinfo php8.4-json php8.4-mbstring \
  php8.4-openssl php8.4-pdo php8.4-tokenizer php8.4-xml \
  php8.4-mysql php8.4-redis

# macOS (con Homebrew)
brew install php@8.4 mysql redis composer
```

---

## 🐳 Instalación Local (Docker)

### Paso 1: Clonar el Repositorio

```bash
# Clonar
git clone https://github.com/Felondz/controlApp.git
cd controlApp

# O si clonaste tu fork
git clone https://github.com/tu-usuario/controlApp.git
cd controlApp
git remote add upstream https://github.com/Felondz/controlApp.git
```

### Paso 2: Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus valores (opcional, hay valores por defecto)
nano .env  # o usa tu editor preferido
```

**Valores clave en `.env`:**
```env
APP_NAME=ControlApp
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=sail
DB_PASSWORD=password

REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=tu_username_aqui
MAIL_PASSWORD=tu_password_aqui
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="hello@example.com"

MEILISEARCH_HOST=http://meilisearch:7700
```

### Paso 3: Obtener Credenciales Mailtrap (Opcional)

1. Ir a [Mailtrap.io](https://mailtrap.io)
2. Crear cuenta (es gratis)
3. Ir a Settings → Integrations
4. Copiar credenciales SMTP
5. Actualizar `.env`:
   ```env
   MAIL_USERNAME=6362c6f9e86312
   MAIL_PASSWORD=9c42ba76539b3c
   ```

### Paso 4: Levantar Contenedores

```bash
# Construir e iniciar servicios
docker compose up -d

# Esto levantará:
# - Laravel (puerto 8000)
# - MySQL (puerto 3307)
# - Redis (puerto 6379)
# - Meilisearch (puerto 7700)
# - Mailpit (puerto 8025)

# Verificar que todos estén corriendo
docker compose ps
```

**Esperado:**
```
NAME                COMMAND                  SERVICE      STATUS
mysql               "docker-entrypoint..."   mysql        Up 2 minutes
redis               "redis-server..."        redis        Up 2 minutes
laravel.test        "start-container"        laravel.test Up 2 minutes
meilisearch         "./meilisearch..."       meilisearch  Up 2 minutes
mailpit             "/mailpit..."            mailpit      Up 2 minutes
```

### Paso 5: Instalar Dependencias

```bash
# Instalar composer packages
docker compose exec -T laravel.test composer install

# Esto descargará todas las dependencias definidas en composer.json
```

### Paso 6: Generar Application Key

```bash
docker compose exec laravel.test php artisan key:generate

# Esto genera una clave única en tu .env
APP_KEY=base64:xxxxxxxxxx...
```

### Paso 7: Ejecutar Migraciones

```bash
# Ejecutar todas las migraciones
docker compose exec laravel.test php artisan migrate

# Output esperado:
# Migrating: 2025_11_14_191457_create_proyectos_table
# Migrated:  2025_11_14_191457_create_proyectos_table
# ...
```

### Paso 8: Crear Datos de Prueba (Opcional)

```bash
# Ejecutar seeders
docker compose exec laravel.test php artisan db:seed

# O hacer migrate + seed de una vez
docker compose exec laravel.test php artisan migrate:fresh --seed
```

### Paso 9: Generar Symlink de Storage

```bash
docker compose exec laravel.test php artisan storage:link

# Esto crea un symlink public/storage → storage/app/public
```

### ✅ ¡Listo!

Tu aplicación está lista en:
- **App**: http://localhost:8000
- **API**: http://localhost:8000/api
- **Mailpit**: http://localhost:8025
- **Meilisearch**: http://localhost:7700

---

## 📦 Instalación sin Docker

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/Felondz/controlApp.git
cd controlApp
```

### Paso 2: Instalar Dependencias PHP

```bash
# Con Composer
composer install

# Esto instalará todas las dependencias en vendor/
```

### Paso 3: Configurar Variables de Entorno

```bash
cp .env.example .env

# Editar .env para conectar a tu BD local
nano .env
```

**Valores principales:**
```env
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=controlapp
DB_USERNAME=root
DB_PASSWORD=tu_password

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

### Paso 4: Crear Base de Datos

```bash
# Si MySQL está corriendo en tu sistema
mysql -u root -p

# En la consola MySQL:
CREATE DATABASE controlapp;
EXIT;
```

### Paso 5:4. **Generar Clave de Aplicación**
   ```bash
   php artisan key:generate
   ```

5. **Ejecutar Migraciones y Seeders**
   ```bash
   php artisan migrate --seed
   ```

6. **Inicializar Índice de Búsqueda (Meilisearch)**
   ```bash
   php artisan scout:import "App\Models\User"
   php artisan scout:import "App\Models\Proyecto"
   ```

7. **Instalar Dependencias Frontend (PNPM OBLIGATORIO)**
   ```bash
   # Instalar PNPM si no lo tienes
   npm install -g pnpm
   
   # Instalar dependencias
   pnpm install --frozen-lockfile
   pnpm run build
   ```
   
   > **IMPORTANTE**: Este proyecto usa PNPM exclusivamente por seguridad. NUNCA uses npm o yarn.

### Paso 8: Generar Symlink de Storage

```bash
php artisan storage:link
```

### Paso 8: Iniciar Servidor Local

```bash
# Opción 1: Servidor built-in de Laravel
php artisan serve

# Opción 2: En puerto específico
php artisan serve --port=8000

# Opción 3: Accesible desde otras máquinas
php artisan serve --host=0.0.0.0 --port=8000
```

### Paso 9: Iniciar Queue Worker (Opcional, para emails)

```bash
# En otra terminal
php artisan queue:work

# Esto procesa emails en background
```

---

## ⚙️ Configuración Post-Instalación

### 1. Verificar Permisos (solo Linux/macOS)

```bash
# Dar permisos de escritura a storage y bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Si usas grupo www-data (nginx):
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### 2. Limpiar Caché

```bash
docker compose exec laravel.test php artisan config:clear
docker compose exec laravel.test php artisan cache:clear
docker compose exec laravel.test php artisan view:clear
```

O sin Docker:
```bash
php artisan optimize:clear
```

### 3. Compilar Assets (Frontend)

> **IMPORTANTE**: Este proyecto usa PNPM exclusivamente por seguridad. NUNCA uses npm o yarn.

```bash
# Instalar PNPM globalmente (si no lo tienes)
npm install -g pnpm

# Con PNPM
pnpm install --frozen-lockfile
pnpm run dev

# O con Docker
docker compose exec laravel.test pnpm install --frozen-lockfile
docker compose exec laravel.test pnpm run dev
```

### 4. Crear Usuario Administrador (Automatizado)

El sistema incluye una automatización para crear o actualizar al SuperAdmin usando variables de entorno.

1.  **Configurar credenciales en `.env`:**
    ```env
    SUPER_ADMIN_EMAIL=admin@tudominio.com
    SUPER_ADMIN_PASSWORD=TuPasswordSeguro123!
    ```

2.  **Ejecutar el Seeder:**
    ```bash
    # Con Docker
    docker compose exec laravel.test php artisan db:seed

    # O en producción
    docker exec -it controlapp_app php artisan db:seed
    ```

    > **Nota:** Este comando es *idempotente*. Si el usuario ya existe, actualizará su contraseña y permisos sin duplicarlo.

3.  **Verificar:**
    Intenta iniciar sesión con las credenciales configuradas.

#### Método Manual (Legacy)
Si prefieres hacerlo manualmente vía Tinker:
```bash
docker compose exec laravel.test php artisan tinker
>>> \App\Models\User::factory()->create(['email' => 'admin@example.com', 'is_super_admin' => true]);
```

---

## ✔️ Verificación

### Checklist de Instalación

```bash
# 1. Verificar que todos los servicios estén corriendo
docker compose ps

# 2. Probar conexión a la API
curl http://localhost:8000/api/user

# 3. Verificar BD
docker compose exec -T mysql mysql -h mysql -u sail -ppassword laravel \
  -e "SHOW TABLES;"

# 4. Verificar Redis
docker compose exec redis redis-cli ping

# 5. Verificar Meilisearch
curl http://localhost:7700/health

# 6. Ver logs
docker compose logs -f laravel.test
```

### Primeras Acciones

```bash
# 1. Registrar un usuario
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'

# 2. Verificar email (obtener el hash)
HASH=$(echo -n "test@example.com" | sha1sum | cut -d' ' -f1)

# 3. Hacer click en enlace (o simular)
curl http://localhost:8000/api/email/verify/1/$HASH

# 4. Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Guardar el token del response
TOKEN="1|eyJhbGc..."

# 5. Probar endpoint autenticado
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/user
```

---

## 🔧 Troubleshooting

### "Connection refused" en MySQL

**Problema**: No puedo conectar a la BD

**Soluciones**:
```bash
# Verificar que container está corriendo
docker compose ps mysql

# Reiniciar container
docker compose restart mysql

# Ver logs
docker compose logs mysql

# Reconstruir
docker compose down
docker compose up -d mysql
```

### "SQLSTATE[HY000]: General error: 2006 MySQL has gone away"

**Problema**: Conexión a BD se perdió

**Solución**:
```bash
# Reconectar
docker compose down
docker compose up -d

# Ejecutar migraciones nuevamente
docker compose exec laravel.test php artisan migrate
```

### "Permission denied" en storage

**Problema**: No puedo escribir en la carpeta storage

**Solución (Docker)**:
```bash
# Dentro del contenedor, los permisos se heredan
# Probablemente ya esté bien, pero si no:
docker compose exec laravel.test chmod -R 777 storage bootstrap/cache
```

**Solución (Local - Linux/macOS)**:
```bash
chmod -R 775 storage bootstrap/cache
```

### "Port already in use"

**Problema**: El puerto 8000, 3307, etc. ya está en uso

**Solución**:
```bash
# Ver qué está usando el puerto
lsof -i :8000

# Cambiar puerto en docker-compose.yml
# Buscar "8000:8000" y cambiar a "8080:8000"

# O matar el proceso
sudo kill -9 <PID>
```

### "No such file or directory: .env"

**Problema**: Falta el archivo `.env`

**Solución**:
```bash
cp .env.example .env
```

### Mailtrap no está enviando emails

**Problema**: Los emails no se reciben

**Soluciones**:
```bash
# 1. Verificar credenciales en .env
# (Ir a Mailtrap.io y copiar credenciales correctas)

# 2. Verificar que Mailpit está corriendo
docker compose ps mailpit

# 3. Ver emails en Mailpit (no Mailtrap local)
# Ir a http://localhost:8025

# 4. Limpiar caché
docker compose exec laravel.test php artisan config:clear
```

### Tests fallando

**Problema**: Al ejecutar tests, hay errores

**Solución**:
```bash
# Asegurar que existe BD de testing
docker compose exec laravel.test php artisan migrate --env=testing

# Ejecutar tests
docker compose exec laravel.test php artisan test

# Ver output más detallado
docker compose exec laravel.test php artisan test --verbose
```

---

## 🚀 Instalación en Producción

### Consideraciones de Producción

⚠️ **NO usar esta guía para producción sin considerar:**

- 🔒 Seguridad (SSL/TLS, firewalls, etc.)
- 📊 Performance (caché, CDN, etc.)
- 📈 Escalabilidad (load balancers, etc.)
- 🔐 Backups y disaster recovery
- 📝 Logs y monitoring
- ⚡ Queue workers separados

### Stack Recomendado

```
┌─────────────────────────────────────┐
│  Cloudflare / Let's Encrypt (SSL)   │
├─────────────────────────────────────┤
│  Load Balancer (nginx / HAProxy)    │
├─────────────────────────────────────┤
│  App Servers (Laravel) x N           │
│  └─ Containers or VMs               │
├─────────────────────────────────────┤
│  Queue Workers (Supervisor)          │
├─────────────────────────────────────┤
│  Database (MySQL RDS)                │
├─────────────────────────────────────┤
│  Cache (Redis)                       │
├─────────────────────────────────────┤
│  Search (Meilisearch)                │
├─────────────────────────────────────┤
│  Email (SendGrid / AWS SES)          │
├─────────────────────────────────────┤
│  Monitoring (New Relic / Datadog)    │
├─────────────────────────────────────┤
│  Backups (AWS S3)                    │
└─────────────────────────────────────┘
```

### Deployment Options

#### 1. Docker en VPS (DigitalOcean, Linode, etc.)

```bash
# Similar a instalación local pero con HTTPS

# 1. SSH en servidor
ssh root@your-server.com

# 2. Instalar Docker
curl -sSL https://get.docker.com | sh

# 3. Clonar repo
git clone https://github.com/Felondz/controlApp.git
cd controlApp

# 4. Configurar .env para producción
nano .env
# - APP_ENV=production
# - APP_DEBUG=false
# - Usar SendGrid/AWS SES en lugar de Mailtrap
# - Usar RDS MySQL en lugar de container

# 5. Usar docker-compose.prod.yml
# (versión optimizada sin Mailpit, etc.)

# 6. Configurar SSL con Let's Encrypt
# Usar nginx como reverse proxy con certbot
```

#### 2. Heroku (Fácil pero más caro)

```bash
# 1. Instalar Heroku CLI
brew tap heroku/brew && brew install heroku

# 2. Login
heroku login

# 3. Crear app
heroku create controlapp

# 4. Agregar buildpacks
heroku buildpacks:add heroku/php
heroku buildpacks:add heroku/nodejs

# 5. Agregar BD
heroku addons:create cleardb:ignite

# 6. Configurar variables
heroku config:set APP_ENV=production APP_DEBUG=false

# 7. Deploy
git push heroku main
```

#### 3. Laravel Forge (Recomendado)

```bash
# 1. Ir a laravel.forge
# 2. Conectar con DigitalOcean/AWS account
# 3. Crear servidor (Forge lo configura automáticamente)
# 4. Conectar repositorio GitHub
# 5. Deploy automático con cada push
```

---

## 📚 Siguientes Pasos

Después de instalar:

1. 📖 Lee la [Documentación de API](./API.md)
2. 🔐 Entiende el [Sistema de Autenticación](./AUTHENTICATION.md)
3. 📊 Explora la [Estructura de BD](./DATABASE.md)
4. 🤝 Lee [Cómo Contribuir](./CONTRIBUTING.md)
5. 🚀 Comienza a desarrollar o desplegar

---

## 💬 Ayuda

Si tienes problemas durante la instalación:

1. 🔍 Busca en [GitHub Issues](https://github.com/Felondz/controlApp/issues)
2. 📖 Lee la [Documentación](../docs/)
3. 💬 Abre un nuevo [Issue](https://github.com/Felondz/controlApp/issues/new)
4. 📧 Contacta a maintainers

---

**Última actualización**: 15 de noviembre de 2025
