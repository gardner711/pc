package logger

import (
	"os"

	"github.com/sirupsen/logrus"
)

var Log *logrus.Logger

// Init initializes the logger with the specified level and format
func Init(level, format string) {
	Log = logrus.New()

	// Set log level
	logLevel, err := logrus.ParseLevel(level)
	if err != nil {
		logLevel = logrus.DebugLevel
	}
	Log.SetLevel(logLevel)

	// Set log format
	if format == "json" {
		Log.SetFormatter(&logrus.JSONFormatter{})
	} else {
		Log.SetFormatter(&logrus.TextFormatter{
			FullTimestamp: true,
		})
	}

	Log.SetOutput(os.Stdout)
}

// GetLogger returns the logger instance
func GetLogger() *logrus.Logger {
	if Log == nil {
		Init("debug", "json")
	}
	return Log
}
