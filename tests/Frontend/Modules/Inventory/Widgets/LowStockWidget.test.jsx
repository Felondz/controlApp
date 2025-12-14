import { render, screen, fireEvent } from '@testing-library/react';
import LowStockWidget from '@/Modules/Inventory/Widgets/LowStockWidget';
import { vi } from 'vitest';

// Mocks
vi.mock('@/Hooks/useTranslate', () => ({
    useTranslate: () => ({
        t: (key, defaultVal) => defaultVal || key,
    }),
}));

vi.mock('@/Components/Icons', () => ({
    ExclamationTriangleIcon: () => <div data-testid="icon-alert" />,
    PackageIcon: () => <div data-testid="icon-package" />,
}));

vi.mock('@/Modules/Core/Widgets/WidgetCard', () => ({
    default: ({ children, title }) => (
        <div data-testid="widget-card">
            <h1>{title}</h1>
            {children}
        </div>
    ),
}));

describe('LowStockWidget', () => {
    const mockProject = { id: 1 };
    const mockWidget = { id: 'low_stock' };

    const mockItems = {
        data: [
            { id: 1, name: 'Normal Item', current_stock: 20, min_stock_level: 5, unit: 'kg' },
            { id: 2, name: 'Low Stock Item', current_stock: 3, min_stock_level: 5, unit: 'L', sku: 'SKU-002' },
        ]
    };

    it('renders empty state when no low stock items', () => {
        const noLowStockItems = {
            data: [
                { id: 1, name: 'Normal Item', current_stock: 20, min_stock_level: 5, unit: 'kg' },
            ]
        };

        render(
            <LowStockWidget
                project={mockProject}
                items={noLowStockItems}
                widget={mockWidget}
            />
        );

        expect(screen.getByText('Alertas de Stock Bajo')).toBeInTheDocument();
        expect(screen.getByText('Todo el inventario está en niveles aceptables')).toBeInTheDocument();
    });

    it('renders low stock items correctly', () => {
        render(
            <LowStockWidget
                project={mockProject}
                items={mockItems}
                widget={mockWidget}
            />
        );

        expect(screen.queryByText('Todo el inventario está en niveles aceptables')).not.toBeInTheDocument();
        expect(screen.getByText('Low Stock Item')).toBeInTheDocument();
        expect(screen.getByText('SKU-002')).toBeInTheDocument();
        expect(screen.getByText('3 L')).toBeInTheDocument();

        // Ensure normal item is NOT rendered
        expect(screen.queryByText('Normal Item')).not.toBeInTheDocument();
    });

    it('calls onEdit when item is clicked', () => {
        const onEditMock = vi.fn();
        render(
            <LowStockWidget
                project={mockProject}
                items={mockItems}
                widget={mockWidget}
                onEdit={onEditMock}
            />
        );

        const item = screen.getByText('Low Stock Item');
        fireEvent.click(item);

        expect(onEditMock).toHaveBeenCalledTimes(1);
        expect(onEditMock).toHaveBeenCalledWith(expect.objectContaining({ id: 2 }));
    });
});
