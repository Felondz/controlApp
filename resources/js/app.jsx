import '../css/app.css';
import './bootstrap';
import './echo';
import { Ziggy } from './ziggy';
import { route } from 'ziggy-js';

// DEFINICIÓN GLOBAL DE ROUTE: Crítica para que no explote React
window.route = (name, params, absolute = false, config = Ziggy) => route(name, params, absolute, config);

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { GlobalThemeProvider } from '@/Contexts/GlobalThemeContext';

const appName = import.meta.env.VITE_APP_NAME || 'ControlApp';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ).then((module) => {
            const Page = module.default;
            
            // Envolvemos la página y su layout en el GlobalThemeProvider
            // Esto asegura que usePage() funcione correctamente dentro del proveedor
            const oldLayout = Page.layout;
            Page.layout = (page) => {
                const layout = oldLayout ? oldLayout(page) : page;
                return <GlobalThemeProvider>{layout}</GlobalThemeProvider>;
            };
            
            return module;
        }),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <App {...props} />
        );
    },
    progress: {
        color: '#4B5563',
        showSpinner: true,
    },
});
