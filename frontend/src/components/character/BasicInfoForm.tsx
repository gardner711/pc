import { CharacterFormData } from '../../validation/characterValidation'
import { CLASSES, RACES, ALIGNMENTS } from '../../utils/constants'
import Input from '../common/Input'
import Select from '../common/Select'

interface BasicInfoFormProps {
    formData: CharacterFormData
    errors: Record<string, string>
    onChange: (field: keyof CharacterFormData, value: string | number) => void
}

export default function BasicInfoForm({ formData, errors, onChange }: BasicInfoFormProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Basic Information</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                    label="Character Name"
                    type="text"
                    value={formData.characterName}
                    onChange={(e) => onChange('characterName', e.target.value)}
                    error={errors.characterName}
                    placeholder="Enter character name"
                    required
                />

                <Input
                    label="Player Name"
                    type="text"
                    value={formData.playerName || ''}
                    onChange={(e) => onChange('playerName', e.target.value)}
                    error={errors.playerName}
                    placeholder="Enter player name"
                />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Select
                    label="Race"
                    value={formData.race}
                    onChange={(e) => onChange('race', e.target.value)}
                    error={errors.race}
                    options={RACES.map(race => ({ value: race, label: race }))}
                    placeholder="Select a race"
                    required
                />

                <Input
                    label="Subrace"
                    type="text"
                    value={formData.subrace || ''}
                    onChange={(e) => onChange('subrace', e.target.value)}
                    error={errors.subrace}
                    placeholder="Enter subrace (optional)"
                />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Select
                    label="Class"
                    value={formData.class}
                    onChange={(e) => onChange('class', e.target.value)}
                    error={errors.class}
                    options={CLASSES.map(cls => ({ value: cls, label: cls }))}
                    placeholder="Select a class"
                    required
                />

                <Input
                    label="Subclass"
                    type="text"
                    value={formData.subclass || ''}
                    onChange={(e) => onChange('subclass', e.target.value)}
                    error={errors.subclass}
                    placeholder="Enter subclass (optional)"
                />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Input
                    label="Level"
                    type="number"
                    value={formData.level.toString()}
                    onChange={(e) => onChange('level', parseInt(e.target.value) || 1)}
                    error={errors.level}
                    min={1}
                    max={20}
                    required
                />

                <Input
                    label="Background"
                    type="text"
                    value={formData.background || ''}
                    onChange={(e) => onChange('background', e.target.value)}
                    error={errors.background}
                    placeholder="Enter background"
                />

                <Select
                    label="Alignment"
                    value={formData.alignment || ''}
                    onChange={(e) => onChange('alignment', e.target.value)}
                    error={errors.alignment}
                    options={ALIGNMENTS.map(alignment => ({ value: alignment, label: alignment }))}
                    placeholder="Select alignment"
                />
            </div>
        </div>
    )
}
