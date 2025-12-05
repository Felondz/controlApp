import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '@/Components/Modal';

describe('Modal', () => {
    it('does not render when show is false', () => {
        render(
            <Modal show={false} onClose={() => { }}>
                <div>Modal Content</div>
            </Modal>
        );
        expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
    });

    it('renders content when show is true', () => {
        render(
            <Modal show={true} onClose={() => { }}>
                <div>Modal Content</div>
            </Modal>
        );
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('calls onClose when clicking the close button (if applicable) or backdrop', () => {
        // Note: The current Modal implementation might rely on Headless UI's Dialog which handles backdrop clicks.
        // Testing Headless UI interactions in JSDOM can be tricky without full setup, 
        // but we can check if the component renders.
        const handleClose = vi.fn();
        render(
            <Modal show={true} onClose={handleClose}>
                <div>Modal Content</div>
            </Modal>
        );

        // Assuming there is a way to trigger close, e.g., escape key
        fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
        expect(handleClose).toHaveBeenCalled();
    });
});
