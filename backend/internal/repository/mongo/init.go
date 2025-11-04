package mongo

import (
	"context"

	"github.com/yourusername/dnd-character-creator/internal/logger"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// InitializeIndexes creates required indexes for the characters collection
func InitializeIndexes(client *mongo.Client, database string) error {
	collection := client.Database(database).Collection("characters")
	ctx := context.Background()

	// Create unique index on characterName
	uniqueIndexModel := mongo.IndexModel{
		Keys:    bson.D{{Key: "characterName", Value: 1}},
		Options: options.Index().SetUnique(true),
	}

	// Create index on class for faster filtering
	classIndexModel := mongo.IndexModel{
		Keys: bson.D{{Key: "class", Value: 1}},
	}

	// Create index on race for faster filtering
	raceIndexModel := mongo.IndexModel{
		Keys: bson.D{{Key: "race", Value: 1}},
	}

	// Create index on updatedAt for sorting
	updatedAtIndexModel := mongo.IndexModel{
		Keys: bson.D{{Key: "updatedAt", Value: -1}},
	}

	// Create all indexes
	indexes := []mongo.IndexModel{uniqueIndexModel, classIndexModel, raceIndexModel, updatedAtIndexModel}

	_, err := collection.Indexes().CreateMany(ctx, indexes)
	if err != nil {
		logger.GetLogger().WithError(err).Error("Failed to create indexes")
		return err
	}

	logger.GetLogger().Info("Successfully created database indexes")
	return nil
}
