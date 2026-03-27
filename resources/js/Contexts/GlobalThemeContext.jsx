import { createContext, useContext, useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';

const GlobalThemeContext = createContext();

export function GlobalThemeProvider({ children, initialTheme = 'purple-modern', forceTheme = null }) {
    const page = usePage();
    const props = page?.props || {};

    // If forceTheme is provided (e.g. inside a project), use it. Otherwise use user preference.
    const userTheme = props.auth?.user?.global_theme || initialTheme;
    const effectiveTheme = forceTheme || userTheme;

    const [theme, setTheme] = useState(effectiveTheme);    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('darkMode');
            if (stored !== null) {
                return stored === 'true';
            }
            const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
            return systemPreference;
        }
        return false;
    });

    // Sync theme with props changes (or forceTheme changes)
    useEffect(() => {
        if (forceTheme) {
            setTheme(forceTheme);
        } else if (userTheme && userTheme !== theme) {
            setTheme(userTheme);
        }
    }, [userTheme, forceTheme]);

    // Apply dark mode class to html element and save to localStorage
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', isDark.toString());
    }, [isDark]);

    // Apply theme data attribute
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme, isDark]);

    /**
     * Change global theme
     * Persists to backend via API
     */
    const changeTheme = (newTheme) => {
        setTheme(newTheme);

        router.post(route('preferences.theme.update'), {
            global_theme: newTheme,
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                if (page.props.auth?.user?.global_theme) {
                    setTheme(page.props.auth.user.global_theme);
                }
            },
            onError: (errors) => {
                console.error('Failed to update theme:', errors);
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
