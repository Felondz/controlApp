import React, { useState } from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import { usePage } from '@inertiajs/react';
import axios from 'axios';

/**
 * Componente para cambiar el idioma preferido del usuario.
 * 
 * Solo disponible para usuarios autenticados.
 * Actualiza via API y persiste en DB.
 * 
 * Uso:
 * <LocaleSelector />
 */
export default function LocaleSelector() {
    const { t } = useTranslate();
    const { auth } = usePage().props;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentLocale, setCurrentLocale] = useState(auth.user?.locale || 'es');

    const locales = [
        { code: 'es', label: t('common.spanish') || 'Español' },
        { code: 'en', label: t('common.english') || 'English' },
        { code: 'pt', label: t('common.portuguese') || 'Português' },
    ];

    const handleLocaleChange = async (newLocale) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.put('/api/user/locale', {
                locale: newLocale,
            });

            if (response.data.success) {
                setCurrentLocale(newLocale);
                // Recargar página para aplicar cambios
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                t('common.error') ||
                'Error al cambiar idioma'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
                {t('common.language') || 'Idioma'}:
            </label>

            <div className="flex flex-wrap gap-2">
                {locales.map((locale) => (
                    <button
                        key={locale.code}
                        onClick={() => handleLocaleChange(locale.code)}
                        disabled={loading}
                        className={`px-3 py-1.5 text-sm rounded-md transition-all ${currentLocale === locale.code
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        {locale.label}
                    </button>
                ))}
            </div>

            {error && (
                <span className="text-sm text-red-600">
                    {error}
                </span>
            )}
        </div>
    );
}
