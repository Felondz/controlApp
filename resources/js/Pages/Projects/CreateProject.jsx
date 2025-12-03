// resources/js/Pages/Projects/CreateProject.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TypographySelector from '@/Components/TypographySelector';
import { CurrencyDollarIcon, CheckListIcon } from '@/Components/Icons';
import { getThemeStyle } from '@/Utils/themeStyles';
import { useState, useRef } from 'react';

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

export default function CreateProject({ auth }) {
    const { t } = useTranslate();
    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        descripcion: '',
        moneda_default: 'COP',
        modules: ['finance'],
        image: null,
        theme: 'purple-modern',
        typography: 'sans',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('mis-proyectos.store'));
    };

    const toggleModule = (module) => {
        const newModules = data.modules.includes(module)
            ? data.modules.filter(m => m !== module)
            : [...data.modules, module];
        setData('modules', newModules);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-primary-600 dark:text-primary-400 leading-tight">{t('projects.create')}</h2>}
        // Removed projectTheme prop to keep global theme on titles/layout
        >
            <Head title={t('projects.create')} />

            <div className="py-6 lg:py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
                        <form onSubmit={submit} className="space-y-8" encType="multipart/form-data">

                            {/* Section: Basic Info & Image */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Image Upload */}
                                <div className="md:col-span-1 flex flex-col items-center space-y-4">
                                    <InputLabel value={t('projects.image', 'Imagen del Proyecto')} />
                                    <div
                                        className="relative w-40 h-40 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 transition-colors cursor-pointer group bg-gray-50 dark:bg-gray-900"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                                <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-xs text-center px-2">Click para subir imagen</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white text-sm font-medium">Cambiar</span>
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}
                                </div>

                                {/* Basic Fields */}
                                <div className="md:col-span-2 space-y-6">
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
                                            placeholder="Ej: Presupuesto 2025"
                                        />
                                        {errors.nombre && <p className="text-sm text-red-600 mt-1">{errors.nombre}</p>}
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="descripcion" value={t('projects.description')} />
                                        <textarea
                                            id="descripcion"
                                            name="descripcion"
                                            value={data.descripcion}
                                            onChange={(e) => setData('descripcion', e.target.value)}
                                            rows="3"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder="Descripción breve del proyecto..."
                                        ></textarea>
                                        {errors.descripcion && <p className="text-sm text-red-600 mt-1">{errors.descripcion}</p>}
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="moneda_default" value={t('projects.currency')} />
                                        <select
                                            id="moneda_default"
                                            name="moneda_default"
                                            value={data.moneda_default}
                                            onChange={(e) => setData('moneda_default', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            required
                                        >
                                            <option value="COP">{t('currency.cop')} (COP)</option>
                                            <option value="USD">{t('currency.usd')} (USD)</option>
                                            <option value="EUR">{t('currency.eur')} (EUR)</option>
                                        </select>
                                        {errors.moneda_default && <p className="text-sm text-red-600 mt-1">{errors.moneda_default}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 my-8"></div>

                            {/* Section: Visual Identity */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-primary-600 dark:text-primary-400">
                                    {t('projects.identity', 'Identidad Visual')}
                                </h3>

                                {/* Theme Preview Scope: Only elements inside here will reflect the selected theme */}
                                <div style={getThemeStyle(data.theme)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Theme Selector */}
                                    <div>
                                        <InputLabel value={t('projects.theme', 'Tema del Proyecto')} />
                                        <div className="mt-3 grid grid-cols-3 gap-3">
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
                                                        <span className={`text-sm font-medium ${data.theme === theme.id ? 'text-primary-900 dark:text-primary-100' : 'text-gray-700 dark:text-gray-300'}`}>
                                                            {theme.name}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        {errors.theme && <p className="text-sm text-red-600 mt-1">{errors.theme}</p>}
                                    </div>

                                    {/* Typography Selector */}
                                    <div>
                                        <InputLabel value={t('projects.typography', 'Tipografía')} />
                                        <div className="mt-3">
                                            <TypographySelector
                                                value={data.typography}
                                                onChange={(val) => setData('typography', val)}
                                                typographies={TYPOGRAPHIES}
                                            />
                                        </div>
                                        {errors.typography && <p className="text-sm text-red-600 mt-1">{errors.typography}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 my-8"></div>

                            {/* Section: Modules */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-primary-600 dark:text-primary-400">
                                    {t('projects.modules', 'Módulos Activos')}
                                </h3>

                                {/* Scoped Theme for Modules */}
                                <div style={getThemeStyle(data.theme)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        {
                                            id: 'finance',
                                            label: t('modules.finance', 'Finanzas'),
                                            desc: t('modules.finance_desc', 'Gestión de ingresos, gastos, presupuestos y cuentas.'),
                                            icon: CurrencyDollarIcon
                                        },
                                        {
                                            id: 'tasks',
                                            label: t('modules.tasks', 'Tareas'),
                                            desc: t('modules.tasks_desc', 'Gestión de tareas, kanban y seguimiento de progreso.'),
                                            icon: CheckListIcon
                                        },
                                        {
                                            id: 'chat',
                                            label: t('modules.chat.title', 'Chat de Equipo'),
                                            desc: t('modules.chat_desc', 'Comunicación en tiempo real para los miembros del proyecto.'),
                                            icon: ({ className }) => (
                                                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                            )
                                        }
                                    ].map((module) => (
                                        <div
                                            key={module.id}
                                            onClick={() => module.id !== 'tasks' && toggleModule(module.id)}
                                            className={`cursor-pointer border rounded-lg p-4 flex items-start space-x-3 transition-all ${data.modules.includes(module.id)
                                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-500'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                                                } ${module.id === 'tasks' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <div className={`p-2 rounded-md ${data.modules.includes(module.id) ? 'bg-primary-100 text-primary-600 dark:bg-primary-800 dark:text-primary-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                                                <module.icon className="w-6 h-6" />
                                            </div>
                                            <div>
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
                                                    disabled={module.id === 'tasks'}
                                                    className="rounded border-gray-300 text-primary-600 shadow-sm focus:ring-primary-500 disabled:opacity-50"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {errors.modules && <p className="text-sm text-red-600 mt-1">{errors.modules}</p>}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-gray-700 gap-4">
                                <Link href={route('dashboard')}>
                                    <SecondaryButton className="border-primary-200 text-primary-700 hover:bg-primary-50 dark:border-primary-800 dark:text-primary-300 dark:hover:bg-primary-900/40">
                                        {t('common.cancel', 'Cancelar')}
                                    </SecondaryButton>
                                </Link>
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