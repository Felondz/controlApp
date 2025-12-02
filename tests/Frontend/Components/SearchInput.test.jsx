import { render, screen, fireEvent } from '@testing-library/react';
import SearchInput from '@/Components/SearchInput';

// Mock router and usePage
const mockGet = vi.fn();
vi.mock('@inertiajs/react', () => ({
    router: {
        get: (...args) => mockGet(...args)
    },
    usePage: () => ({
        props: { auth: { user: { id: 1 } } }
    })
}));

describe('SearchInput', () => {
    beforeEach(() => {
        mockGet.mockClear();
    });

    it('renders search input with placeholder', () => {
        render(<SearchInput />);

        const input = screen.getByPlaceholderText('common.search');
        expect(input).toBeInTheDocument();
    });

    it('updates query value on input change', () => {
        render(<SearchInput />);

        const input = screen.getByPlaceholderText('common.search');
        fireEvent.change(input, { target: { value: 'test query' } });

        expect(input.value).toBe('test query');
    });

    it('submits form with query', () => {
        render(<SearchInput />);

        const input = screen.getByPlaceholderText('common.search');
        fireEvent.change(input, { target: { value: 'search term' } });

        const form = input.closest('form');
        fireEvent.submit(form);

        expect(mockGet).toHaveBeenCalledWith(
            expect.any(String),
            { query: 'search term' },
            { preserveState: true }
        );
    });

    it('renders search icon', () => {
        const { container } = render(<SearchInput />);

        const icon = container.querySelector('svg');
        expect(icon).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(<SearchInput className="custom-class" />);

        const form = container.querySelector('form');
        expect(form).toHaveClass('custom-class');
    });

    it('applies custom input classes', () => {
        render(<SearchInput inputClasses="custom-input" />);

        const input = screen.getByPlaceholderText('common.search');
        expect(input).toHaveClass('custom-input');
    });

    it('has correct input type', () => {
        render(<SearchInput />);

        const input = screen.getByPlaceholderText('common.search');
        expect(input).toHaveAttribute('type', 'text');
    });
});
