import axios from 'axios';
import { ApiResponse, Character, Episode, SearchFilters } from '@/types';

const API_BASE = 'https://rickandmortyapi.com/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
});

export const charactersApi = {
    // Get characters with search/filter parameters
    getCharacters: async (
        filters: SearchFilters = {},
        signal?: AbortSignal
    ): Promise<ApiResponse> => {
        const params = new URLSearchParams();

        if (filters.name) params.append('name', filters.name);
        if (filters.status) params.append('status', filters.status);
        if (filters.species) params.append('species', filters.species);
        if (filters.gender) params.append('gender', filters.gender);
        if (filters.page) params.append('page', filters.page.toString());

        const response = await api.get(`/character?${params.toString()}`, {
            signal,
        });

        return response.data;
    },

    // Get single character by ID
    getCharacter: async (id: string, signal?: AbortSignal): Promise<Character> => {
        const response = await api.get(`/character/${id}`, { signal });
        return response.data;
    },

    // Get multiple episodes by IDs
    getEpisodes: async (urls: string[], signal?: AbortSignal): Promise<Episode[]> => {
        if (!urls.length) return [];

        // Extract episode IDs from URLs
        const episodeIds = urls.map(url => url.split('/').pop()).join(',');

        try {
            const response = await api.get(`/episode/${episodeIds}`, { signal });
            // Handle single episode vs array of episodes
            return Array.isArray(response.data) ? response.data : [response.data];
        } catch (error) {
            console.error('Failed to fetch episodes:', error);
            return [];
        }
    },
};

export const isNetworkError = (error: any): boolean => {
    return axios.isAxiosError(error) && !error.response;
};

export const getErrorMessage = (error: any): string => {
    if (axios.isCancel(error)) {
        return 'Request cancelled';
    }

    if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
            return 'No characters found matching your criteria';
        }
        return error.response?.data?.error || error.message || 'Something went wrong';
    }

    return 'An unexpected error occurred';
};