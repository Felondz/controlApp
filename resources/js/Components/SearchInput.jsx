import { router } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { useState } from 'react';

export default function SearchInput({ className = '', inputClasses = '' }) {
    const { t } = useTranslate();
    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('search'), { query }, { preserveState: true });
    };

    return (
        <form onSubmit={handleSearch} className={`relative ${className}`}>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 ${inputClasses || 'bg-gray-100 dark:bg-gray-700'}`}
                placeholder={t('common.search', 'Buscar...')}
            />
        </form>
    );
}
