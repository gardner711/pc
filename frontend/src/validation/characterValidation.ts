import { AbilityScores } from '../types/character'

export interface CharacterFormData {
    characterName: string
    playerName?: string
    race: string
    subrace?: string
    class: string
    subclass?: string
    level: number
    background?: string
    alignment?: string
    abilityScores: AbilityScores
}

export const validateBasicInfo = (data: Partial<CharacterFormData>): Record<string, string> => {
    const errors: Record<string, string> = {}

    // Required fields
    if (!data.characterName?.trim()) {
        errors.characterName = 'Character name is required'
    } else if (data.characterName.length > 500) {
        errors.characterName = 'Character name must be 500 characters or less'
    }

    if (!data.race?.trim()) {
        errors.race = 'Race is required'
    } else if (data.race.length > 500) {
        errors.race = 'Race must be 500 characters or less'
    }

    if (!data.class?.trim()) {
        errors.class = 'Class is required'
    } else if (data.class.length > 500) {
        errors.class = 'Class must be 500 characters or less'
    }

    if (!data.level) {
        errors.level = 'Level is required'
    } else if (data.level < 1 || data.level > 20) {
        errors.level = 'Level must be between 1 and 20'
    }

    // Optional field length limits
    if (data.playerName && data.playerName.length > 500) {
        errors.playerName = 'Player name must be 500 characters or less'
    }

    if (data.background && data.background.length > 500) {
        errors.background = 'Background must be 500 characters or less'
    }

    if (data.alignment && data.alignment.length > 500) {
        errors.alignment = 'Alignment must be 500 characters or less'
    }

    return errors
}

export const validateAbilityScores = (data: Partial<CharacterFormData>): Record<string, string> => {
    const errors: Record<string, string> = {}

    if (data.abilityScores) {
        const abilities = [
            { key: 'strength', label: 'Strength' },
            { key: 'dexterity', label: 'Dexterity' },
            { key: 'constitution', label: 'Constitution' },
            { key: 'intelligence', label: 'Intelligence' },
            { key: 'wisdom', label: 'Wisdom' },
            { key: 'charisma', label: 'Charisma' },
        ]

        abilities.forEach(({ key, label }) => {
            const score = data.abilityScores?.[key as keyof AbilityScores]?.score
            if (score === undefined || score === null) {
                errors[`abilityScores.${key}`] = `${label} is required`
            } else if (score < 1 || score > 30) {
                errors[`abilityScores.${key}`] = `${label} must be between 1 and 30`
            }
        })
    }

    return errors
}

export const validateCharacterForm = (data: Partial<CharacterFormData>): Record<string, string> => {
    return {
        ...validateBasicInfo(data),
        ...validateAbilityScores(data),
    }
}

export const getDefaultAbilityScores = (): AbilityScores => ({
    strength: { score: 10, modifier: 0 },
    dexterity: { score: 10, modifier: 0 },
    constitution: { score: 10, modifier: 0 },
    intelligence: { score: 10, modifier: 0 },
    wisdom: { score: 10, modifier: 0 },
    charisma: { score: 10, modifier: 0 },
})

export const getDefaultFormData = (): CharacterFormData => ({
    characterName: '',
    playerName: '',
    race: '',
    subrace: '',
    class: '',
    subclass: '',
    level: 1,
    background: '',
    alignment: '',
    abilityScores: getDefaultAbilityScores(),
})
