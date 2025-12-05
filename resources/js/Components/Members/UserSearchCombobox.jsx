import { Fragment, useState, useEffect } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { CheckCircleIcon, ChevronDownIcon } from '@/Components/Icons';
import axios from 'axios';
import { useTranslate } from '@/Hooks/useTranslate';
import InputLabel from '@/Components/InputLabel';

export default function UserSearchCombobox({ project, onSelect, selectedEmail, error }) {
    const { t } = useTranslate();
    const [query, setQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (query.length >= 2) {
                setLoading(true);
                axios.get(route('project.users.search', project.id), { params: { query } })
                    .then(response => {
                        setUsers(response.data);
                        setLoading(false);
                    })
                    .catch(() => {
                        setUsers([]);
                        setLoading(false);
                    });
            } else {
                setUsers([]);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, project.id]);

    // Handle manual email entry if no user selected
    useEffect(() => {
        if (!selectedUser && query && query.includes('@')) {
            onSelect({ email: query, name: query });
        }
    }, [query, selectedUser, onSelect]);

    const handleSelect = (user) => {
        setSelectedUser(user);
        onSelect(user);
    };

    return (
        <div className="w-full">
            <InputLabel value={t('common.email', 'Correo Electrónico')} />
            <Combobox value={selectedUser} onChange={handleSelect} nullable>
                <div className="relative mt-1">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white dark:bg-gray-900 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm border border-gray-300 dark:border-gray-700">
                        <Combobox.Input
                            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 dark:text-gray-100 bg-transparent focus:ring-0"
                            displayValue={(user) => user ? user.email : query}
                            onChange={(event) => {
                                setQuery(event.target.value);
                                setSelectedUser(null); // Reset selection on type
                            }}
                            placeholder={t('members.search_placeholder', 'Buscar por nombre o email...')}
                            autoComplete="off"
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </Combobox.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery('')}
                    >
                        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
                            {loading ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-300">
                                    {t('common.loading', 'Cargando...')}
                                </div>
                            ) : users.length === 0 && query !== '' ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-300">
                                    {query.includes('@')
                                        ? t('members.invite_email', 'Invitar a: ') + query
                                        : t('common.no_results', 'No se encontraron usuarios.')}
                                </div>
                            ) : (
                                users.map((user) => (
                                    <Combobox.Option
                                        key={user.id}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-600 text-white' : 'text-gray-900 dark:text-gray-100'
                                            }`
                                        }
                                        value={user}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <div className="flex items-center">
                                                    <img src={user.profile_photo_url} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
                                                    <span className={`ml-3 block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                        {user.name} <span className={`text-xs ${active ? 'text-indigo-200' : 'text-gray-500'}`}>({user.email})</span>
                                                    </span>
                                                </div>
                                                {selected ? (
                                                    <span
                                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-indigo-600'
                                                            }`}
                                                    >
                                                        <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Combobox.Option>
                                ))
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
            {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}
