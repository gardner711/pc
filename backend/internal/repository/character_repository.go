package repository

import (
	"context"

	"github.com/yourusername/dnd-character-creator/internal/models"
)

// CharacterRepository defines the interface for character data access
type CharacterRepository interface {
	// FindAll retrieves all characters with optional filtering
	FindAll(ctx context.Context, filter CharacterFilter) ([]models.Character, error)

	// FindByID retrieves a character by ID
	FindByID(ctx context.Context, id string) (*models.Character, error)

	// Create creates a new character
	Create(ctx context.Context, character *models.Character) error

	// Update updates an existing character
	Update(ctx context.Context, id string, character *models.Character) error

	// Delete deletes a character by ID
	Delete(ctx context.Context, id string) error

	// ExistsByName checks if a character with the given name exists
	ExistsByName(ctx context.Context, name string, excludeID string) (bool, error)
}

// CharacterFilter holds filtering criteria for character queries
type CharacterFilter struct {
	Search string
	Class  string
	Race   string
	Sort   string
	Order  string
}
