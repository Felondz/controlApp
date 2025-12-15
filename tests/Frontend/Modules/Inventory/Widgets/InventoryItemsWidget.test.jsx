import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InventoryItemsWidget from '@/Modules/Inventory/Widgets/InventoryItemsWidget';
import { router } from '@inertiajs/react';
import { vi } from 'vitest';

// Mocks
vi.mock('@/Hooks/useTranslate', () => ({
    useTranslate: () => ({
        t: (key, defaultVal) => defaultVal || key,
    }),
}));

vi.mock('@inertiajs/react', () => ({
    router: {
        get: vi.fn(),
    },
}));

vi.mock('@/Components/Icons', () => ({
    PackageIcon: () => <div data-testid="icon-package" />,
    ExclamationTriangleIcon: () => <div data-testid="icon-alert" />,
    PlusIcon: () => <div data-testid="icon-plus" />,
    SearchIcon: () => <div data-testid="icon-search" />,
    FunnelIcon: () => <div data-testid="icon-funnel" />,
}));

vi.mock('@/Components/SearchInput', () => ({
    default: ({ value, onChange, placeholder }) => (
        <input
            data-testid="search-input"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    ),
}));

vi.mock('@/Components/SelectInput', () => ({
    default: ({ value, onChange, options }) => (
        <select data-testid="select-input" value={value} onChange={onChange}>
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    ),
}));

vi.mock('@/Modules/Core/Widgets/WidgetCard', () => ({
    default: ({ children, title, action }) => (
        <div data-testid="widget-card">
            <h1>{title}</h1>
            <div data-testid="widget-action">{action}</div>
            {children}
        </div>
    ),
}));

vi.mock('lodash/debounce', () => ({
    default: (fn) => {
        fn.cancel = vi.fn();
        return fn;
    },
}));

describe('InventoryItemsWidget', () => {
    const mockProject = { id: 1 };
    const mockWidget = { id: 'inventory_items' };
    const mockItems = {
        data: [
            { id: 1, name: 'Item 1', sku: 'SKU-001', type: 'raw_material', current_stock: 10, unit: 'kg', cost_price: 100 },
            { id: 2, name: 'Item 2', sku: 'SKU-002', type: 'finished_good', current_stock: 2, min_stock_level: 5, unit: 'pcs', is_low_stock: true },
        ]
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Mock route() global helper
        global.route = vi.fn((name) => name ? `http://localhost/${name}` : 'http://localhost/current');
        global.route.current = vi.fn(() => 'current.route');
    });

    it('renders list of items', () => {
        render(
            <InventoryItemsWidget
                project={mockProject}
                items={mockItems}
                widget={mockWidget}
            />
        );

        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('SKU-001')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();

        // Assert low stock indicator
        expect(screen.getByText('inventory.low_stock')).toBeInTheDocument();
    });

    it('renders empty state', () => {
        render(
            <InventoryItemsWidget
                project={mockProject}
                items={{ data: [] }}
                widget={mockWidget}
            />
        );

        expect(screen.getByText('No se encontraron items')).toBeInTheDocument();
    });

    it('handles search input change', async () => {
        render(
            <InventoryItemsWidget
                project={mockProject}
                items={mockItems}
                widget={mockWidget}
            />
        );

        const searchInput = screen.getByTestId('search-input');
        fireEvent.change(searchInput, { target: { value: 'test' } });

        await waitFor(() => {
            expect(router.get).toHaveBeenCalledWith(
                expect.stringContaining('current.route'),
                expect.objectContaining({ search: 'test' }),
                expect.any(Object)
            );
        });
    });

    it('handles type filter change', async () => {
        render(
            <InventoryItemsWidget
                project={mockProject}
                items={mockItems}
                widget={mockWidget}
            />
        );

        const selects = screen.getAllByTestId('select-input');
        const typeSelect = selects[0]; // First select is Type

        fireEvent.change(typeSelect, { target: { value: 'raw_material' } });

        await waitFor(() => {
            expect(router.get).toHaveBeenCalledWith(
                expect.stringContaining('current.route'),
                expect.objectContaining({ type: 'raw_material' }),
                expect.any(Object)
            );
        });
    });

    it('calls onEdit when edit button is clicked', () => {
        const onEditMock = vi.fn();
        render(
            <InventoryItemsWidget
                project={mockProject}
                items={mockItems}
                widget={mockWidget}
                onEdit={onEditMock}
            />
        );

        const editButtons = screen.getAllByText('Editar');
        fireEvent.click(editButtons[0]);

        expect(onEditMock).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
    });

    it('calls onAdd when add button is clicked', () => {
        const onAddMock = vi.fn();
        render(
            <InventoryItemsWidget
                project={mockProject}
                items={mockItems}
                widget={mockWidget}
                onAdd={onAddMock}
            />
        );

        const addButton = screen.getByText('Nuevo Item');
        // The button text is inside a span, click the parent button
        fireEvent.click(addButton.closest('button'));

        expect(onAddMock).toHaveBeenCalledTimes(1);
    });
});
