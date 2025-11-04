import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { server, resetMockCharacters } from '../mocks/handlers'
import CharactersPage from '../../src/pages/CharactersPage'

beforeAll(() => server.listen())
afterEach(() => {
    server.resetHandlers()
    resetMockCharacters()
})
afterAll(() => server.close())

function renderWithRouter(component: React.ReactElement) {
    return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Character Delete Integration Tests', () => {
    it('should delete a character after confirmation', async () => {
        const user = userEvent.setup()
        renderWithRouter(<CharactersPage />)

        // Wait for characters to load
        await waitFor(() => {
            expect(screen.getByText('Gandalf the Grey')).toBeInTheDocument()
        })

        // Click on character to open preview
        await user.click(screen.getByText('Gandalf the Grey'))

        // Wait for preview modal
        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument()
        })

        // Click delete button
        const deleteButton = screen.getByRole('button', { name: /delete/i })
        await user.click(deleteButton)

        // Confirmation dialog should appear
        await waitFor(() => {
            expect(screen.getByText(/confirm.*delete/i)).toBeInTheDocument()
        })

        // Confirm deletion
        const confirmButton = screen.getByRole('button', { name: /confirm|yes|delete/i })
        await user.click(confirmButton)

        // Character should be removed from list
        await waitFor(() => {
            expect(screen.queryByText('Gandalf the Grey')).not.toBeInTheDocument()
        }, { timeout: 3000 })
    })

    it('should cancel deletion when user clicks cancel', async () => {
        const user = userEvent.setup()
        renderWithRouter(<CharactersPage />)

        await waitFor(() => {
            expect(screen.getByText('Gandalf the Grey')).toBeInTheDocument()
        })

        await user.click(screen.getByText('Gandalf the Grey'))

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument()
        })

        const deleteButton = screen.getByRole('button', { name: /delete/i })
        await user.click(deleteButton)

        await waitFor(() => {
            expect(screen.getByText(/confirm.*delete/i)).toBeInTheDocument()
        })

        // Click cancel instead of confirm
        const cancelButton = screen.getByRole('button', { name: /cancel|no/i })
        await user.click(cancelButton)

        // Character should still be in the list
        await waitFor(() => {
            expect(screen.getByText('Gandalf the Grey')).toBeInTheDocument()
        })
    })

    it('should handle deletion of multiple characters sequentially', async () => {
        const user = userEvent.setup()

        // Create additional characters first
        await fetch('/api/characters', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                characterName: 'Character to Delete 1',
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

        await fetch('/api/characters', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                characterName: 'Character to Delete 2',
                race: 'Elf',
                class: 'Wizard',
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

        renderWithRouter(<CharactersPage />)

        await waitFor(() => {
            expect(screen.getByText('Character to Delete 1')).toBeInTheDocument()
            expect(screen.getByText('Character to Delete 2')).toBeInTheDocument()
        })

        // Delete first character
        await user.click(screen.getByText('Character to Delete 1'))
        await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())
        await user.click(screen.getByRole('button', { name: /delete/i }))
        await waitFor(() => expect(screen.getByText(/confirm.*delete/i)).toBeInTheDocument())
        await user.click(screen.getAllByRole('button', { name: /confirm|yes|delete/i })[0])

        await waitFor(() => {
            expect(screen.queryByText('Character to Delete 1')).not.toBeInTheDocument()
        })

        // Delete second character
        await user.click(screen.getByText('Character to Delete 2'))
        await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())
        await user.click(screen.getByRole('button', { name: /delete/i }))
        await waitFor(() => expect(screen.getByText(/confirm.*delete/i)).toBeInTheDocument())
        await user.click(screen.getAllByRole('button', { name: /confirm|yes|delete/i })[0])

        await waitFor(() => {
            expect(screen.queryByText('Character to Delete 2')).not.toBeInTheDocument()
        })
    })

    it('should refresh character list after deletion', async () => {
        const user = userEvent.setup()

        // Create a character to delete
        await fetch('/api/characters', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                characterName: 'Temporary Character',
                race: 'Dwarf',
                class: 'Cleric',
                level: 5,
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

        renderWithRouter(<CharactersPage />)

        // Verify both characters are present
        await waitFor(() => {
            expect(screen.getByText('Gandalf the Grey')).toBeInTheDocument()
            expect(screen.getByText('Temporary Character')).toBeInTheDocument()
        })

        // Delete the temporary character
        await user.click(screen.getByText('Temporary Character'))
        await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())
        await user.click(screen.getByRole('button', { name: /delete/i }))
        await waitFor(() => expect(screen.getByText(/confirm.*delete/i)).toBeInTheDocument())
        await user.click(screen.getAllByRole('button', { name: /confirm|yes|delete/i })[0])

        // List should be refreshed - only Gandalf remains
        await waitFor(() => {
            expect(screen.queryByText('Temporary Character')).not.toBeInTheDocument()
            expect(screen.getByText('Gandalf the Grey')).toBeInTheDocument()
        })
    })

    it('should handle 404 error when deleting non-existent character', async () => {
        renderWithRouter(<CharactersPage />)

        await waitFor(() => {
            expect(screen.getByText('Gandalf the Grey')).toBeInTheDocument()
        })

        // Manually trigger delete with invalid ID (this tests error handling)
        // In a real scenario, this might happen if another user deleted the character first
        const deleteResponse = await fetch('/api/characters/invalid-id', {
            method: 'DELETE',
        })

        expect(deleteResponse.status).toBe(404)
    })

    it('should close preview modal after successful deletion', async () => {
        const user = userEvent.setup()
        renderWithRouter(<CharactersPage />)

        await waitFor(() => {
            expect(screen.getByText('Gandalf the Grey')).toBeInTheDocument()
        })

        await user.click(screen.getByText('Gandalf the Grey'))

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument()
        })

        const deleteButton = screen.getByRole('button', { name: /delete/i })
        await user.click(deleteButton)

        await waitFor(() => {
            expect(screen.getByText(/confirm.*delete/i)).toBeInTheDocument()
        })

        await user.click(screen.getAllByRole('button', { name: /confirm|yes|delete/i })[0])

        // Both the confirmation and preview modal should close
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        }, { timeout: 3000 })
    })

    it('should display empty state when all characters are deleted', async () => {
        const user = userEvent.setup()
        renderWithRouter(<CharactersPage />)

        await waitFor(() => {
            expect(screen.getByText('Gandalf the Grey')).toBeInTheDocument()
        })

        // Delete the only character
        await user.click(screen.getByText('Gandalf the Grey'))
        await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())
        await user.click(screen.getByRole('button', { name: /delete/i }))
        await waitFor(() => expect(screen.getByText(/confirm.*delete/i)).toBeInTheDocument())
        await user.click(screen.getAllByRole('button', { name: /confirm|yes|delete/i })[0])

        // Should show empty state message
        await waitFor(() => {
            expect(screen.getByText(/no characters found|create your first character/i)).toBeInTheDocument()
        })
    })
})
