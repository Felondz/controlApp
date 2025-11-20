// resources/js/Pages/Projects/Create.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useTranslate } from '@/hooks/useTranslate'; // Usar el hook de i18n
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ auth }) {
    const t = useTranslate();

    // El hook useForm maneja el estado del formulario, la validación y el envío.
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        descripcion: '',
        moneda_default: 'COP',
    });

    const submit = (e) => {
        e.preventDefault();

        // POST a la ruta nombrada 'mis-proyectos.store'
        // El Form Request en Laravel hará la validación
        post(route('mis-proyectos.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{t('projects.create')}</h2>}
        >
            <Head title={t('projects.create')} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit}>

                            {/* Nombre del Proyecto */}
                            <div className="mb-4">
                                <InputLabel htmlFor="nombre" value={t('projects.name')} />
                                <TextInput
                                    id="nombre"
                                    name="nombre"
                                    value={data.nombre}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    required
                                    autoFocus
                                />
                                {/* Mostrar error de validación */}
                                {errors.nombre && <p className="text-sm text-red-600 mt-1">{errors.nombre}</p>}
                            </div>

                            {/* Descripción */}
                            <div className="mb-4">
                                <InputLabel htmlFor="descripcion" value={t('projects.description')} />
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    rows="3"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                ></textarea>
                                {errors.descripcion && <p className="text-sm text-red-600 mt-1">{errors.descripcion}</p>}
                            </div>

                            {/* Moneda por Defecto */}
                            <div className="mb-6">
                                <InputLabel htmlFor="moneda_default" value={t('projects.currency')} />
                                <select
                                    id="moneda_default"
                                    name="moneda_default"
                                    value={data.moneda_default}
                                    onChange={(e) => setData('moneda_default', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                >
                                    <option value="COP">{t('currency.cop')}</option>
                                    <option value="USD">{t('currency.usd')}</option>
                                    <option value="EUR">{t('currency.eur')}</option>
                                </select>
                                {errors.moneda_default && <p className="text-sm text-red-600 mt-1">{errors.moneda_default}</p>}
                            </div>

                            {/* Botón de Submit */}
                            <div className="flex items-center justify-end">
                                <PrimaryButton disabled={processing}>
                                    {t('projects.create')}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}