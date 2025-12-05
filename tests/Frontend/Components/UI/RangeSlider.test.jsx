import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import RangeSlider from '@/Components/UI/RangeSlider';

describe('RangeSlider', () => {
    const mockOnChange = vi.fn();

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    it('renders slider with correct props', () => {
        render(
            <RangeSlider
                min={0}
                max={100}
                step={10}
                value={50}
                onChange={mockOnChange}
            />
        );

        // Try to find by role, if not found, fallback to container query
        // Note: input type="range" implicitly has role="slider"
        const slider = screen.getByRole('slider');
        expect(slider).toBeInTheDocument();
        expect(slider).toHaveValue('50');
        expect(slider).toHaveAttribute('min', '0');
        expect(slider).toHaveAttribute('max', '100');
        expect(slider).toHaveAttribute('step', '10');
    });

    it('calls onChange when value changes', () => {
        render(
            <RangeSlider
                min={0}
                max={100}
                value={50}
                onChange={mockOnChange}
            />
        );

        const slider = screen.getByRole('slider');
        fireEvent.change(slider, { target: { value: '75' } });

        expect(mockOnChange).toHaveBeenCalledWith(75);
    });

    it('renders with custom class', () => {
        const { container } = render(
            <RangeSlider
                min={0}
                max={100}
                value={50}
                onChange={mockOnChange}
                className="custom-slider"
            />
        );

        expect(container.firstChild).toHaveClass('custom-slider');
    });
});
