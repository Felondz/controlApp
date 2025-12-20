import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import InputGroup from '@/Components/UI/InputGroup';
import { useTranslate } from '@/Hooks/useTranslate';
import { Tab } from '@headlessui/react';
import { formatCurrency } from '@/Utils/currencyHelpers';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function LoteDetailsModal({ show, onClose, lote, proyecto, inventoryItems }) {
    const { t } = useTranslate();
    const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
    const [discardReason, setDiscardReason] = useState('');

    // Form for Adding Input
    const { data: inputData, setData: setInputData, post: postInput, processing: processingInput, errors: inputErrors, reset: resetInput } = useForm({
        inventory_item_id: '',
        quantity: '',
        notes: '',
    });


    // Form for Updating Lote Details
    const { data: updateData, setData: setUpdateData, put: putUpdate, processing: processingUpdate, errors: updateErrors } = useForm({
        assigned_to: lote.assigned_to || '',
        notes: lote.notes || '',
    });

    // Determine if we have unsaved changes
    const hasChanges = (updateData.assigned_to != (lote.assigned_to || '')) || (updateData.notes != (lote.notes || ''));

    const handleUpdateDetails = () => {
        putUpdate(route('operations.lotes.update', { proyecto: proyecto.id, lote: lote.id }), {
            preserveScroll: true,
            onSuccess: () => {
                // Toast handled globally
            }
        });
    };

    // Form for Finishing Lote
    const { data: finishData, setData: setFinishData, post: postFinish, processing: processingFinish, errors: finishErrors, reset: resetFinish } = useForm({
        final_quantity: '',
        inventory_item_id: lote?.production_process?.inventory_item_id || '', // Auto-load Output Product
    });

    const handleAddInput = (e) => {
        e.preventDefault();
        postInput(route('operations.lotes.add-input', { proyecto: proyecto.id, lote: lote.id }), {
            onSuccess: () => resetInput(),
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleFinish = (e) => {
        e.preventDefault();
        postFinish(route('operations.lotes.finish', { proyecto: proyecto.id, lote: lote.id }), {
            onSuccess: () => {
                resetFinish();
                onClose();
            },
        });
    };

    const handleDiscard = () => {
        if (!discardReason) return;

        router.put(route('operations.lotes.discard', { proyecto: proyecto.id, lote: lote.id }), {
            reason: discardReason,
        }, {
            onSuccess: () => {
                setShowDiscardConfirm(false);
                onClose();
            }
        });
    };

    if (!lote) return null;

    const tabs = [
        { name: t('operations.tab_overview', 'Resumen'), current: true },
        { name: t('operations.tab_inputs', 'Insumos'), current: false },
        { name: t('operations.tab_actions', 'Acciones'), current: false },
    ];

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl" >
            <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {lote.code || 'Lote sin código'}
                        </h2>
                        <p className="text-sm text-gray-500">{lote.production_process?.name}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${lote.status === 'active' ? 'bg-green-100 text-green-800' :
                            lote.status === 'finished' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                            {t(`operations.status_${lote.status}`, lote.status)}
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                            {lote.stage?.name}
                        </span>
                    </div>
                </div>

                <Tab.Group>
                    <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-6">
                        {tabs.map((tab) => (
                            <Tab
                                key={tab.name}
                                className={({ selected }) =>
                                    classNames(
                                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                                        'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                        selected
                                            ? 'bg-white shadow text-blue-700'
                                            : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'
                                    )
                                }
                            >
                                {tab.name}
                            </Tab>
                        ))}
                    </Tab.List>

                    <Tab.Panels>
                        {/* OVERVIEW TAB */}
                        <Tab.Panel>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('operations.dates', 'Fechas')}</h3>
                                    <p><span className="font-semibold">{t('operations.start', 'Inicio')}:</span> {lote.start_date?.split(' ')[0]}</p>
                                    <p><span className="font-semibold">{t('operations.end', 'Fin')}:</span> {lote.end_date?.split(' ')[0] || '-'}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('operations.yield', 'Producción')}</h3>
                                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                                        {lote.final_quantity ? `${Number(lote.final_quantity).toLocaleString()} units` : '-'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {t('operations.cost_total', 'Costo total insumos')}: {formatCurrency(lote.inputs?.reduce((acc, curr) => acc + Number(curr.total_cost), 0) || 0)}
                                    </p>
                                </div>

                                {/* Edit Section */}
                                <div className="col-span-2 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel value={t('operations.assigned_to', 'Asignado A')} />
                                            {lote.status === 'active' ? (
                                                <SelectInput
                                                    value={updateData.assigned_to}
                                                    onChange={(e) => setUpdateData('assigned_to', e.target.value)}
                                                    className="w-full mt-1"
                                                >
                                                    <option value="">{t('common.unassigned', 'Sin asignar')}</option>
                                                    {/* We need members passed to this modal, if not available globally we might miss list */}
                                                    {/* Assuming members might be passed or we need to fix prop drilling if missing */}
                                                </SelectInput>
                                            ) : (
                                                <p className="mt-1 text-sm">{lote.assignee?.name || '-'}</p>
                                            )}
                                        </div>
                                        <div className="flex items-end justify-end">
                                            {/* Status Badge moved here or kept on top? Kept description here */}
                                            <div className="text-right">
                                                <span className="text-xs text-gray-500 block">{t('common.status', 'Estado')}</span>
                                                <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${lote.status === 'active' ? 'bg-green-100 text-green-800' :
                                                    lote.status === 'finished' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {t(`operations.status_${lote.status}`, lote.status)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <InputLabel value={t('operations.notes', 'Notas')} />
                                        {lote.status === 'active' ? (
                                            <textarea
                                                value={updateData.notes}
                                                onChange={(e) => setUpdateData('notes', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                                rows="3"
                                                placeholder={t('operations.notes_placeholder', 'Notas sobre el lote...')}
                                            />
                                        ) : (
                                            <p className="mt-1 text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">{lote.notes || '-'}</p>
                                        )}
                                    </div>

                                    {lote.status === 'active' && hasChanges && (
                                        <div className="flex justify-end">
                                            <PrimaryButton onClick={handleUpdateDetails} disabled={processingUpdate}>
                                                {t('common.save_changes', 'Guardar Cambios')}
                                            </PrimaryButton>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Tab.Panel>

                        {/* INPUTS TAB */}
                        <Tab.Panel>
                            {/* Pending Inputs Section */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-3 text-orange-600 dark:text-orange-400 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                                    </svg>
                                    {t('operations.pending_inputs', 'Insumos Planificados (Pendientes)')}
                                </h3>
                                {lote.inputs?.filter(i => i.status === 'pending').length > 0 ? (
                                    <div className="border rounded-lg overflow-hidden mb-4">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-800">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('common.item', 'Item')}</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('common.quantity', 'Cant. Est.')}</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">{t('common.actions', 'Acciones')}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                                {lote.inputs.filter(i => i.status === 'pending').map((input) => (
                                                    <tr key={input.id}>
                                                        <td className="px-4 py-2 text-sm">{input.product?.name}</td>
                                                        <td className="px-4 py-2 text-sm">{Number(input.quantity)} {input.product?.unit}</td>
                                                        <td className="px-4 py-2 text-right">
                                                            {lote.status === 'active' && (
                                                                <button
                                                                    onClick={() => {
                                                                        if (confirm(`${t('operations.confirm_consume_msg', '¿Confirmar consumo de')} ${input.product?.name}?`)) {
                                                                            router.put(route('operations.lotes.consume-input', {
                                                                                proyecto: proyecto.id,
                                                                                lote: lote.id,
                                                                                input: input.id
                                                                            }), {}, { preserveScroll: true });
                                                                        }
                                                                    }}
                                                                    className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded border border-green-200 transition-colors"
                                                                >
                                                                    ✓ {t('operations.confirm_usage', 'Confirmar Uso')}
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic mb-4">{t('operations.no_pending_inputs', 'No hay insumos pendientes de confirmar.')}</p>
                                )}
                            </div>

                            {/* Consumed Inputs Section */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-3 text-green-700 dark:text-green-400 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                    </svg>
                                    {t('operations.used_inputs', 'Insumos Consumidos')}
                                </h3>
                                {lote.inputs && lote.inputs.filter(i => i.status === 'consumed').length > 0 ? (
                                    <div className="border rounded-lg overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-800">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('common.item', 'Item')}</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('common.quantity', 'Cant. Real')}</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('common.cost', 'Costo')}</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('common.stage', 'Etapa')}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                                {lote.inputs.filter(i => i.status === 'consumed').map((input) => (
                                                    <tr key={input.id}>
                                                        <td className="px-4 py-2 text-sm">{input.product?.name}</td>
                                                        <td className="px-4 py-2 text-sm">{Number(input.quantity)} {input.product?.unit}</td>
                                                        <td className="px-4 py-2 text-sm">{formatCurrency(input.total_cost)}</td>
                                                        <td className="px-4 py-2 text-sm text-gray-500">{input.stage?.name || t('operations.manual_addition', 'Adición Manual')}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic mb-4">{t('operations.no_inputs', 'No se han registrado consumos aún.')}</p>
                                )}
                            </div>

                            {/* Add New Input Form */}
                            {lote.status === 'active' && (
                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <h4 className="font-semibold text-sm mb-3">{t('operations.add_input_title', 'Registrar Consumo Adicional')}</h4>
                                    <form onSubmit={handleAddInput} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel value={t('operations.select_input', 'Insumo')} />
                                                <SelectInput
                                                    value={inputData.inventory_item_id}
                                                    onChange={(e) => setInputData('inventory_item_id', e.target.value)}
                                                    className="w-full mt-1"
                                                >
                                                    <option value="">{t('common.select', 'Seleccionar...')}</option>
                                                    {inventoryItems.map(item => (
                                                        <option key={item.id} value={item.id}>
                                                            {item.name} (Stock: {Number(item.current_stock)} {item.unit})
                                                        </option>
                                                    ))}
                                                </SelectInput>
                                                <InputError message={inputErrors.inventory_item_id} />
                                            </div>
                                            <div>
                                                <InputLabel value={t('common.quantity', 'Cantidad a Consumir')} />
                                                <TextInput
                                                    type="number"
                                                    step="0.01"
                                                    className="w-full mt-1"
                                                    value={inputData.quantity}
                                                    onChange={(e) => setInputData('quantity', e.target.value)}
                                                    placeholder="0.00"
                                                />
                                                <InputError message={inputErrors.quantity} />
                                            </div>
                                        </div>
                                        <div>
                                            <InputLabel value={t('operations.notes', 'Notas (Opcional)')} />
                                            <TextInput
                                                className="w-full mt-1"
                                                value={inputData.notes}
                                                onChange={(e) => setInputData('notes', e.target.value)}
                                                placeholder={t('operations.input_notes_placeholder', 'Para qué se usó...')}
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <PrimaryButton disabled={processingInput} className="text-xs">
                                                {t('operations.add_input_btn', '+ Agregar Insumo Extra')}
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </Tab.Panel>

                        {/* ACTIONS TAB */}
                        <Tab.Panel>
                            {lote.status === 'active' ? (
                                <div className="space-y-6">
                                    {/* Finish Lote Section */}
                                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                                        <h3 className="font-bold text-green-800 dark:text-green-200 mb-2">{t('operations.finish_lote', 'Finalizar Lote')}</h3>
                                        <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                                            {t('operations.finish_helper', 'Registra la cantidad final producida. Esto ingresará el producto al inventario.')}
                                        </p>

                                        <form onSubmit={handleFinish} className="space-y-4">
                                            <div>
                                                <InputLabel value={t('operations.produced_product', 'Producto Generado')} />
                                                <SelectInput
                                                    value={finishData.inventory_item_id}
                                                    onChange={(e) => setFinishData('inventory_item_id', e.target.value)}
                                                    className="w-full mt-1"
                                                >
                                                    <option value="">{t('common.select_product', 'Seleccionar Producto Final...')}</option>
                                                    {inventoryItems.map(item => (
                                                        <option key={item.id} value={item.id}>{item.name}</option>
                                                    ))}
                                                </SelectInput>
                                                <InputError message={finishErrors.inventory_item_id} />
                                            </div>
                                            <div>
                                                <InputLabel value={t('operations.final_quantity', 'Cantidad Final Producida')} />
                                                <InputGroup
                                                    type="number"
                                                    step="0.01"
                                                    value={finishData.final_quantity}
                                                    onChange={(e) => setFinishData('final_quantity', e.target.value)}
                                                    placeholder="0.00"
                                                    className="mt-1"
                                                />
                                                <InputError message={finishErrors.final_quantity} />
                                            </div>
                                            <div className="flex justify-end">
                                                <PrimaryButton disabled={processingFinish} className="bg-green-600 hover:bg-green-700">
                                                    {t('operations.finish_confirm', 'Confirmar Finalización')}
                                                </PrimaryButton>
                                            </div>
                                        </form>
                                    </div>

                                    {/* Discard Lote Section */}
                                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                                        <h3 className="font-bold text-red-800 dark:text-red-200 mb-2">{t('operations.discard_lote', 'Descartar Lote')}</h3>
                                        <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                                            {t('operations.discard_helper', 'Si el lote se dañó o canceló, regístralo aquí. Los insumos ya consumidos contarán como pérdida.')}
                                        </p>

                                        {!showDiscardConfirm ? (
                                            <DangerButton onClick={() => setShowDiscardConfirm(true)}>
                                                {t('operations.discard_btn', 'Descartar Lote')}
                                            </DangerButton>
                                        ) : (
                                            <div className="space-y-3">
                                                <InputLabel value={t('operations.discard_reason', 'Motivo del descarte')} />
                                                <TextInput
                                                    value={discardReason}
                                                    onChange={(e) => setDiscardReason(e.target.value)}
                                                    placeholder={t('operations.discard_reason_placeholder', 'Ej: Contaminación, Error de proceso...')}
                                                    className="w-full"
                                                />
                                                <div className="flex gap-2">
                                                    <SecondaryButton onClick={() => setShowDiscardConfirm(false)}>
                                                        {t('common.cancel', 'Cancelar')}
                                                    </SecondaryButton>
                                                    <DangerButton onClick={handleDiscard} disabled={!discardReason}>
                                                        {t('common.confirm', 'Confirmar')}
                                                    </DangerButton>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    {t('operations.lote_closed_actions', 'Este lote está cerrado. No se pueden realizar más acciones.')}
                                </div>
                            )}
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={onClose}>
                        {t('common.close', 'Cerrar')}
                    </SecondaryButton>
                </div>
            </div>
        </Modal >
    );
}
