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
    bill = null, // If provided, we are editing an existing bill
    proyectoId = null,
    onSuccess
}) {
    const { t } = useTranslate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, errors, reset } = useForm({
        proyecto_id: proyectoId || (bill?.proyecto_id || null),
        monto: bill?.monto ? (Math.abs(bill.monto) / 100).toFixed(2) : '',
        descripcion: bill?.descripcion || '',
        fecha: bill?.fecha || new Date().toISOString().split('T')[0],
        categoria_id: bill?.categoria_id || null, // We'll handle category logic in backend or default to 'Bills'
        status: 'pending',
        cuenta_id: null // Bills don't have an account until paid
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
            return;
        }

        const submitData = {
            ...data,
            monto: -Math.abs(amount) * 100, // Bills are expenses (negative) in cents
            status: 'pending'
        };

        const routeName = bill
            ? 'finance.transactions.update'
            : 'finance.transactions.store';

        const routeParams = bill
            ? [data.proyecto_id, bill.id]
            : [data.proyecto_id];

        router.visit(route(routeName, routeParams), {
            method: bill ? 'put' : 'post',
            data: submitData,
            preserveScroll: true,
            onStart: () => setIsSubmitting(true),
            onFinish: () => setIsSubmitting(false),
            onSuccess: () => {
                reset();
                onSuccess?.();
                onClose();
            }
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

                    {/* Due Date */}
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
