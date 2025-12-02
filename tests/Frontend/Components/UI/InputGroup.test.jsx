import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import InputGroup from '@/Components/UI/InputGroup';

describe('InputGroup', () => {
    const mockOnChange = vi.fn();

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    it('renders label and input', () => {
        render(<InputGroup label="Username" id="username" value="" onChange={mockOnChange} />);

        expect(screen.getByLabelText('Username')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders with initial value', () => {
        render(<InputGroup label="Username" id="username" value="testuser" onChange={mockOnChange} />);

        expect(screen.getByRole('textbox')).toHaveValue('testuser');
    });

    it('calls onChange when input changes', () => {
        render(<InputGroup label="Username" id="username" value="" onChange={mockOnChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'newvalue' } });

        expect(mockOnChange).toHaveBeenCalled();
    });

    it('renders placeholder', () => {
        render(<InputGroup label="Username" value="" onChange={mockOnChange} placeholder="Enter username" />);

        expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    });

    it('renders suffix if provided', () => {
        render(<InputGroup label="Price" value="" onChange={mockOnChange} suffix="USD" />);

        expect(screen.getByText('USD')).toBeInTheDocument();
    });

    it('renders tooltip if provided', () => {
        render(<InputGroup label="Username" value="" onChange={mockOnChange} tooltip="Unique identifier" />);

        // Tooltip text is in the document but might be hidden or require hover
        // In this implementation, it's just in the DOM with opacity-0
        expect(screen.getByText('Unique identifier')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(<InputGroup label="Username" value="" onChange={mockOnChange} className="custom-class" />);

        expect(container.firstChild).toHaveClass('custom-class');
    });
});
