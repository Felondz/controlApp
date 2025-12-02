import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ThemeToggle from '@/Components/ThemeToggle';
import { useGlobalTheme } from '@/Contexts/GlobalThemeContext';

// Mock the hook
vi.mock('@/Contexts/GlobalThemeContext', () => ({
    useGlobalTheme: vi.fn()
}));

describe('ThemeToggle', () => {
    beforeEach(() => {
        // Default mock implementation
        useGlobalTheme.mockReturnValue({
            isDark: false,
            toggleDarkMode: vi.fn(),
            theme: 'light'
        });
    });

    it('renders toggle button', () => {
        render(<ThemeToggle />);

        const button = screen.getByRole('button', { name: /toggle dark mode/i });
        expect(button).toBeInTheDocument();
    });

    it('displays moon icon in light mode', () => {
        useGlobalTheme.mockReturnValue({ isDark: false, toggleDarkMode: vi.fn(), theme: 'light' });

        const { container } = render(<ThemeToggle />);

        const button = screen.getByRole('button');
        const svg = button.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });

    it('displays sun icon in dark mode', () => {
        useGlobalTheme.mockReturnValue({ isDark: true, toggleDarkMode: vi.fn(), theme: 'dark' });

        const { container } = render(<ThemeToggle />);

        const button = screen.getByRole('button');
        const svg = button.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });

    it('calls toggleDarkMode on click', () => {
        const mockToggle = vi.fn();
        useGlobalTheme.mockReturnValue({ isDark: false, toggleDarkMode: mockToggle, theme: 'light' });

        render(<ThemeToggle />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    it('applies custom className', () => {
        render(<ThemeToggle className="custom-class" />);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-class');
    });

    it('has correct aria-label', () => {
        render(<ThemeToggle />);

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Toggle Dark Mode');
    });

    it('has theme-aware styling classes', () => {
        render(<ThemeToggle />);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('text-primary-600');
        expect(button).toHaveClass('dark:text-primary-400');
    });
});
