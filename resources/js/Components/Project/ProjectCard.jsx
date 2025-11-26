import { Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import FinanceWidget from '@/Components/Widgets/FinanceWidget';
import TasksWidget from '@/Components/Widgets/TasksWidget';

export default function ProjectCard({ proyecto }) {
    const { t } = useTranslate();

    // Determine primary module (default to finance if none or multiple)
    const modules = proyecto.modules || ['finance'];
    const primaryModule = modules[0];

    const renderWidget = () => {
        // Security Check: If finance module is active but user is NOT admin, show restricted state
        if (modules.includes('finance') && !proyecto.isAdmin) {
            return (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                    <span className="text-4xl mb-2">🔒</span>
                    <span className="text-xs text-center">{t('finance.restricted', 'Acceso Restringido')}</span>
                </div>
            );
        }

        if (modules.includes('finance')) return <FinanceWidget project={proyecto} />;
        if (modules.includes('tasks')) return <TasksWidget project={proyecto} />;
        return <FinanceWidget project={proyecto} />; // Fallback
    };

    const getCardColor = () => {
        // If user defined a color, use it for the top border or accent
        return proyecto.color || '#4F46E5'; // Default Indigo
    };

    return (
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg transition duration-300 hover:shadow-md flex flex-col h-full relative group">
            {/* Color Accent Line */}
            <div
                className="h-1 w-full absolute top-0 left-0"
                style={{ backgroundColor: getCardColor() }}
            ></div>

            <div className="p-6 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                        <span className="text-2xl mr-3">{proyecto.icon || '📁'}</span>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                                {proyecto.nombre}
                            </h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                {primaryModule}
                            </span>
                        </div>
                    </div>

                    {/* Options Menu (Placeholder) */}
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        •••
                    </button>
                </div>

                {/* Widget Body */}
                <div className="flex-1">
                    {renderWidget()}
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <Link
                        href={route('mis-proyectos.show', { mis_proyecto: proyecto.id })}
                        className="text-sm font-medium text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
                    >
                        {t('common.open', 'Abrir')} &rarr;
                    </Link>

                    {/* Quick Action (Contextual) - Only for Admins if Finance */}
                    {modules.includes('finance') && proyecto.isAdmin && (
                        <button className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded transition-colors">
                            + {t('finance.expense', 'Gasto')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}