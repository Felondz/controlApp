import colors from 'tailwindcss/colors';

/**
 * Amber Gold Theme
 * 
 * Warm and professional amber/gold theme.
 * Includes light and dark mode variants.
 */
export default {
    id: 'amber-gold',
    name: 'Amber Gold',

    // Primary color for the theme
    colors: {
        primary: colors.amber,
        secondary: colors.gray,
        success: colors.green,
        warning: colors.amber,
        danger: colors.red,
        info: colors.blue,
    },

    // Navigation styles (for Sidebar, BottomNav, Dropdown)
    navigation: {
        // Active navigation item
        active: {
            light: 'bg-amber-50 text-amber-800',
            dark: 'bg-amber-900/30 text-amber-300',
        },
        // Inactive navigation item (enabled but not selected)
        inactive: {
            light: 'text-amber-700 opacity-70 hover:opacity-100',
            dark: 'text-amber-300 opacity-60 hover:opacity-100',
        },
        // Disabled navigation item
        disabled: {
            light: 'text-amber-500 opacity-50',
            dark: 'text-amber-400 opacity-50',
        },
        // Hover background
        hover: {
            light: 'hover:bg-gray-100',
            dark: 'hover:bg-gray-700',
        },
    },

    // Icon colors
    icons: {
        active: {
            light: 'text-amber-800',
            dark: 'text-amber-300',
        },
        inactive: {
            light: 'text-amber-700',
            dark: 'text-amber-300',
        },
        disabled: {
            light: 'text-amber-400',
            dark: 'text-amber-500',
        },
    },

    // Button styles
    buttons: {
        primary: {
            light: 'bg-amber-700 hover:bg-amber-800 text-white',
            dark: 'bg-amber-600 hover:bg-amber-500 text-white',
        },
        secondary: {
            light: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
            dark: 'bg-gray-700 hover:bg-gray-600 text-gray-100',
        },
    },
};
