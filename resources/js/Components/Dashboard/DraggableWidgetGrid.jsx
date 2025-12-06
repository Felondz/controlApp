import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { router } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { getAvailableWidgets, getOrderedWidgets, WIDGET_DEFINITIONS } from '@/Utils/widgetRegistry';
import WidgetCard from './WidgetCard';

// Widget component imports
import FinanceSummaryWidget from './Widgets/FinanceSummaryWidget';
import TasksSummaryWidget from './Widgets/TasksSummaryWidget';
import ChatRecentWidget from './Widgets/ChatRecentWidget';
import MembersSummaryWidget from './Widgets/MembersSummaryWidget';
import ProjectInfoWidget from './Widgets/ProjectInfoWidget';

// Map widget IDs to their components
const WIDGET_COMPONENTS = {
    finance_balance: FinanceSummaryWidget,
    finance_upcoming: FinanceSummaryWidget, // Will differentiate via props
    finance_transactions: FinanceSummaryWidget,
    tasks_summary: TasksSummaryWidget,
    tasks_overdue: TasksSummaryWidget,
    chat_recent: ChatRecentWidget,
    members_summary: MembersSummaryWidget,
    project_info: ProjectInfoWidget,
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
    project,
    isAdmin = false,
    onSettingsClick,
}) {
    const { t } = useTranslate();
    const modules = project?.modules || [];
    const isPersonal = project?.es_personal || false;
    const savedSettings = project?.settings?.dashboard || {};

    // Get available widgets based on permissions
    const availableWidgets = getAvailableWidgets(modules, isAdmin, isPersonal);

    // Get ordered widgets based on saved layout
    const [widgets, setWidgets] = useState(() =>
        getOrderedWidgets(
            savedSettings.layout || [],
            savedSettings.hidden || [],
            availableWidgets
        )
    );

    // Update widgets when permissions change
    useEffect(() => {
        setWidgets(
            getOrderedWidgets(
                savedSettings.layout || [],
                savedSettings.hidden || [],
                availableWidgets
            )
        );
    }, [isAdmin, modules.join(','), isPersonal]);

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
            ...project?.settings,
            dashboard: {
                ...savedSettings,
                layout,
                hidden,
            }
        };

        // Debounced save using Inertia
        router.put(
            route('finance.projects.update-settings', { project: project.id }),
            { settings: newSettings },
            {
                preserveScroll: true,
                preserveState: true,
                only: ['proyecto'],
            }
        );
    }, [project?.id, project?.settings, savedSettings]);

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

        switch (widget.id) {
            case 'finance_balance':
                return <WidgetComponent {...commonProps} variant="balance" />;
            case 'finance_upcoming':
                return <WidgetComponent {...commonProps} variant="upcoming" />;
            case 'finance_transactions':
                return <WidgetComponent {...commonProps} variant="transactions" />;
            case 'tasks_summary':
                return <WidgetComponent {...commonProps} variant="summary" />;
            case 'tasks_overdue':
                return <WidgetComponent {...commonProps} variant="overdue" />;
            case 'analytics_overview':
                return <WidgetComponent {...commonProps} />;
            default:
                return <WidgetComponent {...commonProps} />;
        }
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
                                        className={widget.defaultSize === 'large' ? 'col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4' : (widget.defaultSize === 'medium' ? 'col-span-1 md:col-span-2' : 'col-span-1')}
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
