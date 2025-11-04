// D&D 5e Calculation Utilities
// Task: T068-T069 - Implement calculation utilities

/**
 * Calculate ability modifier from ability score
 * Formula: floor((score - 10) / 2)
 */
export function calculateAbilityModifier(score: number): number {
    return Math.floor((score - 10) / 2)
}

/**
 * Calculate proficiency bonus from character level
 * Proficiency bonus progression:
 * Levels 1-4: +2
 * Levels 5-8: +3
 * Levels 9-12: +4
 * Levels 13-16: +5
 * Levels 17-20: +6
 */
export function calculateProficiencyBonus(level: number): number {
    if (level < 1 || level > 20) {
        throw new Error('Level must be between 1 and 20')
    }
    return Math.floor((level - 1) / 4) + 2
}

/**
 * Calculate skill modifier
 * @param abilityModifier - The modifier for the ability score the skill is based on
 * @param proficiencyBonus - Character's proficiency bonus
 * @param proficient - Whether the character is proficient in the skill
 * @param expertise - Whether the character has expertise (double proficiency)
 */
export function calculateSkillModifier(
    abilityModifier: number,
    proficiencyBonus: number,
    proficient: boolean,
    expertise: boolean
): number {
    let modifier = abilityModifier

    if (expertise) {
        modifier += proficiencyBonus * 2
    } else if (proficient) {
        modifier += proficiencyBonus
    }

    return modifier
}

/**
 * Calculate spell save DC
 * Formula: 8 + proficiency bonus + spellcasting ability modifier
 */
export function calculateSpellSaveDC(
    proficiencyBonus: number,
    spellcastingAbilityModifier: number
): number {
    return 8 + proficiencyBonus + spellcastingAbilityModifier
}

/**
 * Calculate spell attack bonus
 * Formula: proficiency bonus + spellcasting ability modifier
 */
export function calculateSpellAttackBonus(
    proficiencyBonus: number,
    spellcastingAbilityModifier: number
): number {
    return proficiencyBonus + spellcastingAbilityModifier
}

/**
 * Calculate passive perception
 * Formula: 10 + perception modifier
 */
export function calculatePassivePerception(perceptionModifier: number): number {
    return 10 + perceptionModifier
}

/**
 * Format modifier for display
 * Example: 3 -> "+3", -2 -> "-2", 0 -> "+0"
 */
export function formatModifier(modifier: number): string {
    if (modifier >= 0) {
        return `+${modifier}`
    }
    return modifier.toString()
}
