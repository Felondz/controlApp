import { Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { PlusIcon, MinusIcon, EllipsisVerticalIcon } from '@/Components/Icons';
import FinanceWidget from '@/Components/Widgets/FinanceWidget';
import TasksWidget from '@/Components/Widgets/TasksWidget';
import { getThemeStyle } from '@/Utils/themeStyles';

export default function ProjectCard({ proyecto }) {
    const { t } = useTranslate();

    // Determine primary module (default to finance if none or multiple)
    const modules = proyecto.modules || ['finance'];
    const primaryModule = modules[0];

    const renderWidget = () => {
        // Security Check: If finance module is active but user is NOT admin, show restricted state
        if (modules.includes('finance') && !proyecto.isAdmin) {
            return (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 py-6">
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
        // If user defined a color, use it. Otherwise use CSS variable for primary color
        return proyecto.color || 'var(--color-primary-600)';
    };

    const handleAddIncome = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // TODO: Open modal or navigate to create income transaction
        console.log('Add income for project:', proyecto.id);
    };

    const handleAddExpense = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // TODO: Open modal or navigate to create expense transaction
        console.log('Add expense for project:', proyecto.id);
    };

    return (
        <Link
            href={route('mis-proyectos.show', { mis_proyecto: proyecto.id })}
            className="block bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-1 flex flex-col min-h-[200px] relative group"
            style={getThemeStyle(proyecto.theme)}
        >
            {/* Color Accent Line */}
            <div
                className="h-1 w-full absolute top-0 left-0"
                style={{ backgroundColor: getCardColor() }}
            ></div>

            <div className="p-4 sm:p-6 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                        <span className="text-2xl mr-3">{proyecto.icon || '📁'}</span>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {proyecto.nombre}
                            </h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                {t(`modules.${primaryModule}`, primaryModule)}
                            </span>
                        </div>
                    </div>

                    {/* Options Menu */}
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-all p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <EllipsisVerticalIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Widget Body */}
                <div className="flex-1">
                    {renderWidget()}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end items-center">
                    {/* Quick Actions - Only for Admins if Finance */}
                    {modules.includes('finance') && proyecto.isAdmin && (
                        <div className="flex gap-2">
                            <button
                                onClick={handleAddIncome}
                                className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 hover:bg-success-100 dark:hover:bg-success-900/30 transition-colors"
                                aria-label={t('finance.add_income', 'Agregar Ingreso')}
                            >
                                <PlusIcon className="h-3 w-3" />
                                <span className="hidden sm:inline">{t('finance.income', 'Ingreso')}</span>
                            </button>
                            <button
                                onClick={handleAddExpense}
                                className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-400 hover:bg-danger-100 dark:hover:bg-danger-900/30 transition-colors"
                                aria-label={t('finance.add_expense', 'Agregar Gasto')}
                            >
                                <MinusIcon className="h-3 w-3" />
                                <span className="hidden sm:inline">{t('finance.expense', 'Gasto')}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}