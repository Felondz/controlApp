# Use official PHP image with Apache
FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libzip-dev \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql zip

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy composer from official composer image
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# --- CAMBIO CRÍTICO AQUÍ ---
# Copiamos los archivos y asignamos el dueño a www-data inmediatamente
# Esto evita que los archivos pertenezcan a 'root' y causen el error 504
COPY --chown=www-data:www-data . .
# ---------------------------

# Install PHP dependencies
# Ejecutamos esto después del COPY para que el vendor se genere correctamente
RUN composer install --no-dev --optimize-autoloader

# Set proper permissions
# Mantenemos esto por seguridad para asegurar que storage siga siendo escribible
# después de la instalación de dependencias
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Configure Apache
RUN echo '<Directory /var/www/html/public>\n\
    Options -MultiViews\n\
    RewriteEngine On\n\
    RewriteCond %{REQUEST_FILENAME} !-f\n\
    RewriteRule ^ index.php [QSA,L]\n\
    </Directory>' > /etc/apache2/conf-available/rewrite.conf && \
    a2enconf rewrite

# Set Apache document root to public folder
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|' /etc/apache2/sites-available/000-default.conf

# Expose port 80
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]