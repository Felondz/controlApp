import { useState } from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import { Bars3Icon, ChevronDownIcon, ChevronUpIcon, EyeSlashIcon } from '@/Components/Icons';

/**
 * WidgetCard - Wrapper component for dashboard widgets
 * 
 * Features:
 * - Drag handle (visible on hover)
 * - Collapse/expand toggle
 * - Hide button
 * - Responsive sizing based on widget.defaultSize
 */
export default function WidgetCard({
    widget,
    title,
    children,
    action,
    onHide,
    isDragging = false,
    dragHandleProps = {},
}) {
    const { t } = useTranslate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Size classes based on widget definition
    const sizeClasses = {
        small: 'col-span-1',
        medium: 'col-span-1 md:col-span-2',
        large: 'col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4',
    };

    const sizeClass = sizeClasses[widget?.defaultSize] || sizeClasses.small;

    return (
        <div
            className={`
                ${sizeClass}
                bg-white dark:bg-gray-800 
                rounded-xl shadow-lg 
                border border-gray-200 dark:border-gray-700
                overflow-hidden
                transition-all duration-300
                ${isDragging ? 'shadow-2xl ring-2 ring-primary-500 scale-[1.02]' : 'hover:shadow-xl'}
                group
            `}
        >
            {/* Header with drag handle and controls */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                {/* Drag Handle + Title */}
                <div className="flex items-center gap-2">
                    {/* Drag Handle */}
                    <div
                        {...dragHandleProps}
                        className="p-2 md:p-1.5 rounded-md cursor-grab active:cursor-grabbing 
                                   text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                                   hover:bg-gray-100 dark:hover:bg-gray-700
                                   opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity
                                   touch-manipulation"
                        title={t('dashboard.drag_hint', 'Arrastra para reordenar')}
                    >
                        <Bars3Icon className="w-5 h-5 md:w-4 md:h-4" />
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-semibold text-primary-700 dark:text-primary-300 flex items-center gap-2">
                        {widget?.icon && !title && (
                            // Optional: Render icon if no title prop (or if we want icon + title)
                            // For now let's just render title
                            null
                        )}
                        {title || t(widget?.titleKey, widget?.id)}
                    </h3>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                    {/* Custom Action */}
                    {action && (
                        <div className="mr-2">
                            {action}
                        </div>
                    )}
                    {/* Collapse Toggle */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                                   hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title={isCollapsed ? t('common.expand', 'Expandir') : t('common.collapse', 'Contraer')}
                    >
                        {isCollapsed ? (
                            <ChevronDownIcon className="w-4 h-4" />
                        ) : (
                            <ChevronUpIcon className="w-4 h-4" />
                        )}
                    </button>

                    {/* Hide Widget */}
                    {onHide && (
                        <button
                            onClick={() => onHide(widget.id)}
                            className="p-1.5 rounded-md text-gray-400 hover:text-red-500 dark:hover:text-red-400
                                       hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors
                                       opacity-0 group-hover:opacity-100"
                            title={t('dashboard.hide_widget', 'Ocultar widget')}
                        >
                            <EyeSlashIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div
                className={`
                    transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'max-h-0 overflow-hidden opacity-0' : 'max-h-[800px] opacity-100'}
                `}
            >
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
