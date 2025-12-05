import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslate } from '@/Hooks/useTranslate';
import { formatCurrency } from '@/Utils/currencyHelpers';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartBarIcon, CurrencyDollarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@/Components/Icons';

export default function AnalyticsWidget({ project }) {
    const { t } = useTranslate();
    const [data, setData] = useState(null);
    const [trendData, setTrendData] = useState([]);
    const [timeRange, setTimeRange] = useState('30');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const timeRangeOptions = [
        { value: '7', label: t('analytics.last_7_days', 'Últimos 7 Días') },
        { value: '30', label: t('analytics.last_30_days', 'Últimos 30 Días') },
        { value: '90', label: t('analytics.last_90_days', 'Últimos 90 Días') },
        { value: 'all', label: t('analytics.all_time', 'Todo el Tiempo') },
    ];

    useEffect(() => {
        fetchAnalytics();
    }, [project.id, timeRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch totals
            const totalsResponse = await axios.get(
                route('api.proyectos.analytics.index', project.id)
            );

            // Fetch trend data (skip for 'all' to avoid overload)
            if (timeRange !== 'all') {
                const trendsResponse = await axios.get(
                    route('api.proyectos.analytics.trends', project.id),
                    { params: { days: timeRange } }
                );
                setTrendData(trendsResponse.data.trends || []);
            } else {
                setTrendData([]);
            }

            setData(totalsResponse.data);
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

    return (
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 transition-colors duration-200 relative">
            {/* Header with Time Range Selector */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <ChartBarIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    {t('modules.analytics.title', 'Analíticas del Proyecto')}
                </h3>
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                >
                    {timeRangeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
                        <ArrowTrendingUpIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">{t('modules.analytics.total_income', 'Ingresos Totales')}</span>
                    </div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {formatCurrency(data.total_income, project.moneda_default || 'COP', true)}
                    </div>
                </div>

                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-1">
                        <ArrowTrendingDownIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">{t('modules.analytics.total_expenses', 'Gastos Totales')}</span>
                    </div>
                    <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                        {formatCurrency(data.total_expenses, project.moneda_default || 'COP', true)}
                    </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                        <CurrencyDollarIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">{t('modules.analytics.net_balance', 'Balance Neto')}</span>
                    </div>
                    <div className={`text - 2xl font - bold ${data.net_balance >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'} `}>
                        {formatCurrency(data.net_balance, project.moneda_default || 'COP', true)}
                    </div>
                </div>
            </div>

            {/* Charts */}
            {timeRange !== 'all' && trendData.length > 0 ? (
                <div className="w-full">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                        {t('analytics.income_expense_trend', 'Tendencia Ingresos vs Gastos')}
                    </h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis
                                dataKey="date"
                                stroke="#6B7280"
                                tick={{ fill: '#6B7280' }}
                            />
                            <YAxis
                                stroke="#6B7280"
                                tick={{ fill: '#6B7280' }}
                                tickFormatter={(value) => formatCurrency(value)}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    borderRadius: '0.5rem',
                                    border: 'none',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                                itemStyle={{ color: '#374151' }}
                                formatter={(value) => formatCurrency(value)}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="income"
                                stroke="#10B981"
                                strokeWidth={2}
                                name={t('finance.income', 'Ingresos')}
                                dot={{ fill: '#10B981', r: 4 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="expense"
                                stroke="#EF4444"
                                strokeWidth={2}
                                name={t('finance.expense', 'Gastos')}
                                dot={{ fill: '#EF4444', r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="w-full">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={[
                                { name: t('modules.analytics.total_income'), value: data.total_income / 100, fill: '#10B981' },
                                { name: t('modules.analytics.total_expenses'), value: data.total_expenses / 100, fill: '#EF4444' },
                            ]}
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
            )}

            {/* Currency badge - bottom left */}
            <div className="absolute bottom-4 left-4">
                <span className="text-xs px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium">
                    {project.moneda_default || 'COP'}
                </span>
            </div>
        </div>
    );
}
