'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { charactersApi, getErrorMessage } from '@/services/api';
import { useFavorites } from '@/hooks/useFavorites';
import { FavoriteButton } from '@/components/FavoriteButton';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ErrorMessage } from '@/components/ErrorBoundary';

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'alive':
            return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
        case 'dead':
            return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
        default:
            return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800';
    }
};

const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
        case 'alive':
            return '🟢';
        case 'dead':
            return '🔴';
        default:
            return '⚪';
    }
};

export default function CharacterDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { toggleFavorite, isFavorite } = useFavorites();
    const characterId = params.id as string;

    // Fetch character data
    const {
        data: character,
        isLoading: characterLoading,
        error: characterError,
        refetch: refetchCharacter,
    } = useQuery({
        queryKey: ['character', characterId],
        queryFn: ({ signal }) => charactersApi.getCharacter(characterId, signal),
        enabled: !!characterId,
    });

    // Fetch episodes data
    const {
        data: episodes,
        isLoading: episodesLoading,
        error: episodesError,
    } = useQuery({
        queryKey: ['episodes', character?.episode],
        queryFn: ({ signal }) => charactersApi.getEpisodes(character?.episode || [], signal),
        enabled: !!character?.episode?.length,
    });

    const isLoading = characterLoading;
    const error = characterError;

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <LoadingSkeleton className="h-8 w-32" />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-1/3">
                            <LoadingSkeleton className="w-full h-96" />
                        </div>
                        <div className="md:w-2/3 p-8 space-y-4">
                            <LoadingSkeleton className="h-8 w-3/4" />
                            <LoadingSkeleton className="h-6 w-1/2" />
                            <LoadingSkeleton className="h-4 w-full" />
                            <LoadingSkeleton className="h-4 w-5/6" />
                            <LoadingSkeleton className="h-4 w-2/3" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <button
                        onClick={() => router.back()}
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                    >
                        ← Back
                    </button>
                </div>
                <ErrorMessage
                    message={getErrorMessage(error)}
                    onRetry={refetchCharacter}
                />
            </div>
        );
    }

    if (!character) {
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="mb-6" aria-label="Breadcrumb">
                <button
                    onClick={() => router.back()}
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center text-sm"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Characters
                </button>
            </nav>

            {/* Character Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="md:flex">
                    {/* Character Image */}
                    <div className="md:w-1/3 relative">
                        <Image
                            src={character.image}
                            alt={`${character.name} portrait`}
                            width={400}
                            height={400}
                            className="w-full h-auto object-cover"
                            priority
                        />
                        <div className="absolute top-4 right-4">
                            <FavoriteButton
                                isFavorite={isFavorite(character.id)}
                                onToggle={() => toggleFavorite(character.id)}
                                size="lg"
                                aria-label={`${isFavorite(character.id) ? 'Remove' : 'Add'} ${character.name} from favorites`}
                            />
                        </div>
                    </div>

                    {/* Character Information */}
                    <div className="md:w-2/3 p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {character.name}
                                </h1>
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(character.status)}`}>
                                    <span className="mr-1">{getStatusIcon(character.status)}</span>
                                    {character.status}
                                </div>
                            </div>
                        </div>

                        {/* Character Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                    Species
                                </h3>
                                <p className="text-lg text-gray-900 dark:text-white">{character.species}</p>
                            </div>

                            {character.type && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                        Type
                                    </h3>
                                    <p className="text-lg text-gray-900 dark:text-white">{character.type}</p>
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                    Gender
                                </h3>
                                <p className="text-lg text-gray-900 dark:text-white">{character.gender}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                    Origin
                                </h3>
                                <p className="text-lg text-gray-900 dark:text-white">{character.origin.name}</p>
                            </div>

                            <div className="sm:col-span-2">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                    Last Known Location
                                </h3>
                                <p className="text-lg text-gray-900 dark:text-white">{character.location.name}</p>
                            </div>

                            <div className="sm:col-span-2">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                    First Seen
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {new Date(character.created).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Episodes Section */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Episodes ({character.episode.length})
                    </h2>
                </div>

                {episodesLoading && (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }, (_, i) => (
                            <LoadingSkeleton key={i} className="h-20" />
                        ))}
                    </div>
                )}

                {episodesError && (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">
                            Failed to load episode information
                        </p>
                    </div>
                )}

                {episodes && episodes.length > 0 && (
                    <div className="grid gap-4">
                        {episodes.map((episode) => (
                            <div
                                key={episode.id}
                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                            {episode.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            Episode {episode.episode}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-500">
                                            Air Date: {episode.air_date}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {episodes && episodes.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">
                            No episode information available
                        </p>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                    href="/"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-6 rounded-lg transition-colors"
                >
                    Explore More Characters
                </Link>
                <Link
                    href="/?favorites=true"
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-center py-3 px-6 rounded-lg transition-colors"
                >
                    View Favorites
                </Link>
            </div>
        </div>
    );
}