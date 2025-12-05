import { render, screen } from '@testing-library/react';
import NavLink from '@/Components/NavLink';

describe('NavLink', () => {
    it('renders link with children', () => {
        render(<NavLink href="/test">Test Link</NavLink>);

        expect(screen.getByText('Test Link')).toBeInTheDocument();
    });

    it('applies active styles when active is true', () => {
        render(<NavLink href="/test" active={true}>Active Link</NavLink>);

        const link = screen.getByText('Active Link');
        expect(link).toHaveClass('border-primary-400');
        expect(link).toHaveClass('text-gray-900');
    });

    it('applies inactive styles when active is false', () => {
        render(<NavLink href="/test" active={false}>Inactive Link</NavLink>);

        const link = screen.getByText('Inactive Link');
        expect(link).toHaveClass('border-transparent');
        expect(link).toHaveClass('text-gray-500');
    });

    it('defaults to inactive state', () => {
        render(<NavLink href="/test">Default Link</NavLink>);

        const link = screen.getByText('Default Link');
        expect(link).toHaveClass('border-transparent');
    });

    it('applies custom className', () => {
        render(<NavLink href="/test" className="custom-nav">Custom Link</NavLink>);

        const link = screen.getByText('Custom Link');
        expect(link).toHaveClass('custom-nav');
    });

    it('has correct base styling classes', () => {
        render(<NavLink href="/test">Base Link</NavLink>);

        const link = screen.getByText('Base Link');
        expect(link).toHaveClass('inline-flex');
        expect(link).toHaveClass('items-center');
        expect(link).toHaveClass('border-b-2');
    });

    it('passes through href prop', () => {
        render(<NavLink href="/dashboard">Dashboard</NavLink>);

        const link = screen.getByText('Dashboard');
        expect(link).toHaveAttribute('href', '/dashboard');
    });
});
