import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InputError from '@/Components/InputError';

describe('InputError', () => {
    it('renders error message when provided', () => {
        render(<InputError message="This field is required" />);
        expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('does not render when message is empty', () => {
        const { container } = render(<InputError message="" />);
        expect(container.firstChild).toBeNull();
    });

    it('does not render when message is null', () => {
        const { container } = render(<InputError message={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('applies custom className', () => {
        render(<InputError message="Error" className="custom-error" />);
        const error = screen.getByText('Error');
        expect(error).toHaveClass('custom-error');
    });

    it('has error styling classes', () => {
        render(<InputError message="Error" />);
        const error = screen.getByText('Error');
        expect(error).toHaveClass('text-red-600');
    });
});
