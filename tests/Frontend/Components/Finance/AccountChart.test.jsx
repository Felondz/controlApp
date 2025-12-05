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

    it('renders loan account with red styling for payment date', () => {
        const loanAccount = {
            ...mockAccount,
            tipo: 'prestamo',
            saldo_actual: 500000, // $5,000.00
            dia_pago: 15,
            valor_cuota: 25000, // $250.00
            plazo: 24,
            cuotas_pagadas: 5
        };

        render(<AccountChart cuenta={loanAccount} />);

        // Check for "Día 15"
        expect(screen.getByText(/Día 15/)).toBeInTheDocument();

        // Check for red styling on the payment date container or text
        // The text "Día 15" should be inside a red container/text
        const dayText = screen.getByText(/Día 15/);
        expect(dayText).toHaveClass('text-red-600');
    });

    it('renders credit card with red styling for payment date', () => {
        const creditAccount = {
            ...mockAccount,
            tipo: 'credito',
            saldo_actual: 15000, // $150.00
            limite_credito: 100000, // $1,000.00
            dia_corte: 5,
            dia_pago: 20
        };

        render(<AccountChart cuenta={creditAccount} />);

        // Check for "Día 20" (Payment date)
        const paymentDayText = screen.getByText((content) => content.includes('Día') && content.includes('20'));
        expect(paymentDayText).toBeInTheDocument();
        expect(paymentDayText).toHaveClass('text-red-600');
    });
});
