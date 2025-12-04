import { useTranslate } from '@/Hooks/useTranslate';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useMemo } from 'react';

export default function FinancialChartsWidget({ transactions = [], currency = 'COP' }) {
    const { t } = useTranslate();

    const data = useMemo(() => {
        const last6Months = [];
        const today = new Date();

        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthName = d.toLocaleString(navigator.language, { month: 'short' });
            last6Months.push({
                name: monthName,
                month: d.getMonth(),
                year: d.getFullYear(),
                income: 0,
                expense: 0
            });
        }

        // Aggregate transactions
        transactions.forEach(t => {
            const tDate = new Date(t.fecha);
            const monthIndex = last6Months.findIndex(m => m.month === tDate.getMonth() && m.year === tDate.getFullYear());

            if (monthIndex !== -1) {
                // Backend stores cents, so we divide by 100 to get units
                const amount = parseFloat(t.monto) / 100;
                const type = t.categoria?.tipo || (t.monto > 0 ? 'ingreso' : 'gasto');

                if (type === 'ingreso' || type === 'income') {
                    last6Months[monthIndex].income += amount;
                } else {
                    last6Months[monthIndex].expense += Math.abs(amount);
                }
            }
        });

        return last6Months;
    }, [transactions]);

    const formatCurrency = (value) => {
        const showDecimals = ['USD', 'EUR'].includes(currency);
        return new Intl.NumberFormat(navigator.language, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: showDecimals ? 2 : 0,
            maximumFractionDigits: showDecimals ? 2 : 0,
        }).format(value);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t('finance.cash_flow', 'Flujo de Caja (Últimos 6 Meses)')}
                </h3>
            </div>

            <div className="w-full">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#F3F4F6'
                            }}
                            formatter={(value) => [formatCurrency(value), '']}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar
                            dataKey="income"
                            name={t('finance.income', 'Ingresos')}
                            fill="#10B981"
                            radius={[4, 4, 0, 0]}
                            barSize={20}
                        />
                        <Bar
                            dataKey="expense"
                            name={t('finance.expenses', 'Gastos')}
                            fill="#EF4444"
                            radius={[4, 4, 0, 0]}
                            barSize={20}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
