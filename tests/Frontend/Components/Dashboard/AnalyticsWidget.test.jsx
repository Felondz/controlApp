import { render, screen, waitFor } from '@testing-library/react';
import AnalyticsWidget from '@/Components/Dashboard/AnalyticsWidget';
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
    ChartBarIcon: () => <div data-testid="icon-chart" />,
    CurrencyDollarIcon: () => <div data-testid="icon-currency" />,
    ArrowTrendingUpIcon: () => <div data-testid="icon-trending-up" />,
    ArrowTrendingDownIcon: () => <div data-testid="icon-trending-down" />,
}));

// Mock Recharts
vi.mock('recharts', () => {
    const OriginalModule = vi.importActual('recharts');
    return {
        ...OriginalModule,
        ResponsiveContainer: ({ children }) => <div style={{ width: 500, height: 300 }}>{children}</div>,
        BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
        Bar: () => <div data-testid="bar" />,
        XAxis: () => <div data-testid="x-axis" />,
        YAxis: () => <div data-testid="y-axis" />,
        CartesianGrid: () => <div data-testid="cartesian-grid" />,
        Tooltip: () => <div data-testid="tooltip" />,
        Legend: () => <div data-testid="legend" />,
    };
});

describe('AnalyticsWidget', () => {
    const mockProject = { id: 1, moneda_default: 'USD' };
    const mockData = {
        total_income: 5000,
        total_expenses: 2000,
        net_balance: 3000,
        monthly_data: []
    };

    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockData });
    });

    it('renders loading state initially', () => {
        render(<AnalyticsWidget project={mockProject} />);
        const pulseElements = document.getElementsByClassName('animate-pulse');
        expect(pulseElements.length).toBeGreaterThan(0);
    });

    it('renders analytics data after fetching', async () => {
        render(<AnalyticsWidget project={mockProject} />);

        await waitFor(() => {
            expect(screen.getByText('Analíticas del Proyecto')).toBeInTheDocument();
            expect(screen.getByText('Ingresos Totales')).toBeInTheDocument();
            expect(screen.getByText('Gastos Totales')).toBeInTheDocument();
            expect(screen.getByText('Balance Neto')).toBeInTheDocument();
        });

        // Check values (formatted)
        // Note: Intl.NumberFormat might behave differently in test env, so checking partial match or mocking it might be safer.
        // But let's try to match the mock data values if they appear in some form.
        // Since we mock useTranslate, the labels are fixed.
    });

    it('renders chart components', async () => {
        render(<AnalyticsWidget project={mockProject} />);

        await waitFor(() => {
            expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
        });
    });

    it('handles error state', async () => {
        axios.get.mockRejectedValue(new Error('Network error'));
        render(<AnalyticsWidget project={mockProject} />);

        await waitFor(() => {
            expect(screen.getByText('Failed to load analytics data')).toBeInTheDocument();
        });
    });
});
