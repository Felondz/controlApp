import colors from 'tailwindcss/colors';

/**
 * Purple Modern Theme
 * 
 * Modern and vibrant purple theme for professional applications.
 * Includes light and dark mode variants.
 */
export default {
    id: 'purple-modern',
    name: 'Purple Modern',

    // Primary color for the theme
    colors: {
        primary: colors.purple,
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
            light: 'bg-purple-50 text-purple-700',
            dark: 'bg-purple-900/20 text-purple-400',
        },
        // Inactive navigation item (enabled but not selected)
        inactive: {
            light: 'text-purple-600 opacity-70 hover:opacity-100',
            dark: 'text-purple-400 opacity-60 hover:opacity-100',
        },
        // Disabled navigation item
        disabled: {
            light: 'text-purple-500 opacity-50',
            dark: 'text-purple-400 opacity-50',
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
            light: 'text-purple-700',
            dark: 'text-purple-400',
        },
        inactive: {
            light: 'text-purple-600',
            dark: 'text-purple-400',
        },
        disabled: {
            light: 'text-purple-400',
            dark: 'text-purple-500',
        },
    },

    // Button styles
    buttons: {
        primary: {
            light: 'bg-purple-600 hover:bg-purple-700 text-white',
            dark: 'bg-purple-600 hover:bg-purple-500 text-white',
        },
        secondary: {
            light: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
            dark: 'bg-gray-700 hover:bg-gray-600 text-gray-100',
        },
    },
};
