import { useState, useEffect } from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import { CurrencyDollarIcon, CalendarIcon, ChartBarIcon, ArrowTrendingUpIcon } from '@/Components/Icons';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function GoalsMode({
    amount, setAmount,
    rate, setRate,
    term, setTerm,
    termType, setTermType,
    rateType, setRateType,
    results,
    formatCurrency
}) {
    const { t } = useTranslate();
    const [monthlyContribution, setMonthlyContribution] = useState('');
    const [currentSavings, setCurrentSavings] = useState('');

    // Local state for goal-specific calculations
    const [goalResults, setGoalResults] = useState(null);

    useEffect(() => {
        calculateGoal();
    }, [amount, monthlyContribution, currentSavings, rate, rateType]);

    const calculateGoal = () => {
        if (!amount || !monthlyContribution) {
            setGoalResults(null);
            return;
        }

        const targetAmount = parseFloat(amount);
        const monthly = parseFloat(monthlyContribution);
        const initial = parseFloat(currentSavings) || 0;
        const annualRate = parseFloat(rate) || 0;

        // Convert annual rate to monthly rate
        let monthlyRate = 0;
        if (annualRate > 0) {
            if (rateType === 'EA') {
                monthlyRate = Math.pow(1 + annualRate / 100, 1 / 12) - 1;
            } else {
                monthlyRate = (annualRate / 100) / 12;
            }
        }

        let currentBalance = initial;
        let months = 0;
        const data = [];
        const maxMonths = 360; // 30 years limit

        while (currentBalance < targetAmount && months < maxMonths) {
            const interest = currentBalance * monthlyRate;
            currentBalance += monthly + interest;
            months++;

            if (months % 6 === 0 || months === 1 || currentBalance >= targetAmount) {
                data.push({
                    month: months,
                    balance: Math.round(currentBalance),
                    invested: Math.round(initial + (monthly * months)),
                    interest: Math.round(currentBalance - (initial + (monthly * months)))
                });
            }
        }

        setGoalResults({
            months,
            totalInvested: initial + (monthly * months),
            totalInterest: currentBalance - (initial + (monthly * months)),
            chartData: data,
            reached: currentBalance >= targetAmount
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-4 space-y-6">
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <ArrowTrendingUpIcon className="w-5 h-5 text-primary-500" />
                        {t('calculator.goals.title', 'Plan de Ahorro')}
                    </h3>

                    <div className="space-y-4">
                        {/* Goal Amount */}
                        <div>
                            <InputLabel htmlFor="goal_amount" value={t('calculator.goals.target_amount', 'Meta de Ahorro')} />
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">$</span>
                                </div>
                                <TextInput
                                    id="goal_amount"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="pl-7 block w-full"
                                    placeholder="1000000"
                                />
                            </div>
                        </div>

                        {/* Current Savings */}
                        <div>
                            <InputLabel htmlFor="current_savings" value={t('calculator.goals.current_savings', 'Ahorro Actual (Opcional)')} />
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">$</span>
                                </div>
                                <TextInput
                                    id="current_savings"
                                    type="number"
                                    value={currentSavings}
                                    onChange={(e) => setCurrentSavings(e.target.value)}
                                    className="pl-7 block w-full"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* Monthly Contribution */}
                        <div>
                            <InputLabel htmlFor="monthly_contribution" value={t('calculator.goals.monthly_contribution', 'Ahorro Mensual')} />
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">$</span>
                                </div>
                                <TextInput
                                    id="monthly_contribution"
                                    type="number"
                                    value={monthlyContribution}
                                    onChange={(e) => setMonthlyContribution(e.target.value)}
                                    className="pl-7 block w-full"
                                    placeholder="100000"
                                />
                            </div>
                        </div>

                        {/* Interest Rate (Optional) */}
                        <div>
                            <InputLabel htmlFor="rate" value={t('calculator.goals.return_rate', 'Rentabilidad Anual Esperada (%)')} />
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <TextInput
                                    id="rate"
                                    type="number"
                                    value={rate}
                                    onChange={(e) => setRate(e.target.value)}
                                    className="block w-full pr-12"
                                    placeholder="10"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">% EA</span>
                                </div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                {t('calculator.goals.rate_hint', 'Ej: 10% (Cuenta de Ahorros High Yield / CDT)')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-8">
                {goalResults ? (
                    <div className="h-full flex flex-col">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl border border-primary-100 dark:border-primary-800">
                                <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{t('calculator.goals.time_needed', 'Tiempo Necesario')}</p>
                                <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">
                                    {goalResults.months} {t('common.months', 'meses')}
                                </p>
                                <p className="text-xs text-primary-500 dark:text-primary-400 mt-1">
                                    {(goalResults.months / 12).toFixed(1)} {t('common.years', 'años')}
                                </p>
                            </div>
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800">
                                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{t('calculator.goals.total_invested', 'Total Aportado')}</p>
                                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                                    {formatCurrency(goalResults.totalInvested)}
                                </p>
                            </div>
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
                                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{t('calculator.goals.interest_earned', 'Rendimientos')}</p>
                                <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                                    {formatCurrency(goalResults.totalInterest)}
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 min-h-[300px]">
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{t('calculator.goals.projection', 'Proyección de Crecimiento')}</h4>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={goalResults.chartData}>
                                    <defs>
                                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        stroke="#9ca3af"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}m`}
                                    />
                                    <YAxis
                                        stroke="#9ca3af"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                                        itemStyle={{ color: '#f3f4f6' }}
                                        formatter={(value) => formatCurrency(value)}
                                        labelFormatter={(label) => `${t('common.month', 'Mes')} ${label}`}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="balance"
                                        name={t('finance.balance', 'Balance Total')}
                                        stroke="#8b5cf6"
                                        fillOpacity={1}
                                        fill="url(#colorBalance)"
                                        strokeWidth={2}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="invested"
                                        name={t('calculator.goals.invested', 'Capital Aportado')}
                                        stroke="#10b981"
                                        fillOpacity={1}
                                        fill="url(#colorInvested)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <ChartBarIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            {t('calculator.goals.start_planning', 'Comienza a planear tu meta')}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                            {t('calculator.goals.description', 'Ingresa el monto de tu meta y cuánto puedes ahorrar mensualmente para ver en cuánto tiempo la alcanzarás.')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
