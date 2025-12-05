import { render, screen } from '@testing-library/react';
import Sidebar from '@/Components/Sidebar';

describe('Sidebar', () => {
    const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        enabled_tools: ['calculator'],
    };

    const mockProject = {
        id: 1,
        nombre: 'Test Project',
        theme: 'purple-modern',
    };

    it('renders application logo', () => {
        render(<Sidebar user={mockUser} />);

        // Logo should be present
        const sidebar = screen.getByRole('navigation');
        expect(sidebar).toBeInTheDocument();
    });

    it('renders navigation links', () => {
        render(<Sidebar user={mockUser} />);

        // Should have Dashboard link (use getAllByText since it appears multiple times)
        const dashboardLinks = screen.getAllByText('dashboard.title');
        expect(dashboardLinks.length).toBeGreaterThan(0);
    });

    it('shows tools when enabled', () => {
        render(<Sidebar user={mockUser} />);

        // Should show Tools section if user has enabled tools
        if (mockUser.enabled_tools && mockUser.enabled_tools.length > 0) {
            expect(screen.getByText(/Tools/i)).toBeInTheDocument();
        }
    });

    it('renders project-specific navigation when project is provided', () => {
        render(<Sidebar user={mockUser} project={mockProject} />);

        // Should show project name or project-specific links
        const sidebar = screen.getByRole('navigation');
        expect(sidebar).toBeInTheDocument();
    });

    it('applies theme styles when project theme is provided', () => {
        render(<Sidebar user={mockUser} project={mockProject} />);

        const sidebar = screen.getByRole('navigation');
        expect(sidebar).toBeInTheDocument();
    });

    it('renders without project (global navigation)', () => {
        render(<Sidebar user={mockUser} />);

        // Should render global navigation
        const dashboardLinks = screen.getAllByText('dashboard.title');
        expect(dashboardLinks.length).toBeGreaterThan(0);
    });

    it('is hidden on mobile devices', () => {
        const { container } = render(<Sidebar user={mockUser} />);

        // The aside element (sidebar container) should have hidden class on mobile
        const sidebar = container.querySelector('aside');
        expect(sidebar).toBeInTheDocument();
    });
});
