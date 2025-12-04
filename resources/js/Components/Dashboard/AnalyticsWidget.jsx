import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslate } from '@/Hooks/useTranslate';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartBarIcon, CurrencyDollarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@/Components/Icons';

export default function AnalyticsWidget({ project }) {
    const { t } = useTranslate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, [project.id]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await axios.get(route('api.proyectos.analytics.index', project.id));
            setData(response.data);
        } catch (err) {
            console.error('Error fetching analytics:', err);
            setError('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                <div className="text-red-500 flex items-center gap-2">
                    <ChartBarIcon className="w-5 h-5" />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: project.moneda_default || 'COP' }).format(value);
    };

    const chartData = [
        { name: t('modules.analytics.total_income', 'Ingresos'), value: data.total_income, fill: '#10B981' },
        { name: t('modules.analytics.total_expenses', 'Gastos'), value: data.total_expenses, fill: '#EF4444' },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 transition-colors duration-200">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <ChartBarIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    {t('modules.analytics.title', 'Analíticas del Proyecto')}
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
                        <ArrowTrendingUpIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">{t('modules.analytics.total_income', 'Ingresos Totales')}</span>
                    </div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {formatCurrency(data.total_income)}
                    </div>
                </div>

                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-1">
                        <ArrowTrendingDownIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">{t('modules.analytics.total_expenses', 'Gastos Totales')}</span>
                    </div>
                    <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                        {formatCurrency(data.total_expenses)}
                    </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                        <CurrencyDollarIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">{t('modules.analytics.net_balance', 'Balance Neto')}</span>
                    </div>
                    <div className={`text-2xl font-bold ${data.net_balance >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(data.net_balance)}
                    </div>
                </div>
            </div>

            <div className="w-full">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        <XAxis dataKey="name" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            itemStyle={{ color: '#374151' }}
                        />
                        <Legend />
                        <Bar dataKey="value" name="Monto" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
