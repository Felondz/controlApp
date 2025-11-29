import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { CalculatorIcon, CalendarIcon, CheckCircleIcon, XCircleIcon } from '@/Components/Icons';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ auth }) {
    const { t } = useTranslate();
    const enabledTools = auth.user.enabled_tools || [];

    const tools = [
        {
            id: 'financial-calculator',
            name: t('dashboard.calculator', 'Calculadora Financiera'),
            description: 'Calcula cuotas, intereses y tablas de amortización para préstamos.',
            icon: CalculatorIcon,
            route: 'tools.calculator',
            disabled: false,
            color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
        },
        {
            id: 'calendar',
            name: t('dashboard.calendar', 'Calendario'),
            description: 'Gestiona tus eventos y fechas importantes.',
            icon: CalendarIcon,
            route: 'dashboard', // TODO: Update
            disabled: true,
            color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
        },
    ];

    const toggleTool = (toolId, enable) => {
        router.post(route('tools.toggle'), {
            tool: toolId,
            enable: enable
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Optional: Show toast notification
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{t('dashboard.marketplace', 'Mercado de Herramientas')}</h2>}
        >
            <Head title={t('dashboard.marketplace', 'Mercado de Herramientas')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tools.map((tool) => {
                            const Icon = tool.icon;
                            const isEnabled = enabledTools.includes(tool.id);

                            if (tool.disabled) {
                                return (
                                    <div key={tool.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 opacity-60 relative border border-gray-200 dark:border-gray-700">
                                        <div className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 text-gray-500 text-xs font-bold px-2 py-1 rounded">
                                            {t('common.coming_soon', 'PRÓXIMAMENTE')}
                                        </div>
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${tool.color} grayscale`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{tool.name}</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{tool.description}</p>
                                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <SecondaryButton disabled className="w-full justify-center opacity-50 cursor-not-allowed">
                                                No disponible
                                            </SecondaryButton>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={tool.id} className={`bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 transition-all duration-200 border ${isEnabled ? 'border-primary-500 ring-1 ring-primary-500' : 'border-gray-200 dark:border-gray-700'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${tool.color}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        {isEnabled && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                <CheckCircleIcon className="w-3 h-3 mr-1" />
                                                Activo
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{tool.name}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 h-10">{tool.description}</p>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            href={route(tool.route)}
                                            className={`inline-flex items-center justify-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 ${!isEnabled ? 'opacity-50 pointer-events-none' : ''}`}
                                        >
                                            Abrir
                                        </Link>

                                        {isEnabled ? (
                                            <SecondaryButton
                                                className="justify-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                                                onClick={() => toggleTool(tool.id, false)}
                                            >
                                                Desactivar
                                            </SecondaryButton>
                                        ) : (
                                            <PrimaryButton
                                                className="justify-center"
                                                onClick={() => toggleTool(tool.id, true)}
                                            >
                                                Activar
                                            </PrimaryButton>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
