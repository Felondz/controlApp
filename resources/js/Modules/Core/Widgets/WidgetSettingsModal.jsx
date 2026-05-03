import { useState, useEffect } from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { EyeIcon, EyeSlashIcon, ArrowsRightLeftIcon } from '@/Components/Icons';
import { WIDGET_DEFINITIONS, getAvailableWidgets, DEFAULT_LAYOUT } from '@/Utils/widgetRegistry';

/**
 * WidgetSettingsModal - Configure visible widgets and reset layout
 */
export default function WidgetSettingsModal({
    show,
    onClose,
    project = null,
    user = null,
    isAdmin,
    onSave,
    allowedModules = null, // Optional array of module names to filter by
    settingsKey = 'dashboard' // Key in project.settings JSON
}) {
    const { t } = useTranslate();

    // Determine context settings
    const contextSettings = project ? project.settings : (user ? user.settings : {});
    const savedSettings = contextSettings?.[settingsKey] || {};

    const modules = project?.modules || [];
    const isPersonal = project?.es_personal || false;

    // Get all available widgets for this user
    const allWidgets = getAvailableWidgets(modules, isAdmin, isPersonal);

    // Filter by allowedModules if specified
    const availableWidgets = allowedModules
        ? allWidgets.filter(w => w && allowedModules.includes(w.module))
        : allWidgets;

    // Local state for hidden widgets
    const [hidden, setHidden] = useState(savedSettings.hidden || []);

    // Reset on open
    useEffect(() => {
        if (show) {
            setHidden(savedSettings.hidden || []);
        }
    }, [show, savedSettings.hidden]);

    // Toggle widget visibility
    const toggleWidget = (widgetId) => {
        setHidden(prev => {
            if (prev.includes(widgetId)) {
                return prev.filter(id => id !== widgetId);
            }
            return [...prev, widgetId];
        });
    };

    // Reset to default layout
    const handleReset = () => {
        setHidden([]);
    };

    // Save changes
    const handleSave = () => {
        const newSettings = {
            ...contextSettings,
            [settingsKey]: {
                layout: DEFAULT_LAYOUT, // Reset to default order
                hidden,
            }
        };
        onSave(newSettings);
        onClose();
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="flex flex-col max-h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex-none">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {t('dashboard.customize', 'Personalizar Dashboard')}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('dashboard.customize_desc', 'Selecciona qué widgets mostrar en tu dashboard. Puedes arrastrar los widgets para reordenarlos.')}
                    </p>
                </div>

                {/* Widget List */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-thin space-y-6">
                    {Object.entries(
                        (availableWidgets || []).filter(w => w).reduce((acc, widget) => {
                            const module = widget.module || 'core';
                            if (!acc[module]) acc[module] = [];
                            acc[module].push(widget);
                            return acc;
                        }, {})
                    ).sort(([a], [b]) => {
                        if (a === 'core') return -1;
                        if (b === 'core') return 1;
                        return a.localeCompare(b);
                    }).map(([module, widgets]) => (
                        <div key={module} className="space-y-3">
                            {/* Section Header */}
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-1">
                                {module === 'core'
                                    ? t('widgets.core', 'General')
                                    : t(`modules.${module}_label`, module)}
                            </h3>

                            {/* Widgets in this module */}
                            <div className="space-y-2">
                                {widgets.filter(Boolean).map(widget => {
                                    const widgetId = widget?.id || Math.random().toString();
                                    const isHidden = hidden.includes(widgetId);
                                    return (
                                        <div
                                            key={widgetId}
                                            className={`
                                                flex items-center justify-between p-3 rounded-lg border
                                                ${isHidden
                                                    ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
                                                    : 'bg-white dark:bg-gray-900 border-primary-200 dark:border-primary-800'
                                                }
                                                transition-all duration-200
                                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <ArrowsRightLeftIcon className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {t(widget?.titleKey, widget?.id)}
                                                    </p>
                                                    {widget?.requiresAdmin && (
                                                        <span className="text-xs text-warning-600 dark:text-warning-400">
                                                            {t('widgets.admin_only', 'Solo admins')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => toggleWidget(widgetId)}
                                                className={`
                                                    p-2 rounded-lg transition-colors
                                                    ${isHidden
                                                        ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                        : 'text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                                                    }
                                                `}
                                                title={isHidden ? t('common.show', 'Mostrar') : t('common.hide', 'Ocultar')}
                                            >
                                                {isHidden ? (
                                                    <EyeSlashIcon className="w-5 h-5" />
                                                ) : (
                                                    <EyeIcon className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 flex-none bg-white dark:bg-gray-800">
                    <button
                        onClick={handleReset}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                        {t('dashboard.reset_layout', 'Restablecer diseño')}
                    </button>

                    <div className="flex gap-3">
                        <SecondaryButton onClick={onClose} type="button">
                            {t('common.cancel', 'Cancelar')}
                        </SecondaryButton>
                        <PrimaryButton onClick={handleSave} type="button">
                            {t('common.save', 'Guardar')}
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </Modal >
    );
}
