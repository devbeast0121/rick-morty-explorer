import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

const SCROLL_KEY = 'character-list-scroll';

export const useScrollPosition = () => {
    const searchParams = useSearchParams();
    const scrollTimeoutRef = useRef<NodeJS.Timeout>();
    const hasRestoredRef = useRef(false);

    // Save scroll position
    const saveScrollPosition = () => {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
            const scrollData = {
                position: window.scrollY,
                url: window.location.href,
                timestamp: Date.now(),
            };

            try {
                sessionStorage.setItem(SCROLL_KEY, JSON.stringify(scrollData));
            } catch (error) {
                // Silently fail if sessionStorage is not available
            }
        }, 100);
    };

    // Restore scroll position
    const restoreScrollPosition = () => {
        if (hasRestoredRef.current) return;

        try {
            const stored = sessionStorage.getItem(SCROLL_KEY);
            if (!stored) return;

            const scrollData = JSON.parse(stored);
            const currentUrl = window.location.href;

            // Only restore if we're on the same URL and the data is recent (within 1 hour)
            if (
                scrollData.url === currentUrl &&
                Date.now() - scrollData.timestamp < 3600000 &&
                scrollData.position > 0
            ) {
                // Wait for content to load before scrolling
                requestAnimationFrame(() => {
                    window.scrollTo({
                        top: scrollData.position,
                        behavior: 'instant'
                    });
                });
            }
        } catch (error) {
            // Silently fail if sessionStorage is not available or data is invalid
        }

        hasRestoredRef.current = true;
    };

    // Clear scroll position when filters change significantly
    const clearScrollPosition = () => {
        try {
            sessionStorage.removeItem(SCROLL_KEY);
        } catch (error) {
            // Silently fail
        }
        hasRestoredRef.current = false;
    };

    useEffect(() => {
        // Listen for scroll events
        window.addEventListener('scroll', saveScrollPosition, { passive: true });

        return () => {
            window.removeEventListener('scroll', saveScrollPosition);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    // Clear scroll position when search params change (new filters)
    useEffect(() => {
        const params = searchParams.toString();
        if (params.includes('q=') || params.includes('status=') || params.includes('species=')) {
            clearScrollPosition();
        }
    }, [searchParams]);

    return {
        restoreScrollPosition,
        clearScrollPosition,
    };
};