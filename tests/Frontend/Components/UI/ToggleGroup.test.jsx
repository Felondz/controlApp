import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ToggleGroup from '@/Components/UI/ToggleGroup';

describe('ToggleGroup', () => {
    const mockOnChange = vi.fn();
    const options = [
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' }
    ];

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    it('renders all options', () => {
        render(<ToggleGroup options={options} value="monthly" onChange={mockOnChange} />);

        expect(screen.getByText('Monthly')).toBeInTheDocument();
        expect(screen.getByText('Yearly')).toBeInTheDocument();
    });

    it('highlights selected option', () => {
        render(<ToggleGroup options={options} value="monthly" onChange={mockOnChange} />);

        const monthlyBtn = screen.getByText('Monthly');
        const yearlyBtn = screen.getByText('Yearly');

        expect(monthlyBtn).toHaveClass('bg-white'); // Active style
        expect(yearlyBtn).not.toHaveClass('bg-white'); // Inactive style
    });

    it('calls onChange when option clicked', () => {
        render(<ToggleGroup options={options} value="monthly" onChange={mockOnChange} />);

        fireEvent.click(screen.getByText('Yearly'));
        expect(mockOnChange).toHaveBeenCalledWith('yearly');
    });
});
