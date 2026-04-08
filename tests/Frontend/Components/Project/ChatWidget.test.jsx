import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ChatWidget from '@/Modules/Chat/Widgets/ChatWidget';
import axios from 'axios';
import { router } from '@inertiajs/react';

// Mock axios
vi.mock('axios');

// Mock Inertia router
vi.mock('@inertiajs/react', async () => {
    const actual = await vi.importActual('@inertiajs/react');
    return {
        ...actual,
        router: {
            reload: vi.fn(),
            visit: vi.fn(),
        },
    };
});

// Mock sub-components to isolate ChatWidget logic
vi.mock('@/Components/Project/ChatSidebar', () => ({
    default: ({ onChannelSelect, unreadCounts }) => (
        <div data-testid="chat-sidebar">
            <button onClick={() => onChannelSelect('general')}>General</button>
            <button onClick={() => onChannelSelect(2)}>User 2</button>
            <span data-testid="unread-general">{unreadCounts.general}</span>
        </div>
    )
}));

vi.mock('@/Components/Project/ChatWindow', () => ({
    default: ({ messages, onSendMessage, loading }) => (
        <div data-testid="chat-window">
            {loading ? (
                <div>Cargando...</div>
            ) : (
                <>
                    <div data-testid="message-count">{messages.length}</div>
                    {messages.map(msg => (
                        <div key={msg.id} data-testid={`message-${msg.id}`}>{msg.content}</div>
                    ))}
                    <button onClick={() => onSendMessage('Test message')}>Send</button>
                </>
            )}
        </div>
    )
}));

describe('ChatWidget', () => {
    const mockProject = {
        id: 1,
        nombre: 'Test Project',
        miembros: [
            { id: 1, name: 'Test User' },
            { id: 2, name: 'Other User' },
        ],
    };

    const mockUser = {
        id: 1,
        name: 'Test User',
    };

    beforeEach(() => {
        // Don't use fake timers - the component checks for test mode and skips polling
        vi.clearAllMocks();

        // Mock route() function
        global.route = vi.fn((name, params) => {
            if (name === 'project.messages.index') {
                return `/proyectos/${params}/messages`;
            }
            if (name === 'project.messages.store') {
                return `/proyectos/${params}/messages`;
            }
            if (name === 'project.messages.read') {
                return `/proyectos/${params}/messages/read`;
            }
            if (name === 'project.messages.unread') {
                return `/proyectos/${params}/messages/unread`;
            }
            return `/${name}`;
        });

        // Mock axios.get for messages and unread counts
        axios.get.mockImplementation((url) => {
            if (url.includes('/messages/unread')) {
                return Promise.resolve({
                    data: { general: 0, dms: {} }
                });
            }
            if (url.includes('/messages')) {
                return Promise.resolve({
                    data: {
                        data: [
                            { id: 1, content: 'Hello', user_id: 2, created_at: '2025-01-01T10:00:00Z' }
                        ]
                    }
                });
            }
            return Promise.resolve({ data: {} });
        });

        // Mock axios.post for sending messages and marking as read
        axios.post.mockImplementation((url) => {
            if (url.includes('/messages/read')) {
                return Promise.resolve({ data: { success: true } });
            }
            // Default: sending a message
            return Promise.resolve({
                data: {
                    id: 2,
                    content: 'Test message',
                    user_id: 1,
                    created_at: new Date().toISOString()
                }
            });
        });

        // Mock router.reload
        router.reload.mockClear();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders sidebar and window components', async () => {
        render(<ChatWidget project={mockProject} user={mockUser} />);

        // Component should render immediately
        expect(screen.getByTestId('chat-sidebar')).toBeInTheDocument();
        expect(screen.getByTestId('chat-window')).toBeInTheDocument();
    });

    it('fetches messages on mount', async () => {
        render(<ChatWidget project={mockProject} user={mockUser} />);

        // Wait for initial fetch to complete
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining('/messages'),
                expect.any(Object)
            );
        }, { timeout: 3000 });
    });

    it('displays fetched messages', async () => {
        render(<ChatWidget project={mockProject} user={mockUser} />);

        // Wait for messages to be displayed
        await waitFor(() => {
            expect(screen.getByTestId('message-count')).toHaveTextContent('1');
            expect(screen.getByText('Hello')).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    it('sends message when triggered from window', async () => {
        render(<ChatWidget project={mockProject} user={mockUser} />);

        // Wait for component to render
        await waitFor(() => {
            expect(screen.getByTestId('chat-window')).toBeInTheDocument();
        }, { timeout: 3000 });

        const sendButton = screen.getByText('Send');
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining('/messages'),
                expect.any(FormData),
                expect.objectContaining({
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
            );
        }, { timeout: 3000 });
    });

    it('switches channels when sidebar triggers selection', async () => {
        render(<ChatWidget project={mockProject} user={mockUser} />);

        // Wait for initial render
        await waitFor(() => {
            expect(screen.getByTestId('chat-sidebar')).toBeInTheDocument();
        }, { timeout: 3000 });

        // Clear previous calls
        axios.get.mockClear();

        // Click to select User 2
        const user2Button = screen.getByText('User 2');
        fireEvent.click(user2Button);

        // Verify messages are fetched for the new channel
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining('/messages'),
                expect.objectContaining({
                    params: { recipient_id: 2 }
                })
            );
        }, { timeout: 3000 });
    });
});
