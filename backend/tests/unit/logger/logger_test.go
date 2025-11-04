package logger_test

import (
	"testing"

	"github.com/sirupsen/logrus"
	"github.com/stretchr/testify/assert"
	"github.com/yourusername/dnd-character-creator/internal/logger"
)

func TestInit_JSONFormat(t *testing.T) {
	logger.Init("info", "json")

	log := logger.GetLogger()
	assert.NotNil(t, log)
	assert.Equal(t, logrus.InfoLevel, log.Level)
	_, ok := log.Formatter.(*logrus.JSONFormatter)
	assert.True(t, ok, "Expected JSONFormatter")
}

func TestInit_TextFormat(t *testing.T) {
	logger.Init("debug", "text")

	log := logger.GetLogger()
	assert.NotNil(t, log)
	assert.Equal(t, logrus.DebugLevel, log.Level)
	_, ok := log.Formatter.(*logrus.TextFormatter)
	assert.True(t, ok, "Expected TextFormatter")
}

func TestInit_InvalidLevel(t *testing.T) {
	logger.Init("invalid_level", "json")

	log := logger.GetLogger()
	assert.NotNil(t, log)
	assert.Equal(t, logrus.DebugLevel, log.Level, "Should default to debug level")
}

func TestGetLogger(t *testing.T) {
	log := logger.GetLogger()

	assert.NotNil(t, log)
}
