import { useTranslate } from '@/Hooks/useTranslate';
import { getOwnerColor, getOwnerName, getOwnerInitials } from '@/Utils/ownerHelpers';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartBarIcon } from '@/Components/Icons';
import { useMemo } from 'react';

import WidgetCard from '@/Modules/Core/Widgets/WidgetCard';

export default function AccountFlowWidget({
    transactions = [],
    accounts = [],
    isCollaborative = false,
    currency = 'COP',
    widget,
    isDragging,
    dragHandleProps,
    onHide
}) {
    const { t } = useTranslate();

    // Aggregate data by account
    const { incomeData, expenseData, netTotal, totalIncome, totalExpense } = useMemo(() => {
        const incomeMap = {};
        const expenseMap = {};
        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach(trans => {
            // Priority:
            // 1. trans.cuenta object (loaded via with('cuenta'))
            // 2. accounts array lookup
            // 3. Fallback object
            let account = trans.cuenta || accounts.find(a => a.id == trans.cuenta_id);

            if (!account) {
                // Fallback for transactions with deleted/detached accounts
                account = {
                    id: trans.cuenta_id || 'unknown',
                    nombre: t('finance.unknown_account', 'Cuenta Desconocida/Cerrada'),
                    propietario_id: null
                };
            }

            const amount = parseFloat(trans.monto) || 0; // Ensure number for math
            const key = account.id;

            if (amount > 0) {
                if (!incomeMap[key]) {
                    incomeMap[key] = {
                        id: key,
                        name: account.nombre,
                        account: account,
                        value: 0,
                        count: 0
                    };
                }
                incomeMap[key].value += amount;
                incomeMap[key].count++;
                totalIncome += amount;
            } else if (amount < 0) {
                if (!expenseMap[key]) {
                    expenseMap[key] = {
                        id: key,
                        name: account.nombre,
                        account: account,
                        value: 0,
                        count: 0
                    };
                }
                expenseMap[key].value += Math.abs(amount);
                expenseMap[key].count++;
                totalExpense += Math.abs(amount);
            }
        });

        return {
            incomeData: Object.values(incomeMap),
            expenseData: Object.values(expenseMap),
            netTotal: totalIncome - totalExpense,
            totalIncome,
            totalExpense
        };
    }, [transactions, accounts]);

    const formatMonto = (monto) => {
        const showDecimals = ['USD', 'EUR'].includes(currency);
        return new Intl.NumberFormat(navigator.language, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: showDecimals ? 2 : 0,
            maximumFractionDigits: showDecimals ? 2 : 0,
        }).format(monto / 100);
    };

    // Custom label - FIXED NaN bug
    const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        if (percent < 0.05) return null;

        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="text-xs font-bold"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
            >
                {(percent * 100).toFixed(1)}%
            </text>
        );
    };

    const CustomLegend = ({ payload }) => (
        <div className="mt-4 space-y-2">
            {payload.map((entry, index) => {
                const account = entry.payload.account;
                const ownerColor = account?.propietario_id ? getOwnerColor(account.propietario_id) : null;

                return (
                    <div key={`legend-${index}`} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div
                                className="w-3 h-3 rounded-sm flex-shrink-0 shadow-sm"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="truncate text-gray-700 dark:text-gray-300">
                                {entry.value}
                            </span>
                            {isCollaborative && account?.propietario && ownerColor && (
                                <span
                                    className={`px-1.5 py-0.5 text-[10px] font-medium rounded border flex-shrink-0 ${ownerColor.bg} ${ownerColor.text} ${ownerColor.border}`}
                                    title={`${t('finance.owner', 'Propietario')}: ${getOwnerName(account)}`}
                                >
                                    {getOwnerInitials(getOwnerName(account))}
                                </span>
                            )}
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white ml-2">
                            {formatMonto(entry.payload.value)}
                        </span>
                    </div>
                );
            })}
        </div>
    );

    const getSliceColor = (entry, index, type) => {
        // Use owner colors for collaborative projects when owner is set
        if (isCollaborative && entry.account?.propietario_id) {
            return getOwnerColor(entry.account.propietario_id).chartColor;
        }

        // Use distinct color palettes per account index for clear differentiation
        // Income: Vibrant greens/teals
        const incomeColors = [
            '#10B981', // emerald-500
            '#14B8A6', // teal-500
            '#22C55E', // green-500
            '#06B6D4', // cyan-500
            '#0D9488', // teal-600
            '#059669', // emerald-600
            '#16A34A', // green-600
            '#0891B2', // cyan-600
        ];

        // Expense: Vibrant reds/oranges/pinks
        const expenseColors = [
            '#EF4444', // red-500
            '#F97316', // orange-500
            '#EC4899', // pink-500
            '#F43F5E', // rose-500
            '#DC2626', // red-600
            '#EA580C', // orange-600
            '#DB2777', // pink-600
            '#E11D48', // rose-600
        ];

        const colors = type === 'income' ? incomeColors : expenseColors;
        return colors[index % colors.length];
    };

    return (
        <WidgetCard
            widget={widget}
            title={t('finance.account_flow', 'Flujo por Cuenta')}
            onHide={onHide}
            isDragging={isDragging}
            dragHandleProps={dragHandleProps}
        >

            <div className="w-full">
                {incomeData.length === 0 && expenseData.length === 0 ? (
                    <div className="text-center py-12">
                        <ChartBarIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">
                            {t('finance.no_transactions', 'No hay transacciones')}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {incomeData.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                                        {t('finance.income', 'Ingresos')}
                                    </h4>
                                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                        {formatMonto(totalIncome)}
                                    </span>
                                </div>
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <defs>
                                            {incomeData.map((_, index) => (
                                                <filter key={`shadow-i-${index}`} id={`shadow-i-${index}`} height="130%">
                                                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                                                    <feOffset dx="0" dy="2" result="offsetblur" />
                                                    <feComponentTransfer>
                                                        <feFuncA type="linear" slope="0.3" />
                                                    </feComponentTransfer>
                                                    <feMerge>
                                                        <feMergeNode />
                                                        <feMergeNode in="SourceGraphic" />
                                                    </feMerge>
                                                </filter>
                                            ))}
                                        </defs>
                                        <Pie
                                            data={incomeData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderLabel}
                                            outerRadius={85}
                                            innerRadius={40}
                                            dataKey="value"
                                            stroke="rgba(255,255,255,0.3)"
                                            strokeWidth={2}
                                            isAnimationActive={false}
                                        >
                                            {incomeData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-i-${index}`}
                                                    fill={getSliceColor(entry, index, 'income')}
                                                    filter={`url(#shadow-i-${index})`}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => [formatMonto(value), '']}
                                            contentStyle={{
                                                backgroundColor: '#1F2937',
                                                border: 'none',
                                                borderRadius: '8px',
                                                color: '#F3F4F6'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <CustomLegend payload={incomeData.map((entry, index) => ({
                                    value: entry.name,
                                    color: getSliceColor(entry, index, 'income'),
                                    payload: entry
                                }))} />
                            </div>
                        )}

                        {expenseData.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                                        {t('finance.expenses', 'Gastos')}
                                    </h4>
                                    <span className="text-sm font-bold text-red-600 dark:text-red-400">
                                        {formatMonto(totalExpense)}
                                    </span>
                                </div>
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <defs>
                                            {expenseData.map((_, index) => (
                                                <filter key={`shadow-e-${index}`} id={`shadow-e-${index}`} height="130%">
                                                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                                                    <feOffset dx="0" dy="2" result="offsetblur" />
                                                    <feComponentTransfer>
                                                        <feFuncA type="linear" slope="0.3" />
                                                    </feComponentTransfer>
                                                    <feMerge>
                                                        <feMergeNode />
                                                        <feMergeNode in="SourceGraphic" />
                                                    </feMerge>
                                                </filter>
                                            ))}
                                        </defs>
                                        <Pie
                                            data={expenseData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderLabel}
                                            outerRadius={85}
                                            innerRadius={40}
                                            dataKey="value"
                                            stroke="rgba(255,255,255,0.3)"
                                            strokeWidth={2}
                                            isAnimationActive={false}
                                        >
                                            {expenseData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-e-${index}`}
                                                    fill={getSliceColor(entry, index, 'expense')}
                                                    filter={`url(#shadow-e-${index})`}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => [formatMonto(value), '']}
                                            contentStyle={{
                                                backgroundColor: '#1F2937',
                                                border: 'none',
                                                borderRadius: '8px',
                                                color: '#F3F4F6'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <CustomLegend payload={expenseData.map((entry, index) => ({
                                    value: entry.name,
                                    color: getSliceColor(entry, index, 'expense'),
                                    payload: entry
                                }))} />
                            </div>
                        )}
                    </div>
                )}

                {(incomeData.length > 0 || expenseData.length > 0) && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('finance.net_flow', 'Flujo Neto')}
                            </span>
                            <span className={`text-lg font-bold ${netTotal >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {netTotal >= 0 ? '+' : ''}{formatMonto(netTotal)}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </WidgetCard >
    );
}

