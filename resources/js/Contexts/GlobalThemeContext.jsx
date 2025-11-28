import { createContext, useContext, useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';

const GlobalThemeContext = createContext();

/**
 * Global Theme Provider
 * 
 * Provides global theme context to the entire application.
 * Manages theme selection and persistence via backend.
 */
export function GlobalThemeProvider({ children, initialTheme = 'purple-modern', forceTheme = null }) {
    const { props } = usePage();
    // If forceTheme is provided (e.g. inside a project), use it. Otherwise use user preference.
    const effectiveTheme = forceTheme || props.auth?.user?.global_theme || initialTheme;
    const userTheme = props.auth?.user?.global_theme || initialTheme;

    const [theme, setTheme] = useState(effectiveTheme);
    const [isDark, setIsDark] = useState(() => {
        // Check localStorage first
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('darkMode');
            if (stored !== null) {
                console.log('Loading dark mode from localStorage:', stored);
                return stored === 'true';
            }
            // Fallback to system preference only if localStorage is empty
            const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
            console.log('No localStorage found, using system preference:', systemPreference);
            return systemPreference;
        }
        return false;
    });

    // Sync theme with props changes (or forceTheme changes)
    useEffect(() => {
        if (forceTheme) {
            console.log('Forcing project theme:', forceTheme);
            setTheme(forceTheme);
        } else if (userTheme && userTheme !== theme) {
            console.log('Syncing theme from backend:', userTheme);
            setTheme(userTheme);
        }
    }, [userTheme, forceTheme]);

    // Apply dark mode class to html element and save to localStorage
    useEffect(() => {
        console.log('Dark mode changed to:', isDark);

        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Save to localStorage
        localStorage.setItem('darkMode', isDark.toString());
        console.log('Saved to localStorage:', isDark.toString());
    }, [isDark]);

    // Apply theme data attribute
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        console.log('Applied theme:', theme, 'isDark:', isDark);
    }, [theme, isDark]);

    /**
     * Change global theme
     * Persists to backend via API
     */
    const changeTheme = (newTheme) => {
        console.log('Changing theme to:', newTheme);
        setTheme(newTheme); // Update immediately for instant feedback

        router.post(route('preferences.theme.update'), {
            global_theme: newTheme,
        }, {
            preserveScroll: true,
            preserveState: true, // Keep dark mode state
            onSuccess: (page) => {
                console.log('Theme updated successfully');
                // Sync with the new user data from backend
                if (page.props.auth?.user?.global_theme) {
                    setTheme(page.props.auth.user.global_theme);
                }
            },
            onError: (errors) => {
                console.error('Failed to update theme:', errors);
                // Revert on error
                setTheme(userTheme);
            },
        });
    };

    /**
     * Toggle dark mode
     */
    const toggleDarkMode = () => {
        setIsDark(prev => !prev);
    };

    return (
        <GlobalThemeContext.Provider value={{
            theme,
            changeTheme,
            setThemeLocal: setTheme, // Expose raw setter for temporary overrides
            isDark,
            toggleDarkMode
        }}>
            {children}
        </GlobalThemeContext.Provider>
    );
}

/**
 * Hook to use global theme context
 */
export const useGlobalTheme = () => {
    const context = useContext(GlobalThemeContext);
    if (!context) {
        throw new Error('useGlobalTheme must be used within GlobalThemeProvider');
    }
    return context;
};
