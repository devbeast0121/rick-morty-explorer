'use client';

import { useState, useEffect } from 'react';
import { useDebouncedCallback } from '@/hooks/useDebounce';
import { ExtendedSearchFilters } from '@/hooks/useUrlState';

interface SearchFiltersProps {
    filters: ExtendedSearchFilters;
    onFiltersChange: (filters: Partial<ExtendedSearchFilters>) => void;
    onClear: () => void;
    isLoading?: boolean;
}

export const SearchFiltersComponent = ({
    filters,
    onFiltersChange,
    onClear,
    isLoading = false
}: SearchFiltersProps) => {
    const [searchInput, setSearchInput] = useState(filters.name || '');

    // Debounced search to avoid excessive API calls
    const debouncedSearch = useDebouncedCallback((value: string) => {
        onFiltersChange({ name: value });
    }, 400);

    // Update local search input when filters change externally (e.g., from URL)
    useEffect(() => {
        setSearchInput(filters.name || '');
    }, [filters.name]);

    const handleSearchChange = (value: string) => {
        setSearchInput(value);
        debouncedSearch(value);
    };

    const hasActiveFilters = !!(
        filters.name ||
        filters.status ||
        filters.species ||
        filters.gender ||
        filters.sort ||
        filters.showFavorites
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1">
                    <label
                        htmlFor="search"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                        Search Characters
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                                className="h-5 w-5 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <input
                            id="search"
                            name="search"
                            type="text"
                            placeholder="Search by name..."
                            value={searchInput}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            disabled={isLoading}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                        />
                    </div>
                </div>

                {/* Sort Dropdown */}
                <div className="w-full lg:w-48">
                    <label
                        htmlFor="sort"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                        Sort by
                    </label>
                    <select
                        id="sort"
                        name="sort"
                        value={filters.sort || ''}
                        onChange={(e) => onFiltersChange({ sort: e.target.value })}
                        disabled={isLoading}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    >
                        <option value="">Default</option>
                        <option value="name-asc">Name A-Z</option>
                        <option value="name-desc">Name Z-A</option>
                        <option value="created-desc">Newest First</option>
                        <option value="created-asc">Oldest First</option>
                    </select>
                </div>

                {/* Status Filter */}
                <div className="w-full lg:w-48">
                    <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={filters.status || ''}
                        onChange={(e) => onFiltersChange({ status: e.target.value })}
                        disabled={isLoading}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    >
                        <option value="">All Status</option>
                        <option value="alive">Alive</option>
                        <option value="dead">Dead</option>
                        <option value="unknown">Unknown</option>
                    </select>
                </div>

                {/* Species Filter */}
                <div className="w-full lg:w-48">
                    <label
                        htmlFor="species"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                        Species
                    </label>
                    <select
                        id="species"
                        name="species"
                        value={filters.species || ''}
                        onChange={(e) => onFiltersChange({ species: e.target.value })}
                        disabled={isLoading}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    >
                        <option value="">All Species</option>
                        <option value="human">Human</option>
                        <option value="alien">Alien</option>
                        <option value="humanoid">Humanoid</option>
                        <option value="animal">Animal</option>
                        <option value="robot">Robot</option>
                        <option value="mythological creature">Mythological</option>
                    </select>
                </div>

                {/* Gender Filter */}
                <div className="w-full lg:w-48">
                    <label
                        htmlFor="gender"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                        Gender
                    </label>
                    <select
                        id="gender"
                        name="gender"
                        value={filters.gender || ''}
                        onChange={(e) => onFiltersChange({ gender: e.target.value })}
                        disabled={isLoading}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    >
                        <option value="">All Genders</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="genderless">Genderless</option>
                        <option value="unknown">Unknown</option>
                    </select>
                </div>

                {/* Clear Filters Button - Fixed text to match test */}
                {hasActiveFilters && (
                    <div className="flex items-end">
                        <button
                            onClick={onClear}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors disabled:opacity-50"
                        >
                            Clear All
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};