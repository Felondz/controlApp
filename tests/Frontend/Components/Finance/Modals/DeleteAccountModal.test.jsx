import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DeleteAccountModal from '@/Components/Finance/Modals/DeleteAccountModal';

// Mock dependencies
vi.mock('@/Hooks/useTranslate', () => ({
    useTranslate: () => ({
        t: (key, defaultVal, params) => {
            let result = defaultVal;
            if (params) {
                Object.keys(params).forEach(param => {
                    result = result.replace(`:${param}`, params[param]);
                });
            }
            return result;
        }
    }),
}));

vi.mock('@inertiajs/react', () => ({
    router: {
        reload: vi.fn(),
    },
}));

vi.mock('axios', () => ({
    default: {
        delete: vi.fn(),
    },
}));

// Mock Modal component
vi.mock('@/Components/Modal', () => ({
    default: ({ show, children, onClose }) =>
        show ? <div data-testid="modal">{children}</div> : null,
}));

// Mock other components
vi.mock('@/Components/DangerButton', () => ({
    default: ({ children, disabled, ...props }) => (
        <button data-testid="danger-button" disabled={disabled} {...props}>{children}</button>
    ),
}));

vi.mock('@/Components/SecondaryButton', () => ({
    default: ({ children, onClick, disabled }) => (
        <button onClick={onClick} disabled={disabled}>{children}</button>
    ),
}));

vi.mock('@/Components/TextInput', () => ({
    default: ({ value, onChange, placeholder, disabled, ...props }) => (
        <input
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            data-testid="confirmation-input"
            {...props}
        />
    ),
}));

vi.mock('@/Components/InputLabel', () => ({
    default: () => null,
}));

vi.mock('@/Components/InputError', () => ({
    default: ({ message }) => message ? <span>{message}</span> : null,
}));

vi.mock('@/Components/Icons', () => ({
    ExclamationTriangleIcon: () => <svg data-testid="warning-icon" />,
}));

describe('DeleteAccountModal', () => {
    const mockOnClose = vi.fn();
    const mockOnSuccess = vi.fn();
    const mockProject = { id: 1, nombre: 'Test Project' };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('does not render when account is null', () => {
        render(
            <DeleteAccountModal
                show={true}
                onClose={mockOnClose}
                account={null}
                project={mockProject}
            />
        );

        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('does not render when project is null', () => {
        render(
            <DeleteAccountModal
                show={true}
                onClose={mockOnClose}
                account={{ id: 1, nombre: 'Test Account', saldo: 0 }}
                project={null}
            />
        );

        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('renders modal with account info when show is true', () => {
        const mockAccount = {
            id: 1,
            nombre: 'Test Account',
            saldo: 0,
            transacciones_count: 0
        };

        render(
            <DeleteAccountModal
                show={true}
                onClose={mockOnClose}
                account={mockAccount}
                project={mockProject}
            />
        );

        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByText('¿Eliminar Cuenta?')).toBeInTheDocument();
        expect(screen.getByText('Esta acción no se puede deshacer. La cuenta será eliminada permanentemente.')).toBeInTheDocument();
    });

    it('shows warning for accounts with transactions', () => {
        const mockAccount = {
            id: 1,
            nombre: 'Test Account',
            saldo: 0,
            transacciones_count: 5
        };

        render(
            <DeleteAccountModal
                show={true}
                onClose={mockOnClose}
                account={mockAccount}
                project={mockProject}
            />
        );

        expect(screen.getByText(/Esta cuenta tiene 5 transacciones asociadas/)).toBeInTheDocument();
    });

    it('shows error and disables input when account has non-zero balance', () => {
        const mockAccount = {
            id: 1,
            nombre: 'Test Account',
            saldo: 15000, // Non-zero balance
            transacciones_count: 0
        };

        render(
            <DeleteAccountModal
                show={true}
                onClose={mockOnClose}
                account={mockAccount}
                project={mockProject}
            />
        );

        expect(screen.getByText(/No se puede eliminar la cuenta porque tiene un saldo diferente de 0/)).toBeInTheDocument();
        expect(screen.getByTestId('confirmation-input')).toBeDisabled();
    });

    it('disables delete button until confirmation matches account name', () => {
        const mockAccount = {
            id: 1,
            nombre: 'Test Account',
            saldo: 0,
            transacciones_count: 0
        };

        render(
            <DeleteAccountModal
                show={true}
                onClose={mockOnClose}
                account={mockAccount}
                project={mockProject}
            />
        );

        const deleteButton = screen.getByTestId('danger-button');
        const confirmInput = screen.getByTestId('confirmation-input');

        // Initially disabled
        expect(deleteButton).toBeDisabled();

        // Type partial name - still disabled
        fireEvent.change(confirmInput, { target: { value: 'Test' } });
        expect(deleteButton).toBeDisabled();

        // Type full name - enabled
        fireEvent.change(confirmInput, { target: { value: 'Test Account' } });
        expect(deleteButton).not.toBeDisabled();
    });

    it('calls onClose when cancel button is clicked', () => {
        const mockAccount = {
            id: 1,
            nombre: 'Test Account',
            saldo: 0,
            transacciones_count: 0
        };

        render(
            <DeleteAccountModal
                show={true}
                onClose={mockOnClose}
                account={mockAccount}
                project={mockProject}
            />
        );

        const cancelButton = screen.getByText('Cancelar');
        fireEvent.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalled();
    });

    it('supports saldo_actual as fallback for saldo', () => {
        const mockAccount = {
            id: 1,
            nombre: 'Test Account',
            saldo_actual: 10000, // Uses saldo_actual instead of saldo
            transacciones_count: 0
        };

        render(
            <DeleteAccountModal
                show={true}
                onClose={mockOnClose}
                account={mockAccount}
                project={mockProject}
            />
        );

        // Should block deletion because of non-zero balance
        expect(screen.getByText(/No se puede eliminar la cuenta porque tiene un saldo diferente de 0/)).toBeInTheDocument();
        expect(screen.getByTestId('confirmation-input')).toBeDisabled();
    });
});
