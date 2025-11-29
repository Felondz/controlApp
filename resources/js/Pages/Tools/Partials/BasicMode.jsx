import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTranslate } from '@/Hooks/useTranslate';
import RangeSlider from '@/Components/UI/RangeSlider';
import ToggleGroup from '@/Components/UI/ToggleGroup';
import InputGroup from '@/Components/UI/InputGroup';

import QuantityInput from '@/Components/UI/QuantityInput';

export default function BasicMode({
    amount, setAmount,
    rate, setRate,
    term, setTerm,
    termType, setTermType,
    results, formatCurrency
}) {
    const { t } = useTranslate();

    const data = results ? [
        { name: t('calculator.principal', 'Capital'), value: results.principalAmount },
        { name: t('calculator.interest', 'Interés'), value: results.totalInterest },
    ] : [];

    const COLORS = ['#10B981', '#3B82F6']; // Emerald-500, Blue-500

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
            {/* Left Column: Inputs */}
            <div className="space-y-8">
                {/* Amount Slider */}
                <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        {t('calculator.how_much_money', '¿Cuánto dinero necesitas?')}
                    </label>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        {formatCurrency(amount)}
                    </div>
                    <RangeSlider
                        min={1000000}
                        max={100000000}
                        step={500000}
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>$1M</span>
                        <span>$100M</span>
                    </div>
                </div>

                {/* Term Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                        {t('calculator.how_long', '¿En cuánto tiempo quieres pagarlo?')}
                    </label>
                    <ToggleGroup
                        value={termType}
                        onChange={setTermType}
                        options={[
                            { label: t('common.months', 'Meses'), value: 'months' },
                            { label: t('common.years', 'Años'), value: 'years' },
                        ]}
                        className="mb-4"
                    />

                    <QuantityInput
                        value={term}
                        onChange={setTerm}
                        min={1}
                        max={termType === 'months' ? 360 : 30}
                    />
                </div>

                {/* Interest Rate */}
                <InputGroup
                    label={t('calculator.interest_rate', 'Tasa de Interés (E.A.)')}
                    tooltip={t('calculator.interest_rate_tooltip', 'Tasa Efectiva Anual promedio')}
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    placeholder="Ej: 12.5"
                    suffix="%"
                />
            </div>

            {/* Right Column: Results */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-8 flex flex-col items-center justify-center h-full border border-gray-200 dark:border-gray-700/50 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                {results ? (
                    <>
                        <div className="text-center mb-8 relative z-10">
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">
                                {t('calculator.monthly_payment', 'Cuota Mensual Estimada')}
                            </p>
                            <div className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                                {formatCurrency(results.monthlyPayment)}
                            </div>
                        </div>

                        <div id="amortization-chart" className="flex flex-col items-center p-4 bg-white dark:bg-transparent rounded-xl">
                            <div className="w-64 h-64 relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => formatCurrency(value)}
                                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                                            itemStyle={{ color: '#D1D5DB' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Center Label */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-xs text-gray-500">{t('calculator.total_payment', 'Total a Pagar')}</span>
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(results.totalPayment)}</span>
                                </div>
                            </div>

                            <div className="flex gap-6 mt-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-300">{t('calculator.principal', 'Capital')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-300">{t('calculator.interest', 'Interés')}</span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-500">
                        {t('calculator.enter_data', 'Ingresa los datos para calcular')}
                    </div>
                )}
            </div>
        </div>
    );
}
