import { useEffect, useCallback, useRef } from 'react';
import { usePage, router } from '@inertiajs/react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useTranslate } from '@/Hooks/useTranslate';

/**
 * useOnboarding Hook
 * 
 * Manages the display and persistence of feature tours.
 */
export function useOnboarding(tourName, options = {}) {
    const { auth } = usePage().props;
    const { t } = useTranslate();
    const user = auth?.user;
    
    const hasTriggered = useRef(false);

    // LOG DE DEPURACIÓN (F12)
    const completedTours = user?.settings?.completed_tours || [];
    useEffect(() => {
        console.table({
            tour: tourName,
            user: user?.email,
            status: Array.isArray(completedTours) && completedTours.includes(tourName) ? 'COMPLETADO' : 'PENDIENTE'
        });
    }, [tourName, completedTours, user]);

    const isTourCompleted = useCallback((name) => {
        if (!user) return true;
        const tours = user.settings?.completed_tours || [];
        return Array.isArray(tours) && tours.includes(name);
    }, [user]);

    const markAsCompleted = useCallback((name) => {
        if (!user) return;
        
        const tours = user.settings?.completed_tours || [];
        if (Array.isArray(tours) && tours.includes(name)) return;

        console.log(`>>> Enviando persistencia para tour: ${name}`);
        
        // Fallback de URL directa por si Ziggy falla
        let targetUrl = '/preferences/complete-tour';
        try {
            if (typeof window.route === 'function' && window.route().has('preferences.tour.complete')) {
                targetUrl = route('preferences.tour.complete');
            }
        } catch (e) {}

        router.post(targetUrl, { tour: name }, {
            preserveScroll: true,
            preserveState: true
        });
    }, [user]);

    const getSteps = useCallback((name) => {
        switch (name) {
            case 'dashboard':
                return [
                    {
                        popover: {
                            title: t('onboarding.dashboard.welcome_title'),
                            description: t('onboarding.dashboard.welcome_desc'),
                            position: 'center'
                        }
                    },
                    {
                        element: '#tour-nav-dashboard',
                        popover: {
                            title: t('onboarding.dashboard.sidebar_title'),
                            description: t('onboarding.dashboard.sidebar_desc'),
                            side: "right"
                        }
                    },
                    {
                        element: '#tour-create-project-card',
                        popover: {
                            title: t('onboarding.dashboard.create_title'),
                            description: t('onboarding.dashboard.create_desc'),
                            side: "top"
                        }
                    },
                    {
                        element: '#tour-project-list',
                        popover: {
                            title: t('onboarding.dashboard.list_title'),
                            description: t('onboarding.dashboard.list_desc'),
                            side: "top"
                        }
                    }
                ];

            case 'project_overview':
                return [
                    {
                        popover: {
                            title: t('onboarding.project.welcome_title'),
                            description: t('onboarding.project.welcome_desc'),
                            position: 'center'
                        }
                    },
                    {
                        element: '#tour-nav-finance',
                        popover: {
                            title: t('onboarding.project.finance_title'),
                            description: t('onboarding.project.finance_desc'),
                            side: "right"
                        }
                    },
                    {
                        element: '#tour-nav-tasks',
                        popover: {
                            title: t('onboarding.project.tasks_title'),
                            description: t('onboarding.project.tasks_desc'),
                            side: "right"
                        }
                    },
                    {
                        element: '#tour-project-summary',
                        popover: {
                            title: t('onboarding.project.summary_title'),
                            description: t('onboarding.project.summary_desc'),
                            side: "top"
                        }
                    }
                ];

            case 'finance':
                return [
                    {
                        popover: {
                            title: t('onboarding.finance.welcome_title'),
                            description: t('onboarding.finance.welcome_desc'),
                            position: 'center'
                        }
                    },
                    {
                        element: '#tour-create-account-btn',
                        popover: {
                            title: t('onboarding.finance.account_title'),
                            description: t('onboarding.finance.account_desc'),
                            side: "bottom"
                        }
                    },
                    {
                        element: '#tour-create-transaction-btn',
                        popover: {
                            title: t('onboarding.finance.transaction_title'),
                            description: t('onboarding.finance.transaction_desc'),
                            side: "bottom"
                        }
                    },
                    {
                        element: '#tour-balance-widget',
                        popover: {
                            title: t('onboarding.finance.balance_title'),
                            description: t('onboarding.finance.balance_desc'),
                            side: "top"
                        }
                    }
                ];

            case 'tasks':
                return [
                    {
                        popover: {
                            title: t('onboarding.tasks.welcome_title'),
                            description: t('onboarding.tasks.welcome_desc'),
                            position: 'center'
                        }
                    },
                    {
                        element: '#tour-task-board',
                        popover: {
                            title: t('onboarding.tasks.board_title'),
                            description: t('onboarding.tasks.board_desc'),
                            side: "top"
                        }
                    },
                    {
                        element: '#tour-task-create',
                        popover: {
                            title: t('onboarding.tasks.create_title'),
                            description: t('onboarding.tasks.create_desc'),
                            side: "bottom"
                        }
                    },
                    {
                        element: '#tour-task-filters',
                        popover: {
                            title: t('onboarding.tasks.filters_title'),
                            description: t('onboarding.tasks.filters_desc'),
                            side: "bottom"
                        }
                    }
                ];

            case 'inventory':
                return [
                    {
                        popover: {
                            title: t('onboarding.inventory.welcome_title'),
                            description: t('onboarding.inventory.welcome_desc'),
                            position: 'center'
                        }
                    },
                    {
                        element: '#tour-inventory-list',
                        popover: {
                            title: t('onboarding.inventory.list_title'),
                            description: t('onboarding.inventory.list_desc'),
                            side: "top"
                        }
                    },
                    {
                        element: '#tour-inventory-create',
                        popover: {
                            title: t('onboarding.inventory.create_title'),
                            description: t('onboarding.inventory.create_desc'),
                            side: "bottom"
                        }
                    },
                    {
                        element: '#tour-inventory-filters',
                        popover: {
                            title: t('onboarding.inventory.filters_title'),
                            description: t('onboarding.inventory.filters_desc'),
                            side: "bottom"
                        }
                    }
                ];

            case 'operations':
                return [
                    {
                        popover: {
                            title: t('onboarding.operations.welcome_title'),
                            description: t('onboarding.operations.welcome_desc'),
                            position: 'center'
                        }
                    },
                    {
                        element: '#tour-operations-process',
                        popover: {
                            title: t('onboarding.operations.process_title'),
                            description: t('onboarding.operations.process_desc'),
                            side: "bottom"
                        }
                    },
                    {
                        element: '#tour-operations-kanban',
                        popover: {
                            title: t('onboarding.operations.kanban_title'),
                            description: t('onboarding.operations.kanban_desc'),
                            side: "top"
                        }
                    },
                    {
                        element: '#tour-operations-create',
                        popover: {
                            title: t('onboarding.operations.create_title'),
                            description: t('onboarding.operations.create_desc'),
                            side: "bottom"
                        }
                    }
                ];

            case 'create_project':
                return [
                    {
                        popover: {
                            title: t('onboarding.create_project.welcome_title'),
                            description: t('onboarding.create_project.welcome_desc'),
                            position: 'center'
                        }
                    },
                    {
                        element: '#tour-creation-mode',
                        popover: {
                            title: t('onboarding.create_project.mode_title'),
                            description: t('onboarding.create_project.mode_desc'),
                            side: "bottom"
                        }
                    },
                    {
                        element: '#tour-project-templates',
                        popover: {
                            title: t('onboarding.create_project.templates_title'),
                            description: t('onboarding.create_project.templates_desc'),
                            side: "top"
                        }
                    },
                    {
                        element: '#tour-project-pricing',
                        popover: {
                            title: t('onboarding.create_project.pricing_title'),
                            description: t('onboarding.create_project.pricing_desc'),
                            side: "bottom"
                        }
                    },
                    {
                        element: '#tour-project-submit',
                        popover: {
                            title: t('onboarding.create_project.submit_title'),
                            description: t('onboarding.create_project.submit_desc'),
                            side: "top"
                        }
                    }
                ];

            default: return [];
        }
    }, [t]);

    const runTour = useCallback((name, force = false) => {
        if (!force && isTourCompleted(name)) return;

        const steps = getSteps(name);
        if (steps.length === 0) return;

        // Pequeño timeout para asegurar que el DOM de Inertia esté listo
        setTimeout(() => {
            console.log(`Lanzando tour interactivo: ${name}`);

            const driverObj = driver({
                showProgress: true,
                allowClose: true,
                overlayColor: '#000',
                overlayOpacity: 0.7,
                stagePadding: 4,
                popoverClass: 'driverjs-theme dark:bg-gray-800 dark:text-white',
                doneBtnText: t('tour.done'),
                closeBtnText: t('tour.close'),
                nextBtnText: t('tour.next'),
                prevBtnText: t('tour.prev'),
                onDestroyed: () => markAsCompleted(name),
                steps: steps
            });

            driverObj.drive();
        }, 500);
    }, [isTourCompleted, markAsCompleted, getSteps, t]);

    useEffect(() => {
        if (tourName && !hasTriggered.current) {
            hasTriggered.current = true;
            runTour(tourName);
        }
    }, [tourName, runTour]);

    return { runTour, isTourCompleted };
}
