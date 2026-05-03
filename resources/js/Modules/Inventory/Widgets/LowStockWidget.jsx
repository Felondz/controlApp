import { useTranslate } from '@/Hooks/useTranslate';
import { ExclamationTriangleIcon, PackageIcon } from '@/Components/Icons';
import WidgetCard from '@/Modules/Core/Widgets/WidgetCard';

export default function LowStockWidget({
    project,
    items = { data: [] },
    lowStockItems: providedLowStockItems,
    onEdit,
    widget,
    isDragging,
    dragHandleProps,
    onHide
}) {
    const { t } = useTranslate();

    // Use provided low stock items (server-side filtered) or fallback to client-side filtering of current page
    let lowStockItems = [];
    if (providedLowStockItems?.data) {
        lowStockItems = providedLowStockItems.data;
    } else {
        const itemsData = items?.data || [];
        lowStockItems = itemsData.filter(item => item.current_stock <= item.min_stock_level);
    }

    return (
        <WidgetCard
            widget={widget}
            title={t('inventory.low_stock_alert', 'Alertas de Stock Bajo')}
            onHide={onHide}
            isDragging={isDragging}
            dragHandleProps={dragHandleProps}
        >
            {lowStockItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-500">
                    <PackageIcon className="h-10 w-10 mb-2 opacity-30" />
                    <p className="text-sm">{t('inventory.no_low_stock', 'Todo el inventario está en niveles aceptables')}</p>
                </div>
            ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto overflow-x-hidden scrollbar-thin">
                    {lowStockItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => onEdit && onEdit(item)}
                            className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-red-100 dark:bg-red-900/50 rounded-lg">
                                    <ExclamationTriangleIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.sku || 'Sin SKU'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-red-600 dark:text-red-400">
                                    {item.current_stock} {item.unit}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {t('inventory.min_label', 'Mín')}: {item.min_stock_level}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </WidgetCard>
    );
}

