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
                {/* Amount Input */}
                <InputGroup
                    label={t('calculator.how_much_money', '¿Cuánto dinero necesitas?')}
                    type="number"
                    value={amount}
                    onChange={(e) => {
                        const val = e?.target ? e.target.value : e;
                        setAmount(Number(val));
                    }}
                    min={1000000}
                    step={500000}
                    placeholder="Ej: 10000000"
                />

                {/* Term Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        {t('calculator.term', 'Plazo')}
                    </label>
                    <ToggleGroup
                        options={[
                            { value: 12, label: '12 ' + t('calculator.months', 'Meses') },
                            { value: 24, label: '24 ' + t('calculator.months', 'Meses') },
                            { value: 36, label: '36 ' + t('calculator.months', 'Meses') },
                            { value: 48, label: '48 ' + t('calculator.months', 'Meses') },
                            { value: 60, label: '60 ' + t('calculator.months', 'Meses') },
                        ]}
                        value={term}
                        onChange={setTerm}
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

            {/* Right Column: Results & Chart */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 flex flex-col items-center justify-center h-full min-h-[400px]">
                {results ? (
                    <>
                        <div className="text-center mb-8">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                {t('calculator.monthly_payment', 'Cuota Mensual Estimada')}
                            </div>
                            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                                {formatCurrency(results?.monthlyPayment || 0)}
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="w-full h-64 relative">
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
                                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                                        itemStyle={{ color: '#d1d5db' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Label */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-xs text-gray-500">{t('calculator.total_payment', 'Total')}</span>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(results.totalPayment)}</span>
                            </div>
                        </div>

                        {/* Legend */}
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
