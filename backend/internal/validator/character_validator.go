package validator

import (
	"fmt"
	"strings"

	"github.com/yourusername/dnd-character-creator/internal/models"
)

// CharacterValidator validates character data
type CharacterValidator struct{}

// NewCharacterValidator creates a new character validator
func NewCharacterValidator() *CharacterValidator {
	return &CharacterValidator{}
}

// Validate validates a character
func (v *CharacterValidator) Validate(character *models.Character) []string {
	var errors []string

	// Validate required fields
	if strings.TrimSpace(character.CharacterName) == "" {
		errors = append(errors, "character name is required")
	} else if len(character.CharacterName) > 500 {
		errors = append(errors, "character name must be 500 characters or less")
	}

	if strings.TrimSpace(character.Race) == "" {
		errors = append(errors, "race is required")
	} else if len(character.Race) > 500 {
		errors = append(errors, "race must be 500 characters or less")
	}

	if strings.TrimSpace(character.Class) == "" {
		errors = append(errors, "class is required")
	} else if len(character.Class) > 500 {
		errors = append(errors, "class must be 500 characters or less")
	}

	if character.Level < 1 || character.Level > 20 {
		errors = append(errors, "level must be between 1 and 20")
	}

	// Validate ability scores
	errors = append(errors, v.validateAbilityScores(&character.AbilityScores)...)

	// Validate optional fields
	if character.Background != "" && len(character.Background) > 500 {
		errors = append(errors, "background must be 500 characters or less")
	}

	if character.Alignment != "" && len(character.Alignment) > 500 {
		errors = append(errors, "alignment must be 500 characters or less")
	}

	if len(character.Multiclass) > 0 {
		for i, mc := range character.Multiclass {
			if mc.Class == "" {
				errors = append(errors, fmt.Sprintf("multiclass[%d].class is required", i))
			}
			if mc.Level < 1 || mc.Level > 20 {
				errors = append(errors, fmt.Sprintf("multiclass[%d].level must be between 1 and 20", i))
			}
		}
	}

	// Validate inventory
	if character.Inventory != nil {
		errors = append(errors, v.validateInventory(character.Inventory)...)
	}

	// Validate spellcasting
	if character.Spellcasting != nil {
		errors = append(errors, v.validateSpellcasting(character.Spellcasting)...)
	}

	// Validate features
	errors = append(errors, v.validateFeatures(character.Features)...)

	// Validate appearance
	if character.Appearance != nil {
		errors = append(errors, v.validateAppearance(character.Appearance)...)
	}

	return errors
}

func (v *CharacterValidator) validateAbilityScores(scores *models.AbilityScores) []string {
	var errors []string

	abilities := map[string]models.AbilityScore{
		"strength":     scores.Strength,
		"dexterity":    scores.Dexterity,
		"constitution": scores.Constitution,
		"intelligence": scores.Intelligence,
		"wisdom":       scores.Wisdom,
		"charisma":     scores.Charisma,
	}

	for name, abilityScore := range abilities {
		if abilityScore.Score < 1 || abilityScore.Score > 30 {
			errors = append(errors, fmt.Sprintf("%s must be between 1 and 30", name))
		}
	}

	return errors
}

func (v *CharacterValidator) validateInventory(inventory *models.Inventory) []string {
	var errors []string

	for i, item := range inventory.Equipment {
		if item.Name == "" {
			errors = append(errors, fmt.Sprintf("inventory.equipment[%d].name is required", i))
		} else if len(item.Name) > 500 {
			errors = append(errors, fmt.Sprintf("inventory.equipment[%d].name must be 500 characters or less", i))
		}

		if len(item.Description) > 500 {
			errors = append(errors, fmt.Sprintf("inventory.equipment[%d].description must be 500 characters or less", i))
		}

		if item.Quantity < 0 {
			errors = append(errors, fmt.Sprintf("inventory.equipment[%d].quantity cannot be negative", i))
		}
	}

	for i, weapon := range inventory.Weapons {
		if weapon.Name == "" {
			errors = append(errors, fmt.Sprintf("inventory.weapons[%d].name is required", i))
		} else if len(weapon.Name) > 500 {
			errors = append(errors, fmt.Sprintf("inventory.weapons[%d].name must be 500 characters or less", i))
		}

		if len(weapon.DamageType) > 500 {
			errors = append(errors, fmt.Sprintf("inventory.weapons[%d].damageType must be 500 characters or less", i))
		}
	}

	for i, armor := range inventory.Armor {
		if armor.Name == "" {
			errors = append(errors, fmt.Sprintf("inventory.armor[%d].name is required", i))
		} else if len(armor.Name) > 500 {
			errors = append(errors, fmt.Sprintf("inventory.armor[%d].name must be 500 characters or less", i))
		}

		if len(armor.Type) > 500 {
			errors = append(errors, fmt.Sprintf("inventory.armor[%d].type must be 500 characters or less", i))
		}
	}

	return errors
}

func (v *CharacterValidator) validateSpellcasting(spellcasting *models.Spellcasting) []string {
	var errors []string

	if spellcasting.SpellcastingAbility != "" && len(spellcasting.SpellcastingAbility) > 500 {
		errors = append(errors, "spellcasting.spellcastingAbility must be 500 characters or less")
	}

	// Validate cantrips
	for i, spell := range spellcasting.CantripsKnown {
		if len(spell) > 500 {
			errors = append(errors, fmt.Sprintf("spellcasting.cantripsKnown[%d] must be 500 characters or less", i))
		}
	}

	// Validate spells known
	for i, spell := range spellcasting.SpellsKnown {
		if len(spell) > 500 {
			errors = append(errors, fmt.Sprintf("spellcasting.spellsKnown[%d] must be 500 characters or less", i))
		}
	}

	// Validate prepared spells
	for i, spell := range spellcasting.PreparedSpells {
		if len(spell) > 500 {
			errors = append(errors, fmt.Sprintf("spellcasting.preparedSpells[%d] must be 500 characters or less", i))
		}
	}

	return errors
}

func (v *CharacterValidator) validateFeatures(features []models.Feature) []string {
	var errors []string

	for i, feature := range features {
		if feature.Name == "" {
			errors = append(errors, fmt.Sprintf("features[%d].name is required", i))
		} else if len(feature.Name) > 500 {
			errors = append(errors, fmt.Sprintf("features[%d].name must be 500 characters or less", i))
		}

		if len(feature.Description) > 500 {
			errors = append(errors, fmt.Sprintf("features[%d].description must be 500 characters or less", i))
		}

		if len(feature.Source) > 500 {
			errors = append(errors, fmt.Sprintf("features[%d].source must be 500 characters or less", i))
		}
	}

	return errors
}

func (v *CharacterValidator) validateAppearance(appearance *models.Appearance) []string {
	var errors []string

	if appearance.Age < 0 {
		errors = append(errors, "appearance.age cannot be negative")
	}

	if len(appearance.Height) > 500 {
		errors = append(errors, "appearance.height must be 500 characters or less")
	}

	if len(appearance.Weight) > 500 {
		errors = append(errors, "appearance.weight must be 500 characters or less")
	}

	if len(appearance.Eyes) > 500 {
		errors = append(errors, "appearance.eyes must be 500 characters or less")
	}

	if len(appearance.Skin) > 500 {
		errors = append(errors, "appearance.skin must be 500 characters or less")
	}

	if len(appearance.Hair) > 500 {
		errors = append(errors, "appearance.hair must be 500 characters or less")
	}

	return errors
}
