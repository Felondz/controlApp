import { usePage } from '@inertiajs/react';

/**
 * Hook personalizado para acceder a las traducciones desde cualquier componente.
 * Las traducciones se inyectan desde Laravel a través de la prop global de Inertia.
 *
 * Uso:
 *   const t = useTranslate();
 *   return <h1>{t('dashboard.title')}</h1>;
 *
 * @returns {Function} Función t(key, fallback) para buscar traducciones
 */
export function useTranslate() {
    const { translations = {} } = usePage().props;

    /**
     * Busca una clave de traducción usando notación de punto para objetos anidados.
     *
     * @param {string} key - Clave de traducción (ej: 'dashboard.title', 'auth.login')
     * @param {string} fallback - Valor por defecto si la clave no existe
     * @returns {string} La traducción encontrada o el fallback
     */
    const t = (key, fallback = key) => {
        // Dividir la clave por puntos para acceder a propiedades anidadas
        const keys = key.split('.');
        let value = translations;

        // Iterar a través de cada nivel de la clave
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // Si no encuentra la clave, retornar el fallback
                return fallback;
            }
        }

        // Retornar el valor encontrado (debe ser string)
        return typeof value === 'string' ? value : fallback;
    };

    return t;
}

export default useTranslate;
