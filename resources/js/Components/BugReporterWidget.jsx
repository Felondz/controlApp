import { useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { useTranslate } from '@/Hooks/useTranslate';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextArea from '@/Components/TextArea';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import MultiImageUploader from '@/Components/Common/MultiImageUploader';
import {
    BugIcon, XMarkIcon, ArrowLeftIcon, CameraIcon, CheckCircleIcon,
    GlobeAltIcon, CogIcon, InfoIcon, ExclamationTriangleIcon, ClockIcon
} from '@/Components/Icons';

const CATEGORIES = [
    { key: 'translation', icon: GlobeAltIcon },
    { key: 'functionality', icon: CogIcon },
    { key: 'unclear_info', icon: InfoIcon },
    { key: 'ui_visual', icon: ExclamationTriangleIcon },
    { key: 'performance', icon: ClockIcon },
    { key: 'other', icon: CheckCircleIcon },
];

const SEVERITIES = ['low', 'medium', 'high'];

export default function BugReporterWidget({ show, onClose }) {
    const { t } = useTranslate();

    const [step, setStep] = useState(1);
    const [category, setCategory] = useState('');
    const [module, setModule] = useState('');
    const [view, setView] = useState('');
    const [description, setDescription] = useState('');
    const [severity, setSeverity] = useState('medium');
    const [pageUrl, setPageUrl] = useState(() => window.location.href);
    const [platform, setPlatform] = useState(() => window.innerWidth < 768 ? 'mobile' : 'web');
    const [screenshot, setScreenshot] = useState(null);
    const [screenshotPreview, setScreenshotPreview] = useState(null);
    const [images, setImages] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);

    const MODULES = ['finance', 'inventory', 'operations', 'tasks', 'core', 'admin', 'other'];
    const VIEWS = ['dashboard', 'index', 'details', 'form', 'settings', 'profile', 'chat', 'other'];

    // Sync platform if screen size changes while modal is open
    useEffect(() => {
        if (!show) return;
        const handleResize = () => setPlatform(window.innerWidth < 768 ? 'mobile' : 'web');
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [show]);

    const reset = () => {
        setStep(1);
        setCategory('');
        setModule('');
        setView('');
        setDescription('');
        setSeverity('medium');
        setPlatform(window.innerWidth < 768 ? 'mobile' : 'web');
        setPageUrl(window.location.href);
        setScreenshot(null);
        setScreenshotPreview(null);
        setImages([]);
        setSuccess(false);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setScreenshot(file);
            setScreenshotPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('category', category);
            formData.append('module', module);
            formData.append('view', view);
            formData.append('description', description);
            formData.append('severity', severity);
            formData.append('page_url', pageUrl || window.location.href);
            formData.append('platform', platform);
            if (screenshot) formData.append('screenshot', screenshot);

            if (images && images.length > 0) {
                images.forEach((img, i) => {
                    formData.append(`images[${i}]`, img);
                });
            }

            await axios.post('/ptr/bug-reports', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSuccess(true);
            setTimeout(() => { handleClose(); }, 2000);
        } catch {
            alert(t('bug_reporter.submit_error', 'Error submitting bug report. Please try again.'));
        } finally {
            setSubmitting(false);
        }
    };

    const selectCategory = (key) => {
        setCategory(key);
        setStep(2);
    };

    return (
        <Modal show={show} onClose={handleClose} maxWidth="md">
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden flex flex-col max-h-[calc(100vh-4rem)]">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-danger-600 dark:bg-danger-700 text-white flex-none">
                    <div className="flex items-center gap-2">
                        {step === 2 && !success && (
                            <button onClick={() => setStep(1)} className="p-0.5 rounded hover:bg-danger-500 transition" aria-label="Back">
                                <ArrowLeftIcon className="w-4 h-4" />
                            </button>
                        )}
                        <BugIcon className="w-5 h-5" />
                        <span className="text-sm font-semibold">{t('bug_reporter.title', 'Report a Bug')}</span>
                    </div>
                    <button onClick={handleClose} className="p-0.5 rounded hover:bg-danger-500 transition" aria-label="Close">
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 scrollbar-thin">
                    {success ? (
                        <div className="flex flex-col items-center gap-2 py-6 text-center">
                            <CheckCircleIcon className="w-10 h-10 text-green-500" />
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('bug_reporter.success', '¡Bug reportado! Gracias por tu ayuda.')}
                            </p>
                        </div>
                    ) : step === 1 ? (
                        /* Step 1: Category Selection */
                        <div className="space-y-3">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t('bug_reporter.select_category', '¿Qué tipo de error es?')}
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {CATEGORIES.map(({ key, icon: Icon }) => (
                                    <button
                                        key={key}
                                        onClick={() => selectCategory(key)}
                                        className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-600 text-left text-sm hover:bg-danger-50 hover:border-danger-300 dark:hover:bg-danger-900/20 dark:hover:border-danger-600 transition group"
                                    >
                                        <Icon className="w-4 h-4 text-danger-600 dark:text-danger-400 shrink-0 group-hover:scale-110 transition-transform" />
                                        <span className="text-gray-700 dark:text-gray-300 truncate">
                                            {t(`bug_reporter.category_${key}`, key)}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Step 2: Details Form */
                        <div className="space-y-4">
                            {/* Module & View Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value={t('bug_reporter.module', 'Módulo')} />
                                    <select
                                        value={module}
                                        onChange={(e) => setModule(e.target.value)}
                                        className="w-full text-sm mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-md shadow-sm focus:ring-danger-500 focus:border-danger-500"
                                    >
                                        <option value="">{t('bug_reporter.select_module', 'Seleccionar Módulo...')}</option>
                                        {MODULES.map(m => (
                                            <option key={m} value={m}>{t(`bug_reporter.module_${m}`, m)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <InputLabel value={t('bug_reporter.view', 'Vista')} />
                                    <select
                                        value={view}
                                        onChange={(e) => setView(e.target.value)}
                                        className="w-full text-sm mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-md shadow-sm focus:ring-danger-500 focus:border-danger-500"
                                    >
                                        <option value="">{t('bug_reporter.select_view', 'Seleccionar Vista...')}</option>
                                        {VIEWS.map(v => (
                                            <option key={v} value={v}>{t(`bug_reporter.view_${v}`, v)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <InputLabel value={t('bug_reporter.description', 'Descripción')} />
                                <TextArea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder={t(`bug_reporter.hint_${category}`, '')}
                                    rows={3}
                                    className="w-full text-sm mt-1"
                                    required
                                />
                            </div>

                            {/* Page URL */}
                            <div>
                                <InputLabel value={t('bug_reporter.page_url', 'URL de la Página')} />
                                <input
                                    type="url"
                                    value={pageUrl}
                                    onChange={(e) => setPageUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full text-sm mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-md shadow-sm focus:ring-danger-500 focus:border-danger-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Severity */}
                                <div>
                                    <InputLabel value={t('bug_reporter.severity', 'Severidad')} />
                                    <div className="flex gap-1 mt-1">
                                        {SEVERITIES.map(sev => (
                                            <button
                                                key={sev}
                                                type="button"
                                                onClick={() => setSeverity(sev)}
                                                className={`flex-1 flex justify-center py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${severity === sev
                                                    ? sev === 'high'
                                                        ? 'bg-red-600 text-white ring-2 ring-red-300 dark:ring-red-900/50'
                                                        : sev === 'medium'
                                                            ? 'bg-yellow-500 text-white ring-2 ring-yellow-200 dark:ring-yellow-900/50'
                                                            : 'bg-green-600 text-white ring-2 ring-green-200 dark:ring-green-900/50'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {t(`bug_reporter.severity_${sev}`, sev)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Platform */}
                                <div>
                                    <InputLabel value={t('bug_reporter.platform', 'Plataforma')} />
                                    <div className="flex gap-1 mt-1">
                                        {['web', 'mobile'].map(plat => (
                                            <button
                                                key={plat}
                                                type="button"
                                                onClick={() => setPlatform(plat)}
                                                className={`flex-1 flex justify-center py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${platform === plat
                                                    ? 'bg-primary-600 text-white ring-2 ring-primary-200 dark:ring-primary-900/50'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {t(`bug_reporter.platform_${plat}`, plat)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Screenshot */}
                            <div>
                                <InputLabel value={t('bug_reporter.screenshot', 'Captura de Pantalla')} optional />
                                {screenshotPreview ? (
                                    <div className="relative mt-1">
                                        <img src={screenshotPreview} alt="" className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600" />
                                        <button
                                            onClick={() => { setScreenshot(null); setScreenshotPreview(null); }}
                                            className="absolute top-2 right-2 p-1 bg-gray-900/60 rounded-full text-white hover:bg-gray-900/80 transition"
                                        >
                                            <XMarkIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full mt-1 flex flex-col items-center justify-center gap-1 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-danger-400 hover:text-danger-600 dark:hover:text-danger-400 transition group"
                                    >
                                        <CameraIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                        <span className="text-xs">{t('bug_reporter.add_screenshot', 'Agregar captura')}</span>
                                    </button>
                                )}
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </div>

                            {/* Multiple Images */}
                            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                <MultiImageUploader
                                    label={t('bug_reporter.additional_images', 'Imágenes Adicionales')}
                                    images={images}
                                    onChange={setImages}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer (only for Step 2) */}
                {step === 2 && !success && (
                    <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex-none bg-gray-50 dark:bg-gray-900/50">
                        <PrimaryButton
                            onClick={handleSubmit}
                            disabled={!description.trim() || submitting}
                            className="w-full justify-center !py-2.5 bg-danger-600 hover:bg-danger-700 text-white shadow-lg shadow-danger-600/20"
                        >
                            {submitting
                                ? t('common.saving', 'Saving...')
                                : t('bug_reporter.submit', 'Enviar Reporte')
                            }
                        </PrimaryButton>
                    </div>
                )}
            </div>
        </Modal>
    );
}
