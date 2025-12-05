import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useTranslate } from '@/Hooks/useTranslate';

export default function PaymentConfirmationModal({
    show,
    onClose,
    task,
    proyectoId,
    cuentas = [],
    categorias = [],
    onSuccess
}) {
    const { t } = useTranslate();

    const { data, setData, post, processing, errors, reset } = useForm({
        descripcion: '',
        monto: 0,
        fecha: new Date().toISOString().split('T')[0],
        cuenta_id: '',
        categoria_id: '',
        notas: '',
        task_id: null,
    });

    useEffect(() => {
        if (task) {
            setData({
                descripcion: task.title || '',
                monto: task.amount || 0,
                fecha: new Date().toISOString().split('T')[0],
                cuenta_id: '',
                categoria_id: task.category_id || '',
                notas: `${t('tasks.payment_for', 'Pago de tarea')}: ${task.title}`,
                task_id: task.id,
            });
        }
    }, [task]);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('finance.transactions.store', { proyecto: proyectoId }), {
            onSuccess: () => {
                reset();
                onSuccess();
            },
            onError: (errors) => {
                console.error('Error creating transaction:', errors);
            }
        });
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    if (!task) return null;

    return (
        <Modal show={show} onClose={handleClose} maxWidth="2xl">
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    {t('finance.confirm_payment', 'Confirmar Pago')}
                </h2>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    {t('finance.payment_confirmation_description', 'Registra el pago de esta obligación financiera. Se creará una transacción y la tarea se marcará como completada.')}
                </p>

                {/* Task Info */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {t('tasks.task', 'Tarea')}
                    </h3>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">{task.title}</p>
                    {task.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{task.description}</p>
                    )}
                    {task.due_date && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {t('tasks.due_date', 'Vencimiento')}: {new Date(task.due_date).toLocaleDateString()}
                        </p>
                    )}
                </div>

                {/* Transaction Form */}
                <div className="space-y-4">
                    {/* Description */}
                    <div>
                        <InputLabel htmlFor="descripcion" value={t('finance.description', 'Descripción')} />
                        <TextInput
                            id="descripcion"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            required
                        />
                        <InputError message={errors.descripcion} className="mt-2" />
                    </div>

                    {/* Amount */}
                    <div>
                        <InputLabel htmlFor="monto" value={t('finance.amount', 'Monto')} />
                        <TextInput
                            id="monto"
                            type="number"
                            step="0.01"
                            className="mt-1 block w-full"
                            value={data.monto}
                            onChange={(e) => setData('monto', e.target.value)}
                            required
                        />
                        <InputError message={errors.monto} className="mt-2" />
                    </div>

                    {/* Date */}
                    <div>
                        <InputLabel htmlFor="fecha" value={t('finance.date', 'Fecha')} />
                        <TextInput
                            id="fecha"
                            type="date"
                            className="mt-1 block w-full"
                            value={data.fecha}
                            onChange={(e) => setData('fecha', e.target.value)}
                            required
                        />
                        <InputError message={errors.fecha} className="mt-2" />
                    </div>

                    {/* Account */}
                    <div>
                        <InputLabel htmlFor="cuenta_id" value={t('finance.account', 'Cuenta')} />
                        <select
                            id="cuenta_id"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm"
                            value={data.cuenta_id}
                            onChange={(e) => setData('cuenta_id', e.target.value)}
                            required
                        >
                            <option value="">{t('finance.select_account', 'Selecciona una cuenta')}</option>
                            {cuentas.filter(c => c.estado === 'activa').map((cuenta) => (
                                <option key={cuenta.id} value={cuenta.id}>
                                    {cuenta.nombre} ({cuenta.tipo})
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.cuenta_id} className="mt-2" />
                    </div>

                    {/* Category */}
                    <div>
                        <InputLabel htmlFor="categoria_id" value={t('finance.category', 'Categoría')} />
                        <select
                            id="categoria_id"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm"
                            value={data.categoria_id}
                            onChange={(e) => setData('categoria_id', e.target.value)}
                            required
                        >
                            <option value="">{t('finance.select_category', 'Selecciona una categoría')}</option>
                            {categorias.filter(c => c.tipo === 'gasto').map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.categoria_id} className="mt-2" />
                    </div>

                    {/* Notes */}
                    <div>
                        <InputLabel htmlFor="notas" value={t('finance.notes', 'Notas')} />
                        <textarea
                            id="notas"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm"
                            rows="3"
                            value={data.notas}
                            onChange={(e) => setData('notas', e.target.value)}
                        />
                        <InputError message={errors.notas} className="mt-2" />
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={handleClose} disabled={processing}>
                        {t('common.cancel', 'Cancelar')}
                    </SecondaryButton>
                    <PrimaryButton type="submit" disabled={processing}>
                        {processing
                            ? t('finance.processing', 'Procesando...')
                            : t('finance.confirm_payment', 'Confirmar Pago')
                        }
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
