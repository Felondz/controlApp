import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    collapsed = false,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-center rounded-md transition-all duration-200 ease-in-out focus:outline-none ${collapsed ? 'justify-center px-2 py-2' : 'px-4 py-2 text-left'} ${active
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 font-medium'
                } ${className}`}
        >
            {children}
        </Link>
    );
}
