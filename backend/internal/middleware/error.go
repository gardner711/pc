package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/yourusername/dnd-character-creator/internal/logger"
)

// ErrorResponse represents a standardized error response
type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
	Code    string `json:"code,omitempty"`
}

// ErrorHandler creates a middleware that handles panics and errors
func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				logger.GetLogger().WithField("error", err).Error("Panic recovered")

				c.JSON(http.StatusInternalServerError, ErrorResponse{
					Error:   "Internal Server Error",
					Message: "An unexpected error occurred",
					Code:    "INTERNAL_ERROR",
				})
			}
		}()

		c.Next()

		// Check for errors after request processing
		if len(c.Errors) > 0 {
			err := c.Errors.Last()
			logger.GetLogger().WithField("error", err.Err).Error("Request error")

			// Return the last error
			c.JSON(-1, ErrorResponse{
				Error:   err.Error(),
				Message: err.Err.Error(),
			})
		}
	}
}
