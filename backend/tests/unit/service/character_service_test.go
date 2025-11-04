package service_test

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/yourusername/dnd-character-creator/internal/models"
	"github.com/yourusername/dnd-character-creator/internal/repository"
	"github.com/yourusername/dnd-character-creator/internal/service"
)

// MockCharacterRepository mocks the repository
type MockCharacterRepository struct {
	mock.Mock
}

func (m *MockCharacterRepository) FindAll(ctx context.Context, filter repository.CharacterFilter) ([]models.Character, error) {
	args := m.Called(ctx, filter)
	return args.Get(0).([]models.Character), args.Error(1)
}

func (m *MockCharacterRepository) FindByID(ctx context.Context, id string) (*models.Character, error) {
	args := m.Called(ctx, id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.Character), args.Error(1)
}

func (m *MockCharacterRepository) Create(ctx context.Context, character *models.Character) error {
	args := m.Called(ctx, character)
	return args.Error(0)
}

func (m *MockCharacterRepository) Update(ctx context.Context, id string, character *models.Character) error {
	args := m.Called(ctx, id, character)
	return args.Error(0)
}

func (m *MockCharacterRepository) Delete(ctx context.Context, id string) error {
	args := m.Called(ctx, id)
	return args.Error(0)
}

func (m *MockCharacterRepository) ExistsByName(ctx context.Context, name string, excludeID string) (bool, error) {
	args := m.Called(ctx, name, excludeID)
	return args.Bool(0), args.Error(1)
}

func TestCharacterService_GetAll_Success(t *testing.T) {
	mockRepo := new(MockCharacterRepository)
	svc := service.NewCharacterService(mockRepo)

	expectedCharacters := []models.Character{
		{ID: "507f1f77bcf86cd799439011", CharacterName: "Test1"},
		{ID: "507f1f77bcf86cd799439012", CharacterName: "Test2"},
	}

	filter := repository.CharacterFilter{Class: "Fighter"}
	mockRepo.On("FindAll", mock.Anything, filter).Return(expectedCharacters, nil)

	characters, err := svc.GetAll(context.Background(), filter)

	assert.NoError(t, err)
	assert.Equal(t, expectedCharacters, characters)
	mockRepo.AssertExpectations(t)
}

func TestCharacterService_GetByID_Success(t *testing.T) {
	mockRepo := new(MockCharacterRepository)
	svc := service.NewCharacterService(mockRepo)

	id := "507f1f77bcf86cd799439011"
	expectedCharacter := &models.Character{
		ID:            id,
		CharacterName: "Test Character",
	}

	mockRepo.On("FindByID", mock.Anything, id).Return(expectedCharacter, nil)

	character, err := svc.GetByID(context.Background(), id)

	assert.NoError(t, err)
	assert.Equal(t, expectedCharacter, character)
	mockRepo.AssertExpectations(t)
}

func TestCharacterService_Create_Success(t *testing.T) {
	mockRepo := new(MockCharacterRepository)
	svc := service.NewCharacterService(mockRepo)

	character := &models.Character{
		CharacterName: "New Character",
		Race:          "Human",
		Class:         "Fighter",
		Level:         1,
		AbilityScores: models.AbilityScores{
			Strength:     models.AbilityScore{Score: 16},
			Dexterity:    models.AbilityScore{Score: 14},
			Constitution: models.AbilityScore{Score: 13},
			Intelligence: models.AbilityScore{Score: 12},
			Wisdom:       models.AbilityScore{Score: 10},
			Charisma:     models.AbilityScore{Score: 8},
		},
	}

	mockRepo.On("ExistsByName", mock.Anything, "New Character", "").Return(false, nil)
	mockRepo.On("Create", mock.Anything, character).Return(nil)

	result, err := svc.Create(context.Background(), character)

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, 3, result.AbilityScores.Strength.Modifier) // (16-10)/2 = 3
	mockRepo.AssertExpectations(t)
}

func TestCharacterService_Create_DuplicateName(t *testing.T) {
	mockRepo := new(MockCharacterRepository)
	svc := service.NewCharacterService(mockRepo)

	character := &models.Character{
		CharacterName: "Duplicate",
		Race:          "Human",
		Class:         "Fighter",
		Level:         1,
		AbilityScores: getValidAbilityScores(),
	}

	mockRepo.On("ExistsByName", mock.Anything, "Duplicate", "").Return(true, nil)

	result, err := svc.Create(context.Background(), character)

	assert.Error(t, err)
	assert.Nil(t, result)
	assert.Contains(t, err.Error(), "character name already exists")
	mockRepo.AssertExpectations(t)
	mockRepo.AssertNotCalled(t, "Create")
}

func TestCharacterService_Update_Success(t *testing.T) {
	mockRepo := new(MockCharacterRepository)
	svc := service.NewCharacterService(mockRepo)

	id := "507f1f77bcf86cd799439011"
	existing := &models.Character{
		ID:            id,
		CharacterName: "Old Name",
	}

	character := &models.Character{
		CharacterName: "Updated Character",
		Race:          "Elf",
		Class:         "Wizard",
		Level:         5,
		AbilityScores: models.AbilityScores{
			Strength:     models.AbilityScore{Score: 10},
			Dexterity:    models.AbilityScore{Score: 14},
			Constitution: models.AbilityScore{Score: 12},
			Intelligence: models.AbilityScore{Score: 18},
			Wisdom:       models.AbilityScore{Score: 13},
			Charisma:     models.AbilityScore{Score: 8},
		},
	}

	mockRepo.On("FindByID", mock.Anything, id).Return(existing, nil)
	mockRepo.On("ExistsByName", mock.Anything, "Updated Character", id).Return(false, nil)
	mockRepo.On("Update", mock.Anything, id, character).Return(nil)

	result, err := svc.Update(context.Background(), id, character)

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, 4, result.AbilityScores.Intelligence.Modifier) // (18-10)/2 = 4
	mockRepo.AssertExpectations(t)
}

func TestCharacterService_Delete_Success(t *testing.T) {
	mockRepo := new(MockCharacterRepository)
	svc := service.NewCharacterService(mockRepo)

	id := "507f1f77bcf86cd799439011"
	mockRepo.On("Delete", mock.Anything, id).Return(nil)

	err := svc.Delete(context.Background(), id)

	assert.NoError(t, err)
	mockRepo.AssertExpectations(t)
}

func TestCharacterService_AbilityModifierCalculation(t *testing.T) {
	tests := []struct {
		score    int
		modifier int
	}{
		{1, -4},  // (1-10)/2 = -4
		{2, -4},  // (2-10)/2 = -4
		{3, -3},  // (3-10)/2 = -3
		{8, -1},  // (8-10)/2 = -1
		{10, 0},  // (10-10)/2 = 0
		{11, 0},  // (11-10)/2 = 0
		{12, 1},  // (12-10)/2 = 1
		{16, 3},  // (16-10)/2 = 3
		{20, 5},  // (20-10)/2 = 5
		{30, 10}, // (30-10)/2 = 10
	}

	for _, tt := range tests {
		mockRepo := new(MockCharacterRepository)
		svc := service.NewCharacterService(mockRepo)

		character := &models.Character{
			CharacterName: "Test",
			Race:          "Human",
			Class:         "Fighter",
			Level:         1,
			AbilityScores: models.AbilityScores{
				Strength:     models.AbilityScore{Score: tt.score},
				Dexterity:    models.AbilityScore{Score: 10},
				Constitution: models.AbilityScore{Score: 10},
				Intelligence: models.AbilityScore{Score: 10},
				Wisdom:       models.AbilityScore{Score: 10},
				Charisma:     models.AbilityScore{Score: 10},
			},
		}

		mockRepo.On("ExistsByName", mock.Anything, "Test", "").Return(false, nil)
		mockRepo.On("Create", mock.Anything, character).Return(nil)

		result, err := svc.Create(context.Background(), character)

		assert.NoError(t, err)
		assert.Equal(t, tt.modifier, result.AbilityScores.Strength.Modifier,
			"Score %d should have modifier %d", tt.score, tt.modifier)
	}
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
