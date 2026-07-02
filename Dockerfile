# Utiliser une image PHP avec Apache
FROM php:8.2-apache

# Installer les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libicu-dev \
    libbcmath-dev \
    zip \
    unzip \
    git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql bcmath intl zip opcache

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurer le répertoire de travail
WORKDIR /var/www/html

# Copier uniquement les fichiers nécessaires pour installer les dépendances (meilleur cache)
COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-autoloader --no-dev

# Copier le reste du code source
COPY . .

# Finaliser l'installation de Laravel
RUN composer dump-autoload --optimize
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Configurer Apache pour pointer vers le dossier public
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite

# Exposer le port 80
EXPOSE 80