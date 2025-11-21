# Installation Guide - ControlApp

Step-by-step guide to install and configure ControlApp on your local or production environment.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Installation (Docker)](#local-installation-docker)
3. [Installation Without Docker](#installation-without-docker)
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

#### macOS
- [ ] Docker Desktop for Mac (≥ 4.0)
- [ ] Git (included in Xcode)
- [ ] 4GB RAM minimum (8GB recommended)

#### Linux
- [ ] Docker (≥ 24.0)
- [ ] Docker Compose (≥ 2.20)
- [ ] Git
- [ ] 2GB RAM minimum (4GB recommended)

**Install on Linux:**
```bash
sudo apt-get update
sudo apt-get install docker.io docker-compose git

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

---

## 🐳 Local Installation (Docker)

### Step 1: Clone Repository

```bash
git clone https://github.com/Felondz/controlApp.git
cd controlApp
```

### Step 2: Configure Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit .env with your values (optional, defaults provided)
nano .env
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
```

### Step 3: Get Mailtrap Credentials (Optional)

1. Go to [Mailtrap.io](https://mailtrap.io)
2. Create account (free)
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

# Verify all are running
docker compose ps
```

**Expected services:**
- Laravel (port 8000)
- MySQL (port 3307)
- Redis (port 6379)
- Meilisearch (port 7700)
- Mailpit (port 8025)

### Step 5: Install Dependencies

```bash
docker compose exec -T laravel.test composer install
```

### Step 6: Generate Application Key

```bash
docker compose exec laravel.test php artisan key:generate
```

### Step 7: Run Migrations

```bash
docker compose exec laravel.test php artisan migrate
```

### Step 8: Create Test Data (Optional)

```bash
docker compose exec laravel.test php artisan db:seed
```

### Step 9: Create Storage Symlink

```bash
docker compose exec laravel.test php artisan storage:link
```

### ✅ Ready!

Your application is ready at:
- **App**: http://localhost:8000
- **API**: http://localhost:8000/api
- **Mailpit**: http://localhost:8025
- **Meilisearch**: http://localhost:7700

---

## 📦 Installation Without Docker

### Step 1: Clone Repository

```bash
git clone https://github.com/Felondz/controlApp.git
cd controlApp
```

### Step 2: Install PHP Dependencies

```bash
composer install
```

### Step 3: Configure Environment

```bash
cp .env.example .env
```

**Edit `.env`:**
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
mysql -u root -p

# In MySQL:
CREATE DATABASE controlapp;
EXIT;
```

### Step 5: Generate Application Key

```bash
php artisan key:generate
```

### Step 6: Run Migrations

```bash
php artisan migrate
```

### Step 7: Create Storage Symlink

```bash
php artisan storage:link
```

### Step 8: Start Local Server

```bash
php artisan serve
```

---

## ⚙️ Post-Installation Configuration

### 1. Verify Permissions (Linux/macOS)

```bash
chmod -R 775 storage bootstrap/cache
```

### 2. Clear Cache

```bash
docker compose exec laravel.test php artisan config:clear
docker compose exec laravel.test php artisan cache:clear
docker compose exec laravel.test php artisan view:clear
```

### 3. Compile Frontend Assets

```bash
npm install
npm run dev
```

---

## ✔️ Verification

### Installation Checklist

```bash
# 1. Verify services are running
docker compose ps

# 2. Test API
curl http://localhost:8000/api/user

# 3. Verify database
docker compose exec -T mysql mysql -h mysql -u sail -ppassword laravel \
  -e "SHOW TABLES;"

# 4. View logs
docker compose logs -f laravel.test
```

---

## 🔧 Troubleshooting

### "Connection refused" in MySQL

**Solution:**
```bash
# Restart container
docker compose restart mysql

# View logs
docker compose logs mysql

# Rebuild
docker compose down
docker compose up -d mysql
```

### "SQLSTATE[HY000]: General error: 2006 MySQL has gone away"

**Solution:**
```bash
docker compose down
docker compose up -d

# Run migrations again
docker compose exec laravel.test php artisan migrate
```

### "Permission denied" in storage

**Solution:**
```bash
chmod -R 775 storage bootstrap/cache
```

### "Port already in use"

**Solution:**
```bash
# Change port in docker-compose.yml
# Change "8000:8000" to "8080:8000"
```

### "No such file or directory: .env"

**Solution:**
```bash
cp .env.example .env
```

---

## 🚀 Production Installation

⚠️ This guide is for basic setup. For production, consider:

- 🔒 Security (SSL/TLS, firewalls, etc.)
- 📊 Performance (caching, CDN, etc.)
- 📈 Scalability (load balancers, etc.)
- 🔐 Backups and disaster recovery
- 📝 Logging and monitoring

### Recommended Stack

- Load Balancer (nginx / HAProxy)
- App Servers (Laravel) x N
- Database (MySQL RDS)
- Cache (Redis)
- Search (Meilisearch)
- Email (SendGrid / AWS SES)
- Monitoring (New Relic / Datadog)
- Backups (AWS S3)

### Docker on VPS

```bash
# SSH to server
ssh root@your-server.com

# Install Docker
curl -sSL https://get.docker.com | sh

# Clone repo
git clone https://github.com/Felondz/controlApp.git
cd controlApp

# Configure .env for production
nano .env
# Set: APP_ENV=production, APP_DEBUG=false

# Use production docker-compose file
# docker-compose.prod.yml
```

---

## 📚 Next Steps

After installation:

1. 📖 Read [API Documentation](./API.md)
2. 🔐 Understand [Authentication System](./AUTHENTICATION.md)
3. 📊 Explore [Database Schema](./DATABASE.md)
4. 🤝 Read [Contributing Guide](./CONTRIBUTING.md)
5. 🚀 Start developing or deploying

---

**Last Updated**: November 15, 2025
