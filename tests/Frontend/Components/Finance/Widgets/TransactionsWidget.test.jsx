import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TransactionsWidget from '@/Components/Finance/Widgets/TransactionsWidget';

// Mock dependencies
vi.mock('@/Hooks/useTranslate', () => ({
    useTranslate: () => ({ t: (key, defaultVal) => defaultVal }),
}));

vi.mock('@/Utils/currencyHelpers', () => ({
    formatCurrency: (val) => `$${val}`,
}));

vi.mock('@/Components/Finance/Modals/QuickTransactionModal', () => ({
    default: ({ show, onClose }) => show ? (
        <div role="dialog">
            Mock QuickTransactionModal
            <button onClick={onClose}>Close</button>
        </div>
    ) : null,
}));

describe('TransactionsWidget', () => {
    const mockProps = {
        transactions: [
            { id: 1, descripcion: 'Test Transaction', monto: 10000, fecha: '2023-01-01', categoria: { nombre: 'Test', tipo: 'expense' }, cuenta: { nombre: 'Test Account' } }
        ],
        accounts: [{ id: 1, nombre: 'Test Account' }],
        categories: [{ id: 1, nombre: 'Test Category' }],
        currency: 'COP',
        onEdit: vi.fn(),
        onDelete: vi.fn(),
        currentUserId: 1,
    };

    it('renders correctly', () => {
        render(<TransactionsWidget {...mockProps} />);
        expect(screen.getByText('Transacciones Recientes')).toBeInTheDocument();
        expect(screen.getByText('Test Transaction')).toBeInTheDocument();
    });



    it('filters transactions', () => {
        render(<TransactionsWidget {...mockProps} />);

        const filterBtn = screen.getByTitle('Filtrar');
        fireEvent.click(filterBtn);

        expect(screen.getByText('Filtrar por Cuenta')).toBeInTheDocument();
    });
});
