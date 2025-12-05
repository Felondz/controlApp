import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import TypographySelector from '@/Components/TypographySelector';

describe('TypographySelector', () => {
    const mockTypographies = [
        { id: 'sans', name: 'Sans Serif' },
        { id: 'serif', name: 'Serif' },
        { id: 'mono', name: 'Monospace' }
    ];
    const mockOnChange = vi.fn();

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    it('renders with selected value', () => {
        render(
            <TypographySelector
                value="sans"
                onChange={mockOnChange}
                typographies={mockTypographies}
            />
        );

        expect(screen.getByText('Sans Serif')).toBeInTheDocument();
    });

    it('opens dropdown on click', () => {
        render(
            <TypographySelector
                value="sans"
                onChange={mockOnChange}
                typographies={mockTypographies}
            />
        );

        const button = screen.getByRole('button');
        fireEvent.click(button);

        // Component uses t('common.search', 'Buscar tipografía...')
        // With mock, t returns the key
        expect(screen.getByPlaceholderText('common.search')).toBeInTheDocument();
        expect(screen.getByText('Serif')).toBeInTheDocument();
        expect(screen.getByText('Monospace')).toBeInTheDocument();
    });

    it('filters options based on search', () => {
        render(
            <TypographySelector
                value="sans"
                onChange={mockOnChange}
                typographies={mockTypographies}
            />
        );

        fireEvent.click(screen.getByRole('button'));
        // Component uses t('common.search', 'Buscar tipografía...')
        // With mock, t returns the key
        const searchInput = screen.getByPlaceholderText('common.search');

        fireEvent.change(searchInput, { target: { value: 'Mono' } });

        expect(screen.getByText('Monospace')).toBeInTheDocument();
        expect(screen.queryByText('Serif')).not.toBeInTheDocument();
    });

    it('calls onChange when option selected', () => {
        render(
            <TypographySelector
                value="sans"
                onChange={mockOnChange}
                typographies={mockTypographies}
            />
        );

        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('Serif'));

        expect(mockOnChange).toHaveBeenCalledWith('serif');
    });

    it('closes dropdown after selection', () => {
        render(
            <TypographySelector
                value="sans"
                onChange={mockOnChange}
                typographies={mockTypographies}
            />
        );

        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('Serif'));

        expect(screen.queryByPlaceholderText('common.search')).not.toBeInTheDocument();
    });

    it('shows no results message when search yields nothing', () => {
        render(
            <TypographySelector
                value="sans"
                onChange={mockOnChange}
                typographies={mockTypographies}
            />
        );

        fireEvent.click(screen.getByRole('button'));
        // Component uses t('common.search', 'Buscar tipografía...')
        // With mock, t returns the key
        const searchInput = screen.getByPlaceholderText('common.search');

        fireEvent.change(searchInput, { target: { value: 'XYZ' } });

        // This text is hardcoded in the component (not translated yet)
        expect(screen.getByText('No se encontraron resultados.')).toBeInTheDocument();
    });

    it('highlights selected option', () => {
        render(
            <TypographySelector
                value="serif"
                onChange={mockOnChange}
                typographies={mockTypographies}
            />
        );

        fireEvent.click(screen.getByRole('button'));

        const selectedOption = screen.getAllByText('Serif')[1].closest('li');
        expect(selectedOption).toHaveClass('bg-primary-50');
    });
});
