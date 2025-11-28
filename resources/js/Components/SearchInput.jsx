import { router } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { useState } from 'react';
import { SearchIcon } from '@/Components/Icons';

export default function SearchInput({ className = '', inputClasses = '' }) {
    const { t } = useTranslate();
    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('search'), { query }, { preserveState: true });
    };

    return (
        <form onSubmit={handleSearch} className={`relative group ${className}`}>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" />
            </div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:focus:ring-primary-400 sm:text-sm sm:leading-6 transition-shadow duration-200 ${inputClasses || 'bg-gray-50 dark:bg-gray-800'}`}
                placeholder={t('common.search', 'Buscar...')}
            />
        </form>
    );
}
