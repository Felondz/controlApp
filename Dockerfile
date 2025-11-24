# --- ETAPA 1: Construcción del Frontend (Node.js) ---
FROM node:20-alpine as frontend_builder

WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json vite.config.js ./

# Instalamos dependencias de Node
RUN npm ci

# Copiamos el resto de los archivos necesarios para el build (recursos, vistas, css)
COPY resources/ ./resources/
COPY public/ ./public/
# Si usas Tailwind u otros configs JS, cópialos aquí
COPY tailwind.config.js postcss.config.js ./ 

# Ejecutamos el build de producción (Genera public/build)
RUN npm run build

# --- ETAPA 2: Servidor de Aplicación (PHP/Laravel) ---
FROM php:8.3-apache

# Instalar dependencias del sistema y extensiones PHP
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
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Redis extension via PECL (Fixes Error 500)
RUN pecl install redis \
    && docker-php-ext-enable redis

# Habilitar mod_rewrite de Apache para Laravel
RUN a2enmod rewrite

# Establecer directorio de trabajo
WORKDIR /var/www/html

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiar archivos del proyecto (Backend)
COPY . .

# --- CRÍTICO: Copiar el Frontend compilado desde la Etapa 1 ---
COPY --from=frontend_builder /app/public/build ./public/build
# -------------------------------------------------------------

# Instalar dependencias de PHP (Optimizadas para prod)
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Ajustar permisos (Crucial para evitar errores 500/504 por logs)
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Configurar Apache DocumentRoot para apuntar a /public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Exponer puerto 80
EXPOSE 80

# Comando de inicio
CMD ["apache2-foreground"]