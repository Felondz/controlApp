import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DangerButton from '@/Components/DangerButton';

describe('DangerButton', () => {
    it('renders children correctly', () => {
        render(<DangerButton>Delete</DangerButton>);
        expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('renders as a button element', () => {
        render(<DangerButton>Remove</DangerButton>);
        const button = screen.getByRole('button', { name: /remove/i });
        expect(button).toBeInTheDocument();
    });

    it('has danger styling classes', () => {
        render(<DangerButton>Danger</DangerButton>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-danger-600');
    });

    it('can be disabled', () => {
        render(<DangerButton disabled>Disabled</DangerButton>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });
});
