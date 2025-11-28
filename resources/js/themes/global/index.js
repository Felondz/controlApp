import purpleModern from './purple-modern';
import oceanBlue from './ocean-blue';
import forestGreen from './forest-green';
import scarletRed from './scarlet-red';
import amberGold from './amber-gold';
import pinkRose from './pink-rose';

/**
 * Available global themes
 */
export const availableThemes = {
    'purple-modern': purpleModern,
    'ocean-blue': oceanBlue,
    'forest-green': forestGreen,
    'scarlet-red': scarletRed,
    'amber-gold': amberGold,
    'pink-rose': pinkRose,
};

/**
 * Get theme configuration by ID
 */
export const getTheme = (themeId) => {
    return availableThemes[themeId] || availableThemes['purple-modern'];
};

/**
 * Get theme classes based on theme ID, dark mode, component, and state
 */
export const getThemeClasses = (themeId, isDark, component, state) => {
    const theme = getTheme(themeId);
    const mode = isDark ? 'dark' : 'light';

    return theme[component]?.[state]?.[mode] || '';
};
