import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { characterService, CharacterFilters as Filters } from '../services/characterService'
import { Character } from '../types/character'
import CharacterList from '../components/character/CharacterList'
import CharacterFilters from '../components/character/CharacterFilters'
import CharacterPreview from '../components/character/CharacterPreview'
import Button from '../components/common/Button'

export default function CharactersPage() {
    const navigate = useNavigate()
    const [characters, setCharacters] = useState<Character[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)

    // Filter state
    const [search, setSearch] = useState('')
    const [classFilter, setClassFilter] = useState('')
    const [raceFilter, setRaceFilter] = useState('')
    const [sort, setSort] = useState('characterName')
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')

    // Fetch characters with filters
    const fetchCharacters = async () => {
        try {
            setLoading(true)
            setError(null)

            const filters: Filters = {
                search: search || undefined,
                class: classFilter || undefined,
                race: raceFilter || undefined,
                sort: sort || undefined,
                order: order || undefined,
            }

            const data = await characterService.getAll(filters)
            setCharacters(data)
        } catch (err) {
            console.error('Failed to fetch characters:', err)
            setError('Failed to load characters. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCharacters()
    }, [search, classFilter, raceFilter, sort, order])

    const handleCharacterClick = (character: Character) => {
        setSelectedCharacter(character)
    }

    const handleClosePreview = () => {
        setSelectedCharacter(null)
    }

    const handleDelete = () => {
        setSelectedCharacter(null)
        fetchCharacters() // Refresh the list
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Characters</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Browse and manage your D&D 5e characters
                    </p>
                </div>
                <Button onClick={() => navigate('/characters/new')}>
                    Create Character
                </Button>
            </div>

            <CharacterFilters
                search={search}
                classFilter={classFilter}
                raceFilter={raceFilter}
                sort={sort}
                order={order}
                onSearchChange={setSearch}
                onClassChange={setClassFilter}
                onRaceChange={setRaceFilter}
                onSortChange={setSort}
                onOrderChange={setOrder}
            />

            <CharacterList
                characters={characters}
                loading={loading}
                error={error}
                onCharacterClick={handleCharacterClick}
            />

            <CharacterPreview
                character={selectedCharacter}
                onClose={handleClosePreview}
                onDelete={handleDelete}
            />
        </div>
    )
}
