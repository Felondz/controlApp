import { useMemo } from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import { formatCurrency as formatCurrencyHelper } from '@/Utils/currencyHelpers';
import { CalendarIcon, ClockIcon, CheckCircleIcon } from '@/Components/Icons';

export default function UpcomingObligationsWidget({
    events = [],
    financialTasks = [],
    accounts = [],
    currency = 'COP',
    onMarkAsPaid
}) {
    const { t } = useTranslate();

    const upcoming = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Helper to get next payment date based on day of month
        const getNextPaymentDate = (dayOfMonth) => {
            if (!dayOfMonth) return null;
            const date = new Date();
            date.setDate(dayOfMonth);
            date.setHours(0, 0, 0, 0);

            if (date < today) {
                date.setMonth(date.getMonth() + 1);
            }
            return date;
        };

        // Combine transactions, financial tasks, and account payments
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
                })),

            // Account Payments (Credit Cards & Loans)
            ...accounts
                .filter(acc => (acc.tipo === 'credito' || acc.tipo === 'prestamo') && acc.dia_pago && acc.estado === 'activa')
                .map(acc => {
                    const nextDate = getNextPaymentDate(acc.dia_pago);
                    if (!nextDate) return null;

                    // Estimate payment amount (quota for loans, or generic message for cards)
                    const amount = acc.tipo === 'prestamo' ? (acc.valor_cuota || 0) : 0;

                    return {
                        id: `account-${acc.id}`,
                        title: acc.nombre, // Use Account Name as Title
                        date: nextDate.toISOString(),
                        amount: amount,
                        type: 'gasto',
                        source: 'account',
                        accountType: acc.tipo,
                        accountName: acc.banco || t('finance.account', 'Cuenta') // Show Bank or Type in subtitle
                    };
                })
                .filter(Boolean),

            // Payroll Income (multiple dates per account)
            ...accounts
                .filter(acc => acc.es_nomina && acc.dia_nomina && acc.estado === 'activa')
                .flatMap(acc => {
                    const dias = Array.isArray(acc.dia_nomina) ? acc.dia_nomina : [acc.dia_nomina];
                    return dias.map(dia => {
                        const nextDate = getNextPaymentDate(dia);
                        if (!nextDate) return null;

                        return {
                            id: `payroll-${acc.id}-${dia}`,
                            title: acc.nombre, // Use Account Name as Title
                            date: nextDate.toISOString(),
                            amount: acc.valor_nomina || 0,
                            type: 'ingreso',
                            source: 'payroll',
                            accountType: acc.tipo,
                            accountName: t('finance.payroll', 'Nómina') // Context in subtitle
                        };
                    });
                })
                .filter(Boolean)
        ];

        return allObligations
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [events, financialTasks, accounts]);

    const formatCurrency = (value) => {
        return formatCurrencyHelper(value, currency, true);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(navigator.language, { day: 'numeric', month: 'short' }).format(date);
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
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm h-full flex flex-col relative">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary-600" />
                {t('finance.upcoming_payments', 'Próximos Eventos')}
            </h3>

            {upcoming.length > 0 ? (
                <div className="space-y-2 flex-1 overflow-y-auto pr-1 scrollbar-thin max-h-[450px]">
                    {upcoming.map((event) => (
                        <div
                            key={event.id}
                            onClick={() => console.log('Future feature: Open calendar for', event.date)}
                            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 group hover:shadow-md transition-all cursor-pointer hover:bg-white dark:hover:bg-gray-800"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                {/* Date Box - Compact */}
                                <div className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg border shadow-sm flex-shrink-0 ${event.type === 'ingreso'
                                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                                    : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                                    }`}>
                                    <span className={`text-[10px] font-bold uppercase leading-none mb-0.5 ${event.type === 'ingreso' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                        }`}>
                                        {new Date(event.date).toLocaleString(navigator.language, { month: 'short' }).replace('.', '')}
                                    </span>
                                    <span className={`text-sm font-bold leading-none ${event.type === 'ingreso' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                                        }`}>
                                        {new Date(event.date).getDate()}
                                    </span>
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {event.title}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        {/* Source Indicator (Subtle) */}
                                        {event.source === 'transaction' && (
                                            <span className="flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                                {event.accountName || t('finance.transaction', 'Transacción')}
                                            </span>
                                        )}
                                        {event.source === 'task' && (
                                            <span className="flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                {event.category?.name || t('tasks.task', 'Tarea')}
                                            </span>
                                        )}
                                        {event.source === 'account' && (
                                            <span className="flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                {event.accountName || t('finance.account', 'Cuenta')}
                                            </span>
                                        )}
                                        {event.source === 'payroll' && (
                                            <span className="flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                {event.accountName || t('finance.payroll', 'Nómina')}
                                            </span>
                                        )}

                                        <span className="text-gray-300 dark:text-gray-600">•</span>

                                        <span className="flex items-center gap-1">
                                            <ClockIcon className="w-3 h-3" />
                                            {getDaysRemaining(event.date)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Amount & Action */}
                            <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                                <p className={`font-bold text-sm ${event.type === 'ingreso'
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                                    }`}>
                                    {formatCurrency(event.amount)}
                                </p>
                                {event.source === 'task' && onMarkAsPaid && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent row click
                                            handleMarkAsPaid(event);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full"
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
                <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 min-h-[150px]">
                    <CalendarIcon className="w-8 h-8 mb-2 opacity-20" />
                    <p className="text-sm">{t('finance.no_upcoming', 'No hay pagos próximos')}</p>
                    <p className="text-xs mt-1 opacity-70">{t('finance.schedule_hint', 'Programa transacciones futuras')}</p>
                </div>
            )}

            {/* Currency badge - bottom left */}
            <div className="absolute bottom-4 left-4">
                <span className="text-xs px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium">
                    {currency}
                </span>
            </div>
        </div>
    );
}
