import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useTranslate } from '@/Hooks/useTranslate';
import InputGroup from '@/Components/UI/InputGroup';
import SelectGroup from '@/Components/UI/SelectGroup';
import QuantityInput from '@/Components/UI/QuantityInput';

export default function AdvancedMode({
    amount, setAmount,
    rate, setRate,
    term, setTerm,
    termType, setTermType,
    rateType, setRateType,
    insurance, setInsurance,
    results, formatCurrency
}) {
    const { t } = useTranslate();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            {/* Left Column: Configuration Panel */}
            <div className="lg:col-span-1 bg-gray-50 dark:bg-gray-800/30 rounded-2xl p-6 border border-gray-200 dark:border-gray-700/50">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary-500 rounded-full"></span>
                    {t('calculator.advanced_config', 'Configuración Avanzada')}
                </h3>

                <div className="space-y-5">
                    {/* Amount */}
                    <InputGroup
                        label={t('calculator.loan_amount', 'Monto del Préstamo')}
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                    />

                    {/* Rate & Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup
                            label={t('calculator.rate', 'Tasa Interés')}
                            type="number"
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            suffix="%"
                        />
                        <SelectGroup
                            label={t('calculator.rate_type', 'Tipo Tasa')}
                            value={rateType}
                            onChange={(e) => setRateType(e.target.value)}
                            options={[
                                { label: t('calculator.ea', 'Efectiva Anual'), value: 'EA' },
                                { label: t('calculator.namv', 'Nominal Anual (MV)'), value: 'NAMV' },
                                { label: t('calculator.pm', 'Periódica Mensual'), value: 'PM' },
                            ]}
                        />
                    </div>

                    {/* Term */}
                    <div className="grid grid-cols-2 gap-4">
                        <QuantityInput
                            label={t('calculator.term', 'Plazo')}
                            value={term}
                            onChange={setTerm}
                            min={1}
                        />
                        <SelectGroup
                            label={t('calculator.unit', 'Unidad')}
                            value={termType}
                            onChange={(e) => setTermType(e.target.value)}
                            options={[
                                { label: t('common.months', 'Meses'), value: 'months' },
                                { label: t('common.years', 'Años'), value: 'years' },
                            ]}
                        />
                    </div>

                    {/* Extra Costs */}
                    <InputGroup
                        label={t('calculator.insurance_costs', 'Seguros / Costos (Mensual)')}
                        type="number"
                        value={insurance}
                        onChange={(e) => setInsurance(Number(e.target.value))}
                        placeholder="0"
                    />
                </div>
            </div>

            {/* Right Column: Visualization & Data */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Chart Section */}
                <div id="amortization-chart" className="bg-gray-50 dark:bg-gray-800/30 rounded-2xl p-6 border border-gray-200 dark:border-gray-700/50 h-80">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                        {t('calculator.amortization_curve', 'Curva de Amortización')}
                    </h4>
                    {results && results.schedule.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={results.schedule}>
                                <defs>
                                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    stroke="#9CA3AF"
                                    tick={{ fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#9CA3AF"
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) => `$${value / 1000000}M`}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    formatter={(value) => formatCurrency(value)}
                                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#F3F4F6' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="balance"
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorBalance)"
                                    name={t('calculator.balance', 'Saldo Pendiente')}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                            {t('calculator.calculating', 'Calculando proyección...')}
                        </div>
                    )}
                </div>

                {/* Data Grid */}
                <div className="bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-200 dark:border-gray-700/50 flex-1 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700/50 bg-gray-100 dark:bg-gray-900/50 flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('calculator.amortization_table', 'Tabla de Amortización')}
                        </h4>
                        {results && (
                            <div className="text-xs text-primary-600 dark:text-emerald-400 font-mono">
                                {t('calculator.total_interest', 'Total Intereses')}: {formatCurrency(results.totalInterest)}
                            </div>
                        )}
                    </div>
                    <div className="overflow-auto flex-1 scrollbar-thin max-h-[400px]">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-100 dark:bg-gray-900/50 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 font-medium">{t('common.month', 'Mes')}</th>
                                    <th className="px-6 py-3 font-medium text-right">{t('calculator.payment', 'Cuota')}</th>
                                    <th className="px-6 py-3 font-medium text-right">{t('calculator.interest', 'Interés')}</th>
                                    <th className="px-6 py-3 font-medium text-right">{t('calculator.principal', 'Capital')}</th>
                                    <th className="px-6 py-3 font-medium text-right">{t('calculator.balance', 'Saldo')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700/50">
                                {results?.schedule.map((row) => (
                                    <tr key={row.month} className="hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-3 font-medium text-gray-900 dark:text-gray-300">{row.month}</td>
                                        <td className="px-6 py-3 text-right text-gray-600 dark:text-gray-400">{formatCurrency(row.payment)}</td>
                                        <td className="px-6 py-3 text-right text-red-600 dark:text-red-400/80">{formatCurrency(row.interest)}</td>
                                        <td className="px-6 py-3 text-right text-emerald-600 dark:text-emerald-400/80">{formatCurrency(row.principal)}</td>
                                        <td className="px-6 py-3 text-right text-gray-900 dark:text-gray-300 font-mono">{formatCurrency(row.balance)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
