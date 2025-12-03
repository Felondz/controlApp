import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: 'resources/js/test-setup.js',
        mode: 'test',
    },
});
