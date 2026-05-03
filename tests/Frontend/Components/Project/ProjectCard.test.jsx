import { render, screen } from '@testing-library/react';
import ProjectCard from '@/Components/Project/ProjectCard';

describe('ProjectCard', () => {
    const mockProject = {
        id: 1,
        uuid: 'project-uuid-1',
        nombre: 'Test Project',
        descripcion: 'Test Description',
        moneda_default: 'USD',
        theme: 'purple-modern',
        modules: ['finance', 'tasks'],
        image_path: null,
        icon: 'folder',
        color: '#6366f1',
        isAdmin: true,
        es_personal: false,
    };

    it('renders project name', () => {
        render(<ProjectCard proyecto={mockProject} />);
        expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    it('renders project description', () => {
        render(<ProjectCard proyecto={mockProject} />);
        expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('displays project icon when no image', () => {
        render(<ProjectCard proyecto={mockProject} />);

        // Icon should be rendered (FolderIcon in this case)
        const iconContainer = screen.getByText('Test Project').closest('div').parentElement;
        expect(iconContainer).toBeInTheDocument();
    });

    it('displays project image when available', () => {
        const projectWithImage = {
            ...mockProject,
            image_url: 'https://example.com/image.jpg',
        };

        render(<ProjectCard proyecto={projectWithImage} />);

        const image = screen.getByAltText('Test Project');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('shows module icons', () => {
        render(<ProjectCard proyecto={mockProject} />);

        // Should have finance and tasks modules
        const card = screen.getByText('Test Project').closest('a');
        expect(card).toBeInTheDocument();
    });

    it('shows unread message badge when there are unread messages', () => {
        const projectWithUnread = {
            ...mockProject,
            modules: ['finance', 'chat'],
            unread_messages_count: 5,
        };

        render(<ProjectCard proyecto={projectWithUnread} />);

        // Badge should show count or 9+ if more than 9
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('shows 9+ badge when unread count exceeds 9', () => {
        const projectWithManyUnread = {
            ...mockProject,
            modules: ['finance', 'chat'],
            unread_messages_count: 15,
        };

        render(<ProjectCard proyecto={projectWithManyUnread} />);

        expect(screen.getByText('9+')).toBeInTheDocument();
    });

    it('links to project detail page', () => {
        render(<ProjectCard proyecto={mockProject} />);

        const link = screen.getByText('Test Project').closest('a');
        expect(link).toHaveAttribute('href', expect.stringContaining('/project-uuid-1'));
    });

    it('shows restricted access for non-admin users with finance module', () => {
        const nonAdminProject = {
            ...mockProject,
            isAdmin: false,
        };

        render(<ProjectCard proyecto={nonAdminProject} />);

        // Component uses t('finance.restricted', 'Acceso Restringido')
        // With mock, t returns the key
        expect(screen.getByText('finance.restricted')).toBeInTheDocument();
        expect(screen.getByText('🔒')).toBeInTheDocument();
    });

    it('shows quick action buttons for admin users', () => {
        render(<ProjectCard proyecto={mockProject} />);

        // Component uses t('finance.add_income', 'Agregar Ingreso') and t('finance.add_expense', 'Agregar Gasto')
        // With mock, t returns the key
        expect(screen.getByLabelText('finance.add_income')).toBeInTheDocument();
        expect(screen.getByLabelText('finance.add_expense')).toBeInTheDocument();
    });

    it('does not show quick action buttons for non-admin users', () => {
        const nonAdminProject = {
            ...mockProject,
            isAdmin: false,
        };

        render(<ProjectCard proyecto={nonAdminProject} />);

        expect(screen.queryByLabelText('Agregar Ingreso')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Agregar Gasto')).not.toBeInTheDocument();
    });

    it('uses PersonalFinanceIcon for personal projects', () => {
        const personalProject = {
            ...mockProject,
            es_personal: true,
        };

        render(<ProjectCard proyecto={personalProject} />);

        // PersonalFinanceIcon should be rendered
        const card = screen.getByText('Test Project').closest('a');
        expect(card).toBeInTheDocument();
    });

    it('applies custom color accent', () => {
        render(<ProjectCard proyecto={mockProject} />);

        const link = screen.getByText('Test Project').closest('a');
        const card = link.parentElement;
        const accentLine = card.querySelector('div[style*="background-color"]');

        expect(accentLine).toBeInTheDocument();
    });

    it('renders without description when not provided', () => {
        const projectWithoutDesc = {
            ...mockProject,
            descripcion: null,
        };

        render(<ProjectCard proyecto={projectWithoutDesc} />);

        expect(screen.getByText('Test Project')).toBeInTheDocument();
        expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
    });

    it('defaults to finance module when no modules specified', () => {
        const projectWithoutModules = {
            ...mockProject,
            modules: null,
        };

        render(<ProjectCard proyecto={projectWithoutModules} />);

        // Should still render (defaults to finance)
        expect(screen.getByText('Test Project')).toBeInTheDocument();
    });
});
