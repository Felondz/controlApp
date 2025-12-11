import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import PrimaryButton from "@/Components/PrimaryButton";
import SearchInput from "@/Components/SearchInput";
import { PlusIcon, SearchIcon, FactoryIcon, ClockIcon, Cog6ToothIcon } from '@/Components/Icons';
import { useTranslate } from '@/Hooks/useTranslate';
import DraggableWidgetGrid from '@/Components/Dashboard/DraggableWidgetGrid';
import WidgetSettingsModal from '@/Components/Dashboard/WidgetSettingsModal';


export default function LotesIndex({ auth, proyecto, lotes, processes, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedProcess, setSelectedProcess] = useState(filters.process_id || 'all');
    const { t } = useTranslate();

    const dashboardData = {
        lotes,
        filters
    };

    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const handleSettingsSave = (newSettings) => {
        router.put(
            route('finance.projects.update-settings', { project: proyecto.id }),
            { settings: newSettings },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowSettingsModal(false);
                },
                onError: (errors) => {
                    console.error('Error saving settings:', errors);
                }
            }
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{t('operations.title')}</h2>}
        >
            <Head title={t('modules.operations') || 'Operaciones'} />

            <div className="py-12">
                <div className="max-w-[1920px] mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Header Actions - Search Bar outside of widget for global context? Or Keep it simple */}
                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                        <div className="flex gap-2 items-center flex-1">
                            <div className="relative w-full max-w-sm">
                                <SearchInput
                                    placeholder={t('operations.search_placeholder')}
                                    className="w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm text-sm"
                                value={selectedProcess}
                                onChange={(e) => setSelectedProcess(e.target.value)}
                            >
                                <option value="all">{t('operations.all_processes')}</option>
                                {processes.map(proc => (
                                    <option key={proc.id} value={proc.id}>{proc.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowSettingsModal(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                title={t('dashboard.customize')}
                            >
                                <Cog6ToothIcon className="w-5 h-5" />
                                <span className="hidden sm:inline">{t('dashboard.customize', 'Personalizar')}</span>
                            </button>
                            <Link href={route('operations.lotes.create', proyecto.id)}>
                                <PrimaryButton>
                                    <PlusIcon className="mr-2 h-4 w-4" /> {t('operations.new_lote')}
                                </PrimaryButton>
                            </Link>
                        </div>
                    </div>

                    <DraggableWidgetGrid
                        project={proyecto}
                        dashboardData={dashboardData}
                        settingsKey="operations_dashboard"
                        allowedModules={['operations']}
                        defaultLayout={['operations_lotes_list']}
                        onSettingsClick={() => setShowSettingsModal(true)}
                    />
                </div>
            </div>

            <WidgetSettingsModal
                show={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}
                project={proyecto}
                isAdmin={true}
                onSave={handleSettingsSave}
                allowedModules={['operations']}
                settingsKey="operations_dashboard"
            />
        </AuthenticatedLayout>
    );
}
