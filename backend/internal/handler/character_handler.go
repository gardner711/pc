package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/yourusername/dnd-character-creator/internal/logger"
	"github.com/yourusername/dnd-character-creator/internal/models"
	"github.com/yourusername/dnd-character-creator/internal/repository"
	"github.com/yourusername/dnd-character-creator/internal/service"
)

// CharacterHandler handles character HTTP requests
type CharacterHandler struct {
	service *service.CharacterService
}

// NewCharacterHandler creates a new character handler
func NewCharacterHandler(service *service.CharacterService) *CharacterHandler {
	return &CharacterHandler{
		service: service,
	}
}

// GetAll handles GET /api/v1/characters
func (h *CharacterHandler) GetAll(c *gin.Context) {
	// Parse query parameters
	filter := repository.CharacterFilter{
		Search: c.Query("search"),
		Class:  c.Query("class"),
		Race:   c.Query("race"),
		Sort:   c.DefaultQuery("sort", "characterName"),
		Order:  c.DefaultQuery("order", "asc"),
	}

	characters, err := h.service.GetAll(c.Request.Context(), filter)
	if err != nil {
		logger.GetLogger().WithError(err).Error("Failed to get characters")
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch characters",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": characters,
	})
}

// GetByID handles GET /api/v1/characters/:id
func (h *CharacterHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	character, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		logger.GetLogger().WithError(err).Error("Failed to get character")
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch character",
		})
		return
	}

	if character == nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Character not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": character,
	})
}

// Create handles POST /api/v1/characters
func (h *CharacterHandler) Create(c *gin.Context) {
	var character models.Character

	if err := c.ShouldBindJSON(&character); err != nil {
		logger.GetLogger().WithError(err).Error("Failed to bind character")
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	createdCharacter, err := h.service.Create(c.Request.Context(), &character)
	if err != nil {
		logger.GetLogger().WithError(err).Error("Failed to create character")

		// Check for validation or duplicate name errors
		if err.Error() == "character name already exists" {
			c.JSON(http.StatusConflict, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"data": createdCharacter,
	})
}

// Update handles PUT /api/v1/characters/:id
func (h *CharacterHandler) Update(c *gin.Context) {
	id := c.Param("id")

	var character models.Character
	if err := c.ShouldBindJSON(&character); err != nil {
		logger.GetLogger().WithError(err).Error("Failed to bind character")
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	updatedCharacter, err := h.service.Update(c.Request.Context(), id, &character)
	if err != nil {
		logger.GetLogger().WithError(err).Error("Failed to update character")

		// Check for not found error
		if err.Error() == "character not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"error": err.Error(),
			})
			return
		}

		// Check for validation or duplicate name errors
		if err.Error() == "character name already exists" {
			c.JSON(http.StatusConflict, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": updatedCharacter,
	})
}

// Delete handles DELETE /api/v1/characters/:id
func (h *CharacterHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	err := h.service.Delete(c.Request.Context(), id)
	if err != nil {
		logger.GetLogger().WithError(err).Error("Failed to delete character")

		if err.Error() == "character not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to delete character",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Character deleted successfully",
	})
}
