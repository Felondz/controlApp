import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import LocaleSelector from '@/Components/Common/LocaleSelector';
import axios from 'axios';

// Mock axios
vi.mock('axios');

// Mock window.location.reload
const mockReload = vi.fn();
Object.defineProperty(window, 'location', {
    value: { reload: mockReload },
    writable: true
});

describe('LocaleSelector', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset usePage mock for each test if needed, but default is set in setup
    });

    it('renders current locale as active', () => {
        render(<LocaleSelector />);

        // Assuming default mock user has 'es' locale
        const esButton = screen.getByText('common.spanish');
        expect(esButton).toHaveClass('bg-blue-500');
        expect(esButton).toHaveClass('text-white');
    });

    it('renders other locales as inactive', () => {
        render(<LocaleSelector />);

        const enButton = screen.getByText('common.english');
        expect(enButton).toHaveClass('bg-gray-200');
        expect(enButton).not.toHaveClass('bg-blue-500');
    });

    it('handles locale change successfully', async () => {
        axios.put.mockResolvedValueOnce({ data: { success: true } });

        render(<LocaleSelector />);

        const enButton = screen.getByText('common.english');
        fireEvent.click(enButton);

        expect(axios.put).toHaveBeenCalledWith('/api/user/locale', { locale: 'en' });

        await waitFor(() => {
            expect(mockReload).toHaveBeenCalled();
        });
    });

    it('handles API error gracefully', async () => {
        axios.put.mockRejectedValueOnce({
            response: { data: { message: 'Error changing locale' } }
        });

        render(<LocaleSelector />);

        const enButton = screen.getByText('common.english');
        fireEvent.click(enButton);

        await waitFor(() => {
            expect(screen.getByText('Error changing locale')).toBeInTheDocument();
        });

        expect(mockReload).not.toHaveBeenCalled();
    });

    it('disables buttons while loading', async () => {
        // Create a promise that we can resolve manually to control timing
        let resolvePromise;
        const promise = new Promise(resolve => { resolvePromise = resolve; });
        axios.put.mockReturnValue(promise);

        render(<LocaleSelector />);

        const enButton = screen.getByText('common.english');
        fireEvent.click(enButton);

        expect(enButton).toBeDisabled();
        expect(enButton).toHaveClass('opacity-50');

        resolvePromise({ data: { success: true } });
        await waitFor(() => expect(mockReload).toHaveBeenCalled());
    });
});
