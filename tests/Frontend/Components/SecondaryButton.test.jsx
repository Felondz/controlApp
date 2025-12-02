import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SecondaryButton from '@/Components/SecondaryButton';

describe('SecondaryButton', () => {
    it('renders children correctly', () => {
        render(<SecondaryButton>Click Me</SecondaryButton>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('renders as a button element', () => {
        render(<SecondaryButton>Submit</SecondaryButton>);
        const button = screen.getByRole('button', { name: /submit/i });
        expect(button).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<SecondaryButton className="custom-class">Test</SecondaryButton>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-class');
    });

    it('can be disabled', () => {
        render(<SecondaryButton disabled>Disabled</SecondaryButton>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });
});
