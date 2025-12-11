import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useTranslate } from '@/Hooks/useTranslate';

export default function Create({ auth, proyecto, processes }) {
    const { t } = useTranslate();

    const { data, setData, post, processing, errors } = useForm({
        code: '',
        production_process_id: processes.length > 0 ? processes[0].id : '',
        initial_quantity: '',
        start_date: new Date().toISOString().split('T')[0],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('operations.lotes.store', proyecto.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{t('operations.create_lote')}</h2>}
        >
            <Head title={t('operations.create_lote')} />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">

                            <form onSubmit={submit} className="space-y-6">

                                {/* Process Selection */}
                                <div>
                                    <InputLabel htmlFor="production_process_id" value={t('operations.process')} />
                                    <select
                                        id="production_process_id"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        value={data.production_process_id}
                                        onChange={(e) => setData('production_process_id', e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>{t('operations.select_process')}</option>
                                        {processes.map((proc) => (
                                            <option key={proc.id} value={proc.id}>
                                                {proc.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.production_process_id} className="mt-2" />
                                    {processes.length === 0 && (
                                        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                                            {t('operations.no_processes_warning', 'No hay procesos productivos activos. Crea un proceso primero en la configuración.')}
                                        </p>
                                    )}
                                </div>

                                {/* Code / Batch ID */}
                                <div>
                                    <InputLabel htmlFor="code" value={t('operations.lote_code')} />
                                    <TextInput
                                        id="code"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                        required
                                        isFocused={true}
                                        placeholder="LOT-2023-001"
                                    />
                                    <InputError message={errors.code} className="mt-2" />
                                </div>

                                {/* Initial Quantity */}
                                <div>
                                    <InputLabel htmlFor="initial_quantity" value={t('operations.initial_quantity')} />
                                    <TextInput
                                        id="initial_quantity"
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={data.initial_quantity}
                                        onChange={(e) => setData('initial_quantity', e.target.value)}
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                    <InputError message={errors.initial_quantity} className="mt-2" />
                                </div>

                                {/* Start Date */}
                                <div>
                                    <InputLabel htmlFor="start_date" value={t('operations.start_date')} />
                                    <TextInput
                                        id="start_date"
                                        type="date"
                                        className="mt-1 block w-full"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.start_date} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end gap-4 mt-8">
                                    <Link href={route('operations.lotes.index', proyecto.id)}>
                                        <SecondaryButton disabled={processing}>
                                            {t('common.cancel')}
                                        </SecondaryButton>
                                    </Link>

                                    <PrimaryButton disabled={processing || processes.length === 0}>
                                        {t('common.create')}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
