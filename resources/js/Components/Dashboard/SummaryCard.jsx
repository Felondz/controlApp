import { Link } from '@inertiajs/react';

export default function SummaryCard({
    title,
    icon: Icon,
    color = 'primary', // primary, secondary, success, danger, warning, info
    value,
    label,
    action,
    className = ''
}) {
    // Map semantic colors to Tailwind classes
    const colorMap = {
        primary: {
            border: 'border-primary-500',
            bgIcon: 'bg-primary-100 dark:bg-primary-900/30',
            textIcon: 'text-primary-600 dark:text-primary-400',
            textTitle: 'text-primary-700 dark:text-primary-300',
            textLink: 'text-primary-600 hover:text-primary-700'
        },
        secondary: {
            border: 'border-secondary-500',
            bgIcon: 'bg-secondary-100 dark:bg-secondary-900/30',
            textIcon: 'text-secondary-600 dark:text-secondary-400',
            textTitle: 'text-secondary-700 dark:text-secondary-300',
            textLink: 'text-secondary-600 hover:text-secondary-700'
        },
        success: {
            border: 'border-success-500',
            bgIcon: 'bg-success-100 dark:bg-success-900/30',
            textIcon: 'text-success-600 dark:text-success-400',
            textTitle: 'text-success-700 dark:text-success-300',
            textLink: 'text-success-600 hover:text-success-700'
        },
        danger: {
            border: 'border-danger-500',
            bgIcon: 'bg-danger-100 dark:bg-danger-900/30',
            textIcon: 'text-danger-600 dark:text-danger-400',
            textTitle: 'text-danger-700 dark:text-danger-300',
            textLink: 'text-danger-600 hover:text-danger-700'
        },
        warning: {
            border: 'border-warning-500',
            bgIcon: 'bg-warning-100 dark:bg-warning-900/30',
            textIcon: 'text-warning-600 dark:text-warning-400',
            textTitle: 'text-warning-700 dark:text-warning-300',
            textLink: 'text-warning-600 hover:text-warning-700'
        },
        info: {
            border: 'border-info-500',
            bgIcon: 'bg-info-100 dark:bg-info-900/30',
            textIcon: 'text-info-600 dark:text-info-400',
            textTitle: 'text-info-700 dark:text-info-300',
            textLink: 'text-info-600 hover:text-info-700'
        }
    };

    const styles = colorMap[color] || colorMap.primary;

    return (
        <div className={`bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6 border-l-4 ${styles.border} ${className} transition-all duration-200 hover:shadow-2xl hover:-translate-y-1`}>
            <div className="flex items-center justify-between mb-4">
                <h4 className={`text-lg font-bold ${styles.textTitle}`}>
                    {title}
                </h4>
                {Icon && (
                    <span className={`p-2 rounded-full ${styles.bgIcon} ${styles.textIcon}`}>
                        <Icon className="h-6 w-6" />
                    </span>
                )}
            </div>

            <div>
                {label && <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>}
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {value}
                </p>

                {action && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        {action.href ? (
                            <Link
                                href={action.href}
                                className={`text-sm font-medium flex items-center gap-1 ${styles.textLink}`}
                            >
                                {action.label} &rarr;
                            </Link>
                        ) : (
                            <button
                                onClick={action.onClick}
                                disabled={action.disabled}
                                className={`text-sm font-medium flex items-center gap-1 ${action.disabled ? 'text-gray-400 cursor-not-allowed' : styles.textLink}`}
                            >
                                {action.label}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
