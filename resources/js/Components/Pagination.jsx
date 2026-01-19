import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (links.length === 3) return null;

    return (
        <div className="flex flex-wrap -mb-1">
            {links.map((link, key) => {
                const className = link.url
                    ? `mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 focus:border-indigo-500 focus:text-indigo-500 dark:border-gray-700 ${link.active ? 'bg-indigo-600 text-white dark:bg-indigo-500' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`
                    : "mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded dark:border-gray-700 dark:bg-gray-800";

                return link.url ? (
                    <Link
                        key={key}
                        className={className}
                        href={link.url}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <div
                        key={key}
                        className={className}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}
