import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { useTranslate } from '@/Hooks/useTranslate';
import WidgetCard from '@/Components/Dashboard/WidgetCard';
import { CurrencyDollarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, CalendarIcon } from '@/Components/Icons';
import { formatCurrency } from '@/Utils/currencyHelpers';

/**
 * FinanceSummaryWidget - Compact finance overview for project dashboard
 * 
 * Variants:
 * - balance: Shows total balance with trend
 * - upcoming: Shows upcoming obligations
 * - transactions: Shows recent transaction count
 */
export default function FinanceSummaryWidget({ project, widget, variant = 'balance', onHide, isDragging, dragHandleProps }) {
    const { t } = useTranslate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (project?.id) {
            fetchData();
        }
    }, [project?.id, variant]);

    const fetchData = async () => {
        try {
            const response = await axios.get(route('api.finance.balance', project.id));
            setData(response.data);
        } catch (error) {
            console.error('Error fetching finance data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-3">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
        );
    }

    const balance = data?.balance || 0;
    const currency = project?.moneda_default || 'COP';

    // Helper to render WidgetCard with common props
    const renderCard = (title, content) => (
        <WidgetCard
            widget={widget}
            title={title}
            onHide={onHide}
            isDragging={isDragging}
            dragHandleProps={dragHandleProps}
        >
            {content}
        </WidgetCard>
    );

    // Balance variant
    if (variant === 'balance') {
        return renderCard(
            t('finance.total_balance', 'Balance Total'),
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            {t('finance.total_balance', 'Balance Total')}
                        </p>
                        <p className={`text-2xl font-bold ${balance >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                            {formatCurrency(balance, currency, true)}
                        </p>
                    </div>
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${balance >= 0 ? 'bg-success-100 dark:bg-success-900/30 text-success-600' : 'bg-danger-100 dark:bg-danger-900/30 text-danger-600'}`}>
                        {balance >= 0 ? (
                            <ArrowTrendingUpIcon className="h-5 w-5" />
                        ) : (
                            <ArrowTrendingDownIcon className="h-5 w-5" />
                        )}
                    </div>
                </div>

                <Link
                    href={route('mis-proyectos.finance', project.id)}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                >
                    {t('finance.view_details', 'Ver panel financiero')} →
                </Link>
            </div>
        );
    }

    // Upcoming obligations variant
    if (variant === 'upcoming') {
        const pendingCount = data?.pending_bills || 0;

        return renderCard(
            t('finance.upcoming_obligations', 'Próximas Obligaciones'),
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            {t('finance.upcoming_obligations', 'Próximas Obligaciones')}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {pendingCount}
                        </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center text-warning-600">
                        <CalendarIcon className="h-5 w-5" />
                    </div>
                </div>

                {pendingCount > 0 && (
                    <p className="text-xs text-warning-600 dark:text-warning-400">
                        {t('finance.bills_pending', ':count facturas pendientes', { count: pendingCount })}
                    </p>
                )}
            </div>
        );
    }

    // Transactions variant
    return renderCard(
        t('finance.recent_transactions', 'Transacciones Recientes'),
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {t('finance.recent_transactions', 'Transacciones Recientes')}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {data?.transaction_count || 0}
                    </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600">
                    <CurrencyDollarIcon className="h-5 w-5" />
                </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('finance.this_month', 'Este mes')}
            </p>
        </div>
    );
}
