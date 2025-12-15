// resources/js/Pages/Projects/CreateProject.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TypographySelector from '@/Components/TypographySelector';
import {
    CurrencyDollarIcon,
    CheckListIcon,
    ChartBarIcon,
    BellIcon,
    ChatIcon,
    FreelancerIcon,
    StartupIcon,
    FactoryIcon,
    PackageIcon,
    BriefcaseIcon,
    AcademicCapIcon,
    UsersIcon
} from '@/Components/Icons';
import { getThemeStyle } from '@/Utils/themeStyles';
import { useState, useRef, useMemo } from 'react';

// Custom Map for Icons based on module key
const MODULE_ICONS = {
    finance: CurrencyDollarIcon,
    tasks: CheckListIcon,
    chat: ChatIcon,
    analytics: ChartBarIcon,
    inventory: PackageIcon,
    operations: FactoryIcon,
    crm: UsersIcon,
    notes: CheckListIcon, // Fallback
};

// Dependency Map: Key depends on [Values]
// If dependencies are inactive, Key is locked.
// If Key is active, Dependencies cannot be deactivated.
const MODULE_DEPENDENCIES = {
    inventory: ['finance'],
    operations: ['finance', 'tasks'],
};

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

export default function CreateProject({ auth, availableModules = [] }) {
    const { t } = useTranslate();
    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [creationMode, setCreationMode] = useState('template'); // 'template' or 'custom'
    const [feedbackMessage, setFeedbackMessage] = useState(null); // For dependency errors

    // Define Templates Dynamically
    const PROJECT_TEMPLATES = [
        {
            id: 'freelancer',
            title: t('projects.templates.freelancer.title', 'Freelancer'),
            desc: t('projects.templates.freelancer.desc', 'Gestión total para profesionales independientes.'),
            modules: ['finance', 'tasks'],
            icon: FreelancerIcon
        },
        {
            id: 'startup',
            title: t('projects.templates.startup.title', 'Startup'),
            desc: t('projects.templates.startup.desc', 'Colaboración y finanzas para equipos ágiles.'),
            modules: ['finance', 'tasks', 'chat', 'inventory', 'operations'],
            icon: StartupIcon
        },
        {
            id: 'event_planning',
            title: t('projects.templates.event_planning.title', 'Planificación de Eventos'),
            desc: t('projects.templates.event_planning.desc', 'Organiza tareas y presupuesto para eventos.'),
            modules: ['finance', 'tasks', 'chat'],
            icon: BriefcaseIcon
        },
        {
            id: 'education',
            title: t('projects.templates.education.title', 'Educación'),
            desc: t('projects.templates.education.desc', 'Seguimiento de tareas y grupos de estudio.'),
            modules: ['tasks', 'chat'],
            icon: AcademicCapIcon,
        },
        {
            id: 'enterprise',
            title: t('projects.templates.enterprise.title', 'Empresa'),
            desc: t('projects.templates.enterprise.desc', 'Gestión completa con CRM y módulos avanzados.'),
            modules: ['finance', 'tasks', 'inventory', 'operations', 'crm'],
            icon: FactoryIcon,
            disabled: true,
            coming_soon: true,
        }
    ];

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

    const toggleModule = (moduleKey) => {
        const isActive = data.modules.includes(moduleKey);

        if (isActive) {
            // Deactivation Logic: Check if other active modules depend on this one
            const dependents = Object.keys(MODULE_DEPENDENCIES).filter(key =>
                MODULE_DEPENDENCIES[key].includes(moduleKey) && data.modules.includes(key)
            );

            if (dependents.length > 0) {
                // Prevent deactivation
                const depNames = dependents.map(d => t(`modules.${d}_label`, d)).join(', ');
                const thisName = t(`modules.${moduleKey}_label`, moduleKey);
                setFeedbackMessage({
                    type: 'error',
                    text: `No puedes desactivar ${thisName} porque ${depNames} depende(n) de él.`
                });
                setTimeout(() => setFeedbackMessage(null), 4000);
                return;
            }

            // Safe to deactivate
            setData('modules', data.modules.filter(m => m !== moduleKey));

        } else {
            // Activation Logic
            const dependencies = MODULE_DEPENDENCIES[moduleKey] || [];
            const missingDeps = dependencies.filter(d => !data.modules.includes(d));

            if (missingDeps.length > 0) {
                const missingNames = missingDeps.map(d => t(`modules.${d}_label`, d)).join(', ');
                setFeedbackMessage({
                    type: 'error',
                    text: `Para activar este módulo, primero debes activar: ${missingNames}.`
                });
                setTimeout(() => setFeedbackMessage(null), 4000);
                return;
            }

            setData('modules', [...data.modules, moduleKey]);
        }
    };

    const applyTemplate = (template) => {
        if (template.disabled) return;
        // Filter out modules that are not available in availableModules (backend source of truth)
        const validModules = template.modules.filter(mKey =>
            availableModules.some(am => am.key === mKey)
        );
        setData('modules', validModules);
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

    // Calculate Pricing
    const totalPrice = useMemo(() => {
        let total = 0;
        data.modules.forEach(modKey => {
            const mod = availableModules.find(m => m.key === modKey);
            if (mod) {
                // Use price from DB. If Seeder set to 0, this is 0.
                total += parseFloat(mod.price || 0);
            }
        });
        return total;
    }, [data.modules, availableModules]);

    const formatPrice = (price) => {
        if (price === 0 || price === "0.00") return t('common.free', 'Gratis');
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-primary-600 dark:text-primary-400 leading-tight">{t('projects.create')}</h2>}
        >
            <Head title={t('projects.create')} />

            {/* Global Toast for Errors */}
            {feedbackMessage && (
                <div className="fixed top-24 right-6 z-50 bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-down">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span className="text-sm font-medium">{feedbackMessage.text}</span>
                </div>
            )}

            <div className="py-6 lg:py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-2xl p-6 sm:p-10 border border-gray-100 dark:border-gray-700">
                        <form onSubmit={submit} className="space-y-10" encType="multipart/form-data">

                            {/* Section: Basic Info & Image */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                                {/* Image Upload */}
                                <div className="md:col-span-4 flex flex-col items-center space-y-4">
                                    <InputLabel value={t('projects.image', 'Imagen del Proyecto')} />
                                    <div
                                        className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 transition-all cursor-pointer group bg-gray-50 dark:bg-gray-900 shadow-sm hover:shadow-md"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                                <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-xs text-center px-4 font-medium">{t('projects.upload_image')}</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                            <span className="text-white text-sm font-bold bg-white/20 px-3 py-1 rounded-full">{t('projects.change_image')}</span>
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
                                <div className="md:col-span-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <InputLabel htmlFor="nombre" value={t('projects.name')} />
                                            <TextInput
                                                id="nombre"
                                                name="nombre"
                                                value={data.nombre}
                                                className="mt-2 block w-full h-12 px-4 text-lg"
                                                onChange={(e) => setData('nombre', e.target.value)}
                                                required
                                                autoFocus
                                                placeholder={t('projects.placeholders.name')}
                                            />
                                            {errors.nombre && <p className="text-sm text-red-600 mt-1">{errors.nombre}</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <InputLabel htmlFor="descripcion" value={t('projects.description')} />
                                            <textarea
                                                id="descripcion"
                                                name="descripcion"
                                                value={data.descripcion}
                                                onChange={(e) => setData('descripcion', e.target.value)}
                                                rows="3"
                                                className="mt-2 block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                                                placeholder={t('projects.placeholders.description')}
                                            ></textarea>
                                            {errors.descripcion && <p className="text-sm text-red-600 mt-1">{errors.descripcion}</p>}
                                        </div>

                                        <div className="md:col-span-1">
                                            <InputLabel htmlFor="moneda_default" value={t('projects.currency')} />
                                            <select
                                                id="moneda_default"
                                                name="moneda_default"
                                                value={data.moneda_default}
                                                onChange={(e) => setData('moneda_default', e.target.value)}
                                                className="mt-2 block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white h-11"
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
                            </div>

                            <hr className="border-gray-200 dark:border-gray-700" />

                            {/* Section: Modules & Templates */}
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            {t('projects.setup_project', 'Configura tu Proyecto')}
                                            {/* Pricing Badge - Will show Free if 0 */}
                                            <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium border border-green-200 dark:border-green-800">
                                                {formatPrice(totalPrice)}
                                            </span>
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                            {t('projects.setup_desc', 'Elige una plantilla o selecciona los módulos manualmente.')}
                                        </p>
                                    </div>

                                    {/* Mode Toggle */}
                                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 self-start sm:self-auto">
                                        <button
                                            type="button"
                                            onClick={() => setCreationMode('template')}
                                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${creationMode === 'template'
                                                ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-300 shadow-sm'
                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                                }`}
                                        >
                                            {t('projects.template_mode')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCreationMode('custom')}
                                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${creationMode === 'custom'
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
                                        /* Template Rail */
                                        <div className="relative group/rail">
                                            <div className="flex overflow-x-auto pb-6 gap-6 snap-x snap-mandatory sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent px-1">
                                                {PROJECT_TEMPLATES.map((template) => {
                                                    const isSelected = JSON.stringify(data.modules.sort()) === JSON.stringify(template.modules.sort());
                                                    const isDisabled = template.disabled;

                                                    return (
                                                        <div
                                                            key={template.id}
                                                            onClick={() => !isDisabled && applyTemplate(template)}
                                                            className={`
                                                                flex-shrink-0 w-72 sm:w-auto snap-center relative
                                                                border-2 rounded-2xl p-6 transition-all duration-300
                                                                flex flex-col gap-4 group
                                                                ${isDisabled
                                                                    ? 'opacity-60 cursor-not-allowed border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 grayscale-[0.8]'
                                                                    : 'cursor-pointer'
                                                                }
                                                                ${isSelected && !isDisabled
                                                                    ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10 ring-4 ring-primary-100 dark:ring-primary-900/20 transform scale-[1.02]'
                                                                    : (!isDisabled ? 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg bg-white dark:bg-gray-800' : '')
                                                                }
                                                            `}
                                                        >
                                                            <div className={`
                                                                w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                                                                ${isSelected && !isDisabled
                                                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 ' + (!isDisabled ? 'group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40 group-hover:text-primary-600 dark:group-hover:text-primary-400' : '')
                                                                }
                                                            `}>
                                                                <template.icon className="w-6 h-6" />
                                                            </div>

                                                            <div>
                                                                <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1 flex items-center gap-2">
                                                                    {template.title}
                                                                    {template.coming_soon && (
                                                                        <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full uppercase font-bold">Soon</span>
                                                                    )}
                                                                </h4>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                                                    {template.desc}
                                                                </p>
                                                            </div>

                                                            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700/50 flex flex-wrap gap-2">
                                                                {template.modules.slice(0, 3).map(mod => {
                                                                    const modDef = availableModules.find(m => m.key === mod);
                                                                    if (!modDef) return null;
                                                                    return (
                                                                        <span key={mod} className="text-[10px] px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 font-medium uppercase tracking-wide">
                                                                            {t(`modules.${mod}_label`, modDef.name)}
                                                                        </span>
                                                                    );
                                                                })}
                                                                {template.modules.length > 3 && (
                                                                    <span className="text-[10px] px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-500 font-medium">
                                                                        +{template.modules.length - 3}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {isSelected && !isDisabled && (
                                                                <div className="absolute top-4 right-4">
                                                                    <div className="w-3 h-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-800"></div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        /* Manual Selection Grid */
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                            {availableModules.map((module) => {
                                                const Icon = MODULE_ICONS[module.key] || MODULE_ICONS.notes;
                                                const isSelected = data.modules.includes(module.key);
                                                const isActive = module.is_active && !module.coming_soon;

                                                // Dependency Check for Locking
                                                const requiredDeps = MODULE_DEPENDENCIES[module.key] || [];
                                                const hasDeps = requiredDeps.every(dep => data.modules.includes(dep));

                                                // Should be visible but restricted
                                                const isLocked = !hasDeps;

                                                return (
                                                    <div
                                                        key={module.id}
                                                        onClick={() => {
                                                            if (!isActive || isLocked) return; // Prevent interaction if inactive or locked
                                                            toggleModule(module.key);
                                                        }}
                                                        className={`
                                                            relative border-2 rounded-xl p-5 flex flex-col gap-3 transition-all duration-200
                                                            ${!isActive || isLocked ? 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700' : 'cursor-pointer'}
                                                            ${isSelected && isActive && !isLocked
                                                                ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10 ring-1 ring-primary-500'
                                                                : (isActive && !isLocked ? 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md bg-white dark:bg-gray-800' : '')
                                                            }
                                                        `}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                                                                {isLocked && !isSelected ? (
                                                                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                                                ) : (
                                                                    <Icon className="w-6 h-6" />
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col items-end">
                                                                {module.coming_soon ? (
                                                                    <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                                                        {t('common.coming_soon', 'Próximamente')}
                                                                    </span>
                                                                ) : (
                                                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${module.is_free ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                                                        {formatPrice(module.price)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h4 className={`font-bold text-base ${isSelected ? 'text-primary-900 dark:text-primary-100' : 'text-gray-900 dark:text-gray-100'}`}>
                                                                {t(`modules.${module.key}_label`, module.name)}
                                                            </h4>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                                                {t(`modules.${module.key}_desc`, module.description)}
                                                            </p>
                                                            {isLocked && !isSelected && (
                                                                <p className="text-[10px] text-red-500 font-semibold mt-1">
                                                                    {t('modules.requires', 'Requiere')}: {requiredDeps.map(d => t(`modules.${d}_label`, d)).join(', ')}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {isActive && !isLocked && (
                                                            <div className="mt-auto pt-2 flex justify-end">
                                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-primary-500 border-primary-500' : 'border-gray-300 dark:border-gray-600'}`}>
                                                                    {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                                {errors.modules && <p className="text-sm text-red-600 mt-1">{errors.modules}</p>}
                            </div>

                            <hr className="border-gray-200 dark:border-gray-700" />

                            {/* Theme Customization */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {t('projects.customize_appearance', 'Personaliza la Apariencia')}
                                </h3>

                                <div style={getThemeStyle(data.theme)} className="grid grid-cols-1 gap-8">
                                    {/* Theme Selector */}
                                    <div>
                                        <InputLabel value={t('projects.theme')} />
                                        <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-3">
                                            {PROJECT_THEMES.map((theme) => (
                                                <button
                                                    key={theme.id}
                                                    type="button"
                                                    onClick={() => setData('theme', theme.id)}
                                                    className={`relative p-3 rounded-xl border text-left transition-all group ${data.theme === theme.id
                                                        ? 'border-primary-500 ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                                                        }`}
                                                >
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div
                                                            className="w-8 h-8 rounded-full shadow-sm"
                                                            style={{ backgroundColor: theme.color }}
                                                        />
                                                        <span className={`text-xs font-medium text-center ${data.theme === theme.id ? 'text-primary-900 dark:text-primary-100' : 'text-gray-700 dark:text-gray-300'}`}>
                                                            {t(`projects.themes.${theme.id.split('-')[1]}`) || theme.id.split('-')[1]}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Typography Selector - HIDDEN AS REQUESTED */}
                                    {/*
                                    <div>
                                        <InputLabel value={t('projects.typography')} />
                                        <div className="mt-4">
                                            <TypographySelector
                                                value={data.typography}
                                                onChange={(val) => setData('typography', val)}
                                                typographies={TYPOGRAPHIES.map(t_item => ({
                                                    ...t_item,
                                                    name: t(`projects.typographies.${t_item.id}`)
                                                }))}
                                            />
                                        </div>
                                    </div> 
                                    */}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end pt-6 border-t border-gray-200 dark:border-gray-700 gap-4">
                                <Link href={route('dashboard')}>
                                    <SecondaryButton className="h-12 px-6 text-base border-gray-300 dark:border-gray-600">
                                        {t('common.cancel')}
                                    </SecondaryButton>
                                </Link>
                                <PrimaryButton disabled={processing} className="h-12 px-8 text-base shadow-xl shadow-primary-500/20">
                                    {formatPrice(totalPrice) === t('common.free', 'Gratis')
                                        ? t('projects.create')
                                        : `${t('projects.create')} (${formatPrice(totalPrice)})`}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Help Text */}
                    <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        <p>{t('projects.help_contact_support', '¿Necesitas ayuda para elegir?')}{' '}<a href="#" className="text-primary-600 hover:underline">{t('common.contact_support', 'Contacta a Soporte')}</a></p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}