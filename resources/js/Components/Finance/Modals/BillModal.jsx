import { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { useTranslate } from '@/Hooks/useTranslate';
import { BoltIcon } from '@/Components/Icons';

export default function BillModal({
    show = false,
    onClose,
    bill = null,
    proyectoId = null,
    cuentas = [], // Available accounts for payment
    categorias = [], // Available categories
    onSuccess
}) {
    const { t } = useTranslate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, errors, reset } = useForm({
        proyecto_id: proyectoId || (bill?.proyecto_id || null),
        monto: bill?.monto ? (Math.abs(bill.monto) / 100).toFixed(2) : '',
        descripcion: bill?.descripcion || '',
        fecha: bill?.fecha || new Date().toISOString().split('T')[0],
        categoria_id: bill?.categoria_id || null,
        status: 'pending',
        cuenta_id: null,
        cuenta_predeterminada_id: bill?.cuenta_predeterminada_id || null,
        debito_automatico: bill?.debito_automatico || false,
        is_recurring: bill?.is_recurring || false,
        recurrence_day: bill?.recurrence_day || new Date().getDate(),
    });

    useEffect(() => {
        if (show) {
            if (bill) {
                setData({
                    proyecto_id: bill.proyecto_id,
                    monto: (Math.abs(bill.monto) / 100).toFixed(2),
                    descripcion: bill.descripcion,
                    fecha: bill.fecha,
                    categoria_id: bill.categoria_id,
                    status: 'pending',
                    cuenta_id: null
                });
            } else {
                reset();
                setData('proyecto_id', proyectoId);
                setData('fecha', new Date().toISOString().split('T')[0]);
            }
        }
    }, [show, bill, proyectoId]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const amount = parseFloat(data.monto);
        if (!amount || isNaN(amount) || amount <= 0) {
            alert(t('finance.error_amount', 'Por favor ingresa un monto válido.'));
            return;
        }

        if (!data.descripcion) {
            alert(t('finance.error_description', 'Por favor ingresa una descripción.'));
            return;
        }

        if (!data.fecha) {
            alert(t('finance.error_date', 'Por favor ingresa una fecha de vencimiento.'));
            setIsSubmitting(false);
            return;
        }

        // Find "Facturas" or "Facturas y Servicios" category
        const facturasCategory = categorias.find(c =>
            c.nombre.toLowerCase().includes('factura') && c.tipo === 'gasto'
        );

        const billData = {
            ...data,
            monto: -Math.abs(parseFloat(data.monto) * 100), // Bills are expenses (negative) in cents
            categoria_id: facturasCategory?.id || null, // Auto-assign Bills category
            status: 'pending'
        };

        const url = bill
            ? route('finance.transactions.update', { proyecto: proyectoId, transaccion: bill.id })
            : route('finance.transactions.store', { proyecto: proyectoId });

        const method = bill ? 'put' : 'post';

        router[method](url, billData, {
            onSuccess: () => {
                setIsSubmitting(false);
                reset();
                onSuccess?.();
                onClose();
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 bg-blue-50 dark:bg-blue-900/10">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                        <BoltIcon className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        {bill ? t('finance.edit_bill', 'Editar Factura') : t('finance.new_bill', 'Nueva Factura')}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Amount Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-2xl">$</span>
                        </div>
                        <input
                            type="number"
                            step="0.01"
                            value={data.monto}
                            onChange={(e) => setData('monto', e.target.value)}
                            className="block w-full pl-8 pr-12 py-4 text-3xl text-center font-bold text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                            placeholder="0.00"
                            required
                            autoFocus
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <InputLabel value={t('finance.company', 'Empresa / Concepto')} />
                        <TextInput
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            className="mt-1 block w-full"
                            placeholder={t('finance.bill_desc', 'Ej: EPM, Claro, Arriendo')}
                            required
                        />
                    </div>

                    {/* Recurring Bill Checkbox */}
                    <div className="flex items-start">
                        <input
                            type="checkbox"
                            checked={data.is_recurring}
                            onChange={(e) => setData('is_recurring', e.target.checked)}
                            className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="ml-2 block text-sm">
                            <span className="font-medium text-gray-900 dark:text-white">
                                {t('finance.recurring_bill', 'Factura Recurrente Mensual')}
                            </span>
                            <span className="block text-xs text-gray-500 dark:text-gray-400">
                                {t('finance.recurring_bill_hint', 'Se repite el mismo día cada mes')}
                            </span>
                        </label>
                    </div>

                    {/* Day of Month (for recurring) or Full Date (for one-time) */}
                    {data.is_recurring ? (
                        <div>
                            <InputLabel value={t('finance.payment_day', 'Día de Pago del Mes')} />
                            <select
                                value={data.recurrence_day}
                                onChange={(e) => setData('recurrence_day', parseInt(e.target.value))}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                                required
                            >
                                {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                                    <option key={day} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {t('finance.recurring_day_hint', 'La factura se generará automáticamente cada mes')}
                            </p>
                        </div>
                    ) : (
                        <div>
                            <InputLabel value={t('finance.due_date', 'Fecha de Vencimiento')} />
                            <TextInput
                                type="date"
                                value={data.fecha}
                                onChange={(e) => setData('fecha', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                        </div>
                    )}

                    {/* Default Payment Account */}
                    <div>
                        <InputLabel value={t('finance.default_account', 'Cuenta Predeterminada (Opcional)')} />
                        <select
                            value={data.cuenta_predeterminada_id || ''}
                            onChange={(e) => {
                                const value = e.target.value ? parseInt(e.target.value) : null;
                                setData('cuenta_predeterminada_id', value);
                                if (value) {
                                    const selected = cuentas.find(c => c.id === value);
                                    if (selected?.tipo !== 'credito') {
                                        setData('debito_automatico', false);
                                    }
                                } else {
                                    setData('debito_automatico', false);
                                }
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                        >
                            <option value="">{t('finance.no_account', 'Sin cuenta (pago manual)')}</option>
                            {cuentas.filter(c => c.estado === 'activa').map(cuenta => (
                                <option key={cuenta.id} value={cuenta.id}>
                                    {cuenta.nombre} - {cuenta.banco}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Auto-Debit for Credit Cards */}
                    {data.cuenta_predeterminada_id && cuentas.find(c => c.id === data.cuenta_predeterminada_id)?.tipo === 'credito' && (
                        <div className="flex items-start">
                            <input
                                type="checkbox"
                                checked={data.debito_automatico}
                                onChange={(e) => setData('debito_automatico', e.target.checked)}
                                className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label className="ml-2 block text-sm">
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {t('finance.auto_debit', 'Débito Automático')}
                                </span>
                                <span className="block text-xs text-gray-500 dark:text-gray-400">
                                    {t('finance.auto_debit_hint', 'Pago automático 3 días antes del vencimiento')}
                                </span>
                            </label>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <SecondaryButton onClick={onClose} disabled={isSubmitting}>
                            {t('common.cancel', 'Cancelar')}
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500">
                            {isSubmitting ? t('common.saving', 'Guardando...') : t('common.save', 'Guardar')}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
