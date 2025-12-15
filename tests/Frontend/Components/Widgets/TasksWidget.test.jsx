import { render, screen } from '@testing-library/react';
import TasksWidget from '@/Modules/Tasks/Widgets/TasksWidget';

describe('TasksWidget', () => {
    const mockProject = {};

    it('renders pending tasks count', () => {
        const projectWithPending = { pending_tasks_count: 4 };
        render(<TasksWidget project={projectWithPending} />);

        // Mock data is 4 pending tasks
        // Use a function matcher because text might be split across elements or have extra whitespace
        expect(screen.getByText((content, element) => {
            return element.tagName.toLowerCase() === 'p' && content === '4';
        })).toBeInTheDocument();
        expect(screen.getByText((content) => content.includes('tasks.pending'))).toBeInTheDocument();
    });

    it('renders due today warning if tasks due', () => {
        // Mock project with tasks due today
        const projectWithDueTasks = { pending_tasks_count: 5, due_today_count: 2 };
        render(<TasksWidget project={projectWithDueTasks} />);

        // Helper to match text across elements if needed, or just look for the key part
        const warningElement = screen.getByText((content) => content.includes('tasks.due_today'));
        expect(warningElement).toBeInTheDocument();
        expect(warningElement).toHaveTextContent('2'); // Check if the count '2' is present in the text content
    });

    // Note: Since the component uses hardcoded mock data for now, we can't test different states easily 
    // without modifying the component to accept props for stats. 
    // But for now, we test what's there.
});
