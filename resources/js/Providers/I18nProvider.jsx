import React from 'react';
import { usePage } from '@inertiajs/react';

/**
 * Provider de i18n para ControlApp
 *
 * Este provider proporciona el contexto de idioma y traducciones
 * a través de la aplicación React. Las traducciones se reciben
 * desde el backend (Laravel) a través de las props globales de Inertia.
 *
 * @component
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {React.ReactElement} El provider con los hijos envueltos
 *
 * @example
 * // En app.jsx
 * <I18nProvider>
 *   <MainLayout>
 *     <Routes>
 *       {routes}
 *     </Routes>
 *   </MainLayout>
 * </I18nProvider>
 */
export const I18nProvider = ({ children }) => {
    const { locale = 'es', translations = {} } = usePage().props;

    // En el futuro, aquí podrían agregarse más funcionalidades i18n:
    // - Cambio de idioma dinámico
    // - Almacenamiento de preferencia de idioma en localStorage
    // - Formateo de fechas, números según locale
    // - Pluralización

    return <>{children}</>;
};

export default I18nProvider;
