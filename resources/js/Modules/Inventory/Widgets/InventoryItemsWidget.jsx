import { Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { PackageIcon, ExclamationTriangleIcon, PlusIcon } from '@/Components/Icons';
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

export default function InventoryItemsWidget({ project, items = { data: [] }, onAdd, onEdit }) {
    const { t } = useTranslate();
    const itemsData = items.data || [];

    const getTypeBadgeStyle = (type) => {
        switch (type) {
            case 'raw_material': return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'finished_good': return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'component': return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
            default: return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('inventory.title')}</h3>
                {onAdd && (
                    <PrimaryButton size="sm" onClick={onAdd}>
                        <PlusIcon className="mr-2 h-3 w-3" /> {t('inventory.new_item', 'Nuevo')}
                    </PrimaryButton>
                )}
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex-1 flex flex-col">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('inventory.sku')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('inventory.name')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('inventory.type')}</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('inventory.current_stock')}</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('inventory.est_cost')}</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {itemsData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/25 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-gray-900 dark:text-gray-100">
                                        {item.sku}
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
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{item.description}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={getTypeBadgeStyle(item.type)}>
                                            {item.type.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex flex-col items-end">
                                            <span className={`text-sm font-bold ${item.current_stock <= item.min_stock_level ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                                {item.current_stock} {item.unit}
                                            </span>
                                            {item.current_stock <= item.min_stock_level && (
                                                <span className="text-xs text-red-600 dark:text-red-400 flex items-center mt-1">
                                                    <ExclamationTriangleIcon className="h-3 w-3 mr-1" /> {t('inventory.low_stock')}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                                        {item.cost_price ? `$${Number(item.cost_price).toFixed(2)}` : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {onEdit && (
                                            <SecondaryButton size="sm" onClick={() => onEdit(item)}>
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
                                            <PackageIcon className="h-10 w-10 mb-2 opacity-20" />
                                            <p>{t('inventory.empty_state')}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
