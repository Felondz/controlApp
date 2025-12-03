import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LinkAccountModal from '@/Components/Finance/Modals/LinkAccountModal';
import { vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');
vi.mock('@inertiajs/react', () => ({
    router: {
        reload: vi.fn(),
    },
}));

global.route = vi.fn((name, params) => {
    if (name === 'api.proyectos.cuentas.available') return `/api/proyectos/${params}/cuentas/available`;
    if (name === 'api.proyectos.cuentas.link') return `/api/proyectos/${params}/cuentas/link`;
    return '/';
});

describe('LinkAccountModal', () => {
    const mockOnClose = vi.fn();
    const mockProject = { id: 1, nombre: 'Test Project' };
    const mockAccounts = [
        { id: 101, nombre: 'Personal Bank', banco: 'Bank A' },
        { id: 102, nombre: 'Personal Cash', tipo: 'efectivo' },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        axios.get.mockResolvedValue({ data: mockAccounts });
    });

    it('fetches and displays available accounts when opened', async () => {
        render(<LinkAccountModal show={true} onClose={mockOnClose} project={mockProject} />);

        expect(axios.get).toHaveBeenCalledWith(`/api/proyectos/${mockProject.id}/cuentas/available`);

        await waitFor(() => {
            expect(screen.getByText('Personal Bank (Bank A)')).toBeInTheDocument();
        });
    });

    it('calls link API when form is submitted', async () => {
        axios.post.mockResolvedValue({});

        render(<LinkAccountModal show={true} onClose={mockOnClose} project={mockProject} />);

        await waitFor(() => {
            expect(screen.getByLabelText('finance.select_account')).toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText('finance.select_account'), { target: { value: '101' } });
        fireEvent.click(screen.getByText('common.link'));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(`/api/proyectos/${mockProject.id}/cuentas/link`, {
                cuenta_id: '101'
            });
        });
    });
});
