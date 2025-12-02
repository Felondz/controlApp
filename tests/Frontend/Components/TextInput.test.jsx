import { render, screen, fireEvent } from '@testing-library/react';
import TextInput from '@/Components/TextInput';
import { createRef } from 'react';

describe('TextInput', () => {
    it('renders with value', () => {
        render(<TextInput value="Test Value" readOnly />);
        expect(screen.getByDisplayValue('Test Value')).toBeInTheDocument();
    });

    it('handles onChange events', () => {
        const handleChange = vi.fn();
        render(<TextInput onChange={handleChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'New Value' } });

        expect(handleChange).toHaveBeenCalled();
    });

    it('focuses when isFocused prop is true', () => {
        render(<TextInput isFocused={true} />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveFocus();
    });

    it('exposes focus method via ref', () => {
        const ref = createRef();
        render(<TextInput ref={ref} />);

        ref.current.focus();
        const input = screen.getByRole('textbox');
        expect(input).toHaveFocus();
    });
});
