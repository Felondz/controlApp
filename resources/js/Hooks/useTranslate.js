import { usePage } from '@inertiajs/react';

export function useTranslate() {
    const { translations } = usePage().props;

    const t = (key, defaultValOrReplace = null, replace = {}) => {
        let defaultValue = key;
        let replacements = replace;

        if (typeof defaultValOrReplace === 'string') {
            defaultValue = defaultValOrReplace;
        } else if (typeof defaultValOrReplace === 'object' && defaultValOrReplace !== null) {
            replacements = defaultValOrReplace;
        }

        let translation = key.split('.').reduce((obj, k) => obj && obj[k], translations);

        if (translation === undefined || translation === null) {
            translation = defaultValue;
        }

        if (typeof translation !== 'string') {
            return translation;
        }

        // Reemplazar placeholders si existen
        Object.keys(replacements).forEach(key => {
            translation = translation.replace(`:${key}`, replacements[key]);
        });

        return translation;
    };

    return { t };
}
