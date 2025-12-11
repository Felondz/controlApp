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

export default function ItemModal({ show, onClose, project, item = null }) {
    const { t } = useTranslate();

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        sku: '',
        type: 'raw_material',
        unit: 'unit',
        min_stock_level: 0,
        sale_price: 0,
        image: null,
        _method: 'POST', // Default to POST, will be overridden to PUT if editing (actually spoofing)
    });

    useEffect(() => {
        if (item) {
            setData({
                name: item.name,
                sku: item.sku || '',
                type: item.type,
                unit: item.unit,
                min_stock_level: item.min_stock_level || 0,
                sale_price: item.sale_price || 0,
                image: null, // Don't preload file object
                _method: 'POST', // We use POST for file uploads even on update
            });
        } else {
            reset();
            setData('type', 'raw_material'); // Reset defaults
        }
        clearErrors();
    }, [item, show]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (item) {
            // Update
            post(route('inventory.items.update', { project: project.id, item: item.id }), {
                forceFormData: true,
                onSuccess: () => onClose(),
            });
        } else {
            // Create
            post(route('inventory.items.store', project.id), {
                forceFormData: true,
                onSuccess: () => onClose(),
            });
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
                    {item ? t('inventory.edit_item') : t('inventory.new_item')}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Image Upload Column */}
                    <div>
                        <InputLabel value={t('inventory.image', 'Imagen')} className="mb-2" />
                        <ImageUploader
                            value={data.image}
                            preview={item?.image_url} // Show existing image preview if available
                            onChange={(file) => setData('image', file)}
                            onDelete={() => setData('image', null)} // We might need a flag to explicitly delete existing image
                            error={errors.image}
                            label={t('inventory.click_to_upload')}
                            isRound={false} // Square/Rectangle for products
                            height="h-64"
                        />
                    </div>

                    {/* Fields Column */}
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value={t('inventory.name')} />
                            <TextInput
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full"
                                required
                                isFocused
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="sku" value={t('inventory.sku')} />
                            <TextInput
                                id="sku"
                                value={data.sku}
                                onChange={(e) => setData('sku', e.target.value)}
                                className="mt-1 block w-full"
                            />
                            <InputError message={errors.sku} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="type" value={t('inventory.type')} />
                            <SelectInput
                                id="type"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className="mt-1 block w-full"
                                options={[
                                    { value: 'raw_material', label: t('inventory.type.raw_material', 'Materia Prima') },
                                    { value: 'finished_good', label: t('inventory.type.finished_good', 'Producto Terminado') },
                                    { value: 'service', label: t('inventory.type.service', 'Servicio') },
                                    { value: 'asset', label: t('inventory.type.asset', 'Activo') },
                                ]}
                            />
                            <InputError message={errors.type} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="unit" value={t('inventory.unit')} />
                                <SelectInput
                                    id="unit"
                                    value={data.unit}
                                    onChange={(e) => setData('unit', e.target.value)}
                                    className="mt-1 block w-full"
                                    options={[
                                        { value: 'unit', label: 'Unidad' },
                                        { value: 'kg', label: 'Kg' },
                                        { value: 'g', label: 'g' },
                                        { value: 'l', label: 'Litro' },
                                        { value: 'ml', label: 'ml' },
                                        { value: 'm', label: 'Metro' },
                                    ]}
                                />
                                <InputError message={errors.unit} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="min_stock" value={t('inventory.min_stock')} />
                                <TextInput
                                    id="min_stock"
                                    type="number"
                                    value={data.min_stock_level}
                                    onChange={(e) => setData('min_stock_level', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.min_stock_level} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="sale_price" value={t('inventory.sale_price')} />
                            <TextInput
                                id="sale_price"
                                type="number"
                                step="0.01"
                                value={data.sale_price}
                                onChange={(e) => setData('sale_price', e.target.value)}
                                className="mt-1 block w-full"
                            />
                            <InputError message={errors.sale_price} className="mt-2" />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose} disabled={processing}>
                        {t('common.cancel')}
                    </SecondaryButton>
                    <PrimaryButton disabled={processing}>
                        {item ? t('common.update') : t('common.create')}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
