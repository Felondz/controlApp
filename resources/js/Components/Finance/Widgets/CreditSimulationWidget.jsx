import { useState, useEffect } from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import { CalculatorIcon, PencilIcon, CheckIcon } from '@/Components/Icons';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function CreditSimulationWidget({ currency = 'COP' }) {
    const { t } = useTranslate();
    const [isEditing, setIsEditing] = useState(false);

    // Local State
    const [amount, setAmount] = useState(() => localStorage.getItem('finance_credit_amount') || '5000000');
    const [rate, setRate] = useState(() => localStorage.getItem('finance_credit_rate') || '2.5');
    const [term, setTerm] = useState(() => localStorage.getItem('finance_credit_term') || '12');

    useEffect(() => {
        localStorage.setItem('finance_credit_amount', amount);
        localStorage.setItem('finance_credit_rate', rate);
        localStorage.setItem('finance_credit_term', term);
    }, [amount, rate, term]);

    // Calculation Logic (Simple Amortization)
    const calculatePayment = () => {
        const principal = parseFloat(amount);
        const monthlyRate = parseFloat(rate) / 100;
        const months = parseFloat(term);

        if (monthlyRate === 0) return principal / months;

        const x = Math.pow(1 + monthlyRate, months);
        const monthlyPayment = (principal * x * monthlyRate) / (x - 1);

        return monthlyPayment;
    };

    const monthlyPayment = calculatePayment();
    const totalPayment = monthlyPayment * parseFloat(term);
    const totalInterest = totalPayment - parseFloat(amount);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <CalculatorIcon className="w-5 h-5 text-primary-600" />
                    {t('finance.credit_simulator', 'Simulador de Crédito')}
                </h3>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                    {isEditing ? <CheckIcon className="w-4 h-4" /> : <PencilIcon className="w-4 h-4" />}
                </button>
            </div>

            {isEditing ? (
                <div className="space-y-3">
                    <div>
                        <InputLabel value={t('finance.loan_amount', 'Monto del Préstamo')} />
                        <TextInput
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full mt-1"
                        />
                    </div>
                    <div>
                        <InputLabel value={t('finance.monthly_rate', 'Tasa Mensual (%)')} />
                        <TextInput
                            type="number"
                            step="0.01"
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                            className="w-full mt-1"
                        />
                    </div>
                    <div>
                        <InputLabel value={t('finance.term_months', 'Plazo (Meses)')} />
                        <TextInput
                            type="number"
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            className="w-full mt-1"
                        />
                    </div>
                    <PrimaryButton onClick={() => setIsEditing(false)} className="w-full justify-center mt-2">
                        {t('common.calculate', 'Calcular')}
                    </PrimaryButton>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                            {t('finance.estimated_payment', 'Cuota Mensual Estimada')}
                        </p>
                        <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                            {formatCurrency(monthlyPayment)}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-800/30">
                            <p className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">
                                {t('finance.total_interest', 'Intereses Totales')}
                            </p>
                            <p className="font-bold text-gray-900 dark:text-white">
                                {formatCurrency(totalInterest)}
                            </p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                                {t('finance.total_payment', 'Pago Total')}
                            </p>
                            <p className="font-bold text-gray-900 dark:text-white">
                                {formatCurrency(totalPayment)}
                            </p>
                        </div>
                    </div>

                    <p className="text-xs text-gray-400 text-center italic">
                        * {t('finance.simulation_disclaimer', 'Valores aproximados. No incluye seguros ni otros cargos.')}
                    </p>
                </div>
            )}
        </div>
    );
}
