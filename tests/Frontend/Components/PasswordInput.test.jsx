import { render, screen, fireEvent } from '@testing-library/react';
import PasswordInput from '@/Components/PasswordInput';
import { createRef } from 'react';

describe('PasswordInput', () => {
    it('renders as password type by default', () => {
        const { container } = render(<PasswordInput />);

        const input = container.querySelector('input[type="password"]');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'password');
    });

    it('toggles visibility on icon click', () => {
        const { container } = render(<PasswordInput />);

        let input = container.querySelector('input');
        const toggleButton = screen.getByLabelText(/Mostrar contraseña/i);

        // Initially password
        expect(input).toHaveAttribute('type', 'password');

        // Click to show
        fireEvent.click(toggleButton);
        input = container.querySelector('input');
        expect(input).toHaveAttribute('type', 'text');

        // Click to hide again
        fireEvent.click(toggleButton);
        input = container.querySelector('input');
        expect(input).toHaveAttribute('type', 'password');
    });

    it('shows eye icon when password is hidden', () => {
        render(<PasswordInput />);

        const toggleButton = screen.getByLabelText(/Mostrar contraseña/i);
        expect(toggleButton).toBeInTheDocument();
    });

    it('shows eye-off icon when password is visible', () => {
        render(<PasswordInput />);

        const toggleButton = screen.getByLabelText(/Mostrar contraseña/i);
        fireEvent.click(toggleButton);

        const hideButton = screen.getByLabelText(/Ocultar contraseña/i);
        expect(hideButton).toBeInTheDocument();
    });

    it('handles onChange events', () => {
        const handleChange = vi.fn();
        const { container } = render(<PasswordInput onChange={handleChange} />);

        const input = container.querySelector('input');
        fireEvent.change(input, { target: { value: 'password123' } });

        expect(handleChange).toHaveBeenCalled();
    });

    it('focuses when isFocused prop is true', () => {
        const { container } = render(<PasswordInput isFocused={true} />);

        const input = container.querySelector('input');
        expect(input).toHaveFocus();
    });

    it('exposes focus method via ref', () => {
        const ref = createRef();
        const { container } = render(<PasswordInput ref={ref} />);

        ref.current.focus();
        const input = container.querySelector('input');
        expect(input).toHaveFocus();
    });

    it('applies error styles when error prop is provided', () => {
        const { container } = render(<PasswordInput error={true} />);

        const input = container.querySelector('input');
        expect(input).toHaveClass('border-red-500');
    });

    it('applies custom className', () => {
        const { container } = render(<PasswordInput className="custom-class" />);

        const input = container.querySelector('input');
        expect(input).toHaveClass('custom-class');
    });

    it('toggle button has tabIndex -1', () => {
        render(<PasswordInput />);

        const toggleButton = screen.getByLabelText(/Mostrar contraseña/i);
        expect(toggleButton).toHaveAttribute('tabIndex', '-1');
    });
});
