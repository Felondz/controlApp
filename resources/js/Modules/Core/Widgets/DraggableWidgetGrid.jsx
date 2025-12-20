import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { router } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { getAvailableWidgets, getOrderedWidgets, WIDGET_DEFINITIONS } from '@/Utils/widgetRegistry';
import WidgetCard from './WidgetCard';

// Widget component imports - using absolute modular paths
import { BalanceSummaryWidget, SavingsGoalWidget, CreditSimulationWidget, UpcomingObligationsWidget, FinancialChartsWidget, AccountFlowWidget, TransactionsWidget, BillsWidget } from '@/Modules/Finance/Widgets';
import { TasksSummaryWidget, UserTasksWidget } from '@/Modules/Tasks/Widgets';
import { ChatRecentWidget } from '@/Modules/Chat/Widgets';
import { InventoryItemsWidget, InventorySummaryWidget, LowStockWidget } from '@/Modules/Inventory/Widgets';
import { LotesListWidget } from '@/Modules/Operations/Widgets';
import MembersSummaryWidget from './MembersSummaryWidget';
import ProjectInfoWidget from './ProjectInfoWidget';
import ProjectsListWidget from './ProjectsListWidget';

// Map widget IDs to their components
const WIDGET_COMPONENTS = {
    // Finance
    finance_balance_summary: BalanceSummaryWidget,
    finance_savings_goal: SavingsGoalWidget,
    finance_credit_simulation: CreditSimulationWidget,
    finance_upcoming_obligations: UpcomingObligationsWidget,
    finance_charts: FinancialChartsWidget,
    finance_account_flow: AccountFlowWidget,
    finance_transactions: TransactionsWidget,
    finance_bills: BillsWidget,

    // Operations
    operations_lotes_list: LotesListWidget,

    // Inventory
    inventory_summary: InventorySummaryWidget,
    inventory_low_stock: LowStockWidget,
    inventory_items_table: InventoryItemsWidget,

    // Other Modules
    tasks_summary: TasksSummaryWidget,
    tasks_users_load: UserTasksWidget,

    chat_recent: ChatRecentWidget,
    members_summary: MembersSummaryWidget,
    project_info: ProjectInfoWidget,
    projects_list: ProjectsListWidget,
};

/**
 * DraggableWidgetGrid - Main container for draggable dashboard widgets
 * 
 * Features:
 * - Drag and drop reordering
 * - Role-based widget filtering
 * - Module-based widget availability
 * - Layout persistence to project settings
 */
export default function DraggableWidgetGrid({
    // ... props ...
    user = null, // Optional user object for global settings
    project = null,
    dashboardData = {}, // New prop for finance data
    isAdmin = false,
    onSettingsClick,
    settingsKey = 'dashboard', // Default settings key in project.settings JSON
    defaultLayout = null, // Optional default layout override
    defaultHidden = [], // Optional default hidden widgets
    allowedModules = null // Optional array of module IDs to filter visible widgets
}) {
    const { t } = useTranslate();

    // Determine context (Project or User Global)
    const contextSettings = project ? project.settings : (user ? user.settings : {});
    const savedSettings = contextSettings?.[settingsKey] || {};

    const modules = project?.modules || [];
    const isPersonal = project?.es_personal || false;

    // If global dashboard (no project), assume specific modules aren't relevant OR pass allowedModules explicitly
    // For global dashboard, we might want to show everything available to user context

    // Get available widgets based on permissions
    let availableWidgets = getAvailableWidgets(modules, isAdmin, isPersonal, !!project);

    // Further filter available widgets by allowedModules if provided
    if (allowedModules) {
        availableWidgets = availableWidgets.filter(widget =>
            allowedModules.includes(WIDGET_DEFINITIONS[widget.id]?.module)
        );
    }

    // Get ordered widgets based on saved layout
    const [widgets, setWidgets] = useState(() =>
        getOrderedWidgets(
            savedSettings.layout || defaultLayout || [],
            savedSettings.hidden || defaultHidden || [],
            availableWidgets
        )
    );
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, []);

    // Update widgets when permissions change
    useEffect(() => {
        let currentAvailableWidgets = getAvailableWidgets(modules, isAdmin, isPersonal, !!project);
        if (allowedModules) {
            currentAvailableWidgets = currentAvailableWidgets.filter(widget =>
                allowedModules.includes(WIDGET_DEFINITIONS[widget.id]?.module)
            );
        }

        setWidgets(
            getOrderedWidgets(
                savedSettings.layout || defaultLayout || [],
                savedSettings.hidden || defaultHidden || [],
                currentAvailableWidgets
            )
        );
    }, [isAdmin, modules.map(m => m.id || m).join(','), isPersonal, (defaultLayout || []).join(','), (defaultHidden || []).join(','), (allowedModules || []).join(',')]);

    // Handle drag end
    const handleDragEnd = useCallback((result) => {
        if (!result.destination) return;

        const { source, destination } = result;
        if (source.index === destination.index) return;

        const newWidgets = Array.from(widgets);
        const [removed] = newWidgets.splice(source.index, 1);
        newWidgets.splice(destination.index, 0, removed);

        setWidgets(newWidgets);

        // Save new layout
        saveLayout(newWidgets.map(w => w.id), savedSettings.hidden || []);
    }, [widgets, savedSettings.hidden]);

    // Handle hide widget
    const handleHideWidget = useCallback((widgetId) => {
        const newHidden = [...(savedSettings.hidden || []), widgetId];
        const newWidgets = widgets.filter(w => w.id !== widgetId);
        setWidgets(newWidgets);
        saveLayout(newWidgets.map(w => w.id), newHidden);
    }, [widgets, savedSettings.hidden]);

    // Save layout to backend
    const saveLayout = useCallback((layout, hidden) => {
        const newSettings = {
            ...contextSettings,
            [settingsKey]: {
                ...savedSettings,
                layout,
                hidden,
            }
        };

        if (project) {
            // Save to Project Settings
            router.put(
                route('finance.projects.update-settings', { project: project.id }),
                { settings: newSettings },
                {
                    preserveScroll: true,
                    preserveState: true,
                    only: ['proyecto'],
                }
            );
        } else {
            // Save to User Preferences
            router.post(
                route('preferences.dashboard.update'),
                { settings: newSettings },
                {
                    preserveScroll: true,
                    preserveState: true,
                    only: ['auth'], // Update auth user prop
                }
            );
        }
    }, [project, user, contextSettings, savedSettings, settingsKey]);

    if (!enabled) {
        return null; // Or a loading skeleton
    }

    // Render widget content
    const renderWidgetContent = (widget, provided, snapshot) => {
        const WidgetComponent = WIDGET_COMPONENTS[widget.id];
        const commonProps = {
            project,
            widget,
            isDragging: snapshot.isDragging,
            dragHandleProps: provided.dragHandleProps,
            onHide: handleHideWidget,
        };

        if (!WidgetComponent) {
            return (
                <WidgetCard {...commonProps} title={t('dashboard.widget_not_found', 'Widget no disponible')}>
                    <div className="text-gray-400 text-sm text-center py-4">
                        {t('dashboard.widget_not_found', 'Widget no disponible')}
                    </div>
                </WidgetCard>
            );
        }

        // Pass dashboardData to all widgets
        const widgetProps = {
            ...commonProps,
            ...dashboardData,
            // Map specific props if needed, or rely on widgets picking what they need from dashboardData
            // Common props expected by finance widgets:
            accounts: dashboardData.accounts || [],
            transactions: dashboardData.transactions || [],
            pendingBills: dashboardData.pendingBills || [],
            creditCardBills: dashboardData.creditCardBills || [],
            bills: dashboardData.pendingBills || [], // Map for widgets expecting 'bills'
            financialTasks: dashboardData.financialTasks || [],
            categories: dashboardData.categories || [],
            currency: project?.moneda_default || 'COP',
            // Handlers
            onEdit: dashboardData.onEdit,
            onDelete: dashboardData.onDelete,
            onAdd: dashboardData.onAdd,
            onPay: dashboardData.onPay,
            onLinks: dashboardData.onLinks, // e.g., onMarkAsPaid

            // Operations & Inventory specific
            lotes: dashboardData.lotes || { data: [] }, // For LotesListWidget
            stats: dashboardData.stats || dashboardData.inventoryStats, // For InventorySummaryWidget
            items: dashboardData.items || dashboardData.inventoryItems || { data: [] }, // For InventoryItemsWidget & LowStockWidget
            lowStockItems: dashboardData.lowStockItems, // Explicit prop for LowStockWidget
        };

        if (WIDGET_COMPONENTS[widget.id]) {
            return <WidgetComponent {...widgetProps} />;
        }

        return <WidgetComponent {...commonProps} />;
    };

    // Empty state
    if (widgets.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                    {t('dashboard.no_widgets', 'No hay widgets visibles. Usa la configuración para agregar widgets.')}
                </p>
            </div>
        );
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="dashboard-widgets">
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`
                            grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6
                            ${snapshot.isDraggingOver ? 'bg-primary-50/30 dark:bg-primary-900/10 rounded-xl' : ''}
                            transition-colors duration-200
                        `}
                    >
                        {widgets.map((widget, index) => (
                            <Draggable key={widget.id} draggableId={widget.id} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        style={provided.draggableProps.style}
                                        className={
                                            widget.defaultSize === 'full' ? 'col-span-full' :
                                                (widget.defaultSize === 'large' ? 'col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4' :
                                                    (widget.defaultSize === 'medium' ? 'col-span-1 md:col-span-2' : 'col-span-1'))
                                        }
                                    >
                                        {renderWidgetContent(widget, provided, snapshot)}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
