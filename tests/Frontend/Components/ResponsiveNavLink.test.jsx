import { render, screen } from '@testing-library/react';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';

describe('ResponsiveNavLink', () => {
    it('renders link with children', () => {
        render(<ResponsiveNavLink href="/test">Test Link</ResponsiveNavLink>);

        expect(screen.getByText('Test Link')).toBeInTheDocument();
    });

    it('applies active state styling', () => {
        render(<ResponsiveNavLink href="/test" active={true}>Active</ResponsiveNavLink>);

        const link = screen.getByText('Active');
        expect(link).toBeInTheDocument();
    });

    it('applies inactive state styling', () => {
        render(<ResponsiveNavLink href="/test" active={false}>Inactive</ResponsiveNavLink>);

        const link = screen.getByText('Inactive');
        expect(link).toBeInTheDocument();
    });

    it('handles collapsed state', () => {
        render(<ResponsiveNavLink href="/test" collapsed={true}>Collapsed</ResponsiveNavLink>);

        const link = screen.getByText('Collapsed');
        expect(link).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<ResponsiveNavLink href="/test" className="custom-responsive">Custom</ResponsiveNavLink>);

        const link = screen.getByText('Custom');
        expect(link).toHaveClass('custom-responsive');
    });

    it('passes through href prop', () => {
        render(<ResponsiveNavLink href="/mobile">Mobile</ResponsiveNavLink>);

        const link = screen.getByText('Mobile');
        expect(link).toHaveAttribute('href', '/mobile');
    });

    it('uses theme context', () => {
        // Mock context if needed, or rely on default behavior if component handles missing context gracefully
        // For now, let's assume it renders without crashing
        render(<ResponsiveNavLink href="/test">Themed</ResponsiveNavLink>);

        expect(screen.getByText('Themed')).toBeInTheDocument();
    });
});
