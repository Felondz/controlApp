import { render, screen } from '@testing-library/react';
import SecondaryLink from '@/Components/SecondaryLink';

describe('SecondaryLink', () => {
    it('renders link with children', () => {
        render(<SecondaryLink href="/test">Click Me</SecondaryLink>);

        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('has secondary button styling', () => {
        render(<SecondaryLink href="/test">Secondary</SecondaryLink>);

        const link = screen.getByText('Secondary');
        expect(link).toHaveClass('bg-gray-100');
    });

    it('has dark mode styling', () => {
        render(<SecondaryLink href="/test">Dark Mode</SecondaryLink>);

        const link = screen.getByText('Dark Mode');
        expect(link).toHaveClass('dark:bg-gray-800');
        expect(link).toHaveClass('dark:text-gray-300');
    });

    it('applies custom className', () => {
        render(<SecondaryLink href="/test" className="custom-secondary">Custom</SecondaryLink>);

        const link = screen.getByText('Custom');
        expect(link).toHaveClass('custom-secondary');
    });

    it('has correct base styling', () => {
        render(<SecondaryLink href="/test">Base</SecondaryLink>);

        const link = screen.getByText('Base');
        expect(link).toHaveClass('inline-flex');
        expect(link).toHaveClass('rounded-lg');
    });

    it('passes through href prop', () => {
        render(<SecondaryLink href="/settings">Settings</SecondaryLink>);

        const link = screen.getByText('Settings');
        expect(link).toHaveAttribute('href', '/settings');
    });
});
