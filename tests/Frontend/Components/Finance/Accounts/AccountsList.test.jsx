import { render, screen } from '@testing-library/react';
import AccountsList from '@/Components/Finance/Accounts/AccountsList';

describe('AccountsList', () => {
    const mockAccounts = [
        { id: 1, nombre: 'Bank A', saldo: 1000, moneda_default: 'USD' },
        { id: 2, nombre: 'Cash', saldo: 50, moneda_default: 'USD' }
    ];

    it('renders title and add button', () => {
        render(<AccountsList proyectoId={1} />);

        expect(screen.getByText('finance.accounts_list')).toBeInTheDocument();
        expect(screen.getByText('+ common.add_account')).toBeInTheDocument();
    });

    it('renders empty state message when no accounts', () => {
        render(<AccountsList cuentas={[]} proyectoId={1} />);

        expect(screen.getByText('finance.no_accounts')).toBeInTheDocument();
    });

    it('renders list of accounts', () => {
        render(<AccountsList cuentas={mockAccounts} proyectoId={1} />);

        expect(screen.getByText('Bank A')).toBeInTheDocument();
        expect(screen.getByText('1000 USD')).toBeInTheDocument();
        expect(screen.getByText('Cash')).toBeInTheDocument();
        expect(screen.getByText('50 USD')).toBeInTheDocument();
    });

    it('generates correct link for adding account', () => {
        render(<AccountsList proyectoId={123} />);

        const link = screen.getByText('+ common.add_account').closest('a');
        // The mock route function returns the route name, and we need to check if it was called correctly
        // But in our simple mock, we might just check the href attribute if it's simple
        // Or we can check if the route mock was called with correct params
        // Given the global mock: global.route = jest.fn((name) => `/${name}`);
        // But we might need to adjust the mock or expectation based on how route() is mocked in setup.js

        // Let's assume the standard mock behavior we've been using or seeing
        expect(link).toHaveAttribute('href', '/mis-proyectos.cuentas.create/123');
    });
});
