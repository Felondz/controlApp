import { useEffect, useState } from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import WidgetCard from '@/Modules/Core/Widgets/WidgetCard';
import { UserGroupIcon, UserCircleIcon } from '@/Components/Icons';
import axios from 'axios';

export default function UserTasksWidget({ project, widget, onHide, isDragging, dragHandleProps }) {
    const { t } = useTranslate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(route('api.proyectos.tasks.users-load', { proyecto: project.id }));
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user tasks data:', error);
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
                title={t('widgets.tasks_users_load', 'Carga de Trabajo')}
                icon={UserGroupIcon}
                onHide={onHide}
                isDragging={isDragging}
                dragHandleProps={dragHandleProps}
            >
                <div className="animate-pulse h-40 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
            </WidgetCard>
        );
    }



    return (
        <WidgetCard
            widget={widget}
            title={t('widgets.tasks_users_load', 'Carga de Trabajo')}
            icon={UserGroupIcon}
            onHide={onHide}
            isDragging={isDragging}
            dragHandleProps={dragHandleProps}
        >
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {data.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        {/* User Info */}
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-xs font-bold text-primary-700 dark:text-primary-300 overflow-hidden">
                                {user.profile_photo_url ? (
                                    <img src={user.profile_photo_url} alt={user.name} className="h-full w-full object-cover" />
                                ) : (
                                    <UserCircleIcon className="h-6 w-6 text-gray-400" />
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[100px] sm:max-w-[120px]">
                                    {user.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {t('tasks.assigned_count', { count: user.stats.total }, `${user.stats.total} asignadas`)}
                                </p>
                            </div>
                        </div>

                        {/* Stats Pills */}
                        <div className="flex items-center gap-1 text-[10px] font-medium">
                            {/* Todo */}
                            <div className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300" title={t('tasks.todo', 'Pendiente')}>
                                {user.stats.todo}
                            </div>
                            {/* In Progress */}
                            <div className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" title={t('tasks.in_progress', 'En Progreso')}>
                                {user.stats.in_progress}
                            </div>
                            {/* Done */}
                            <div className="px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" title={t('tasks.done', 'Completada')}>
                                {user.stats.done}
                            </div>
                        </div>
                    </div>
                ))}

                {data.length === 0 && (
                    <p className="text-center text-sm text-gray-500 py-4">
                        {t('members.no_members', 'No hay miembros con tareas.')}
                    </p>
                )}
            </div>
        </WidgetCard>
    );
}
