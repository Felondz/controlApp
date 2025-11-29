import React from 'react';
import { InfoIcon, WarningIcon, CheckListIcon } from '@/Components/Icons';

export default function Alert({ title, children, type = 'info', className = '' }) {
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
            IconComponent: CheckListIcon // Using CheckList as a placeholder for success if CheckIcon doesn't exist, or we can add CheckIcon
        },
        error: {
            container: 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800/30 text-red-600 dark:text-red-300',
            icon: 'text-red-400',
            IconComponent: InfoIcon // Placeholder
        }
    };

    const style = styles[type] || styles.info;
    const Icon = style.IconComponent;

    return (
        <div className={`flex items-center justify-center text-center p-4 rounded-lg border ${style.container} ${className}`}>
            <Icon className={`h-5 w-5 mr-2 ${style.icon}`} />
            <p className="text-sm">
                {title && <span className="font-semibold mr-1">{title}:</span>}
                {children}
            </p>
        </div>
    );
}
