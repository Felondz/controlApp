import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import SearchInput from "@/Components/SearchInput";
import { PlusIcon, SearchIcon, PackageIcon, ExclamationTriangleIcon, Cog6ToothIcon } from '@/Components/Icons';
import { useTranslate } from '@/Hooks/useTranslate';
import DraggableWidgetGrid from '@/Components/Dashboard/DraggableWidgetGrid';
import WidgetSettingsModal from '@/Components/Dashboard/WidgetSettingsModal';
import ItemModal from './ItemModal';

export default function InventoryIndex({ auth, proyecto, items, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const { t } = useTranslate();
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const handleAddItem = () => {
        setEditingItem(null);
        setIsItemModalOpen(true);
    };

    const handleEditItem = (item) => {
        setEditingItem(item);
        setIsItemModalOpen(true);
    };

    // Helper for badges style
    const getTypeBadgeStyle = (type) => {
        return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200";
    };

    const dashboardData = {
        items,
        onAdd: handleAddItem,
        onEdit: handleEditItem,
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
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{t('inventory.title')}</h2>}
        >
            <Head title={t('modules.inventory') || 'Inventario'} />

            <div className="py-12">
                <div className="max-w-[1920px] mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Header Actions */}
                    <div className="flex justify-between items-center gap-4 mb-6">
                        <div className="relative w-full max-w-sm">
                            <SearchInput
                                placeholder={t('inventory.search_placeholder')}
                                className="w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
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
                        </div>
                    </div>

                    <DraggableWidgetGrid
                        project={proyecto}
                        dashboardData={dashboardData}
                        settingsKey="inventory_dashboard"
                        allowedModules={['inventory']}
                        defaultLayout={['inventory_items_table']}
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
                allowedModules={['inventory']}
                settingsKey="inventory_dashboard"
            />

            <ItemModal
                show={isItemModalOpen}
                onClose={() => setIsItemModalOpen(false)}
                project={proyecto}
                item={editingItem}
            />
        </AuthenticatedLayout>
    );
}
