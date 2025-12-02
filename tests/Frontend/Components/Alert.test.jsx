import { render, screen } from '@testing-library/react';
import Alert from '@/Components/Alert';

describe('Alert', () => {
    it('renders info alert by default', () => {
        render(<Alert>This is an info message</Alert>);

        expect(screen.getByText('This is an info message')).toBeInTheDocument();
    });

    it('renders warning alert', () => {
        render(<Alert type="warning">This is a warning</Alert>);

        const alert = screen.getByText('This is a warning').closest('div');
        expect(alert).toHaveClass('bg-amber-50');
    });

    it('renders success alert', () => {
        render(<Alert type="success">Operation successful</Alert>);

        const alert = screen.getByText('Operation successful').closest('div');
        expect(alert).toHaveClass('bg-green-50');
    });

    it('renders error alert', () => {
        render(<Alert type="error">An error occurred</Alert>);

        const alert = screen.getByText('An error occurred').closest('div');
        expect(alert).toHaveClass('bg-red-50');
    });

    it('displays title when provided', () => {
        render(<Alert title="Important">Read this carefully</Alert>);

        expect(screen.getByText(/Important:/i)).toBeInTheDocument();
        expect(screen.getByText('Read this carefully')).toBeInTheDocument();
    });

    it('renders without title', () => {
        render(<Alert>Simple message</Alert>);

        expect(screen.getByText('Simple message')).toBeInTheDocument();
        expect(screen.queryByText(/:/)).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<Alert className="custom-alert">Message</Alert>);

        const alert = screen.getByText('Message').closest('div');
        expect(alert).toHaveClass('custom-alert');
    });

    it('renders with appropriate icon for each type', () => {
        const { rerender } = render(<Alert type="info">Info</Alert>);
        let alert = screen.getByText('Info').closest('div');
        expect(alert.querySelector('svg')).toBeInTheDocument();

        rerender(<Alert type="warning">Warning</Alert>);
        alert = screen.getByText('Warning').closest('div');
        expect(alert.querySelector('svg')).toBeInTheDocument();

        rerender(<Alert type="success">Success</Alert>);
        alert = screen.getByText('Success').closest('div');
        expect(alert.querySelector('svg')).toBeInTheDocument();

        rerender(<Alert type="error">Error</Alert>);
        alert = screen.getByText('Error').closest('div');
        expect(alert.querySelector('svg')).toBeInTheDocument();
    });

    it('defaults to info type for invalid type', () => {
        render(<Alert type="invalid">Message</Alert>);

        const alert = screen.getByText('Message').closest('div');
        expect(alert).toHaveClass('bg-blue-50'); // info style
    });
});
