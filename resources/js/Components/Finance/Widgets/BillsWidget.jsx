import { useTranslate } from '@/Hooks/useTranslate';
import { formatCurrency } from '@/Utils/currencyHelpers';
import {
    BoltIcon,
    PencilIcon,
    TrashIcon,
    CheckCircleIcon,
    ClockIcon
} from '@/Components/Icons';

export default function BillsWidget({
    bills = [],
    currency = 'COP',
    onAdd,
    onEdit,
    onDelete,
    onPay
}) {
    const { t } = useTranslate();

    const formatMonto = (monto) => {
        return formatCurrency(Math.abs(monto), currency);
    };

    const getDaysRemaining = (dateString) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const date = new Date(dateString);
        const diffTime = date - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { text: t('common.overdue', 'Vencido'), color: 'text-red-600 dark:text-red-400' };
        if (diffDays === 0) return { text: t('common.today', 'Hoy'), color: 'text-orange-600 dark:text-orange-400' };
        if (diffDays === 1) return { text: t('common.tomorrow', 'Mañana'), color: 'text-yellow-600 dark:text-yellow-400' };
        return { text: `${diffDays} ${t('common.days', 'días')}`, color: 'text-gray-500 dark:text-gray-400' };
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <BoltIcon className="w-5 h-5 text-yellow-500" />
                        {t('finance.pending_bills', 'Facturas Pendientes')}
                    </h3>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {bills.length}
                    </span>
                </div>
                {onAdd && (
                    <button
                        onClick={onAdd}
                        className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all hover:shadow-md border-2 border-transparent hover:border-primary-500 dark:hover:border-primary-600"
                        aria-label={t('finance.add_bill', 'Agregar Factura')}
                    >
                        <BoltIcon className="h-4 w-4" />
                        <span className="text-xs font-medium hidden sm:inline">{t('finance.bill', 'Factura')}</span>
                    </button>
                )}
            </div>

            {/* Bills List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {bills.length > 0 ? (
                    bills.map((bill) => {
                        const remaining = getDaysRemaining(bill.fecha);
                        return (
                            <div
                                key={bill.id}
                                className="group flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-md transition-all duration-200 hover:border-primary-200 dark:hover:border-primary-800"
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    {/* Date Box */}
                                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 flex-shrink-0">
                                        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase leading-none mb-0.5">
                                            {new Date(bill.fecha).toLocaleString(navigator.language, { month: 'short' }).replace('.', '')}
                                        </span>
                                        <span className="text-lg font-bold text-gray-800 dark:text-white leading-none">
                                            {new Date(bill.fecha).getDate()}
                                        </span>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                            {bill.descripcion || t('finance.no_description', 'Sin descripción')}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs mt-0.5">
                                            <span className={`font-medium flex items-center gap-1 ${remaining.color}`}>
                                                <ClockIcon className="w-3 h-3" />
                                                {remaining.text}
                                            </span>
                                            <span className="text-gray-300 dark:text-gray-600">•</span>
                                            <span className="text-gray-500 dark:text-gray-400">
                                                {bill.categoria?.nombre}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 ml-4">
                                    <span className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">
                                        {formatMonto(bill.monto)}
                                    </span>

                                    {/* Actions */}
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => onPay && onPay(bill)}
                                            className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                            title={t('finance.pay_bill', 'Pagar Factura')}
                                        >
                                            <CheckCircleIcon className="h-5 w-5" />
                                        </button>

                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onEdit && onEdit(bill)}
                                                className="p-1.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                title={t('common.edit', 'Editar')}
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => onDelete && onDelete(bill)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title={t('common.delete', 'Eliminar')}
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                        <BoltIcon className="mx-auto w-8 h-8 text-gray-300 dark:text-gray-600 mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('finance.no_pending_bills', 'No hay facturas pendientes')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
