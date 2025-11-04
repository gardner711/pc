package mongo

import (
	"context"
	"time"

	"github.com/yourusername/dnd-character-creator/internal/logger"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Connect establishes a connection to MongoDB
func Connect(uri string, timeout time.Duration) (*mongo.Client, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	clientOptions := options.Client().ApplyURI(uri)

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		logger.GetLogger().WithError(err).Error("Failed to connect to MongoDB")
		return nil, err
	}

	// Ping the database to verify connection
	err = client.Ping(ctx, nil)
	if err != nil {
		logger.GetLogger().WithError(err).Error("Failed to ping MongoDB")
		return nil, err
	}

	logger.GetLogger().Info("Successfully connected to MongoDB")
	return client, nil
}

// Disconnect closes the MongoDB connection
func Disconnect(client *mongo.Client) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := client.Disconnect(ctx); err != nil {
		logger.GetLogger().WithError(err).Error("Failed to disconnect from MongoDB")
		return err
	}

	logger.GetLogger().Info("Disconnected from MongoDB")
	return nil
}
