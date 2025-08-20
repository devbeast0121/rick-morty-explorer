'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Character } from '@/types';
import { FavoriteButton } from './FavoriteButton';

interface CharacterCardProps {
    character: Character;
    onFavoriteToggle: (id: number) => void;
    isFavorite: boolean;
}

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'alive':
            return 'text-green-600 dark:text-green-400';
        case 'dead':
            return 'text-red-600 dark:text-red-400';
        default:
            return 'text-gray-600 dark:text-gray-400';
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

export const CharacterCard = ({ character, onFavoriteToggle, isFavorite }: CharacterCardProps) => {
    return (
        <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
            data-testid="character-card"
        >
            <Link href={`/character/${character.id}`} className="block">
                <div className="relative">
                    <Image
                        src={character.image}
                        alt={`${character.name} portrait`}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                    />
                    <div className="absolute top-2 right-2">
                        <FavoriteButton
                            isFavorite={isFavorite}
                            onToggle={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onFavoriteToggle(character.id);
                            }}
                            aria-label={`${isFavorite ? 'Remove' : 'Add'} ${character.name} from favorites`}
                        />
                    </div>
                </div>
            </Link>

            <div className="p-4">
                <Link href={`/character/${character.id}`} className="block hover:opacity-80">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                        {character.name}
                    </h3>
                </Link>

                <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                        <span className={`font-medium ${getStatusColor(character.status)} flex items-center`}>
                            <span className="mr-1">{getStatusIcon(character.status)}</span>
                            {character.status}
                        </span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-gray-600 dark:text-gray-400">{character.species}</span>
                    </div>

                    {character.type && (
                        <div className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Type:</span> {character.type}
                        </div>
                    )}

                    <div className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Gender:</span> {character.gender}
                    </div>

                    <div className="text-gray-600 dark:text-gray-400 truncate">
                        <span className="font-medium">Location:</span> {character.location.name}
                    </div>

                    <div className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Episodes:</span> {character.episode.length}
                    </div>
                </div>
            </div>
        </div>
    );
};