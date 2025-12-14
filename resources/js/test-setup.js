import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock @inertiajs/react
vi.mock('@inertiajs/react', () => ({
    usePage: vi.fn(() => ({
        props: {
            auth: {
                user: {
                    id: 1,
                    name: 'Test User',
                    email: 'test@example.com',
                    email_verified_at: '2025-01-01T00:00:00.000000Z',
                }
            },
            translations: {
                common: {
                    save: 'Save',
                    cancel: 'Cancel',
                    delete: 'Delete',
                    edit: 'Edit',
                },
            },
            flash: {},
        },
        url: '/test',
        component: 'TestComponent',
    })),
    router: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        visit: vi.fn(),
        reload: vi.fn(),
    },
    Link: ({ children, href, ...props }) => React.createElement('a', { href, ...props }, children),
    Head: ({ children, ...props }) => React.createElement('head', props, children),
    useForm: vi.fn((initialValues) => ({
        data: initialValues || {},
        setData: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        reset: vi.fn(),
        clearErrors: vi.fn(),
        processing: false,
        errors: {},
        wasSuccessful: false,
        recentlySuccessful: false,
    })),
}));

// Mock useTranslate hook
vi.mock('@/Hooks/useTranslate', () => ({
    useTranslate: vi.fn(() => ({
        t: vi.fn((key, fallbackOrParams, params) => {
            // If second arg is an object (params), replace :param in key and return key
            // Otherwise return key as before (for compatibility with existing tests)
            let result = key;
            let replacements = {};

            if (typeof fallbackOrParams === 'object' && fallbackOrParams !== null) {
                replacements = fallbackOrParams;
            } else if (typeof params === 'object' && params !== null) {
                replacements = params;
            }

            // Replace :param with actual values in the key
            Object.keys(replacements).forEach(param => {
                result = result.replace(`:${param}`, replacements[param]);
            });

            return result;
        }),
    })),
}));

// Mock GlobalThemeContext
vi.mock('@/Contexts/GlobalThemeContext', () => ({
    useGlobalTheme: vi.fn(() => ({
        theme: 'purple-modern',
        isDark: false,
        setTheme: vi.fn(),
        toggleDark: vi.fn(),
        forceTheme: null,
    })),
    GlobalThemeProvider: ({ children }) => React.createElement('div', { 'data-testid': 'theme-provider' }, children),
}));

// Mock route helper (Ziggy)
global.route = vi.fn((name, params) => {
    const url = params
        ? `/${name}/${typeof params === 'object' ? Object.values(params).join('/') : params}`
        : `/${name}`;

    // Add current() and has() methods
    return Object.assign(url, {
        current: vi.fn((routeName) => routeName === name),
        has: vi.fn(() => true), // Mock has to always return true or customizable
    });
});

// Mock scrollIntoView for ChatWidget and other components
Element.prototype.scrollIntoView = vi.fn();
