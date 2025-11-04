package mongo

import (
	"context"
	"time"

	"github.com/yourusername/dnd-character-creator/internal/logger"
	"github.com/yourusername/dnd-character-creator/internal/models"
	"github.com/yourusername/dnd-character-creator/internal/repository"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type characterRepository struct {
	collection *mongo.Collection
}

// NewCharacterRepository creates a new MongoDB character repository
func NewCharacterRepository(client *mongo.Client, database string) repository.CharacterRepository {
	collection := client.Database(database).Collection("characters")
	return &characterRepository{
		collection: collection,
	}
}

// FindAll retrieves all characters with optional filtering
func (r *characterRepository) FindAll(ctx context.Context, filter repository.CharacterFilter) ([]models.Character, error) {
	// Build MongoDB filter
	mongoFilter := bson.M{}

	if filter.Search != "" {
		mongoFilter["characterName"] = bson.M{"$regex": primitive.Regex{Pattern: filter.Search, Options: "i"}}
	}

	if filter.Class != "" {
		mongoFilter["class"] = filter.Class
	}

	if filter.Race != "" {
		mongoFilter["race"] = filter.Race
	}

	// Build sort options
	sortField := "characterName"
	sortOrder := 1 // ascending

	if filter.Sort != "" {
		sortField = filter.Sort
	}

	if filter.Order == "desc" {
		sortOrder = -1
	}

	opts := options.Find().SetSort(bson.D{{Key: sortField, Value: sortOrder}})

	cursor, err := r.collection.Find(ctx, mongoFilter, opts)
	if err != nil {
		logger.GetLogger().WithError(err).Error("Failed to find characters")
		return nil, err
	}
	defer cursor.Close(ctx)

	var characters []models.Character
	if err = cursor.All(ctx, &characters); err != nil {
		logger.GetLogger().WithError(err).Error("Failed to decode characters")
		return nil, err
	}

	if characters == nil {
		characters = []models.Character{}
	}

	return characters, nil
}

// FindByID retrieves a character by ID
func (r *characterRepository) FindByID(ctx context.Context, id string) (*models.Character, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		logger.GetLogger().WithError(err).Error("Invalid character ID")
		return nil, err
	}

	var character models.Character
	err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&character)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		logger.GetLogger().WithError(err).Error("Failed to find character by ID")
		return nil, err
	}

	return &character, nil
}

// Create creates a new character
func (r *characterRepository) Create(ctx context.Context, character *models.Character) error {
	character.CreatedAt = time.Now()
	character.UpdatedAt = time.Now()

	result, err := r.collection.InsertOne(ctx, character)
	if err != nil {
		logger.GetLogger().WithError(err).Error("Failed to create character")
		return err
	}

	// Set the ID on the character
	if oid, ok := result.InsertedID.(primitive.ObjectID); ok {
		character.ID = oid.Hex()
	}

	return nil
}

// Update updates an existing character
func (r *characterRepository) Update(ctx context.Context, id string, character *models.Character) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		logger.GetLogger().WithError(err).Error("Invalid character ID")
		return err
	}

	character.UpdatedAt = time.Now()
	character.ID = id

	update := bson.M{"$set": character}
	result, err := r.collection.UpdateOne(ctx, bson.M{"_id": objectID}, update)
	if err != nil {
		logger.GetLogger().WithError(err).Error("Failed to update character")
		return err
	}

	if result.MatchedCount == 0 {
		logger.GetLogger().Warn("No character found with given ID")
		return mongo.ErrNoDocuments
	}

	return nil
}

// Delete deletes a character by ID
func (r *characterRepository) Delete(ctx context.Context, id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		logger.GetLogger().WithError(err).Error("Invalid character ID")
		return err
	}

	result, err := r.collection.DeleteOne(ctx, bson.M{"_id": objectID})
	if err != nil {
		logger.GetLogger().WithError(err).Error("Failed to delete character")
		return err
	}

	if result.DeletedCount == 0 {
		logger.GetLogger().Warn("No character found with given ID")
		return mongo.ErrNoDocuments
	}

	return nil
}

// ExistsByName checks if a character with the given name exists
func (r *characterRepository) ExistsByName(ctx context.Context, name string, excludeID string) (bool, error) {
	filter := bson.M{"characterName": name}

	if excludeID != "" {
		objectID, err := primitive.ObjectIDFromHex(excludeID)
		if err == nil {
			filter["_id"] = bson.M{"$ne": objectID}
		}
	}

	count, err := r.collection.CountDocuments(ctx, filter)
	if err != nil {
		logger.GetLogger().WithError(err).Error("Failed to check character name existence")
		return false, err
	}

	return count > 0, nil
}
