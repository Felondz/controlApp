import { render, screen, fireEvent } from '@testing-library/react';
import Checkbox from '@/Components/Checkbox';

describe('Checkbox', () => {
    it('renders unchecked by default', () => {
        render(<Checkbox />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();
    });

    it('renders checked when checked prop is true', () => {
        render(<Checkbox checked={true} readOnly />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeChecked();
    });

    it('handles onChange events', () => {
        const handleChange = vi.fn();
        render(<Checkbox onChange={handleChange} />);

        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);

        expect(handleChange).toHaveBeenCalled();
    });
});
