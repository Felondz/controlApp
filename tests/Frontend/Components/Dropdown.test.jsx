import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dropdown from '@/Components/Dropdown';

describe('Dropdown', () => {
    it('renders trigger', () => {
        render(
            <Dropdown>
                <Dropdown.Trigger>
                    <button>Trigger</button>
                </Dropdown.Trigger>
                <Dropdown.Content>
                    <div>Content</div>
                </Dropdown.Content>
            </Dropdown>
        );
        expect(screen.getByText('Trigger')).toBeInTheDocument();
        expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('toggles content on click', async () => {
        render(
            <Dropdown>
                <Dropdown.Trigger>
                    <button>Trigger</button>
                </Dropdown.Trigger>
                <Dropdown.Content>
                    <div>Content</div>
                </Dropdown.Content>
            </Dropdown>
        );

        fireEvent.click(screen.getByText('Trigger'));
        expect(screen.getByText('Content')).toBeInTheDocument();

        // Click again to close (might need to click outside depending on implementation)
        fireEvent.click(screen.getByText('Trigger'));
        // Wait for transition or state update
        await waitFor(() => {
            expect(screen.queryByText('Content')).not.toBeInTheDocument();
        });
    });
});
