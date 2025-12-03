import { render, screen } from '@testing-library/react';
import AccountChart from '@/Components/Finance/AccountChart';

describe('AccountChart', () => {
    const mockAccountActive = {
        id: 1,
        nombre: 'Active Account',
        banco: 'Test Bank',
        saldo_actual: 100000, // $1,000.00
        estado: 'activa'
    };

    const mockAccountInactive = {
        id: 2,
        nombre: 'Inactive Account',
        banco: 'Old Bank',
        saldo_actual: 0,
        estado: 'inactiva'
    };

    const mockTransactions = [];

    it('renders active account correctly', () => {
        render(<AccountChart cuenta={mockAccountActive} transacciones={mockTransactions} />);

        expect(screen.getByText('Active Account')).toBeInTheDocument();
        expect(screen.queryByText('finance.inactive')).not.toBeInTheDocument();
    });

    it('renders inactive account with badge', () => {
        render(<AccountChart cuenta={mockAccountInactive} transacciones={mockTransactions} />);

        expect(screen.getByText('Inactive Account')).toBeInTheDocument();
        expect(screen.getByText('finance.inactive')).toBeInTheDocument();
    });

    it('applies opacity class to inactive account container', () => {
        const { container } = render(<AccountChart cuenta={mockAccountInactive} transacciones={mockTransactions} />);

        // Check for opacity class in the first div
        const accountCard = container.firstChild;
        expect(accountCard).toHaveClass('opacity-75');
    });
});
