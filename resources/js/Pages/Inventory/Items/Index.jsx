import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import SearchInput from "@/Components/SearchInput";
import { PlusIcon, SearchIcon, PackageIcon, ExclamationTriangleIcon, Cog6ToothIcon } from '@/Components/Icons';
import { useTranslate } from '@/Hooks/useTranslate';
import { DraggableWidgetGrid, WidgetSettingsModal } from '@/Modules/Core/Widgets';
import { useOnboarding } from '@/Hooks/useOnboarding';
import ItemModal from './ItemModal';

export default function InventoryIndex({ auth, proyecto, items, filters, inventoryStats, lowStockItems }) {
    const { t } = useTranslate();
    useOnboarding('inventory');
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
        filters,
        stats: inventoryStats, // Map to 'stats' prop expected by InventorySummaryWidget
        lowStockItems,         // Pass specific collection for LowStockWidget
        onAdd: handleAddItem,
        onEdit: handleEditItem,
    };

    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const handleSettingsSave = (newSettings) => {
        router.put(
            route('finance.projects.update-settings', { proyecto: proyecto.uuid }),
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
            project={proyecto}
            header={
                <h2 className="font-semibold text-xl text-primary-600 dark:text-primary-400 leading-tight">
                    {t('inventory.title')}
                </h2>
            }
        >
            <Head title={t('modules.inventory') || 'Inventario'} />

            <div className="py-12">
                <div className="max-w-[1920px] mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Header Actions - Search moved to Widget */}
                    <div className="flex justify-end items-center gap-4 mb-6">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowSettingsModal(true)}
                                className="p-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                title={t('dashboard.customize', 'Personalizar')}
                            >
                                <Cog6ToothIcon className="w-6 h-6" />
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
