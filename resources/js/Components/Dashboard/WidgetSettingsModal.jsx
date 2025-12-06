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
    project,
    isAdmin,
    onSave,
}) {
    const { t } = useTranslate();
    const modules = project?.modules || [];
    const isPersonal = project?.es_personal || false;
    const savedSettings = project?.settings?.dashboard || {};

    // Get all available widgets for this user
    const availableWidgets = getAvailableWidgets(modules, isAdmin, isPersonal);

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
            ...project?.settings,
            dashboard: {
                layout: DEFAULT_LAYOUT, // Reset to default order
                hidden,
            }
        };
        onSave(newSettings);
        onClose();
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {t('dashboard.customize', 'Personalizar Dashboard')}
                </h2>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    {t('dashboard.customize_desc', 'Selecciona qué widgets mostrar en tu dashboard. Puedes arrastrar los widgets para reordenarlos.')}
                </p>

                {/* Widget List */}
                <div className="space-y-2 max-h-80 overflow-y-auto">
                    {availableWidgets.map(widget => {
                        const isHidden = hidden.includes(widget.id);
                        return (
                            <div
                                key={widget.id}
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
                                            {t(widget.titleKey, widget.id)}
                                        </p>
                                        {widget.requiresAdmin && (
                                            <span className="text-xs text-warning-600 dark:text-warning-400">
                                                {t('widgets.admin_only', 'Solo admins')}
                                            </span>
                                        )}
                                        {widget.module && (
                                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                                {t(`modules.${widget.module}_label`, widget.module)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => toggleWidget(widget.id)}
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

                {/* Actions */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={handleReset}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                        {t('dashboard.reset_layout', 'Restablecer diseño')}
                    </button>

                    <div className="flex gap-3">
                        <SecondaryButton onClick={onClose}>
                            {t('common.cancel', 'Cancelar')}
                        </SecondaryButton>
                        <PrimaryButton onClick={handleSave}>
                            {t('common.save', 'Guardar')}
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
