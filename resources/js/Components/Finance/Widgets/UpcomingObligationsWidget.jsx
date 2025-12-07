import { useMemo } from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import { formatCurrency as formatCurrencyHelper } from '@/Utils/currencyHelpers';
import { CalendarIcon, ClockIcon, CheckCircleIcon } from '@/Components/Icons';

import WidgetCard from '@/Components/Dashboard/WidgetCard';

export default function UpcomingObligationsWidget({
    events = [],
    financialTasks = [],
    bills = [],
    accounts = [],
    currency = 'COP',
    onMarkAsPaid,
    onPayBill,
    // Widget props
    widget,
    isDragging,
    dragHandleProps,
    onHide
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

        // Combine financial tasks, pending bills, and account payments
        const allObligations = [
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

            // Pending Bills
            ...bills.map(bill => ({
                id: `bill-${bill.id}`,
                billId: bill.id,
                billData: bill,
                title: bill.descripcion || t('finance.bill', 'Factura'),
                date: bill.fecha,
                amount: bill.monto,
                type: 'gasto',
                source: 'bill',
                status: 'pending',
                category: bill.categoria
            })),

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
    }, [events, financialTasks, accounts, bills]);

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
        <WidgetCard
            widget={widget}
            title={t('finance.upcoming_payments', 'Próximos Eventos')}
            onHide={onHide}
            isDragging={isDragging}
            dragHandleProps={dragHandleProps}
        >

            {upcoming.length > 0 ? (
                <div className="space-y-2 flex-1 overflow-y-auto pr-1 scrollbar-thin max-h-[320px]">
                    {upcoming.map((event) => (
                        <div
                            key={event.id}
                            className="group flex items-center gap-2 p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg hover:shadow-sm transition-all"
                        >
                            {/* Icon - Compact (same as TransactionsWidget) */}
                            <div className={`p-1.5 rounded-full shrink-0 ${event.type === 'ingreso'
                                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                <CalendarIcon className="w-4 h-4" />
                            </div>

                            {/* Details - Flexible */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {event.title}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {new Date(event.date).toLocaleDateString(navigator.language, { day: 'numeric', month: 'short' })}
                                    {' • '}
                                    {event.source === 'bill' && <span className="text-yellow-600">{t('finance.bill', 'Factura')}</span>}
                                    {event.source === 'task' && <span className="text-blue-500">{event.category?.name || t('tasks.task', 'Tarea')}</span>}
                                    {event.source === 'payroll' && <span className="text-green-500">{t('finance.payroll', 'Nómina')}</span>}
                                    {event.source === 'account' && <span className="text-gray-500">{event.accountName || t('finance.account', 'Cuenta')}</span>}
                                    {' • '}
                                    <span className={event.type === 'ingreso' ? 'text-green-600' : 'text-red-500'}>{getDaysRemaining(event.date)}</span>
                                </p>
                            </div>

                            {/* Amount - Right aligned */}
                            <span className={`text-sm font-bold shrink-0 ${event.type === 'ingreso'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                                }`}>
                                {formatCurrency(event.amount)}
                            </span>

                            {/* Actions */}
                            {event.source === 'task' && onMarkAsPaid && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleMarkAsPaid(event); }}
                                    className="hidden sm:block p-1 text-green-600 hover:bg-green-50 rounded opacity-0 group-hover:opacity-100"
                                    title={t('finance.mark_as_paid', 'Marcar como pagado')}
                                >
                                    <CheckCircleIcon className="w-4 h-4" />
                                </button>
                            )}
                            {event.source === 'bill' && onPayBill && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onPayBill(event.billData); }}
                                    className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                                    title={t('finance.pay_bill', 'Pagar factura')}
                                >
                                    <CheckCircleIcon className="w-4 h-4" />
                                </button>
                            )}
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

            {/* Currency badge - separate row at bottom */}
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400 flex justify-between items-center">
                <span>{currency}</span>
            </div>
        </WidgetCard>
    );
}
