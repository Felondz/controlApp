import colors from 'tailwindcss/colors';

/**
 * Scarlet Red Theme
 * 
 * Bold and energetic red theme.
 * Includes light and dark mode variants.
 */
export default {
    id: 'scarlet-red',
    name: 'Scarlet Red',

    // Primary color for the theme
    colors: {
        primary: colors.red,
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
            light: 'bg-red-50 text-red-800',
            dark: 'bg-red-900/30 text-red-300',
        },
        // Inactive navigation item (enabled but not selected)
        inactive: {
            light: 'text-red-700 opacity-70 hover:opacity-100',
            dark: 'text-red-300 opacity-60 hover:opacity-100',
        },
        // Disabled navigation item
        disabled: {
            light: 'text-red-500 opacity-50',
            dark: 'text-red-400 opacity-50',
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
            light: 'text-red-800',
            dark: 'text-red-300',
        },
        inactive: {
            light: 'text-red-700',
            dark: 'text-red-300',
        },
        disabled: {
            light: 'text-red-400',
            dark: 'text-red-500',
        },
    },

    // Button styles
    buttons: {
        primary: {
            light: 'bg-red-700 hover:bg-red-800 text-white',
            dark: 'bg-red-600 hover:bg-red-500 text-white',
        },
        secondary: {
            light: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
            dark: 'bg-gray-700 hover:bg-gray-600 text-gray-100',
        },
    },
};
