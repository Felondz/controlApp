import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InputLabel from '@/Components/InputLabel';

describe('InputLabel', () => {
    it('renders label text correctly', () => {
        render(<InputLabel value="Username" />);
        expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('renders children when provided', () => {
        render(<InputLabel>Email Address</InputLabel>);
        expect(screen.getByText('Email Address')).toBeInTheDocument();
    });

    it('applies htmlFor attribute', () => {
        render(<InputLabel htmlFor="email-input" value="Email" />);
        const label = screen.getByText('Email');
        expect(label).toHaveAttribute('for', 'email-input');
    });

    it('applies custom className', () => {
        render(<InputLabel className="custom-label" value="Test" />);
        const label = screen.getByText('Test');
        expect(label).toHaveClass('custom-label');
    });
});
