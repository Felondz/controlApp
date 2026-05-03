import { useState, useEffect } from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import { CurrencyDollarIcon } from '@/Components/Icons';
import axios from 'axios';
import { formatCurrency } from '@/Utils/currencyHelpers';

export default function FinanceWidget({ project }) {
    const { t } = useTranslate();
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (project?.uuid) {
            fetchBalance();
        }
    }, [project?.uuid]);

    const fetchBalance = async () => {
        if (!project?.uuid) {
            console.warn('FinanceWidget: project.uuid is missing');
            setLoading(false);
            return;
        }

        // Defensive check: Ensure route exists before calling
        if (!route().has('api.finance.balance')) {
            console.warn('Route api.finance.balance not found');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(route('api.finance.balance', project.uuid));
            setBalance(response.data.balance);
        } catch (error) {
            console.error('Error fetching balance:', error);
            // Optional: Set error state if needed, or just leave balance as null
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-full text-center relative">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                {t('finance.current_balance', 'Balance Actual')}
            </h4>
            {loading ? (
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ) : (
                <>
                    <p className={`text-2xl font-bold mb-2 ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(balance, project?.moneda_default || 'USD', true)}
                    </p>
                    {/* Currency badge with project color - aligned to left */}
                    <div className="w-full flex justify-start px-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium">
                            {project?.moneda_default || 'USD'}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
}
