import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DraggableWidgetGrid from '@/Components/Dashboard/DraggableWidgetGrid';
import { useTranslate } from '@/Hooks/useTranslate';

// Mock dependencies
vi.mock('@/Hooks/useTranslate', () => ({
    useTranslate: () => ({
        t: (key, defaultValOrOptions, options) => {
            if (typeof defaultValOrOptions === 'string') return defaultValOrOptions;
            return key;
        }
    }),
}));

vi.mock('@inertiajs/react', () => ({
    router: { put: vi.fn() },
    Link: ({ children }) => <a>{children}</a>,
}));

vi.mock('@hello-pangea/dnd', () => ({
    DragDropContext: ({ children }) => <div>{children}</div>,
    Droppable: ({ children }) => children({ droppableProps: {}, innerRef: null, placeholder: null }, {}),
    Draggable: ({ children }) => children({ draggableProps: {}, dragHandleProps: {}, innerRef: null }, { isDragging: false }),
}));

// Mock widget components to avoid rendering full children
vi.mock('@/Components/Dashboard/Widgets/FinanceSummaryWidget', () => ({ default: () => <div data-testid="finance-widget">Finance Widget</div> }));
vi.mock('@/Components/Dashboard/Widgets/TasksSummaryWidget', () => ({ default: () => <div data-testid="tasks-widget">Tasks Widget</div> }));

// Mock widget registry
vi.mock('@/Utils/widgetRegistry', () => ({
    getAvailableWidgets: vi.fn(),
    getOrderedWidgets: vi.fn(),
    WIDGET_DEFINITIONS: {}
}));
import { getAvailableWidgets, getOrderedWidgets } from '@/Utils/widgetRegistry';

describe('DraggableWidgetGrid', () => {
    const mockProject = {
        id: 1,
        modules: ['finance', 'tasks'],
        settings: {
            dashboard: {
                layout: ['finance_balance', 'tasks_summary'],
                hidden: []
            }
        }
    };

    it('renders widgets based on project modules', () => {
        getAvailableWidgets.mockReturnValue([
            { id: 'finance_balance' },
            { id: 'tasks_summary' }
        ]);
        getOrderedWidgets.mockReturnValue([
            { id: 'finance_balance' },
            { id: 'tasks_summary' }
        ]);

        render(<DraggableWidgetGrid project={mockProject} isAdmin={true} />);

        expect(screen.getByTestId('finance-widget')).toBeInTheDocument();
        expect(screen.getByTestId('tasks-widget')).toBeInTheDocument();
    });

    it('hides finance widgets for non-admins', () => {
        getAvailableWidgets.mockReturnValue([
            { id: 'tasks_summary' }
        ]);
        getOrderedWidgets.mockReturnValue([
            { id: 'tasks_summary' }
        ]);

        render(<DraggableWidgetGrid project={mockProject} isAdmin={false} />);

        expect(screen.queryByTestId('finance-widget')).not.toBeInTheDocument();
        expect(screen.getByTestId('tasks-widget')).toBeInTheDocument();
    });

    it('shows empty state when no widgets are visible', () => {
        getAvailableWidgets.mockReturnValue([]);
        getOrderedWidgets.mockReturnValue([]);

        render(<DraggableWidgetGrid project={{ ...mockProject, modules: [] }} isAdmin={false} />);

        expect(screen.getByText(/No hay widgets visibles/i)).toBeInTheDocument();
    });
});
