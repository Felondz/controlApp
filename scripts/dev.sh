#!/bin/sh

# Ensure we are running from the project root
cd /var/www/html

# Stop any existing octane server that might be holding the port
php artisan octane:stop > /dev/null 2>&1 || true

# Run backend (Octane), frontend (Vite), queue worker, and reverb concurrently
npx concurrently -c "#93c5fd,#c4b5fd,#fb7185,#fdba74,#818cf8" \
    "php artisan octane:start --server=swoole --host=0.0.0.0 --port=8000 --watch" \
    "pnpm run dev" \
    "php artisan queue:listen --tries=1" \
    "php artisan reverb:start --host=0.0.0.0 --port=8080 --debug" \
    --names="octane,vite,queue,reverb" \
    --kill-others
