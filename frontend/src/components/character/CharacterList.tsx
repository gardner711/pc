import { Character } from '../../types/character'
import CharacterTile from './CharacterTile'
import LoadingSpinner from '../common/LoadingSpinner'

interface CharacterListProps {
    characters: Character[]
    loading: boolean
    error: string | null
    onCharacterClick: (character: Character) => void
}

export default function CharacterList({
    characters,
    loading,
    error,
    onCharacterClick,
}: CharacterListProps) {
    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        )
    } if (error) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 text-6xl">⚠️</div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                        Error Loading Characters
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{error}</p>
                </div>
            </div>
        )
    }

    if (characters.length === 0) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 text-6xl">📜</div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                        No Characters Found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Try adjusting your search filters or create a new character.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {characters.map((character) => (
                <CharacterTile
                    key={character._id}
                    character={character}
                    onClick={onCharacterClick}
                />
            ))}
        </div>
    )
}
