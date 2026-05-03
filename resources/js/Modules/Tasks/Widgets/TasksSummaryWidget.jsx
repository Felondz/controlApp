import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import WidgetCard from '@/Modules/Core/Widgets/WidgetCard';
import { ClipboardDocumentCheckIcon } from '@/Components/Icons';
import axios from 'axios';

export default function TasksSummaryWidget({ project, widget, onHide, isDragging, dragHandleProps }) {
    const { t } = useTranslate();
    const [data, setData] = useState({ pending: 0, in_progress: 0, done: 0, overdue: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Use named API route
                const response = await axios.get(route('api.proyectos.tasks.summary', { proyecto: project.uuid }));
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tasks data:', error);
                setLoading(false);
            }
        };

        if (project?.id) {
            fetchData();
        }
    }, [project]);

    if (loading) {
        return (
            <WidgetCard
                widget={widget}
                title={t('widgets.tasks_summary', 'Resumen de Tareas')}
                icon={ClipboardDocumentCheckIcon}
                onHide={onHide}
                isDragging={isDragging}
                dragHandleProps={dragHandleProps}
            >
                <div className="animate-pulse h-24 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
            </WidgetCard>
        );
    }

    const stats = [
        { label: t('tasks.pending', 'Pendientes'), value: data.pending, color: 'text-warning-500' },
        { label: t('tasks.in_progress', 'En Progreso'), value: data.in_progress, color: 'text-info-500' },
        { label: t('tasks.done', 'Completadas'), value: data.done, color: 'text-success-500' },
    ];

    return (
        <WidgetCard
            widget={widget}
            title={t('widgets.tasks_summary', 'Resumen de Tareas')}
            icon={ClipboardDocumentCheckIcon}
            onHide={onHide}
            isDragging={isDragging}
            dragHandleProps={dragHandleProps}
            action={
                project ? (
                    <Link
                        href={route('mis-proyectos.tasks.index', { proyecto: project.uuid })}
                        className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
                    >
                        {t('common.view_all', 'Ver todas')}
                    </Link>
                ) : null
            }
        >
            <div className="grid grid-cols-3 gap-2 mb-3">
                {stats.map((stat, index) => (
                    <div key={index} className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className={`block text-lg font-bold ${stat.color}`}>
                            {stat.value}
                        </span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                            {stat.label}
                        </span>
                    </div>
                ))}
            </div>

            {data.overdue > 0 && (
                <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md text-xs">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="font-medium">
                        {(() => {
                            const params = { count: data.overdue };
                            // Correct usage: t(key, defaultText, replacements)
                            const defaultText = `${data.overdue} tareas vencidas`;
                            let text = t('tasks.overdue_count_fixed', defaultText, params);

                            // Fallback if it returns the key itself (which means translation missing AND default text usage might be tricky if useTranslate logic is strict)
                            if (text === 'tasks.overdue_count_fixed') {
                                text = defaultText;
                            }

                            // If the result still contains the placeholder (translation failed to replace), force replace it
                            if (text.includes('{count}')) {
                                text = text.replace('{count}', data.overdue);
                            }
                            if (text.includes(':count')) {
                                text = text.replace(':count', data.overdue);
                            }
                            return text;
                        })()}
                    </span>
                </div>
            )}
        </WidgetCard>
    );
}
