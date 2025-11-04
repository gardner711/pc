import api from './api'
import { Character } from '../types/character'

export interface CharacterFilters {
    search?: string
    class?: string
    race?: string
    sort?: string
    order?: 'asc' | 'desc'
}

export const characterService = {
    /**
     * Get all characters with optional filters
     */
    async getAll(filters?: CharacterFilters): Promise<Character[]> {
        const params = new URLSearchParams()

        if (filters?.search) params.append('search', filters.search)
        if (filters?.class) params.append('class', filters.class)
        if (filters?.race) params.append('race', filters.race)
        if (filters?.sort) params.append('sort', filters.sort)
        if (filters?.order) params.append('order', filters.order)

        const queryString = params.toString()
        const url = `/characters${queryString ? `?${queryString}` : ''}`

        const response = await api.get<{ data: Character[] }>(url)
        return response.data.data
    },

    /**
     * Get a character by ID
     */
    async getById(id: string): Promise<Character> {
        const response = await api.get<{ data: Character }>(`/characters/${id}`)
        return response.data.data
    },

    /**
     * Create a new character
     */
    async create(character: Omit<Character, '_id' | 'createdAt' | 'updatedAt'>): Promise<Character> {
        const response = await api.post<{ data: Character }>('/characters', character)
        return response.data.data
    },

    /**
     * Update an existing character
     */
    async update(id: string, character: Partial<Character>): Promise<Character> {
        const response = await api.put<{ data: Character }>(`/characters/${id}`, character)
        return response.data.data
    },

    /**
     * Delete a character
     */
    async delete(id: string): Promise<void> {
        await api.delete(`/characters/${id}`)
    },
}
