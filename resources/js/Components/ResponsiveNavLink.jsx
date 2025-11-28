import { Link } from '@inertiajs/react';
import { getResponsiveNavLinkClasses } from '@/Utils/navStyles';
import { useGlobalTheme } from '@/Contexts/GlobalThemeContext';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    collapsed = false,
    ...props
}) {
    const { theme, isDark } = useGlobalTheme();

    return (
        <Link
            {...props}
            className={`${getResponsiveNavLinkClasses(theme, isDark, active, collapsed)} ${className}`}
        >
            {children}
        </Link>
    );
}
