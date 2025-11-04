import { CharacterFormData } from '../../validation/characterValidation'
import { calculateAbilityModifier } from '../../utils/calculations'
import Input from '../common/Input'

interface AbilityScoresFormProps {
    formData: CharacterFormData
    errors: Record<string, string>
    onChange: (field: keyof CharacterFormData, value: any) => void
}

export default function AbilityScoresForm({ formData, errors, onChange }: AbilityScoresFormProps) {
    const handleAbilityChange = (ability: string, value: number) => {
        const newAbilityScores = {
            ...formData.abilityScores,
            [ability]: {
                score: value,
                modifier: calculateAbilityModifier(value),
            },
        }
        onChange('abilityScores', newAbilityScores)
    }

    const abilities = [
        { key: 'strength', label: 'Strength', abbr: 'STR' },
        { key: 'dexterity', label: 'Dexterity', abbr: 'DEX' },
        { key: 'constitution', label: 'Constitution', abbr: 'CON' },
        { key: 'intelligence', label: 'Intelligence', abbr: 'INT' },
        { key: 'wisdom', label: 'Wisdom', abbr: 'WIS' },
        { key: 'charisma', label: 'Charisma', abbr: 'CHA' },
    ]

    const standardArray = [15, 14, 13, 12, 10, 8]

    const applyStandardArray = () => {
        const newAbilityScores = { ...formData.abilityScores }
        abilities.forEach((ability, index) => {
            const score = standardArray[index]
            newAbilityScores[ability.key as keyof typeof newAbilityScores] = {
                score,
                modifier: calculateAbilityModifier(score),
            }
        })
        onChange('abilityScores', newAbilityScores)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Ability Scores</h3>
                <button
                    type="button"
                    onClick={applyStandardArray}
                    className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                    Use Standard Array (15, 14, 13, 12, 10, 8)
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {abilities.map(({ key, label, abbr }) => {
                    const score = formData.abilityScores[key as keyof typeof formData.abilityScores]?.score || 10
                    const modifier = calculateAbilityModifier(score)
                    const modifierStr = modifier >= 0 ? `+${modifier}` : `${modifier}`

                    return (
                        <div key={key} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                            <Input
                                label={label}
                                type="number"
                                value={score.toString()}
                                onChange={(e) => handleAbilityChange(key, parseInt(e.target.value) || 10)}
                                error={errors[`abilityScores.${key}`]}
                                min={1}
                                max={30}
                                className="text-center"
                            />
                            <p className="mt-2 text-center text-2xl font-bold text-gray-900 dark:text-white">
                                {modifierStr}
                            </p>
                            <p className="text-center text-xs text-gray-500 dark:text-gray-400">{abbr}</p>
                        </div>
                    )
                })}
            </div>

            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Tip:</strong> Standard ability scores range from 1-20 for most characters. Ability
                    modifiers are automatically calculated using the formula: (score - 10) / 2.
                </p>
            </div>
        </div>
    )
}
