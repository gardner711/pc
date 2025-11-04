// D&D 5e Constants
// Task: T072 - Define D&D constants

export const RACES = [
    'Human',
    'Elf',
    'Dwarf',
    'Halfling',
    'Dragonborn',
    'Gnome',
    'Half-Elf',
    'Half-Orc',
    'Tiefling',
] as const

export const CLASSES = [
    'Barbarian',
    'Bard',
    'Cleric',
    'Druid',
    'Fighter',
    'Monk',
    'Paladin',
    'Ranger',
    'Rogue',
    'Sorcerer',
    'Warlock',
    'Wizard',
] as const

export const ALIGNMENTS = [
    'Lawful Good',
    'Neutral Good',
    'Chaotic Good',
    'Lawful Neutral',
    'True Neutral',
    'Chaotic Neutral',
    'Lawful Evil',
    'Neutral Evil',
    'Chaotic Evil',
] as const

export const BACKGROUNDS = [
    'Acolyte',
    'Charlatan',
    'Criminal',
    'Entertainer',
    'Folk Hero',
    'Guild Artisan',
    'Hermit',
    'Noble',
    'Outlander',
    'Sage',
    'Sailor',
    'Soldier',
    'Urchin',
] as const

export const ABILITIES = [
    'strength',
    'dexterity',
    'constitution',
    'intelligence',
    'wisdom',
    'charisma',
] as const

export const SKILLS = [
    { name: 'acrobatics', ability: 'dexterity' },
    { name: 'animalHandling', ability: 'wisdom' },
    { name: 'arcana', ability: 'intelligence' },
    { name: 'athletics', ability: 'strength' },
    { name: 'deception', ability: 'charisma' },
    { name: 'history', ability: 'intelligence' },
    { name: 'insight', ability: 'wisdom' },
    { name: 'intimidation', ability: 'charisma' },
    { name: 'investigation', ability: 'intelligence' },
    { name: 'medicine', ability: 'wisdom' },
    { name: 'nature', ability: 'intelligence' },
    { name: 'perception', ability: 'wisdom' },
    { name: 'performance', ability: 'charisma' },
    { name: 'persuasion', ability: 'charisma' },
    { name: 'religion', ability: 'intelligence' },
    { name: 'sleightOfHand', ability: 'dexterity' },
    { name: 'stealth', ability: 'dexterity' },
    { name: 'survival', ability: 'wisdom' },
] as const

export const MIN_ABILITY_SCORE = 1
export const MAX_ABILITY_SCORE = 30
export const MIN_LEVEL = 1
export const MAX_LEVEL = 20
export const MAX_STRING_LENGTH = 500
