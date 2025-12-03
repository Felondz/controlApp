import { render, screen, waitFor } from '@testing-library/react';
import FinanceWidget from '@/Components/Widgets/FinanceWidget';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');

describe('FinanceWidget', () => {
    const mockProject = {
        id: 1,
        moneda_default: 'USD'
    };

    beforeEach(() => {
        vi.clearAllMocks();
        axios.get.mockResolvedValue({ data: { balance: 1500 } });
    });

    it('renders balance title', async () => {
        render(<FinanceWidget project={mockProject} />);

        await waitFor(() => {
            expect(screen.getByText('finance.balance')).toBeInTheDocument();
        });
    });

    it('renders formatted balance', async () => {
        render(<FinanceWidget project={mockProject} />);

        await waitFor(() => {
            const balanceElement = screen.getByText(/1\.?500/); // Matches 1.500 or 1500
            expect(balanceElement).toBeInTheDocument();
        });
    });

    it('uses project currency', async () => {
        const eurProject = { id: 2, moneda_default: 'EUR' };
        render(<FinanceWidget project={eurProject} />);

        await waitFor(() => {
            const balanceElement = screen.getByText(/EUR|€/);
            expect(balanceElement).toBeInTheDocument();
        });
    });
});
