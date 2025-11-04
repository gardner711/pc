import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import type { Character, Skills, HitPoints, Speed } from '../../src/types/character'

// Helper to create default skills
function createDefaultSkills(): Skills {
    const defaultSkill = { proficient: false, expertise: false, modifier: 0 }
    return {
        acrobatics: defaultSkill,
        animalHandling: defaultSkill,
        arcana: defaultSkill,
        athletics: defaultSkill,
        deception: defaultSkill,
        history: defaultSkill,
        insight: defaultSkill,
        intimidation: defaultSkill,
        investigation: defaultSkill,
        medicine: defaultSkill,
        nature: defaultSkill,
        perception: defaultSkill,
        performance: defaultSkill,
        persuasion: defaultSkill,
        religion: defaultSkill,
        sleightOfHand: defaultSkill,
        stealth: defaultSkill,
        survival: defaultSkill,
    }
}

// Helper to create default character with all required fields
function createDefaultCharacter(partial: Partial<Character>): Character {
    const level = partial.level || 1
    const constitutionModifier = partial.abilityScores?.constitution.modifier || 0
    const dexterityModifier = partial.abilityScores?.dexterity.modifier || 0
    const wisdomModifier = partial.abilityScores?.wisdom.modifier || 0
    const proficiencyBonus = Math.ceil(1 + level / 4)

    return {
        _id: partial._id,
        characterName: partial.characterName || '',
        race: partial.race || '',
        class: partial.class || '',
        level,
        background: partial.background,
        alignment: partial.alignment,
        abilityScores: partial.abilityScores || {
            strength: { score: 10, modifier: 0 },
            dexterity: { score: 10, modifier: 0 },
            constitution: { score: 10, modifier: 0 },
            intelligence: { score: 10, modifier: 0 },
            wisdom: { score: 10, modifier: 0 },
            charisma: { score: 10, modifier: 0 },
        },
        skills: partial.skills || createDefaultSkills(),
        hitPoints: partial.hitPoints || {
            maximum: 10 + constitutionModifier,
            current: 10 + constitutionModifier,
            temporary: 0,
        } as HitPoints,
        armorClass: partial.armorClass ?? 10 + dexterityModifier,
        initiative: partial.initiative ?? dexterityModifier,
        speed: partial.speed || { walk: 30 } as Speed,
        inspiration: partial.inspiration ?? false,
        proficiencyBonus: partial.proficiencyBonus ?? proficiencyBonus,
        passivePerception: partial.passivePerception ?? 10 + wisdomModifier,
        createdAt: partial.createdAt,
        updatedAt: partial.updatedAt,
    }
}

// Mock backend API responses - support both /api/characters and /api/v1/characters
const handleGetCharacters = ({ request }: any) => {
    const url = new URL(request.url)
    const classFilter = url.searchParams.get('class')
    const raceFilter = url.searchParams.get('race')

    let characters = mockCharacters

    if (classFilter) {
        characters = characters.filter(c => c.class === classFilter)
    }
    if (raceFilter) {
        characters = characters.filter(c => c.race === raceFilter)
    }

    return HttpResponse.json(characters)
}

const handleGetCharacterById = ({ params }: any) => {
    const { id } = params
    const character = mockCharacters.find(c => c._id === id)

    if (!character) {
        return HttpResponse.json({ error: 'Character not found' }, { status: 404 })
    }

    return HttpResponse.json(character)
}

const handleCreateCharacter = async ({ request }: any) => {
    const inputData = await request.json() as Partial<Character>

    // Simulate backend validation
    const validationErrors = validateCharacter(inputData)
    if (validationErrors.length > 0) {
        return HttpResponse.json(
            { error: 'Validation failed', details: validationErrors },
            { status: 400 }
        )
    }

    // Check duplicate name
    if (mockCharacters.some(c => c.characterName === inputData.characterName)) {
        return HttpResponse.json(
            { error: 'character name already exists' },
            { status: 409 }
        )
    }

    const newCharacter = createDefaultCharacter({
        ...inputData,
        _id: `test-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    })

    mockCharacters.push(newCharacter)
    return HttpResponse.json(newCharacter, { status: 201 })
}

const handleUpdateCharacter = async ({ params, request }: any) => {
    const { id } = params
    const updates = await request.json() as Partial<Character>

    const index = mockCharacters.findIndex(c => c._id === id)
    if (index === -1) {
        return HttpResponse.json({ error: 'Character not found' }, { status: 404 })
    }

    // Simulate backend validation
    const validationErrors = validateCharacter(updates)
    if (validationErrors.length > 0) {
        return HttpResponse.json(
            { error: 'Validation failed', details: validationErrors },
            { status: 400 }
        )
    }

    // Check duplicate name (excluding current character)
    if (updates.characterName &&
        mockCharacters.some(c => c._id !== id && c.characterName === updates.characterName)) {
        return HttpResponse.json(
            { error: 'character name already exists' },
            { status: 409 }
        )
    }

    const updated = createDefaultCharacter({
        ...mockCharacters[index],
        ...updates,
        _id: id as string,
        updatedAt: new Date().toISOString(),
    })

    mockCharacters[index] = updated
    return HttpResponse.json(updated)
}

const handleDeleteCharacter = ({ params }: any) => {
    const { id } = params
    const index = mockCharacters.findIndex(c => c._id === id)

    if (index === -1) {
        return HttpResponse.json({ error: 'Character not found' }, { status: 404 })
    }

    mockCharacters.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
}

export const handlers = [
    // Support /api/characters pattern (for direct fetch calls in tests)
    http.get('*/api/characters', handleGetCharacters),
    http.get('*/api/characters/:id', handleGetCharacterById),
    http.post('*/api/characters', handleCreateCharacter),
    http.put('*/api/characters/:id', handleUpdateCharacter),
    http.delete('*/api/characters/:id', handleDeleteCharacter),

    // Support /api/v1/characters pattern (for axios calls with baseURL)
    http.get('*/api/v1/characters', handleGetCharacters),
    http.get('*/api/v1/characters/:id', handleGetCharacterById),
    http.post('*/api/v1/characters', handleCreateCharacter),
    http.put('*/api/v1/characters/:id', handleUpdateCharacter),
    http.delete('*/api/v1/characters/:id', handleDeleteCharacter),
]

// Mock character data  
export let mockCharacters: Character[] = [
    createDefaultCharacter({
        _id: '1',
        characterName: 'Gandalf the Grey',
        race: 'Human',
        class: 'Wizard',
        level: 20,
        background: 'Sage',
        alignment: 'Neutral Good',
        abilityScores: {
            strength: { score: 10, modifier: 0 },
            dexterity: { score: 12, modifier: 1 },
            constitution: { score: 14, modifier: 2 },
            intelligence: { score: 20, modifier: 5 },
            wisdom: { score: 18, modifier: 4 },
            charisma: { score: 16, modifier: 3 },
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    })
]

// Reset mock data between tests
export function resetMockCharacters() {
    mockCharacters = [
        createDefaultCharacter({
            _id: '1',
            characterName: 'Gandalf the Grey',
            race: 'Human',
            class: 'Wizard',
            level: 20,
            background: 'Sage',
            alignment: 'Neutral Good',
            abilityScores: {
                strength: { score: 10, modifier: 0 },
                dexterity: { score: 12, modifier: 1 },
                constitution: { score: 14, modifier: 2 },
                intelligence: { score: 20, modifier: 5 },
                wisdom: { score: 18, modifier: 4 },
                charisma: { score: 16, modifier: 3 },
            },
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
        })
    ]
}// Backend validation logic matching Go backend
function validateCharacter(character: Partial<Character>): string[] {
    const errors: string[] = []

    // Required fields
    if (!character.characterName) {
        errors.push('character name is required')
    }
    if (!character.race) {
        errors.push('race is required')
    }
    if (!character.class) {
        errors.push('class is required')
    }

    // String length limits (500 chars)
    if (character.characterName && character.characterName.length > 500) {
        errors.push('character name must be 500 characters or less')
    }
    if (character.race && character.race.length > 500) {
        errors.push('race must be 500 characters or less')
    }
    if (character.class && character.class.length > 500) {
        errors.push('class must be 500 characters or less')
    }
    if (character.background && character.background.length > 500) {
        errors.push('background must be 500 characters or less')
    }
    if (character.alignment && character.alignment.length > 500) {
        errors.push('alignment must be 500 characters or less')
    }

    // Level validation (1-20)
    if (character.level !== undefined && (character.level < 1 || character.level > 20)) {
        errors.push('level must be between 1 and 20')
    }

    // Ability score validation (1-30)
    if (character.abilityScores) {
        const scores = character.abilityScores
        const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const

        abilities.forEach(ability => {
            const abilityScore = scores[ability]
            if (abilityScore && (abilityScore.score < 1 || abilityScore.score > 30)) {
                errors.push(`${ability} must be between 1 and 30`)
            }
        })
    }

    return errors
}

export const server = setupServer(...handlers)
