/**
 * Centralized Navigation Styles using Dynamic Theme System
 * 
 * This file provides helper functions that return style classes based on:
 * - Dynamic CSS variables (primary color)
 * - Dark mode state (via dark: variant)
 * - Component state (active, inactive, disabled)
 */

/**
 * Get ResponsiveNavLink classes (Sidebar)
 */
export const getResponsiveNavLinkClasses = (themeId, isDark, active, collapsed) => {
    const baseClasses = 'flex w-full items-center rounded-md transition-all duration-200 ease-in-out focus:outline-none';
    const sizeClasses = collapsed ? 'justify-center px-2 py-2' : 'px-4 py-2 text-left';
    const fontWeight = active ? 'font-semibold' : 'font-medium';

    // Dynamic classes using CSS variables
    const activeClasses = 'bg-primary-50/50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-l-2 border-primary-500 dark:border-primary-400';
    const inactiveClasses = 'text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 border-l-4 border-transparent hover:border-primary-200 dark:hover:border-primary-600';

    const stateClasses = active ? activeClasses : inactiveClasses;

    return `${baseClasses} ${sizeClasses} ${stateClasses} ${fontWeight}`;
};

/**
 * Get BottomNavigation classes (Mobile)
 */
export const getBottomNavClasses = (themeId, isDark, isActive, isDisabled, hasAction) => {
    const baseClasses = 'flex flex-col items-center justify-center gap-1 transition-all';

    if (isDisabled) {
        return `${baseClasses} text-gray-300 dark:text-gray-600 cursor-not-allowed`;
    }

    if (hasAction) {
        return `${baseClasses} text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200`;
    }

    const activeClasses = 'text-primary-600 dark:text-primary-400 opacity-100';
    const inactiveClasses = 'text-gray-500 dark:text-gray-400';

    return isActive
        ? `${baseClasses} ${activeClasses}`
        : `${baseClasses} ${inactiveClasses}`;
};

/**
 * Get DropdownLink classes
 */
export const getDropdownLinkClasses = (themeId, isDark, active) => {
    const baseClasses = 'block w-full px-4 py-2 text-start text-sm leading-5 transition duration-150 ease-in-out focus:outline-none';
    const fontWeight = active ? 'font-semibold' : '';

    const activeClasses = 'bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-300';
    const inactiveClasses = 'text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/10 hover:text-primary-700 dark:hover:text-primary-300';

    const stateClasses = active ? activeClasses : inactiveClasses;

    return `${baseClasses} ${stateClasses} ${fontWeight}`;
};

/**
 * Get button classes based on variant
 */
export const getButtonClasses = (themeId, isDark, variant = 'primary') => {
    const baseClasses = 'inline-flex items-center px-4 py-2 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest transition ease-in-out duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2';

    if (variant === 'danger') {
        return `${baseClasses} bg-red-600 hover:bg-red-500 text-white focus:ring-red-500 dark:focus:ring-offset-gray-800`;
    }

    if (variant === 'secondary') {
        return `${baseClasses} bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-primary-500 dark:focus:ring-offset-gray-800`;
    }

    // Primary
    return `${baseClasses} bg-primary-700 hover:bg-primary-800 text-white active:bg-primary-900 focus:ring-primary-500 dark:bg-primary-600 dark:hover:bg-primary-500 dark:focus:ring-offset-gray-800`;
};
