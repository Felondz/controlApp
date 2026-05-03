import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import TypographySelector from '@/Components/TypographySelector';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import ImageUploader from '@/Components/ImageUploader';
import { getThemeStyle } from '@/Utils/themeStyles';
import { useState, useEffect } from 'react';
import ModuleMarketplace from '@/Components/Project/ModuleMarketplace';
import { Cog6ToothIcon, PuzzleIcon } from '@/Components/Icons';

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
    const { t } = useTranslate();
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const [activeTab, setActiveTab] = useState('general');

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
        reset: resetDelete,
        setError: setDeleteError,
        clearErrors: clearDeleteErrors
    } = useForm({
        password: '',
    });

    // Keep modal open if there are errors
    useEffect(() => {
        if (Object.keys(deleteErrors).length > 0) {
            setConfirmingDeletion(true);
        }
    }, [deleteErrors]);

    const submit = (e) => {
        e.preventDefault();

        router.post(route('mis-proyectos.update', proyecto.uuid), {
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

        clearDeleteErrors();

        // Frontend Check: Password Required
        if (!deleteData.password) {
            setDeleteError('password', t('validation.required', 'El campo contraseña es obligatorio.'));
            // Keep modal open (implicit since we don't call closeModal)
            if (document.getElementById('password')) {
                document.getElementById('password').focus();
            }
            return;
        }

        destroy(route('mis-proyectos.destroy', proyecto.uuid), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => closeModal(),
            onError: (errors) => {
                // Keep modal open on error
                if (document.getElementById('password')) {
                    document.getElementById('password').focus();
                }
            },
            onFinish: () => resetDelete(),
        });
    };

    const tabs = [
        { id: 'general', label: t('projects.general_settings', 'General'), icon: Cog6ToothIcon },
        { id: 'modules', label: t('projects.modules', 'Módulos'), icon: PuzzleIcon },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            project={{ ...proyecto, theme: data.theme }}
            header={<h2 className="font-semibold text-xl text-primary-600 dark:text-primary-400 leading-tight">{t('projects.edit')}</h2>}
        >
            <Head title={t('projects.edit')} />

            <div className="max-w-4xl mx-auto space-y-6">

                {/* Tabs Navigation */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                                    ${activeTab === tab.id
                                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    }
                                `}
                            >
                                <tab.icon className={`
                                    -ml-0.5 mr-2 h-5 w-5
                                    ${activeTab === tab.id ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'}
                                `} aria-hidden="true" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* General Settings Tab */}
                {activeTab === 'general' && (
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
                                preview={proyecto.image_url || (proyecto.image_path ? `/storage/${proyecto.image_path}` : null)}
                                onChange={(file) => setData('image', file)}
                                shape="square"
                                size="lg"
                                maxSizeMB={4}
                                label={t('projects.image', 'Imagen del Proyecto')}
                                hint="Tamaño máximo: 4MB"
                                error={errors.image}
                                className="items-center"
                            />

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
                )}

                {/* Modules Tab */}
                {activeTab === 'modules' && (
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-4 sm:p-6">
                        <header className="mb-6">
                            <h2 className="text-lg font-medium text-primary-600 dark:text-primary-400">
                                {t('projects.modules', 'Módulos del Proyecto')}
                            </h2>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                {t('projects.modules_desc', 'Activa o desactiva funcionalidades para adaptar el proyecto a tus necesidades.')}
                            </p>
                        </header>

                        <ModuleMarketplace
                            project={proyecto}
                            onModuleChange={(modules) => setData('modules', modules)}
                        />
                    </div>
                )}

                {/* Danger Zone (Always visible or only in General? Let's keep it always visible at bottom or only in General) */}
                {/* Moving Danger Zone to be only visible in General tab for cleaner UI */}
                {activeTab === 'general' && (
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
                )}
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

                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
                        <p className="text-sm text-red-700 dark:text-red-300 font-medium flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                            {t('auth.password_required', 'Password is required to proceed.')}
                        </p>
                    </div>

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
