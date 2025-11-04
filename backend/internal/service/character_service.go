package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/yourusername/dnd-character-creator/internal/logger"
	"github.com/yourusername/dnd-character-creator/internal/models"
	"github.com/yourusername/dnd-character-creator/internal/repository"
	"github.com/yourusername/dnd-character-creator/internal/validator"
	"go.mongodb.org/mongo-driver/mongo"
)

// CharacterService handles business logic for characters
type CharacterService struct {
	repo      repository.CharacterRepository
	validator *validator.CharacterValidator
}

// NewCharacterService creates a new character service
func NewCharacterService(repo repository.CharacterRepository) *CharacterService {
	return &CharacterService{
		repo:      repo,
		validator: validator.NewCharacterValidator(),
	}
}

// GetAll retrieves all characters with optional filtering
func (s *CharacterService) GetAll(ctx context.Context, filter repository.CharacterFilter) ([]models.Character, error) {
	logger.GetLogger().Info("Fetching characters with filter")

	characters, err := s.repo.FindAll(ctx, filter)
	if err != nil {
		logger.GetLogger().WithError(err).Error("Failed to fetch characters")
		return nil, fmt.Errorf("failed to fetch characters: %w", err)
	}

	logger.GetLogger().Infof("Found %d characters", len(characters))
	return characters, nil
}

// GetByID retrieves a character by ID
func (s *CharacterService) GetByID(ctx context.Context, id string) (*models.Character, error) {
	logger.GetLogger().Infof("Fetching character with ID: %s", id)

	character, err := s.repo.FindByID(ctx, id)
	if err != nil {
		logger.GetLogger().WithError(err).Error("Failed to fetch character")
		return nil, fmt.Errorf("failed to fetch character: %w", err)
	}

	if character == nil {
		logger.GetLogger().Warnf("Character not found with ID: %s", id)
		return nil, nil
	}

	return character, nil
}

// Create creates a new character
func (s *CharacterService) Create(ctx context.Context, character *models.Character) (*models.Character, error) {
	logger.GetLogger().Infof("Creating new character: %s", character.CharacterName)

	// Validate character data
	validationErrors := s.validator.Validate(character)
	if len(validationErrors) > 0 {
		logger.GetLogger().Warnf("Validation errors for character: %v", validationErrors)
		return nil, fmt.Errorf("validation errors: %v", validationErrors)
	}

	// Check if character name already exists
	exists, err := s.repo.ExistsByName(ctx, character.CharacterName, "")
	if err != nil {
		logger.GetLogger().WithError(err).Error("Failed to check character name existence")
		return nil, fmt.Errorf("failed to check character name: %w", err)
	}

	if exists {
		logger.GetLogger().Warnf("Character name already exists: %s", character.CharacterName)
		return nil, errors.New("character name already exists")
	}

	// Calculate ability modifiers
	s.calculateAbilityModifiers(&character.AbilityScores)

	// Create character
	err = s.repo.Create(ctx, character)
	if err != nil {
		logger.GetLogger().WithError(err).Error("Failed to create character")
		return nil, fmt.Errorf("failed to create character: %w", err)
	}

	logger.GetLogger().Infof("Successfully created character: %s", character.CharacterName)
	return character, nil
}

// Update updates an existing character
func (s *CharacterService) Update(ctx context.Context, id string, character *models.Character) (*models.Character, error) {
	logger.GetLogger().Infof("Updating character with ID: %s", id)

	// Check if character exists
	existing, err := s.repo.FindByID(ctx, id)
	if err != nil {
		logger.GetLogger().WithError(err).Error("Failed to fetch existing character")
		return nil, fmt.Errorf("failed to fetch character: %w", err)
	}

	if existing == nil {
		logger.GetLogger().Warnf("Character not found with ID: %s", id)
		return nil, errors.New("character not found")
	}

	// Validate character data
	validationErrors := s.validator.Validate(character)
	if len(validationErrors) > 0 {
		logger.GetLogger().Warnf("Validation errors for character: %v", validationErrors)
		return nil, fmt.Errorf("validation errors: %v", validationErrors)
	}

	// Check if new name conflicts with existing character
	if character.CharacterName != existing.CharacterName {
		exists, err := s.repo.ExistsByName(ctx, character.CharacterName, id)
		if err != nil {
			logger.GetLogger().WithError(err).Error("Failed to check character name existence")
			return nil, fmt.Errorf("failed to check character name: %w", err)
		}

		if exists {
			logger.GetLogger().Warnf("Character name already exists: %s", character.CharacterName)
			return nil, errors.New("character name already exists")
		}
	}

	// Calculate ability modifiers
	s.calculateAbilityModifiers(&character.AbilityScores)

	// Preserve creation timestamp
	character.CreatedAt = existing.CreatedAt

	// Update character
	err = s.repo.Update(ctx, id, character)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			logger.GetLogger().Warnf("Character not found with ID: %s", id)
			return nil, errors.New("character not found")
		}
		logger.GetLogger().WithError(err).Error("Failed to update character")
		return nil, fmt.Errorf("failed to update character: %w", err)
	}

	logger.GetLogger().Infof("Successfully updated character: %s", character.CharacterName)
	return character, nil
}

// Delete deletes a character by ID
func (s *CharacterService) Delete(ctx context.Context, id string) error {
	logger.GetLogger().Infof("Deleting character with ID: %s", id)

	err := s.repo.Delete(ctx, id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			logger.GetLogger().Warnf("Character not found with ID: %s", id)
			return errors.New("character not found")
		}
		logger.GetLogger().WithError(err).Error("Failed to delete character")
		return fmt.Errorf("failed to delete character: %w", err)
	}

	logger.GetLogger().Infof("Successfully deleted character with ID: %s", id)
	return nil
}

// calculateAbilityModifiers calculates the modifiers for all ability scores
func (s *CharacterService) calculateAbilityModifiers(scores *models.AbilityScores) {
	scores.Strength.Modifier = calculateModifier(scores.Strength.Score)
	scores.Dexterity.Modifier = calculateModifier(scores.Dexterity.Score)
	scores.Constitution.Modifier = calculateModifier(scores.Constitution.Score)
	scores.Intelligence.Modifier = calculateModifier(scores.Intelligence.Score)
	scores.Wisdom.Modifier = calculateModifier(scores.Wisdom.Score)
	scores.Charisma.Modifier = calculateModifier(scores.Charisma.Score)
}

// calculateModifier calculates the modifier for an ability score
func calculateModifier(score int) int {
	return (score - 10) / 2
}
