import { useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { useTranslate } from '@/Hooks/useTranslate';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextArea from '@/Components/TextArea';
import InputLabel from '@/Components/InputLabel';
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

export default function BugReporterWidget() {
    const { is_ptr } = usePage().props;
    const { t } = useTranslate();

    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [severity, setSeverity] = useState('medium');
    const [screenshot, setScreenshot] = useState(null);
    const [screenshotPreview, setScreenshotPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [openCount, setOpenCount] = useState(0);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!is_ptr) return;
        axios.get('/ptr/bug-reports/stats').then(r => setOpenCount(r.data.open_count || 0)).catch(() => { });
    }, [is_ptr]);

    // Clipboard paste support
    useEffect(() => {
        if (!isOpen || step !== 2) return;
        const handler = (e) => {
            const items = e.clipboardData?.items;
            if (!items) return;
            for (const item of items) {
                if (item.type.startsWith('image/')) {
                    e.preventDefault();
                    const file = item.getAsFile();
                    setScreenshot(file);
                    setScreenshotPreview(URL.createObjectURL(file));
                    break;
                }
            }
        };
        document.addEventListener('paste', handler);
        return () => document.removeEventListener('paste', handler);
    }, [isOpen, step]);

    if (!is_ptr) return null;

    const reset = () => {
        setStep(1);
        setCategory('');
        setDescription('');
        setSeverity('medium');
        setScreenshot(null);
        setScreenshotPreview(null);
        setSuccess(false);
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
            formData.append('description', description);
            formData.append('severity', severity);
            formData.append('page_url', window.location.href);
            if (screenshot) formData.append('screenshot', screenshot);

            await axios.post('/ptr/bug-reports', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSuccess(true);
            setOpenCount(prev => prev + 1);
            setTimeout(() => { reset(); setIsOpen(false); }, 2000);
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
        <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3">
            {isOpen && (
                <div className="w-80 sm:w-96 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-primary-600 dark:bg-primary-700 text-white">
                        <div className="flex items-center gap-2">
                            {step === 2 && (
                                <button onClick={() => setStep(1)} className="p-0.5 rounded hover:bg-primary-500 transition" aria-label="Back">
                                    <ArrowLeftIcon className="w-4 h-4" />
                                </button>
                            )}
                            <BugIcon className="w-5 h-5" />
                            <span className="text-sm font-semibold">{t('bug_reporter.title', 'Report a Bug')}</span>
                        </div>
                        <button onClick={() => { setIsOpen(false); reset(); }} className="p-0.5 rounded hover:bg-primary-500 transition" aria-label="Close">
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-4">
                        {success ? (
                            <div className="flex flex-col items-center gap-2 py-6 text-center">
                                <CheckCircleIcon className="w-10 h-10 text-green-500" />
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('bug_reporter.success', 'Bug reported! Thank you.')}
                                </p>
                            </div>
                        ) : step === 1 ? (
                            /* Step 1: Category Selection */
                            <div className="space-y-3">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {t('bug_reporter.select_category', 'What kind of bug is it?')}
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {CATEGORIES.map(({ key, icon: Icon }) => (
                                        <button
                                            key={key}
                                            onClick={() => selectCategory(key)}
                                            className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-600 text-left text-sm hover:bg-primary-50 hover:border-primary-300 dark:hover:bg-primary-900/20 dark:hover:border-primary-600 transition"
                                        >
                                            <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
                                            <span className="text-gray-700 dark:text-gray-300 truncate">
                                                {t(`bug_reporter.category_${key}`, key)}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            /* Step 2: Details Form */
                            <div className="space-y-3">
                                {/* Description */}
                                <div>
                                    <InputLabel value={t('bug_reporter.description', 'Description')} />
                                    <TextArea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder={t(`bug_reporter.hint_${category}`, '')}
                                        rows={3}
                                        className="w-full text-sm"
                                        required
                                    />
                                </div>

                                {/* Severity */}
                                <div>
                                    <InputLabel value={t('bug_reporter.severity', 'Severity')} />
                                    <div className="flex gap-2">
                                        {SEVERITIES.map(sev => (
                                            <SecondaryButton
                                                key={sev}
                                                onClick={() => setSeverity(sev)}
                                                className={`flex-1 justify-center text-xs !px-2 !py-1.5 ${severity === sev
                                                    ? sev === 'high'
                                                        ? '!bg-red-100 !text-red-700 dark:!bg-red-900/30 dark:!text-red-400 ring-1 ring-red-300'
                                                        : sev === 'medium'
                                                            ? '!bg-yellow-100 !text-yellow-700 dark:!bg-yellow-900/30 dark:!text-yellow-400 ring-1 ring-yellow-300'
                                                            : '!bg-green-100 !text-green-700 dark:!bg-green-900/30 dark:!text-green-400 ring-1 ring-green-300'
                                                    : ''
                                                    }`}
                                            >
                                                {t(`bug_reporter.severity_${sev}`, sev)}
                                            </SecondaryButton>
                                        ))}
                                    </div>
                                </div>

                                {/* Screenshot */}
                                <div>
                                    <InputLabel value={t('bug_reporter.screenshot', 'Screenshot')} optional />
                                    {screenshotPreview ? (
                                        <div className="relative">
                                            <img src={screenshotPreview} alt="" className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600" />
                                            <button
                                                onClick={() => { setScreenshot(null); setScreenshotPreview(null); }}
                                                className="absolute top-1 right-1 p-0.5 bg-gray-900/60 rounded-full text-white hover:bg-gray-900/80 transition"
                                            >
                                                <XMarkIcon className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400 hover:border-primary-400 hover:text-primary-600 dark:hover:border-primary-500 dark:hover:text-primary-400 transition"
                                        >
                                            <CameraIcon className="w-4 h-4" />
                                            {t('bug_reporter.add_screenshot', 'Add screenshot (or paste from clipboard)')}
                                        </button>
                                    )}
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                </div>

                                {/* Submit */}
                                <PrimaryButton
                                    onClick={handleSubmit}
                                    disabled={!description.trim() || submitting}
                                    className="w-full justify-center !py-2"
                                >
                                    {submitting
                                        ? t('common.saving', 'Saving...')
                                        : t('bug_reporter.submit', 'Submit Report')
                                    }
                                </PrimaryButton>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Floating Trigger Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group relative flex flex-col items-center gap-1.5 px-5 py-3.5 rounded-xl bg-danger-600 text-white shadow-lg shadow-danger-600/30 hover:bg-danger-500 active:bg-danger-700 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-danger-500/40"
                    aria-label={t('bug_reporter.title', 'Report a Bug')}
                >
                    <div className="p-1.5 rounded-lg bg-white/15 group-hover:bg-white/25 transition">
                        <BugIcon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider">{t('bug_reporter.floating_label', 'Bug Tracker')}</span>
                    {openCount > 0 && (
                        <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-white text-danger-600 rounded-full ring-2 ring-danger-600 shadow-sm">
                            {openCount > 99 ? '99+' : openCount}
                        </span>
                    )}
                </button>
            )}
        </div>
    );
}
