import { render } from '@testing-library/react';
import * as Icons from '@/Components/Icons';

describe('Icons', () => {
    it('renders all icons correctly', () => {
        Object.entries(Icons).forEach(([name, IconComponent]) => {
            const { container } = render(<IconComponent data-testid={`icon-${name}`} />);
            const svg = container.querySelector('svg');

            expect(svg).toBeInTheDocument();
            expect(svg).toHaveAttribute('data-testid', `icon-${name}`);
        });
    });

    it('passes props to icons', () => {
        const { AppIcon } = Icons;
        const { container } = render(<AppIcon className="w-10 h-10 text-red-500" />);

        const svg = container.querySelector('svg');
        expect(svg).toHaveClass('w-10');
        expect(svg).toHaveClass('h-10');
        expect(svg).toHaveClass('text-red-500');
    });
});
