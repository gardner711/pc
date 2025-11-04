import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Character } from '../../types/character'
import { calculateAbilityModifier } from '../../utils/calculations'
import { characterService } from '../../services/characterService'
import Button from '../common/Button'

interface CharacterPreviewProps {
    character: Character | null
    onClose: () => void
    onDelete?: () => void
}

export default function CharacterPreview({ character, onClose, onDelete }: CharacterPreviewProps) {
    const navigate = useNavigate()
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleting, setDeleting] = useState(false)

    if (!character) return null

    const formatModifier = (score: number) => {
        const mod = calculateAbilityModifier(score)
        return mod >= 0 ? `+${mod}` : `${mod}`
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={onClose}
        >
            <div
                className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-gray-800"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {character.characterName}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Level {character.level} {character.race} {character.class}
                            </p>
                        </div>
                        <Button variant="ghost" onClick={onClose}>
                            ✕
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Basic Info */}
                    <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                        <InfoCard label="HP" value={`${character.hitPoints.current}/${character.hitPoints.maximum}`} />
                        <InfoCard label="AC" value={character.armorClass.toString()} />
                        <InfoCard label="Initiative" value={formatModifier(character.initiative)} />
                        <InfoCard label="Speed" value={`${character.speed.walk} ft`} />
                    </div>

                    {/* Ability Scores */}
                    <div className="mb-6">
                        <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">Ability Scores</h3>
                        <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
                            <AbilityCard label="STR" score={character.abilityScores.strength.score} />
                            <AbilityCard label="DEX" score={character.abilityScores.dexterity.score} />
                            <AbilityCard label="CON" score={character.abilityScores.constitution.score} />
                            <AbilityCard label="INT" score={character.abilityScores.intelligence.score} />
                            <AbilityCard label="WIS" score={character.abilityScores.wisdom.score} />
                            <AbilityCard label="CHA" score={character.abilityScores.charisma.score} />
                        </div>
                    </div>

                    {/* Skills */}
                    {character.skills && (
                        <div className="mb-6">
                            <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">Skills</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
                                {Object.entries(character.skills).map(([skillName, skill]) => (
                                    <div
                                        key={skillName}
                                        className={`flex justify-between rounded px-2 py-1 ${skill.proficient
                                            ? 'bg-indigo-100 dark:bg-indigo-900'
                                            : 'bg-gray-100 dark:bg-gray-700'
                                            }`}
                                    >
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {skillName.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {formatModifier(skill.modifier)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Features */}
                    {character.features && character.features.length > 0 && (
                        <div className="mb-6">
                            <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">Features & Traits</h3>
                            <div className="space-y-2">
                                {character.features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-700"
                                    >
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            {feature.name}
                                            {feature.source && (
                                                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                                    ({feature.source})
                                                </span>
                                            )}
                                        </h4>
                                        {feature.description && (
                                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                {feature.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Inventory */}
                    {character.inventory && (
                        <div className="mb-6">
                            <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">Inventory</h3>

                            {/* Weapons */}
                            {character.inventory.weapons && character.inventory.weapons.length > 0 && (
                                <div className="mb-3">
                                    <h4 className="mb-2 font-semibold text-gray-700 dark:text-gray-300">Weapons</h4>
                                    <div className="space-y-1">
                                        {character.inventory.weapons.map((weapon, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between rounded bg-gray-100 px-3 py-2 text-sm dark:bg-gray-700"
                                            >
                                                <span className="text-gray-900 dark:text-white">
                                                    {weapon.name}
                                                    {weapon.equipped && (
                                                        <span className="ml-2 text-xs text-indigo-600 dark:text-indigo-400">
                                                            (Equipped)
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="text-gray-600 dark:text-gray-400">{weapon.damage}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Armor */}
                            {character.inventory.armor && character.inventory.armor.length > 0 && (
                                <div className="mb-3">
                                    <h4 className="mb-2 font-semibold text-gray-700 dark:text-gray-300">Armor</h4>
                                    <div className="space-y-1">
                                        {character.inventory.armor.map((armor, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between rounded bg-gray-100 px-3 py-2 text-sm dark:bg-gray-700"
                                            >
                                                <span className="text-gray-900 dark:text-white">
                                                    {armor.name}
                                                    {armor.equipped && (
                                                        <span className="ml-2 text-xs text-indigo-600 dark:text-indigo-400">
                                                            (Equipped)
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="text-gray-600 dark:text-gray-400">AC {armor.armorClass}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Spellcasting */}
                    {character.spellcasting && (
                        <div className="mb-6">
                            <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">Spellcasting</h3>
                            <div className="mb-3 grid grid-cols-3 gap-4">
                                {character.spellcasting.spellcastingAbility && (
                                    <InfoCard label="Ability" value={character.spellcasting.spellcastingAbility} />
                                )}
                                {character.spellcasting.spellSaveDC && (
                                    <InfoCard label="Spell Save DC" value={character.spellcasting.spellSaveDC.toString()} />
                                )}
                                {character.spellcasting.spellAttackBonus !== undefined && (
                                    <InfoCard
                                        label="Spell Attack"
                                        value={formatModifier(character.spellcasting.spellAttackBonus)}
                                    />
                                )}
                            </div>

                            {character.spellcasting.cantripsKnown && character.spellcasting.cantripsKnown.length > 0 && (
                                <div className="mb-3">
                                    <h4 className="mb-2 font-semibold text-gray-700 dark:text-gray-300">Cantrips</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {character.spellcasting.cantripsKnown.map((spell, index) => (
                                            <span
                                                key={index}
                                                className="rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                                            >
                                                {spell}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
                    {showDeleteConfirm ? (
                        <div>
                            <p className="mb-4 text-sm text-red-600 dark:text-red-400">
                                Are you sure you want to delete <strong>{character.characterName}</strong>? This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-3">
                                <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>
                                    Cancel
                                </Button>
                                <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                                    {deleting ? 'Deleting...' : 'Delete Character'}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-between">
                            <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
                                Delete
                            </Button>
                            <div className="flex gap-3">
                                <Button variant="secondary" onClick={onClose}>
                                    Close
                                </Button>
                                <Button onClick={handleEdit}>
                                    Edit Character
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

    function handleEdit() {
        if (!character?._id) return
        navigate(`/characters/${character._id}/edit`)
    }

    async function handleDelete() {
        if (!character?._id) return

        setDeleting(true)
        try {
            await characterService.delete(character._id)
            onClose()
            if (onDelete) {
                onDelete()
            }
        } catch (error) {
            console.error('Failed to delete character:', error)
            alert('Failed to delete character. Please try again.')
        } finally {
            setDeleting(false)
        }
    }
}

// Helper Components
function InfoCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-center dark:border-gray-700 dark:bg-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    )
}

function AbilityCard({ label, score }: { label: string; score: number }) {
    const modifier = calculateAbilityModifier(score)
    const modifierStr = modifier >= 0 ? `+${modifier}` : `${modifier}`

    return (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-center dark:border-gray-700 dark:bg-gray-700">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{modifierStr}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{score}</p>
        </div>
    )
}
