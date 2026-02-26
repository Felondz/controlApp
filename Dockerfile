# Stage 1: Build Frontend Assets
FROM node:20-alpine AS frontend_builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml vite.config.js ./
RUN pnpm install --frozen-lockfile
COPY resources/ ./resources/
COPY public/ ./public/
COPY tailwind.config.js postcss.config.js ./
RUN pnpm run build

# Stage 2: Setup PHP Application
FROM php:8.4-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    default-mysql-client \
    libbrotli-dev \
    libssl-dev \
    libcurl4-openssl-dev \
    libicu-dev \
    && docker-php-ext-configure intl \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip sockets intl curl xml dom fileinfo posix

# Install Redis and Swoole extensions
RUN pecl install redis \
    && pecl install --configureoptions 'enable-sockets="yes" enable-openssl="yes" enable-http2="yes" enable-mysqlnd="yes" enable-swoole-curl="yes" enable-swoole-json="yes"' swoole \
    && docker-php-ext-enable redis swoole

# Set working directory
WORKDIR /var/www/html

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application files with permissions
COPY --chown=www-data:www-data . .

# Copy built frontend assets from Stage 1
COPY --from=frontend_builder --chown=www-data:www-data /app/public/build ./public/build

# Install PHP dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Octane Port
EXPOSE 8000

# Start Laravel Octane (Limited workers for shared server)
CMD ["php", "artisan", "octane:start", "--server=swoole", "--host=0.0.0.0", "--port=8000", "--workers=4"]