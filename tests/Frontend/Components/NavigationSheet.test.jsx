import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import NavigationSheet from '@/Components/NavigationSheet';

describe('NavigationSheet', () => {
    const mockUser = {
        id: 1,
        name: 'Test User',
        enabled_tools: ['financial-calculator']
    };

    const mockProject = {
        id: 1,
        nombre: 'Test Project',
        modules: ['finance', 'chat', 'tasks'],
        unread_messages_count: 3
    };

    beforeEach(() => {
        global.route = vi.fn((name) => {
            if (name === 'mis-proyectos.finance') return '/projects/1/finance';
            if (name === 'mis-proyectos.chat') return '/projects/1/chat';
            if (name === 'mis-proyectos.edit') return '/projects/1/edit';
            if (name === 'tools.index') return '/tools';
            if (name === 'tools.calculator') return '/tools/calculator';
            return '/';
        });
    });

    it('renders nothing when closed', () => {
        render(<NavigationSheet isOpen={false} user={mockUser} onClose={() => { }} />);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders global tools when open', () => {
        render(<NavigationSheet isOpen={true} user={mockUser} onClose={() => { }} />);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('dashboard.tools')).toBeInTheDocument();
        expect(screen.getByText('dashboard.marketplace')).toBeInTheDocument();
        expect(screen.getByText('dashboard.calculator')).toBeInTheDocument();
    });

    it('renders project modules when project provided', () => {
        render(<NavigationSheet isOpen={true} user={mockUser} project={mockProject} onClose={() => { }} />);

        expect(screen.getByText('Test Project')).toBeInTheDocument();
        expect(screen.getByText('modules.finance')).toBeInTheDocument();
        expect(screen.getByText('modules.chat.title')).toBeInTheDocument();
        expect(screen.getByText('projects.project_settings')).toBeInTheDocument();
    });

    it('shows badge on chat icon', () => {
        render(<NavigationSheet isOpen={true} user={mockUser} project={mockProject} onClose={() => { }} />);

        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('calls onClose when a link is clicked', () => {
        const handleClose = vi.fn();
        render(<NavigationSheet isOpen={true} user={mockUser} project={mockProject} onClose={handleClose} />);

        const financeLink = screen.getByText('modules.finance').closest('a');
        fireEvent.click(financeLink);

        expect(handleClose).toHaveBeenCalled();
    });

    it('renders disabled items correctly', () => {
        render(<NavigationSheet isOpen={true} user={mockUser} project={mockProject} onClose={() => { }} />);

        const tasksButton = screen.getByText('modules.tasks').closest('button');
        expect(tasksButton).toBeDisabled();
        expect(tasksButton).toHaveClass('opacity-50');
    });

    it('does not render disabled tools if not enabled for user', () => {
        const userNoTools = { ...mockUser, enabled_tools: [] };
        render(<NavigationSheet isOpen={true} user={userNoTools} onClose={() => { }} />);

        expect(screen.queryByText('dashboard.calculator')).not.toBeInTheDocument();
    });
});
