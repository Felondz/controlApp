import { useTranslate } from '@/Hooks/useTranslate';
import { CheckListIcon, WarningIcon } from '@/Components/Icons';

export default function TasksWidget({ project }) {
    const { t } = useTranslate();

    // Mock data
    const pendingTasks = 4;
    const dueToday = 2;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{pendingTasks}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {t('tasks.pending', 'Tareas Pendientes')}
                    </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-info-100 dark:bg-info-900/30 flex items-center justify-center text-info-600 dark:text-info-400">
                    <CheckListIcon className="h-6 w-6" />
                </div>
            </div>

            {dueToday > 0 && (
                <div className="flex items-center text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                    <WarningIcon className="mr-1 h-3 w-3" />
                    {dueToday} {t('tasks.due_today', 'vencen hoy')}
                </div>
            )}
        </div>
    );
}
