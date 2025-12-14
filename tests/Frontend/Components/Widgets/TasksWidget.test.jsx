import { render, screen } from '@testing-library/react';
import TasksWidget from '@/Modules/Tasks/Widgets/TasksWidget';

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
        // Component renders: {dueToday} {t('tasks.due_today', 'vencen hoy')}
        // With mock, t returns the key, so we look for the key
        expect(screen.getByText(/tasks\.due_today/)).toBeInTheDocument();
    });

    // Note: Since the component uses hardcoded mock data for now, we can't test different states easily 
    // without modifying the component to accept props for stats. 
    // But for now, we test what's there.
});
