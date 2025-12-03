import { useState, useEffect } from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import { CurrencyDollarIcon } from '@/Components/Icons';
import axios from 'axios';

export default function FinanceWidget({ project }) {
    const { t } = useTranslate();
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (project?.id) {
            fetchBalance();
        }
    }, [project?.id]);

    const fetchBalance = async () => {
        try {
            const response = await axios.get(route('api.finance.balance', project.id));
            setBalance(response.data.balance);
        } catch (error) {
            console.error('Error fetching balance:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: project?.moneda_default || 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    return (
        <div className="flex flex-col justify-center items-center h-full text-center">
            <CurrencyDollarIcon className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-2" />
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                {t('finance.balance', 'Balance Total')}
            </p>
            {loading ? (
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ) : (
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(balance)}
                </p>
            )}
        </div>
    );
}
