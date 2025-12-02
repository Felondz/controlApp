import { render, screen } from '@testing-library/react';
import TasksWidget from '@/Components/Widgets/TasksWidget';

describe('TasksWidget', () => {
    const mockProject = {};

    it('renders pending tasks count', () => {
        render(<TasksWidget project={mockProject} />);

        // Mock data is 4 pending tasks
        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('tasks.pending')).toBeInTheDocument();
    });

    it('renders due today warning if tasks due', () => {
        render(<TasksWidget project={mockProject} />);

        // Mock data has 2 due today
        expect(screen.getByText('2 tasks.due_today')).toBeInTheDocument();
    });

    // Note: Since the component uses hardcoded mock data for now, we can't test different states easily 
    // without modifying the component to accept props for stats. 
    // But for now, we test what's there.
});
