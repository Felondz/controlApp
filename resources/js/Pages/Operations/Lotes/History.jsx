import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import Pagination from '@/Components/Pagination'; // Assuming standard pagination component exists or will verify
import { ChevronLeftIcon } from '@/Components/Icons';
import { useState } from 'react';
import debounce from 'lodash/debounce';

export default function History({ auth, proyecto, lotes, filters }) {
    const { t } = useTranslate();
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleSearch = debounce((query) => {
        router.get(
            route('operations.lotes.history', { proyecto: proyecto.uuid }),
            { search: query, status },
            { preserveState: true, replace: true }
        );
    }, 300);

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        router.get(
            route('operations.lotes.history', { proyecto: proyecto.uuid }),
            { search, status: e.target.value },
            { preserveState: true, replace: true }
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            project={proyecto}
            header={
                <div className="flex items-center gap-4">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        {t('operations.history_title', 'Historial de Producción')}
                    </h2>
                </div>
            }
        >
            <Head title={t('operations.history_page_title', 'Historial de Lotes')} />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-4 sm:p-6 text-gray-900 dark:text-gray-100">

                            {/* Filters */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                <div className="flex-1">
                                    <TextInput
                                        placeholder={t('operations.search_history_placeholder', 'Buscar por código...')}
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            handleSearch(e.target.value);
                                        }}
                                        className="w-full"
                                    />
                                </div>
                                <div className="w-full sm:w-48">
                                    <SelectInput
                                        value={status}
                                        onChange={handleStatusChange}
                                        className="w-full"
                                    >
                                        <option value="">{t('operations.filter_all_status', 'Todos los estados')}</option>
                                        <option value="finished">{t('operations.status_finished', 'Finalizado')}</option>
                                        <option value="active">{t('operations.status_active', 'Activo')}</option>
                                        <option value="discarded">{t('operations.status_discarded', 'Descartado')}</option>
                                    </SelectInput>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto -mx-4 sm:mx-0 scrollbar-thin">
                                <div className="inline-block min-w-full align-middle md:px-0">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                                            <tr>
                                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('operations.col_code', 'Código')}</th>
                                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('operations.col_process', 'Proceso')}</th>
                                                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('operations.col_stage', 'Etapa')}</th>
                                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('operations.col_status', 'Estado')}</th>
                                                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('operations.col_created', 'Creado')}</th>
                                                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('operations.col_finished', 'Finalizado')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {lotes.data.length > 0 ? (
                                                lotes.data.map((lote) => (
                                                    <tr key={lote.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-mono text-sm">{lote.code}</td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                                                            <div className="text-sm">{lote.production_process?.name || 'N/A'}</div>
                                                            {/* Mobile only info */}
                                                            <div className="sm:hidden text-xs text-gray-500 mt-1">{lote.stage?.name}</div>
                                                        </td>
                                                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm">{lote.stage?.name || 'N/A'}</td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                                ${lote.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                                    lote.status === 'finished' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                                                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                                                {t(`operations.status_${lote.status}`, lote.status)}
                                                            </span>
                                                        </td>
                                                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(lote.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {lote.finished_at ? new Date(lote.finished_at).toLocaleDateString() : '-'}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                        {t('operations.no_results_history', 'No se encontraron lotes')}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Pagination */}
                            <div className="mt-4">
                                <Pagination links={lotes.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
