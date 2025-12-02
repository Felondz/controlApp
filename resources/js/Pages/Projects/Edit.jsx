// resources/js/Pages/Projects/Edit.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useTranslate } from '@/hooks/useTranslate';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import TypographySelector from '@/Components/TypographySelector';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import ImageUploader from '@/Components/ImageUploader';
import Checkbox from '@/Components/Checkbox';
import { CurrencyDollarIcon, CheckListIcon, ChatIcon } from '@/Components/Icons';
import { getThemeStyle } from '@/Utils/themeStyles';
import { useState } from 'react';

// Available themes matching global themes
const PROJECT_THEMES = [
    { id: 'purple-modern', name: 'Purple Modern', color: '#7c3aed' },
    { id: 'emerald-nature', name: 'Emerald Nature', color: '#059669' },
    { id: 'blue-ocean', name: 'Blue Ocean', color: '#2563eb' },
    { id: 'amber-warm', name: 'Amber Warm', color: '#d97706' },
    { id: 'rose-romantic', name: 'Rose Romantic', color: '#e11d48' },
    { id: 'cyan-tech', name: 'Cyan Tech', color: '#0891b2' },
];

const TYPOGRAPHIES = [
    { id: 'sans', name: 'Sans Serif (Default)' },
    { id: 'roboto', name: 'Roboto (Modern)' },
    { id: 'opensans', name: 'Open Sans (Clean)' },
    { id: 'lato', name: 'Lato (Friendly)' },
    { id: 'montserrat', name: 'Montserrat (Geometric)' },
    { id: 'nunito', name: 'Nunito (Rounded)' },
    { id: 'raleway', name: 'Raleway (Elegant)' },
    { id: 'playfair', name: 'Playfair Display (Serif)' },
    { id: 'merriweather', name: 'Merriweather (Serif)' },
];

export default function Edit({ auth, proyecto }) {
    const t = useTranslate();
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);

    const { data, setData, put, post, processing, errors, transform } = useForm({
        nombre: proyecto.nombre || '',
        descripcion: proyecto.descripcion || '',
        moneda_default: proyecto.moneda_default || 'COP',
        theme: proyecto.theme || 'purple-modern',
        typography: proyecto.typography || 'sans',
        modules: proyecto.modules || [],
        image: null,
    });

    const {
        data: deleteData,
        setData: setDeleteData,
        delete: destroy,
        processing: deleteProcessing,
        errors: deleteErrors,
        reset: resetDelete
    } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        router.post(route('mis-proyectos.update', proyecto.id), {
            _method: 'put',
            ...data,
        }, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setData('image', null);
            },
        });
    };

    const confirmDeletion = () => {
        setConfirmingDeletion(true);
    };

    const closeModal = () => {
        setConfirmingDeletion(false);
        resetDelete();
    };

    const deleteProject = (e) => {
        e.preventDefault();
        destroy(route('mis-proyectos.destroy', proyecto.id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => document.getElementById('password').focus(),
            onFinish: () => resetDelete(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            project={{ ...proyecto, theme: data.theme }}
            header={<h2 className="font-semibold text-xl text-primary-600 dark:text-primary-400 leading-tight">{t('projects.edit')}</h2>}
        >
            <Head title={t('projects.edit')} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* General Settings */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-4 sm:p-6">
                    <header>
                        <h2 className="text-lg font-medium text-primary-600 dark:text-primary-400">
                            {t('projects.general_settings', 'Configuración General')}
                        </h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {t('projects.general_settings_desc', 'Actualiza la información básica de tu proyecto.')}
                        </p>
                    </header>

                    <form onSubmit={submit} className="mt-6 space-y-6" encType="multipart/form-data">
                        {/* Image Upload */}
                        <ImageUploader
                            value={data.image}
                            preview={proyecto.image_path ? `/storage/${proyecto.image_path}` : null}
                            onChange={(file) => setData('image', file)}
                            shape="square"
                            size="lg"
                            maxSizeMB={4}
                            label={t('projects.image', 'Imagen del Proyecto')}
                            hint="Tamaño máximo: 4MB"
                            error={errors.image}
                            className="items-center"
                        />

                        {/* Modules Selection */}
                        <div>
                            <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
                                {t('projects.modules', 'Módulos del Proyecto')}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    {
                                        id: 'finance',
                                        label: t('modules.finance', 'Gestión Financiera'),
                                        desc: t('modules.finance_desc', 'Control de cuentas, transacciones y presupuestos.'),
                                        icon: CurrencyDollarIcon
                                    },
                                    {
                                        id: 'tasks',
                                        label: t('modules.tasks', 'Gestión de Tareas'),
                                        desc: t('modules.tasks_desc', 'Organización de tareas y seguimiento de progreso.'),
                                        icon: CheckListIcon
                                    },
                                    {
                                        id: 'chat',
                                        label: t('modules.chat', 'Chat de Equipo'),
                                        desc: t('modules.chat_desc', 'Comunicación en tiempo real para los miembros del proyecto.'),
                                        icon: ChatIcon
                                    }
                                ].map((module) => (
                                    <div
                                        key={module.id}
                                        onClick={() => {
                                            const newModules = data.modules.includes(module.id)
                                                ? data.modules.filter(m => m !== module.id)
                                                : [...data.modules, module.id];
                                            setData('modules', newModules);
                                        }}
                                        className={`cursor-pointer border rounded-lg p-4 flex items-start space-x-3 transition-all ${data.modules.includes(module.id)
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-500'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-md ${data.modules.includes(module.id) ? 'bg-primary-100 text-primary-600 dark:bg-primary-800 dark:text-primary-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                                            <module.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`font-medium ${data.modules.includes(module.id) ? 'text-primary-900 dark:text-primary-100' : 'text-gray-900 dark:text-gray-100'}`}>
                                                {module.label}
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {module.desc}
                                            </p>
                                        </div>
                                        <div className="ml-auto">
                                            <input
                                                type="checkbox"
                                                checked={data.modules.includes(module.id)}
                                                onChange={() => { }} // Handled by div click
                                                className="rounded border-gray-300 text-primary-600 shadow-sm focus:ring-primary-500"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Nombre del Proyecto */}
                        <div>
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
                            {errors.nombre && <p className="text-sm text-red-600 mt-1">{errors.nombre}</p>}
                        </div>

                        {/* Descripción */}
                        <div>
                            <InputLabel htmlFor="descripcion" value={t('projects.description')} />
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={data.descripcion}
                                onChange={(e) => setData('descripcion', e.target.value)}
                                rows="3"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                            ></textarea>
                            {errors.descripcion && <p className="text-sm text-red-600 mt-1">{errors.descripcion}</p>}
                        </div>

                        {/* Moneda por Defecto */}
                        <div>
                            <InputLabel htmlFor="moneda_default" value={t('projects.currency')} />
                            <select
                                id="moneda_default"
                                name="moneda_default"
                                value={data.moneda_default}
                                onChange={(e) => setData('moneda_default', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm py-2 pl-3 pr-10"
                                required
                            >
                                <option value="COP">{t('currency.cop')}</option>
                                <option value="USD">{t('currency.usd')}</option>
                                <option value="EUR">{t('currency.eur')}</option>
                            </select>
                            {errors.moneda_default && <p className="text-sm text-red-600 mt-1">{errors.moneda_default}</p>}
                        </div>

                        {/* Typography Selection */}
                        <div>
                            <InputLabel htmlFor="typography" value={t('projects.typography', 'Tipografía')} />
                            <div className="mt-1">
                                <TypographySelector
                                    value={data.typography}
                                    onChange={(value) => setData('typography', value)}
                                    typographies={TYPOGRAPHIES}
                                />
                            </div>
                            {errors.typography && <p className="text-sm text-red-600 mt-1">{errors.typography}</p>}
                        </div>

                        {/* Theme Selection */}
                        <div>
                            <InputLabel htmlFor="theme" value={t('projects.theme', 'Tema')} />
                            <div style={getThemeStyle(data.theme)}>
                                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {PROJECT_THEMES.map((theme) => (
                                        <button
                                            key={theme.id}
                                            type="button"
                                            onClick={() => setData('theme', theme.id)}
                                            className={`relative p-3 rounded-lg border text-left transition-all ${data.theme === theme.id
                                                ? 'border-primary-500 ring-1 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <div
                                                    className="w-4 h-4 rounded-full"
                                                    style={{ backgroundColor: theme.color }}
                                                />
                                                <span className={`text-xs sm:text-sm font-medium ${data.theme === theme.id ? 'text-primary-900 dark:text-primary-100' : 'text-gray-700 dark:text-gray-300'}`}>
                                                    {theme.name}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {errors.theme && <p className="text-sm text-red-600 mt-1">{errors.theme}</p>}
                        </div>

                        {/* Botón de Submit */}
                        <div className="flex items-center gap-4">
                            <PrimaryButton disabled={processing}>
                                {t('projects.update')}
                            </PrimaryButton>

                            {processing && (
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('common.saving', 'Guardando...')}
                                </span>
                            )}
                        </div>
                    </form>
                </div>

                {/* Danger Zone */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-4 sm:p-6 border border-red-200 dark:border-red-900/50">
                    <header>
                        <h2 className="text-lg font-medium text-red-600 dark:text-red-400">
                            {t('projects.danger_zone', 'Danger Zone')}
                        </h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {t('projects.delete_warning', 'Once you delete a project, there is no going back. Please be certain.')}
                        </p>
                    </header>

                    <div className="mt-6">
                        <DangerButton onClick={confirmDeletion}>
                            {t('projects.delete_project', 'Delete Project')}
                        </DangerButton>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal show={confirmingDeletion} onClose={closeModal}>
                <form onSubmit={deleteProject} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {t('projects.delete_confirmation_title', 'Are you sure you want to delete this project?')}
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {t('projects.delete_confirmation_desc', 'This action will permanently delete all associated data, accounts, and transactions. Please enter your password to confirm.')}
                    </p>

                    <div className="mt-6">
                        <InputLabel htmlFor="password" value="Password" className="sr-only" />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={deleteData.password}
                            onChange={(e) => setDeleteData('password', e.target.value)}
                            className="mt-1 block w-3/4"
                            isFocused
                            placeholder={t('auth.password')}
                        />

                        {deleteErrors.password && (
                            <p className="text-sm text-red-600 mt-1">{deleteErrors.password}</p>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            {t('common.cancel')}
                        </SecondaryButton>

                        <DangerButton className="ml-3" disabled={deleteProcessing}>
                            {t('projects.delete_project')}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
