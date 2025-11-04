// TypeScript types generated from character-schema.json
// Task: T066 - Generate TypeScript types from character schema

export interface Character {
    _id?: string
    characterName: string
    playerName?: string
    race: string
    subrace?: string
    class: string
    subclass?: string
    multiclass?: MulticlassEntry[]
    level: number
    experiencePoints?: number
    background?: string
    alignment?: Alignment
    abilityScores: AbilityScores
    savingThrows?: SavingThrows
    skills: Skills
    proficiencies?: Proficiencies
    hitPoints: HitPoints
    armorClass: number
    initiative: number
    speed: Speed
    inspiration: boolean
    proficiencyBonus: number
    passivePerception: number
    deathSaves?: DeathSaves
    attacks?: Attack[]
    inventory?: Inventory
    spellcasting?: Spellcasting
    features?: Feature[]
    personalityTraits?: string[]
    ideals?: string
    bonds?: string
    flaws?: string
    appearance?: Appearance
    backstory?: string
    alliesAndOrganizations?: string
    treasure?: string
    additionalNotes?: string
    createdAt?: string
    updatedAt?: string
}

export interface MulticlassEntry {
    class: string
    subclass?: string
    level: number
}

export type Alignment =
    | 'Lawful Good'
    | 'Neutral Good'
    | 'Chaotic Good'
    | 'Lawful Neutral'
    | 'True Neutral'
    | 'Chaotic Neutral'
    | 'Lawful Evil'
    | 'Neutral Evil'
    | 'Chaotic Evil'

export interface AbilityScore {
    score: number
    modifier: number
}

export interface AbilityScores {
    strength: AbilityScore
    dexterity: AbilityScore
    constitution: AbilityScore
    intelligence: AbilityScore
    wisdom: AbilityScore
    charisma: AbilityScore
}

export interface SavingThrows {
    strength: boolean
    dexterity: boolean
    constitution: boolean
    intelligence: boolean
    wisdom: boolean
    charisma: boolean
}

export interface Skill {
    proficient: boolean
    expertise: boolean
    modifier: number
}

export interface Skills {
    acrobatics: Skill
    animalHandling: Skill
    arcana: Skill
    athletics: Skill
    deception: Skill
    history: Skill
    insight: Skill
    intimidation: Skill
    investigation: Skill
    medicine: Skill
    nature: Skill
    perception: Skill
    performance: Skill
    persuasion: Skill
    religion: Skill
    sleightOfHand: Skill
    stealth: Skill
    survival: Skill
}

export interface Proficiencies {
    armor?: string[]
    weapons?: string[]
    tools?: string[]
    languages?: string[]
}

export interface HitPoints {
    maximum: number
    current: number
    temporary: number
}

export interface Speed {
    walk: number
    fly?: number
    swim?: number
    climb?: number
    burrow?: number
}

export interface DeathSaves {
    successes: number
    failures: number
}

export interface Attack {
    name: string
    attackBonus: number
    damage: string
    damageType: string
    notes?: string
}

export interface Inventory {
    currency?: Currency
    weapons?: Weapon[]
    armor?: ArmorItem[]
    equipment?: EquipmentItem[]
    carryingCapacity?: number
}

export interface Currency {
    copper: number
    silver: number
    electrum: number
    gold: number
    platinum: number
}

export interface Weapon {
    name: string
    type: string
    damage: string
    damageType: string
    properties?: string[]
    equipped: boolean
    quantity: number
}

export interface ArmorItem {
    name: string
    type: string
    armorClass: number
    equipped: boolean
    stealthDisadvantage: boolean
}

export interface EquipmentItem {
    name: string
    quantity: number
    weight?: number
    description?: string
}

export interface Spellcasting {
    spellcastingAbility?: 'intelligence' | 'wisdom' | 'charisma'
    spellSaveDC?: number
    spellAttackBonus?: number
    spellSlots?: SpellSlots
    cantripsKnown?: string[]
    spellsKnown?: string[]
    preparedSpells?: string[]
}

export interface SpellSlots {
    level1: { total: number; used: number }
    level2: { total: number; used: number }
    level3: { total: number; used: number }
    level4: { total: number; used: number }
    level5: { total: number; used: number }
    level6: { total: number; used: number }
    level7: { total: number; used: number }
    level8: { total: number; used: number }
    level9: { total: number; used: number }
}

export interface Feature {
    name: string
    source: string
    description: string
}

export interface Appearance {
    age?: number
    height?: string
    weight?: string
    eyes?: string
    skin?: string
    hair?: string
    imageUrl?: string
}
