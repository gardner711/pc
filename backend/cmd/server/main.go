package main

import (
	"fmt"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/yourusername/dnd-character-creator/internal/config"
	"github.com/yourusername/dnd-character-creator/internal/handler"
	"github.com/yourusername/dnd-character-creator/internal/logger"
	"github.com/yourusername/dnd-character-creator/internal/middleware"
	"github.com/yourusername/dnd-character-creator/internal/repository/mongo"
	"github.com/yourusername/dnd-character-creator/internal/service"
)

// @title D&D 5e Character Creator API
// @version 1.0
// @description API for managing D&D 5e characters
// @host localhost:8080
// @BasePath /api/v1
func main() {
	// Load configuration
	cfg := config.Load()

	// Initialize logger
	logger.Init(cfg.Logging.Level, cfg.Logging.Format)
	log := logger.GetLogger()

	// Connect to MongoDB
	client, err := mongo.Connect(cfg.Database.URI, cfg.Database.Timeout)
	if err != nil {
		log.WithError(err).Fatal("Failed to connect to MongoDB")
		os.Exit(1)
	}
	defer func() {
		if err := mongo.Disconnect(client); err != nil {
			log.WithError(err).Error("Failed to disconnect from MongoDB")
		}
	}()

	// Initialize database indexes
	if err := mongo.InitializeIndexes(client, cfg.Database.Database); err != nil {
		log.WithError(err).Fatal("Failed to initialize database indexes")
		os.Exit(1)
	}

	// Initialize repositories
	characterRepo := mongo.NewCharacterRepository(client, cfg.Database.Database)

	// Initialize services
	characterService := service.NewCharacterService(characterRepo)

	// Initialize handlers
	healthHandler := handler.NewHealthHandler()
	characterHandler := handler.NewCharacterHandler(characterService)

	// Set Gin mode
	gin.SetMode(cfg.Server.GinMode)

	// Create router
	router := gin.New()

	// Add middleware
	router.Use(middleware.ErrorHandler())
	router.Use(middleware.Logging())
	router.Use(middleware.CORS(
		cfg.CORS.AllowedOrigins,
		cfg.CORS.AllowedMethods,
		cfg.CORS.AllowedHeaders,
	))

	// Health check endpoint
	router.GET("/health", healthHandler.Check)

	// API v1 routes
	v1 := router.Group("/api/v1")
	{
		// Character routes
		characters := v1.Group("/characters")
		{
			characters.GET("", characterHandler.GetAll)
			characters.GET("/:id", characterHandler.GetByID)
			characters.POST("", characterHandler.Create)
			characters.PUT("/:id", characterHandler.Update)
			characters.DELETE("/:id", characterHandler.Delete)
		}
	}

	// Start server
	addr := fmt.Sprintf(":%s", cfg.Server.Port)
	log.WithField("port", cfg.Server.Port).Info("Starting server")

	if err := router.Run(addr); err != nil {
		log.WithError(err).Fatal("Failed to start server")
		os.Exit(1)
	}
}
