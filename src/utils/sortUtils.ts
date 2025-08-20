import { Character } from '@/types';

export const sortCharacters = (characters: Character[], sortOption: string): Character[] => {
    if (!sortOption) return characters;

    const sorted = [...characters];

    switch (sortOption) {
        case 'name-asc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));

        case 'name-desc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name));

        case 'created-desc':
            return sorted.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

        case 'created-asc':
            return sorted.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());

        default:
            return characters;
    }
};