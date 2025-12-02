import { render, screen } from '@testing-library/react';
import PrimaryLink from '@/Components/PrimaryLink';

describe('PrimaryLink', () => {
    it('renders link with children', () => {
        render(<PrimaryLink href="/test">Click Me</PrimaryLink>);

        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('has primary button styling', () => {
        render(<PrimaryLink href="/test">Primary</PrimaryLink>);

        const link = screen.getByText('Primary');
        expect(link).toHaveClass('bg-primary-700');
        expect(link).toHaveClass('text-white');
    });

    it('has dark mode styling', () => {
        render(<PrimaryLink href="/test">Dark Mode</PrimaryLink>);

        const link = screen.getByText('Dark Mode');
        expect(link).toHaveClass('dark:bg-secondary-800');
    });

    it('applies custom className', () => {
        render(<PrimaryLink href="/test" className="custom-primary">Custom</PrimaryLink>);

        const link = screen.getByText('Custom');
        expect(link).toHaveClass('custom-primary');
    });

    it('has correct base styling', () => {
        render(<PrimaryLink href="/test">Base</PrimaryLink>);

        const link = screen.getByText('Base');
        expect(link).toHaveClass('inline-flex');
        expect(link).toHaveClass('rounded-md');
        expect(link).toHaveClass('uppercase');
    });

    it('passes through href prop', () => {
        render(<PrimaryLink href="/dashboard">Dashboard</PrimaryLink>);

        const link = screen.getByText('Dashboard');
        expect(link).toHaveAttribute('href', '/dashboard');
    });
});
