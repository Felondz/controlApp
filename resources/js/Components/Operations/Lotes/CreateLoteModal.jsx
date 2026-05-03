import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import TextArea from '@/Components/TextArea';
import InputGroup from '@/Components/UI/InputGroup';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useTranslate } from '@/Hooks/useTranslate';

export default function CreateLoteModal({ show, onClose, proyecto, processes = [], members = [], defaultProcessId }) {
    const { t } = useTranslate();

    const { data, setData, post, processing, errors, reset } = useForm({
        production_process_id: defaultProcessId || (processes.length > 0 ? processes[0].id : ''),
        start_date: new Date().toISOString().split('T')[0],
        assigned_to: '',
        notes: '',
    });

    useEffect(() => {
        if (show && defaultProcessId) {
            setData('production_process_id', defaultProcessId);
        }
    }, [show, defaultProcessId]);

    const submit = (e) => {
        e.preventDefault();
        post(route('operations.lotes.store', { proyecto: proyecto.id }), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden flex flex-col max-h-[calc(100vh-4rem)]">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-none">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {t('operations.create_lote_title', 'Crear Nuevo Lote')}
                    </h2>
                </div>

                <form onSubmit={submit} className="flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-thin space-y-6">
                        {/* Process Selection */}
                        <div>
                            <InputLabel htmlFor="production_process_id" value={t('operations.production_process', 'Proceso Productivo')} />
                            <SelectInput
                                id="production_process_id"
                                value={data.production_process_id}
                                onChange={(e) => setData('production_process_id', e.target.value)}
                                className="mt-1 block w-full"
                            >
                                <option value="" disabled>{t('operations.select_process', 'Seleccionar Proceso')}</option>
                                {processes.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </SelectInput>
                            <InputError message={errors.production_process_id} className="mt-2" />

                            {/* Selected Process Product Info */}
                            {data.production_process_id && (
                                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                                    <p className="text-sm text-blue-800 dark:text-blue-300">
                                        <span className="font-semibold">{t('operations.output_product', 'Producto a producir')}: </span>
                                        {processes.find(p => p.id == data.production_process_id)?.output_product?.name || t('common.none', 'Ninguno')}
                                    </p>
                                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                        {t('operations.code_auto_generated', '* El código del lote se generará automáticamente (Ej: 12/24-001)')}
                                    </p>
                                </div>
                            )}

                            {processes.length === 0 && (
                                <p className="text-sm text-red-500 mt-1">
                                    {t('operations.create_process_warning', 'Debes crear un proceso productivo antes de crear lotes.')}
                                </p>
                            )}
                        </div>

                        {/* Start Date */}
                        <div>
                            <InputGroup
                                id="start_date"
                                type="date"
                                label={t('operations.start_date', 'Fecha de Inicio')}
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                            />
                            <InputError message={errors.start_date} className="mt-1" />
                        </div>

                        {/* Assigned User */}
                        <div>
                            <InputLabel htmlFor="assigned_to" value={t('operations.assigned_user', 'Responsable (Opcional)')} />
                            <SelectInput
                                id="assigned_to"
                                value={data.assigned_to}
                                onChange={(e) => setData('assigned_to', e.target.value)}
                                className="mt-1 block w-full"
                            >
                                <option value="">{t('operations.select_user', 'Seleccionar Responsable')}</option>
                                {members.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </SelectInput>
                            <InputError message={errors.assigned_to} className="mt-2" />
                        </div>

                        {/* Notes */}
                        <div>
                            <InputLabel htmlFor="notes" value={t('operations.notes', 'Notas Adicionales')} />
                            <TextArea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                className="mt-1 block w-full"
                                rows="3"
                            />
                            <InputError message={errors.notes} className="mt-2" />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 flex-none">
                        <SecondaryButton onClick={onClose} type="button">
                            {t('common.cancel', 'Cancelar')}
                        </SecondaryButton>
                        <PrimaryButton disabled={processing || processes.length === 0} type="submit">
                            {processing ? t('common.creating', 'Creando...') : t('operations.create_lote_btn', 'Crear Lote')}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
