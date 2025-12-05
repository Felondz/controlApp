import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import SelectGroup from '@/Components/UI/SelectGroup';

describe('SelectGroup', () => {
    const mockOnChange = vi.fn();
    const options = [
        { value: 'opt1', label: 'Option 1' },
        { value: 'opt2', label: 'Option 2' }
    ];

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    it('renders label and select', () => {
        render(<SelectGroup label="Choose" id="choose" value="" onChange={mockOnChange} options={options} />);

        expect(screen.getByLabelText('Choose')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders options correctly', () => {
        render(<SelectGroup label="Choose" id="choose" value="" onChange={mockOnChange} options={options} />);

        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('calls onChange when selection changes', () => {
        render(<SelectGroup label="Choose" id="choose" value="" onChange={mockOnChange} options={options} />);

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'opt2' } });

        expect(mockOnChange).toHaveBeenCalled();
    });

    it('renders error message', () => {
        render(
            <SelectGroup
                label="Choose"
                id="choose"
                value=""
                onChange={mockOnChange}
                options={options}
                error="Selection required"
            />
        );

        expect(screen.getByText('Selection required')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toHaveClass('border-red-500');
    });
});
