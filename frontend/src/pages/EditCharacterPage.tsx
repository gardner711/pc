import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { characterService } from '../services/characterService'
import { Character } from '../types/character'
import CharacterFormWizard from '../components/character/CharacterFormWizard'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function EditCharacterPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [character, setCharacter] = useState<Character | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCharacter = async () => {
            if (!id) {
                navigate('/characters')
                return
            }

            try {
                setLoading(true)
                const data = await characterService.getById(id)
                setCharacter(data)
            } catch (err) {
                console.error('Failed to fetch character:', err)
                setError('Failed to load character. Please try again.')
            } finally {
                setLoading(false)
            }
        }

        fetchCharacter()
    }, [id, navigate])

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    if (error || !character) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 text-6xl">⚠️</div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                        Error Loading Character
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        {error || 'Character not found'}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Edit {character.characterName}
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Update your character's information
                </p>
            </div>

            <CharacterFormWizard mode="edit" initialData={character} />
        </div>
    )
}
