import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import QuantityInput from '@/Components/UI/QuantityInput';

describe('QuantityInput', () => {
    const mockOnChange = vi.fn();

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    it('renders with initial value', () => {
        render(<QuantityInput value={5} onChange={mockOnChange} />);

        expect(screen.getByRole('spinbutton')).toHaveValue(5);
    });

    it('increments value on plus click', () => {
        render(<QuantityInput value={5} onChange={mockOnChange} />);

        const plusButton = screen.getByRole('button', { name: /increase/i });
        fireEvent.click(plusButton);

        expect(mockOnChange).toHaveBeenCalledWith(6);
    });

    it('decrements value on minus click', () => {
        render(<QuantityInput value={5} onChange={mockOnChange} />);

        const minusButton = screen.getByRole('button', { name: /decrease/i });
        fireEvent.click(minusButton);

        expect(mockOnChange).toHaveBeenCalledWith(4);
    });

    it('respects min value', () => {
        render(<QuantityInput value={0} min={0} onChange={mockOnChange} />);

        const minusButton = screen.getByRole('button', { name: /decrease/i });
        expect(minusButton).toBeDisabled();

        fireEvent.click(minusButton);
        expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('respects max value', () => {
        render(<QuantityInput value={10} max={10} onChange={mockOnChange} />);

        const plusButton = screen.getByRole('button', { name: /increase/i });
        expect(plusButton).toBeDisabled();

        fireEvent.click(plusButton);
        expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('respects step value', () => {
        render(<QuantityInput value={0} step={5} onChange={mockOnChange} />);

        const plusButton = screen.getByRole('button', { name: /increase/i });

        fireEvent.click(plusButton);
        expect(mockOnChange).toHaveBeenCalledWith(5);
    });
});
