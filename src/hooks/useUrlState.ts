import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { SearchFilters } from '@/types';

export interface ExtendedSearchFilters extends SearchFilters {
    sort?: string;
    showFavorites?: boolean;
}

export const useUrlState = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const filters = useMemo((): ExtendedSearchFilters => {
        return {
            name: searchParams.get('q') || '',
            status: searchParams.get('status') || '',
            species: searchParams.get('species') || '',
            gender: searchParams.get('gender') || '',
            page: Number(searchParams.get('page')) || 1,
            sort: searchParams.get('sort') || '',
            showFavorites: searchParams.get('favorites') === 'true',
        };
    }, [searchParams]);

    const updateFilters = useCallback((newFilters: Partial<ExtendedSearchFilters>) => {
        const params = new URLSearchParams(searchParams.toString());

        // Update or remove parameters
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value && value !== '') {
                if (key === 'name') {
                    params.set('q', value as string);
                } else if (key === 'showFavorites') {
                    if (value) {
                        params.set('favorites', 'true');
                    } else {
                        params.delete('favorites');
                    }
                } else {
                    params.set(key, value.toString());
                }
            } else {
                if (key === 'name') {
                    params.delete('q');
                } else if (key === 'showFavorites') {
                    params.delete('favorites');
                } else {
                    params.delete(key);
                }
            }
        });

        // Reset to page 1 when filters change (except when explicitly setting page)
        if (!('page' in newFilters)) {
            params.set('page', '1');
        }

        const newUrl = params.toString() ? `/?${params.toString()}` : '/';
        router.push(newUrl, { scroll: false });
    }, [router, searchParams]);

    const clearFilters = useCallback(() => {
        router.push('/', { scroll: false });
    }, [router]);

    const setPage = useCallback((page: number) => {
        updateFilters({ page });
    }, [updateFilters]);

    return {
        filters,
        updateFilters,
        clearFilters,
        setPage,
    };
};