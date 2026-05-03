import { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslate } from '@/Hooks/useTranslate';
import Pagination from '@/Components/Pagination';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import Dropdown from '@/Components/Dropdown';
import {
    UsersIcon, SearchIcon, ShieldCheckIcon, UserCircleIcon,
    CheckCircleIcon, XCircleIcon, EllipsisVerticalIcon
} from '@/Components/Icons';

export default function Index({ users, filters, stats }) {
    const { t } = useTranslate();
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');

    const handleFilter = (key, value) => {
        const newFilters = { ...filters, [key]: value || undefined };
        if (key === 'search') newFilters.search = searchQuery;

        // Remove empty values
        Object.keys(newFilters).forEach(k => { if (!newFilters[k]) delete newFilters[k]; });

        router.get(route('admin.users.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            handleFilter('search', searchQuery);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-primary-600 dark:text-primary-400 leading-tight flex items-center gap-2">
                    <UsersIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    {t('admin.users_title', 'Gestión de Usuarios')}
                </h2>
            }
        >
            <Head title={t('admin.users_title', 'Gestión de Usuarios')} />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('admin.total_users', 'Usuarios Totales')}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                        </div>
                        <UsersIcon className="w-8 h-8 text-primary-500 opacity-20" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('admin.active_users', 'Usuarios Activos')}</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
                        </div>
                        <CheckCircleIcon className="w-8 h-8 text-green-500 opacity-20" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('admin.admin_users', 'Super Admins')}</p>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.admins}</p>
                        </div>
                        <ShieldCheckIcon className="w-8 h-8 text-purple-500 opacity-20" />
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="relative flex-1 w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <TextInput
                            type="text"
                            placeholder={t('admin.search_placeholder', 'Buscar por nombre o email...')}
                            className="pl-10 w-full text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>

                    <div className="flex w-full sm:w-auto gap-3">
                        <SelectInput
                            value={filters?.role || ''}
                            onChange={(e) => handleFilter('role', e.target.value)}
                            className="text-sm flex-1 sm:w-40"
                        >
                            <option value="">{t('admin.all_roles', 'Todos los roles')}</option>
                            <option value="admin">{t('admin.role_super_admin', 'Super Admin')}</option>
                            <option value="user">{t('admin.role_user', 'Usuario')}</option>
                        </SelectInput>

                        <SelectInput
                            value={filters?.status || ''}
                            onChange={(e) => handleFilter('status', e.target.value)}
                            className="text-sm flex-1 sm:w-40"
                        >
                            <option value="">{t('admin.all_statuses', 'Todos los estados')}</option>
                            <option value="active">{t('admin.status_active', 'Activos')}</option>
                            <option value="inactive">{t('admin.status_inactive', 'Inactivos')}</option>
                        </SelectInput>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto scrollbar-thin">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.col_user', 'Usuario')}</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.col_role', 'Rol')}</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.col_projects', 'Proyectos')}</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.col_status', 'Estado')}</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.col_actions', 'Acciones')}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                            {t('admin.no_results', 'No se encontraron usuarios.')}
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            onClick={() => router.get(route('admin.users.show', user.uuid))}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        {user.profile_photo_url ? (
                                                            <img className="h-10 w-10 rounded-full object-cover" src={user.profile_photo_url} alt="" />
                                                        ) : (
                                                            <div className="h-10 w-10 shrink-0 bg-primary-50 dark:bg-primary-900/50 rounded-full flex flex-col items-center justify-center">
                                                                <UserCircleIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.is_super_admin ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                                                        <ShieldCheckIcon className="w-3.5 h-3.5" />
                                                        {t('admin.role_super_admin', 'Super Admin')}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                        {t('admin.role_user', 'Usuario')}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {user.total_projects} {t('admin.projects_label', 'proyectos')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.is_active ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                        {t('admin.status_active', 'Activo')}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                                        {t('admin.status_inactive', 'Inactivo')}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.patch(route('admin.users.toggleStatus', user.uuid), {}, { preserveScroll: true });
                                                    }}
                                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${user.is_active ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                                                >
                                                    <span className="sr-only">Toggle user status</span>
                                                    <span
                                                        aria-hidden="true"
                                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${user.is_active ? 'translate-x-5' : 'translate-x-0'}`}
                                                    />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {users.links && <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"><Pagination links={users.links} /></div>}
                </div>
            </div>
        </AuthenticatedLayout >
    );
}
