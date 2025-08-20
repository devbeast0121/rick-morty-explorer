'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { charactersApi, getErrorMessage } from '@/services/api';
import { Character } from '@/types';
import { useUrlState } from '@/hooks/useUrlState';
import { useFavorites } from '@/hooks/useFavorites';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { CharacterCard } from '@/components/CharacterCard';
import { CharacterGridSkeleton } from '@/components/LoadingSkeleton';
import { ErrorMessage } from '@/components/ErrorBoundary';
import { SearchFiltersComponent } from '@/components/SearchFilters';
import { Pagination } from '@/components/Pagination';
import { sortCharacters } from '@/utils/sortUtils';

export default function HomePage() {
  const { filters, updateFilters, clearFilters, setPage } = useUrlState();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { restoreScrollPosition } = useScrollPosition();
  const abortControllerRef = useRef<AbortController>();
  const searchParams = useSearchParams();
  const hasRestoredScroll = useRef(false);

  // Determine if we're showing favorites
  const showingFavorites = filters.showFavorites;

  // Query for characters (only when not showing favorites)
  const {
    data: charactersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['characters', { ...filters, showFavorites: undefined }], // Exclude showFavorites from API call
    queryFn: async () => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      // Remove sort and showFavorites from API filters since we handle them client-side
      const apiFilters = { ...filters };
      delete apiFilters.sort;
      delete apiFilters.showFavorites;

      return charactersApi.getCharacters(apiFilters, abortControllerRef.current.signal);
    },
    enabled: !showingFavorites, // Only fetch when not showing favorites
    placeholderData: (previousData) => previousData,
  });

  // Query for favorite characters
  const {
    data: favoriteCharacters,
    isLoading: favoriteCharactersLoading,
    error: favoriteCharactersError,
  } = useQuery({
    queryKey: ['favorite-characters', favorites],
    queryFn: async () => {
      if (favorites.length === 0) return { results: [], info: { count: 0, pages: 1 } };

      const abortController = new AbortController();
      const favoriteIds = favorites.join(',');

      try {
        const response = await fetch(`https://rickandmortyapi.com/api/character/${favoriteIds}`, {
          signal: abortController.signal,
        });

        if (!response.ok) throw new Error('Failed to fetch favorites');

        const data = await response.json();
        const results = Array.isArray(data) ? data : [data];

        return {
          results,
          info: { count: results.length, pages: 1 }
        };
      } catch (error: any) {
        if (error.name === 'AbortError') throw error;
        throw new Error('Failed to load favorite characters');
      }
    },
    enabled: showingFavorites && favorites.length > 0,
  });

  // Apply client-side sorting
  const sortedCharacters = useMemo(() => {
    const currentData = showingFavorites ? favoriteCharacters : charactersData;
    const characters = currentData?.results || [];

    return sortCharacters(characters, filters.sort || '');
  }, [showingFavorites, favoriteCharacters, charactersData, filters.sort]);

  // Clean up abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Restore scroll position after content loads
  useEffect(() => {
    if (!hasRestoredScroll.current && sortedCharacters.length > 0) {
      setTimeout(restoreScrollPosition, 100);
      hasRestoredScroll.current = true;
    }
  }, [sortedCharacters.length, restoreScrollPosition]);

  // Reset scroll restoration flag when filters change
  useEffect(() => {
    hasRestoredScroll.current = false;
  }, [searchParams]);

  // Determine loading and error states
  const currentLoading = showingFavorites ? favoriteCharactersLoading : isLoading;
  const currentError = showingFavorites ? favoriteCharactersError : error;

  // Get pagination info
  const currentData = showingFavorites ? favoriteCharacters : charactersData;
  const totalPages = currentData?.info?.pages || 1;
  const totalCount = currentData?.info?.count || 0;

  const handleRetry = () => {
    if (showingFavorites) {
      window.location.reload();
    } else {
      refetch();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {showingFavorites ? 'Favorite Characters' : 'Rick & Morty Characters'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {showingFavorites
            ? `Discover your ${favorites.length} favorite characters`
            : 'Explore the multiverse and discover amazing characters'
          }
        </p>
      </div>

      {/* Search and Filters */}
      <SearchFiltersComponent
        filters={filters}
        onFiltersChange={updateFilters}
        onClear={clearFilters}
        isLoading={currentLoading}
      />

      {/* Results Summary */}
      {!currentLoading && !currentError && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {showingFavorites
              ? `Showing ${sortedCharacters.length} favorite character${sortedCharacters.length !== 1 ? 's' : ''}`
              : `Found ${totalCount.toLocaleString()} character${totalCount !== 1 ? 's' : ''} • Page ${filters.page || 1} of ${totalPages}`
            }
            {filters.sort && (
              <span className="ml-2">
                • Sorted by {
                  filters.sort === 'name-asc' ? 'Name A-Z' :
                    filters.sort === 'name-desc' ? 'Name Z-A' :
                      filters.sort === 'created-desc' ? 'Newest First' :
                        filters.sort === 'created-asc' ? 'Oldest First' : 'Default'
                }
              </span>
            )}
          </p>
        </div>
      )}

      {/* Loading State */}
      {currentLoading && <CharacterGridSkeleton />}

      {/* Error State */}
      {currentError && !currentLoading && (
        <ErrorMessage
          message={getErrorMessage(currentError)}
          onRetry={handleRetry}
        />
      )}

      {/* Empty State - No favorites */}
      {showingFavorites && !currentLoading && !currentError && favorites.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💫</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No favorites yet!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start exploring characters and click the heart icon to add them to your favorites.
          </p>
          <button
            onClick={() => updateFilters({ showFavorites: false })}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Explore Characters
          </button>
        </div>
      )}

      {/* Empty State - No search results */}
      {!showingFavorites && !currentLoading && !currentError && sortedCharacters.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No characters found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
          <button
            onClick={clearFilters}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Characters Grid */}
      {!currentLoading && !currentError && sortedCharacters.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {sortedCharacters.map((character: Character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onFavoriteToggle={toggleFavorite}
                isFavorite={isFavorite(character.id)}
              />
            ))}
          </div>

          {/* Pagination - Only show for regular character listing */}
          {!showingFavorites && (
            <Pagination
              currentPage={filters.page || 1}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}