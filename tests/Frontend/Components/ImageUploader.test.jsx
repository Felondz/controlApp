import { render, screen, fireEvent } from '@testing-library/react';
import ImageUploader from '@/Components/ImageUploader';

describe('ImageUploader', () => {
    const mockOnChange = vi.fn();
    const mockOnDelete = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders upload button when no preview', () => {
        render(<ImageUploader onChange={mockOnChange} label="Upload Image" />);

        expect(screen.getByText('Upload Image')).toBeInTheDocument();
        // "Subir" appears twice (normal and hover state), so use getAllByText
        const subirElements = screen.getAllByText('Subir');
        expect(subirElements.length).toBe(2);
    });

    it('shows preview when image is provided', () => {
        const previewUrl = 'https://example.com/image.jpg';
        render(<ImageUploader onChange={mockOnChange} preview={previewUrl} />);

        const image = screen.getByAltText('Preview');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', previewUrl);
    });

    it('handles file selection', () => {
        render(<ImageUploader onChange={mockOnChange} />);

        const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
        const input = document.querySelector('input[type="file"]');

        fireEvent.change(input, { target: { files: [file] } });

        expect(mockOnChange).toHaveBeenCalledWith(file);
    });

    it('shows delete button for existing image when enabled', () => {
        render(
            <ImageUploader
                onChange={mockOnChange}
                onDelete={mockOnDelete}
                preview="https://example.com/image.jpg"
                showDeleteButton={true}
                shape="circle"
            />
        );

        expect(screen.getByText('Quitar')).toBeInTheDocument();
    });

    it('calls onDelete when delete button is clicked', () => {
        render(
            <ImageUploader
                onChange={mockOnChange}
                onDelete={mockOnDelete}
                preview="https://example.com/image.jpg"
                showDeleteButton={true}
                shape="circle"
            />
        );

        const deleteButton = screen.getByText('Quitar');
        fireEvent.click(deleteButton);

        expect(mockOnDelete).toHaveBeenCalled();
    });

    it('displays error message when provided', () => {
        const errorMessage = 'File is too large';
        render(<ImageUploader onChange={mockOnChange} error={errorMessage} />);

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('displays hint text when provided and no error', () => {
        const hintText = 'Maximum 4MB';
        render(<ImageUploader onChange={mockOnChange} hint={hintText} />);

        expect(screen.getByText(hintText)).toBeInTheDocument();
    });

    it('hides hint when error is present', () => {
        const hintText = 'Maximum 4MB';
        const errorMessage = 'File is too large';
        render(<ImageUploader onChange={mockOnChange} hint={hintText} error={errorMessage} />);

        expect(screen.queryByText(hintText)).not.toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('renders with square shape by default', () => {
        const { container } = render(<ImageUploader onChange={mockOnChange} />);

        const preview = container.querySelector('.rounded-xl');
        expect(preview).toBeInTheDocument();
    });

    it('renders with circle shape when specified', () => {
        const { container } = render(<ImageUploader onChange={mockOnChange} shape="circle" />);

        const preview = container.querySelector('.rounded-full');
        expect(preview).toBeInTheDocument();
    });

    it('applies correct size classes', () => {
        const { container } = render(<ImageUploader onChange={mockOnChange} size="lg" />);

        const preview = container.querySelector('.h-32');
        expect(preview).toBeInTheDocument();
    });

    it('accepts only image files', () => {
        render(<ImageUploader onChange={mockOnChange} />);

        const input = document.querySelector('input[type="file"]');
        expect(input).toHaveAttribute('accept', 'image/*');
    });
});
