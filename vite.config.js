import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '0.0.0.0',  // Escucha en todas las interfaces (para Sail/Docker)
        port: 5173,
        hmr: {
            host: 'controlapp',  // Usa tu custom host para HMR, evita CORS
        },
    },
});