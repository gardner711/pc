package config_test

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/yourusername/dnd-character-creator/internal/config"
)

func TestLoad_DefaultValues(t *testing.T) {
	// Clear environment variables
	os.Clearenv()

	cfg := config.Load()

	assert.Equal(t, "8080", cfg.Server.Port)
	assert.Equal(t, "debug", cfg.Server.GinMode)
	assert.Equal(t, "mongodb://localhost:27017/pc_db", cfg.Database.URI)
	assert.Equal(t, "pc_db", cfg.Database.Database)
	assert.Equal(t, "debug", cfg.Logging.Level)
	assert.Equal(t, "json", cfg.Logging.Format)
	assert.Equal(t, 500, cfg.App.MaxStringLength)
}

func TestLoad_CustomValues(t *testing.T) {
	os.Setenv("PORT", "9090")
	os.Setenv("GIN_MODE", "release")
	os.Setenv("MONGODB_URI", "mongodb://testhost:27017/testdb")
	os.Setenv("MONGODB_DATABASE", "testdb")
	os.Setenv("LOG_LEVEL", "info")
	os.Setenv("LOG_FORMAT", "text")
	os.Setenv("MAX_STRING_LENGTH", "1000")
	defer os.Clearenv()

	cfg := config.Load()

	assert.Equal(t, "9090", cfg.Server.Port)
	assert.Equal(t, "release", cfg.Server.GinMode)
	assert.Equal(t, "mongodb://testhost:27017/testdb", cfg.Database.URI)
	assert.Equal(t, "testdb", cfg.Database.Database)
	assert.Equal(t, "info", cfg.Logging.Level)
	assert.Equal(t, "text", cfg.Logging.Format)
	assert.Equal(t, 1000, cfg.App.MaxStringLength)
}

func TestLoad_CORSConfiguration(t *testing.T) {
	os.Setenv("CORS_ALLOWED_ORIGINS", "http://example.com,https://example.org")
	os.Setenv("CORS_ALLOWED_METHODS", "GET,POST")
	defer os.Clearenv()

	cfg := config.Load()

	assert.Equal(t, []string{"http://example.com", "https://example.org"}, cfg.CORS.AllowedOrigins)
	assert.Equal(t, []string{"GET", "POST"}, cfg.CORS.AllowedMethods)
}

// Note: Helper functions are private, tested indirectly through Load()
