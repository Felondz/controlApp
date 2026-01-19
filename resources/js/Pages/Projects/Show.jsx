// resources/js/Pages/Projects/Show.jsx

import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { Cog6ToothIcon } from '@/Components/Icons';
import { DraggableWidgetGrid } from '@/Modules/Core/Widgets';

import { WidgetSettingsModal } from '@/Modules/Core/Widgets';
import { DEFAULT_OVERVIEW_LAYOUT, OVERVIEW_HIDDEN_DEFAULTS } from '@/Utils/widgetRegistry';

/**
 * Project Dashboard - Professional widget-based dashboard with drag-and-drop
 * 
 * Features:
 * - Role-based widget visibility (Finance widgets only for admins)
 * - Drag and drop reordering
 * - Widget gallery for management
 * - Responsive design
 */
export default function Show({ auth, proyecto, isAdmin, transacciones = [], pendingBills = [], inventoryStats = null, lotes = null, inventoryItems = null }) {
    const { t } = useTranslate();
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    // Page title
    const headerTitle = `${proyecto.nombre} | ${t('dashboard.title')}`;

    // Handle settings save
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
            header={
                <div className="flex items-center justify-between w-full">
                    <h2 className="font-semibold text-xl text-primary-600 dark:text-primary-400 leading-tight">
                        {proyecto.nombre}
                    </h2>
                </div>
            }
            project={proyecto}
        >
            <Head title={headerTitle} />

            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h3 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                {t('projects.overview', 'Resumen del Proyecto')}
                            </h3>
                            {proyecto.descripcion && (
                                <p className="text-gray-600 dark:text-gray-400 mt-1 max-w-2xl">
                                    {proyecto.descripcion}
                                </p>
                            )}
                        </div>

                        {/* Settings Button */}
                        {/* Settings Button */}
                        <button
                            onClick={() => setShowSettingsModal(true)}
                            className="p-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            title={t('dashboard.customize', 'Personalizar Panel')}
                        >
                            <Cog6ToothIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Draggable Widget Grid */}
                <DraggableWidgetGrid
                    project={proyecto}
                    isAdmin={isAdmin}
                    dashboardData={{
                        accounts: [...(proyecto.cuentas || []), ...(proyecto.cuentas_asociadas || [])],
                        transactions: transacciones,
                        pendingBills: pendingBills,
                        categories: proyecto.categorias || [],
                        currency: proyecto.moneda_default,
                        stats: inventoryStats, // Map to 'stats' expected by InventorySummary
                        inventoryStats: inventoryStats, // Pass inventory stats for BalanceSummaryWidget
                        lotes: lotes,
                        items: inventoryItems, // Map to 'items' expected by LowStockWidget
                    }}
                    defaultLayout={DEFAULT_OVERVIEW_LAYOUT}
                    defaultHidden={OVERVIEW_HIDDEN_DEFAULTS}
                />
            </div>

            {/* Settings Modal */}
            <WidgetSettingsModal
                show={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}
                project={proyecto}
                isAdmin={isAdmin}
                onSave={handleSettingsSave}
            />
        </AuthenticatedLayout>
    );
}