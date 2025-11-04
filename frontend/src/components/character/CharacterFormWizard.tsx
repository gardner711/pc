import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Character } from '../../types/character'
import {
    CharacterFormData,
    validateCharacterForm,
    getDefaultFormData,
} from '../../validation/characterValidation'
import { characterService } from '../../services/characterService'
import { calculateProficiencyBonus } from '../../utils/calculations'
import BasicInfoForm from './BasicInfoForm'
import AbilityScoresForm from './AbilityScoresForm'
import Button from '../common/Button'

interface CharacterFormWizardProps {
    initialData?: Character
    mode: 'create' | 'edit'
}

export default function CharacterFormWizard({ initialData, mode }: CharacterFormWizardProps) {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState<CharacterFormData>(() => {
        if (initialData) {
            return {
                characterName: initialData.characterName,
                playerName: initialData.playerName,
                race: initialData.race,
                subrace: initialData.subrace,
                class: initialData.class,
                subclass: initialData.subclass,
                level: initialData.level,
                background: initialData.background,
                alignment: initialData.alignment,
                abilityScores: initialData.abilityScores,
            }
        }
        return getDefaultFormData()
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const steps = [
        { title: 'Basic Info', component: BasicInfoForm },
        { title: 'Ability Scores', component: AbilityScoresForm },
    ]

    const handleChange = (field: keyof CharacterFormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
        // Clear error for this field
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[field]
                return newErrors
            })
        }
    }

    const validateCurrentStep = (): boolean => {
        const validationErrors = validateCharacterForm(formData)
        setErrors(validationErrors)
        return Object.keys(validationErrors).length === 0
    }

    const handleNext = () => {
        if (validateCurrentStep()) {
            setCurrentStep((prev) => prev + 1)
        }
    }

    const handleBack = () => {
        setCurrentStep((prev) => prev - 1)
    }

    const handleSubmit = async () => {
        if (!validateCurrentStep()) {
            return
        }

        setSubmitting(true)
        setSubmitError(null)

        try {
            // Build complete character object
            const characterData: any = {
                ...formData,
                // Calculate derived stats
                proficiencyBonus: calculateProficiencyBonus(formData.level),
                initiative: formData.abilityScores.dexterity.modifier,
                passivePerception: 10 + formData.abilityScores.wisdom.modifier,

                // Set default values for required fields
                hitPoints: {
                    maximum: 10 + formData.abilityScores.constitution.modifier,
                    current: 10 + formData.abilityScores.constitution.modifier,
                    temporary: 0,
                },
                armorClass: 10 + formData.abilityScores.dexterity.modifier,
                speed: { walk: 30 },
                skills: {
                    acrobatics: { proficient: false, expertise: false, modifier: formData.abilityScores.dexterity.modifier },
                    animalHandling: { proficient: false, expertise: false, modifier: formData.abilityScores.wisdom.modifier },
                    arcana: { proficient: false, expertise: false, modifier: formData.abilityScores.intelligence.modifier },
                    athletics: { proficient: false, expertise: false, modifier: formData.abilityScores.strength.modifier },
                    deception: { proficient: false, expertise: false, modifier: formData.abilityScores.charisma.modifier },
                    history: { proficient: false, expertise: false, modifier: formData.abilityScores.intelligence.modifier },
                    insight: { proficient: false, expertise: false, modifier: formData.abilityScores.wisdom.modifier },
                    intimidation: { proficient: false, expertise: false, modifier: formData.abilityScores.charisma.modifier },
                    investigation: { proficient: false, expertise: false, modifier: formData.abilityScores.intelligence.modifier },
                    medicine: { proficient: false, expertise: false, modifier: formData.abilityScores.wisdom.modifier },
                    nature: { proficient: false, expertise: false, modifier: formData.abilityScores.intelligence.modifier },
                    perception: { proficient: false, expertise: false, modifier: formData.abilityScores.wisdom.modifier },
                    performance: { proficient: false, expertise: false, modifier: formData.abilityScores.charisma.modifier },
                    persuasion: { proficient: false, expertise: false, modifier: formData.abilityScores.charisma.modifier },
                    religion: { proficient: false, expertise: false, modifier: formData.abilityScores.intelligence.modifier },
                    sleightOfHand: { proficient: false, expertise: false, modifier: formData.abilityScores.dexterity.modifier },
                    stealth: { proficient: false, expertise: false, modifier: formData.abilityScores.dexterity.modifier },
                    survival: { proficient: false, expertise: false, modifier: formData.abilityScores.wisdom.modifier },
                },
                inspiration: false,
            }

            if (mode === 'edit' && initialData?._id) {
                await characterService.update(initialData._id, characterData)
            } else {
                await characterService.create(characterData)
            }

            navigate('/characters')
        } catch (error: any) {
            console.error('Failed to save character:', error)
            setSubmitError(error.response?.data?.error || 'Failed to save character. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    const CurrentStepComponent = steps[currentStep].component

    return (
        <div className="mx-auto max-w-4xl">
            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div key={step.title} className="flex flex-1 items-center">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${index <= currentStep
                                            ? 'border-indigo-600 bg-indigo-600 text-white'
                                            : 'border-gray-300 bg-white text-gray-500 dark:border-gray-600 dark:bg-gray-800'
                                        }`}
                                >
                                    {index < currentStep ? '✓' : index + 1}
                                </div>
                                <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {step.title}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`mx-4 h-1 flex-1 ${index < currentStep ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Form */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <CurrentStepComponent formData={formData} errors={errors} onChange={handleChange} />

                {submitError && (
                    <div className="mt-4 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                        <p className="text-sm text-red-800 dark:text-red-200">{submitError}</p>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-6 flex justify-between">
                    <div>
                        {currentStep > 0 && (
                            <Button variant="secondary" onClick={handleBack}>
                                Back
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => navigate('/characters')}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        {currentStep < steps.length - 1 ? (
                            <Button onClick={handleNext}>Next</Button>
                        ) : (
                            <Button onClick={handleSubmit} disabled={submitting}>
                                {submitting ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Create Character'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
