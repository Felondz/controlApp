import { useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';

/**
 * Hook to track user inactivity and auto-logout after a specified timeout.
 * 
 * @param {number} timeout - Inactivity timeout in milliseconds (default: 30 minutes)
 */
export function useInactivityTimeout(timeout = 30 * 60 * 1000, onTimeout = null) {
    const lastActivityRef = useRef(Date.now());
    const checkIntervalRef = useRef(null);

    useEffect(() => {
        const resetActivity = () => {
            lastActivityRef.current = Date.now();
        };

        const checkInactivity = () => {
            const now = Date.now();
            const timeSinceLastActivity = now - lastActivityRef.current;

            if (timeSinceLastActivity > timeout) {
                // Clear interval to prevent multiple logout attempts
                if (checkIntervalRef.current) {
                    clearInterval(checkIntervalRef.current);
                }

                if (onTimeout) {
                    onTimeout();
                } else {
                    // Default behavior: Perform logout
                    router.post('/logout', {}, {
                        preserveState: false,
                        preserveScroll: false,
                        onFinish: () => {
                            // Redirect to login with inactivity message
                            window.location.href = '/login?reason=inactivity';
                        }
                    });
                }
            }
        };

        // Listen to user interaction events
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

        events.forEach(event => {
            document.addEventListener(event, resetActivity, { passive: true });
        });

        // Check for inactivity every minute
        checkIntervalRef.current = setInterval(checkInactivity, 60 * 1000);

        // Cleanup on unmount
        return () => {
            events.forEach(event => {
                document.removeEventListener(event, resetActivity);
            });

            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
            }
        };
    }, [timeout, onTimeout]);
}
