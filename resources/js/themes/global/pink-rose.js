import colors from 'tailwindcss/colors';

/**
 * Pink Rose Theme
 * 
 * Modern and elegant pink/rose theme with good contrast.
 * Includes light and dark mode variants.
 */
export default {
    id: 'pink-rose',
    name: 'Pink Rose',

    // Primary color for the theme
    colors: {
        primary: colors.pink,
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
            light: 'bg-pink-50 text-pink-800',
            dark: 'bg-pink-900/30 text-pink-300',
        },
        // Inactive navigation item (enabled but not selected)
        inactive: {
            light: 'text-pink-700 opacity-70 hover:opacity-100',
            dark: 'text-pink-300 opacity-60 hover:opacity-100',
        },
        // Disabled navigation item
        disabled: {
            light: 'text-pink-500 opacity-50',
            dark: 'text-pink-400 opacity-50',
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
            light: 'text-pink-800',
            dark: 'text-pink-300',
        },
        inactive: {
            light: 'text-pink-700',
            dark: 'text-pink-300',
        },
        disabled: {
            light: 'text-pink-400',
            dark: 'text-pink-500',
        },
    },

    // Button styles
    buttons: {
        primary: {
            light: 'bg-pink-700 hover:bg-pink-800 text-white',
            dark: 'bg-pink-600 hover:bg-pink-500 text-white',
        },
        secondary: {
            light: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
            dark: 'bg-gray-700 hover:bg-gray-600 text-gray-100',
        },
    },
};
