import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ToolsSheet from '@/Components/ToolsSheet';

// Mock Headless UI Dialog and Transition
vi.mock('@headlessui/react', () => {
    const MockDialog = ({ children, onClose, className }) => (
        <div role="dialog" className={className}>
            <button onClick={onClose}>Close Dialog</button>
            {children}
        </div>
    );
    MockDialog.Panel = ({ children, className }) => <div className={className}>{children}</div>;
    MockDialog.Title = ({ children, className }) => <h2 className={className}>{children}</h2>;

    const MockTransition = ({ children, show }) => show ? children : null;
    MockTransition.Child = ({ children }) => children;

    return {
        Dialog: MockDialog,
        Transition: MockTransition,
    };
});

describe('ToolsSheet', () => {
    const mockOnClose = vi.fn();

    beforeEach(() => {
        mockOnClose.mockClear();
        // Mock route
        global.route = vi.fn((name) => `/${name}`);
    });

    it('renders nothing when isOpen is false', () => {
        render(<ToolsSheet isOpen={false} onClose={mockOnClose} />);

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders sheet when isOpen is true', () => {
        render(<ToolsSheet isOpen={true} onClose={mockOnClose} />);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('dashboard.tools')).toBeInTheDocument();
    });

    it('renders available tools', () => {
        render(<ToolsSheet isOpen={true} onClose={mockOnClose} />);

        expect(screen.getByText('dashboard.calendar')).toBeInTheDocument();
        expect(screen.getByText('dashboard.calculator')).toBeInTheDocument();
    });

    it('renders disabled tools correctly', () => {
        render(<ToolsSheet isOpen={true} onClose={mockOnClose} />);

        const calendarButton = screen.getByText('dashboard.calendar').closest('button');
        expect(calendarButton).toBeDisabled();
        expect(screen.getByText('common.coming_soon')).toBeInTheDocument();
    });

    it('renders enabled tools as links', () => {
        render(<ToolsSheet isOpen={true} onClose={mockOnClose} />);

        const calculatorLink = screen.getByText('dashboard.calculator').closest('a');
        expect(calculatorLink).toHaveAttribute('href', '/tools.calculator');
    });

    it('calls onClose when clicking close button (mocked)', () => {
        render(<ToolsSheet isOpen={true} onClose={mockOnClose} />);

        fireEvent.click(screen.getByText('Close Dialog'));
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('calls onClose when clicking a tool link', () => {
        render(<ToolsSheet isOpen={true} onClose={mockOnClose} />);

        const calculatorLink = screen.getByText('dashboard.calculator').closest('a');
        fireEvent.click(calculatorLink);

        expect(mockOnClose).toHaveBeenCalled();
    });
});
