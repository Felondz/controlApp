import { useState, useEffect } from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import {
    CurrencyDollarIcon,
    CheckListIcon,
    ChatIcon,
    ChartBarIcon,
    BellIcon,
    PuzzleIcon,
    CheckCircleIcon,
    WarningIcon
} from '@/Components/Icons';
import axios from 'axios';

export default function ModuleMarketplace({ project, onModuleChange }) {
    const { t } = useTranslate();
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);

    // Map module IDs to icons
    const iconMap = {
        finance: CurrencyDollarIcon,
        tasks: CheckListIcon,
        chat: ChatIcon,
        analytics: ChartBarIcon,
        notifications: BellIcon,
        marketplace: PuzzleIcon,
    };

    useEffect(() => {
        fetchModules();
    }, [project.id]);

    const fetchModules = async () => {
        try {
            const response = await axios.get(route('api.proyectos.marketplace.index', project.id));
            setModules(response.data);
        } catch (error) {
            console.error('Error fetching modules:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleModule = async (moduleId, currentStatus) => {
        if (processing) return;
        setProcessing(moduleId);

        try {
            const response = await axios.post(route('api.proyectos.marketplace.toggle', [project.id, moduleId]), {
                enable: !currentStatus
            });

            // Update local state
            setModules(modules.map(m =>
                m.id === moduleId ? { ...m, enabled: !currentStatus } : m
            ));

            // Notify parent component to update project state if needed
            if (onModuleChange) {
                onModuleChange(response.data.active_modules);
            }
        } catch (error) {
            console.error('Error toggling module:', error);
            // Show error notification (could use a toast here)
        } finally {
            setProcessing(null);
        }
    };

    if (loading) {
        return <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
            ))}
        </div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {modules.map((module) => {
                    const Icon = iconMap[module.id] || PuzzleIcon;
                    const isEnabled = module.enabled;
                    const isProcessing = processing === module.id;

                    return (
                        <div
                            key={module.id}
                            className={`relative flex flex-col p-6 border rounded-xl transition-all duration-200 ${isEnabled
                                ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10 ring-1 ring-primary-500/50'
                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-600'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-lg ${isEnabled
                                    ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                    : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                                    }`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <button
                                    onClick={() => toggleModule(module.id, isEnabled)}
                                    disabled={isProcessing || (module.required && isEnabled)}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${isEnabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                                        } ${module.required ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isEnabled ? 'translate-x-5' : 'translate-x-0'
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                    {t(`modules.${module.id}`, module.name)}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                    {t(`modules.${module.id}_desc`, module.description)}
                                </p>
                            </div>

                            {/* Dependencies Warning */}
                            {module.dependencies && module.dependencies.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                                    <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
                                        <WarningIcon className="w-4 h-4" />
                                        <span>
                                            {t('modules.requires', 'Requiere')}: {module.dependencies.join(', ')}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Status Badge */}
                            <div className="absolute top-6 right-14">
                                {isEnabled && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                        <CheckCircleIcon className="w-3 h-3" />
                                        {t('common.active', 'Activo')}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
