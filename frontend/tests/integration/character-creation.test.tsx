import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { server, resetMockCharacters } from '../mocks/handlers'
import CreateCharacterPage from '../../src/pages/CreateCharacterPage'

// Setup MSW server
beforeAll(() => server.listen())
afterEach(() => {
    server.resetHandlers()
    resetMockCharacters()
})
afterAll(() => server.close())

function renderWithRouter(component: React.ReactElement) {
    return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Character Creation Integration Tests', () => {
    it('should create a valid Fighter character and save to backend', async () => {
        const user = userEvent.setup()
        renderWithRouter(<CreateCharacterPage />)

        // Step 1: Basic Info
        expect(screen.getByText(/Basic Information/i)).toBeInTheDocument()

        // Fill in basic character info
        await user.type(screen.getByRole('textbox', { name: /Character Name/i }), 'Conan the Barbarian')
        await user.selectOptions(screen.getByRole('combobox', { name: /Race/i }), 'Human')
        await user.selectOptions(screen.getByRole('combobox', { name: /Class/i }), 'Fighter')
        await user.clear(screen.getByRole('spinbutton', { name: /Level/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Level/i }), '10')
        await user.type(screen.getByRole('textbox', { name: /Background/i }), 'Soldier')
        await user.selectOptions(screen.getByRole('combobox', { name: /Alignment/i }), 'Chaotic Neutral')

        // Proceed to next step
        await user.click(screen.getByRole('button', { name: /Next/i }))

        // Step 2: Ability Scores
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /Ability Scores/i })).toBeInTheDocument()
        })

        // Set ability scores for a strong Fighter
        const strengthInput = screen.getByRole('spinbutton', { name: /Strength/i })
        await user.clear(strengthInput)
        await user.type(strengthInput, '18')

        const dexterityInput = screen.getByRole('spinbutton', { name: /Dexterity/i })
        await user.clear(dexterityInput)
        await user.type(dexterityInput, '14')

        const constitutionInput = screen.getByRole('spinbutton', { name: /Constitution/i })
        await user.clear(constitutionInput)
        await user.type(constitutionInput, '16')

        const intelligenceInput = screen.getByRole('spinbutton', { name: /Intelligence/i })
        await user.clear(intelligenceInput)
        await user.type(intelligenceInput, '10')

        const wisdomInput = screen.getByRole('spinbutton', { name: /Wisdom/i })
        await user.clear(wisdomInput)
        await user.type(wisdomInput, '12')

        const charismaInput = screen.getByRole('spinbutton', { name: /Charisma/i })
        await user.clear(charismaInput)
        await user.type(charismaInput, '8')

        // Verify modifiers are calculated correctly
        expect(screen.getByText(/\+4/)).toBeInTheDocument() // Strength modifier
        expect(screen.getByText(/\+2/)).toBeInTheDocument() // Dexterity modifier
        expect(screen.getByText(/\+3/)).toBeInTheDocument() // Constitution modifier

        // Submit the form
        await user.click(screen.getByRole('button', { name: /Create Character/i }))

        // Verify success message and navigation
        await waitFor(() => {
            expect(screen.getByText(/Character created successfully/i)).toBeInTheDocument()
        }, { timeout: 3000 })
    })

    it('should create a valid Wizard character with high Intelligence', async () => {
        const user = userEvent.setup()
        renderWithRouter(<CreateCharacterPage />)

        // Basic Info
        await user.type(screen.getByRole('textbox', { name: /Character Name/i }), 'Merlin the Wise')
        await user.selectOptions(screen.getByRole('combobox', { name: /Race/i }), 'Elf')
        await user.selectOptions(screen.getByRole('combobox', { name: /Class/i }), 'Wizard')
        await user.clear(screen.getByRole('spinbutton', { name: /Level/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Level/i }), '15')
        await user.type(screen.getByRole('textbox', { name: /Background/i }), 'Sage')
        await user.selectOptions(screen.getByRole('combobox', { name: /Alignment/i }), 'Lawful Good')

        await user.click(screen.getByRole('button', { name: /Next/i }))

        // Ability Scores - Wizard build
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /Ability Scores/i })).toBeInTheDocument()
        })

        await user.clear(screen.getByRole('spinbutton', { name: /Strength/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Strength/i }), '8')

        await user.clear(screen.getByRole('spinbutton', { name: /Dexterity/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Dexterity/i }), '12')

        await user.clear(screen.getByRole('spinbutton', { name: /Constitution/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Constitution/i }), '14')

        await user.clear(screen.getByRole('spinbutton', { name: /Intelligence/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Intelligence/i }), '20')

        await user.clear(screen.getByRole('spinbutton', { name: /Wisdom/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Wisdom/i }), '16')

        await user.clear(screen.getByRole('spinbutton', { name: /Charisma/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Charisma/i }), '10')

        // Verify Intelligence modifier is +5
        expect(screen.getByText(/\+5/)).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: /Create Character/i }))

        await waitFor(() => {
            expect(screen.getByText(/Character created successfully/i)).toBeInTheDocument()
        })
    })

    it('should create a level 1 character with standard array ability scores', async () => {
        const user = userEvent.setup()
        renderWithRouter(<CreateCharacterPage />)

        await user.type(screen.getByRole('textbox', { name: /Character Name/i }), 'Newbie Adventurer')
        await user.selectOptions(screen.getByRole('combobox', { name: /Race/i }), 'Dwarf')
        await user.selectOptions(screen.getByRole('combobox', { name: /Class/i }), 'Cleric')
        // Level defaults to 1

        await user.click(screen.getByRole('button', { name: /Next/i }))

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /Ability Scores/i })).toBeInTheDocument()
        })

        // Use standard array button if available
        const standardArrayButton = screen.queryByRole('button', { name: /Standard Array/i })
        if (standardArrayButton) {
            await user.click(standardArrayButton)
        } else {
            // Manually set standard array values: 15, 14, 13, 12, 10, 8
            await user.clear(screen.getByRole('spinbutton', { name: /Strength/i }))
            await user.type(screen.getByRole('spinbutton', { name: /Strength/i }), '15')

            await user.clear(screen.getByRole('spinbutton', { name: /Dexterity/i }))
            await user.type(screen.getByRole('spinbutton', { name: /Dexterity/i }), '10')

            await user.clear(screen.getByRole('spinbutton', { name: /Constitution/i }))
            await user.type(screen.getByRole('spinbutton', { name: /Constitution/i }), '14')

            await user.clear(screen.getByRole('spinbutton', { name: /Intelligence/i }))
            await user.type(screen.getByRole('spinbutton', { name: /Intelligence/i }), '8')

            await user.clear(screen.getByRole('spinbutton', { name: /Wisdom/i }))
            await user.type(screen.getByRole('spinbutton', { name: /Wisdom/i }), '13')

            await user.clear(screen.getByRole('spinbutton', { name: /Charisma/i }))
            await user.type(screen.getByRole('spinbutton', { name: /Charisma/i }), '12')
        }

        await user.click(screen.getByRole('button', { name: /Create Character/i }))

        await waitFor(() => {
            expect(screen.getByText(/Character created successfully/i)).toBeInTheDocument()
        })
    })

    it('should create a level 20 character with maximum ability scores', async () => {
        const user = userEvent.setup()
        renderWithRouter(<CreateCharacterPage />)

        await user.type(screen.getByRole('textbox', { name: /Character Name/i }), 'Legendary Hero')
        await user.selectOptions(screen.getByRole('combobox', { name: /Race/i }), 'Half-Elf')
        await user.selectOptions(screen.getByRole('combobox', { name: /Class/i }), 'Paladin')
        await user.clear(screen.getByRole('spinbutton', { name: /Level/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Level/i }), '20')

        await user.click(screen.getByRole('button', { name: /Next/i }))

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /Ability Scores/i })).toBeInTheDocument()
        })

        // Set all abilities to 20 (epic level character)
        const abilities = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma']
        for (const ability of abilities) {
            const input = screen.getByLabelText(new RegExp(ability, 'i'))
            await user.clear(input)
            await user.type(input, '20')
        }

        await user.click(screen.getByRole('button', { name: /Create Character/i }))

        await waitFor(() => {
            expect(screen.getByText(/Character created successfully/i)).toBeInTheDocument()
        })
    })

    it('should create characters with edge case ability scores (1 and 30)', async () => {
        const user = userEvent.setup()
        renderWithRouter(<CreateCharacterPage />)

        await user.type(screen.getByRole('textbox', { name: /Character Name/i }), 'Edge Case Character')
        await user.selectOptions(screen.getByRole('combobox', { name: /Race/i }), 'Tiefling')
        await user.selectOptions(screen.getByRole('combobox', { name: /Class/i }), 'Warlock')

        await user.click(screen.getByRole('button', { name: /Next/i }))

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /Ability Scores/i })).toBeInTheDocument()
        })

        // Test minimum valid score (1)
        await user.clear(screen.getByRole('spinbutton', { name: /Strength/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Strength/i }), '1')

        // Test maximum valid score (30)
        await user.clear(screen.getByRole('spinbutton', { name: /Charisma/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Charisma/i }), '30')

        // Fill remaining with valid values
        await user.clear(screen.getByRole('spinbutton', { name: /Dexterity/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Dexterity/i }), '10')

        await user.clear(screen.getByRole('spinbutton', { name: /Constitution/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Constitution/i }), '10')

        await user.clear(screen.getByRole('spinbutton', { name: /Intelligence/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Intelligence/i }), '10')

        await user.clear(screen.getByRole('spinbutton', { name: /Wisdom/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Wisdom/i }), '10')

        await user.click(screen.getByRole('button', { name: /Create Character/i }))

        await waitFor(() => {
            expect(screen.getByText(/Character created successfully/i)).toBeInTheDocument()
        })
    })

    it('should reject character with duplicate name', async () => {
        const user = userEvent.setup()
        renderWithRouter(<CreateCharacterPage />)

        // Try to create a character with the same name as the mock data
        await user.type(screen.getByRole('textbox', { name: /Character Name/i }), 'Gandalf the Grey')
        await user.selectOptions(screen.getByRole('combobox', { name: /Race/i }), 'Human')
        await user.selectOptions(screen.getByRole('combobox', { name: /Class/i }), 'Wizard')

        await user.click(screen.getByRole('button', { name: /Next/i }))

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /Ability Scores/i })).toBeInTheDocument()
        })

        await user.clear(screen.getByRole('spinbutton', { name: /Strength/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Strength/i }), '10')
        await user.clear(screen.getByRole('spinbutton', { name: /Dexterity/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Dexterity/i }), '10')
        await user.clear(screen.getByRole('spinbutton', { name: /Constitution/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Constitution/i }), '10')
        await user.clear(screen.getByRole('spinbutton', { name: /Intelligence/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Intelligence/i }), '10')
        await user.clear(screen.getByRole('spinbutton', { name: /Wisdom/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Wisdom/i }), '10')
        await user.clear(screen.getByRole('spinbutton', { name: /Charisma/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Charisma/i }), '10')

        await user.click(screen.getByRole('button', { name: /Create Character/i }))

        // Should show error about duplicate name
        await waitFor(() => {
            expect(screen.getByText(/already exists/i)).toBeInTheDocument()
        })
    })

    it.skip('should reject character with invalid level (0)', async () => {
        const user = userEvent.setup()
        renderWithRouter(<CreateCharacterPage />)

        await user.type(screen.getByRole('textbox', { name: /Character Name/i }), 'Invalid Level Character')
        await user.selectOptions(screen.getByRole('combobox', { name: /Race/i }), 'Gnome')
        await user.selectOptions(screen.getByRole('combobox', { name: /Class/i }), 'Rogue')

        const levelInput = screen.getByRole('spinbutton', { name: /Level/i })
        await user.clear(levelInput)
        await user.type(levelInput, '0')

        // Should show validation error immediately or on next click
        await user.click(screen.getByRole('button', { name: /Next/i }))

        // Frontend validation should prevent proceeding
        await waitFor(() => {
            expect(screen.getByText(/level.*between 1 and 20/i)).toBeInTheDocument()
        })
    })

    it.skip('should reject character with invalid level (21)', async () => {
        const user = userEvent.setup()
        renderWithRouter(<CreateCharacterPage />)

        await user.type(screen.getByRole('textbox', { name: /Character Name/i }), 'Over Level Character')
        await user.selectOptions(screen.getByRole('combobox', { name: /Race/i }), 'Dragonborn')
        await user.selectOptions(screen.getByRole('combobox', { name: /Class/i }), 'Sorcerer')

        const levelInput = screen.getByRole('spinbutton', { name: /Level/i })
        await user.clear(levelInput)
        await user.type(levelInput, '21')

        await user.click(screen.getByRole('button', { name: /Next/i }))

        await waitFor(() => {
            expect(screen.getByText(/level.*between 1 and 20/i)).toBeInTheDocument()
        })
    })

    it.skip('should reject character with invalid ability score (0)', async () => {
        const user = userEvent.setup()
        renderWithRouter(<CreateCharacterPage />)

        await user.type(screen.getByRole('textbox', { name: /Character Name/i }), 'Invalid Ability Character')
        await user.selectOptions(screen.getByRole('combobox', { name: /Race/i }), 'Halfling')
        await user.selectOptions(screen.getByRole('combobox', { name: /Class/i }), 'Ranger')

        await user.click(screen.getByRole('button', { name: /Next/i }))

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /Ability Scores/i })).toBeInTheDocument()
        })

        // Try to set an ability score to 0 (invalid)
        const strengthInput = screen.getByRole('spinbutton', { name: /Strength/i })
        await user.clear(strengthInput)
        await user.type(strengthInput, '0')

        await user.clear(screen.getByRole('spinbutton', { name: /Dexterity/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Dexterity/i }), '10')
        await user.clear(screen.getByRole('spinbutton', { name: /Constitution/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Constitution/i }), '10')
        await user.clear(screen.getByRole('spinbutton', { name: /Intelligence/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Intelligence/i }), '10')
        await user.clear(screen.getByRole('spinbutton', { name: /Wisdom/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Wisdom/i }), '10')
        await user.clear(screen.getByRole('spinbutton', { name: /Charisma/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Charisma/i }), '10')

        await user.click(screen.getByRole('button', { name: /Create Character/i }))

        // Should show validation error
        await waitFor(() => {
            expect(screen.getByText(/between 1 and 30/i)).toBeInTheDocument()
        })
    })

    it.skip('should reject character with invalid ability score (31)', async () => {
        const user = userEvent.setup()
        renderWithRouter(<CreateCharacterPage />)

        await user.type(screen.getByRole('textbox', { name: /Character Name/i }), 'Overpowered Character')
        await user.selectOptions(screen.getByRole('combobox', { name: /Race/i }), 'Half-Orc')
        await user.selectOptions(screen.getByRole('combobox', { name: /Class/i }), 'Barbarian')

        await user.click(screen.getByRole('button', { name: /Next/i }))

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /Ability Scores/i })).toBeInTheDocument()
        })

        // Try to set an ability score to 31 (invalid)
        const strengthInput = screen.getByRole('spinbutton', { name: /Strength/i })
        await user.clear(strengthInput)
        await user.type(strengthInput, '31')

        await user.clear(screen.getByRole('spinbutton', { name: /Dexterity/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Dexterity/i }), '10')
        await user.clear(screen.getByRole('spinbutton', { name: /Constitution/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Constitution/i }), '10')
        await user.clear(screen.getByRole('spinbutton', { name: /Intelligence/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Intelligence/i }), '10')
        await user.clear(screen.getByRole('spinbutton', { name: /Wisdom/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Wisdom/i }), '10')
        await user.clear(screen.getByRole('spinbutton', { name: /Charisma/i }))
        await user.type(screen.getByRole('spinbutton', { name: /Charisma/i }), '10')

        await user.click(screen.getByRole('button', { name: /Create Character/i }))

        await waitFor(() => {
            expect(screen.getByText(/between 1 and 30/i)).toBeInTheDocument()
        })
    })

    it.skip('should reject character with name exceeding 500 characters', async () => {
        const user = userEvent.setup()
        renderWithRouter(<CreateCharacterPage />)

        // Create a 501 character string
        const longName = 'A'.repeat(501)

        await user.paste(screen.getByRole('textbox', { name: /Character Name/i }), longName)
        await user.selectOptions(screen.getByRole('combobox', { name: /Race/i }), 'Human')
        await user.selectOptions(screen.getByRole('combobox', { name: /Class/i }), 'Fighter')

        await user.click(screen.getByRole('button', { name: /Next/i }))

        // Should show validation error
        await waitFor(() => {
            expect(screen.getByText(/500 characters or less/i)).toBeInTheDocument()
        })
    })

    it.skip('should reject character missing required fields', async () => {
        const user = userEvent.setup()
        renderWithRouter(<CreateCharacterPage />)

        // Leave character name empty
        await user.selectOptions(screen.getByRole('combobox', { name: /Race/i }), 'Human')
        await user.selectOptions(screen.getByRole('combobox', { name: /Class/i }), 'Fighter')

        await user.click(screen.getByRole('button', { name: /Next/i }))

        // Should show required field error
        await waitFor(() => {
            expect(screen.getByText(/required/i)).toBeInTheDocument()
        })
    })
})
