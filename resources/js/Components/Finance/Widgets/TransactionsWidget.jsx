import { useState, useMemo } from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import { formatCurrency } from '@/Utils/currencyHelpers';
import { getOwnerColor, getOwnerName, getOwnerInitials } from '@/Utils/ownerHelpers';
import { translateCategoryName } from '@/Utils/categoryHelpers';
import {
    PlusIcon,
    MinusIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    FunnelIcon,
    PencilIcon,
    TrashIcon,
    BoltIcon
} from '@/Components/Icons';
import QuickTransactionModal from '@/Components/Finance/Modals/QuickTransactionModal';

import WidgetCard from '@/Components/Dashboard/WidgetCard';

export default function TransactionsWidget({
    transactions = [],
    accounts = [],
    categories = [],
    currency = 'COP',
    onEdit,
    onDelete,
    currentUserId,
    projectId = null,
    projects = [],
    isCollaborative = false,
    // Widget props
    widget,
    isDragging,
    dragHandleProps,
    onHide
}) {
    const { t } = useTranslate();
    const [selectedAccount, setSelectedAccount] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [showQuickModal, setShowQuickModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const formatMonto = (monto) => {
        const showDecimals = ['USD', 'EUR'].includes(currency);
        return new Intl.NumberFormat(navigator.language, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: showDecimals ? 2 : 0,
            maximumFractionDigits: showDecimals ? 2 : 0,
        }).format(monto / 100);
    };

    const groupedTransactions = useMemo(() => {
        const filtered = transactions
            .filter(trans => {
                if (selectedAccount !== 'all' && trans.cuenta_id !== parseInt(selectedAccount)) {
                    return false;
                }
                if (selectedCategory !== 'all' && trans.categoria_id !== parseInt(selectedCategory)) {
                    return false;
                }
                return true;
            })
            .sort((a, b) => {
                const dateComparison = new Date(b.fecha) - new Date(a.fecha);
                if (dateComparison !== 0) return dateComparison;
                return b.id - a.id; // Fallback to ID descending (newest first)
            });

        const groupsMap = {};

        // First pass: group by date
        filtered.forEach(trans => {
            const dateObj = new Date(trans.fecha);
            const userTimezoneOffset = dateObj.getTimezoneOffset() * 60000;
            const adjustedDate = new Date(dateObj.getTime() + userTimezoneOffset);
            const dateKey = adjustedDate.toISOString().split('T')[0]; // Use YYYY-MM-DD for sorting

            if (!groupsMap[dateKey]) {
                groupsMap[dateKey] = {
                    date: adjustedDate,
                    label: adjustedDate.toLocaleDateString(),
                    transactions: []
                };
            }
            groupsMap[dateKey].transactions.push(trans);
        });

        // Convert to array and sort by date descending
        return Object.values(groupsMap).sort((a, b) => b.date - a.date);
    }, [transactions, selectedAccount, selectedCategory]);

    const getGroupLabel = (dateStr) => {
        const today = new Date().toLocaleDateString();
        const yesterday = new Date(Date.now() - 86400000).toLocaleDateString();
        if (dateStr === today) return t('common.today', 'Hoy');
        if (dateStr === yesterday) return t('common.yesterday', 'Ayer');
        return dateStr;
    };

    return (
        <WidgetCard
            widget={widget}
            title={t('finance.recent_transactions', 'Transacciones Recientes')}
            onHide={onHide}
            isDragging={isDragging}
            dragHandleProps={dragHandleProps}
            action={
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-1 rounded-lg transition-colors ${showFilters
                        ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                        } `}
                    title={t('finance.filter', 'Filtrar')}
                >
                    <FunnelIcon className="w-5 h-5" />
                </button>
            }
        >

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
            <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin">
                {groupedTransactions.length > 0 ? (
                    groupedTransactions.map((group) => (
                        <div key={group.label}>
                            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 pl-1">
                                {getGroupLabel(group.label)}
                            </h4>
                            <div className="space-y-3">
                                {group.transactions.map((trans) => {
                                    const isIncome = trans.categoria?.tipo?.toLowerCase() === 'ingreso' || trans.monto > 0;
                                    return (
                                        <div
                                            key={trans.id}
                                            className="group flex items-center gap-2 p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg hover:shadow-sm transition-all"
                                        >
                                            {/* Icon - Compact */}
                                            <div className={`p-1.5 rounded-full shrink-0 ${isIncome
                                                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                {isIncome ? (
                                                    <ArrowTrendingUpIcon className="w-4 h-4" />
                                                ) : (
                                                    <ArrowTrendingDownIcon className="w-4 h-4" />
                                                )}
                                            </div>

                                            {/* Details - Flexible */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {trans.descripcion || t('finance.no_description', 'Sin descripción')}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    {trans.categoria?.nombre ? translateCategoryName(trans.categoria.nombre, t) : t('finance.no_category', 'Sin categoría')}
                                                    {trans.cuenta?.nombre && ` • ${trans.cuenta.nombre}`}
                                                    {isCollaborative && trans.cuenta?.propietario && (
                                                        <span className={`ml-1 px-1 text-[10px] font-medium rounded ${getOwnerColor(trans.cuenta.propietario_id).bg} ${getOwnerColor(trans.cuenta.propietario_id).text}`}>
                                                            {getOwnerInitials(getOwnerName(trans.cuenta))}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>

                                            {/* Amount - Right aligned */}
                                            <span className={`text-sm font-bold shrink-0 ${isIncome
                                                ? 'text-green-600 dark:text-green-400'
                                                : 'text-red-600 dark:text-red-400'
                                                }`}>
                                                {isIncome ? '+' : '-'}{formatMonto(Math.abs(trans.monto))}
                                            </span>

                                            {/* Actions - Hidden until hover */}
                                            {trans.user_id === currentUserId && onEdit && onDelete && (
                                                <div className="hidden sm:flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => {
                                                            setEditingTransaction(trans);
                                                            setShowQuickModal(true);
                                                        }}
                                                        className="p-1 text-gray-400 hover:text-primary-600 rounded"
                                                        aria-label={t('common.edit', 'Editar')}
                                                    >
                                                        <PencilIcon className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => onDelete(trans)}
                                                        className="p-1 text-gray-400 hover:text-red-600 rounded"
                                                        aria-label={t('common.delete', 'Eliminar')}
                                                    >
                                                        <TrashIcon className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                        <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                            <BoltIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            {t('finance.no_transactions', 'No hay transacciones')}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                            {t('finance.start_adding', 'Comienza agregando tu primera transacción')}
                        </p>
                        <button
                            onClick={() => setShowQuickModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            <PlusIcon className="w-4 h-4" />
                            {t('finance.add_transaction', 'Agregar Transacción')}
                        </button>
                    </div>
                )}
            </div>

            {/* Summary */}
            {groupedTransactions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                            {t('finance.showing_transactions', 'Mostrando :count transacciones', { count: transactions.length })}
                        </span>
                    </div>
                </div>
            )}

            <QuickTransactionModal
                show={showQuickModal}
                onClose={() => {
                    setShowQuickModal(false);
                    setEditingTransaction(null);
                }}
                transaction={editingTransaction}
                proyectoId={projectId}
                proyectos={projects}
                cuentas={accounts}
                categorias={categories}
                onSuccess={() => {
                    setShowQuickModal(false);
                    setEditingTransaction(null);
                    // Trigger refresh if needed, usually handled by parent or Inertia
                }}
            />
        </WidgetCard>
    );
}
