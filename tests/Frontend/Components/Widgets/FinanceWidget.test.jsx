import { render, screen } from '@testing-library/react';
import FinanceWidget from '@/Components/Widgets/FinanceWidget';

describe('FinanceWidget', () => {
    const mockProject = {
        moneda_default: 'USD'
    };

    it('renders balance title', () => {
        render(<FinanceWidget project={mockProject} />);

        expect(screen.getByText('finance.balance')).toBeInTheDocument();
    });

    it('renders formatted balance', () => {
        render(<FinanceWidget project={mockProject} />);

        // Mock balance is 1500.00
        // Intl format might vary by environment, but let's check for basic presence
        // Or we can mock Intl, but let's try to match part of the string
        // $1,500.00 or similar
        // Since we use es-CO locale in the component:
        // new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'USD' }).format(1500)
        // usually outputs something like US$ 1.500,00 or similar depending on node version.
        // Let's just check if it renders *something* that looks like currency or just check if it doesn't crash.
        // Or better, check for the text content loosely.

        const balanceElement = screen.getByText(/1\.?500/); // Matches 1.500 or 1500
        expect(balanceElement).toBeInTheDocument();
    });

    it('uses project currency', () => {
        const eurProject = { moneda_default: 'EUR' };
        render(<FinanceWidget project={eurProject} />);

        // Should contain EUR symbol or code
        const balanceElement = screen.getByText(/EUR|€/);
        expect(balanceElement).toBeInTheDocument();
    });
});
