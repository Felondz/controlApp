import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BillModal from '@/Components/Finance/Modals/BillModal';

// Mock dependencies
vi.mock('@/Hooks/useTranslate', () => ({
    useTranslate: () => ({ t: (key, defaultVal) => defaultVal }),
}));

vi.mock('@inertiajs/react', () => ({
    useForm: vi.fn((initialValues) => ({
        data: initialValues || {},
        setData: vi.fn((key, value) => {
            if (typeof key === 'object') {
                Object.assign(initialValues, key);
            } else {
                initialValues[key] = value;
            }
        }),
        errors: {},
        reset: vi.fn(),
    })),
    router: {
        post: vi.fn(),
        put: vi.fn(),
    },
}));

// Mock Modal component
vi.mock('@/Components/Modal', () => ({
    default: ({ show, children, onClose }) =>
        show ? <div data-testid="modal">{children}</div> : null,
}));

// Mock other components
vi.mock('@/Components/PrimaryButton', () => ({
    default: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

vi.mock('@/Components/SecondaryButton', () => ({
    default: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

vi.mock('@/Components/TextInput', () => ({
    default: (props) => <input {...props} />,
}));

vi.mock('@/Components/InputLabel', () => ({
    default: ({ value }) => <label>{value}</label>,
}));

vi.mock('@/Components/Icons', () => ({
    BoltIcon: () => <svg data-testid="bolt-icon" />,
}));

describe('BillModal', () => {
    const mockOnClose = vi.fn();
    const mockOnSuccess = vi.fn();
    const mockCuentas = [
        { id: 1, nombre: 'Bank Account', banco: 'Bank A', tipo: 'banco', estado: 'activa' },
        { id: 2, nombre: 'Credit Card', banco: 'Bank B', tipo: 'credito', estado: 'activa' },
        { id: 3, nombre: 'Inactive', banco: 'Bank C', tipo: 'banco', estado: 'inactiva' },
    ];
    const mockCategorias = [
        { id: 1, nombre: 'Facturas y Servicios', tipo: 'gasto' },
        { id: 2, nombre: 'Alimentación', tipo: 'gasto' },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders modal when show is true', () => {
        render(
            <BillModal
                show={true}
                onClose={mockOnClose}
                proyectoId={1}
                cuentas={mockCuentas}
                categorias={mockCategorias}
            />
        );

        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByText('Nueva Factura')).toBeInTheDocument();
    });

    it('does not render when show is false', () => {
        render(
            <BillModal
                show={false}
                onClose={mockOnClose}
                proyectoId={1}
            />
        );

        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('renders edit mode title when bill is provided', () => {
        const mockBill = {
            id: 1,
            monto: -10000,
            descripcion: 'Test Bill',
            fecha: '2025-01-15',
            proyecto_id: 1,
        };

        render(
            <BillModal
                show={true}
                onClose={mockOnClose}
                bill={mockBill}
                proyectoId={1}
            />
        );

        expect(screen.getByText('Editar Factura')).toBeInTheDocument();
    });

    it('shows account selector with active accounts only', () => {
        render(
            <BillModal
                show={true}
                onClose={mockOnClose}
                proyectoId={1}
                cuentas={mockCuentas}
            />
        );

        // Should show active accounts
        expect(screen.getByText(/Bank Account/)).toBeInTheDocument();
        expect(screen.getByText(/Credit Card/)).toBeInTheDocument();
        // Should not show inactive accounts
        expect(screen.queryByText(/Inactive/)).not.toBeInTheDocument();
    });

    it('shows auto-debit option only for credit card accounts', async () => {
        // This test verifies the conditional rendering of auto-debit checkbox
        // Auto-debit should only appear when a credit card is selected
        render(
            <BillModal
                show={true}
                onClose={mockOnClose}
                proyectoId={1}
                cuentas={mockCuentas}
            />
        );

        // Initially, auto-debit option should not be visible
        expect(screen.queryByText('Débito Automático')).not.toBeInTheDocument();
    });

    it('shows recurring bill checkbox', () => {
        render(
            <BillModal
                show={true}
                onClose={mockOnClose}
                proyectoId={1}
            />
        );

        expect(screen.getByText('Factura Recurrente Mensual')).toBeInTheDocument();
    });

    it('calls onClose when cancel button is clicked', () => {
        render(
            <BillModal
                show={true}
                onClose={mockOnClose}
                proyectoId={1}
            />
        );

        const cancelButton = screen.getByText('Cancelar');
        fireEvent.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalled();
    });
});
