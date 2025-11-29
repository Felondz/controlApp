import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { CalculatorIcon, CalendarIcon } from '@/Components/Icons';
import ToolCard from '@/Components/Tools/ToolCard';

export default function Index({ auth }) {
    const { t } = useTranslate();
    const enabledTools = auth.user.enabled_tools || [];

    const tools = [
        {
            id: 'financial-calculator',
            name: t('dashboard.calculator'),
            description: t('dashboard.calculator_desc'),
            icon: CalculatorIcon,
            route: 'tools.calculator',
            disabled: false,
            color: 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
        },
        {
            id: 'calendar',
            name: t('dashboard.calendar'),
            description: t('dashboard.calendar_desc'),
            icon: CalendarIcon,
            route: 'dashboard', // TODO: Update
            disabled: true,
            color: 'bg-secondary-100 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400',
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
                        {tools.map((tool) => (
                            <ToolCard
                                key={tool.id}
                                tool={tool}
                                isEnabled={enabledTools.includes(tool.id)}
                                onToggle={toggleTool}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
