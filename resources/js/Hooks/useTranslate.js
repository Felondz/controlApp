import { usePage } from '@inertiajs/react';

export function useTranslate() {
    const { translations } = usePage().props;

    const t = (key, replace = {}) => {
        let translation = key.split('.').reduce((obj, k) => obj && obj[k], translations) || key;

        // Reemplazar placeholders si existen
        Object.keys(replace).forEach(key => {
            translation = translation.replace(`:${key}`, replace[key]);
        });

        return translation;
    };

    return { t };
}
