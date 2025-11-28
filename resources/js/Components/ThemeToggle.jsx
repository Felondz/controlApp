import { useGlobalTheme } from '@/Contexts/GlobalThemeContext';

export default function ThemeToggle({ className = '' }) {
    const { isDark, toggleDarkMode, theme } = useGlobalTheme();

    // Get icon color based on theme - REPLACED by dynamic CSS variables
    const iconColor = 'text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300';

    return (
        <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${className}`}
            aria-label="Toggle Dark Mode"
        >
            {isDark ? (
                // Sun icon for dark mode
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ) : (
                // Moon icon for light mode
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )}
        </button>
    );
}
