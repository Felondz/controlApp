import { render, screen } from '@testing-library/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

describe('ApplicationLogo', () => {
    it('renders logo with icon and text by default', () => {
        const { container } = render(<ApplicationLogo />);

        const icon = container.querySelector('svg');
        expect(icon).toBeInTheDocument();
        expect(screen.getByText('app.name')).toBeInTheDocument();
    });

    it('renders only icon when onlyIcon is true', () => {
        const { container } = render(<ApplicationLogo onlyIcon={true} />);

        const icon = container.querySelector('svg');
        expect(icon).toBeInTheDocument();
        expect(screen.queryByText('app.name')).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(<ApplicationLogo className="custom-logo" />);

        const logo = container.firstChild;
        expect(logo).toHaveClass('custom-logo');
    });

    it('has theme-aware icon styling', () => {
        const { container } = render(<ApplicationLogo />);

        const icon = container.querySelector('svg');
        expect(icon).toHaveClass('text-primary-600');
        expect(icon).toHaveClass('dark:text-primary-400');
    });

    it('renders text with gradient styling', () => {
        render(<ApplicationLogo />);

        const text = screen.getByText('app.name');
        expect(text).toHaveClass('bg-gradient-to-r');
        expect(text).toHaveClass('from-primary-600');
    });

    it('passes through additional props', () => {
        const { container } = render(<ApplicationLogo data-testid="app-logo" />);

        const logo = container.firstChild;
        expect(logo).toHaveAttribute('data-testid', 'app-logo');
    });
});
