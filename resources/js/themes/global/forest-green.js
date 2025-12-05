import colors from 'tailwindcss/colors';

/**
 * Forest Green Theme
 * 
 * Natural and fresh green theme inspired by forests.
 * Includes light and dark mode variants.
 */
export default {
    id: 'forest-green',
    name: 'Forest Green',

    // Primary color for the theme
    colors: {
        primary: colors.emerald,
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
            light: 'bg-emerald-50 text-emerald-800',
            dark: 'bg-emerald-900/30 text-emerald-300',
        },
        // Inactive navigation item (enabled but not selected)
        inactive: {
            light: 'text-emerald-700 opacity-70 hover:opacity-100',
            dark: 'text-emerald-300 opacity-60 hover:opacity-100',
        },
        // Disabled navigation item
        disabled: {
            light: 'text-emerald-500 opacity-50',
            dark: 'text-emerald-400 opacity-50',
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
            light: 'text-emerald-800',
            dark: 'text-emerald-300',
        },
        inactive: {
            light: 'text-emerald-700',
            dark: 'text-emerald-300',
        },
        disabled: {
            light: 'text-emerald-400',
            dark: 'text-emerald-500',
        },
    },

    // Button styles
    buttons: {
        primary: {
            light: 'bg-emerald-700 hover:bg-emerald-800 text-white',
            dark: 'bg-emerald-600 hover:bg-emerald-500 text-white',
        },
        secondary: {
            light: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
            dark: 'bg-gray-700 hover:bg-gray-600 text-gray-100',
        },
    },
};
