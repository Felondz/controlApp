# Installation Guide - ControlApp

Step-by-step guide to install and configure ControlApp in your local environment or production.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Installation (Docker)](#local-installation-docker)
3. [Installation without Docker](#installation-without-docker)
4. [Post-Installation Configuration](#post-installation-configuration)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)
7. [Production Installation](#production-installation)

---

## ✅ Prerequisites

### Option 1: With Docker (Recommended)

#### Windows
- [ ] Docker Desktop for Windows (≥ 4.0)
- [ ] WSL 2 (Windows Subsystem for Linux 2)
- [ ] Git for Windows
- [ ] 4GB RAM minimum (8GB recommended)

**Download:**
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [WSL 2](https://docs.microsoft.com/en-us/windows/wsl/install-win10)
- [Git](https://git-scm.com/download/win)

#### macOS
- [ ] Docker Desktop for Mac (≥ 4.0)
- [ ] Git (included in Xcode)
- [ ] 4GB RAM minimum (8GB recommended)

**Download:**
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

#### Linux
- [ ] Docker (≥ 24.0)
- [ ] Docker Compose (≥ 2.20)
- [ ] Git
- [ ] 2GB RAM minimum (4GB recommended)

**Install:**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose git

# Fedora
sudo dnf install docker docker-compose git

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### Option 2: Without Docker

#### Minimum Requirements
- [ ] PHP 8.4 or higher
- [ ] Composer 2.6 or higher
- [ ] MySQL 8.0 or higher
- [ ] Redis 6.0 or higher (optional but recommended)
- [ ] Git

#### PHP Requirements
```bash
# Required extensions
php -m | grep -E "(bcmath|ctype|fileinfo|json|mbstring|openssl|pdo|tokenizer|xml)"

# All these extensions should appear
```

**Install PHP and Extensions:**
```bash
# Ubuntu/Debian
sudo apt-get install php8.4 php8.4-bcmath php8.4-ctype \
  php8.4-fileinfo php8.4-json php8.4-mbstring \
  php8.4-openssl php8.4-pdo php8.4-tokenizer php8.4-xml \
  php8.4-mysql php8.4-redis

# macOS (with Homebrew)
brew install php@8.4 mysql redis composer
```

---

## 🐳 Local Installation (Docker)

### Step 1: Clone the Repository

```bash
# Clone
git clone https://github.com/Felondz/controlApp.git
cd controlApp

# Or if you cloned your fork
git clone https://github.com/your-username/controlApp.git
cd controlApp
git remote add upstream https://github.com/Felondz/controlApp.git
```

### Step 2: Configure Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit .env with your values (optional, there are default values)
nano .env  # or use your preferred editor
```

**Key values in `.env`:**
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
MAIL_USERNAME=your_username_here
MAIL_PASSWORD=your_password_here
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="hello@example.com"

MEILISEARCH_HOST=http://meilisearch:7700
```

### Step 3: Get Mailtrap Credentials (Optional)

1. Go to [Mailtrap.io](https://mailtrap.io)
2. Create account (it's free)
3. Go to Settings → Integrations
4. Copy SMTP credentials
5. Update `.env`:
   ```env
   MAIL_USERNAME=6362c6f9e86312
   MAIL_PASSWORD=9c42ba76539b3c
   ```

### Step 4: Start Containers

```bash
# Build and start services
docker compose up -d

# This will start:
# - Laravel (port 8000)
# - MySQL (port 3307)
# - Redis (port 6379)
# - Meilisearch (port 7700)
# - Mailpit (port 8025)

# Verify all are running
docker compose ps
```

**Expected:**
```
NAME                COMMAND                  SERVICE      STATUS
mysql               "docker-entrypoint..."   mysql        Up 2 minutes
redis               "redis-server..."        redis        Up 2 minutes
laravel.test        "start-container"        laravel.test Up 2 minutes
meilisearch         "./meilisearch..."       meilisearch  Up 2 minutes
mailpit             "/mailpit..."            mailpit      Up 2 minutes
```

### Step 5: Install Dependencies

```bash
# Install composer packages
docker compose exec -T laravel.test composer install

# This will download all dependencies defined in composer.json
```

### Step 6: Generate Application Key

```bash
docker compose exec laravel.test php artisan key:generate

# This generates a unique key in your .env
APP_KEY=base64:xxxxxxxxxx...
```

### Step 7: Run Migrations

```bash
# Run all migrations
docker compose exec laravel.test php artisan migrate

# Expected Output:
# Migrating: 2025_11_14_191457_create_proyectos_table
# Migrated:  2025_11_14_191457_create_proyectos_table
# ...
```

### Step 8: Create Test Data (Optional)

```bash
# Run seeders
docker compose exec laravel.test php artisan db:seed

# Or migrate + seed at once
docker compose exec laravel.test php artisan migrate:fresh --seed
```

### Step 9: Generate Storage Symlink

```bash
docker compose exec laravel.test php artisan storage:link

# This creates a symlink public/storage → storage/app/public
```

### ✅ Ready!

Your application is ready at:
- **App**: http://localhost:8000
- **API**: http://localhost:8000/api
- **Mailpit**: http://localhost:8025
- **Meilisearch**: http://localhost:7700

---

## 📦 Installation without Docker

### Step 1: Clone the Repository

```bash
git clone https://github.com/Felondz/controlApp.git
cd controlApp
```

### Step 2: Install PHP Dependencies

```bash
# With Composer
composer install

# This will install all dependencies in vendor/
```

### Step 3: Configure Environment Variables

```bash
cp .env.example .env

# Edit .env to connect to your local DB
nano .env
```

**Main values:**
```env
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=controlapp
DB_USERNAME=root
DB_PASSWORD=your_password

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

### Step 4: Create Database

```bash
# If MySQL is running on your system
mysql -u root -p

# In MySQL console:
CREATE DATABASE controlapp;
EXIT;
```

### Step 5: Generate Application Key
   ```bash
   php artisan key:generate
   ```

### Step 6: Run Migrations and Seeders
   ```bash
   php artisan migrate --seed
   ```

### Step 7: Initialize Search Index (Meilisearch)
   ```bash
   php artisan scout:import "App\Models\User"
   php artisan scout:import "App\Models\Proyecto"
   ```

### Step 8: Install Frontend Dependencies
   ```bash
   npm install
   npm run build
   ```

### Step 9: Generate Storage Symlink

```bash
php artisan storage:link
```

### Step 10: Start Local Server

```bash
# Option 1: Laravel built-in server
php artisan serve

# Option 2: On specific port
php artisan serve --port=8000

# Option 3: Accessible from other machines
php artisan serve --host=0.0.0.0 --port=8000
```

### Step 11: Start Queue Worker (Optional, for emails)

```bash
# In another terminal
php artisan queue:work

# This processes emails in background
```

---

## ⚙️ Post-Installation Configuration

### 1. Verify Permissions (Linux/macOS only)

```bash
# Give write permissions to storage and bootstrap/cache
chmod -R 775 storage bootstrap/cache

# If using www-data group (nginx):
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### 2. Clear Cache

```bash
docker compose exec laravel.test php artisan config:clear
docker compose exec laravel.test php artisan cache:clear
docker compose exec laravel.test php artisan view:clear
```

Or without Docker:
```bash
php artisan optimize:clear
```

### 3. Compile Assets (Frontend)

```bash
# With npm
npm install
npm run dev

# Or with Docker
docker compose exec laravel.test npm install
docker compose exec laravel.test npm run dev
```

### 4. Create Administrator User (Automated)

The system includes automation to create or update the SuperAdmin using environment variables.

1.  **Configure credentials in `.env`:**
    ```env
    SUPER_ADMIN_EMAIL=admin@yourdomain.com
    SUPER_ADMIN_PASSWORD=YourSecurePassword123!
    ```

2.  **Run the Seeder:**
    ```bash
    # With Docker
    docker compose exec laravel.test php artisan db:seed

    # Or in production
    docker exec -it controlapp_app php artisan db:seed
    ```

    > **Note:** This command is *idempotent*. If the user already exists, it will update their password and permissions without duplicating.

3.  **Verify:**
    Try logging in with the configured credentials.

#### Manual Method (Legacy)
If you prefer to do it manually via Tinker:
```bash
docker compose exec laravel.test php artisan tinker
>>> \App\Models\User::factory()->create(['email' => 'admin@example.com', 'is_super_admin' => true]);
```

---

## ✔️ Verification

### Installation Checklist

```bash
# 1. Verify all services are running
docker compose ps

# 2. Test API connection
curl http://localhost:8000/api/user

# 3. Verify DB
docker compose exec -T mysql mysql -h mysql -u sail -ppassword laravel \
  -e "SHOW TABLES;"

# 4. Verify Redis
docker compose exec redis redis-cli ping

# 5. Verify Meilisearch
curl http://localhost:7700/health

# 6. View logs
docker compose logs -f laravel.test
```

### First Actions

```bash
# 1. Register a user
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'

# 2. Verify email (get hash)
HASH=$(echo -n "test@example.com" | sha1sum | cut -d' ' -f1)

# 3. Click link (or simulate)
curl http://localhost:8000/api/email/verify/1/$HASH

# 4. Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Save token from response
TOKEN="1|eyJhbGc..."

# 5. Test authenticated endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/user
```

---

## 🔧 Troubleshooting

### "Connection refused" in MySQL

**Problem**: Cannot connect to DB

**Solutions**:
```bash
# Verify container is running
docker compose ps mysql

# Restart container
docker compose restart mysql

# View logs
docker compose logs mysql

# Rebuild
docker compose down
docker compose up -d mysql
```

### "SQLSTATE[HY000]: General error: 2006 MySQL has gone away"

**Problem**: DB connection lost

**Solution**:
```bash
# Reconnect
docker compose down
docker compose up -d

# Run migrations again
docker compose exec laravel.test php artisan migrate
```

### "Permission denied" in storage

**Problem**: Cannot write to storage folder

**Solution (Docker)**:
```bash
# Inside container, permissions are inherited
# Probably fine, but if not:
docker compose exec laravel.test chmod -R 777 storage bootstrap/cache
```

**Solution (Local - Linux/macOS)**:
```bash
chmod -R 775 storage bootstrap/cache
```

### "Port already in use"

**Problem**: Port 8000, 3307, etc. already in use

**Solution**:
```bash
# See what is using the port
lsof -i :8000

# Change port in docker-compose.yml
# Find "8000:8000" and change to "8080:8000"

# Or kill the process
sudo kill -9 <PID>
```

### "No such file or directory: .env"

**Problem**: Missing `.env` file

**Solution**:
```bash
cp .env.example .env
```

### Mailtrap not sending emails

**Problem**: Emails not received

**Solutions**:
```bash
# 1. Verify credentials in .env
# (Go to Mailtrap.io and copy correct credentials)

# 2. Verify Mailpit is running
docker compose ps mailpit

# 3. View emails in Mailpit (not local Mailtrap)
# Go to http://localhost:8025

# 4. Clear cache
docker compose exec laravel.test php artisan config:clear
```

### Tests failing

**Problem**: Errors when running tests

**Solution**:
```bash
# Ensure testing DB exists
docker compose exec laravel.test php artisan migrate --env=testing

# Run tests
docker compose exec laravel.test php artisan test

# View more detailed output
docker compose exec laravel.test php artisan test --verbose
```

---

## 🚀 Production Installation

### Production Considerations

⚠️ **DO NOT use this guide for production without considering:**

- 🔒 Security (SSL/TLS, firewalls, etc.)
- 📊 Performance (cache, CDN, etc.)
- 📈 Scalability (load balancers, etc.)
- 🔐 Backups and disaster recovery
- 📝 Logs and monitoring
- ⚡ Separate queue workers

### Recommended Stack

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

#### 1. Docker on VPS (DigitalOcean, Linode, etc.)

```bash
# Similar to local installation but with HTTPS

# 1. SSH into server
ssh root@your-server.com

# 2. Install Docker
curl -sSL https://get.docker.com | sh

# 3. Clone repo
git clone https://github.com/Felondz/controlApp.git
cd controlApp

# 4. Configure .env for production
nano .env
# - APP_ENV=production
# - APP_DEBUG=false
# - Use SendGrid/AWS SES instead of Mailtrap
# - Use RDS MySQL instead of container

# 5. Use docker-compose.prod.yml
# (optimized version without Mailpit, etc.)

# 6. Configure SSL with Let's Encrypt
# Use nginx as reverse proxy with certbot
```

#### 2. Heroku (Easy but more expensive)

```bash
# 1. Install Heroku CLI
brew tap heroku/brew && brew install heroku

# 2. Login
heroku login

# 3. Create app
heroku create controlapp

# 4. Add buildpacks
heroku buildpacks:add heroku/php
heroku buildpacks:add heroku/nodejs

# 5. Add DB
heroku addons:create cleardb:ignite

# 6. Configure variables
heroku config:set APP_ENV=production APP_DEBUG=false

# 7. Deploy
git push heroku main
```

#### 3. Laravel Forge (Recommended)

```bash
# 1. Go to laravel.forge
# 2. Connect with DigitalOcean/AWS account
# 3. Create server (Forge configures it automatically)
# 4. Connect GitHub repository
# 5. Automatic deploy with every push
```

---

## 📚 Next Steps

After installing:

1. 📖 Read [API Documentation](./API.md)
2. 🔐 Understand [Authentication System](./AUTHENTICATION.md)
3. 📊 Explore [DB Structure](./DATABASE.md)
4. 🤝 Read [How to Contribute](./CONTRIBUTING.md)
5. 🚀 Start developing or deploying

---

## 💬 Help

If you have problems during installation:

1. 🔍 Search in [GitHub Issues](https://github.com/Felondz/controlApp/issues)
2. 📖 Read [Documentation](../docs/)
3. 💬 Open a new [Issue](https://github.com/Felondz/controlApp/issues/new)
4. 📧 Contact maintainers

---

**Last updated**: November 15, 2025
