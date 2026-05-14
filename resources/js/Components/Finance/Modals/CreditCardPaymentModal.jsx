import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useTranslate } from '@/Hooks/useTranslate';
import { formatCurrency } from '@/Utils/currencyHelpers';
import {
    CreditCardIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from '@/Components/Icons';

/**
 * CreditCardPaymentModal
 * Smart modal for credit card bill payment with minimum/total/custom options
 */
export default function CreditCardPaymentModal({
    show = false,
    onClose,
    account = null,
    billDetails = null, // From CreditCardBillingService
    cuentas = [],
    proyectoId,
    onSuccess
}) {
    const { t } = useTranslate();
    const [paymentType, setPaymentType] = useState('minimum'); // 'minimum', 'total', 'custom'
    const [customAmount, setCustomAmount] = useState('');
    const [selectedAccountId, setSelectedAccountId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (show && billDetails) {
            setPaymentType('minimum');
            setCustomAmount((billDetails.pago_minimo / 100).toFixed(2));
        }
    }, [show, billDetails]);

    if (!account || !billDetails) return null;

    const pagoMinimo = billDetails.pago_minimo || 0;
    const pagoTotal = billDetails.pago_total || 0;
    const currency = account.moneda || 'COP';

    const getPaymentAmount = () => {
        switch (paymentType) {
            case 'minimum':
                return pagoMinimo;
            case 'total':
                return pagoTotal;
            case 'custom':
                return parseFloat(customAmount || 0) * 100;
            default:
                return pagoMinimo;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedAccountId) {
            alert(t('finance.error_account', 'Por favor selecciona una cuenta para el pago.'));
            return;
        }

        const paymentAmount = getPaymentAmount();
        if (paymentAmount <= 0) {
            alert(t('finance.error_amount', 'El monto debe ser mayor a 0.'));
            return;
        }

        setIsSubmitting(true);

        const mappedType = paymentType === 'minimum' ? 'minimo' : (paymentType === 'total' ? 'total' : 'personalizado');

        axios.post(route('api.cuentas.pay-cc-bill', { proyecto: proyectoId, cuenta: account.uuid }), {
            cuenta_origen_id: selectedAccountId,
            monto: paymentAmount, // Positive amount expected by endpoint
            tipo_pago: mappedType
        })
            .then(() => {
                setIsSubmitting(false);
                onSuccess?.();
                onClose();
                // Refresh dashboard data
                router.reload({ only: ['proyecto', 'creditCardBills', 'transacciones', 'accounts'] });
            })
            .catch((error) => {
                setIsSubmitting(false);
                const data = error.response?.data;

                if (data?.saldo_disponible) {
                    alert(`${t('finance.error_insufficient', 'Saldo insuficiente')}. Disponible: ${formatCurrency(data.saldo_disponible, currency)}`);
                } else if (data?.error) {
                    alert(data.error);
                } else {
                    alert(t('finance.error_saving', 'Error al procesar el pago.'));
                }
            });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="bg-white dark:bg-gray-800 flex flex-col max-h-[calc(100vh-4rem)]">
                {/* Header */}
                <div className="p-6 pb-0 flex items-center gap-3 mb-6 flex-none">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                        <CreditCardIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t('finance.credit_card_bill', 'Factura Tarjeta de Crédito')}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{account.nombre}</p>
                    </div>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 scrollbar-thin space-y-4">
                        {/* Bill Summary */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {t('finance.one_installment_purchases', 'Compras 1 cuota')}
                                    </span>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {formatCurrency(billDetails.compras_1_cuota, currency)}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {t('finance.deferred_installments', 'Cuotas diferidas')}
                                    </span>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {formatCurrency(billDetails.cuotas_diferidas, currency)}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {t('finance.interest_charges', 'Intereses')}
                                    </span>
                                    <p className="font-semibold text-red-600 dark:text-red-400">
                                        {formatCurrency(billDetails.intereses, currency)}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {t('finance.payment_date', 'Fecha Pago')}
                                    </span>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {new Date(billDetails.fecha_pago).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Options */}
                        <div className="space-y-3">
                            {/* Minimum Payment */}
                            <label className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentType === 'minimum'
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                }`}>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="paymentType"
                                        value="minimum"
                                        checked={paymentType === 'minimum'}
                                        onChange={(e) => setPaymentType(e.target.value)}
                                        className="text-primary-600"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {t('finance.minimum_payment', 'Pago Mínimo')}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {t('finance.minimum_payment_desc', 'Evita mora, genera intereses sobre saldo')}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(pagoMinimo, currency)}
                                </span>
                            </label>

                            {/* Total Payment */}
                            <label className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentType === 'total'
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                }`}>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="paymentType"
                                        value="total"
                                        checked={paymentType === 'total'}
                                        onChange={(e) => setPaymentType(e.target.value)}
                                        className="text-green-600"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {t('finance.total_payment', 'Pago Total')}
                                        </p>
                                        <p className="text-xs text-green-600 dark:text-green-400">
                                            {t('finance.total_payment_desc', '¡Sin intereses el próximo mes!')}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                    {formatCurrency(pagoTotal, currency)}
                                </span>
                            </label>

                            {/* Custom Payment */}
                            <label className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentType === 'custom'
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                }`}>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="paymentType"
                                        value="custom"
                                        checked={paymentType === 'custom'}
                                        onChange={(e) => setPaymentType(e.target.value)}
                                        className="text-primary-600"
                                    />
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {t('finance.custom_payment', 'Pago Personalizado')}
                                    </span>
                                </div>
                                {paymentType === 'custom' && (
                                    <TextInput
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                        className="w-32 text-right"
                                        placeholder="0.00"
                                    />
                                )}
                            </label>
                        </div>

                        {/* Payment Account */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('finance.pay_from', 'Pagar desde')}
                            </label>
                            <select
                                value={selectedAccountId}
                                onChange={(e) => setSelectedAccountId(e.target.value)}
                                className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm"
                                required
                            >
                                <option value="">{t('finance.select_account', 'Seleccionar cuenta')}</option>
                                {cuentas
                                    .filter(c => c.id !== account.id && c.tipo !== 'credito' && c.tipo !== 'prestamo')
                                    .map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.nombre} ({formatCurrency(c.saldo_actual, c.moneda || currency)})
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 p-6 pt-2 border-t border-gray-100 dark:border-gray-700 flex-none">
                        <SecondaryButton onClick={onClose} disabled={isSubmitting} type="button">
                            {t('common.cancel', 'Cancelar')}
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? t('common.processing', 'Procesando...')
                                : t('finance.pay_now', 'Pagar Ahora')
                            }
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
