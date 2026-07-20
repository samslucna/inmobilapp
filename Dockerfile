FROM php:8.2-fpm

# =========================
# Instalar dependencias
# =========================

RUN apt-get update && apt-get install -y \
    git \
    curl \
    unzip \
    zip \
    libzip-dev \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    libicu-dev \
    libpq-dev \
    default-mysql-client \
    nano \
    && apt-get clean

# =========================
# Extensiones PHP
# =========================

RUN docker-php-ext-configure gd --with-freetype --with-jpeg

RUN docker-php-ext-install \
    pdo \
    pdo_mysql \
    mysqli \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    intl

# =========================
# Composer
# =========================

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# =========================
# Configuración PHP
# =========================

RUN echo "memory_limit=512M" > /usr/local/etc/php/conf.d/memory-limit.ini

RUN echo "upload_max_filesize=100M" > /usr/local/etc/php/conf.d/uploads.ini

RUN echo "post_max_size=100M" >> /usr/local/etc/php/conf.d/uploads.ini

# =========================
# Directorio de trabajo
# =========================

WORKDIR /var/www

# =========================
# Copiar proyecto
# =========================

COPY . .

# =========================
# Instalar Laravel
# =========================

RUN composer install \
    --optimize-autoloader \
    --no-de 
# =========================
# Permisos Laravel
# =========================

RUN chown -R www-data:www-data /var/www

RUN chmod -R 775 storage bootstrap/cache

# =========================
# Puerto PHP-FPM
# =========================

EXPOSE 9000

CMD ["php-fpm"]
