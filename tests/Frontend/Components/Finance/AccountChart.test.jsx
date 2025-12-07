import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AccountChart from '@/Components/Finance/AccountChart';

// Mock translations
vi.mock('@/Hooks/useTranslate', () => ({
    useTranslate: () => ({
        t: (key, defaultVal) => defaultVal,
    }),
}));

// Mock Icons to avoid rendering issues
vi.mock('@/Components/Icons', () => ({
    CalendarIcon: () => <span data-testid="calendar-icon" />,
    ClockIcon: () => <span data-testid="clock-icon" />,
    PencilIcon: () => <span data-testid="pencil-icon" />,
    TrashIcon: () => <span data-testid="trash-icon" />,
    BanknotesIcon: () => <span data-testid="banknotes-icon" />,
    AccountCreditIcon: () => <span data-testid="credit-icon" />,
    AccountLoanIcon: () => <span data-testid="loan-icon" />,
    AccountInvestmentIcon: () => <span data-testid="investment-icon" />,
    AccountBankIcon: () => <span data-testid="bank-icon" />,
    AccountCashIcon: () => <span data-testid="cash-icon" />,
}));

describe('AccountChart', () => {
    const mockAccount = {
        id: 1,
        nombre: 'Test Account',
        tipo: 'banco',
        saldo_actual: 10300, // 10300 cents = $103.00
        moneda: 'USD',
        estado: 'activa',
    };

    it('displays currency correctly (divides cents by 100)', () => {
        render(<AccountChart cuenta={mockAccount} />);

        // Should display $103.00 (or equivalent depending on locale)
        // We look for "103" to be safe across locales, but ideally it matches the formatted string
        // The component uses navigator.language, which might be 'en-US' in test env
        // 10300 / 100 = 103

        // We can check if it contains "103" and does NOT contain "10,300" or "10300"
        const balanceElement = screen.getByText((content, element) => {
            return element.tagName.toLowerCase() === 'p' &&
                (content.includes('103') || content.includes('103.00'));
        });

        expect(balanceElement).toBeInTheDocument();
        expect(balanceElement).not.toHaveTextContent('10,300');
        expect(balanceElement).not.toHaveTextContent('1030000');
    });

    it('renders loan account with red styling for due payment status', () => {
        const loanAccount = {
            ...mockAccount,
            tipo: 'prestamo',
            saldo_actual: 500000, // $5,000.00
            dia_pago: 15,
            valor_cuota: 25000, // $250.00
            plazo: 24,
            cuotas_pagadas: 5,
            paymentStatus: 'due'
        };

        render(<AccountChart cuenta={loanAccount} />);

        // Check for "Día 15"
        expect(screen.getByText(/Día 15/)).toBeInTheDocument();

        // Check for red styling on the text
        const dayText = screen.getByText(/Día 15/);
        expect(dayText).toHaveClass('text-red-700');
    });

    it('renders loan account with green styling for paid status', () => {
        const loanAccount = {
            ...mockAccount,
            tipo: 'prestamo',
            paymentStatus: 'paid',
            dia_pago: 15
        };

        render(<AccountChart cuenta={loanAccount} />);
        const dayText = screen.getByText(/Día 15/);
        expect(dayText).toHaveClass('text-green-700');
    });

    it('renders credit card with amber styling for warning status', () => {
        const creditAccount = {
            ...mockAccount,
            tipo: 'credito',
            paymentStatus: 'warning',
            dia_pago: 20
        };

        render(<AccountChart cuenta={creditAccount} />);
        const paymentDayText = screen.getByText((content) => content.includes('Día') && content.includes('20'));
        expect(paymentDayText).toHaveClass('text-amber-700');
    });

    it('displays interest rate for savings accounts', () => {
        const savingsAccount = {
            ...mockAccount,
            tipo: 'banco',
            tasa_interes_anual: 12.5
        };
        render(<AccountChart cuenta={savingsAccount} />);
        expect(screen.getByText('12.5%')).toBeInTheDocument();
        // Check for label "Tasa" or "Tasa E.A." depending on translation mock
        // Mock returns defaultVal, so it should match the default text in component
        // Component uses t('finance.interest_rate', 'Tasa') -> 'Tasa'
        // But logic for extra pushes { label: ..., value: ..., extras: ...}
        // Actually the logic is { label: t('...'), value: '12.5%' }
    });
});
