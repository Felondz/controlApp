import '../css/app.css';
import './bootstrap';
import { Ziggy } from './ziggy';
import { route } from 'ziggy-js';
window.route = (name, params, absolute, config = Ziggy) => route(name, params, absolute, config);

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
            const originalLayout = Page.layout;

            // Wrap everything in GlobalThemeProvider
            Page.layout = (page) => {
                // Import dynamically to avoid circular dependencies or top-level import issues if any
                // But better to import at top level. 
                // Since I cannot change top level imports easily with this tool without replacing whole file or using multi_replace
                // I will assume I can add the import at the top.
                // Wait, I need to add the import at the top first.
                return (
                    <GlobalThemeProvider>
                        {originalLayout ? originalLayout(page) : page}
                    </GlobalThemeProvider>
                );
            };
            return module;
        }),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
        showSpinner: true,
    },
});
