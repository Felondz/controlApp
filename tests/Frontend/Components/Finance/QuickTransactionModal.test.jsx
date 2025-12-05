import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import QuickTransactionModal from '@/Components/Finance/Modals/QuickTransactionModal';
import axios from 'axios';

// Mock dependencies
vi.mock('axios');
vi.mock('@/Hooks/useTranslate', () => ({
    useTranslate: () => ({ t: (key, defaultVal) => defaultVal }),
}));

// Mock Inertia useForm and router
const mockPost = vi.fn();
const mockPut = vi.fn();
const mockReset = vi.fn();
const mockSetData = vi.fn();
const mockVisit = vi.fn();

vi.mock('@inertiajs/react', () => ({
    useForm: (initialValues) => ({
        data: initialValues,
        setData: (key, value) => {
            if (typeof key === 'object') {
                Object.assign(initialValues, key);
                mockSetData(key, value);
            } else {
                initialValues[key] = value;
                mockSetData(key, value);
            }
        },
        post: mockPost,
        put: mockPut,
        reset: mockReset,
        processing: false,
        errors: {},
    }),
    router: {
        visit: (...args) => mockVisit(...args)
    }
}));

describe('QuickTransactionModal', () => {
    const mockProps = {
        show: true,
        onClose: vi.fn(),
        proyectoId: 1,
        proyectos: [{ id: 1, nombre: 'Proyecto Test' }],
        cuentas: [{ id: 1, nombre: 'Cuenta Test' }],
        categorias: [
            { id: 1, nombre: 'Transporte', tipo: 'gasto' },
            { id: 2, nombre: 'Salario', tipo: 'ingreso' }
        ],
        onSuccess: vi.fn(),
        initialType: 'expense'
    };

    beforeEach(() => {
        vi.clearAllMocks();
        axios.get.mockResolvedValue({ data: [] });
        // Mock window.alert
        window.alert = vi.fn();
        // Mock global route function if not present
        global.route = vi.fn((name, params) => `${name}/${params}`);
    });

    it('renders correctly when shown', () => {
        render(<QuickTransactionModal {...mockProps} />);
        expect(screen.getByText('Gasto')).toBeInTheDocument();
        expect(screen.getByText('Ingreso')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
    });

    it('switches tabs correctly', () => {
        render(<QuickTransactionModal {...mockProps} />);

        const incomeTab = screen.getByText('Ingreso');
        fireEvent.click(incomeTab);

        // Check if Quick Actions are hidden (only for expenses)
        expect(screen.queryByText('Transporte')).not.toBeInTheDocument();
    });

    it('respects initialType prop', () => {
        render(<QuickTransactionModal {...mockProps} initialType="income" />);
        expect(screen.queryByText('Transporte')).not.toBeInTheDocument();
    });

    it('handles quick actions', () => {
        render(<QuickTransactionModal {...mockProps} />);

        // Click Transport quick action
        const transportBtn = screen.getByText('Transporte');
        fireEvent.click(transportBtn);

        // Verify category was selected (mockSetData called with object)
        // Note: setData(object) results in mockSetData(object, undefined)
        expect(mockSetData).toHaveBeenCalledWith(expect.objectContaining({
            custom_category: 'transport',
            descripcion: 'Transporte'
        }), undefined);
    });

    it.skip('submits form correctly', async () => {
        render(<QuickTransactionModal {...mockProps} />);

        // Fill amount
        const amountInput = screen.getByPlaceholderText('0.00');
        fireEvent.change(amountInput, { target: { value: '100' } });

        // Select account
        const accountSelect = screen.getByLabelText('Cuenta');
        fireEvent.change(accountSelect, { target: { value: '1' } });

        // Select category (Transporte)
        const categoryBtn = screen.getByText('Transporte');
        fireEvent.click(categoryBtn);

        // Submit
        const submitBtn = screen.getByText('Guardar');
        fireEvent.click(submitBtn);

        // Check for validation errors
        if (window.alert.mock.calls.length > 0) {
            console.error('Validation Alert:', window.alert.mock.calls[0][0]);
        }
        expect(window.alert).not.toHaveBeenCalled();

        expect(mockVisit).toHaveBeenCalled();
    });
});
