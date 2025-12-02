import { render, screen } from '@testing-library/react';
import PrimaryButton from '@/Components/PrimaryButton';

describe('PrimaryButton', () => {
    it('renders children correctly', () => {
        render(<PrimaryButton>Click Me</PrimaryButton>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('renders as a button', () => {
        render(<PrimaryButton>Submit</PrimaryButton>);
        const button = screen.getByRole('button', { name: /submit/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('inline-flex items-center');
    });
});
