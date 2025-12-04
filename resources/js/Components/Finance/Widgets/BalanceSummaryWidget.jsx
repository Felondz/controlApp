import { useMemo } from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import { formatCurrency as formatCurrencyHelper } from '@/Utils/currencyHelpers';
import { CurrencyDollarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@/Components/Icons';

export default function BalanceSummaryWidget({ accounts = [], currency = 'COP' }) {
    const { t } = useTranslate();

    const stats = useMemo(() => {
        let assets = 0;
        let liabilities = 0;

        accounts.forEach(account => {
            // Backend stores cents, so we divide by 100 to get units
            const balance = parseFloat(account.saldo_actual || 0) / 100;

            // Logic: 
            // - Cash, Bank, Investment, Other (positive balance) = Assets
            // - Credit, Loan = Liabilities (usually negative or debt)

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
            netWorth: assets - liabilities
        };
    }, [accounts]);

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
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm relative">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CurrencyDollarIcon className="w-5 h-5 text-primary-600" />
                {t('finance.balance_summary', 'Resumen de Saldos')}
            </h3>

            <div className="space-y-4">
                {/* Net Worth */}
                <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800">
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-1">
                        {t('finance.net_worth', 'Patrimonio Neto')}
                    </p>
                    <p className={`text-3xl font-bold ${stats.netWorth >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                        {formatCurrency(Math.abs(stats.netWorth))}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
            <div className="absolute bottom-4 left-4">
                <span className="text-xs px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium">
                    {currency}
                </span>
            </div>
        </div>
    );
}
