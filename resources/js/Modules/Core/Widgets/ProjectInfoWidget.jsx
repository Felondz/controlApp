import { Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { InformationCircleIcon, CalendarIcon, CurrencyDollarIcon } from '@/Components/Icons';

/**
 * ProjectInfoWidget - Project overview info for dashboard
 */
import WidgetCard from '@/Modules/Core/Widgets/WidgetCard';

/**
 * ProjectInfoWidget - Project overview info for dashboard
 */
export default function ProjectInfoWidget({ project, widget, onHide, isDragging, dragHandleProps }) {
    const { t } = useTranslate();

    const createdAt = project?.created_at
        ? new Date(project.created_at).toLocaleDateString()
        : null;

    const enabledModules = project?.modules || [];

    // Module display config
    const moduleLabels = {
        finance: { label: t('modules.finance_label', 'Finanzas'), color: 'success' },
        tasks: { label: t('modules.tasks_label', 'Tareas'), color: 'info' },
        chat: { label: t('modules.chat_title', 'Chat'), color: 'primary' },
        inventory: { label: t('modules.inventory', 'Inventario'), color: 'warning' },
        operations: { label: t('modules.operations', 'Operaciones'), color: 'danger' },
        crm: { label: t('modules.crm', 'CRM'), color: 'primary' },
        marketplace: { label: t('modules.marketplace', 'Marketplace'), color: 'info' },

    };

    const colorClasses = {
        success: 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400',
        info: 'bg-info-100 dark:bg-info-900/30 text-info-700 dark:text-info-400',
        primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400',
        warning: 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400',
        danger: 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400',
    };

    return (
        <WidgetCard
            widget={widget}
            title={t('widgets.project_info', 'Información del Proyecto')}
            icon={InformationCircleIcon}
            onHide={onHide}
            isDragging={isDragging}
            dragHandleProps={dragHandleProps}
        >
            <div className="space-y-3">
                {/* Description */}
                {project?.descripcion ? (
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                        {project.descripcion}
                    </p>
                ) : (
                    <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                        {t('projects.no_description', 'Sin descripción')}
                    </p>
                )}

                {/* Meta info */}
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    {createdAt && (
                        <span className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {createdAt}
                        </span>
                    )}
                    {project?.moneda_default && (
                        <span className="flex items-center gap-1">
                            <CurrencyDollarIcon className="h-3 w-3" />
                            {project.moneda_default}
                        </span>
                    )}
                </div>

                {/* Active Modules */}
                <div className="flex flex-wrap gap-1">
                    {enabledModules.map(module => {
                        const config = moduleLabels[module];
                        if (!config) return null;
                        return (
                            <span
                                key={module}
                                className={`text-xs px-2 py-0.5 rounded-full ${colorClasses[config.color]}`}
                            >
                                {config.label}
                            </span>
                        );
                    })}
                </div>
            </div>
        </WidgetCard>
    );
}
