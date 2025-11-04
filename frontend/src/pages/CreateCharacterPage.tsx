import CharacterFormWizard from '../components/character/CharacterFormWizard'

export default function CreateCharacterPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Character</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Fill in the details below to create your D&D 5e character
                </p>
            </div>

            <CharacterFormWizard mode="create" />
        </div>
    )
}
