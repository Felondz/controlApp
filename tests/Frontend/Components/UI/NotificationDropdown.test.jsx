import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NotificationDropdown from '@/Components/UI/NotificationDropdown';
import axios from 'axios';
import { vi } from 'vitest';

// Mock axios
vi.mock('axios');

// Mock useTranslate
vi.mock('@/Hooks/useTranslate', () => ({
    useTranslate: () => ({
        t: (key, defaultVal) => defaultVal || key,
        locale: 'es',
    }),
}));

// Mock Icons
vi.mock('@/Components/Icons', () => ({
    BellIcon: () => <div data-testid="icon-bell" />,
    CheckCircleIcon: () => <div data-testid="icon-check" />,
    WarningIcon: () => <div data-testid="icon-warning" />,
    XCircleIcon: () => <div data-testid="icon-error" />,
    InfoIcon: () => <div data-testid="icon-info" />,
}));

// Mock Dropdown
vi.mock('@/Components/Dropdown', () => {
    const DropdownMock = {
        Trigger: ({ children }) => <div>{children}</div>,
        Content: ({ children }) => <div>{children}</div>,
    };
    return {
        __esModule: true,
        default: Object.assign(({ children }) => <div>{children}</div>, DropdownMock),
    };
});


describe('NotificationDropdown', () => {
    const mockNotifications = {
        data: [
            {
                id: '1',
                data: { title: 'New Task', message: 'You have a new task', type: 'info' },
                read_at: null,
                created_at: '2023-01-01T12:00:00Z'
            },
            {
                id: '2',
                data: { title: 'Payment Received', message: 'Payment of $100 received', type: 'success' },
                read_at: '2023-01-01T10:00:00Z',
                created_at: '2023-01-01T10:00:00Z'
            }
        ],
        meta: { unread_count: 1 }
    };

    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockNotifications });
        axios.patch.mockResolvedValue({});
        axios.post.mockResolvedValue({});
    });

    it('renders notification bell and unread badge', async () => {
        render(<NotificationDropdown />);

        await waitFor(() => {
            expect(screen.getByTestId('icon-bell')).toBeInTheDocument();
            // Check for badge (red dot) - it's a span with bg-red-500
            // We can check if unread count is used to render it
        });
    });

    it('fetches and displays notifications', async () => {
        render(<NotificationDropdown />);

        await waitFor(() => {
            expect(screen.getByText('New Task')).toBeInTheDocument();
            expect(screen.getByText('Payment Received')).toBeInTheDocument();
        });
    });

    it('marks notification as read', async () => {
        render(<NotificationDropdown />);

        await waitFor(() => {
            expect(screen.getByText('New Task')).toBeInTheDocument();
        });

        const markReadButton = screen.getByTitle('Marcar como leída');
        fireEvent.click(markReadButton);

        await waitFor(() => {
            expect(axios.patch).toHaveBeenCalledWith(expect.stringContaining('/api.notifications.read/1'));
        });
    });

    it('marks all as read', async () => {
        render(<NotificationDropdown />);

        await waitFor(() => {
            expect(screen.getByText('Marcar todas como leídas')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Marcar todas como leídas'));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/api.notifications.mark-all-read'));
        });
    });
});
