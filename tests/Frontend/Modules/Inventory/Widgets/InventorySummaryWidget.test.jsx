import { render, screen } from '@testing-library/react';
import InventorySummaryWidget from '@/Modules/Inventory/Widgets/InventorySummaryWidget';
import { vi } from 'vitest';

// Mocks
vi.mock('@/Hooks/useTranslate', () => ({
    useTranslate: () => ({
        t: (key, defaultVal) => defaultVal || key,
    }),
}));

vi.mock('@/Components/Icons', () => ({
    PackageIcon: () => <div data-testid="icon-package" />,
    CurrencyDollarIcon: () => <div data-testid="icon-currency" />,
    ExclamationTriangleIcon: () => <div data-testid="icon-alert" />,
    CheckCircleIcon: () => <div data-testid="icon-check" />,
}));

vi.mock('@/Modules/Core/Widgets/WidgetCard', () => ({
    default: ({ children, title }) => (
        <div data-testid="widget-card">
            <h1>{title}</h1>
            {children}
        </div>
    ),
}));

describe('InventorySummaryWidget', () => {
    const mockProject = { id: 1 };
    const mockWidget = { id: 'inventory_summary' };

    const mockItems = {
        data: [
            { id: 1, name: 'Item 1', current_stock: 10, min_stock_level: 5, cost_price: 100, is_active: true },
            { id: 2, name: 'Item 2', current_stock: 2, min_stock_level: 5, cost_price: 50, is_active: true }, // Low stock
            { id: 3, name: 'Item 3', current_stock: 20, min_stock_level: 5, cost_price: 200, is_active: false }, // Inactive
        ]
    };

    it('renders correctly with empty data', () => {
        render(
            <InventorySummaryWidget
                project={mockProject}
                items={{ data: [] }}
                widget={mockWidget}
            />
        );

        expect(screen.getByText('Resumen de Inventario')).toBeInTheDocument();
        const zeroElements = screen.getAllByText('0');
        expect(zeroElements.length).toBeGreaterThanOrEqual(3); // Total items, Low Stock, Active
        expect(screen.getByText('$0')).toBeInTheDocument(); // Total value
    });

    it('calculates stats correctly', () => {
        render(
            <InventorySummaryWidget
                project={mockProject}
                items={mockItems}
                widget={mockWidget}
            />
        );

        // Total Items: 3
        expect(screen.getByText('3')).toBeInTheDocument();

        // Total Value: (10*100) + (2*50) + (20*200) = 1000 + 100 + 4000 = 5100
        expect(screen.getByText('$5.100')).toBeInTheDocument();

        // Low Stock: 1 (Item 2)
        expect(screen.getByText('1')).toBeInTheDocument();

        // Active Items: 2 (Item 1, Item 2)
        // Note: The widget renders "2" for active items, but "2" is ambiguous as it could appear elsewhere?
        // Let's rely on specific structure or just hope "2" is unique enough or check multiple occurrences.
        // Actually, since current_stock for Item 1 is 10, Item 2 is 2, Item 3 is 20.
        // There is a '2' in current_stock for Item 2, but the widget stats only display the aggregate values.
        // The stats displayed are: 3 (total), $5.100 (value), 1 (low stock), 2 (active).
        // Testing that "2" is present is valid.
        const twos = screen.getAllByText('2');
        expect(twos.length).toBeGreaterThan(0);
    });
});
