import { useTranslate } from '@/Hooks/useTranslate';
import { PackageIcon, CurrencyDollarIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@/Components/Icons';
import WidgetCard from '@/Modules/Core/Widgets/WidgetCard';

export default function InventorySummaryWidget({
    project,
    items = { data: [] },
    widget,
    isDragging,
    dragHandleProps,
    onHide
}) {
    const { t } = useTranslate();
    const itemsData = items?.data || [];

    // Calculate stats
    const totalItems = itemsData.length;
    const totalValue = itemsData.reduce((sum, item) => sum + (item.current_stock * (item.cost_price || 0)), 0);
    const lowStockCount = itemsData.filter(item => item.current_stock <= item.min_stock_level).length;
    const activeItems = itemsData.filter(item => item.is_active).length;

    const stats = [
        {
            label: t('inventory.total_items', 'Items Totales'),
            value: totalItems,
            icon: PackageIcon,
            color: 'text-primary-600 dark:text-primary-400',
            bgColor: 'bg-primary-100 dark:bg-primary-900/30',
        },
        {
            label: t('inventory.total_value', 'Valor Total'),
            value: `$${totalValue.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
            icon: CurrencyDollarIcon,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-100 dark:bg-green-900/30',
        },
        {
            label: t('inventory.low_stock_count', 'Bajo Stock'),
            value: lowStockCount,
            icon: ExclamationTriangleIcon,
            color: lowStockCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500',
            bgColor: lowStockCount > 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-800',
        },
        {
            label: t('inventory.active_items', 'Activos'),
            value: activeItems,
            icon: CheckCircleIcon,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        },
    ];

    return (
        <WidgetCard
            widget={widget}
            title={t('inventory.summary', 'Resumen de Inventario')}
            onHide={onHide}
            isDragging={isDragging}
            dragHandleProps={dragHandleProps}
        >
            <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                                <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </WidgetCard>
    );
}

