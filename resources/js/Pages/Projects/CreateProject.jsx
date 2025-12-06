// resources/js/Pages/Projects/CreateProject.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TypographySelector from '@/Components/TypographySelector';
import { CurrencyDollarIcon, CheckListIcon, ChartBarIcon, BellIcon, ChatIcon, FreelancerIcon, StartupIcon, ShoppingIcon, SalesIcon } from '@/Components/Icons';
import { getThemeStyle } from '@/Utils/themeStyles';
import { useState, useRef } from 'react';

// Available themes matching global themes


// Custom SVG Icons for Templates


const PROJECT_TEMPLATES = [
    {
        id: 'freelancer',
        modules: ['finance', 'tasks'],
        icon: FreelancerIcon
    },
    {
        id: 'startup',
        modules: ['finance', 'tasks', 'chat', 'analytics'],
        icon: StartupIcon
    },
    {
        id: 'purchases',
        modules: ['finance'],
        icon: ShoppingIcon
    },
    {
        id: 'sales',
        modules: ['finance', 'analytics'],
        icon: SalesIcon,
        disabled: true // Coming soon
    }
];

const PROJECT_THEMES = [
    { id: 'purple-modern', color: '#7c3aed' },
    { id: 'emerald-nature', color: '#059669' },
    { id: 'blue-ocean', color: '#2563eb' },
    { id: 'amber-warm', color: '#d97706' },
    { id: 'rose-romantic', color: '#e11d48' },
    { id: 'cyan-tech', color: '#0891b2' },
];

const TYPOGRAPHIES = [
    { id: 'sans' },
    { id: 'roboto' },
    { id: 'opensans' },
    { id: 'lato' },
    { id: 'montserrat' },
    { id: 'nunito' },
    { id: 'raleway' },
    { id: 'playfair' },
    { id: 'merriweather' },
];

export default function CreateProject({ auth }) {
    const { t } = useTranslate();
    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [creationMode, setCreationMode] = useState('template'); // 'template' or 'custom'

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

    const applyTemplate = (templateId) => {
        const template = PROJECT_TEMPLATES.find(t => t.id === templateId);
        if (template) {
            setData('modules', template.modules);
        }
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
                                                <span className="text-xs text-center px-2">{t('projects.upload_image')}</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white text-sm font-medium">{t('projects.change_image')}</span>
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
                                            placeholder={t('projects.placeholders.name')}
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
                                            placeholder={t('projects.placeholders.description')}
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
                                    {t('projects.identity')}
                                </h3>

                                {/* Theme Preview Scope: Only elements inside here will reflect the selected theme */}
                                <div style={getThemeStyle(data.theme)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Theme Selector */}
                                    <div>
                                        <InputLabel value={t('projects.theme')} />
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
                                                            {t(`projects.themes.${theme.id}`)}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        {errors.theme && <p className="text-sm text-red-600 mt-1">{errors.theme}</p>}
                                    </div>

                                    {/* Typography Selector */}
                                    <div>
                                        <InputLabel value={t('projects.typography')} />
                                        <div className="mt-3">
                                            <TypographySelector
                                                value={data.typography}
                                                onChange={(val) => setData('typography', val)}
                                                typographies={TYPOGRAPHIES.map(t_item => ({
                                                    ...t_item,
                                                    name: t(`projects.typographies.${t_item.id}`)
                                                }))}
                                            />
                                        </div>
                                        {errors.typography && <p className="text-sm text-red-600 mt-1">{errors.typography}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 my-8"></div>

                            {/* Section: Modules & Templates */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-primary-600 dark:text-primary-400">
                                        {t('projects.modules')}
                                    </h3>

                                    {/* Mode Toggle */}
                                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                        <button
                                            type="button"
                                            onClick={() => setCreationMode('template')}
                                            className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${creationMode === 'template'
                                                ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-300 shadow-sm'
                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                                }`}
                                        >
                                            {t('projects.template_mode')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCreationMode('custom')}
                                            className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${creationMode === 'custom'
                                                ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-300 shadow-sm'
                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                                }`}
                                        >
                                            {t('projects.custom_mode')}
                                        </button>
                                    </div>
                                </div>

                                {/* Scoped Theme for Modules */}
                                <div style={getThemeStyle(data.theme)}>
                                    {creationMode === 'template' ? (
                                        <div className="relative">
                                            {/* Mobile Carousel / Desktop Grid */}
                                            <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:pb-0 scrollbar-hide">
                                                {PROJECT_TEMPLATES.map((template) => (
                                                    <div
                                                        key={template.id}
                                                        onClick={() => !template.disabled && applyTemplate(template.id)}
                                                        className={`flex-shrink-0 w-64 sm:w-auto snap-center border rounded-xl p-5 flex flex-col items-center text-center space-y-4 transition-all duration-200 relative ${template.disabled
                                                            ? 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                                            : 'cursor-pointer ' + (JSON.stringify(data.modules.sort()) === JSON.stringify(template.modules.sort())
                                                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500 shadow-md transform scale-105 sm:scale-100'
                                                                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm')
                                                            }`}
                                                    >
                                                        <div className={`p-4 rounded-full transition-colors ${JSON.stringify(data.modules.sort()) === JSON.stringify(template.modules.sort())
                                                            ? 'bg-primary-100 text-primary-600 dark:bg-primary-800 dark:text-primary-300'
                                                            : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 group-hover:bg-primary-50 dark:group-hover:bg-gray-600'
                                                            }`}>
                                                            <template.icon className="w-8 h-8" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                                                                {t(`projects.templates.${template.id}.title`)}
                                                            </h4>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                                                {t(`projects.templates.${template.id}.desc`)}
                                                            </p>
                                                        </div>
                                                        {/* Active Badge */}
                                                        {JSON.stringify(data.modules.sort()) === JSON.stringify(template.modules.sort()) && !template.disabled && (
                                                            <div className="absolute top-3 right-3 w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
                                                        )}

                                                        {/* Disabled Badge */}
                                                        {template.disabled && (
                                                            <div className="absolute top-2 right-2 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                                                {t('common.coming_soon')}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            {/* Mobile Scroll Hint */}
                                            <div className="sm:hidden text-center mt-2 text-xs text-gray-400 animate-pulse">
                                                ← Desliza para ver más →
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {[
                                                {
                                                    id: 'finance',
                                                    label: t('modules.finance'),
                                                    desc: t('modules.finance_desc', 'Gestión de ingresos, gastos, presupuestos y cuentas.'),
                                                    icon: CurrencyDollarIcon
                                                },
                                                {
                                                    id: 'tasks',
                                                    label: t('modules.tasks'),
                                                    desc: t('modules.tasks_desc', 'Gestión de tareas, kanban y seguimiento de progreso.'),
                                                    icon: CheckListIcon
                                                },
                                                {
                                                    id: 'chat',
                                                    label: t('modules.chat.title'),
                                                    desc: t('modules.chat_desc', 'Comunicación en tiempo real para los miembros del proyecto.'),
                                                    icon: ChatIcon
                                                },
                                            ].map((module) => (
                                                <div
                                                    key={module.id}
                                                    onClick={() => toggleModule(module.id)}
                                                    className={`cursor-pointer border rounded-lg p-4 flex items-start space-x-3 transition-all ${data.modules.includes(module.id)
                                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-500'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                                                        }`}
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
                                                            className="rounded border-gray-300 text-primary-600 shadow-sm focus:ring-primary-500 disabled:opacity-50"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {errors.modules && <p className="text-sm text-red-600 mt-1">{errors.modules}</p>}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-gray-700 gap-4">
                                <Link href={route('dashboard')}>
                                    <SecondaryButton className="border-primary-200 text-primary-700 hover:bg-primary-50 dark:border-primary-800 dark:text-primary-300 dark:hover:bg-primary-900/40">
                                        {t('common.cancel')}
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