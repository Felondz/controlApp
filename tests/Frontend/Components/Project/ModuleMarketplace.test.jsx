import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ModuleMarketplace from '@/Components/Project/ModuleMarketplace';
import axios from 'axios';
import { vi } from 'vitest';

// Mock axios
vi.mock('axios');

// Mock useTranslate
vi.mock('@/Hooks/useTranslate', () => ({
    useTranslate: () => ({
        t: (key, defaultVal) => defaultVal || key,
    }),
}));

// Mock Icons
vi.mock('@/Components/Icons', () => ({
    CurrencyDollarIcon: () => <div data-testid="icon-finance" />,
    CheckListIcon: () => <div data-testid="icon-tasks" />,
    ChatIcon: () => <div data-testid="icon-chat" />,
    ChartBarIcon: () => <div data-testid="icon-analytics" />,
    BellIcon: () => <div data-testid="icon-notifications" />,
    PuzzleIcon: () => <div data-testid="icon-default" />,
    CheckCircleIcon: () => <div data-testid="icon-check" />,
    WarningIcon: () => <div data-testid="icon-warning" />,
    FactoryIcon: () => <div data-testid="icon-operations" />,
    PackageIcon: () => <div data-testid="icon-inventory" />,
    UsersIcon: () => <div data-testid="icon-crm" />,
}));

describe('ModuleMarketplace', () => {
    const mockProject = { id: 1, uuid: 'project-uuid-1' };
    const mockModules = [
        {
            id: 'finance',
            name: 'Finance',
            description: 'Finance module',
            enabled: true,
            required: false,
            dependencies: []
        },
        {
            id: 'analytics',
            name: 'Analytics',
            description: 'Analytics module',
            enabled: false,
            required: false,
            dependencies: ['finance']
        }
    ];

    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockModules });
        axios.post.mockResolvedValue({ data: { active_modules: ['finance', 'analytics'] } });
    });

    it('renders loading state initially', () => {
        render(<ModuleMarketplace project={mockProject} />);
        // Check for pulse animation class or structure
        const pulseElements = document.getElementsByClassName('animate-pulse');
        expect(pulseElements.length).toBeGreaterThan(0);
    });

    it('renders modules after fetching', async () => {
        render(<ModuleMarketplace project={mockProject} />);

        await waitFor(() => {
            expect(screen.getByText('Finance')).toBeInTheDocument();
            expect(screen.getByText('Analytics')).toBeInTheDocument();
        });

        expect(screen.getByText('Finance module')).toBeInTheDocument();
        expect(screen.getByText('Analytics module')).toBeInTheDocument();
    });

    it('displays active status for enabled modules', async () => {
        render(<ModuleMarketplace project={mockProject} />);

        await waitFor(() => {
            expect(screen.getByText('Activo')).toBeInTheDocument();
        });
    });

    it('displays dependency warnings', async () => {
        render(<ModuleMarketplace project={mockProject} />);

        await waitFor(() => {
            expect(screen.getByText(/Requiere/)).toBeInTheDocument();
            expect(screen.getByText(/finance/)).toBeInTheDocument();
        });
    });

    it('toggles module when clicked', async () => {
        render(<ModuleMarketplace project={mockProject} />);

        await waitFor(() => {
            expect(screen.getByText('Analytics')).toBeInTheDocument();
        });

        const toggleButton = screen.getAllByRole('button')[1]; // Second button (Analytics)
        fireEvent.click(toggleButton);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining('/api.proyectos.marketplace.toggle/project-uuid-1/analytics'),
                { enable: true }
            );
        });
    });
});
