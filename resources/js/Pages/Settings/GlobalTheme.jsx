import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useGlobalTheme } from '@/Contexts/GlobalThemeContext';
import { useTranslate } from '@/Hooks/useTranslate';

function ThemeSettings() {
    const { t } = useTranslate();
    const { theme: currentTheme, changeTheme } = useGlobalTheme();

    const themes = [
        {
            id: 'purple-modern',
            name: 'Purple Modern',
            description: t('settings.theme.purple_desc', 'Vibrante y profesional'),
            gradient: 'from-purple-500 to-purple-700',
        },
        {
            id: 'ocean-blue',
            name: 'Ocean Blue',
            description: t('settings.theme.blue_desc', 'Calmado y confiable'),
            gradient: 'from-cyan-600 to-cyan-800',
        },
        {
            id: 'forest-green',
            name: 'Forest Green',
            description: t('settings.theme.green_desc', 'Natural y fresco'),
            gradient: 'from-emerald-700 to-emerald-900',
        },
        {
            id: 'scarlet-red',
            name: 'Scarlet Red',
            description: t('settings.theme.red_desc', 'Audaz y enérgico'),
            gradient: 'from-red-600 to-red-800',
        },
        {
            id: 'amber-gold',
            name: 'Amber Gold',
            description: t('settings.theme.amber_desc', 'Cálido y elegante'),
            gradient: 'from-amber-500 to-amber-700',
        },
        {
            id: 'pink-rose',
            name: 'Pink Rose',
            description: t('settings.theme.pink_desc', 'Moderno y sofisticado'),
            gradient: 'from-pink-600 to-pink-800',
        },
    ];

    return (
        <div className="py-12">
            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        {/* Header */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-2 text-primary-800 dark:text-primary-200">
                                {t('settings.theme.title', 'Tema Global')}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('settings.theme.subtitle', 'Personaliza la apariencia de la aplicación según tus preferencias')}
                            </p>
                        </div>

                        {/* Theme Selection */}
                        <div>
                            <h3 className="font-semibold mb-4">
                                {t('settings.theme.select', 'Selecciona tu tema')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {themes.map((themeOption) => {
                                    const isSelected = currentTheme === themeOption.id;

                                    return (
                                        <button
                                            key={themeOption.id}
                                            onClick={() => changeTheme(themeOption.id)}
                                            className={`relative p-6 rounded-lg border-2 transition-all hover:scale-102 ${isSelected
                                                ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/10 shadow-lg'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-800'
                                                }`}
                                        >
                                            {/* Selected Badge */}
                                            {isSelected && (
                                                <div className="absolute top-2 right-2 bg-primary-600 rounded-full p-1">
                                                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}

                                            {/* Color Preview */}
                                            <div className={`w-full h-32 rounded-md mb-4 bg-gradient-to-br ${themeOption.gradient} shadow-inner`} />

                                            {/* Theme Info */}
                                            <h4 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">
                                                {themeOption.name}
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {themeOption.description}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function GlobalTheme() {
    const { t } = useTranslate();

    return (
        <AuthenticatedLayout>
            <Head title={t('settings.theme.title', 'Tema Global')} />
            <ThemeSettings />
        </AuthenticatedLayout>
    );
}
