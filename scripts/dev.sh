#!/bin/sh

# Ensure we are running from the project root
cd /var/www/html

# Stop any existing octane server that might be holding the port
php artisan octane:stop > /dev/null 2>&1 || true

# Run backend (Octane), frontend (Vite), and queue worker concurrently
npx concurrently -c "#93c5fd,#c4b5fd,#fb7185,#fdba74" \
    "php artisan octane:start --server=swoole --host=0.0.0.0 --port=8000 --watch" \
    "pnpm run dev" \
    "php artisan queue:listen --tries=1" \
    --names="octane,vite,queue" \
    --kill-others
