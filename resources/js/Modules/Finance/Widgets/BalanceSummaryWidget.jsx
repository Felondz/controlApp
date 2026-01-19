import { useMemo } from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import { formatCurrency as formatCurrencyHelper } from '@/Utils/currencyHelpers';
import { CurrencyDollarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@/Components/Icons';

import WidgetCard from '@/Modules/Core/Widgets/WidgetCard';

export default function BalanceSummaryWidget({
    accounts = [],
    currency = 'COP',
    widget,
    isDragging,
    dragHandleProps,
    onHide,
    inventoryStats = null // Receive inventory stats
}) {
    const { t } = useTranslate();

    const stats = useMemo(() => {
        let assets = 0;
        let liabilities = 0;
        const inventoryValue = parseFloat(inventoryStats?.totalValue || 0);

        accounts.forEach(account => {
            // Backend stores cents, so we divide by 100 to get units
            const balance = parseFloat(account.saldo_actual || 0) / 100;

            // Logic: 
            // - Cash, Bank, Investment, Other (positive balance) = Assets
            // - Credit, Loan = Liabilities (usually negative or debt)
            // - Inventory is added to Assets or Net Worth

            if (['credito', 'prestamo'].includes(account.tipo)) {
                // For credit/loans, the balance is usually debt. 
                // If the system stores it as positive debt, we treat it as liability.
                liabilities += Math.abs(balance);
            } else {
                // For other accounts, positive is asset, negative is liability (overdraft)
                if (balance >= 0) {
                    assets += balance;
                } else {
                    liabilities += Math.abs(balance);
                }
            }
        });

        return {
            assets,
            liabilities,
            inventoryValue,
            // Net Worth = Assets + Inventory - Liabilities
            netWorth: assets + inventoryValue - liabilities
        };
    }, [accounts, inventoryStats]);

    const formatCurrency = (value) => {
        return formatCurrencyHelper(value * 100, currency, true); // Multiply by 100 as helper expects cents
    };

    const formatNumber = (value) => {
        const showDecimals = ['USD', 'EUR'].includes(currency);
        return new Intl.NumberFormat(navigator.language, {
            minimumFractionDigits: showDecimals ? 2 : 0,
            maximumFractionDigits: showDecimals ? 2 : 0,
        }).format(value);
    };

    return (
        <WidgetCard
            widget={widget}
            title={t('finance.balance_summary', 'Resumen de Saldos')}
            onHide={onHide}
            isDragging={isDragging}
            dragHandleProps={dragHandleProps}
        >
            <div className="space-y-4">
                {/* Net Worth */}
                <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800">
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-1">
                        {t('finance.net_worth', 'Patrimonio Neto')}
                    </p>
                    <div className="flex items-baseline gap-2">
                        <p className={`text-3xl font-bold ${stats.netWorth >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                            {formatCurrency(Math.abs(stats.netWorth))}
                        </p>
                    </div>
                </div>

                <div className={`grid ${stats.inventoryValue > 0 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2'} gap-2`}>
                    {/* Assets */}
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800 flex flex-col items-center justify-center text-center">
                        <div className="flex items-center gap-2 mb-1 justify-center">
                            <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-500" />
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                {t('finance.assets', 'Activos')}
                            </p>
                        </div>
                        <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                            {formatNumber(stats.assets)}
                        </p>
                    </div>

                    {/* Inventory (Conditional) */}
                    {stats.inventoryValue > 0 && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 flex flex-col items-center justify-center text-center">
                            <div className="flex items-center gap-2 mb-1 justify-center">
                                {/* Improved Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-500">
                                    <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
                                </svg>
                                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                    {t('finance.inventory', 'Inventario')}
                                </p>
                            </div>
                            <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                                {formatNumber(stats.inventoryValue)}
                            </p>
                        </div>
                    )}

                    {/* Liabilities */}
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800 flex flex-col items-center justify-center text-center">
                        <div className="flex items-center gap-2 mb-1 justify-center">
                            <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
                            <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                                {t('finance.liabilities', 'Pasivos')}
                            </p>
                        </div>
                        <p className="text-lg font-bold text-red-700 dark:text-red-300">
                            {formatNumber(stats.liabilities)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Currency badge - bottom left */}
            <div className="absolute bottom-4 left-4 opacity-50 text-[10px]">
                <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium">
                    {currency}
                </span>
            </div>
        </WidgetCard>
    );
}
