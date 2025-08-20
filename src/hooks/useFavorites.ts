import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'rick-morty-favorites';

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<Set<number>>(new Set());
    const [isLoading, setIsLoading] = useState(true);

    // Load favorites from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(FAVORITES_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setFavorites(new Set(parsed));
            }
        } catch (error) {
            console.error('Failed to load favorites from localStorage:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Persist favorites to localStorage whenever they change
    const persistFavorites = useCallback((newFavorites: Set<number>) => {
        try {
            // Use Array.from() instead of spread operator to avoid downlevelIteration issue
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(newFavorites)));
        } catch (error) {
            console.error('Failed to save favorites to localStorage:', error);
        }
    }, []);

    const toggleFavorite = useCallback((id: number) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);

            if (newFavorites.has(id)) {
                newFavorites.delete(id);
            } else {
                newFavorites.add(id);
            }

            persistFavorites(newFavorites);
            return newFavorites;
        });
    }, [persistFavorites]);

    const isFavorite = useCallback((id: number): boolean => {
        return favorites.has(id);
    }, [favorites]);

    const getFavoritesList = useCallback((): number[] => {
        // Use Array.from() instead of spread operator
        return Array.from(favorites);
    }, [favorites]);

    const clearFavorites = useCallback(() => {
        setFavorites(new Set());
        persistFavorites(new Set());
    }, [persistFavorites]);

    return {
        favorites: getFavoritesList(),
        isLoading,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        count: favorites.size,
    };
};