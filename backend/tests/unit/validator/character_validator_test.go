package validator_test

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/yourusername/dnd-character-creator/internal/models"
	"github.com/yourusername/dnd-character-creator/internal/validator"
)

func TestCharacterValidator_Validate_ValidCharacter(t *testing.T) {
	v := validator.NewCharacterValidator()

	character := &models.Character{
		CharacterName: "Test Character",
		Race:          "Human",
		Class:         "Fighter",
		Level:         5,
		AbilityScores: models.AbilityScores{
			Strength:     models.AbilityScore{Score: 16, Modifier: 3},
			Dexterity:    models.AbilityScore{Score: 14, Modifier: 2},
			Constitution: models.AbilityScore{Score: 15, Modifier: 2},
			Intelligence: models.AbilityScore{Score: 10, Modifier: 0},
			Wisdom:       models.AbilityScore{Score: 12, Modifier: 1},
			Charisma:     models.AbilityScore{Score: 8, Modifier: -1},
		},
	}

	errors := v.Validate(character)
	assert.Empty(t, errors, "Valid character should have no errors")
}

func TestCharacterValidator_Validate_MissingRequiredFields(t *testing.T) {
	v := validator.NewCharacterValidator()

	tests := []struct {
		name          string
		character     *models.Character
		expectedError string
	}{
		{
			name: "missing character name",
			character: &models.Character{
				Race:  "Human",
				Class: "Fighter",
				Level: 5,
				AbilityScores: models.AbilityScores{
					Strength: models.AbilityScore{Score: 10, Modifier: 0},
				},
			},
			expectedError: "character name is required",
		},
		{
			name: "missing race",
			character: &models.Character{
				CharacterName: "Test",
				Class:         "Fighter",
				Level:         5,
				AbilityScores: models.AbilityScores{
					Strength: models.AbilityScore{Score: 10, Modifier: 0},
				},
			},
			expectedError: "race is required",
		},
		{
			name: "missing class",
			character: &models.Character{
				CharacterName: "Test",
				Race:          "Human",
				Level:         5,
				AbilityScores: models.AbilityScores{
					Strength: models.AbilityScore{Score: 10, Modifier: 0},
				},
			},
			expectedError: "class is required",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			errors := v.Validate(tt.character)
			assert.Contains(t, errors, tt.expectedError)
		})
	}
}

func TestCharacterValidator_Validate_LevelConstraints(t *testing.T) {
	v := validator.NewCharacterValidator()

	tests := []struct {
		name            string
		level           int
		shouldHaveError bool
	}{
		{"level 0 invalid", 0, true},
		{"level 1 valid", 1, false},
		{"level 10 valid", 10, false},
		{"level 20 valid", 20, false},
		{"level 21 invalid", 21, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			character := &models.Character{
				CharacterName: "Test",
				Race:          "Human",
				Class:         "Fighter",
				Level:         tt.level,
				AbilityScores: getValidAbilityScores(),
			}

			errors := v.Validate(character)
			if tt.shouldHaveError {
				assert.Contains(t, errors, "level must be between 1 and 20")
			} else {
				assert.NotContains(t, errors, "level must be between 1 and 20")
			}
		})
	}
}

func TestCharacterValidator_Validate_AbilityScoreConstraints(t *testing.T) {
	v := validator.NewCharacterValidator()

	tests := []struct {
		name            string
		score           int
		shouldHaveError bool
	}{
		{"score 0 invalid", 0, true},
		{"score 1 valid", 1, false},
		{"score 15 valid", 15, false},
		{"score 30 valid", 30, false},
		{"score 31 invalid", 31, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			character := &models.Character{
				CharacterName: "Test",
				Race:          "Human",
				Class:         "Fighter",
				Level:         5,
				AbilityScores: models.AbilityScores{
					Strength:     models.AbilityScore{Score: tt.score, Modifier: 0},
					Dexterity:    models.AbilityScore{Score: 10, Modifier: 0},
					Constitution: models.AbilityScore{Score: 10, Modifier: 0},
					Intelligence: models.AbilityScore{Score: 10, Modifier: 0},
					Wisdom:       models.AbilityScore{Score: 10, Modifier: 0},
					Charisma:     models.AbilityScore{Score: 10, Modifier: 0},
				},
			}

			errors := v.Validate(character)
			if tt.shouldHaveError {
				assert.NotEmpty(t, errors, "Invalid ability score should produce error")
			}
		})
	}
}

func TestCharacterValidator_Validate_StringLengthLimits(t *testing.T) {
	v := validator.NewCharacterValidator()

	longString := make([]byte, 501)
	for i := range longString {
		longString[i] = 'a'
	}

	character := &models.Character{
		CharacterName: string(longString),
		Race:          "Human",
		Class:         "Fighter",
		Level:         5,
		AbilityScores: getValidAbilityScores(),
	}

	errors := v.Validate(character)
	assert.Contains(t, errors, "character name must be 500 characters or less")
}

func getValidAbilityScores() models.AbilityScores {
	return models.AbilityScores{
		Strength:     models.AbilityScore{Score: 10, Modifier: 0},
		Dexterity:    models.AbilityScore{Score: 10, Modifier: 0},
		Constitution: models.AbilityScore{Score: 10, Modifier: 0},
		Intelligence: models.AbilityScore{Score: 10, Modifier: 0},
		Wisdom:       models.AbilityScore{Score: 10, Modifier: 0},
		Charisma:     models.AbilityScore{Score: 10, Modifier: 0},
	}
}
