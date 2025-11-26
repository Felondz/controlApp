import { Link } from '@inertiajs/react';

export default function PrimaryLink({
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                `inline-flex items-center rounded-md border border-transparent bg-primary-700 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-primary-800 focus:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 active:bg-primary-900 dark:bg-secondary-800 dark:text-white dark:hover:bg-secondary-700 dark:focus:bg-secondary-700 dark:active:bg-secondary-900 ` + className
            }
        >
            {children}
        </Link>
    );
}
