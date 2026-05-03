import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import SelectInput from '@/Components/SelectInput';
import ImageUploader from '@/Components/ImageUploader';
import { useTranslate } from '@/Hooks/useTranslate';
import {
    PackageIcon,
    CurrencyDollarIcon,
    InformationCircleIcon,
    XMarkIcon
} from '@/Components/Icons';

export default function ItemModal({ show, onClose, project, item = null }) {
    const { t } = useTranslate();

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        sku: '',
        type: 'raw_material',
        unit: 'unit',
        min_stock_level: '',
        cost_price: '',
        initial_quantity: '', // New
        initial_cost: '',     // New
        stock_adjustment: '', // New (for edits)
        sale_price: '',
        image: null,
        _method: 'POST',
    });

    const showSalePrice = ['finished_good', 'service'].includes(data.type);

    useEffect(() => {
        if (item) {
            setData({
                name: item.name,
                sku: item.sku || '',
                type: item.type,
                unit: item.unit,
                min_stock_level: item.min_stock_level || '',
                cost_price: item.cost_price || '',
                sale_price: item.sale_price || '',
                image: null,
                _method: 'POST',
            });
        } else {
            reset();
            setData('type', 'raw_material');
        }
        clearErrors();
    }, [item, show]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const routeName = item ? 'inventory.items.update' : 'inventory.items.store';
        // Route parameter must be 'proyecto' to match Route::prefix('mis-proyectos/{proyecto}/inventory')
        const routeParams = item
            ? { proyecto: project.id, item: item.id }
            : { proyecto: project.id };

        post(route(routeName, routeParams), {
            forceFormData: true,
            onSuccess: () => onClose(),
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden flex flex-col max-h-[calc(100vh-4rem)]">
                {/* Header Compacto */}
                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800 flex-none">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary-50 dark:bg-primary-900/20 p-2 rounded-lg text-primary-600 dark:text-primary-400">
                            <PackageIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
                                {item ? t('inventory.edit_item', 'Editar Item') : t('inventory.new_item', 'Nuevo Item')}
                            </h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-thin space-y-6 pb-6">

                        {/* Top Section: Image + Basic Info */}
                        <div className="flex flex-col sm:flex-row gap-6">
                            {/* Image - Compact on Mobile */}
                            <div className="sm:w-1/3 flex-shrink-0">
                                <ImageUploader
                                    value={data.image}
                                    preview={item?.image_url}
                                    onChange={(file) => setData('image', file)}
                                    onDelete={() => setData('image', null)}
                                    error={errors.image}
                                    label={t('inventory.image', 'Imagen')}
                                    isRound={false}
                                    height="h-40"
                                    className="w-full"
                                />
                            </div>

                            {/* Name & SKU */}
                            <div className="sm:w-2/3 space-y-4">
                                <div>
                                    <InputLabel htmlFor="name" value={t('inventory.name', 'Nombre')} />
                                    <TextInput
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full"
                                        placeholder={t('inventory.name_placeholder', 'Ej: Harina')}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-1" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <InputLabel htmlFor="sku" value={t('inventory.sku', 'SKU')} />
                                        <TextInput
                                            id="sku"
                                            value={data.sku}
                                            onChange={(e) => setData('sku', e.target.value)}
                                            className="mt-1 block w-full text-sm"
                                            placeholder="SKU-000"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="type" value={t('inventory.type_label', 'Tipo')} />
                                        <SelectInput
                                            id="type"
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="mt-1 block w-full text-sm"
                                            options={[
                                                { value: 'raw_material', label: t('inventory.types.raw_material', 'Materia P.') },
                                                { value: 'finished_good', label: t('inventory.types.finished_good', 'Prod. Term.') },
                                                { value: 'service', label: t('inventory.types.service', 'Servicio') },
                                                { value: 'asset', label: t('inventory.types.asset', 'Activo') },
                                            ]}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <hr className="border-gray-100 dark:border-gray-700" />

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-1">
                                <InputLabel htmlFor="unit" value={t('inventory.unit_label', 'Unidad')} />
                                <SelectInput
                                    id="unit"
                                    value={data.unit}
                                    onChange={(e) => setData('unit', e.target.value)}
                                    className="mt-1 block w-full"
                                    options={[
                                        { value: 'unit', label: t('inventory.unit_types.unit', 'Unidad') },
                                        { value: 'kg', label: 'Kg' },
                                        { value: 'g', label: 'Gramo' },
                                        { value: 'l', label: 'Litro' },
                                        { value: 'm', label: 'Metro' },
                                    ]}
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <InputLabel htmlFor="min_stock" value={t('inventory.min_stock', 'Stock Mín')} />
                                <TextInput
                                    id="min_stock"
                                    type="number"
                                    value={data.min_stock_level}
                                    onChange={(e) => setData('min_stock_level', e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder="0"
                                />
                            </div>

                            {/* Standard Cost / Initial Cost Logic */}
                            <div className="sm:col-span-1">
                                <InputLabel
                                    htmlFor="cost_price"
                                    value={item ? t('inventory.cost_price', 'Costo Promedio') : t('inventory.initial_cost', 'Costo Inicial')}
                                />
                                <div className="relative mt-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                    <TextInput
                                        id="cost_price"
                                        type="number"
                                        step="0.01"
                                        value={item ? data.cost_price : data.initial_cost}
                                        onChange={(e) => item ? setData('cost_price', e.target.value) : setData('initial_cost', e.target.value)}
                                        className="block w-full pl-6"
                                        placeholder="0.00"
                                        disabled={!!item}
                                    />
                                </div>
                                <InputError message={errors.initial_cost} className="mt-1" />
                            </div>
                        </div>

                        {/* Initial Stock Section (Only on Create) */}
                        {!item && (
                            <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                                    <InformationCircleIcon className="w-4 h-4 text-primary-500" />
                                    {t('inventory.initial_stock_title', 'Inventario Inicial (Opcional)')}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="initial_quantity" value={t('inventory.initial_quantity', 'Cantidad Inicial')} />
                                        <TextInput
                                            id="initial_quantity"
                                            type="number"
                                            value={data.initial_quantity}
                                            onChange={(e) => setData('initial_quantity', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="0"
                                        />
                                        <InputError message={errors.initial_quantity} className="mt-1" />
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                        Si ingresas una cantidad, se creará un movimiento de "Ajuste de Inventario" automáticamente con el costo inicial definido arriba.
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Stock Adjustment Section (Only on Edit) */}
                        {item && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                                    <PackageIcon className="w-4 h-4 text-blue-500" />
                                    {t('inventory.stock_management', 'Gestión de Stock')}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel value={t('inventory.current_stock', 'Stock Actual')} />
                                        <div className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100 px-3 py-2 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                                            {item.current_stock} {item.unit}
                                        </div>
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="stock_adjustment" value={t('inventory.stock_adjustment', 'Ajuste (+/-)')} />
                                        <TextInput
                                            id="stock_adjustment"
                                            type="number"
                                            value={data.stock_adjustment}
                                            onChange={(e) => setData('stock_adjustment', e.target.value)}
                                            className="mt-1 block w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="+10 o -5"
                                        />
                                        <InputError message={errors.stock_adjustment} className="mt-1" />
                                    </div>
                                    <div className="sm:col-span-2 text-xs text-blue-600 dark:text-blue-400">
                                        Ingresa un valor positivo para agregar stock o negativo para restar. Se creará una transacción de ajuste automáticamente.
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Conditional Sale Price */}
                        {showSalePrice && (
                            <div className="bg-primary-50 dark:bg-primary-900/10 p-4 rounded-xl border border-primary-100 dark:border-primary-900/30 flex items-center gap-4 animate-fade-in">
                                <div className="flex-1">
                                    <InputLabel htmlFor="sale_price" value={t('inventory.sale_price', 'Precio Venta')} className="text-primary-700 dark:text-primary-300" />
                                    <div className="relative mt-1">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500 font-bold">$</span>
                                        <TextInput
                                            id="sale_price"
                                            type="number"
                                            step="0.01"
                                            value={data.sale_price}
                                            onChange={(e) => setData('sale_price', e.target.value)}
                                            className="block w-full pl-6 border-primary-200 focus:border-primary-500 focus:ring-primary-500"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                <div className="hidden sm:block text-xs text-primary-600 dark:text-primary-400 max-w-[150px]">
                                    {t('inventory.type_help', 'Habilitado para productos terminados.')}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 rounded-b-2xl border-t border-gray-100 dark:border-gray-700 flex-none">
                        <SecondaryButton onClick={onClose} className="border-0 shadow-none hover:bg-gray-200 dark:hover:bg-gray-700">
                            {t('common.cancel', 'Cancelar')}
                        </SecondaryButton>
                        <PrimaryButton disabled={processing} className="shadow-lg shadow-primary-500/20">
                            {t('common.save', 'Guardar')}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
