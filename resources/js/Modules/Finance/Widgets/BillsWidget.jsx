import { useTranslate } from '@/Hooks/useTranslate';
import { formatCurrency } from '@/Utils/currencyHelpers';
import { translateCategoryName } from '@/Utils/categoryHelpers';
import {
    BoltIcon,
    PencilIcon,
    TrashIcon,
    CheckCircleIcon,
    ClockIcon
} from '@/Components/Icons';

import WidgetCard from '@/Modules/Core/Widgets/WidgetCard';

export default function BillsWidget({
    bills = [],
    currency = 'COP',
    onAdd,
    onEdit,
    onDelete,
    onPay,
    // Widget props
    widget,
    isDragging,
    dragHandleProps,
    onHide
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

    const titleContent = (
        <div className="flex items-center gap-2">
            <span>{t('finance.pending_bills', 'Facturas Pendientes')}</span>
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {bills.length}
            </span>
        </div>
    );

    return (
        <WidgetCard
            widget={widget}
            title={titleContent}
            onHide={onHide}
            isDragging={isDragging}
            dragHandleProps={dragHandleProps}
            action={onAdd && (
                <button
                    onClick={onAdd}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all text-xs font-medium"
                    aria-label={t('finance.add_bill', 'Agregar Factura')}
                >
                    <BoltIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('finance.bill', 'Factura')}</span>
                </button>
            )}
        >

            {/* Bills List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin">
                {bills.length > 0 ? (
                    bills.map((bill) => {
                        const billDate = bill.fecha_vencimiento || bill.fecha;
                        const remaining = getDaysRemaining(billDate);
                        return (
                            <div
                                key={bill.id}
                                className="group flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-lg hover:shadow-sm transition-all"
                            >
                                {/* Date Box - Compact */}
                                <div className="flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 shrink-0">
                                    <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase leading-none">
                                        {new Date(billDate).toLocaleString(navigator.language, { month: 'short' }).replace('.', '')}
                                    </span>
                                    <span className="text-sm font-bold text-gray-800 dark:text-white leading-none">
                                        {new Date(billDate).getDate()}
                                    </span>
                                </div>

                                {/* Details - Flexible */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {bill.descripcion || t('finance.no_description', 'Sin descripción')}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        <span className={remaining.color}>{remaining.text}</span>
                                        {bill.numero_factura && ` • ${bill.numero_factura}`}
                                        {bill.categoria?.nombre && ` • ${translateCategoryName(bill.categoria.nombre, t)}`}
                                    </p>
                                </div>

                                {/* Amount - Right aligned */}
                                <span className="text-sm font-bold text-gray-900 dark:text-white shrink-0">
                                    {formatMonto(bill.monto)}
                                </span>

                                {/* Actions */}
                                <div className="flex gap-0.5 shrink-0">
                                    <button
                                        onClick={() => onPay && onPay(bill)}
                                        className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                                        title={t('finance.pay_bill', 'Pagar Factura')}
                                    >
                                        <CheckCircleIcon className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => (onEditBill || onEdit)?.(bill)}
                                        className="hidden sm:block p-1.5 text-gray-400 hover:text-primary-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                        title={t('common.edit', 'Editar')}
                                    >
                                        <PencilIcon className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                        onClick={() => (onDeleteBill || onDelete)?.(bill)}
                                        className="hidden sm:block p-1.5 text-gray-400 hover:text-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                        title={t('common.delete', 'Eliminar')}
                                    >
                                        <TrashIcon className="h-3.5 w-3.5" />
                                    </button>
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
        </WidgetCard>
    );
}
