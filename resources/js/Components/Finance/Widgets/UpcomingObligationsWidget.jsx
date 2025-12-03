import { useMemo } from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import { CalendarIcon, ClockIcon, CheckCircleIcon } from '@/Components/Icons';

export default function UpcomingObligationsWidget({
    events = [],
    financialTasks = [],
    currency = 'COP',
    onMarkAsPaid
}) {
    const { t } = useTranslate();

    const upcoming = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Combine transactions and financial tasks
        const allObligations = [
            // Transaction events
            ...events
                .filter(e => {
                    const date = new Date(e.date);
                    return date >= today && (e.type === 'gasto' || e.type === 'expense');
                })
                .map(e => ({ ...e, source: 'transaction' })),

            // Financial tasks
            ...financialTasks
                .filter(task => {
                    if (!task.due_date) return false;
                    const date = new Date(task.due_date);
                    return date >= today;
                })
                .map(task => ({
                    id: `task-${task.id}`,
                    taskId: task.id,
                    title: task.title,
                    date: task.due_date,
                    amount: task.amount,
                    type: 'gasto',
                    source: 'task',
                    status: task.status,
                    category: task.category
                }))
        ];

        return allObligations
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5); // Show top 5
    }, [events, financialTasks]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
        }).format(Math.abs(value));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short' }).format(date);
    };

    const getDaysRemaining = (dateString) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const date = new Date(dateString);
        const diffTime = date - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return t('common.today', 'Hoy');
        if (diffDays === 1) return t('common.tomorrow', 'Mañana');
        return `${diffDays} ${t('common.days', 'días')}`;
    };

    const handleMarkAsPaid = (obligation) => {
        if (obligation.source === 'task' && onMarkAsPaid) {
            // Find the original task object
            const task = financialTasks.find(t => t.id === obligation.taskId);
            if (task) {
                onMarkAsPaid(task);
            }
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm h-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary-600" />
                {t('finance.upcoming_payments', 'Próximos Pagos')}
            </h3>

            {upcoming.length > 0 ? (
                <div className="space-y-3">
                    {upcoming.map((event) => (
                        <div
                            key={event.id}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 group hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="flex flex-col items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex-shrink-0">
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                                        {new Date(event.date).toLocaleString('es-CO', { month: 'short' }).replace('.', '')}
                                    </span>
                                    <span className="text-sm font-bold text-gray-900 dark:text-white leading-none">
                                        {new Date(event.date).getDate()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {event.title}
                                        </p>
                                        {event.source === 'task' && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 flex-shrink-0">
                                                {t('tasks.task', 'Tarea')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <ClockIcon className="w-3 h-3" />
                                        {getDaysRemaining(event.date)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                                <p className="font-bold text-red-600 dark:text-red-400">
                                    {formatCurrency(event.amount)}
                                </p>
                                {event.source === 'task' && onMarkAsPaid && (
                                    <button
                                        onClick={() => handleMarkAsPaid(event)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full"
                                        title={t('finance.mark_as_paid', 'Marcar como pagado')}
                                    >
                                        <CheckCircleIcon className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-32 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
                    <CalendarIcon className="w-8 h-8 mb-2 opacity-20" />
                    <p className="text-sm">{t('finance.no_upcoming', 'No hay pagos próximos')}</p>
                    <p className="text-xs mt-1 opacity-70">{t('finance.schedule_hint', 'Programa transacciones futuras')}</p>
                </div>
            )}
        </div>
    );
}
