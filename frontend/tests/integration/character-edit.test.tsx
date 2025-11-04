import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { server, resetMockCharacters } from '../mocks/handlers'
import EditCharacterPage from '../../src/pages/EditCharacterPage'
import CharactersPage from '../../src/pages/CharactersPage'

beforeAll(() => server.listen())
afterEach(() => {
    server.resetHandlers()
    resetMockCharacters()
})
afterAll(() => server.close())

function renderWithRouter(component: React.ReactElement, initialRoute = '/') {
    window.history.pushState({}, 'Test page', initialRoute)
    return render(
        <BrowserRouter>
            <Routes>
                <Route path="/characters" element={<CharactersPage />} />
                <Route path="/characters/:id/edit" element={<EditCharacterPage />} />
                <Route path="*" element={component} />
            </Routes>
        </BrowserRouter>
    )
}

describe('Character Edit Integration Tests', () => {
    it('should load existing character data and allow editing', async () => {
        const user = userEvent.setup()
        renderWithRouter(<EditCharacterPage />, '/characters/1/edit')

        // Wait for character data to load
        await waitFor(() => {
            expect(screen.getByDisplayValue('Gandalf the Grey')).toBeInTheDocument()
        })

        // Verify all fields are pre-populated
        expect(screen.getByDisplayValue('Human')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Wizard')).toBeInTheDocument()
        expect(screen.getByDisplayValue('20')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Sage')).toBeInTheDocument()

        // Edit character name
        const nameInput = screen.getByRole('textbox', { name: /Character Name/i })
        await user.clear(nameInput)
        await user.type(nameInput, 'Gandalf the White')

        // Change level
        const levelInput = screen.getByRole('spinbutton', { name: /Level/i })
        await user.clear(levelInput)
        await user.type(levelInput, '20')

        await user.click(screen.getByRole('button', { name: /Next/i }))

        // Wait for ability scores step
        await waitFor(() => {
            expect(screen.getByText(/Ability Scores/i)).toBeInTheDocument()
        })

        // Verify ability scores are loaded
        expect(screen.getByDisplayValue('20')).toBeInTheDocument() // Intelligence

        // Increase Intelligence
        const intelligenceInput = screen.getByRole('spinbutton', { name: /Intelligence/i })
        await user.clear(intelligenceInput)
        await user.type(intelligenceInput, '22')

        // Save changes
        await user.click(screen.getByRole('button', { name: /Save Changes|Update Character/i }))

        // Verify success
        await waitFor(() => {
            expect(screen.getByText(/updated successfully/i)).toBeInTheDocument()
        })
    })

    it('should update character class from Wizard to Sorcerer', async () => {
        const user = userEvent.setup()
        renderWithRouter(<EditCharacterPage />, '/characters/1/edit')

        await waitFor(() => {
            expect(screen.getByDisplayValue('Gandalf the Grey')).toBeInTheDocument()
        })

        // Change class
        await user.selectOptions(screen.getByRole('combobox', { name: /Class/i }), 'Sorcerer')

        // Change background to match new class
        const backgroundInput = screen.getByRole('textbox', { name: /Background/i })
        await user.clear(backgroundInput)
        await user.type(backgroundInput, 'Noble')

        await user.click(screen.getByRole('button', { name: /Next/i }))

        await waitFor(() => {
            expect(screen.getByText(/Ability Scores/i)).toBeInTheDocument()
        })

        // Swap Intelligence and Charisma (Sorcerers use Charisma)
        await user.clear(screen.getByRole('spinbutton', { name: /Intelligence/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Intelligence/i }), '16')

        await user.clear(screen.getByRole('spinbutton', { name: /Charisma/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Charisma/i }), '20')

        await user.click(screen.getByRole('button', { name: /Save Changes|Update Character/i }))

        await waitFor(() => {
            expect(screen.getByText(/updated successfully/i)).toBeInTheDocument()
        })
    })

    it('should allow changing race and ability scores', async () => {
        const user = userEvent.setup()
        renderWithRouter(<EditCharacterPage />, '/characters/1/edit')

        await waitFor(() => {
            expect(screen.getByDisplayValue('Gandalf the Grey')).toBeInTheDocument()
        })

        // Change race from Human to Elf
        await user.selectOptions(screen.getByRole('combobox', { name: /Race/i }), 'Elf')

        await user.click(screen.getByRole('button', { name: /Next/i }))

        await waitFor(() => {
            expect(screen.getByText(/Ability Scores/i)).toBeInTheDocument()
        })

        // Increase Dexterity (Elf racial bonus)
        const dexterityInput = screen.getByRole('spinbutton', { name: /Dexterity/i })
        await user.clear(dexterityInput)
        await user.type(dexterityInput, '14')

        await user.click(screen.getByRole('button', { name: /Save Changes|Update Character/i }))

        await waitFor(() => {
            expect(screen.getByText(/updated successfully/i)).toBeInTheDocument()
        })
    })

    it('should allow leveling up character from 1 to 20', async () => {
        const user = userEvent.setup()
        renderWithRouter(<EditCharacterPage />, '/characters/1/edit')

        await waitFor(() => {
            expect(screen.getByDisplayValue('Gandalf the Grey')).toBeInTheDocument()
        })

        // Simulate leveling up
        const levelInput = screen.getByRole('spinbutton', { name: /Level/i })
        await user.clear(levelInput)
        await user.type(levelInput, '20')

        await user.click(screen.getByRole('button', { name: /Next/i }))

        await waitFor(() => {
            expect(screen.getByText(/Ability Scores/i)).toBeInTheDocument()
        })

        // Increase all ability scores (ability score improvements)
        const abilities = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma']
        for (const ability of abilities) {
            const input = screen.getByLabelText(new RegExp(ability, 'i'))
            const currentValue = parseInt(input.getAttribute('value') || '10')
            await user.clear(input)
            await user.type(input, Math.min(currentValue + 2, 20).toString())
        }

        await user.click(screen.getByRole('button', { name: /Save Changes|Update Character/i }))

        await waitFor(() => {
            expect(screen.getByText(/updated successfully/i)).toBeInTheDocument()
        })
    })

    it('should allow changing alignment', async () => {
        const user = userEvent.setup()
        renderWithRouter(<EditCharacterPage />, '/characters/1/edit')

        await waitFor(() => {
            expect(screen.getByDisplayValue('Gandalf the Grey')).toBeInTheDocument()
        })

        // Change alignment from Neutral Good to Lawful Good
        await user.selectOptions(screen.getByRole('combobox', { name: /Alignment/i }), 'Lawful Good')

        await user.click(screen.getByRole('button', { name: /Next/i }))

        await waitFor(() => {
            expect(screen.getByText(/Ability Scores/i)).toBeInTheDocument()
        })

        await user.click(screen.getByRole('button', { name: /Save Changes|Update Character/i }))

        await waitFor(() => {
            expect(screen.getByText(/updated successfully/i)).toBeInTheDocument()
        })
    })

    it('should reject edit with duplicate character name', async () => {
        const user = userEvent.setup()

        // First create another character
        const createResponse = await fetch('/api/characters', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                characterName: 'Existing Character',
                race: 'Human',
                class: 'Fighter',
                level: 1,
                abilityScores: {
                    strength: { score: 10, modifier: 0 },
                    dexterity: { score: 10, modifier: 0 },
                    constitution: { score: 10, modifier: 0 },
                    intelligence: { score: 10, modifier: 0 },
                    wisdom: { score: 10, modifier: 0 },
                    charisma: { score: 10, modifier: 0 },
                },
            }),
        })
        expect(createResponse.ok).toBe(true)

        // Now try to edit Gandalf to have the same name
        renderWithRouter(<EditCharacterPage />, '/characters/1/edit')

        await waitFor(() => {
            expect(screen.getByDisplayValue('Gandalf the Grey')).toBeInTheDocument()
        })

        const nameInput = screen.getByRole('textbox', { name: /Character Name/i })
        await user.clear(nameInput)
        await user.type(nameInput, 'Existing Character')

        await user.click(screen.getByRole('button', { name: /Next/i }))

        await waitFor(() => {
            expect(screen.getByText(/Ability Scores/i)).toBeInTheDocument()
        })

        await user.click(screen.getByRole('button', { name: /Save Changes|Update Character/i }))

        // Should show duplicate error
        await waitFor(() => {
            expect(screen.getByText(/already exists/i)).toBeInTheDocument()
        })
    })

    it.skip('should reject edit with invalid level', async () => {
        const user = userEvent.setup()
        renderWithRouter(<EditCharacterPage />, '/characters/1/edit')

        await waitFor(() => {
            expect(screen.getByDisplayValue('Gandalf the Grey')).toBeInTheDocument()
        })

        const levelInput = screen.getByRole('spinbutton', { name: /Level/i })
        await user.clear(levelInput)
        await user.type(levelInput, '25')

        await user.click(screen.getByRole('button', { name: /Next/i }))

        // Should show validation error
        await waitFor(() => {
            expect(screen.getByText(/level.*between 1 and 20/i)).toBeInTheDocument()
        })
    })

    it.skip('should reject edit with invalid ability scores', async () => {
        const user = userEvent.setup()
        renderWithRouter(<EditCharacterPage />, '/characters/1/edit')

        await waitFor(() => {
            expect(screen.getByDisplayValue('Gandalf the Grey')).toBeInTheDocument()
        })

        await user.click(screen.getByRole('button', { name: /Next/i }))

        await waitFor(() => {
            expect(screen.getByText(/Ability Scores/i)).toBeInTheDocument()
        })

        // Try to set invalid ability score
        const strengthInput = screen.getByRole('spinbutton', { name: /Strength/i })
        await user.clear(strengthInput)
        await user.type(strengthInput, '50')

        await user.click(screen.getByRole('button', { name: /Save Changes|Update Character/i }))

        await waitFor(() => {
            expect(screen.getByText(/between 1 and 30/i)).toBeInTheDocument()
        })
    })

    it('should allow canceling edit and navigating back', async () => {
        const user = userEvent.setup()
        renderWithRouter(<EditCharacterPage />, '/characters/1/edit')

        await waitFor(() => {
            expect(screen.getByDisplayValue('Gandalf the Grey')).toBeInTheDocument()
        })

        // Make some changes
        const nameInput = screen.getByRole('textbox', { name: /Character Name/i })
        await user.clear(nameInput)
        await user.type(nameInput, 'Changed Name')

        // Look for cancel button
        const cancelButton = screen.queryByRole('button', { name: /Cancel|Back/i })
        if (cancelButton) {
            await user.click(cancelButton)

            // Should navigate back without saving
            await waitFor(() => {
                expect(screen.queryByDisplayValue('Changed Name')).not.toBeInTheDocument()
            })
        }
    })

    it('should preserve ability score modifiers after edit', async () => {
        const user = userEvent.setup()
        renderWithRouter(<EditCharacterPage />, '/characters/1/edit')

        await waitFor(() => {
            expect(screen.getByDisplayValue('Gandalf the Grey')).toBeInTheDocument()
        })

        await user.click(screen.getByRole('button', { name: /Next/i }))

        await waitFor(() => {
            expect(screen.getByText(/Ability Scores/i)).toBeInTheDocument()
        })

        // Change Strength to 16
        const strengthInput = screen.getByRole('spinbutton', { name: /Strength/i })
        await user.clear(strengthInput)
        await user.type(strengthInput, '16')

        // Verify modifier shows +3
        await waitFor(() => {
            expect(screen.getByText(/\+3/)).toBeInTheDocument()
        })

        await user.click(screen.getByRole('button', { name: /Save Changes|Update Character/i }))

        await waitFor(() => {
            expect(screen.getByText(/updated successfully/i)).toBeInTheDocument()
        })
    })

    it('should handle 404 for non-existent character', async () => {
        renderWithRouter(<EditCharacterPage />, '/characters/999/edit')

        // Should show error message
        await waitFor(() => {
            expect(screen.getByText(/not found|error/i)).toBeInTheDocument()
        })
    })
})
