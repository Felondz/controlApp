import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import BottomNavigation from '@/Components/BottomNavigation';

// Mock NavigationSheet
vi.mock('@/Components/NavigationSheet', () => {
    return {
        default: function MockNavigationSheet({ isOpen, onClose }) {
            return isOpen ? (
                <div role="dialog" data-testid="navigation-sheet">
                    Navigation Sheet Content
                    <button onClick={onClose} aria-label="common.close">Close</button>
                </div>
            ) : null;
        }
    };
});

describe('BottomNavigation', () => {
    const mockUser = {
        id: 1,
        name: 'Test User',
        enabled_tools: ['calculator']
    };

    const mockProject = {
        id: 1,
        nombre: 'Test Project',
        modules: ['finance', 'chat'],
        unread_messages_count: 5
    };

    beforeEach(() => {
        // Reset route mock
        global.route = vi.fn((name) => {
            if (!name) {
                return {
                    current: vi.fn((pattern) => {
                        if (!pattern) return 'dashboard';
                        return pattern === 'dashboard';
                    })
                };
            }
            if (name === 'dashboard') return '/dashboard';
            if (name === 'tools.index') return '/tools';
            if (name === 'mis-proyectos.show') return '/projects/1';
            if (name === 'mis-proyectos.finance') return '/projects/1/finance';
            if (name === 'mis-proyectos.chat') return '/projects/1/chat';
            return '/';
        });
        global.route.current = vi.fn(() => 'dashboard');
    });

    it('renders global navigation items correctly', () => {
        render(<BottomNavigation user={mockUser} />);

        expect(screen.getByLabelText('dashboard.title')).toBeInTheDocument();
        expect(screen.getByLabelText('dashboard.marketplace')).toBeInTheDocument();
        expect(screen.getByLabelText('common.menu')).toBeInTheDocument();
    });

    it('renders project navigation items correctly', () => {
        render(<BottomNavigation user={mockUser} project={mockProject} />);

        expect(screen.getByLabelText('dashboard.title')).toBeInTheDocument();
        expect(screen.getByLabelText('projects.overview')).toBeInTheDocument();
        // Smart slot: Chat should be present because it's in modules and has priority
        expect(screen.getByLabelText('modules.chat.title')).toBeInTheDocument();
        expect(screen.getByLabelText('common.menu')).toBeInTheDocument();
    });

    it('prioritizes chat over finance in smart slot', () => {
        render(<BottomNavigation user={mockUser} project={mockProject} />);

        expect(screen.getByLabelText('modules.chat.title')).toBeInTheDocument();
        expect(screen.queryByLabelText('modules.finance')).not.toBeInTheDocument();
    });

    it('shows finance if chat is not available', () => {
        const financeProject = { ...mockProject, modules: ['finance'] };
        render(<BottomNavigation user={mockUser} project={financeProject} />);

        expect(screen.getByLabelText('modules.finance')).toBeInTheDocument();
        expect(screen.queryByLabelText('modules.chat')).not.toBeInTheDocument();
    });

    it('shows unread messages badge on Chat icon', () => {
        render(<BottomNavigation user={mockUser} project={mockProject} />);
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('opens navigation sheet when menu is clicked', () => {
        render(<BottomNavigation user={mockUser} project={mockProject} />);

        const menuButton = screen.getByLabelText('common.menu');
        fireEvent.click(menuButton);

        expect(screen.getByTestId('navigation-sheet')).toBeInTheDocument();
    });

    it('closes navigation sheet when close clicked', () => {
        render(<BottomNavigation user={mockUser} />);

        const menuButton = screen.getByLabelText('common.menu');
        fireEvent.click(menuButton);

        // Assuming NavigationSheet has a close button or we click outside
        // For this test, we might need to mock NavigationSheet behavior or check its props
        // But since we are testing BottomNavigation integration:
        const closeButton = screen.getByLabelText('common.close'); // NavigationSheet should have this
        fireEvent.click(closeButton);

        expect(screen.queryByTestId('navigation-sheet')).not.toBeInTheDocument();
    });
});
