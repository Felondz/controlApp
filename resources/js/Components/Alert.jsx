import React from 'react';
import { InfoIcon, WarningIcon, CheckCircleIcon, XCircleIcon, XIcon } from '@/Components/Icons';

export default function Alert({ title, message, children, type = 'info', onClose, className = '' }) {
    const styles = {
        info: {
            container: 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/30 text-blue-600 dark:text-blue-300',
            icon: 'text-blue-400',
            IconComponent: InfoIcon
        },
        warning: {
            container: 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/30 text-amber-600 dark:text-amber-300',
            icon: 'text-amber-400',
            IconComponent: WarningIcon
        },
        success: {
            container: 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800/30 text-green-600 dark:text-green-300',
            icon: 'text-green-400',
            IconComponent: CheckCircleIcon
        },
        error: {
            container: 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800/30 text-red-600 dark:text-red-300',
            icon: 'text-red-400',
            IconComponent: XCircleIcon
        }
    };

    const style = styles[type] || styles.info;
    const Icon = style.IconComponent;

    return (
        <div className={`flex items-start p-4 rounded-lg border ${style.container} ${className}`}>
            <Icon className={`h-5 w-5 mr-3 flex-shrink-0 ${style.icon}`} />
            <div className="flex-1 text-sm">
                {title && <span className="font-semibold block mb-1">{title}</span>}
                {message || children}
            </div>
            {onClose && (
                <button onClick={onClose} className={`ml-3 flex-shrink-0 ${style.icon} hover:opacity-75 focus:outline-none`}>
                    <XIcon className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
