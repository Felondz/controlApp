import React, { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import InputGroup from '@/Components/UI/InputGroup';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import { PlusIcon, TrashIcon, BeakerIcon, CogIcon, RectangleStackIcon } from '@/Components/Icons';
import { useTranslate } from '@/Hooks/useTranslate';

export default function ManageProcessModal({ show, onClose, process, stages, inventoryItems, proyecto }) {
    const { t } = useTranslate();
    const [activeTab, setActiveTab] = useState('recipe'); // 'recipe' | 'settings'
    const [editingStage, setEditingStage] = useState(null);

    // --- Process Settings Form ---
    const { data: settingsData, setData: setSettingsData, put: putSettings, processing: processingSettings, errors: errorsSettings, reset: resetSettings } = useForm({
        name: '',
        description: '',
        inventory_item_id: '',
    });

    // Initialize/Update settings form when process changes
    // Initialize/Update settings form when process changes
    useEffect(() => {
        if (process && (process.name !== settingsData.name || process.description !== settingsData.description || process.inventory_item_id !== settingsData.inventory_item_id)) {
            setSettingsData({
                name: process.name || '',
                description: process.description || '',
                inventory_item_id: process.inventory_item_id || '',
            });
        }
    }, [process]);

    const handleUpdateProcess = (e) => {
        e.preventDefault();
        putSettings(route('operations.processes.update', {
            proyecto: proyecto.uuid,
            process: process.uuid
        }), {
            preserveScroll: true,
            onSuccess: () => {
                // Toast or notification handled by standard layout flash
            }
        });
    };


    // --- Recipe / Ingredients Form ---
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        inventory_item_id: '',
        quantity: '',
        notes: '',
    });

    const handleAddTemplate = (stageId) => {
        post(route('operations.stage-templates.store', {
            proyecto: proyecto.uuid,
            stage: stageId
        }), {
            onSuccess: () => {
                reset();
                clearErrors();
            },
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleDeleteTemplate = (templateId) => {
        if (confirm(t('common.confirm_delete', '¿Estás seguro de eliminar este ítem?'))) {
            router.delete(route('operations.stage-templates.destroy', {
                proyecto: proyecto.uuid,
                template: templateId
            }), {
                preserveScroll: true,
                preserveState: true,
            });
        }
    };

    if (!process) return null;

    const tabs = [
        { id: 'recipe', label: t('operations.recipe_formula', 'Receta / Fórmula'), icon: BeakerIcon },
        { id: 'settings', label: t('operations.settings', 'Configuración'), icon: CogIcon },
    ];

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="flex flex-col max-h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-none">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {process.name}
                        </h2>
                        <p className="text-xs text-gray-500">{t('operations.manage_process_subtitle', 'Gestión de Proceso Productivo')}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <span className="sr-only">{t('common.close', 'Cerrar')}</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex-none">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${activeTab === tab.id
                                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 bg-gray-50/50 dark:bg-gray-800/50 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                    {/* --- Recipe Tab --- */}
                    {activeTab === 'recipe' && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex gap-3">
                                <BeakerIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    {t('operations.recipe_help', 'Define los insumos necesarios para cada etapa. Estos se precargarán cuando inicies un lote.')}
                                </p>
                            </div>

                            <div className="space-y-4 pb-4">
                                {stages.map((stage) => (
                                    <div key={stage.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">

                                        {/* Stage Header */}
                                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50 rounded-t-lg">
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300">
                                                    {stage.order}
                                                </span>
                                                <h3 className="font-semibold text-gray-800 dark:text-gray-200 translate-y-px">{stage.name}</h3>
                                            </div>

                                            <button
                                                onClick={() => setEditingStage(editingStage === stage.id ? null : stage.id)}
                                                className={`text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 px-3 py-1.5 rounded-md ${editingStage === stage.id
                                                    ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                                                    : 'bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400'
                                                    }`}
                                            >
                                                {editingStage === stage.id ? (
                                                    <>{t('common.cancel', 'Cancelar')}</>
                                                ) : (
                                                    <><PlusIcon className="w-4 h-4" /> {t('operations.add_ingredient', 'Agregar Insumo')}</>
                                                )}
                                            </button>
                                        </div>

                                        {/* Stage Content */}
                                        <div className="p-4">
                                            {/* Ingredients List */}
                                            <div className="space-y-3">
                                                {(stage.input_templates || stage.inputTemplates)?.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {(stage.input_templates || stage.inputTemplates).map(template => (
                                                            <div key={template.id} className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm group hover:border-red-200 dark:hover:border-red-800 transition-colors">
                                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                    {template.item?.name}
                                                                </span>
                                                                <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 font-mono">
                                                                    {template.quantity} {template.item?.unit}
                                                                </span>
                                                                <button
                                                                    onClick={() => handleDeleteTemplate(template.id)}
                                                                    className="w-5 h-5 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all opacity-0 group-hover:opacity-100"
                                                                    title={t('common.delete', 'Eliminar')}
                                                                >
                                                                    <TrashIcon className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    !editingStage && (
                                                        <p className="text-sm text-gray-400 italic text-center py-2">
                                                            {t('operations.no_ingredients_stage', 'No hay insumos definidos para esta etapa.')}
                                                        </p>
                                                    )
                                                )}
                                            </div>

                                            {/* Add Ingredient Form */}
                                            {editingStage === stage.id && (
                                                <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 animate-fadeIn">
                                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                                        <div className="md:col-span-6">
                                                            <InputLabel value={t('operations.ingredient', 'Insumo')} className="mb-1.5" />
                                                            <SelectInput
                                                                value={data.inventory_item_id}
                                                                onChange={e => setData('inventory_item_id', e.target.value)}
                                                                className="w-full"
                                                            >
                                                                <option value="">{t('common.select_option', 'Seleccione una opción')}</option>
                                                                {inventoryItems?.map(item => (
                                                                    <option key={item.id} value={item.id}>
                                                                        {item.name} ({item.current_stock} {item.unit})
                                                                    </option>
                                                                ))}
                                                            </SelectInput>
                                                            <InputError message={errors.inventory_item_id} className="mt-1" />
                                                        </div>
                                                        <div className="md:col-span-4">
                                                            <InputLabel value={t('operations.quantity_std', 'Cantidad Estándar')} className="mb-1.5" />
                                                            <TextInput
                                                                type="number"
                                                                step="0.01"
                                                                value={data.quantity}
                                                                onChange={e => setData('quantity', e.target.value)}
                                                                className="w-full"
                                                                placeholder="0.00"
                                                            />
                                                            <InputError message={errors.quantity} className="mt-1" />
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <PrimaryButton
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleAddTemplate(stage.id);
                                                                }}
                                                                disabled={processing}
                                                                className="w-full justify-center"
                                                            >
                                                                {t('common.add', 'Agregar')}
                                                            </PrimaryButton>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- Settings Tab --- */}
                    {activeTab === 'settings' && (
                        <div className="max-w-2xl mx-auto space-y-8 pb-4">
                            <form onSubmit={handleUpdateProcess} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="p_name" value={t('operations.process_name', 'Nombre del Proceso')} />
                                    <TextInput
                                        id="p_name"
                                        value={settingsData.name}
                                        onChange={(e) => setSettingsData('name', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errorsSettings.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="p_output" value={t('operations.output_product', 'Producto Final (Output)')} />
                                    <p className="text-xs text-gray-500 mb-2">{t('operations.output_product_desc', 'El producto que se inventariará al finalizar lotes de este proceso.')}</p>
                                    <SelectInput
                                        id="p_output"
                                        value={settingsData.inventory_item_id}
                                        onChange={(e) => setSettingsData('inventory_item_id', e.target.value)}
                                        className="mt-1 block w-full"
                                    >
                                        <option value="">{t('common.none', 'Ninguno (Solo seguimiento)')}</option>
                                        {inventoryItems?.map(item => (
                                            <option key={item.id} value={item.id}>
                                                {item.name} ({item.unit})
                                            </option>
                                        ))}
                                    </SelectInput>
                                    <InputError message={errorsSettings.inventory_item_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="p_desc" value={t('operations.description', 'Descripción')} />
                                    <textarea
                                        id="p_desc"
                                        value={settingsData.description}
                                        onChange={(e) => setSettingsData('description', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        rows="4"
                                    />
                                    <InputError message={errorsSettings.description} className="mt-2" />
                                </div>

                                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <PrimaryButton disabled={processingSettings}>
                                        {processingSettings ? t('common.saving', 'Guardando...') : t('common.save_changes', 'Guardar Cambios')}
                                    </PrimaryButton>
                                </div>
                            </form>

                            {/* Danger Zone */}
                            <div className="border border-red-200 dark:border-red-900/40 rounded-lg overflow-hidden">
                                <div className="bg-red-50 dark:bg-red-900/20 px-4 py-3 border-b border-red-200 dark:border-red-900/40">
                                    <h4 className="text-sm font-bold text-red-700 dark:text-red-400 uppercase tracking-wider flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {t('common.danger_zone', 'Zona de Peligro')}
                                    </h4>
                                </div>
                                <div className="p-4 bg-white dark:bg-gray-900/30">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div>
                                            <h5 className="font-semibold text-gray-800 dark:text-gray-200">
                                                {t('operations.delete_process', 'Eliminar este proceso')}
                                            </h5>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                                                {t('operations.delete_process_warning', 'Esta acción eliminará permanentemente el proceso y sus configuraciones.')}
                                            </p>
                                        </div>
                                        <DangerButton
                                            onClick={() => {
                                                if (confirm(t('operations.confirm_delete_process', '¿Estás completamente seguro de que quieres eliminar este proceso?'))) {
                                                    router.delete(route('operations.processes.destroy', {
                                                        proyecto: proyecto.uuid,
                                                        process: process.uuid
                                                    }), {
                                                        onSuccess: () => {
                                                            onClose();
                                                            router.visit(route('operations.lotes.index', { proyecto: proyecto.uuid }));
                                                        }
                                                    });
                                                }
                                            }}
                                        >
                                            {t('common.delete', 'Eliminar Proceso')}
                                        </DangerButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end flex-none bg-white dark:bg-gray-800">
                    <SecondaryButton onClick={onClose}>
                        {t('common.close', 'Cerrar')}
                    </SecondaryButton>
                </div>
            </div>
        </Modal>
    );
}
