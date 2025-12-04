import { useState, useMemo } from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import { formatCurrency } from '@/Utils/currencyHelpers';
import { PlusIcon, MinusIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, FunnelIcon } from '@/Components/Icons';

export default function TransactionsWidget({
    transactions = [],
    accounts = [],
    categories = [],
    currency = 'COP',
    onEdit,
    onDelete,
    currentUserId
}) {
    const { t } = useTranslate();
    const [selectedAccount, setSelectedAccount] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    const formatMonto = (monto) => {
        const showDecimals = ['USD', 'EUR'].includes(currency);
        return new Intl.NumberFormat(navigator.language, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: showDecimals ? 2 : 0,
            maximumFractionDigits: showDecimals ? 2 : 0,
        }).format(monto / 100);
    };

    const filteredTransactions = useMemo(() => {
        return transactions.filter(trans => {
            if (selectedAccount !== 'all' && trans.cuenta_id !== parseInt(selectedAccount)) {
                return false;
            }
            if (selectedCategory !== 'all' && trans.categoria_id !== parseInt(selectedCategory)) {
                return false;
            }
            return true;
        });
    }, [transactions, selectedAccount, selectedCategory]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('finance.recent_transactions', 'Transacciones Recientes')}
                </h3>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p - 2 rounded - lg transition - colors ${showFilters
                            ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        } `}
                    title={t('finance.filter', 'Filtrar')}
                >
                    <FunnelIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('finance.filter_by_account', 'Filtrar por Cuenta')}
                        </label>
                        <select
                            value={selectedAccount}
                            onChange={(e) => setSelectedAccount(e.target.value)}
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
                        >
                            <option value="all">{t('finance.all_accounts', 'Todas las Cuentas')}</option>
                            {accounts.map(account => (
                                <option key={account.id} value={account.id}>
                                    {account.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('finance.filter_by_category', 'Filtrar por Categoría')}
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
                        >
                            <option value="all">{t('finance.all_categories', 'Todas las Categorías')}</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Transactions List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredTransactions.length > 0 ? (
                    filteredTransactions.slice(0, 30).map((trans) => (
                        <div
                            key={trans.id}
                            className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {trans.descripcion || t('finance.no_description', 'Sin descripción')}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {trans.cuenta?.nombre} • {trans.categoria?.nombre} • {new Date(trans.fecha).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                                <span className={`text - sm font - semibold whitespace - nowrap ${trans.categoria?.tipo === 'ingreso'
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-red-600 dark:text-red-400'
                                    } `}>
                                    {trans.categoria?.tipo === 'ingreso' ? '+' : '-'}
                                    {formatMonto(trans.monto)}
                                </span>
                                {trans.user_id === currentUserId && onEdit && onDelete && (
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => onEdit(trans)}
                                            className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                                            aria-label={t('common.edit', 'Editar')}
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(trans)}
                                            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                            aria-label={t('common.delete', 'Eliminar')}
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('finance.no_transactions_found', 'No se encontraron transacciones')}
                        </p>
                    </div>
                )}
            </div>

            {/* Summary */}
            {filteredTransactions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                            {t('finance.showing_transactions', 'Mostrando :count transacciones', {
                                count: Math.min(filteredTransactions.length, 30)
                            })}
                        </span>
                        {filteredTransactions.length > 30 && (
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                {t('finance.more_transactions', '+:count más', {
                                    count: filteredTransactions.length - 30
                                })}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
