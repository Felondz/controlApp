import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
    auth: {
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '',
        },
    },
});

// Add a global axios interceptor to handle the Socket ID for toOthers() functionality
import axios from 'axios';
axios.interceptors.request.use((config) => {
    if (window.Echo && typeof window.Echo.socketId === 'function') {
        const socketId = window.Echo.socketId();
        if (socketId) {
            config.headers['X-Socket-ID'] = socketId;
        }
    }
    return config;
});
