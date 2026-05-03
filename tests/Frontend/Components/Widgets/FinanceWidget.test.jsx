import { render, screen, waitFor } from '@testing-library/react';
import FinanceWidget from '@/Modules/Finance/Widgets/FinanceWidget';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');

describe('FinanceWidget', () => {
    const mockProject = {
        id: 1,
        uuid: 'project-uuid-1',
        moneda_default: 'USD'
    };

    beforeEach(() => {
        vi.clearAllMocks();
        axios.get.mockResolvedValue({ data: { balance: 1500 } });
    });

    it('renders balance title', async () => {
        render(<FinanceWidget project={mockProject} />);

        await waitFor(() => {
            expect(screen.getByText('finance.current_balance')).toBeInTheDocument();
        });
    });

    it('renders formatted balance', async () => {
        render(<FinanceWidget project={mockProject} />);

        await waitFor(() => {
            // Matches $15.00 format
            const balanceElement = screen.getByText('$15.00');
            expect(balanceElement).toBeInTheDocument();
        });
    });

    it('uses project currency', async () => {
        const eurProject = { id: 2, uuid: 'project-uuid-2', moneda_default: 'EUR' };
        render(<FinanceWidget project={eurProject} />);

        await waitFor(() => {
            // Check for specific currency elements to avoid ambiguity
            const balanceText = screen.getByText('€15,00');
            expect(balanceText).toBeInTheDocument();
            const currencyBadge = screen.getByText('EUR');
            expect(currencyBadge).toBeInTheDocument();
        });
    });
});
