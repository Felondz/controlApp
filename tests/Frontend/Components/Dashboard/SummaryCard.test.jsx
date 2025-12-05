import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import SummaryCard from '@/Components/Dashboard/SummaryCard';
import { DashboardIcon } from '@/Components/Icons';

describe('SummaryCard', () => {
    it('renders title and value', () => {
        render(<SummaryCard title="Total Sales" value="$1,000" />);

        expect(screen.getByText('Total Sales')).toBeInTheDocument();
        expect(screen.getByText('$1,000')).toBeInTheDocument();
    });

    it('renders label if provided', () => {
        render(<SummaryCard title="Sales" value="$100" label="Last 30 days" />);

        expect(screen.getByText('Last 30 days')).toBeInTheDocument();
    });

    it('renders icon if provided', () => {
        render(<SummaryCard title="Sales" value="$100" icon={DashboardIcon} />);

        // We can check if the SVG is present
        const icon = screen.getByText('Sales').parentElement.querySelector('svg');
        expect(icon).toBeInTheDocument();
    });

    it('applies color styles correctly', () => {
        render(<SummaryCard title="Error" value="1" color="danger" />);

        const title = screen.getByText('Error');
        expect(title).toHaveClass('text-danger-700');
    });

    it('renders link action', () => {
        const action = { label: 'View Details', href: '/details' };
        render(<SummaryCard title="Sales" value="$100" action={action} />);

        const link = screen.getByText('View Details →');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/details');
    });

    it('renders button action', () => {
        const mockClick = vi.fn();
        const action = { label: 'Refresh', onClick: mockClick };
        render(<SummaryCard title="Sales" value="$100" action={action} />);

        const button = screen.getByText('Refresh');
        fireEvent.click(button);

        expect(mockClick).toHaveBeenCalled();
    });

    it('renders disabled button action', () => {
        const action = { label: 'Refresh', onClick: vi.fn(), disabled: true };
        render(<SummaryCard title="Sales" value="$100" action={action} />);

        const button = screen.getByText('Refresh');
        expect(button).toBeDisabled();
        expect(button).toHaveClass('cursor-not-allowed');
    });
});
