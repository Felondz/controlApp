import { useState, useCallback, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { PackageIcon, ExclamationTriangleIcon, PlusIcon, SearchIcon, FunnelIcon } from '@/Components/Icons';
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import WidgetCard from '@/Modules/Core/Widgets/WidgetCard';
import SearchInput from "@/Components/SearchInput";
import SelectInput from "@/Components/SelectInput";
import debounce from 'lodash/debounce';

export default function InventoryItemsWidget({
    project,
    items = { data: [] },
    filters = {},
    onAdd,
    onEdit,
    widget,
    isDragging,
    dragHandleProps,
    onHide
}) {
    const { t } = useTranslate();
    const itemsData = items.data || [];

    // Local state for filters to handle inputs instantly
    const [params, setParams] = useState({
        search: filters.search || '',
        type: filters.type || '',
        stock_status: filters.stock_status || ''
    });

    // Debounced server request
    const applyFilters = useCallback(
        debounce((nextParams) => {
            // Filter out empty values to keep URL clean
            const cleanParams = Object.keys(nextParams).reduce((acc, key) => {
                if (nextParams[key]) acc[key] = nextParams[key];
                return acc;
            }, {});

            router.get(route(route.current()), cleanParams, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['items', 'filters']
            });
        }, 300),
        []
    );

    const handleFilterChange = (key, value) => {
        const newParams = { ...params, [key]: value };
        setParams(newParams);
        applyFilters(newParams);
    };

    const getTypeBadgeStyle = (type) => {
        switch (type) {
            case 'raw_material': return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'finished_good': return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'component': return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
            case 'service': return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
            case 'asset': return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300';
            default: return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };
const actionButton = onAdd ? (
    <button
        id="tour-inventory-create"
        onClick={onAdd}
        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all text-xs font-medium"
    >
        <PlusIcon className="w-4 h-4" />
        <span className="hidden sm:inline">{t('inventory.new_item', 'Nuevo Item')}</span>
    </button>
) : null;

return (
    <WidgetCard
        widget={widget}
        title={t('inventory.title', 'Inventario')}
        action={actionButton}
        onHide={onHide}
        isDragging={isDragging}
        dragHandleProps={dragHandleProps}
    >
        {/* Filter Toolbar */}
        <div id="tour-inventory-filters" className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/10 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
                <SearchInput
                    placeholder={t('inventory.search_placeholder', 'Buscar por nombre o SKU...')}
                    value={params.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full h-10"
                />
            </div>
            <div className="w-full md:w-48">
                <SelectInput
                    value={params.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full h-10 text-sm"
                    options={[
                        { value: '', label: t('inventory.all_types', 'Todos los tipos') },
                        { value: 'raw_material', label: t('inventory.types.raw_material', 'Materia Prima') },
                        { value: 'finished_good', label: t('inventory.types.finished_good', 'Prod. Terminado') },
                        { value: 'service', label: t('inventory.types.service', 'Servicio') },
                        { value: 'asset', label: t('inventory.types.asset', 'Activo') },
                    ]}
                />
            </div>
            <div className="w-full md:w-48">
                <SelectInput
                    value={params.stock_status}
                    onChange={(e) => handleFilterChange('stock_status', e.target.value)}
                    className="w-full h-10 text-sm"
                    options={[
                        { value: '', label: t('inventory.all_stock_status', 'Todo el Stock') },
                        { value: 'low', label: t('inventory.low_stock', 'Bajo Stock') },
                        { value: 'normal', label: t('inventory.normal_stock', 'Stock Normal') },
                    ]}
                />
            </div>
        </div>

        <div id="tour-inventory-list" className="overflow-x-auto scrollbar-thin">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                        <tr>
                            <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('inventory.sku')}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('inventory.name')}</th>
                            <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('inventory.type_label', 'Tipo')}</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('inventory.current_stock')}</th>
                            <th scope="col" className="hidden lg:table-cell px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('inventory.est_cost')}</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {itemsData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/25 transition-colors group">
                                <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-gray-900 dark:text-gray-100">
                                    {item.sku || <span className="text-gray-300">-</span>}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0 mr-4">
                                            {item.image_url ? (
                                                <img className="h-10 w-10 rounded-lg object-cover bg-gray-100" src={item.image_url} alt={item.name} />
                                            ) : (
                                                <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                                    <PackageIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors">{item.name}</span>
                                            {item.description && (
                                                <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{item.description}</span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                                    <span className={getTypeBadgeStyle(item.type)}>
                                        {t(`inventory.types.${item.type}`, item.type.replace('_', ' '))}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex flex-col items-end">
                                        <span className={`text-sm font-bold ${item.is_low_stock || item.current_stock <= item.min_stock_level ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                            {Number(item.current_stock).toLocaleString()} <span className="text-xs font-normal text-gray-500">{item.unit}</span>
                                        </span>
                                        {(item.is_low_stock || item.current_stock <= item.min_stock_level) && (
                                            <span className="text-xs text-red-600 dark:text-red-400 flex items-center mt-1">
                                                <ExclamationTriangleIcon className="h-3 w-3 mr-1" /> {t('inventory.low_stock')}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                                    {item.cost_price ? `$${Number(item.cost_price).toFixed(2)}` : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {onEdit && (
                                        <SecondaryButton size="sm" onClick={() => onEdit(item)} className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            {t('common.edit', 'Editar')}
                                        </SecondaryButton>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {itemsData.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                    <div className="flex flex-col items-center justify-center">
                                        <PackageIcon className="h-12 w-12 mb-3 text-gray-300 dark:text-gray-600" />
                                        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('inventory.no_items_found', 'No se encontraron items')}</p>
                                        <p className="text-sm mt-1">{t('inventory.try_adjusting_filters', 'Intenta ajustar los filtros de búsqueda')}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination could go here */}
        </WidgetCard>
    );
}
