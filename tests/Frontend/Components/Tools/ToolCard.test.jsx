import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ToolCard from '@/Components/Tools/ToolCard';
import { CalculatorIcon } from '@/Components/Icons';

describe('ToolCard', () => {
    const mockTool = {
        id: 'calculator',
        name: 'Calculator',
        description: 'A useful calculator',
        icon: CalculatorIcon,
        route: 'tools.calculator',
        color: 'bg-blue-500',
        disabled: false
    };

    const mockOnToggle = vi.fn();

    beforeEach(() => {
        mockOnToggle.mockClear();
    });

    it('renders enabled tool correctly', () => {
        render(<ToolCard tool={mockTool} isEnabled={true} onToggle={mockOnToggle} />);

        expect(screen.getByText('Calculator')).toBeInTheDocument();
        expect(screen.getByText('A useful calculator')).toBeInTheDocument();
        expect(screen.getByText('common.active')).toBeInTheDocument();
        expect(screen.getByText('common.open')).not.toHaveClass('opacity-50');
    });

    it('renders disabled (inactive) tool correctly', () => {
        render(<ToolCard tool={mockTool} isEnabled={false} onToggle={mockOnToggle} />);

        expect(screen.getByText('Calculator')).toBeInTheDocument();
        expect(screen.queryByText('common.active')).not.toBeInTheDocument();
        expect(screen.getByText('common.open')).toHaveClass('opacity-50');
    });

    it('renders unavailable tool correctly', () => {
        const unavailableTool = { ...mockTool, disabled: true };
        render(<ToolCard tool={unavailableTool} isEnabled={false} onToggle={mockOnToggle} />);

        expect(screen.getByText('common.coming_soon')).toBeInTheDocument();
        expect(screen.getByText('common.unavailable')).toBeInTheDocument();
        expect(screen.getByText('common.unavailable')).toBeDisabled();
    });

    it('calls onToggle with false when deactivating', () => {
        render(<ToolCard tool={mockTool} isEnabled={true} onToggle={mockOnToggle} />);

        fireEvent.click(screen.getByText('common.deactivate'));
        expect(mockOnToggle).toHaveBeenCalledWith('calculator', false);
    });

    it('calls onToggle with true when activating', () => {
        render(<ToolCard tool={mockTool} isEnabled={false} onToggle={mockOnToggle} />);

        fireEvent.click(screen.getByText('common.activate'));
        expect(mockOnToggle).toHaveBeenCalledWith('calculator', true);
    });
});
