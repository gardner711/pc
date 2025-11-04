import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { server, resetMockCharacters } from '../mocks/handlers'

beforeAll(() => server.listen())
afterEach(() => {
    server.resetHandlers()
    resetMockCharacters()
})
afterAll(() => server.close())

describe('Backend Validation Integration Tests', () => {
    describe('Character Name Validation', () => {
        it('should accept character name with exactly 500 characters', async () => {
            const name = 'A'.repeat(500)

            const response = await fetch('/api/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    characterName: name,
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

            expect(response.status).toBe(201)
        })

        it('should reject character name with 501 characters', async () => {
            const name = 'A'.repeat(501)

            const response = await fetch('/api/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    characterName: name,
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

            expect(response.status).toBe(400)
            const data = await response.json()
            expect(data.details).toContain('character name must be 500 characters or less')
        })

        it('should reject empty character name', async () => {
            const response = await fetch('/api/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    characterName: '',
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

            expect(response.status).toBe(400)
            const data = await response.json()
            expect(data.details).toContain('character name is required')
        })

        it('should reject duplicate character name', async () => {
            const characterData = {
                characterName: 'Duplicate Name Test',
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
            }

            // Create first character
            const response1 = await fetch('/api/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(characterData),
            })
            expect(response1.status).toBe(201)

            // Try to create second with same name
            const response2 = await fetch('/api/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(characterData),
            })
            expect(response2.status).toBe(409)
            const data = await response2.json()
            expect(data.error).toContain('already exists')
        })
    })

    describe('Level Validation', () => {
        const createCharacterWithLevel = (level: number) => ({
            characterName: `Level ${level} Character`,
            race: 'Human',
            class: 'Fighter',
            level,
            abilityScores: {
                strength: { score: 10, modifier: 0 },
                dexterity: { score: 10, modifier: 0 },
                constitution: { score: 10, modifier: 0 },
                intelligence: { score: 10, modifier: 0 },
                wisdom: { score: 10, modifier: 0 },
                charisma: { score: 10, modifier: 0 },
            },
        })

        it('should accept level 1', async () => {
            const response = await fetch('/api/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createCharacterWithLevel(1)),
            })
            expect(response.status).toBe(201)
        })

        it('should accept level 10', async () => {
            const response = await fetch('/api/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createCharacterWithLevel(10)),
            })
            expect(response.status).toBe(201)
        })

        it('should accept level 20', async () => {
            const response = await fetch('/api/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createCharacterWithLevel(20)),
            })
            expect(response.status).toBe(201)
        })

        it('should reject level 0', async () => {
            const response = await fetch('/api/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createCharacterWithLevel(0)),
            })
            expect(response.status).toBe(400)
            const data = await response.json()
            expect(data.details).toContain('level must be between 1 and 20')
        })

        it('should reject level 21', async () => {
            const response = await fetch('/api/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createCharacterWithLevel(21)),
            })
            expect(response.status).toBe(400)
            const data = await response.json()
            expect(data.details).toContain('level must be between 1 and 20')
        })

        it('should reject negative level', async () => {
            const response = await fetch('/api/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createCharacterWithLevel(-5)),
            })
            expect(response.status).toBe(400)
        })
    })

    describe('Ability Score Validation', () => {
        const createCharacterWithAbility = (ability: string, score: number) => ({
            characterName: `${ability} ${score} Character`,
            race: 'Human',
            class: 'Fighter',
            level: 1,
            abilityScores: {
                strength: { score: ability === 'strength' ? score : 10, modifier: 0 },
                dexterity: { score: ability === 'dexterity' ? score : 10, modifier: 0 },
                constitution: { score: ability === 'constitution' ? score : 10, modifier: 0 },
                intelligence: { score: ability === 'intelligence' ? score : 10, modifier: 0 },
                wisdom: { score: ability === 'wisdom' ? score : 10, modifier: 0 },
                charisma: { score: ability === 'charisma' ? score : 10, modifier: 0 },
            },
        })

        const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']

        abilities.forEach(ability => {
            it(`should accept ${ability} score of 1`, async () => {
                const response = await fetch('/api/characters', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(createCharacterWithAbility(ability, 1)),
                })
                expect(response.status).toBe(201)
            })

            it(`should accept ${ability} score of 15`, async () => {
                const response = await fetch('/api/characters', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(createCharacterWithAbility(ability, 15)),
                })
                expect(response.status).toBe(201)
            })

            it(`should accept ${ability} score of 30`, async () => {
                const response = await fetch('/api/characters', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(createCharacterWithAbility(ability, 30)),
                })
                expect(response.status).toBe(201)
            })

            it(`should reject ${ability} score of 0`, async () => {
                const response = await fetch('/api/characters', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(createCharacterWithAbility(ability, 0)),
                })
                expect(response.status).toBe(400)
                const data = await response.json()
                expect(data.details.some((msg: string) => msg.includes(ability))).toBe(true)
            })

            it(`should reject ${ability} score of 31`, async () => {
                const response = await fetch('/api/characters', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(createCharacterWithAbility(ability, 31)),
                })
                expect(response.status).toBe(400)
                const data = await response.json()
                expect(data.details.some((msg: string) => msg.includes(ability))).toBe(true)
            })
        })

        it('should reject multiple invalid ability scores', async () => {
            const response = await fetch('/api/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    characterName: 'Multiple Invalid Scores',
                    race: 'Human',
                    class: 'Fighter',
                    level: 1,
                    abilityScores: {
                        strength: { score: 0, modifier: 0 },
                        dexterity: { score: 40, modifier: 0 },
                        constitution: { score: -5, modifier: 0 },
                        intelligence: { score: 10, modifier: 0 },
                        wisdom: { score: 10, modifier: 0 },
                        charisma: { score: 10, modifier: 0 },
                    },
                }),
            })

            expect(response.status).toBe(400)
            const data = await response.json()
            expect(data.details.length).toBeGreaterThan(1)
        })
    })

    describe('Required Fields Validation', () => {
        it('should reject character missing race', async () => {
            const response = await fetch('/api/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    characterName: 'No Race Character',
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

            expect(response.status).toBe(400)
            const data = await response.json()
            expect(data.details).toContain('race is required')
        })

        it('should reject character missing class', async () => {
            const response = await fetch('/api/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    characterName: 'No Class Character',
                    race: 'Human',
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

            expect(response.status).toBe(400)
            const data = await response.json()
            expect(data.details).toContain('class is required')
        })
    })

    describe('Optional Fields Validation', () => {
        it('should accept character with background exceeding 500 chars', async () => {
            const response = await fetch('/api/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    characterName: 'Long Background',
                    race: 'Human',
                    class: 'Fighter',
                    level: 1,
                    background: 'A'.repeat(501),
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

            expect(response.status).toBe(400)
            const data = await response.json()
            expect(data.details).toContain('background must be 500 characters or less')
        })

        it('should accept character without optional background field', async () => {
            const response = await fetch('/api/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    characterName: 'No Background',
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

            expect(response.status).toBe(201)
        })

        it('should accept character without optional alignment field', async () => {
            const response = await fetch('/api/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    characterName: 'No Alignment',
                    race: 'Dwarf',
                    class: 'Cleric',
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

            expect(response.status).toBe(201)
        })
    })

    describe('Data Persistence', () => {
        it('should persist character and retrieve it by ID', async () => {
            const characterData = {
                characterName: 'Persistence Test',
                race: 'Human',
                class: 'Fighter',
                level: 5,
                background: 'Soldier',
                alignment: 'Lawful Good',
                abilityScores: {
                    strength: { score: 16, modifier: 3 },
                    dexterity: { score: 14, modifier: 2 },
                    constitution: { score: 15, modifier: 2 },
                    intelligence: { score: 10, modifier: 0 },
                    wisdom: { score: 12, modifier: 1 },
                    charisma: { score: 8, modifier: -1 },
                },
            }

            // Create character
            const createResponse = await fetch('/api/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(characterData),
            })
            expect(createResponse.status).toBe(201)
            const createResult = await createResponse.json()
            const created = createResult.data

            // Retrieve character
            const getResponse = await fetch(`/api/characters/${created._id}`)
            expect(getResponse.status).toBe(200)
            const getResult = await getResponse.json()
            const retrieved = getResult.data

            expect(retrieved.characterName).toBe(characterData.characterName)
            expect(retrieved.race).toBe(characterData.race)
            expect(retrieved.class).toBe(characterData.class)
            expect(retrieved.level).toBe(characterData.level)
            expect(retrieved.abilityScores.strength.score).toBe(16)
        })

        it('should persist all ability scores correctly', async () => {
            const response = await fetch('/api/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    characterName: 'All Abilities Test',
                    race: 'Human',
                    class: 'Wizard',
                    level: 1,
                    abilityScores: {
                        strength: { score: 8, modifier: -1 },
                        dexterity: { score: 12, modifier: 1 },
                        constitution: { score: 14, modifier: 2 },
                        intelligence: { score: 18, modifier: 4 },
                        wisdom: { score: 13, modifier: 1 },
                        charisma: { score: 10, modifier: 0 },
                    },
                }),
            })

            expect(response.status).toBe(201)
            const character = await response.json()

            expect(character.abilityScores.strength.score).toBe(8)
            expect(character.abilityScores.dexterity.score).toBe(12)
            expect(character.abilityScores.constitution.score).toBe(14)
            expect(character.abilityScores.intelligence.score).toBe(18)
            expect(character.abilityScores.wisdom.score).toBe(13)
            expect(character.abilityScores.charisma.score).toBe(10)
        })
    })
})
