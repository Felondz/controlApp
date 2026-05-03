import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import History from '@/Pages/Operations/Lotes/History';
import { router } from '@inertiajs/react';

// Mock the Layout to simplify testing (avoiding complex layout dependencies)
vi.mock('@/Layouts/AuthenticatedLayout', () => ({
    default: ({ children, header }) => (
        <div data-testid="auth-layout">
            <div data-testid="header">{header}</div>
            {children}
        </div>
    ),
}));

// Mock Pagination to simplify
vi.mock('@/Components/Pagination', () => ({
    default: ({ links }) => <div data-testid="pagination">Pagination</div>,
}));

describe('History Page', () => {
    const mockAuth = { user: { id: 1, name: 'Test User' } };
    const mockProyecto = { id: 10, uuid: 'project-uuid-10', name: 'Test Project' };
    const mockLotes = {
        data: [
            {
                id: 1,
                code: 'LOTE-001',
                status: 'finished',
                created_at: '2025-01-01',
                finished_at: '2025-01-02',
                production_process: { name: 'Process A' },
                stage: { name: 'Stage 1' },
            },
            {
                id: 2,
                code: 'LOTE-002',
                status: 'active',
                created_at: '2025-01-03',
                finished_at: null,
                production_process: { name: 'Process B' },
                stage: { name: 'Stage 2' },
            },
        ],
        links: [],
    };
    const mockFilters = { search: '', status: '' };

    it('renders the history page with correct title and table headers', () => {
        render(
            <History
                auth={mockAuth}
                proyecto={mockProyecto}
                lotes={mockLotes}
                filters={mockFilters}
            />
        );

        // Check Header (Layout mock)
        expect(screen.getByText('operations.history_title')).toBeInTheDocument();

        // Check Table Headers
        expect(screen.getByText('operations.col_code')).toBeInTheDocument();
        expect(screen.getByText('operations.col_process')).toBeInTheDocument();
        expect(screen.getByText('operations.col_status')).toBeInTheDocument();
    });

    it('renders the list of lotes', () => {
        render(
            <History
                auth={mockAuth}
                proyecto={mockProyecto}
                lotes={mockLotes}
                filters={mockFilters}
            />
        );

        expect(screen.getByText('LOTE-001')).toBeInTheDocument();
        expect(screen.getByText('LOTE-002')).toBeInTheDocument();
        expect(screen.getByText('Process A')).toBeInTheDocument();
        expect(screen.getAllByText('operations.status_finished').length).toBeGreaterThan(0);
    });

    it('updates filters and calls router.get on search input', async () => {
        render(
            <History
                auth={mockAuth}
                proyecto={mockProyecto}
                lotes={mockLotes}
                filters={mockFilters}
            />
        );

        const searchInput = screen.getByPlaceholderText('operations.search_history_placeholder');

        // Simular escritura
        fireEvent.change(searchInput, { target: { value: 'SEARCH-TERM' } });

        // Wait for debounce (300ms in component)
        await waitFor(() => {
            const lastCall = router.get.mock.lastCall;
            expect(lastCall[0].toString()).toBe('/operations.lotes.history/project-uuid-10');
            expect(lastCall[1]).toEqual(expect.objectContaining({ search: 'SEARCH-TERM', status: '' }));
            expect(lastCall[2]).toEqual(expect.objectContaining({ preserveState: true, replace: true }));
        }, { timeout: 1000 });
    });

    it('updates filters and calls router.get on status change', () => {
        render(
            <History
                auth={mockAuth}
                proyecto={mockProyecto}
                lotes={mockLotes}
                filters={mockFilters}
            />
        );

        const statusSelect = screen.getByRole('combobox'); // SelectInput renders a select

        fireEvent.change(statusSelect, { target: { value: 'finished' } });

        const lastCall = router.get.mock.lastCall;
        expect(lastCall[0].toString()).toBe('/operations.lotes.history/project-uuid-10');
        expect(lastCall[1]).toEqual(expect.objectContaining({ search: '', status: 'finished' }));
        expect(lastCall[2]).toEqual(expect.objectContaining({ preserveState: true, replace: true }));
    });

    it('shows empty state message when no lotes found', () => {
        const emptyLotes = { ...mockLotes, data: [] };
        render(
            <History
                auth={mockAuth}
                proyecto={mockProyecto}
                lotes={emptyLotes}
                filters={mockFilters}
            />
        );

        expect(screen.getByText('operations.no_results_history')).toBeInTheDocument();
    });
});
