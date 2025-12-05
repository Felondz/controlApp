import { useState, useRef, useEffect } from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import { ChevronDownIcon, SearchIcon } from '@/Components/Icons';

export default function TypographySelector({ value, onChange, typographies }) {
    const { t } = useTranslate();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const containerRef = useRef(null);
    const searchInputRef = useRef(null);

    const selectedFont = typographies.find(font => font.id === value) || typographies[0];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when opening
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const filteredTypography = query === ''
        ? typographies
        : typographies.filter((font) =>
            font.name.toLowerCase().includes(query.toLowerCase())
        );

    return (
        <div className="relative" ref={containerRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-full cursor-default rounded-md bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm shadow-sm transition-all"
            >
                <span className={`block truncate ${selectedFont ? `font-${selectedFont.id}` : ''}`}>
                    {selectedFont ? selectedFont.name : 'Select Typography'}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDownIcon
                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                    />
                </span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-md bg-white dark:bg-gray-800 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
                    {/* Search Input */}
                    <div className="relative border-b border-gray-200 dark:border-gray-700 p-2">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <SearchIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            ref={searchInputRef}
                            type="text"
                            className="block w-full rounded-md border-0 bg-gray-50 dark:bg-gray-900 py-1.5 pl-9 pr-3 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                            placeholder={t('common.search', 'Buscar tipografía...')}
                            onChange={(event) => setQuery(event.target.value)}
                            value={query}
                        />
                    </div>

                    {/* Options List */}
                    <ul className="max-h-60 overflow-auto py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                        {filteredTypography.length === 0 ? (
                            <li className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-500 dark:text-gray-400 text-center italic">
                                No se encontraron resultados.
                            </li>
                        ) : (
                            filteredTypography.map((font) => (
                                <li
                                    key={font.id}
                                    className={`relative cursor-pointer select-none py-3 pl-4 pr-4 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors ${value === font.id ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-900 dark:text-primary-100' : 'text-gray-900 dark:text-gray-100'
                                        }`}
                                    onClick={() => {
                                        onChange(font.id);
                                        setIsOpen(false);
                                        setQuery('');
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`block truncate font-${font.id}`}>
                                            {font.name}
                                        </span>
                                        {value === font.id && (
                                            <span className="text-primary-600 dark:text-primary-400">
                                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                        )}
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
