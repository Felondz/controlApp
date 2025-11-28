import colors from 'tailwindcss/colors';

/**
 * Ocean Blue Theme
 * 
 * Calm and professional blue theme inspired by the ocean.
 * Includes light and dark mode variants.
 */
export default {
    id: 'ocean-blue',
    name: 'Ocean Blue',

    // Primary color for the theme
    colors: {
        primary: colors.cyan,
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
            light: 'bg-cyan-50 text-cyan-800',
            dark: 'bg-cyan-900/30 text-cyan-300',
        },
        // Inactive navigation item (enabled but not selected)
        inactive: {
            light: 'text-cyan-700 opacity-70 hover:opacity-100',
            dark: 'text-cyan-300 opacity-60 hover:opacity-100',
        },
        // Disabled navigation item
        disabled: {
            light: 'text-cyan-500 opacity-50',
            dark: 'text-cyan-400 opacity-50',
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
            light: 'text-cyan-800',
            dark: 'text-cyan-300',
        },
        inactive: {
            light: 'text-cyan-700',
            dark: 'text-cyan-300',
        },
        disabled: {
            light: 'text-cyan-400',
            dark: 'text-cyan-500',
        },
    },

    // Button styles
    buttons: {
        primary: {
            light: 'bg-cyan-700 hover:bg-cyan-800 text-white',
            dark: 'bg-cyan-600 hover:bg-cyan-500 text-white',
        },
        secondary: {
            light: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
            dark: 'bg-gray-700 hover:bg-gray-600 text-gray-100',
        },
    },
};
