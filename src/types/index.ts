export interface Character {
    id: number;
    name: string;
    status: 'Alive' | 'Dead' | 'unknown';
    species: string;
    type: string;
    gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
    origin: {
        name: string;
        url: string;
    };
    location: {
        name: string;
        url: string;
    };
    image: string;
    episode: string[];
    url: string;
    created: string;
}

export interface ApiInfo {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
}

export interface ApiResponse {
    info: ApiInfo;
    results: Character[];
}

// For favorites API response that might not have full API structure
export interface FavoritesResponse {
    results: Character[];
    info: {
        count: number;
        pages: number;
        next?: string | null;
        prev?: string | null;
    };
}

export interface SearchFilters {
    name?: string;
    status?: string;
    species?: string;
    gender?: string;
    page?: number;
}

// Extended filters including sort and favorites
export interface ExtendedSearchFilters extends SearchFilters {
    sort?: string;
    showFavorites?: boolean;
}

export interface Episode {
    id: number;
    name: string;
    air_date: string;
    episode: string;
    characters: string[];
    url: string;
    created: string;
}