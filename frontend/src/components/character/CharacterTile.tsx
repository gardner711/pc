import { Character } from '../../types/character'
import { calculateAbilityModifier } from '../../utils/calculations'

interface CharacterTileProps {
    character: Character
    onClick: (character: Character) => void
}

export default function CharacterTile({ character, onClick }: CharacterTileProps) {
    const modifier = calculateAbilityModifier(character.abilityScores.strength.score)
    const modifierStr = modifier >= 0 ? `+${modifier}` : modifier

    return (
        <div
            onClick={() => onClick(character)}
            className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
            {/* Character Portrait Placeholder */}
            <div className="mb-3 flex h-32 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 text-4xl font-bold text-white">
                {character.characterName.charAt(0).toUpperCase()}
            </div>

            {/* Character Name */}
            <h3 className="mb-2 truncate text-lg font-bold text-gray-900 dark:text-white">
                {character.characterName}
            </h3>

            {/* Character Info */}
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>
                    <span className="font-semibold">Race:</span> {character.race}
                    {character.subrace && ` (${character.subrace})`}
                </p>
                <p>
                    <span className="font-semibold">Class:</span> {character.class}
                    {character.subclass && ` (${character.subclass})`}
                </p>
                <p>
                    <span className="font-semibold">Level:</span> {character.level}
                </p>
            </div>

            {/* Quick Stats */}
            <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
                <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">HP</p>
                    <p className="font-bold text-gray-900 dark:text-white">
                        {character.hitPoints.current}/{character.hitPoints.maximum}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">AC</p>
                    <p className="font-bold text-gray-900 dark:text-white">
                        {character.armorClass}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">STR</p>
                    <p className="font-bold text-gray-900 dark:text-white">
                        {modifierStr}
                    </p>
                </div>
            </div>
        </div>
    )
}
