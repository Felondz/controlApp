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
            proyecto: proyecto.id,
            process: process.id
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
            proyecto: proyecto.id,
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
                proyecto: proyecto.id,
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
            <div className="flex flex-col md:flex-row h-[80vh] md:h-[600px] bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl">

                {/* Sidebar / Tabs */}
                <div className="w-full md:w-1/4 bg-gray-50 dark:bg-gray-900 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 flex flex-row md:flex-col overflow-x-auto md:overflow-visible no-scrollbar">
                    <div className="p-4 border-b md:border-b border-r md:border-r-0 border-gray-200 dark:border-gray-700 min-w-[150px] md:min-w-0">
                        <h3 className="font-bold text-gray-800 dark:text-gray-100 truncate">{process.name}</h3>
                        <p className="text-xs text-gray-500 truncate">{t('operations.process', 'Proceso')}</p>
                    </div>
                    <nav className="flex-1 p-2 flex md:flex-col gap-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-shrink-0 md:w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab.id
                                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <tab.icon className="w-5 h-5 flex-shrink-0" />
                                <span className="hidden md:inline">{tab.label}</span>
                                <span className="md:hidden">{tab.label.split(' ')[0]}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header for Mobile/Desktop check */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {tabs.find(t => t.id === activeTab)?.label}
                        </h2>
                        <SecondaryButton onClick={onClose} className="px-3 py-1 text-xs">
                            {t('common.close', 'Cerrar')}
                        </SecondaryButton>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50 dark:bg-gray-800/50">

                        {/* --- Recipe Tab --- */}
                        {activeTab === 'recipe' && (
                            <div className="space-y-6">
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 mb-4">
                                    <p className="text-sm text-blue-800 dark:text-blue-200 flex gap-2">
                                        <BeakerIcon className="w-5 h-5 flex-shrink-0" />
                                        <span>
                                            {t('operations.recipe_help', 'Define los insumos necesarios en cada etapa. Estos se cargarán automáticamente al iniciar un lote.')}
                                        </span>
                                    </p>
                                </div>

                                {stages.map((stage) => (
                                    <div key={stage.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300">
                                                    {stage.order}
                                                </span>
                                                <h3 className="font-semibold text-gray-800 dark:text-gray-200">{stage.name}</h3>
                                            </div>
                                            <button
                                                onClick={() => setEditingStage(editingStage === stage.id ? null : stage.id)}
                                                className={`text-sm font-medium flex items-center gap-1 transition-colors ${editingStage === stage.id ? 'text-red-600' : 'text-primary-600 hover:text-primary-500'
                                                    }`}
                                            >
                                                {editingStage === stage.id ? (
                                                    <>{t('common.cancel', 'Cancelar')}</>
                                                ) : (
                                                    <><PlusIcon className="w-4 h-4" /> {t('operations.add', 'Agregar')}</>
                                                )}
                                            </button>
                                        </div>

                                        <div className="p-4">
                                            {/* List of Ingredients */}
                                            <div className="space-y-2">
                                                {(stage.input_templates || stage.inputTemplates)?.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {(stage.input_templates || stage.inputTemplates).map(template => (
                                                            <div key={template.id} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 group">
                                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                    {template.item?.name}
                                                                </span>
                                                                <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
                                                                    {template.quantity} {template.item?.unit}
                                                                </span>
                                                                <button
                                                                    onClick={() => handleDeleteTemplate(template.id)}
                                                                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    title={t('common.delete', 'Eliminar')}
                                                                >
                                                                    <TrashIcon className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    !editingStage && (
                                                        <p className="text-xs text-gray-400 italic">
                                                            {t('operations.no_ingredients_short', 'Sin insumos definidos.')}
                                                        </p>
                                                    )
                                                )}
                                            </div>

                                            {/* Add Form */}
                                            {editingStage === stage.id && (
                                                <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/10 rounded-lg border border-primary-100 dark:border-primary-800 animate-fadeIn">
                                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                                        <div className="md:col-span-6">
                                                            <InputLabel value={t('operations.ingredient', 'Insumo')} className="text-xs mb-1" />
                                                            <SelectInput
                                                                value={data.inventory_item_id}
                                                                onChange={e => setData('inventory_item_id', e.target.value)}
                                                                className="w-full text-sm"
                                                            >
                                                                <option value="">{t('common.select', 'Seleccionar...')}</option>
                                                                {inventoryItems?.map(item => (
                                                                    <option key={item.id} value={item.id}>
                                                                        {item.name} ({item.current_stock} {item.unit})
                                                                    </option>
                                                                ))}
                                                            </SelectInput>
                                                            <InputError message={errors.inventory_item_id} className="mt-1" />
                                                        </div>
                                                        <div className="md:col-span-4">
                                                            <InputLabel value={t('operations.quantity_std', 'Cantidad Estándar')} className="text-xs mb-1" />
                                                            <TextInput
                                                                type="number"
                                                                step="0.01"
                                                                value={data.quantity}
                                                                onChange={e => setData('quantity', e.target.value)}
                                                                className="w-full text-sm py-2"
                                                                placeholder="0.00"
                                                            />
                                                            <InputError message={errors.quantity} className="mt-1" />
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <PrimaryButton
                                                                onClick={() => handleAddTemplate(stage.id)}
                                                                disabled={processing}
                                                                className="w-full justify-center py-2"
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
                        )}

                        {activeTab === 'settings' && (
                            <>
                                <form onSubmit={handleUpdateProcess} className="space-y-6 max-w-2xl mx-auto">
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
                                <div className="mt-8 border-t border-red-200 dark:border-red-900/50 pt-6">
                                    <h4 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-4">
                                        {t('common.danger_zone', 'Zona de Peligro')}
                                    </h4>
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h5 className="font-semibold text-red-800 dark:text-red-200">
                                                    {t('operations.delete_process', 'Eliminar este proceso')}
                                                </h5>
                                                <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                                                    {t('operations.delete_process_warning', 'Esta acción no se puede deshacer. Se eliminarán todas las etapas y recetas asociadas. Los lotes existentes podrían verse afectados.')}
                                                </p>
                                            </div>
                                            <DangerButton
                                                onClick={() => {
                                                    if (confirm(t('operations.confirm_delete_process', '¿Estás completamente seguro de que quieres eliminar este proceso?'))) {
                                                        router.delete(route('operations.processes.destroy', {
                                                            proyecto: proyecto.id,
                                                            process: process.id
                                                        }), {
                                                            onSuccess: () => {
                                                                onClose();
                                                                // Force redirect to remove query param if current process was deleted
                                                                router.visit(route('operations.lotes.index', { proyecto: proyecto.id }));
                                                            }
                                                        });
                                                    }
                                                }}
                                                className="ml-4"
                                            >
                                                {t('common.delete', 'Eliminar')}
                                            </DangerButton>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                    </div>
                </div>
            </div>
        </Modal >
    );
}
